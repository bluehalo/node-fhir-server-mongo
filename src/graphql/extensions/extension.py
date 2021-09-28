from __future__ import annotations
from typing import Optional, Union, List, Any, TYPE_CHECKING

from pyspark.sql.types import StructType, DataType
from spark_auto_mapper_fhir.fhir_types.boolean import FhirBoolean
from spark_auto_mapper_fhir.fhir_types.date import FhirDate
from spark_auto_mapper_fhir.fhir_types.date_time import FhirDateTime
from spark_auto_mapper_fhir.fhir_types.list import FhirList
from spark_auto_mapper_fhir.fhir_types.integer import FhirInteger
from spark_auto_mapper_fhir.fhir_types.string import FhirString
from spark_auto_mapper_fhir.fhir_types.fhir_reference import FhirReference
from spark_auto_mapper_fhir.fhir_types.uri import FhirUri

from spark_auto_mapper_fhir.complex_types.meta import Meta
from spark_auto_mapper_fhir.extensions.extension_base import ExtensionBase
from spark_auto_mapper_fhir.fhir_types.id import FhirId

from spark_auto_mapper_fhir.base_types.fhir_complex_type_base import FhirComplexTypeBase
from spark_fhir_schemas.r4.complex_types.extension import ExtensionSchema


if TYPE_CHECKING:
    pass
    # id_ (string)
    from spark_auto_mapper_fhir.fhir_types.string import FhirString
    # url (uri)
    from spark_auto_mapper_fhir.fhir_types.uri import FhirUri
    # valueBase64Binary (base64Binary)
    from spark_auto_mapper_fhir.fhir_types.base64_binary import FhirBase64Binary
    # valueBoolean (boolean)
    from spark_auto_mapper_fhir.fhir_types.boolean import FhirBoolean
    # valueCanonical (canonical)
    from spark_auto_mapper_fhir.fhir_types.canonical import FhirCanonical
    # valueCode (generic_type)
    from spark_auto_mapper_fhir.value_sets.generic_type import GenericTypeCode
    # valueDate (date)
    from spark_auto_mapper_fhir.fhir_types.date import FhirDate
    # valueDateTime (dateTime)
    from spark_auto_mapper_fhir.fhir_types.date_time import FhirDateTime
    # valueDecimal (decimal)
    from spark_auto_mapper_fhir.fhir_types.decimal import FhirDecimal
    # valueId (id)
    from spark_auto_mapper_fhir.fhir_types.id import FhirId
    # valueInstant (instant)
    from spark_auto_mapper_fhir.fhir_types.instant import FhirInstant
    # valueInteger (integer)
    from spark_auto_mapper_fhir.fhir_types.integer import FhirInteger
    # valueMarkdown (markdown)
    from spark_auto_mapper_fhir.fhir_types.markdown import FhirMarkdown
    # valueOid (oid)
    from spark_auto_mapper_fhir.fhir_types.oid import FhirOid
    # valuePositiveInt (positiveInt)
    from spark_auto_mapper_fhir.fhir_types.positive_int import FhirPositiveInt
    # valueString (string)
    from spark_auto_mapper_fhir.fhir_types.string import FhirString
    # valueTime (time)
    from spark_auto_mapper_fhir.fhir_types.time import FhirTime
    # valueUnsignedInt (unsignedInt)
    from spark_auto_mapper_fhir.fhir_types.unsigned_int import FhirUnsignedInt
    # valueUri (uri)
    from spark_auto_mapper_fhir.fhir_types.uri import FhirUri
    # valueUrl (url)
    from spark_auto_mapper_fhir.fhir_types.url import FhirUrl
    # valueUuid (uuid)
    from spark_auto_mapper_fhir.fhir_types.uuid import FhirUuid
    # valueAddress (Address)
    from spark_auto_mapper_fhir.complex_types.address import Address
    # valueAge (Age)
    from spark_auto_mapper_fhir.complex_types.age import Age
    # valueAnnotation (Annotation)
    from spark_auto_mapper_fhir.complex_types.annotation import Annotation
    # valueAttachment (Attachment)
    from spark_auto_mapper_fhir.complex_types.attachment import Attachment
    # valueCodeableConcept (CodeableConcept)
    from spark_auto_mapper_fhir.complex_types.codeable_concept import CodeableConcept
    # Import for CodeableConcept for valueCodeableConcept
    from spark_auto_mapper_fhir.value_sets.generic_type import GenericTypeCode
    # End Import for CodeableConcept for valueCodeableConcept
    # valueCoding (Coding)
    from spark_auto_mapper_fhir.complex_types.coding import Coding
    # Import for CodeableConcept for valueCoding
    from spark_auto_mapper_fhir.value_sets.generic_type import GenericTypeCode
    # End Import for CodeableConcept for valueCoding
    # valueContactPoint (ContactPoint)
    from spark_auto_mapper_fhir.complex_types.contact_point import ContactPoint
    # valueCount (Count)
    from spark_auto_mapper_fhir.complex_types.count import Count
    # valueDistance (Distance)
    from spark_auto_mapper_fhir.complex_types.distance import Distance
    # valueDuration (Duration)
    from spark_auto_mapper_fhir.complex_types.duration import Duration
    # valueHumanName (HumanName)
    from spark_auto_mapper_fhir.complex_types.human_name import HumanName
    # valueIdentifier (Identifier)
    from spark_auto_mapper_fhir.complex_types.identifier import Identifier
    # valueMoney (Money)
    from spark_auto_mapper_fhir.complex_types.money import Money
    # valuePeriod (Period)
    from spark_auto_mapper_fhir.complex_types.period import Period
    # valueQuantity (Quantity)
    from spark_auto_mapper_fhir.complex_types.quantity import Quantity
    # valueRange (Range)
    from spark_auto_mapper_fhir.complex_types.range import Range
    # valueRatio (Ratio)
    from spark_auto_mapper_fhir.complex_types.ratio import Ratio
    # valueReference (Reference)
    from spark_auto_mapper_fhir.complex_types.reference import Reference
    # Imports for References for valueReference
    from spark_auto_mapper_fhir.resources.resource import Resource
    # valueSampledData (SampledData)
    from spark_auto_mapper_fhir.complex_types.sampled_data import SampledData
    # valueSignature (Signature)
    from spark_auto_mapper_fhir.complex_types.signature import Signature
    # valueTiming (Timing)
    from spark_auto_mapper_fhir.backbone_elements.timing import Timing
    # valueContactDetail (ContactDetail)
    from spark_auto_mapper_fhir.complex_types.contact_detail import ContactDetail
    # valueContributor (Contributor)
    from spark_auto_mapper_fhir.complex_types.contributor import Contributor
    # valueDataRequirement (DataRequirement)
    from spark_auto_mapper_fhir.complex_types.data_requirement import DataRequirement
    # valueExpression (Expression)
    from spark_auto_mapper_fhir.complex_types.expression import Expression
    # valueParameterDefinition (ParameterDefinition)
    from spark_auto_mapper_fhir.complex_types.parameter_definition import ParameterDefinition
    # valueRelatedArtifact (RelatedArtifact)
    from spark_auto_mapper_fhir.complex_types.related_artifact import RelatedArtifact
    # valueTriggerDefinition (TriggerDefinition)
    from spark_auto_mapper_fhir.complex_types.trigger_definition import TriggerDefinition
    # valueUsageContext (UsageContext)
    from spark_auto_mapper_fhir.complex_types.usage_context import UsageContext
    # valueDosage (Dosage)
    from spark_auto_mapper_fhir.backbone_elements.dosage import Dosage
    # valueMeta (Meta)
    from spark_auto_mapper_fhir.complex_types.meta import Meta


# This file is auto-generated by generate_classes so do not edit manually
# noinspection PyPep8Naming
class Extension(ExtensionBase):
    """
    Extension
    fhir-base.xsd
        Optional Extension Element - found in all resources.
        If the element is present, it must have a value for at least one of the defined elements, an @id referenced from the Narrative, or extensions
    """
    # noinspection PyPep8Naming
    def __init__(
        self,
        *,
        id_: Optional[            FhirString] = None,
        extension: Optional[FhirList[            ExtensionBase]] = None,
        url: Optional[            FhirUri] = None,
        valueBase64Binary: Optional[            FhirBase64Binary] = None,
        valueBoolean: Optional[            FhirBoolean] = None,
        valueCanonical: Optional[            FhirCanonical] = None,
        valueCode: Optional[            GenericTypeCode] = None,
        valueDate: Optional[            FhirDate] = None,
        valueDateTime: Optional[            FhirDateTime] = None,
        valueDecimal: Optional[            FhirDecimal] = None,
        valueId: Optional[            FhirId] = None,
        valueInstant: Optional[            FhirInstant] = None,
        valueInteger: Optional[            FhirInteger] = None,
        valueMarkdown: Optional[            FhirMarkdown] = None,
        valueOid: Optional[            FhirOid] = None,
        valuePositiveInt: Optional[            FhirPositiveInt] = None,
        valueString: Optional[            FhirString] = None,
        valueTime: Optional[            FhirTime] = None,
        valueUnsignedInt: Optional[            FhirUnsignedInt] = None,
        valueUri: Optional[            FhirUri] = None,
        valueUrl: Optional[            FhirUrl] = None,
        valueUuid: Optional[            FhirUuid] = None,
        valueAddress: Optional[            Address] = None,
        valueAge: Optional[            Age] = None,
        valueAnnotation: Optional[            Annotation] = None,
        valueAttachment: Optional[            Attachment] = None,
        valueCodeableConcept: Optional[            CodeableConcept[GenericTypeCode]
] = None,
        valueCoding: Optional[            Coding[GenericTypeCode]
] = None,
        valueContactPoint: Optional[            ContactPoint] = None,
        valueCount: Optional[            Count] = None,
        valueDistance: Optional[            Distance] = None,
        valueDuration: Optional[            Duration] = None,
        valueHumanName: Optional[            HumanName] = None,
        valueIdentifier: Optional[            Identifier] = None,
        valueMoney: Optional[            Money] = None,
        valuePeriod: Optional[            Period] = None,
        valueQuantity: Optional[            Quantity] = None,
        valueRange: Optional[            Range] = None,
        valueRatio: Optional[            Ratio] = None,
        valueReference: Optional[            Reference                [Resource]
] = None,
        valueSampledData: Optional[            SampledData] = None,
        valueSignature: Optional[            Signature] = None,
        valueTiming: Optional[            Timing] = None,
        valueContactDetail: Optional[            ContactDetail] = None,
        valueContributor: Optional[            Contributor] = None,
        valueDataRequirement: Optional[            DataRequirement] = None,
        valueExpression: Optional[            Expression] = None,
        valueParameterDefinition: Optional[            ParameterDefinition] = None,
        valueRelatedArtifact: Optional[            RelatedArtifact] = None,
        valueTriggerDefinition: Optional[            TriggerDefinition] = None,
        valueUsageContext: Optional[            UsageContext] = None,
        valueDosage: Optional[            Dosage] = None,
        valueMeta: Optional[            Meta] = None,
    ) -> None:
        """
        Optional Extension Element - found in all resources.
        If the element is present, it must have a value for at least one of the
    defined elements, an @id referenced from the Narrative, or extensions

        :param id_: None
        :param extension: May be used to represent additional information that is not part of the basic
    definition of the element. To make the use of extensions safe and manageable,
    there is a strict set of governance  applied to the definition and use of
    extensions. Though any implementer can define an extension, there is a set of
    requirements that SHALL be met as part of the definition of the extension.
        :param url: None
        :param valueBase64Binary: None
        :param valueBoolean: None
        :param valueCanonical: None
        :param valueCode: None
        :param valueDate: None
        :param valueDateTime: None
        :param valueDecimal: None
        :param valueId: None
        :param valueInstant: None
        :param valueInteger: None
        :param valueMarkdown: None
        :param valueOid: None
        :param valuePositiveInt: None
        :param valueString: None
        :param valueTime: None
        :param valueUnsignedInt: None
        :param valueUri: None
        :param valueUrl: None
        :param valueUuid: None
        :param valueAddress: None
        :param valueAge: None
        :param valueAnnotation: None
        :param valueAttachment: None
        :param valueCodeableConcept: None
        :param valueCoding: None
        :param valueContactPoint: None
        :param valueCount: None
        :param valueDistance: None
        :param valueDuration: None
        :param valueHumanName: None
        :param valueIdentifier: None
        :param valueMoney: None
        :param valuePeriod: None
        :param valueQuantity: None
        :param valueRange: None
        :param valueRatio: None
        :param valueReference: None
        :param valueSampledData: None
        :param valueSignature: None
        :param valueTiming: None
        :param valueContactDetail: None
        :param valueContributor: None
        :param valueDataRequirement: None
        :param valueExpression: None
        :param valueParameterDefinition: None
        :param valueRelatedArtifact: None
        :param valueTriggerDefinition: None
        :param valueUsageContext: None
        :param valueDosage: None
        :param valueMeta: None
        """
        super().__init__(
            id_=id_,
            extension=extension,
            url=url,
            valueBase64Binary=valueBase64Binary,
            valueBoolean=valueBoolean,
            valueCanonical=valueCanonical,
            valueCode=valueCode,
            valueDate=valueDate,
            valueDateTime=valueDateTime,
            valueDecimal=valueDecimal,
            valueId=valueId,
            valueInstant=valueInstant,
            valueInteger=valueInteger,
            valueMarkdown=valueMarkdown,
            valueOid=valueOid,
            valuePositiveInt=valuePositiveInt,
            valueString=valueString,
            valueTime=valueTime,
            valueUnsignedInt=valueUnsignedInt,
            valueUri=valueUri,
            valueUrl=valueUrl,
            valueUuid=valueUuid,
            valueAddress=valueAddress,
            valueAge=valueAge,
            valueAnnotation=valueAnnotation,
            valueAttachment=valueAttachment,
            valueCodeableConcept=valueCodeableConcept,
            valueCoding=valueCoding,
            valueContactPoint=valueContactPoint,
            valueCount=valueCount,
            valueDistance=valueDistance,
            valueDuration=valueDuration,
            valueHumanName=valueHumanName,
            valueIdentifier=valueIdentifier,
            valueMoney=valueMoney,
            valuePeriod=valuePeriod,
            valueQuantity=valueQuantity,
            valueRange=valueRange,
            valueRatio=valueRatio,
            valueReference=valueReference,
            valueSampledData=valueSampledData,
            valueSignature=valueSignature,
            valueTiming=valueTiming,
            valueContactDetail=valueContactDetail,
            valueContributor=valueContributor,
            valueDataRequirement=valueDataRequirement,
            valueExpression=valueExpression,
            valueParameterDefinition=valueParameterDefinition,
            valueRelatedArtifact=valueRelatedArtifact,
            valueTriggerDefinition=valueTriggerDefinition,
            valueUsageContext=valueUsageContext,
            valueDosage=valueDosage,
            valueMeta=valueMeta,
        )

    def get_schema(
        self, include_extension: bool
    ) -> Optional[Union[StructType, DataType]]:
        return ExtensionSchema.get_schema(include_extension=include_extension)
