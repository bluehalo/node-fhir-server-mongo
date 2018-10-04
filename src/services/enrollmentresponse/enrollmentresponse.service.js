/*eslint no-unused-vars: "warn"*/

const { RESOURCES } = require('@asymmetrik/node-fhir-server-core').constants;
const FHIRServer = require('@asymmetrik/node-fhir-server-core');
const { ObjectID } = require('mongodb');

let getEnrollmentResponse = (base_version) => {
	return require(FHIRServer.resolveFromVersion(base_version, RESOURCES.ENROLLMENTRESPONSE));};

let getMeta = (base_version) => {
	return require(FHIRServer.resolveFromVersion(base_version, RESOURCES.META));};

module.exports.search = (args, context, logger) => new Promise((resolve, reject) => {
	logger.info('EnrollmentResponse >>> search');

	// Common search params
	let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } = args;

	// Search Result params
	let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } = args;

	// Resource Specific params
	let identifier = args['identifier'];
	let organization = args['organization'];
	let request = args['request'];

	// TODO: Build query from Parameters

	// TODO: Query database

	let EnrollmentResponse = getEnrollmentResponse(base_version);

	// Cast all results to EnrollmentResponse Class
	let enrollmentresponse_resource = new EnrollmentResponse();
	// TODO: Set data with constructor or setter methods
	enrollmentresponse_resource.id = 'test id';

	// Return Array
	resolve([enrollmentresponse_resource]);
});

module.exports.searchById = (args, context, logger) => new Promise((resolve, reject) => {
	logger.info('EnrollmentResponse >>> searchById');

	let { base_version, id } = args;

	let EnrollmentResponse = getEnrollmentResponse(base_version);

	// TODO: Build query from Parameters

	// TODO: Query database

	// Cast result to EnrollmentResponse Class
	let enrollmentresponse_resource = new EnrollmentResponse();
	// TODO: Set data with constructor or setter methods
	enrollmentresponse_resource.id = 'test id';

	// Return resource class
	// resolve(enrollmentresponse_resource);
	resolve();
});

module.exports.create = (args, context, logger) => new Promise((resolve, reject) => {
	logger.info('EnrollmentResponse >>> create');

	let { base_version, resource } = args;
	// Make sure to use this ID when inserting this resource
	let id = new ObjectID().toString();

	let EnrollmentResponse = getEnrollmentResponse(base_version);
	let Meta = getMeta(base_version);

	// TODO: determine if client/server sets ID

	// Cast resource to EnrollmentResponse Class
	let enrollmentresponse_resource = new EnrollmentResponse(resource);
	enrollmentresponse_resource.meta = new Meta();
	// TODO: set meta info

	// TODO: save record to database

	// Return Id
	resolve({ id });
});

module.exports.update = (args, context, logger) => new Promise((resolve, reject) => {
	logger.info('EnrollmentResponse >>> update');

	let { base_version, id, resource } = args;

	let EnrollmentResponse = getEnrollmentResponse(base_version);
	let Meta = getMeta(base_version);

	// Cast resource to EnrollmentResponse Class
	let enrollmentresponse_resource = new EnrollmentResponse(resource);
	enrollmentresponse_resource.meta = new Meta();
	// TODO: set meta info, increment meta ID

	// TODO: save record to database

	// Return id, if recorded was created or updated, new meta version id
	resolve({ id: enrollmentresponse_resource.id, created: false, resource_version: enrollmentresponse_resource.meta.versionId });
});

module.exports.remove = (args, context, logger) => new Promise((resolve, reject) => {
	logger.info('EnrollmentResponse >>> remove');

	let { id } = args;

	// TODO: delete record in database (soft/hard)

	// Return number of records deleted
	resolve({ deleted: 0 });
});

module.exports.searchByVersionId = (args, context, logger) => new Promise((resolve, reject) => {
	logger.info('EnrollmentResponse >>> searchByVersionId');

	let { base_version, id, version_id } = args;

	let EnrollmentResponse = getEnrollmentResponse(base_version);

	// TODO: Build query from Parameters

	// TODO: Query database

	// Cast result to EnrollmentResponse Class
	let enrollmentresponse_resource = new EnrollmentResponse();

	// Return resource class
	resolve(enrollmentresponse_resource);
});

module.exports.history = (args, context, logger) => new Promise((resolve, reject) => {
	logger.info('EnrollmentResponse >>> history');

	// Common search params
	let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } = args;

	// Search Result params
	let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } = args;

	// Resource Specific params
	let identifier = args['identifier'];
	let organization = args['organization'];
	let request = args['request'];

	// TODO: Build query from Parameters

	// TODO: Query database

	let EnrollmentResponse = getEnrollmentResponse(base_version);

	// Cast all results to EnrollmentResponse Class
	let enrollmentresponse_resource = new EnrollmentResponse();

	// Return Array
	resolve([enrollmentresponse_resource]);
});

module.exports.historyById = (args, context, logger) => new Promise((resolve, reject) => {
	logger.info('EnrollmentResponse >>> historyById');

	// Common search params
	let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } = args;

	// Search Result params
	let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } = args;

	// Resource Specific params
	let identifier = args['identifier'];
	let organization = args['organization'];
	let request = args['request'];

	// TODO: Build query from Parameters

	// TODO: Query database

	let EnrollmentResponse = getEnrollmentResponse(base_version);

	// Cast all results to EnrollmentResponse Class
	let enrollmentresponse_resource = new EnrollmentResponse();

	// Return Array
	resolve([enrollmentresponse_resource]);
});
