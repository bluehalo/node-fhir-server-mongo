import dataclasses
import logging
import re
from pathlib import Path
from typing import OrderedDict, List, Union, Dict, Optional, Set

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
        "boolean": "Boolean",
        "date": "date",
        "dateTime": "dateTime",
        "time": "time",
        "instant": "instant",
        "integer": "Int",
        "positiveInt": "Int",
        "decimal": "decimal",
        "string": "String",
        # "DataType": "FhirDataType",
        # "markdown": "FhirMarkdown",
        # "canonical": "FhirCanonical",
        # "List": "List_",
        # "uri": "FhirUri",
        # "url": "FhirUrl",
        # "id": "FhirId",
        # "base64Binary": "FhirBase64Binary",
        # "unsignedInt": "FhirUnsignedInt",
        # "uuid": "FhirUuid",
        # "oid": "FhirOid",
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

        # value_sets: List[FhirValueSet] = FhirXmlSchemaParser.get_value_sets()

        # and the target types for codeable concepts
        # FhirXmlSchemaParser.process_types_for_codeable_concepts(
        #     fhir_entities, value_sets
        # )

        # value_set: FhirValueSet
        # for value_set in value_sets:
        #     for fhir_entity in fhir_entities:
        #         if value_set.name == fhir_entity.fhir_name:
        #             fhir_entity.is_value_set = True

        # remove any entities that are already in value_sets
        # fhir_entities = [
        #     c
        #     for c in fhir_entities
        #     if c.fhir_name not in [b.name for b in value_sets]
        #     or c.cleaned_name in ["PractitionerRole", "ElementDefinition"]
        # ]
        # fhir_entities.extend(
        #     [
        #         FhirEntity(
        #             type_="ValueSet",
        #             fhir_name=c.fhir_name,
        #             name_snake_case=c.name_snake_case,
        #             cleaned_name=c.cleaned_name,
        #             documentation=c.documentation,
        #             properties=[],
        #             is_back_bone_element=False,
        #             is_value_set=True,
        #             value_set_concepts=c.concepts,
        #             value_set_url_list=c.value_set_url_list,
        #             value_set_url=c.url,
        #             source=c.source,
        #             base_type=None,
        #             base_type_list=[],
        #         )
        #         for c in value_sets
        #     ]
        # )

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

        return fhir_entities

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
    def clean_name(display: str) -> str:
        cleaned_display: str = "".join(
            [c[:1].upper() + c[1:] for c in display.split(" ")]
        )
        cleaned_display = re.sub("[^0-9a-zA-Z]+", "_", cleaned_display)
        cleaned_display = FhirXmlSchemaParser.fix_python_keywords(cleaned_display)
        return cleaned_display
