const { VERSIONS } = require('@asymmetrik/node-fhir-server-core').constants;
const env = require('var');

/**
 * @name mongoConfig
 * @summary Configurations for our Mongo instance
 */
let mongoConfig = {
  connection: `mongodb://${env.MONGO_HOSTNAME}:${env.MONGO_PORT}`,
  db_name: env.MONGO_DB_NAME,
  options: {
    auto_reconnect: true,
  },
};

// Set up whitelist
let whitelist_env = (env.WHITELIST && env.WHITELIST.split(',').map((host) => host.trim())) || false;

// If no whitelist is present, disable cors
// If it's length is 1, set it to a string, so * works
// If there are multiple, keep them as an array
let whitelist = whitelist_env && whitelist_env.length === 1 ? whitelist_env[0] : whitelist_env;

/**
 * @name fhirServerConfig
 * @summary @asymmetrik/node-fhir-server-core configurations.
 */
let fhirServerConfig = {
  auth: {
    // This servers URI
    resourceServer: env.RESOURCE_SERVER,
    //
    // if you use this strategy, you need to add the corresponding env vars to docker-compose
    //
    // strategy: {
    // 	name: 'bearer',
    // 	useSession: false,
    // 	service: './src/strategies/bearer.strategy.js'
    // },
  },
  server: {
    // support various ENV that uses PORT vs SERVER_PORT
    port: env.PORT || env.SERVER_PORT,
    // allow Access-Control-Allow-Origin
    corsOptions: {
      maxAge: 86400,
      origin: whitelist,
    },
  },
  logging: {
    level: env.LOGGING_LEVEL,
  },
  //
  // If you want to set up conformance statement with security enabled
  // Uncomment the following block
  //
  security: [
    {
      url: 'authorize',
      valueUri: `${env.AUTH_SERVER_URI}/authorize`,
    },
    {
      url: 'token',
      valueUri: `${env.AUTH_SERVER_URI}/token`,
    },
    // optional - registration
  ],
  //
  // Add any profiles you want to support.  Each profile can support multiple versions
  // if supported by core.  To support multiple versions, just add the versions to the array.
  //
  // Example:
  // Account: {
  //		service: './src/services/account/account.service.js',
  //		versions: [ VERSIONS['4_0_0'], VERSIONS['3_0_1'], VERSIONS['1_0_2'] ]
  // },
  //
  profiles: {
    Account: {
      service: './src/services/account/account.service.js',
      versions: [VERSIONS['4_0_0']],
    },
    ActivityDefinition: {
      service: './src/services/activitydefinition/activitydefinition.service.js',
      versions: [VERSIONS['4_0_0']],
    },
    AdverseEvent: {
      service: './src/services/adverseevent/adverseevent.service.js',
      versions: [VERSIONS['4_0_0']],
    },
    AllergyIntolerance: {
      service: './src/services/allergyintolerance/allergyintolerance.service.js',
      versions: [VERSIONS['4_0_0']],
    },
    Appointment: {
      service: './src/services/appointment/appointment.service.js',
      versions: [VERSIONS['4_0_0']],
    },
    AppointmentResponse: {
      service: './src/services/appointmentresponse/appointmentresponse.service.js',
      versions: [VERSIONS['4_0_0']],
    },
    AuditEvent: {
      service: './src/services/auditevent/auditevent.service.js',
      versions: [VERSIONS['4_0_0']],
    },
    Basic: {
      service: './src/services/basic/basic.service.js',
      versions: [VERSIONS['4_0_0']],
    },
    Binary: {
      service: './src/services/binary/binary.service.js',
      versions: [VERSIONS['4_0_0']],
    },
    Bundle: {
      service: './src/services/bundle/bundle.service.js',
      versions: [VERSIONS['4_0_0']],
    },
    CapabilityStatement: {
      service: './src/services/capabilitystatement/capabilitystatement.service.js',
      versions: [VERSIONS['4_0_0']],
    },
    CarePlan: {
      service: './src/services/careplan/careplan.service.js',
      versions: [VERSIONS['4_0_0']],
    },
    CareTeam: {
      service: './src/services/careteam/careteam.service.js',
      versions: [VERSIONS['4_0_0']],
    },
    ChargeItem: {
      service: './src/services/chargeitem/chargeitem.service.js',
      versions: [VERSIONS['4_0_0']],
    },
    Claim: {
      service: './src/services/claim/claim.service.js',
      versions: [VERSIONS['4_0_0']],
    },
    ClaimResponse: {
      service: './src/services/claimresponse/claimresponse.service.js',
      versions: [VERSIONS['4_0_0']],
    },
    ClinicalImpression: {
      service: './src/services/clinicalimpression/clinicalimpression.service.js',
      versions: [VERSIONS['4_0_0']],
    },
    CodeSystem: {
      service: './src/services/codesystem/codesystem.service.js',
      versions: [VERSIONS['4_0_0']],
    },
    Communication: {
      service: './src/services/communication/communication.service.js',
      versions: [VERSIONS['4_0_0']],
    },
    CommunicationRequest: {
      service: './src/services/communicationrequest/communicationrequest.service.js',
      versions: [VERSIONS['4_0_0']],
    },
    CompartmentDefinition: {
      service: './src/services/compartmentdefinition/compartmentdefinition.service.js',
      versions: [VERSIONS['4_0_0']],
    },
    Composition: {
      service: './src/services/composition/composition.service.js',
      versions: [VERSIONS['4_0_0']],
    },
    ConceptMap: {
      service: './src/services/conceptmap/conceptmap.service.js',
      versions: [VERSIONS['4_0_0']],
    },
    Condition: {
      service: './src/services/condition/condition.service.js',
      versions: [VERSIONS['4_0_0']],
    },
    Consent: {
      service: './src/services/consent/consent.service.js',
      versions: [VERSIONS['4_0_0']],
    },
    Contract: {
      service: './src/services/contract/contract.service.js',
      versions: [VERSIONS['4_0_0']],
    },
    Coverage: {
      service: './src/services/coverage/coverage.service.js',
      versions: [VERSIONS['4_0_0']],
    },
    CoverageEligibilityRequest: {
      service: './src/services/coverageeligibilityrequest/coverageeligibilityrequest.service.js',
      versions: [VERSIONS['4_0_0']],
    },
    CoverageEligibilityResponse: {
      service: './src/services/coverageeligibilityresponse/coverageeligibilityresponse.service.js',
      versions: [VERSIONS['4_0_0']],
    },
    DetectedIssue: {
      service: './src/services/detectedissue/detectedissue.service.js',
      versions: [VERSIONS['4_0_0']],
    },
    Device: {
      service: './src/services/device/device.service.js',
      versions: [VERSIONS['4_0_0']],
    },
    DeviceDefinition: {
      service: './src/services/devicedefinition/devicedefinition.service.js',
      versions: [VERSIONS['4_0_0']],
    },
    DeviceMetric: {
      service: './src/services/devicemetric/devicemetric.service.js',
      versions: [VERSIONS['4_0_0']],
    },
    DeviceRequest: {
      service: './src/services/devicerequest/devicerequest.service.js',
      versions: [VERSIONS['4_0_0']],
    },
    DeviceUseStatement: {
      service: './src/services/deviceusestatement/deviceusestatement.service.js',
      versions: [VERSIONS['4_0_0']],
    },
    DiagnosticReport: {
      service: './src/services/diagnosticreport/diagnosticreport.service.js',
      versions: [VERSIONS['4_0_0']],
    },
    DocumentManifest: {
      service: './src/services/documentmanifest/documentmanifest.service.js',
      versions: [VERSIONS['4_0_0']],
    },
    DocumentReference: {
      service: './src/services/documentreference/documentreference.service.js',
      versions: [VERSIONS['4_0_0']],
    },
    Encounter: {
      service: './src/services/encounter/encounter.service.js',
      versions: [VERSIONS['4_0_0']],
    },
    Endpoint: {
      service: './src/services/endpoint/endpoint.service.js',
      versions: [VERSIONS['4_0_0']],
    },
    EnrollmentRequest: {
      service: './src/services/enrollmentrequest/enrollmentrequest.service.js',
      versions: [VERSIONS['4_0_0']],
    },
    EnrollmentResponse: {
      service: './src/services/enrollmentresponse/enrollmentresponse.service.js',
      versions: [VERSIONS['4_0_0']],
    },
    EpisodeOfCare: {
      service: './src/services/episodeofcare/episodeofcare.service.js',
      versions: [VERSIONS['4_0_0']],
    },
    EventDefinition: {
      service: './src/services/eventdefinition/eventdefinition.service.js',
      versions: [VERSIONS['4_0_0']],
    },
    ExampleScenario: {
      service: './src/services/examplescenario/examplescenario.service.js',
      versions: [VERSIONS['4_0_0']],
    },
    ExplanationOfBenefit: {
      service: './src/services/explanationofbenefit/explanationofbenefit.service.js',
      versions: [VERSIONS['4_0_0']],
    },
    FamilyMemberHistory: {
      service: './src/services/familymemberhistory/familymemberhistory.service.js',
      versions: [VERSIONS['4_0_0']],
    },
    Flag: {
      service: './src/services/flag/flag.service.js',
      versions: [VERSIONS['4_0_0']],
    },
    Goal: {
      service: './src/services/goal/goal.service.js',
      versions: [VERSIONS['4_0_0']],
    },
    GraphDefinition: {
      service: './src/services/graphdefinition/graphdefinition.service.js',
      versions: [VERSIONS['4_0_0']],
    },
    Group: {
      service: './src/services/group/group.service.js',
      versions: [VERSIONS['4_0_0']],
    },
    GuidanceResponse: {
      service: './src/services/guidanceresponse/guidanceresponse.service.js',
      versions: [VERSIONS['4_0_0']],
    },
    HealthcareService: {
      service: './src/services/healthcareservice/healthcareservice.service.js',
      versions: [VERSIONS['4_0_0']],
    },
    ImagingStudy: {
      service: './src/services/imagingstudy/imagingstudy.service.js',
      versions: [VERSIONS['4_0_0']],
    },
    Immunization: {
      service: './src/services/immunization/immunization.service.js',
      versions: [VERSIONS['4_0_0']],
    },
    ImmunizationEvaluation: {
      service: './src/services/immunizationevaluation/immunizationevaluation.service.js',
      versions: [VERSIONS['4_0_0']],
    },
    ImmunizationRecommendation: {
      service: './src/services/immunizationrecommendation/immunizationrecommendation.service.js',
      versions: [VERSIONS['4_0_0']],
    },
    ImplementationGuide: {
      service: './src/services/implementationguide/implementationguide.service.js',
      versions: [VERSIONS['4_0_0']],
    },
    InsurancePlan: {
      service: './src/services/insuranceplan/insuranceplan.service.js',
      versions: [VERSIONS['4_0_0']],
    },
    Invoice: {
      service: './src/services/invoice/invoice.service.js',
      versions: [VERSIONS['4_0_0']],
    },
    Library: {
      service: './src/services/library/library.service.js',
      versions: [VERSIONS['4_0_0']],
    },
    Linkage: {
      service: './src/services/linkage/linkage.service.js',
      versions: [VERSIONS['4_0_0']],
    },
    List: {
      service: './src/services/list/list.service.js',
      versions: [VERSIONS['4_0_0']],
    },
    Location: {
      service: './src/services/location/location.service.js',
      versions: [VERSIONS['4_0_0']],
    },
    Measure: {
      service: './src/services/measure/measure.service.js',
      versions: [VERSIONS['4_0_0']],
    },
    MeasureReport: {
      service: './src/services/measurereport/measurereport.service.js',
      versions: [VERSIONS['4_0_0']],
    },
    Media: {
      service: './src/services/media/media.service.js',
      versions: [VERSIONS['4_0_0']],
    },
    Medication: {
      service: './src/services/medication/medication.service.js',
      versions: [VERSIONS['4_0_0']],
    },
    MedicationAdministration: {
      service: './src/services/medicationadministration/medicationadministration.service.js',
      versions: [VERSIONS['4_0_0']],
    },
    MedicationDispense: {
      service: './src/services/medicationdispense/medicationdispense.service.js',
      versions: [VERSIONS['4_0_0']],
    },
    MedicationKnowledge: {
      service: './src/services/medicationknowledge/medicationknowledge.service.js',
      versions: [VERSIONS['4_0_0']],
    },
    MedicationRequest: {
      service: './src/services/medicationrequest/medicationrequest.service.js',
      versions: [VERSIONS['4_0_0']],
    },
    MedicationStatement: {
      service: './src/services/medicationstatement/medicationstatement.service.js',
      versions: [VERSIONS['4_0_0']],
    },
    MedicinalProduct: {
      service: './src/services/medicinalproduct/medicinalproduct.service.js',
      versions: [VERSIONS['4_0_0']],
    },
    MedicinalProductAuthorization: {
      service: './src/services/medicinalproductauthorization/medicinalproductauthorization.service.js',
      versions: [VERSIONS['4_0_0']],
    },
    MedicinalProductContraindication: {
      service: './src/services/medicinalproductcontraindication/medicinalproductcontraindication.service.js',
      versions: [VERSIONS['4_0_0']],
    },
    MedicinalProductIndication: {
      service: './src/services/medicinalproductindication/medicinalproductindication.service.js',
      versions: [VERSIONS['4_0_0']],
    },
    MedicinalProductPackaged: {
      service: './src/services/medicinalproductpackaged/medicinalproductpackaged.service.js',
      versions: [VERSIONS['4_0_0']],
    },
    MedicinalProductPharmaceutical: {
      service: './src/services/medicinalproductpharmaceutical/medicinalproductpharmaceutical.service.js',
      versions: [VERSIONS['4_0_0']],
    },
    MessageDefinition: {
      service: './src/services/messagedefinition/messagedefinition.service.js',
      versions: [VERSIONS['4_0_0']],
    },
    MessageHeader: {
      service: './src/services/messageheader/messageheader.service.js',
      versions: [VERSIONS['4_0_0']],
    },
    MolecularSequence: {
      service: './src/services/molecularsequence/molecularsequence.service.js',
      versions: [VERSIONS['4_0_0']],
    },
    NamingSystem: {
      service: './src/services/namingsystem/namingsystem.service.js',
      versions: [VERSIONS['4_0_0']],
    },
    NutritionOrder: {
      service: './src/services/nutritionorder/nutritionorder.service.js',
      versions: [VERSIONS['4_0_0']],
    },
    Observation: {
      service: './src/services/observation/observation.service.js',
      versions: [VERSIONS['4_0_0']],
      operation: [
        {
          name: 'everything',
          route: '/$everything',
          method: 'GET',
          reference: 'https://www.hl7.org/fhir/patient-operation-everything.html',
        },
        {
          name: 'merge',
          route: '/:id/$merge',
          method: 'PUT',
          reference: 'https://www.hl7.org/fhir/patient-operation-everything.html',
        },
      ],
    },
    OperationDefinition: {
      service: './src/services/operationdefinition/operationdefinition.service.js',
      versions: [VERSIONS['4_0_0']],
    },
    Organization: {
      service: './src/services/organization/organization.service.js',
      versions: [VERSIONS['4_0_0']],
    },
    OrganizationAffiliation: {
      service: './src/services/organizationaffiliation/organizationaffiliation.service.js',
      versions: [VERSIONS['4_0_0']],
    },
    Patient: {
      service: './src/services/patient/patient.service.js',
      versions: [VERSIONS['4_0_0']],
    },
    PaymentNotice: {
      service: './src/services/paymentnotice/paymentnotice.service.js',
      versions: [VERSIONS['4_0_0']],
    },
    PaymentReconciliation: {
      service: './src/services/paymentreconciliation/paymentreconciliation.service.js',
      versions: [VERSIONS['4_0_0']],
    },
    Person: {
      service: './src/services/person/person.service.js',
      versions: [VERSIONS['4_0_0']],
    },
    PlanDefinition: {
      service: './src/services/plandefinition/plandefinition.service.js',
      versions: [VERSIONS['4_0_0']],
    },
    Practitioner: {
      service: './src/services/practitioner/practitioner.service.js',
      versions: [VERSIONS['4_0_0']],
    },
    PractitionerRole: {
      service: './src/services/practitionerrole/practitionerrole.service.js',
      versions: [VERSIONS['4_0_0']],
    },
    Procedure: {
      service: './src/services/procedure/procedure.service.js',
      versions: [VERSIONS['4_0_0']],
    },
    Provenance: {
      service: './src/services/provenance/provenance.service.js',
      versions: [VERSIONS['4_0_0']],
    },
    Questionnaire: {
      service: './src/services/questionnaire/questionnaire.service.js',
      versions: [VERSIONS['4_0_0']],
    },
    QuestionnaireResponse: {
      service: './src/services/questionnaireresponse/questionnaireresponse.service.js',
      versions: [VERSIONS['4_0_0']],
    },
    RelatedPerson: {
      service: './src/services/relatedperson/relatedperson.service.js',
      versions: [VERSIONS['4_0_0']],
    },
    RequestGroup: {
      service: './src/services/requestgroup/requestgroup.service.js',
      versions: [VERSIONS['4_0_0']],
    },
    ResearchDefinition: {
      service: './src/services/researchdefinition/researchdefinition.service.js',
      versions: [VERSIONS['4_0_0']],
    },
    ResearchElementDefinition: {
      service: './src/services/researchelementdefinition/researchelementdefinition.service.js',
      versions: [VERSIONS['4_0_0']],
    },
    ResearchStudy: {
      service: './src/services/researchstudy/researchstudy.service.js',
      versions: [VERSIONS['4_0_0']],
    },
    ResearchSubject: {
      service: './src/services/researchsubject/researchsubject.service.js',
      versions: [VERSIONS['4_0_0']],
    },
    RiskAssessment: {
      service: './src/services/riskassessment/riskassessment.service.js',
      versions: [VERSIONS['4_0_0']],
    },
    RiskEvidenceSynthesis: {
      service: './src/services/riskevidencesynthesis/riskevidencesynthesis.service.js',
      versions: [VERSIONS['4_0_0']],
    },
    Schedule: {
      service: './src/services/schedule/schedule.service.js',
      versions: [VERSIONS['4_0_0']],
    },
    SearchParameter: {
      service: './src/services/searchparameter/searchparameter.service.js',
      versions: [VERSIONS['4_0_0']],
    },
    ServiceRequest: {
      service: './src/services/servicerequest/servicerequest.service.js',
      versions: [VERSIONS['4_0_0']],
    },
    Slot: {
      service: './src/services/slot/slot.service.js',
      versions: [VERSIONS['4_0_0']],
    },
    Specimen: {
      service: './src/services/specimen/specimen.service.js',
      versions: [VERSIONS['4_0_0']],
    },
    SpecimenDefinition: {
      service: './src/services/specimendefinition/specimendefinition.service.js',
      versions: [VERSIONS['4_0_0']],
    },
    StructureDefinition: {
      service: './src/services/structuredefinition/structuredefinition.service.js',
      versions: [VERSIONS['4_0_0']],
    },
    StructureMap: {
      service: './src/services/structuremap/structuremap.service.js',
      versions: [VERSIONS['4_0_0']],
    },
    Subscription: {
      service: './src/services/subscription/subscription.service.js',
      versions: [VERSIONS['4_0_0']],
    },
    Substance: {
      service: './src/services/substance/substance.service.js',
      versions: [VERSIONS['4_0_0']],
    },
    SubstanceSpecification: {
      service: './src/services/substancespecification/substancespecification.service.js',
      versions: [VERSIONS['4_0_0']],
    },
    SupplyDelivery: {
      service: './src/services/supplydelivery/supplydelivery.service.js',
      versions: [VERSIONS['4_0_0']],
    },
    SupplyRequest: {
      service: './src/services/supplyrequest/supplyrequest.service.js',
      versions: [VERSIONS['4_0_0']],
    },
    Task: {
      service: './src/services/task/task.service.js',
      versions: [VERSIONS['4_0_0']],
    },
    TerminologyCapabilities: {
      service: './src/services/terminologycapabilities/terminologycapabilities.service.js',
      versions: [VERSIONS['4_0_0']],
    },
    TestReport: {
      service: './src/services/testreport/testreport.service.js',
      versions: [VERSIONS['4_0_0']],
    },
    TestScript: {
      service: './src/services/testscript/testscript.service.js',
      versions: [VERSIONS['4_0_0']],
    },
    ValueSet: {
      service: './src/services/valueset/valueset.service.js',
      versions: [VERSIONS['4_0_0']],
    },
    VerificationResult: {
      service: './src/services/verificationresult/verificationresult.service.js',
      versions: [VERSIONS['4_0_0']],
    },
    VisionPrescription: {
      service: './src/services/visionprescription/visionprescription.service.js',
      versions: [VERSIONS['4_0_0']],
    },
  },
};

module.exports = {
  fhirServerConfig,
  mongoConfig,
};
