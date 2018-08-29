/*eslint no-unused-vars: "warn"*/

const { RESOURCES } = require('@asymmetrik/node-fhir-server-core').constants;
const FHIRServer = require('@asymmetrik/node-fhir-server-core');

let getImmunizationRecommendation = (base_version) => {
	return require(FHIRServer.resolveFromVersion(base_version, RESOURCES.IMMUNIZATIONRECOMMENDATION));};

let getMeta = (base_version) => {
	return require(FHIRServer.resolveFromVersion(base_version, RESOURCES.META));};

module.exports.search = (args, context, logger) => new Promise((resolve, reject) => {
	logger.info('ImmunizationRecommendation >>> search');

	// Common search params
	let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } = args;

	// Search Result params
	let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } = args;

	// Resource Specific params
	let date = args['date'];
	let dose_number = args['dose-number'];
	let dose_sequence = args['dose-sequence'];
	let identifier = args['identifier'];
	let information = args['information'];
	let patient = args['patient'];
	let status = args['status'];
	let support = args['support'];
	let target_disease = args['target-disease'];
	let vaccine_type = args['vaccine-type'];

	// TODO: Build query from Parameters

	// TODO: Query database

	let ImmunizationRecommendation = getImmunizationRecommendation(base_version);

	// Cast all results to ImmunizationRecommendation Class
	let immunizationrecommendation_resource = new ImmunizationRecommendation();
	// TODO: Set data with constructor or setter methods
	immunizationrecommendation_resource.id = 'test id';

	// Return Array
	resolve([immunizationrecommendation_resource]);
});

module.exports.searchById = (args, context, logger) => new Promise((resolve, reject) => {
	logger.info('ImmunizationRecommendation >>> searchById');

	let { base_version, id } = args;

	let ImmunizationRecommendation = getImmunizationRecommendation(base_version);

	// TODO: Build query from Parameters

	// TODO: Query database

	// Cast result to ImmunizationRecommendation Class
	let immunizationrecommendation_resource = new ImmunizationRecommendation();
	// TODO: Set data with constructor or setter methods
	immunizationrecommendation_resource.id = 'test id';

	// Return resource class
	// resolve(immunizationrecommendation_resource);
	resolve();
});

module.exports.create = (args, context, logger) => new Promise((resolve, reject) => {
	logger.info('ImmunizationRecommendation >>> create');

	let { base_version, id, resource } = args;

	let ImmunizationRecommendation = getImmunizationRecommendation(base_version);
	let Meta = getMeta(base_version);

	// TODO: determine if client/server sets ID

	// Cast resource to ImmunizationRecommendation Class
	let immunizationrecommendation_resource = new ImmunizationRecommendation(resource);
	immunizationrecommendation_resource.meta = new Meta();
	// TODO: set meta info

	// TODO: save record to database

	// Return Id
	resolve({ id: immunizationrecommendation_resource.id });
});

module.exports.update = (args, context, logger) => new Promise((resolve, reject) => {
	logger.info('ImmunizationRecommendation >>> update');

	let { base_version, id, resource } = args;

	let ImmunizationRecommendation = getImmunizationRecommendation(base_version);
	let Meta = getMeta(base_version);

	// Cast resource to ImmunizationRecommendation Class
	let immunizationrecommendation_resource = new ImmunizationRecommendation(resource);
	immunizationrecommendation_resource.meta = new Meta();
	// TODO: set meta info, increment meta ID

	// TODO: save record to database

	// Return id, if recorded was created or updated, new meta version id
	resolve({ id: immunizationrecommendation_resource.id, created: false, resource_version: immunizationrecommendation_resource.meta.versionId });
});

module.exports.remove = (args, context, logger) => new Promise((resolve, reject) => {
	logger.info('ImmunizationRecommendation >>> remove');

	let { id } = args;

	// TODO: delete record in database (soft/hard)

	// Return number of records deleted
	resolve({ deleted: 0 });
});

module.exports.searchByVersionId = (args, context, logger) => new Promise((resolve, reject) => {
	logger.info('ImmunizationRecommendation >>> searchByVersionId');

	let { base_version, id, version_id } = args;

	let ImmunizationRecommendation = getImmunizationRecommendation(base_version);

	// TODO: Build query from Parameters

	// TODO: Query database

	// Cast result to ImmunizationRecommendation Class
	let immunizationrecommendation_resource = new ImmunizationRecommendation();

	// Return resource class
	resolve(immunizationrecommendation_resource);
});

module.exports.history = (args, context, logger) => new Promise((resolve, reject) => {
	logger.info('ImmunizationRecommendation >>> history');

	// Common search params
	let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } = args;

	// Search Result params
	let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } = args;

	// Resource Specific params
	let date = args['date'];
	let dose_number = args['dose-number'];
	let dose_sequence = args['dose-sequence'];
	let identifier = args['identifier'];
	let information = args['information'];
	let patient = args['patient'];
	let status = args['status'];
	let support = args['support'];
	let target_disease = args['target-disease'];
	let vaccine_type = args['vaccine-type'];

	// TODO: Build query from Parameters

	// TODO: Query database

	let ImmunizationRecommendation = getImmunizationRecommendation(base_version);

	// Cast all results to ImmunizationRecommendation Class
	let immunizationrecommendation_resource = new ImmunizationRecommendation();

	// Return Array
	resolve([immunizationrecommendation_resource]);
});

module.exports.historyById = (args, context, logger) => new Promise((resolve, reject) => {
	logger.info('ImmunizationRecommendation >>> historyById');

	// Common search params
	let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } = args;

	// Search Result params
	let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } = args;

	// Resource Specific params
	let date = args['date'];
	let dose_number = args['dose-number'];
	let dose_sequence = args['dose-sequence'];
	let identifier = args['identifier'];
	let information = args['information'];
	let patient = args['patient'];
	let status = args['status'];
	let support = args['support'];
	let target_disease = args['target-disease'];
	let vaccine_type = args['vaccine-type'];

	// TODO: Build query from Parameters

	// TODO: Query database

	let ImmunizationRecommendation = getImmunizationRecommendation(base_version);

	// Cast all results to ImmunizationRecommendation Class
	let immunizationrecommendation_resource = new ImmunizationRecommendation();

	// Return Array
	resolve([immunizationrecommendation_resource]);
});

