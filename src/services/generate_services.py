import os
from pathlib import Path


def main() -> bool:
    resources = ['Account', 'ActivityDefinition', 'AdverseEvent', 'AllergyIntolerance', 'Appointment',
                 'AppointmentResponse', 'AuditEvent', 'Basic', 'Binary', 'BiologicallyDerivedProduct', 'BodyStructure',
                 'Bundle', 'CapabilityStatement', 'CarePlan', 'CareTeam', 'CatalogEntry', 'ChargeItem',
                 'ChargeItemDefinition', 'Claim', 'ClaimResponse', 'ClinicalImpression', 'CodeSystem', 'Communication',
                 'CommunicationRequest', 'CompartmentDefinition', 'Composition', 'ConceptMap', 'Condition', 'Consent',
                 'Contract', 'Coverage', 'CoverageEligibilityRequest', 'CoverageEligibilityResponse', 'DetectedIssue',
                 'Device', 'DeviceDefinition', 'DeviceMetric', 'DeviceRequest', 'DeviceUseStatement',
                 'DiagnosticReport', 'DocumentManifest', 'DocumentReference', 'EffectEvidenceSynthesis', 'Encounter',
                 'Endpoint', 'EnrollmentRequest', 'EnrollmentResponse', 'EpisodeOfCare', 'EventDefinition', 'Evidence',
                 'EvidenceVariable', 'ExampleScenario', 'ExplanationOfBenefit', 'FamilyMemberHistory', 'Flag', 'Goal',
                 'GraphDefinition', 'Group', 'GuidanceResponse', 'HealthcareService', 'ImagingStudy', 'Immunization',
                 'ImmunizationEvaluation', 'ImmunizationRecommendation', 'ImplementationGuide', 'InsurancePlan',
                 'Invoice', 'Library', 'Linkage', 'List', 'Location', 'Measure', 'MeasureReport', 'Media', 'Medication',
                 'MedicationAdministration', 'MedicationDispense', 'MedicationKnowledge', 'MedicationRequest',
                 'MedicationStatement', 'MedicinalProduct', 'MedicinalProductAuthorization',
                 'MedicinalProductContraindication', 'MedicinalProductIndication', 'MedicinalProductIngredient',
                 'MedicinalProductInteraction', 'MedicinalProductManufactured', 'MedicinalProductPackaged',
                 'MedicinalProductPharmaceutical', 'MedicinalProductUndesirableEffect', 'MessageDefinition',
                 'MessageHeader', 'MolecularSequence', 'NamingSystem', 'NutritionOrder', 'Observation',
                 'ObservationDefinition', 'OperationDefinition', 'OperationOutcome', 'Organization',
                 'OrganizationAffiliation', 'Parameters', 'Patient', 'PaymentNotice', 'PaymentReconciliation', 'Person',
                 'PlanDefinition', 'Practitioner', 'PractitionerRole', 'Procedure', 'Provenance', 'Questionnaire',
                 'QuestionnaireResponse', 'RelatedPerson', 'RequestGroup', 'ResearchDefinition',
                 'ResearchElementDefinition', 'ResearchStudy', 'ResearchSubject', 'RiskAssessment',
                 'RiskEvidenceSynthesis', 'Schedule', 'SearchParameter', 'ServiceRequest', 'Slot', 'Specimen',
                 'SpecimenDefinition', 'StructureDefinition', 'StructureMap', 'Subscription', 'Substance',
                 'SubstanceNucleicAcid', 'SubstancePolymer', 'SubstanceProtein', 'SubstanceReferenceInformation',
                 'SubstanceSourceMaterial', 'SubstanceSpecification', 'SupplyDelivery', 'SupplyRequest', 'Task',
                 'TerminologyCapabilities', 'TestReport', 'TestScript', 'ValueSet', 'VerificationResult',
                 'VisionPrescription']

    data_dir: Path = Path(__file__).parent.joinpath('./')

    for resource in resources:
        # first see if the folder exists
        resource_folder = data_dir.joinpath(resource.lower())
        if not os.path.exists(resource_folder):
            # 1. create folder
            os.mkdir(resource_folder)
            # 2. create service file
            resource_file_name = resource_folder.joinpath(f"{resource.lower()}.service.js")
            service_code = f"""
const {{ COLLECTION }} = require('../../constants');
const base_service = require('../base/base.service');

const resource_name = '{resource}';
const collection_name = COLLECTION.{resource.upper()};

module.exports.search = (args) =>
  base_service.search(args, resource_name, collection_name);

module.exports.searchById = (args) =>
  base_service.searchById(args, resource_name, collection_name);

module.exports.create = (args, {{ req }}) =>
  base_service.create(args, {{ req }}, resource_name, collection_name);

module.exports.update = (args, {{ req }}) =>
  base_service.update(args, {{ req }}, resource_name, collection_name);

module.exports.remove = (args, context) =>
  base_service.remove(args, context, resource_name, collection_name);

module.exports.searchByVersionId = (args, context) =>
  base_service.search(args, context, resource_name, collection_name);

module.exports.history = (args) =>
  base_service.history(args, context, resource_name, collection_name);

module.exports.historyById = (args, context) =>
  base_service.historyById(args, context, resource_name, collection_name);

module.exports.patch = (args, context) =>
  base_service.patch(args, context, resource_name, collection_name);
            """
            # 3. add config.js entry
            with open(resource_file_name, "w") as file:
                file.write(service_code)
    return True


if __name__ == "__main__":
    exit(main())
