import dataclasses
import re
from pathlib import Path
from typing import OrderedDict, Any, List, Union, Dict, Optional, Set
import logging

# noinspection PyPackageRequirements
from lxml import objectify

# noinspection PyPackageRequirements
from lxml.objectify import ObjectifiedElement


@dataclasses.dataclass
class SmartName:
    name: str
    cleaned_name: str
    snake_case_name: str


@dataclasses.dataclass
class FhirValueSetConcept:
    code: str
    display: Optional[str]
    cleaned_display: Optional[str]
    definition: Optional[str]
    source: str
    value_set_url: str


@dataclasses.dataclass
class FhirValueSet:
    id_: str
    name: str
    fhir_name: str
    name_snake_case: str
    cleaned_name: str
    concepts: List[FhirValueSetConcept]
    url: str
    value_set_url: str
    value_set_url_list: Set[str]
    documentation: List[str]
    source: str


@dataclasses.dataclass
class FhirCodeableType:
    codeable_type: str
    path: str
    codeable_type_url: str
    is_codeable_concept: bool = False


@dataclasses.dataclass
class FhirReferenceType:
    target_resources: List[str]
    path: str


@dataclasses.dataclass
class FhirProperty:
    name: str
    fhir_name: str
    type_: str
    cleaned_type: str
    type_snake_case: str
    optional: bool
    is_list: bool
    documentation: List[str]
    fhir_type: Optional[str]
    reference_target_resources: List[SmartName]
    reference_target_resources_names: List[str]
    is_back_bone_element: bool
    is_basic_type: bool
    codeable_type: Optional[SmartName]
    is_resource: bool = False
    is_extension: bool = False
    is_code: bool = False


@dataclasses.dataclass
class FhirEntity:
    fhir_name: str
    cleaned_name: str
    name_snake_case: str
    properties: List[FhirProperty]
    documentation: List[str]
    type_: Optional[str]
    is_back_bone_element: bool
    base_type: Optional[str]
    base_type_list: List[str]
    source: str
    is_value_set: bool = False
    value_set_concepts: Optional[List[FhirValueSetConcept]] = None
    value_set_url: Optional[str] = None
    is_basic_type: bool = False
    value_set_url_list: Optional[Set[str]] = None
    is_resource: bool = False
    is_extension: bool = False


logging.basicConfig(
    format="[%(filename)s:%(lineno)d] %(message)s",
    datefmt="%Y-%m-%d:%H:%M:%S",
    level=logging.DEBUG,
)
logger = logging.getLogger(__name__)


class FhirXmlSchemaParser:
    cleaned_type_mapping: Dict[str, str] = {
        "boolean": "FhirBoolean",
        "date": "FhirDate",
        "dateTime": "FhirDateTime",
        "time": "FhirTime",
        "instant": "FhirInstant",
        "integer": "FhirInteger",
        "positiveInt": "FhirPositiveInt",
        "decimal": "FhirDecimal",
        "string": "FhirString",
        "DataType": "FhirDataType",
        "markdown": "FhirMarkdown",
        "canonical": "FhirCanonical",
        "List": "List_",
        "uri": "FhirUri",
        "url": "FhirUrl",
        "id": "FhirId",
        "base64Binary": "FhirBase64Binary",
        "unsignedInt": "FhirUnsignedInt",
        "uuid": "FhirUuid",
        "oid": "FhirOid",
    }

    @staticmethod
    def camel_to_snake(name: str) -> str:
        name = re.sub("(.)([A-Z][a-z]+)", r"\1_\2", name)
        return re.sub("([a-z0-9])([A-Z])", r"\1_\2", name).lower()

    @staticmethod
    def generate_classes(filter_to_resource: Optional[str] = None) -> List[FhirEntity]:
        data_dir: Path = Path(__file__).parent.joinpath("./")
        # schema = XMLSchema(str(resource_xsd_file))
        # pprint(schema.to_dict)
        fhir_entities: List[FhirEntity] = []

        # first read fhir-all.xsd to get a list of resources
        fhir_xsd_all_file: Path = (
            data_dir.joinpath("xsd")
            .joinpath("definitions.xml")
            .joinpath("fhir-all-xsd")
            .joinpath("fhir-all.xsd")
        )
        resources: List[str] = ["fhir-base.xsd"]

        with open(fhir_xsd_all_file, "rb") as file:
            contents = file.read()
            root: ObjectifiedElement = objectify.fromstring(contents)
            resource_item: ObjectifiedElement
            for resource_item in root["include"]:
                resources.append(resource_item.get("schemaLocation"))

        resource_xsd_file_name: str
        for resource_xsd_file_name in resources:
            if (
                filter_to_resource
                and not resource_xsd_file_name.startswith(filter_to_resource)
                and not resource_xsd_file_name == "fhir-base.xsd"
            ):
                continue
            resource_xsd_file: Path = (
                data_dir.joinpath("xsd")
                .joinpath("definitions.xml")
                .joinpath("fhir-all-xsd")
                .joinpath(resource_xsd_file_name)
            )
            fhir_entities.extend(
                FhirXmlSchemaParser._generate_classes_for_resource(resource_xsd_file)
            )

        for fhir_entity in fhir_entities:
            logger.info(f"2nd pass: setting flags on {fhir_entity.fhir_name}")
            if fhir_entity.fhir_name == "Resource":
                fhir_entity.is_resource = True
            if fhir_entity.fhir_name == "Extension":
                fhir_entity.is_extension = True

        # now set the types in each property
        property_type_mapping: Dict[str, FhirEntity] = {
            fhir_entity.fhir_name: fhir_entity
            for fhir_entity in fhir_entities
            if fhir_entity.type_
        }

        for fhir_entity in fhir_entities:
            logger.info(f"3rd pass: setting property types on {fhir_entity.fhir_name}")
            # set types on properties that are not set
            for fhir_property in fhir_entity.properties:
                logger.info(f"---- {fhir_property.name}: {fhir_property.type_} ----")
                if fhir_property.type_ not in property_type_mapping.keys():
                    logger.warning(
                        f"WARNING: 2nd pass: {fhir_property.type_} not found in property_type_mapping"
                    )
                else:
                    property_fhir_entity: FhirEntity = property_type_mapping[
                        fhir_property.type_
                    ]
                    fhir_property.fhir_type = property_fhir_entity.type_
                    fhir_property.is_resource = property_fhir_entity.is_resource
                    fhir_property.is_extension = property_fhir_entity.is_extension

        for fhir_entity in fhir_entities:
            logger.info(
                f"4th pass: inheriting properties from base {fhir_entity.fhir_name}"
            )
            # add properties from base_types
            if fhir_entity.base_type:
                fhir_base_entity = [
                    c for c in fhir_entities if c.fhir_name == fhir_entity.base_type
                ]
                if not fhir_base_entity:
                    logger.warning(
                        f"WARNING: base type {fhir_entity.base_type} not found"
                    )
                else:
                    fhir_entity.properties = (
                        fhir_base_entity[0].properties + fhir_entity.properties
                    )
                    # add the base class
                    fhir_entity.base_type_list.append(fhir_base_entity[0].fhir_name)
                    # and any base classes of the base class
                    fhir_entity.base_type_list.extend(
                        fhir_base_entity[0].base_type_list
                    )
                    if "Resource" in fhir_entity.base_type_list:
                        fhir_entity.is_resource = True

        # and the target resources for references
        FhirXmlSchemaParser.process_types_for_references(fhir_entities)

        value_sets: List[FhirValueSet] = FhirXmlSchemaParser.get_value_sets()

        # and the target types for codeable concepts
        FhirXmlSchemaParser.process_types_for_codeable_concepts(
            fhir_entities, value_sets
        )

        # value_set: FhirValueSet
        # for value_set in value_sets:
        #     for fhir_entity in fhir_entities:
        #         if value_set.name == fhir_entity.fhir_name:
        #             fhir_entity.is_value_set = True

        # remove any entities that are already in value_sets
        fhir_entities = [
            c
            for c in fhir_entities
            if c.fhir_name not in [b.name for b in value_sets]
            or c.cleaned_name in ["PractitionerRole", "ElementDefinition"]
        ]
        fhir_entities.extend(
            [
                FhirEntity(
                    type_="ValueSet",
                    fhir_name=c.fhir_name,
                    name_snake_case=c.name_snake_case,
                    cleaned_name=c.cleaned_name,
                    documentation=c.documentation,
                    properties=[],
                    is_back_bone_element=False,
                    is_value_set=True,
                    value_set_concepts=c.concepts,
                    value_set_url_list=c.value_set_url_list,
                    value_set_url=c.url,
                    source=c.source,
                    base_type=None,
                    base_type_list=[],
                )
                for c in value_sets
            ]
        )

        # update types
        # cleaned_type_mapping: Dict[str, str] = {
        #     "boolean": "FhirBoolean",
        #     "date": "FhirDate",
        #     "dateTime": "FhirDateTime",
        #     "integer": "FhirInteger",
        #     "string": "FhirString",
        # }
        # for fhir_entity in fhir_entities:
        #     if fhir_entity.fhir_name in cleaned_type_mapping.keys():
        #         fhir_entity.fhir_name = cleaned_type_mapping[fhir_entity.fhir_name]

        exclude_entities: List[str] = [
            # "Resource",
            # "DomainResource",
            # "Element",
        ]

        fhir_entities = [
            f for f in fhir_entities if f.cleaned_name not in exclude_entities
        ]

        # cleaned names
        for fhir_entity in fhir_entities:
            if fhir_entity.fhir_name in FhirXmlSchemaParser.cleaned_type_mapping:
                fhir_entity.cleaned_name = FhirXmlSchemaParser.cleaned_type_mapping[
                    fhir_entity.fhir_name
                ]
                fhir_entity.is_basic_type = True

        # replace any lists
        value_set_names: List[str] = [c.name for c in value_sets]
        for fhir_entity in fhir_entities:
            for fhir_property in fhir_entity.properties:
                if not fhir_property.is_code and fhir_property.type_ in value_set_names:
                    fhir_property.is_code = True
                    fhir_property.cleaned_type = [
                        c.cleaned_name
                        for c in value_sets
                        if c.name == fhir_property.type_
                    ][0]

        # find all codeable concepts that are not mapped

        return fhir_entities

    @staticmethod
    def process_types_for_codeable_concepts(
        fhir_entities: List[FhirEntity], value_sets: List[FhirValueSet]
    ) -> None:
        codeable_types: List[
            FhirCodeableType
        ] = FhirXmlSchemaParser.get_types_for_codeable_concepts()
        codeable_type: FhirCodeableType
        for codeable_type in codeable_types:
            name_parts: List[str] = codeable_type.path.split(".")
            # find the entity corresponding to the name parts
            entity_name_parts: List[str] = name_parts[0:-1]
            fhir_entity_list: List[FhirEntity] = []
            parent_fhir_entity: Optional[FhirEntity] = None
            # parent_entity_name: Optional[str] = None
            for entity_name_part in entity_name_parts:
                if not parent_fhir_entity:
                    # entity_name = entity_name_part
                    fhir_entity_list = [
                        f for f in fhir_entities if f.fhir_name == entity_name_part
                    ]
                    if not fhir_entity_list:
                        logger.warning(
                            f"WARNING: {entity_name_part} not found in fhir_entity_list"
                        )
                    else:
                        parent_fhir_entity = fhir_entity_list[0]
                else:
                    # find the property under the above entity
                    fhir_property_list = [
                        p
                        for p in parent_fhir_entity.properties
                        if p.name
                        == FhirXmlSchemaParser.fix_python_keywords(entity_name_part)
                        or (
                            entity_name_part.endswith("[x]")
                            and p.name
                            == FhirXmlSchemaParser.fix_python_keywords(
                                entity_name_part.replace("[x]", "") + "CodeableConcept"
                            )
                        )
                    ]
                    if not fhir_property_list:
                        logger.warning(
                            f"WARNING: {entity_name_part} not found in properties of {parent_fhir_entity.fhir_name}"
                        )
                    else:
                        fhir_property = fhir_property_list[0]
                        parent_entity_name = fhir_property.cleaned_type
                        fhir_entity_list = [
                            f
                            for f in fhir_entities
                            if f.cleaned_name == parent_entity_name
                        ]
                        if not fhir_entity_list:
                            logger.warning(
                                f"WARNING: No FHIR entity list for {parent_entity_name}"
                            )
                        else:
                            parent_fhir_entity = fhir_entity_list[0]
            property_name: str = name_parts[-1]
            # find the corresponding fhir entity
            if fhir_entity_list:
                fhir_entity = fhir_entity_list[0]
                fhir_property_list = [
                    p
                    for p in fhir_entity.properties
                    if p.name == FhirXmlSchemaParser.fix_python_keywords(property_name)
                    or (
                        property_name.endswith("[x]")
                        and p.name
                        == FhirXmlSchemaParser.fix_python_keywords(
                            property_name.replace("[x]", "") + "CodeableConcept"
                        )
                    )
                ]

                if not fhir_property_list:
                    logger.warning(
                        f"WARNING: property {property_name} not found in {fhir_entity.fhir_name}"
                    )
                if fhir_property_list:
                    fhir_property = fhir_property_list[0]
                    value_set_matching = [
                        c
                        for c in value_sets
                        if (
                            c.url
                            and codeable_type.codeable_type_url
                            and c.url.split("|")[0]
                            == codeable_type.codeable_type_url.split("|")[0]
                        )
                        or (
                            c.value_set_url
                            and codeable_type.codeable_type_url
                            and (
                                c.value_set_url.split("|")[0]
                                == codeable_type.codeable_type_url.split("|")[0]
                            )
                        )
                    ]
                    if value_set_matching:
                        value_set = value_set_matching[0]
                        if codeable_type.is_codeable_concept:
                            # if property already has a codeable_type then we have a problem
                            if fhir_property.codeable_type:
                                logger.warning(
                                    f"WARNING: {fhir_property.name} in {fhir_entity.fhir_name} "
                                    f"already has a codeable type {fhir_property.codeable_type.name} "
                                    f"but we're trying to set it to {value_set.name}"
                                )
                            fhir_property.codeable_type = SmartName(
                                name=value_set.name,
                                cleaned_name=value_set.cleaned_name,
                                snake_case_name=value_set.name_snake_case,
                            )
                        else:
                            fhir_property.type_ = value_set.name
                            fhir_property.type_snake_case = value_set.name_snake_case
                            fhir_property.cleaned_type = value_set.cleaned_name
                            fhir_property.is_code = True

        # set generic type for everything else
        for fhir_entity in fhir_entities:
            for property_ in fhir_entity.properties:
                if (
                    property_.cleaned_type.lower() in ["codeableconcept", "coding"]
                    and not property_.codeable_type
                ):
                    property_.codeable_type = SmartName(
                        name="generic_type",
                        cleaned_name="GenericTypeCode",
                        snake_case_name="generic_type",
                    )
                elif property_.cleaned_type == "code":
                    property_.type_ = "generic_type"
                    property_.type_snake_case = "generic_type"
                    property_.cleaned_type = "GenericTypeCode"
                    property_.is_code = True

    @staticmethod
    def process_types_for_references(fhir_entities: List[FhirEntity]) -> None:
        references: List[
            FhirReferenceType
        ] = FhirXmlSchemaParser.get_types_for_references()
        reference: FhirReferenceType
        for reference in references:
            name_parts: List[str] = reference.path.split(".")
            # find the entity corresponding to the name parts
            entity_name_parts: List[str] = name_parts[0:-1]
            fhir_entity_list: List[FhirEntity] = []
            parent_fhir_entity: Optional[FhirEntity] = None
            # parent_entity_name: Optional[str] = None
            for entity_name_part in entity_name_parts:
                if not parent_fhir_entity:
                    # entity_name = entity_name_part
                    fhir_entity_list = [
                        f for f in fhir_entities if f.fhir_name == entity_name_part
                    ]
                    if not fhir_entity_list:
                        logger.warning(
                            f"WARNING: References: {entity_name_part} not found in fhir_entities"
                        )
                    else:
                        parent_fhir_entity = fhir_entity_list[0]
                else:
                    # find the property under the above entity
                    fhir_property_list = [
                        p
                        for p in parent_fhir_entity.properties
                        if p.name == entity_name_part
                    ]
                    if not fhir_property_list:
                        logger.warning(
                            f"WARNING: References: {entity_name_part} not found in properties of"
                            f" {parent_fhir_entity.fhir_name}"
                        )
                    else:
                        fhir_property = fhir_property_list[0]
                        parent_entity_name = fhir_property.cleaned_type
                        fhir_entity_list = [
                            f
                            for f in fhir_entities
                            if f.cleaned_name == parent_entity_name
                        ]
                        if not fhir_entity_list:
                            logger.warning(
                                f"WARNING: References: {parent_entity_name} not found in fhir_entities"
                            )
                        else:
                            parent_fhir_entity = fhir_entity_list[0]
            property_name: str = name_parts[-1]
            # find the corresponding fhir entity
            if fhir_entity_list:
                fhir_entity = fhir_entity_list[0]
                if property_name.endswith("[x]"):  # handle choice properties
                    property_name_prefix = property_name.split("[")[0]
                    fhir_property_list = [
                        p
                        for p in fhir_entity.properties
                        if p.name.startswith(property_name_prefix)
                        and p.type_ == "Reference"
                    ]
                else:
                    fhir_property_list = [
                        p
                        for p in fhir_entity.properties
                        if p.name
                        == FhirXmlSchemaParser.fix_python_keywords(property_name)
                    ]
                if fhir_property_list:
                    fhir_property = fhir_property_list[0]
                    fhir_property.reference_target_resources = [
                        SmartName(
                            name=c,
                            cleaned_name=FhirXmlSchemaParser.cleaned_type_mapping[c]
                            if c in FhirXmlSchemaParser.cleaned_type_mapping
                            else c,
                            snake_case_name=FhirXmlSchemaParser.camel_to_snake(c),
                        )
                        for c in reference.target_resources
                    ]
                    fhir_property.reference_target_resources_names = [
                        FhirXmlSchemaParser.cleaned_type_mapping[c.name]
                        if c.name in FhirXmlSchemaParser.cleaned_type_mapping
                        else c.name
                        for c in fhir_property.reference_target_resources
                    ]

        # set generic type for everything else
        for fhir_entity in fhir_entities:
            for property_ in fhir_entity.properties:
                if (
                    property_.cleaned_type in ["Reference"]
                    and not property_.reference_target_resources
                ):
                    property_.reference_target_resources = [
                        SmartName(
                            name="Resource",
                            cleaned_name="Resource",
                            snake_case_name="resource",
                        )
                    ]
                    property_.reference_target_resources_names = ["Resource"]

    @staticmethod
    def _generate_classes_for_resource(resource_xsd_file: Path) -> List[FhirEntity]:
        logger.info(f"++++++ PROCESSING FILE {resource_xsd_file.name} +++++++++ ")
        with open(resource_xsd_file, "rb") as file:
            contents = file.read()
            root: ObjectifiedElement = objectify.fromstring(contents)

            # pprint(result)
        fhir_entities: List[FhirEntity] = []
        complex_types: ObjectifiedElement = root["complexType"]
        complex_type: ObjectifiedElement
        for complex_type in complex_types:
            complex_type_name: str = complex_type.get("name")
            cleaned_complex_type_name: str = complex_type_name.replace(".", "")
            complex_type_name_snake_case: str = FhirXmlSchemaParser.camel_to_snake(
                cleaned_complex_type_name
            )
            logger.info(f"========== {complex_type_name} ===========")
            documentation_items: ObjectifiedElement = (
                complex_type["annotation"]["documentation"]
                if hasattr(complex_type, "annotation")
                else []
            )
            documentation_item_dict: Union[ObjectifiedElement, str]
            documentation_entries: List[str] = []
            for documentation_item_dict in documentation_items:
                if hasattr(documentation_item_dict, "text"):
                    documentation: str = documentation_item_dict.text
                elif isinstance(documentation_item_dict, str):
                    documentation = documentation_item_dict
                else:
                    documentation = "Error"
                    assert isinstance(documentation_item_dict, OrderedDict), type(
                        documentation_item_dict
                    )
                # print(f"// {documentation}")
                if documentation:
                    documentation_entries.append(documentation)

            inner_complex_type: Optional[ObjectifiedElement] = (
                complex_type["complexContent"]["extension"]
                if hasattr(complex_type, "complexContent")
                else None
            )
            entity_type: Optional[str] = None
            if inner_complex_type:
                entity_type = str(inner_complex_type.get("base"))
                # logger.info(f"type={entity_type}")
                fhir_properties = FhirXmlSchemaParser.generate_properties_for_class(
                    entity_name=complex_type_name, inner_complex_type=inner_complex_type
                )
            elif hasattr(complex_type, "sequence"):
                entity_type = "Element"
                fhir_properties = FhirXmlSchemaParser.generate_properties_for_class(
                    entity_name=complex_type_name, inner_complex_type=complex_type
                )
            else:
                fhir_properties = []

            # TODO: need a better check to detect value sets
            value_properties: List[bool] = [
                c.cleaned_type.endswith("-primitive")
                or c.cleaned_type.endswith("-list")
                for c in fhir_properties
                if c.fhir_name == "value" and c.cleaned_type
            ]
            if entity_type != "Element" or not any(value_properties):
                # now create the entity
                fhir_entity: FhirEntity = FhirEntity(
                    fhir_name=complex_type_name,
                    cleaned_name=cleaned_complex_type_name,
                    name_snake_case=complex_type_name_snake_case,
                    type_=entity_type,
                    documentation=documentation_entries,
                    properties=fhir_properties,
                    is_back_bone_element="." in entity_type if entity_type else False,
                    base_type=inner_complex_type.get("base")
                    if hasattr(inner_complex_type, "base")
                    else None,
                    base_type_list=[inner_complex_type.get("base")]
                    if hasattr(inner_complex_type, "base")
                    else [],
                    source=str(resource_xsd_file.parts[-1]),
                )
                fhir_entities.append(fhir_entity)
        return fhir_entities

    @staticmethod
    def generate_properties_for_class(
        *,
        entity_name: str,
        inner_complex_type: ObjectifiedElement,
    ) -> List[FhirProperty]:
        logger.debug(f"Processing properties for {entity_name}")
        properties: List[ObjectifiedElement] = []
        attributes: Optional[ObjectifiedElement] = (
            inner_complex_type["attribute"]
            if hasattr(inner_complex_type, "attribute")
            else None
        )
        if attributes is not None:
            for attribute in attributes:
                properties.append(attribute)

        sequences: Optional[ObjectifiedElement] = (
            inner_complex_type["sequence"]
            if hasattr(inner_complex_type, "sequence")
            else None
        )
        if sequences is not None:
            for sequence_item in sequences.getchildren():
                if hasattr(sequence_item, "element"):
                    sequence_item_elements: ObjectifiedElement = sequence_item.element
                    properties.extend(sequence_item_elements)
                else:
                    properties.append(sequence_item)
                # if hasattr(sequence_item, "choice"):
                #     sequence_item_choices: ObjectifiedElement = sequence_item.choice
                #     choice_properties = [c["element"] for c in sequence_item_choices]
                #     properties.extend(choice_properties)

        fhir_properties: List[FhirProperty] = []
        property_: ObjectifiedElement
        for property_ in properties:
            if hasattr(property_, "ref"):
                ref_: str = str(property_.get("ref"))
                property_name: str = ref_.split(":")[-1]
                property_type: str = ref_.split(":")[0]
            else:
                property_name = str(property_.get("name"))
                property_type = str(property_.get("type"))

            # string-primitive is the same thing as string
            if property_name != "value" and property_type.endswith("-primitive"):
                property_type = property_type.replace("-primitive", "")

            # This is specified wrong in the xsd
            if property_type == "SampledDataDataType" and property_name == "data":
                property_type = "string"

            min_occurs: str = str(
                property_.get("minOccurs") if property_.get("minOccurs") else 0
            )
            max_occurs: str = str(
                property_.get("maxOccurs") if property_.get("maxOccurs") else 1
            )
            property_documentation_dict: Optional[ObjectifiedElement] = (
                property_["annotation"]["documentation"]
                if hasattr(property_, "annotation")
                else None
            )
            property_documentation: str = str(
                property_documentation_dict.text
                if property_documentation_dict
                else None
            )
            # print(
            #     f"{property_name}: {property_type} [{min_occurs}..{max_occurs}] // {property_documentation}"
            # )
            optional: bool = min_occurs == "0"
            is_list: bool = max_occurs == "unbounded"
            cleaned_type: str = property_type
            cleaned_type = cleaned_type.replace(".", "")
            if property_type and property_name and property_type != "None":
                fhir_properties.append(
                    FhirProperty(
                        fhir_name=property_name,
                        name=FhirXmlSchemaParser.fix_python_keywords(property_name),
                        type_=property_type,
                        cleaned_type=cleaned_type
                        if cleaned_type not in FhirXmlSchemaParser.cleaned_type_mapping
                        else FhirXmlSchemaParser.cleaned_type_mapping[cleaned_type],
                        type_snake_case=FhirXmlSchemaParser.camel_to_snake(cleaned_type)
                        if cleaned_type not in FhirXmlSchemaParser.cleaned_type_mapping
                        else FhirXmlSchemaParser.camel_to_snake(cleaned_type),
                        optional=optional,
                        is_list=is_list,
                        documentation=[property_documentation],
                        fhir_type=None,
                        reference_target_resources=[],
                        reference_target_resources_names=[],
                        is_back_bone_element="." in property_type,
                        is_basic_type=cleaned_type
                        in FhirXmlSchemaParser.cleaned_type_mapping,
                        codeable_type=None,
                    )
                )
        return fhir_properties

    @staticmethod
    def fix_python_keywords(name: str) -> str:
        result: str = (
            name
            if name
            not in [
                "False",
                "None",
                "True",
                "and",
                "as",
                "assert",
                "async",
                "await",
                "break",
                "class",
                "continue",
                "def",
                "del",
                "elif",
                "else",
                "except",
                "finally",
                "for",
                "from",
                "global",
                "if",
                "import",
                "in",
                "is",
                "lambda",
                "nonlocal",
                "not",
                "or",
                "pass",
                "raise",
                "return",
                "try",
                "while",
                "with",
                "yield",
                "id",
                "type",
                "List",
            ]
            else f"{name}_"
        )
        if result and result[0].isdigit():
            result = "_" + result
        return result

    @staticmethod
    def get_all_property_types() -> List[FhirProperty]:
        data_dir: Path = Path(__file__).parent.joinpath("./")

        # first read fhir-all.xsd to get a list of resources
        de_xml_file: Path = (
            data_dir.joinpath("xsd")
            .joinpath("definitions.xml")
            .joinpath("dataelements.xml")
        )

        with open(de_xml_file, "rb") as file:
            contents: bytes = file.read()
            root: ObjectifiedElement = objectify.fromstring(contents)
            entries: ObjectifiedElement = root.entry

            fhir_properties: List[FhirProperty] = []
            entry: ObjectifiedElement
            for entry in entries:
                structure_definition: ObjectifiedElement = entry["resource"][
                    "StructureDefinition"
                ]
                name: str = structure_definition["name"].get("value")
                documentation: List[str] = structure_definition["description"].get(
                    "value"
                )
                snapshot_element: ObjectifiedElement = structure_definition["snapshot"][
                    "element"
                ]
                types: ObjectifiedElement = snapshot_element["type"]
                assert isinstance(types, OrderedDict)

                # There are 3 main cases:
                # 1. A simple scalar type
                # 2. A complex type
                # 3. A reference
                # 4. A codeable type
                # 5. A value set
                type_ = types[0]["code"].get("value") if types else ""

                fhir_properties.append(
                    FhirProperty(
                        name=name,
                        fhir_name=name,
                        type_=type_,
                        cleaned_type=type_,
                        type_snake_case=type_,
                        documentation=documentation,
                        is_back_bone_element=False,
                        codeable_type=None,
                        fhir_type=type_,
                        is_basic_type=False,
                        is_list=False,
                        optional=False,
                        reference_target_resources_names=[],
                        reference_target_resources=[],
                    )
                )

            return fhir_properties

    @staticmethod
    def get_types_for_references() -> List[FhirReferenceType]:
        data_dir: Path = Path(__file__).parent.joinpath("./")

        # first read fhir-all.xsd to get a list of resources
        de_xml_file: Path = (
            data_dir.joinpath("xsd")
            .joinpath("definitions.xml")
            .joinpath("dataelements.xml")
        )

        with open(de_xml_file, "rb") as file:
            contents: bytes = file.read()
            root: ObjectifiedElement = objectify.fromstring(contents)
            entries: ObjectifiedElement = root.entry

            fhir_references: List[FhirReferenceType] = []
            entry: ObjectifiedElement
            for entry in entries:
                structure_definition: ObjectifiedElement = entry["resource"][
                    "StructureDefinition"
                ]
                # name: str = structure_definition["name"].get("value")
                snapshot_element: ObjectifiedElement = structure_definition["snapshot"][
                    "element"
                ]
                types: ObjectifiedElement = snapshot_element["type"]
                type_: ObjectifiedElement
                for type_ in types:
                    type_code_obj = type_["code"]
                    type_code: str = type_code_obj.get("value")
                    if type_code.endswith("Reference"):
                        if not hasattr(type_, "targetProfile"):
                            logger.warning(
                                f'ASSERT: targetProfile not in {type_} for {snapshot_element["path"].get("value")}'
                            )
                        if hasattr(type_, "targetProfile"):
                            target_profile_list: ObjectifiedElement = type_[
                                "targetProfile"
                            ]
                            target_profiles: List[str] = [
                                c.get("value") for c in target_profile_list
                            ]
                            target_resources: List[str] = [
                                c.split("/")[-1] for c in target_profiles
                            ]
                            fhir_reference: FhirReferenceType = FhirReferenceType(
                                # parent_entity_name=name_parts[0],
                                # property_name=name_parts[1],
                                target_resources=target_resources,
                                path=snapshot_element["path"].get("value"),
                            )
                            fhir_references.append(fhir_reference)
            return fhir_references

    @staticmethod
    def get_types_for_codeable_concepts() -> List[FhirCodeableType]:
        data_dir: Path = Path(__file__).parent.joinpath("./")

        # first read fhir-all.xsd to get a list of resources
        de_xml_file: Path = (
            data_dir.joinpath("xsd")
            .joinpath("definitions.xml")
            .joinpath("dataelements.xml")
        )

        with open(de_xml_file, "rb") as file:
            contents: bytes = file.read()
            root: ObjectifiedElement = objectify.fromstring(contents)
            entries: ObjectifiedElement = root.entry

            fhir_codeable_types: List[FhirCodeableType] = []
            entry: ObjectifiedElement
            for entry in entries:
                structure_definition: ObjectifiedElement = entry["resource"][
                    "StructureDefinition"
                ]
                # name: str = structure_definition["name"].get("value")
                snapshot_element: ObjectifiedElement = structure_definition["snapshot"][
                    "element"
                ]
                if hasattr(snapshot_element, "binding"):
                    types: ObjectifiedElement = snapshot_element["type"]
                    type_: ObjectifiedElement
                    if types:
                        type_ = types
                        if type_["code"].get("value") in [
                            "Coding",
                            "CodeableConcept",
                            "code",
                        ]:
                            bindings: ObjectifiedElement = snapshot_element["binding"]
                            binding: ObjectifiedElement
                            for binding in bindings:
                                extension_code_list = binding["extension"]
                                url: str = "http://hl7.org/fhir/StructureDefinition/elementdefinition-bindingName"
                                value_set_url = (
                                    binding["valueSet"].get("value")
                                    if hasattr(binding, "valueSet")
                                    else None
                                )
                                codeable_type_list: List[ObjectifiedElement] = [
                                    bind
                                    for bind in extension_code_list
                                    if bind.get("url") == url
                                ]
                                if codeable_type_list:
                                    codeable_type_obj: ObjectifiedElement = (
                                        codeable_type_list[0]
                                    )
                                    codeable_type: str = codeable_type_obj[
                                        "valueString"
                                    ].get("value")
                                    fhir_codeable_types.append(
                                        FhirCodeableType(
                                            path=snapshot_element["path"].get("value"),
                                            codeable_type=codeable_type,
                                            codeable_type_url=value_set_url,
                                            is_codeable_concept=type_["code"].get(
                                                "value"
                                            )
                                            in ["Coding", "CodeableConcept"],
                                        )
                                    )
            return fhir_codeable_types

    @staticmethod
    def get_value_sets() -> List[FhirValueSet]:
        data_dir: Path = Path(__file__).parent.joinpath("./")

        fhir_value_sets: List[FhirValueSet] = []

        fhir_v3_code_systems: List[
            FhirValueSet
        ] = FhirXmlSchemaParser.get_v3_code_systems(data_dir)

        fhir_v2_code_systems: List[
            FhirValueSet
        ] = FhirXmlSchemaParser.get_v2_code_systems(data_dir)

        value_sets_file: Path = (
            data_dir.joinpath("xsd")
            .joinpath("definitions.xml")
            .joinpath("valuesets.xml")
        )
        with open(value_sets_file, "rb") as file:
            contents: bytes = file.read()
            root: ObjectifiedElement = objectify.fromstring(contents)
            entries: ObjectifiedElement = root.entry

        entry: ObjectifiedElement
        for entry in entries:
            value_set_resource = entry["resource"]
            is_code_system = hasattr(value_set_resource, "CodeSystem")
            value_set = (
                value_set_resource["CodeSystem"]
                if is_code_system
                else value_set_resource["ValueSet"]
            )
            id_ = value_set["id"].get("value")
            fhir_name: str = value_set["name"].get("value")
            name: str = fhir_name.replace("v3.", "")
            description: Union[List[str], str] = (
                value_set["description"].get("value")
                if hasattr(value_set, "description")
                else ""
            )
            if not isinstance(description, list):
                description = [description]
            url = value_set["url"].get("value")
            value_set_url = (
                value_set["valueSet"].get("value")
                if hasattr(value_set, "valueSet")
                else None
            )
            value_set_url_list: Set[str] = set()
            fhir_concepts: List[FhirValueSetConcept] = []
            if hasattr(value_set, "concept"):
                concepts: ObjectifiedElement = value_set["concept"]
                concept: ObjectifiedElement
                for concept in concepts:
                    fhir_concepts.append(
                        FhirXmlSchemaParser.create_concept(
                            concept, source="valuesets.xml", value_set_url=url
                        )
                    )
            if hasattr(value_set, "compose"):
                compose_includes: ObjectifiedElement = value_set["compose"]["include"]
                compose_include: ObjectifiedElement
                for compose_include in compose_includes:
                    is_code_system = hasattr(compose_include, "system")
                    is_value_set = hasattr(compose_include, "valueSet")
                    if is_code_system or is_value_set:
                        compose_include_code_system: str = (
                            compose_include["system"].get("value")
                            if is_code_system
                            else compose_include["valueSet"].get("value")
                        )
                        # find the corresponding item in code systems
                        v3_code_systems: List[FhirValueSet] = [
                            c
                            for c in fhir_v3_code_systems
                            if c.url == compose_include_code_system
                        ]
                        v2_code_systems: List[FhirValueSet] = [
                            c
                            for c in fhir_v2_code_systems
                            if c.url == compose_include_code_system
                        ]
                        if v3_code_systems:
                            for code_system in v3_code_systems:
                                fhir_concepts.extend(code_system.concepts)
                                # value_set_url_list.append(code_system.url)
                                value_set_url_list.update(
                                    code_system.value_set_url_list
                                )
                        elif v2_code_systems:
                            for code_system in v2_code_systems:
                                fhir_concepts.extend(code_system.concepts)
                                # value_set_url_list.append(code_system.url)
                                value_set_url_list.update(
                                    code_system.value_set_url_list
                                )
                        elif compose_include_code_system not in value_set_url_list:
                            if is_code_system:
                                value_set_url_list.add(compose_include_code_system)
                    if hasattr(compose_include, "concept"):
                        concepts = compose_include["concept"]
                        for concept in concepts:
                            fhir_concepts.append(
                                FhirXmlSchemaParser.create_concept(
                                    concept, source="valuesets.xml", value_set_url=url
                                )
                            )
            if "/" in name:
                name = name.replace("/", "_or_")
            if "/" not in name:
                fhir_value_sets.append(
                    FhirValueSet(
                        id_=id_,
                        name=name,
                        fhir_name=fhir_name,
                        name_snake_case=FhirXmlSchemaParser.camel_to_snake(
                            FhirXmlSchemaParser.clean_name(name)
                        ),
                        cleaned_name=FhirXmlSchemaParser.clean_name(name) + "Code",
                        concepts=fhir_concepts,
                        url=url,
                        value_set_url=value_set_url,
                        value_set_url_list=value_set_url_list or {url},
                        documentation=description,
                        source="valuesets.xml",
                    )
                )
            else:
                logger.warning(f"WARNING: value set {name} contains /")

        fhir_value_sets.extend(
            [
                c
                for c in fhir_v2_code_systems
                if c.cleaned_name not in [b.cleaned_name for b in fhir_value_sets]
            ]
        )
        fhir_value_sets.extend(
            [
                c
                for c in fhir_v3_code_systems
                if c.cleaned_name not in [b.cleaned_name for b in fhir_value_sets]
            ]
        )

        # for each value_set, if there is a code system and a value system with same name then choose valueset
        for fhir_value_set in fhir_value_sets:
            value_set_url_list = set()
            for value_set_url in fhir_value_set.value_set_url_list:
                if value_set_url.endswith("/"):
                    value_set_url = value_set_url[0:-1]
                value_set_url_name: str = value_set_url.split("/")[-1]
                if value_set_url_name != "" and value_set_url_name in [
                    c.split("/")[-1] for c in value_set_url_list
                ]:
                    pass
                else:
                    value_set_url_list.add(value_set_url)
            fhir_value_set.value_set_url_list = value_set_url_list
        return fhir_value_sets

    @staticmethod
    def create_concept(
        concept: ObjectifiedElement, source: str, value_set_url: str
    ) -> FhirValueSetConcept:
        code: str = concept["code"].get("value")
        display: str = (
            concept["display"].get("value") if hasattr(concept, "display") else code
        )
        cleaned_display: str = FhirXmlSchemaParser.clean_name(display)
        definition: Optional[str] = (
            concept["definition"].get("value")
            if hasattr(concept, "definition")
            else None
        )
        return FhirValueSetConcept(
            code=code,
            display=display,
            cleaned_display=cleaned_display,
            definition=definition,
            source=source,
            value_set_url=value_set_url,
        )

    @staticmethod
    def clean_name(display: str) -> str:
        cleaned_display: str = "".join(
            [c[:1].upper() + c[1:] for c in display.split(" ")]
        )
        cleaned_display = re.sub("[^0-9a-zA-Z]+", "_", cleaned_display)
        cleaned_display = FhirXmlSchemaParser.fix_python_keywords(cleaned_display)
        return cleaned_display

    @staticmethod
    def get_v3_code_systems(data_dir: Path) -> List[FhirValueSet]:
        fhir_value_sets: List[FhirValueSet] = []

        value_sets_json_file: Path = (
            data_dir.joinpath("xsd")
            .joinpath("definitions.xml")
            .joinpath("v3-codesystems.xml")
        )
        with open(value_sets_json_file, "rb") as file:
            contents: bytes = file.read()
            root: ObjectifiedElement = objectify.fromstring(contents)
            entries: ObjectifiedElement = root.entry

        # Have to do 2 passes since the compose includes may be later in the file
        value_set_entry: Dict[str, Any]
        for value_set_entry in entries:
            value_set_entry_resource: ObjectifiedElement = value_set_entry["resource"]
            is_code_system: bool = hasattr(value_set_entry_resource, "CodeSystem")
            is_value_set: bool = hasattr(value_set_entry_resource, "ValueSet")
            value_set: ObjectifiedElement = (
                value_set_entry_resource["ValueSet"]
                if is_value_set
                else value_set_entry_resource["CodeSystem"]
                if is_code_system
                else value_set_entry["resource"]
            )
            id_: str = value_set["id"].get("value")
            fhir_name: str = value_set["name"].get("value")
            name: str = fhir_name.replace("v3.", "")
            clean_name = FhirXmlSchemaParser.clean_name(name)
            description: Union[List[str], str] = value_set["description"].get("value")
            if not isinstance(description, list):
                description = [description]
            url = value_set["url"].get("value")
            fhir_concepts: List[FhirValueSetConcept] = []
            value_set_url_list: Set[str] = set()
            # value_set_url = None  # value_set["valueSet"]
            if hasattr(value_set, "concept"):
                concepts_list: ObjectifiedElement = value_set["concept"]
                value_set_url_list.add(url)
                concept: ObjectifiedElement
                for concept in concepts_list:
                    code: str = str(concept["code"].get("value"))
                    display: str = str(
                        concept["display"].get("value")
                        if hasattr(concept, "display")
                        else concept["code"].get("value")
                    )
                    cleaned_display = FhirXmlSchemaParser.clean_name(display)
                    definition: Optional[str] = (
                        concept["definition"].get("value")
                        if hasattr(concept, "definition")
                        else None
                    )
                    fhir_concepts.append(
                        FhirValueSetConcept(
                            code=code,
                            display=display,
                            cleaned_display=cleaned_display,
                            definition=definition,
                            source="v3-codesystems.xml",
                            value_set_url=url,
                        )
                    )
            fhir_value_sets.append(
                FhirValueSet(
                    id_=id_,
                    name=name,
                    fhir_name=fhir_name,
                    name_snake_case=FhirXmlSchemaParser.camel_to_snake(name),
                    cleaned_name=clean_name,
                    concepts=fhir_concepts,
                    url=url,
                    value_set_url="",
                    value_set_url_list=value_set_url_list,
                    documentation=description,
                    source="v3-codesystems.xml",
                )
            )

        # Do second pass just for filling out compose.include entries
        for value_set_entry in entries:
            value_set_entry_resource = value_set_entry["resource"]
            is_code_system = hasattr(value_set_entry_resource, "CodeSystem")
            is_value_set = hasattr(value_set_entry_resource, "ValueSet")
            value_set = (
                value_set_entry_resource["ValueSet"]
                if is_value_set
                else value_set_entry_resource["CodeSystem"]
                if is_code_system
                else value_set_entry["resource"]
            )
            id_ = value_set["id"].get("value")
            url = value_set["url"].get("value")
            fhir_concepts = []
            value_set_url_list = set()
            if hasattr(value_set, "compose"):
                compose_includes: ObjectifiedElement = value_set["compose"]["include"]
                compose_include: ObjectifiedElement
                for compose_include in compose_includes:
                    is_code_system = hasattr(compose_include, "system")
                    # is_value_set = "valueSet" in compose_include
                    if is_code_system or is_value_set:
                        compose_include_code_system: str = (
                            compose_include["system"].get("value")
                            if is_code_system
                            else compose_include["valueSet"].get("value")
                        )
                        # find the corresponding item in code systems
                        v3_code_systems: List[FhirValueSet] = [
                            c
                            for c in fhir_value_sets
                            if c.url == compose_include_code_system
                        ]
                        if v3_code_systems:
                            for code_system in v3_code_systems:
                                fhir_concepts.extend(code_system.concepts)
                                if is_code_system:
                                    value_set_url_list.add(code_system.url)
                        # v2_code_systems: List[FhirValueSet] = [
                        #     c
                        #     for c in fhir_v2_code_systems
                        #     if c.url == compose_include_code_system
                        # ]
                        # if v2_code_systems:
                        #     for code_system in v2_code_systems:
                        #         fhir_concepts.extend(code_system.concepts)
                        #         value_set_url_list.append(code_system.url)

            # find the appropriate value set and add it there
            found_value_sets: List[FhirValueSet] = [
                c for c in fhir_value_sets if c.id_ == id_
            ]
            found_value_set: FhirValueSet
            for found_value_set in found_value_sets:
                # add concepts from compose.includes
                missing_concepts = [
                    c
                    for c in fhir_concepts
                    if c.code not in [b.code for b in found_value_set.concepts]
                ]
                if missing_concepts:
                    found_value_set.concepts.extend(missing_concepts)
                # add any missing value set urls
                for value_set_url in value_set_url_list:
                    found_value_set.value_set_url_list.add(value_set_url)

        return fhir_value_sets

    @staticmethod
    def get_v2_code_systems(data_dir: Path) -> List[FhirValueSet]:
        fhir_value_sets: List[FhirValueSet] = []

        value_sets_json_file: Path = (
            data_dir.joinpath("xsd")
            .joinpath("definitions.xml")
            .joinpath("v2-tables.xml")
        )
        with open(value_sets_json_file, "rb") as file:
            contents: bytes = file.read()
            root: ObjectifiedElement = objectify.fromstring(contents)
            entries: ObjectifiedElement = root.entry

        value_set_entry: ObjectifiedElement
        for value_set_entry in entries:
            value_set_entry_resource: ObjectifiedElement = value_set_entry.resource
            is_code_system: bool = hasattr(value_set_entry_resource, "CodeSystem")
            is_value_set: bool = hasattr(value_set_entry_resource, "ValueSet")
            value_set: ObjectifiedElement = (
                value_set_entry_resource.ValueSet
                if is_value_set
                else value_set_entry_resource.CodeSystem
                if is_code_system
                else value_set_entry_resource
            )
            id_: str = value_set.id.get("value")
            fhir_name: str = value_set.name.get("value")
            name: str = fhir_name.replace(".", "_")
            description: str = value_set.description.get("value")
            assert isinstance(description, str)
            url: str = value_set.url.get("value")
            fhir_concepts: List[FhirValueSetConcept] = []
            # value_set_url = None  # value_set["valueSet"]
            if hasattr(value_set, "concept"):
                concepts_list: ObjectifiedElement = value_set.concept
                concept: ObjectifiedElement
                for concept in concepts_list:
                    code: str = concept.code.get("value")
                    display: str = str(
                        concept.display.get("value")
                        if hasattr(concept, "display")
                        else concept.code.get("value")
                    )
                    cleaned_display = FhirXmlSchemaParser.clean_name(display)
                    definition: Optional[str] = (
                        concept["definition"].get("value")
                        if hasattr(concept, "definition")
                        else None
                    )
                    fhir_concepts.append(
                        FhirValueSetConcept(
                            code=code,
                            display=display,
                            cleaned_display=cleaned_display,
                            definition=definition,
                            source="v2-tables.xml",
                            value_set_url=url,
                        )
                    )
            fhir_value_sets.append(
                FhirValueSet(
                    id_=id_,
                    name=name,
                    fhir_name=fhir_name,
                    name_snake_case=FhirXmlSchemaParser.camel_to_snake(name),
                    cleaned_name=FhirXmlSchemaParser.clean_name(name),
                    concepts=fhir_concepts,
                    url=url,
                    value_set_url="",
                    value_set_url_list={url},
                    documentation=[description],
                    source="v2-tables.xml",
                )
            )
        return fhir_value_sets
