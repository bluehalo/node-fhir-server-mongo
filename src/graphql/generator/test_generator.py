from pprint import pprint

from spark_auto_mapper_fhir.generator.fhir_xml_schema_parser import FhirXmlSchemaParser


def test_generator() -> None:
    # fhir_entities = FhirXmlSchemaParser.generate_classes(filter_to_resource="coverage")
    fhir_entities = FhirXmlSchemaParser.generate_classes()

    # now print the result
    for fhir_entity in fhir_entities:
        pprint(fhir_entity)
