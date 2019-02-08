const { VERSIONS, RESOURCES } = require('@asymmetrik/node-fhir-server-core').constants;
const env = require('var');


/**
 * @name mongoConfig
 * @summary Configurations for our Mongo instance
 */
let mongoConfig = {
	connection: `mongodb://${env.MONGO_HOSTNAME}`,
	db_name: env.MONGO_DB_NAME,
	options: {
		auto_reconnect: true,
		useNewUrlParser: true, // Old parser is deprecated, useNewUrlParser is recommended.
	}
};



// Set up whitelist
let whitelist_env = env.WHITELIST && env.WHITELIST.split(',').map(host => host.trim()) || false;

// If no whitelist is present, disable cors
// If it's length is 1, set it to a string, so * works
// If there are multiple, keep them as an array
let whitelist = whitelist_env && whitelist_env.length === 1
	? whitelist_env[0]
	: whitelist_env;

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
			origin: whitelist
		}
	},
	logging: {
		level: env.LOGGING_LEVEL
	},
	//
	// If you want to set up conformance statement with security enabled
	// Uncomment the following block
	//
	security: [
		{
			url: 'authorize',
			valueUri: `${env.AUTH_SERVER_URI}/authorize`
		},
		{
			url: 'token',
			valueUri: `${env.AUTH_SERVER_URI}/token`
		}
		// optional - registration
	],
	//
	// Comment out any profiles you do not wish to support.  Each profile can support multiple versions
	// if supported by core.  We currently only have 3_0_1 profiles but will soon support DSTU2 and R4 versions.
	// Once available, to support multiple versions, just add the versions to the array.
	//
	// Example:
	// [RESOURCES.ACCOUNT]: {
	//		service: './src/services/account/account.service.js',
	//		versions: [ VERSIONS['3_0_1'], VERSIONS['1_0_2'] ]
	// },
	//
	profiles: {
		[RESOURCES.ORGANIZATION]: {
			service: './src/services/organization/organization.service.js',
			versions: [ VERSIONS['3_0_1'], VERSIONS['1_0_2'] ]
		},
		[RESOURCES.PATIENT]: {
			service: './src/services/patient/patient.service.js',
			versions: [ VERSIONS['3_0_1'], VERSIONS['1_0_2'] ]
		},
		// [RESOURCES.ACCOUNT]: {
		// 	service: './src/services/account/account.service.js',
		// 	versions: [ VERSIONS['3_0_1'] ]
		// },
		// [RESOURCES.ACTIVITYDEFINITION]: {
		// 	service: './src/services/activitydefinition/activitydefinition.service.js',
		// 	versions: [ VERSIONS['3_0_1'] ]
		// },
		// [RESOURCES.ADVERSEEVENT]: {
		// 	service: './src/services/adverseevent/adverseevent.service.js',
		// 	versions: [ VERSIONS['3_0_1'] ]
		// },
		// [RESOURCES.ALLERGYINTOLERANCE]: {
		// 	service: './src/services/allergyintolerance/allergyintolerance.service.js',
		// 	versions: [ VERSIONS['3_0_1'] ]
		// },
		// [RESOURCES.APPOINTMENT]: {
		// 	service: './src/services/appointment/appointment.service.js',
		// 	versions: [ VERSIONS['3_0_1'] ]
		// },
		// [RESOURCES.APPOINTMENTRESPONSE]: {
		// 	service: './src/services/appointmentresponse/appointmentresponse.service.js',
		// 	versions: [ VERSIONS['3_0_1'] ]
		// },
		// [RESOURCES.AUDITEVENT]: {
		// 	service: './src/services/auditevent/auditevent.service.js',
		// 	versions: [ VERSIONS['3_0_1'] ]
		// },
		// [RESOURCES.BASIC]: {
		// 	service: './src/services/basic/basic.service.js',
		// 	versions: [ VERSIONS['3_0_1'] ]
		// },
		// [RESOURCES.BINARY]: {
		// 	service: './src/services/binary/binary.service.js',
		// 	versions: [ VERSIONS['3_0_1'] ]
		// },
		// [RESOURCES.BODYSITE]: {
		// 	service: './src/services/bodysite/bodysite.service.js',
		// 	versions: [ VERSIONS['3_0_1'] ]
		// },
		// [RESOURCES.BUNDLE]: {
		// 	service: './src/services/bundle/bundle.service.js',
		// 	versions: [ VERSIONS['3_0_1'] ]
		// },
		// [RESOURCES.CAPABILITYSTATEMENT]: {
		// 	service: './src/services/capabilitystatement/capabilitystatement.service.js',
		// 	versions: [ VERSIONS['3_0_1'] ]
		// },
		// [RESOURCES.CAREPLAN]: {
		// 	service: './src/services/careplan/careplan.service.js',
		// 	versions: [ VERSIONS['3_0_1'] ]
		// },
		// [RESOURCES.CARETEAM]: {
		// 	service: './src/services/careteam/careteam.service.js',
		// 	versions: [ VERSIONS['3_0_1'] ]
		// },
		// [RESOURCES.CHARGEITEM]: {
		// 	service: './src/services/chargeitem/chargeitem.service.js',
		// 	versions: [ VERSIONS['3_0_1'] ]
		// },
		// [RESOURCES.CLAIM]: {
		// 	service: './src/services/claim/claim.service.js',
		// 	versions: [ VERSIONS['3_0_1'] ]
		// },
		// [RESOURCES.CLAIMRESPONSE]: {
		// 	service: './src/services/claimresponse/claimresponse.service.js',
		// 	versions: [ VERSIONS['3_0_1'] ]
		// },
		// [RESOURCES.CLINICALIMPRESSION]: {
		// 	service: './src/services/clinicalimpression/clinicalimpression.service.js',
		// 	versions: [ VERSIONS['3_0_1'] ]
		// },
		// [RESOURCES.CODESYSTEM]: {
		// 	service: './src/services/codesystem/codesystem.service.js',
		// 	versions: [ VERSIONS['3_0_1'] ]
		// },
		// [RESOURCES.COMMUNICATION]: {
		// 	service: './src/services/communication/communication.service.js',
		// 	versions: [ VERSIONS['3_0_1'] ]
		// },
		// [RESOURCES.COMMUNICATIONREQUEST]: {
		// 	service: './src/services/communicationrequest/communicationrequest.service.js',
		// 	versions: [ VERSIONS['3_0_1'] ]
		// },
		// [RESOURCES.COMPARTMENTDEFINITION]: {
		// 	service: './src/services/compartmentdefinition/compartmentdefinition.service.js',
		// 	versions: [ VERSIONS['3_0_1'] ]
		// },
		// [RESOURCES.COMPOSITION]: {
		// 	service: './src/services/composition/composition.service.js',
		// 	versions: [ VERSIONS['3_0_1'] ]
		// },
		// [RESOURCES.CONCEPTMAP]: {
		// 	service: './src/services/conceptmap/conceptmap.service.js',
		// 	versions: [ VERSIONS['3_0_1'] ]
		// },
		// [RESOURCES.CONDITION]: {
		// 	service: './src/services/condition/condition.service.js',
		// 	versions: [ VERSIONS['3_0_1'] ]
		// },
		// [RESOURCES.CONSENT]: {
		// 	service: './src/services/consent/consent.service.js',
		// 	versions: [ VERSIONS['3_0_1'] ]
		// },
		// [RESOURCES.CONTRACT]: {
		// 	service: './src/services/contract/contract.service.js',
		// 	versions: [ VERSIONS['3_0_1'] ]
		// },
		// [RESOURCES.COVERAGE]: {
		// 	service: './src/services/coverage/coverage.service.js',
		// 	versions: [ VERSIONS['3_0_1'] ]
		// },
		// [RESOURCES.DATAELEMENT]: {
		// 	service: './src/services/dataelement/dataelement.service.js',
		// 	versions: [ VERSIONS['3_0_1'] ]
		// },
		// [RESOURCES.DETECTEDISSUE]: {
		// 	service: './src/services/detectedissue/detectedissue.service.js',
		// 	versions: [ VERSIONS['3_0_1'] ]
		// },
		// [RESOURCES.DEVICE]: {
		// 	service: './src/services/device/device.service.js',
		// 	versions: [ VERSIONS['3_0_1'] ]
		// },
		// [RESOURCES.DEVICECOMPONENT]: {
		// 	service: './src/services/devicecomponent/devicecomponent.service.js',
		// 	versions: [ VERSIONS['3_0_1'] ]
		// },
		// [RESOURCES.DEVICEMETRIC]: {
		// 	service: './src/services/devicemetric/devicemetric.service.js',
		// 	versions: [ VERSIONS['3_0_1'] ]
		// },
		// [RESOURCES.DEVICEREQUEST]: {
		// 	service: './src/services/devicerequest/devicerequest.service.js',
		// 	versions: [ VERSIONS['3_0_1'] ]
		// },
		// [RESOURCES.DEVICEUSESTATEMENT]: {
		// 	service: './src/services/deviceusestatement/deviceusestatement.service.js',
		// 	versions: [ VERSIONS['3_0_1'] ]
		// },
		// [RESOURCES.DIAGNOSTICREPORT]: {
		// 	service: './src/services/diagnosticreport/diagnosticreport.service.js',
		// 	versions: [ VERSIONS['3_0_1'] ]
		// },
		// [RESOURCES.DOCUMENTMANIFEST]: {
		// 	service: './src/services/documentmanifest/documentmanifest.service.js',
		// 	versions: [ VERSIONS['3_0_1'] ]
		// },
		// [RESOURCES.DOCUMENTREFERENCE]: {
		// 	service: './src/services/documentreference/documentreference.service.js',
		// 	versions: [ VERSIONS['3_0_1'] ]
		// },
		// [RESOURCES.ELIGIBILITYREQUEST]: {
		// 	service: './src/services/eligibilityrequest/eligibilityrequest.service.js',
		// 	versions: [ VERSIONS['3_0_1'] ]
		// },
		// [RESOURCES.ELIGIBILITYRESPONSE]: {
		// 	service: './src/services/eligibilityresponse/eligibilityresponse.service.js',
		// 	versions: [ VERSIONS['3_0_1'] ]
		// },
		// [RESOURCES.ENCOUNTER]: {
		// 	service: './src/services/encounter/encounter.service.js',
		// 	versions: [ VERSIONS['3_0_1'] ]
		// },
		// [RESOURCES.ENDPOINT]: {
		// 	service: './src/services/endpoint/endpoint.service.js',
		// 	versions: [ VERSIONS['3_0_1'] ]
		// },
		// [RESOURCES.ENROLLMENTREQUEST]: {
		// 	service: './src/services/enrollmentrequest/enrollmentrequest.service.js',
		// 	versions: [ VERSIONS['3_0_1'] ]
		// },
		// [RESOURCES.ENROLLMENTRESPONSE]: {
		// 	service: './src/services/enrollmentresponse/enrollmentresponse.service.js',
		// 	versions: [ VERSIONS['3_0_1'] ]
		// },
		// [RESOURCES.EPISODEOFCARE]: {
		// 	service: './src/services/episodeofcare/episodeofcare.service.js',
		// 	versions: [ VERSIONS['3_0_1'] ]
		// },
		// [RESOURCES.EXPANSIONPROFILE]: {
		// 	service: './src/services/expansionprofile/expansionprofile.service.js',
		// 	versions: [ VERSIONS['3_0_1'] ]
		// },
		// [RESOURCES.EXPLANATIONOFBENEFIT]: {
		// 	service: './src/services/explanationofbenefit/explanationofbenefit.service.js',
		// 	versions: [ VERSIONS['3_0_1'] ]
		// },
		// [RESOURCES.FAMILYMEMBERHISTORY]: {
		// 	service: './src/services/familymemberhistory/familymemberhistory.service.js',
		// 	versions: [ VERSIONS['3_0_1'] ]
		// },
		// [RESOURCES.FLAG]: {
		// 	service: './src/services/flag/flag.service.js',
		// 	versions: [ VERSIONS['3_0_1'] ]
		// },
		// [RESOURCES.GOAL]: {
		// 	service: './src/services/goal/goal.service.js',
		// 	versions: [ VERSIONS['3_0_1'] ]
		// },
		// [RESOURCES.GRAPHDEFINITION]: {
		// 	service: './src/services/graphdefinition/graphdefinition.service.js',
		// 	versions: [ VERSIONS['3_0_1'] ]
		// },
		// [RESOURCES.GROUP]: {
		// 	service: './src/services/group/group.service.js',
		// 	versions: [ VERSIONS['3_0_1'] ]
		// },
		// [RESOURCES.GUIDANCERESPONSE]: {
		// 	service: './src/services/guidanceresponse/guidanceresponse.service.js',
		// 	versions: [ VERSIONS['3_0_1'] ]
		// },
		// [RESOURCES.HEALTHCARESERVICE]: {
		// 	service: './src/services/healthcareservice/healthcareservice.service.js',
		// 	versions: [ VERSIONS['3_0_1'] ]
		// },
		// [RESOURCES.IMAGINGMANIFEST]: {
		// 	service: './src/services/imagingmanifest/imagingmanifest.service.js',
		// 	versions: [ VERSIONS['3_0_1'] ]
		// },
		// [RESOURCES.IMAGINGSTUDY]: {
		// 	service: './src/services/imagingstudy/imagingstudy.service.js',
		// 	versions: [ VERSIONS['3_0_1'] ]
		// },
		// [RESOURCES.IMMUNIZATION]: {
		// 	service: './src/services/immunization/immunization.service.js',
		// 	versions: [ VERSIONS['3_0_1'] ]
		// },
		// [RESOURCES.IMMUNIZATIONRECOMMENDATION]: {
		// 	service: './src/services/immunizationrecommendation/immunizationrecommendation.service.js',
		// 	versions: [ VERSIONS['3_0_1'] ]
		// },
		// [RESOURCES.IMPLEMENTATIONGUIDE]: {
		// 	service: './src/services/implementationguide/implementationguide.service.js',
		// 	versions: [ VERSIONS['3_0_1'] ]
		// },
		// [RESOURCES.LIBRARY]: {
		// 	service: './src/services/library/library.service.js',
		// 	versions: [ VERSIONS['3_0_1'] ]
		// },
		// [RESOURCES.LINKAGE]: {
		// 	service: './src/services/linkage/linkage.service.js',
		// 	versions: [ VERSIONS['3_0_1'] ]
		// },
		// [RESOURCES.LIST]: {
		// 	service: './src/services/list/list.service.js',
		// 	versions: [ VERSIONS['3_0_1'] ]
		// },
		// [RESOURCES.LOCATION]: {
		// 	service: './src/services/location/location.service.js',
		// 	versions: [ VERSIONS['3_0_1'] ]
		// },
		// [RESOURCES.MEASURE]: {
		// 	service: './src/services/measure/measure.service.js',
		// 	versions: [ VERSIONS['3_0_1'] ]
		// },
		// [RESOURCES.MEASUREREPORT]: {
		// 	service: './src/services/measurereport/measurereport.service.js',
		// 	versions: [ VERSIONS['3_0_1'] ]
		// },
		// [RESOURCES.MEDIA]: {
		// 	service: './src/services/media/media.service.js',
		// 	versions: [ VERSIONS['3_0_1'] ]
		// },
		// [RESOURCES.MEDICATION]: {
		// 	service: './src/services/medication/medication.service.js',
		// 	versions: [ VERSIONS['3_0_1'] ]
		// },
		// [RESOURCES.MEDICATIONADMINISTRATION]: {
		// 	service: './src/services/medicationadministration/medicationadministration.service.js',
		// 	versions: [ VERSIONS['3_0_1'] ]
		// },
		// [RESOURCES.MEDICATIONDISPENSE]: {
		// 	service: './src/services/medicationdispense/medicationdispense.service.js',
		// 	versions: [ VERSIONS['3_0_1'] ]
		// },
		// [RESOURCES.MEDICATIONREQUEST]: {
		// 	service: './src/services/medicationrequest/medicationrequest.service.js',
		// 	versions: [ VERSIONS['3_0_1'] ]
		// },
		// [RESOURCES.MEDICATIONSTATEMENT]: {
		// 	service: './src/services/medicationstatement/medicationstatement.service.js',
		// 	versions: [ VERSIONS['3_0_1'] ]
		// },
		// [RESOURCES.MESSAGEDEFINITION]: {
		// 	service: './src/services/messagedefinition/messagedefinition.service.js',
		// 	versions: [ VERSIONS['3_0_1'] ]
		// },
		// [RESOURCES.MESSAGEHEADER]: {
		// 	service: './src/services/messageheader/messageheader.service.js',
		// 	versions: [ VERSIONS['3_0_1'] ]
		// },
		// [RESOURCES.NAMINGSYSTEM]: {
		// 	service: './src/services/namingsystem/namingsystem.service.js',
		// 	versions: [ VERSIONS['3_0_1'] ]
		// },
		// [RESOURCES.NUTRITIONORDER]: {
		// 	service: './src/services/nutritionorder/nutritionorder.service.js',
		// 	versions: [ VERSIONS['3_0_1'] ]
		// },
		// [RESOURCES.OBSERVATION]: {
		// 	service: './src/services/observation/observation.service.js',
		// 	versions: [ VERSIONS['3_0_1'] ]
		// },
		// [RESOURCES.OPERATIONDEFINITION]: {
		// 	service: './src/services/operationdefinition/operationdefinition.service.js',
		// 	versions: [ VERSIONS['3_0_1'] ]
		// },
		// [RESOURCES.PAYMENTNOTICE]: {
		// 	service: './src/services/paymentnotice/paymentnotice.service.js',
		// 	versions: [ VERSIONS['3_0_1'] ]
		// },
		// [RESOURCES.PAYMENTRECONCILIATION]: {
		// 	service: './src/services/paymentreconciliation/paymentreconciliation.service.js',
		// 	versions: [ VERSIONS['3_0_1'] ]
		// },
		// [RESOURCES.PERSON]: {
		// 	service: './src/services/person/person.service.js',
		// 	versions: [ VERSIONS['3_0_1'] ]
		// },
		// [RESOURCES.PLANDEFINITION]: {
		// 	service: './src/services/plandefinition/plandefinition.service.js',
		// 	versions: [ VERSIONS['3_0_1'] ]
		// },
		// [RESOURCES.PRACTITIONER]: {
		// 	service: './src/services/practitioner/practitioner.service.js',
		// 	versions: [ VERSIONS['3_0_1'] ]
		// },
		// [RESOURCES.PRACTITIONERROLE]: {
		// 	service: './src/services/practitionerrole/practitionerrole.service.js',
		// 	versions: [ VERSIONS['3_0_1'] ]
		// },
		// [RESOURCES.PROCEDURE]: {
		// 	service: './src/services/procedure/procedure.service.js',
		// 	versions: [ VERSIONS['3_0_1'] ]
		// },
		// [RESOURCES.PROCEDUREREQUEST]: {
		// 	service: './src/services/procedurerequest/procedurerequest.service.js',
		// 	versions: [ VERSIONS['3_0_1'] ]
		// },
		// [RESOURCES.PROCESSREQUEST]: {
		// 	service: './src/services/processrequest/processrequest.service.js',
		// 	versions: [ VERSIONS['3_0_1'] ]
		// },
		// [RESOURCES.PROCESSRESPONSE]: {
		// 	service: './src/services/processresponse/processresponse.service.js',
		// 	versions: [ VERSIONS['3_0_1'] ]
		// },
		// [RESOURCES.PROVENANCE]: {
		// 	service: './src/services/provenance/provenance.service.js',
		// 	versions: [ VERSIONS['3_0_1'] ]
		// },
		// [RESOURCES.QUESTIONNAIRE]: {
		// 	service: './src/services/questionnaire/questionnaire.service.js',
		// 	versions: [ VERSIONS['3_0_1'] ]
		// },
		// [RESOURCES.QUESTIONNAIRERESPONSE]: {
		// 	service: './src/services/questionnaireresponse/questionnaireresponse.service.js',
		// 	versions: [ VERSIONS['3_0_1'] ]
		// },
		// [RESOURCES.REFERRALREQUEST]: {
		// 	service: './src/services/referralrequest/referralrequest.service.js',
		// 	versions: [ VERSIONS['3_0_1'] ]
		// },
		// [RESOURCES.RELATEDPERSON]: {
		// 	service: './src/services/relatedperson/relatedperson.service.js',
		// 	versions: [ VERSIONS['3_0_1'] ]
		// },
		// [RESOURCES.REQUESTGROUP]: {
		// 	service: './src/services/requestgroup/requestgroup.service.js',
		// 	versions: [ VERSIONS['3_0_1'] ]
		// },
		// [RESOURCES.RESEARCHSTUDY]: {
		// 	service: './src/services/researchstudy/researchstudy.service.js',
		// 	versions: [ VERSIONS['3_0_1'] ]
		// },
		// [RESOURCES.RESEARCHSUBJECT]: {
		// 	service: './src/services/researchsubject/researchsubject.service.js',
		// 	versions: [ VERSIONS['3_0_1'] ]
		// },
		// [RESOURCES.RISKASSESSMENT]: {
		// 	service: './src/services/riskassessment/riskassessment.service.js',
		// 	versions: [ VERSIONS['3_0_1'] ]
		// },
		// [RESOURCES.SCHEDULE]: {
		// 	service: './src/services/schedule/schedule.service.js',
		// 	versions: [ VERSIONS['3_0_1'] ]
		// },
		// [RESOURCES.SEARCHPARAMETER]: {
		// 	service: './src/services/searchparameter/searchparameter.service.js',
		// 	versions: [ VERSIONS['3_0_1'] ]
		// },
		// [RESOURCES.SEQUENCE]: {
		// 	service: './src/services/sequence/sequence.service.js',
		// 	versions: [ VERSIONS['3_0_1'] ]
		// },
		// [RESOURCES.SERVICEDEFINITION]: {
		// 	service: './src/services/servicedefinition/servicedefinition.service.js',
		// 	versions: [ VERSIONS['3_0_1'] ]
		// },
		// [RESOURCES.SLOT]: {
		// 	service: './src/services/slot/slot.service.js',
		// 	versions: [ VERSIONS['3_0_1'] ]
		// },
		// [RESOURCES.SPECIMEN]: {
		// 	service: './src/services/specimen/specimen.service.js',
		// 	versions: [ VERSIONS['3_0_1'] ]
		// },
		// [RESOURCES.STRUCTUREDEFINITION]: {
		// 	service: './src/services/structuredefinition/structuredefinition.service.js',
		// 	versions: [ VERSIONS['3_0_1'] ]
		// },
		// [RESOURCES.STRUCTUREMAP]: {
		// 	service: './src/services/structuremap/structuremap.service.js',
		// 	versions: [ VERSIONS['3_0_1'] ]
		// },
		// [RESOURCES.SUBSCRIPTION]: {
		// 	service: './src/services/subscription/subscription.service.js',
		// 	versions: [ VERSIONS['3_0_1'] ]
		// },
		// [RESOURCES.SUBSTANCE]: {
		// 	service: './src/services/substance/substance.service.js',
		// 	versions: [ VERSIONS['3_0_1'] ]
		// },
		// [RESOURCES.SUPPLYDELIVERY]: {
		// 	service: './src/services/supplydelivery/supplydelivery.service.js',
		// 	versions: [ VERSIONS['3_0_1'] ]
		// },
		// [RESOURCES.SUPPLYREQUEST]: {
		// 	service: './src/services/supplyrequest/supplyrequest.service.js',
		// 	versions: [ VERSIONS['3_0_1'] ]
		// },
		// [RESOURCES.TASK]: {
		// 	service: './src/services/task/task.service.js',
		// 	versions: [ VERSIONS['3_0_1'] ]
		// },
		// [RESOURCES.TESTREPORT]: {
		// 	service: './src/services/testreport/testreport.service.js',
		// 	versions: [ VERSIONS['3_0_1'] ]
		// },
		// [RESOURCES.TESTSCRIPT]: {
		// 	service: './src/services/testscript/testscript.service.js',
		// 	versions: [ VERSIONS['3_0_1'] ]
		// },
		// [RESOURCES.VALUESET]: {
		// 	service: './src/services/valueset/valueset.service.js',
		// 	versions: [ VERSIONS['3_0_1'] ]
		// },
		// [RESOURCES.VISIONPRESCRIPTION]: {
		// 	service: './src/services/visionprescription/visionprescription.service.js',
		// 	versions: [ VERSIONS['3_0_1'] ]
		// }
	}
};

module.exports = {
	fhirServerConfig,
	mongoConfig
};
