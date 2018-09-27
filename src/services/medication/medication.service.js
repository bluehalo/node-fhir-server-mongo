/*eslint no-unused-vars: "warn"*/
const Joi = require("joi")
const { RESOURCES } = require('@asymmetrik/node-fhir-server-core').constants;
const FHIRServer = require('@asymmetrik/node-fhir-server-core');

let getMedication = (base_version) => {
	return require(FHIRServer.resolveFromVersion(base_version, RESOURCES.MEDICATION));};

let getMeta = (base_version) => {
	return require(FHIRServer.resolveFromVersion(base_version, RESOURCES.META));};


let MED_DATA = [
	{
		"resourceType": "Medication",
		"id": "13424",
		"meta": {
			"lastUpdated": "stuff"
		},
		"code": {
			"text": "8 HR Metadate 20 MG Extended Release Oral Tablet",
			"coding": [{
				"system": "http://www.nlm.nih.gov/research/umls/rxnorm",
				"code": "1091488",
				"display": "8 HR Metadate 20 MG Extended Release Oral Tablet",
				"userSelected": false
			}]
		},
		"isBrand": true,
		"isOverTheCounter": false,
		"form": "tablet"
	}, {
		"resourceType": "Medication",
		"id": "13424",
		"meta": {
			"lastUpdated": "stuff"
		},
		"code": {
			"text": "Ritalin 5 MG Oral Tablet",
			"coding": [{
				"system": "http://www.nlm.nih.gov/research/umls/rxnorm",
				"code": "1091500",
				"display": "Ritalin 5 MG Oral Tablet",
				"userSelected": false
			}]
		},
		"isBrand": true,
		"isOverTheCounter": false,
		"form": "tablet"
	}
]

const schemaForMedication = Joi.object({
	resourceType: Joi.string()
		.valid("Medication")
		.required(),
	meta: Joi.object(),
	id: Joi.string().required(),
	code: Joi.object({
		text: Joi.string().required(),
		coding: Joi.array().items(
			Joi.object({
				system: Joi.string().required(),
				version: Joi.string(),
				code: Joi.string().required(),
				display: Joi.string().required(),
				userSelected: Joi.boolean()
			})
		)
	}),
	isBrand: Joi.boolean(),
	isOverTheCounter: Joi.boolean(),
	manufacturer: Joi.any(), // TODO: need to double check this, says it is a reference https://www.hl7.org/fhir/medication.html,
	form: Joi.any(), // TODO: need to double check this, says it is a reference https://www.hl7.org/fhir/medication.html,
	ingredient: Joi.any(), // TODO: need to double check this, says it is a reference https://www.hl7.org/fhir/medication.html,
	package: Joi.any() // TODO: need to double check this, says it is a reference https://www.hl7.org/fhir/medication.html,
})


const fhirConverted = fdbMedicationList => {

	let Medication = getMedication('3_0_1');

	return fdbMedicationList.map(fdbMed => {

		const { error, value } = Joi.validate(fdbMed, schemaForMedication)
		if (error) {
			return error
		}

		let med = new Medication(value)
		return med
	})
}

module.exports.search = (args, context, logger) => new Promise((resolve, reject) => {
	logger.info('Medication >>> search');

	// Common search params
	let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } = args;

	// Search Result params
	let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } = args;

	// Resource Specific params
	let code = args['code'];
	let container = args['container'];
	let form = args['form'];
	let ingredient = args['ingredient'];
	let ingredient_code = args['ingredient-code'];
	let manufacturer = args['manufacturer'];
	let over_the_counter = args['over-the-counter'];
	let package_item = args['package-item'];
	let package_item_code = args['package-item-code'];
	let status = args['status'];

	// TODO: Build query from Parameters

	// TODO: Query database
	let medications = fhirConverted(MED_DATA);

	// Return Array
	resolve(medications);
});

module.exports.searchById = (args, context, logger) => new Promise((resolve, reject) => {
	logger.info('Medication >>> searchById');

	let { base_version, id } = args;

	let Medication = getMedication(base_version);

	// TODO: Build query from Parameters

	// TODO: Query database

	// Cast result to Medication Class
	let medication_resource = new Medication();
	// TODO: Set data with constructor or setter methods
	medication_resource.id = 'test id';

	// Return resource class
	// resolve(medication_resource);
	resolve();
});

module.exports.create = (args, context, logger) => new Promise((resolve, reject) => {
	logger.info('Medication >>> create');

	let { base_version, id, resource } = args;

	let Medication = getMedication(base_version);
	let Meta = getMeta(base_version);

	// TODO: determine if client/server sets ID

	// Cast resource to Medication Class
	let medication_resource = new Medication(resource);
	medication_resource.meta = new Meta();
	// TODO: set meta info

	// TODO: save record to database

	// Return Id
	resolve({ id: medication_resource.id });
});

module.exports.update = (args, context, logger) => new Promise((resolve, reject) => {
	logger.info('Medication >>> update');

	let { base_version, id, resource } = args;

	let Medication = getMedication(base_version);
	let Meta = getMeta(base_version);

	// Cast resource to Medication Class
	let medication_resource = new Medication(resource);
	medication_resource.meta = new Meta();
	// TODO: set meta info, increment meta ID

	// TODO: save record to database

	// Return id, if recorded was created or updated, new meta version id
	resolve({ id: medication_resource.id, created: false, resource_version: medication_resource.meta.versionId });
});

module.exports.remove = (args, context, logger) => new Promise((resolve, reject) => {
	logger.info('Medication >>> remove');

	let { id } = args;

	// TODO: delete record in database (soft/hard)

	// Return number of records deleted
	resolve({ deleted: 0 });
});

module.exports.searchByVersionId = (args, context, logger) => new Promise((resolve, reject) => {
	logger.info('Medication >>> searchByVersionId');

	let { base_version, id, version_id } = args;

	let Medication = getMedication(base_version);

	// TODO: Build query from Parameters

	// TODO: Query database

	// Cast result to Medication Class
	let medication_resource = new Medication();

	// Return resource class
	resolve(medication_resource);
});

module.exports.history = (args, context, logger) => new Promise((resolve, reject) => {
	logger.info('Medication >>> history');

	// Common search params
	let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } = args;

	// Search Result params
	let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } = args;

	// Resource Specific params
	let code = args['code'];
	let container = args['container'];
	let form = args['form'];
	let ingredient = args['ingredient'];
	let ingredient_code = args['ingredient-code'];
	let manufacturer = args['manufacturer'];
	let over_the_counter = args['over-the-counter'];
	let package_item = args['package-item'];
	let package_item_code = args['package-item-code'];
	let status = args['status'];

	// TODO: Build query from Parameters

	// TODO: Query database

	let Medication = getMedication(base_version);







	// Cast all results to Medication Class
	let medication_resource = new Medication();

	// Return Array
	resolve([medication_resource]);
});

module.exports.historyById = (args, context, logger) => new Promise((resolve, reject) => {
	logger.info('Medication >>> historyById');

	// Common search params
	let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } = args;

	// Search Result params
	let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } = args;

	// Resource Specific params
	let code = args['code'];
	let container = args['container'];
	let form = args['form'];
	let ingredient = args['ingredient'];
	let ingredient_code = args['ingredient-code'];
	let manufacturer = args['manufacturer'];
	let over_the_counter = args['over-the-counter'];
	let package_item = args['package-item'];
	let package_item_code = args['package-item-code'];
	let status = args['status'];

	// TODO: Build query from Parameters

	// TODO: Query database

	let Medication = getMedication(base_version);

	// Cast all results to Medication Class
	let medication_resource = new Medication();

	// Return Array
	resolve([medication_resource]);
});



