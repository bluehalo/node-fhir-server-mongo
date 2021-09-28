from spark_auto_mapper_fhir.generator.fhir_xml_schema_parser import FhirXmlSchemaParser


def test_clean_name() -> None:
    name: str = "PublicationStatus"
    result = FhirXmlSchemaParser.clean_name(name)
    print(result)
