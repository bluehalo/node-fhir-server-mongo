/*eslint no-unused-vars: "warn"*/

const { RESOURCES } = require('@asymmetrik/node-fhir-server-core').constants;
const FHIRServer = require('@asymmetrik/node-fhir-server-core');

let getAllergyIntolerance = (base_version) => {
	return require(FHIRServer.resolveFromVersion(base_version, RESOURCES.ALLERGYINTOLERANCE));};

let getMeta = (base_version) => {
	return require(FHIRServer.resolveFromVersion(base_version, RESOURCES.META));};

module.exports.search = (args, context, logger) => new Promise((resolve, reject) => {
	logger.info('AllergyIntolerance >>> search');

	// Common search params
	let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } = args;

	// Search Result params
	let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } = args;

	// Resource Specific params
	let asserter = args['asserter'];
	let category = args['category'];
	let clinical_status = args['clinical-status'];
	let code = args['code'];
	let criticality = args['criticality'];
	let date = args['date'];
	let identifier = args['identifier'];
	let last_date = args['last-date'];
	let manifestation = args['manifestation'];
	let onset = args['onset'];
	let patient = args['patient'];
	let recorder = args['recorder'];
	let route = args['route'];
	let severity = args['severity'];
	let type = args['type'];
	let verification_status = args['verification-status'];

	// TODO: Build query from Parameters

	// TODO: Query database

	let AllergyIntolerance = getAllergyIntolerance(base_version);

	// Cast all results to AllergyIntolerance Class
	let allergyintolerance_resource = new AllergyIntolerance();
	// TODO: Set data with constructor or setter methods
	allergyintolerance_resource.id = 'test id';

	// Return Array
	resolve([allergyintolerance_resource]);
});

module.exports.searchById = (args, context, logger) => new Promise((resolve, reject) => {
	logger.info('AllergyIntolerance >>> searchById');

	let { base_version, id } = args;

	let AllergyIntolerance = getAllergyIntolerance(base_version);

	// TODO: Build query from Parameters

	// TODO: Query database

	// Cast result to AllergyIntolerance Class
	let allergyintolerance_resource = new AllergyIntolerance();
	// TODO: Set data with constructor or setter methods
	allergyintolerance_resource.id = 'test id';

	// Return resource class
	// resolve(allergyintolerance_resource);
	resolve();
});

module.exports.create = (args, context, logger) => new Promise((resolve, reject) => {
	logger.info('AllergyIntolerance >>> create');

	let { base_version, id, resource } = args;

	let AllergyIntolerance = getAllergyIntolerance(base_version);
	let Meta = getMeta(base_version);

	// TODO: determine if client/server sets ID

	// Cast resource to AllergyIntolerance Class
	let allergyintolerance_resource = new AllergyIntolerance(resource);
	allergyintolerance_resource.meta = new Meta();
	// TODO: set meta info

	// TODO: save record to database

	// Return Id
	resolve({ id: allergyintolerance_resource.id });
});

module.exports.update = (args, context, logger) => new Promise((resolve, reject) => {
	logger.info('AllergyIntolerance >>> update');

	let { base_version, id, resource } = args;

	let AllergyIntolerance = getAllergyIntolerance(base_version);
	let Meta = getMeta(base_version);

	// Cast resource to AllergyIntolerance Class
	let allergyintolerance_resource = new AllergyIntolerance(resource);
	allergyintolerance_resource.meta = new Meta();
	// TODO: set meta info, increment meta ID

	// TODO: save record to database

	// Return id, if recorded was created or updated, new meta version id
	resolve({ id: allergyintolerance_resource.id, created: false, resource_version: allergyintolerance_resource.meta.versionId });
});

module.exports.remove = (args, context, logger) => new Promise((resolve, reject) => {
	logger.info('AllergyIntolerance >>> remove');

	let { id } = args;

	// TODO: delete record in database (soft/hard)

	// Return number of records deleted
	resolve({ deleted: 0 });
});

module.exports.searchByVersionId = (args, context, logger) => new Promise((resolve, reject) => {
	logger.info('AllergyIntolerance >>> searchByVersionId');

	let { base_version, id, version_id } = args;

	let AllergyIntolerance = getAllergyIntolerance(base_version);

	// TODO: Build query from Parameters

	// TODO: Query database

	// Cast result to AllergyIntolerance Class
	let allergyintolerance_resource = new AllergyIntolerance();

	// Return resource class
	resolve(allergyintolerance_resource);
});

module.exports.history = (args, context, logger) => new Promise((resolve, reject) => {
	logger.info('AllergyIntolerance >>> history');

	// Common search params
	let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } = args;

	// Search Result params
	let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } = args;

	// Resource Specific params
	let asserter = args['asserter'];
	let category = args['category'];
	let clinical_status = args['clinical-status'];
	let code = args['code'];
	let criticality = args['criticality'];
	let date = args['date'];
	let identifier = args['identifier'];
	let last_date = args['last-date'];
	let manifestation = args['manifestation'];
	let onset = args['onset'];
	let patient = args['patient'];
	let recorder = args['recorder'];
	let route = args['route'];
	let severity = args['severity'];
	let type = args['type'];
	let verification_status = args['verification-status'];

	// TODO: Build query from Parameters

	// TODO: Query database

	let AllergyIntolerance = getAllergyIntolerance(base_version);

	// Cast all results to AllergyIntolerance Class
	let allergyintolerance_resource = new AllergyIntolerance();

	// Return Array
	resolve([allergyintolerance_resource]);
});

module.exports.historyById = (args, context, logger) => new Promise((resolve, reject) => {
	logger.info('AllergyIntolerance >>> historyById');

	// Common search params
	let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } = args;

	// Search Result params
	let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } = args;

	// Resource Specific params
	let asserter = args['asserter'];
	let category = args['category'];
	let clinical_status = args['clinical-status'];
	let code = args['code'];
	let criticality = args['criticality'];
	let date = args['date'];
	let identifier = args['identifier'];
	let last_date = args['last-date'];
	let manifestation = args['manifestation'];
	let onset = args['onset'];
	let patient = args['patient'];
	let recorder = args['recorder'];
	let route = args['route'];
	let severity = args['severity'];
	let type = args['type'];
	let verification_status = args['verification-status'];

	// TODO: Build query from Parameters

	// TODO: Query database

	let AllergyIntolerance = getAllergyIntolerance(base_version);

	// Cast all results to AllergyIntolerance Class
	let allergyintolerance_resource = new AllergyIntolerance();

	// Return Array
	resolve([allergyintolerance_resource]);
});

