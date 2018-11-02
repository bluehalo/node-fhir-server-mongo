/*eslint no-unused-vars: "warn"*/

const { RESOURCES } = require('@asymmetrik/node-fhir-server-core').constants;
const FHIRServer = require('@asymmetrik/node-fhir-server-core');
const { ObjectID } = require('mongodb');

let getList = (base_version) => {
	return require(FHIRServer.resolveFromVersion(base_version, RESOURCES.LIST));};

let getMeta = (base_version) => {
	return require(FHIRServer.resolveFromVersion(base_version, RESOURCES.META));};

module.exports.search = (args, context, logger) => new Promise((resolve, reject) => {
	logger.info('List >>> search');

	// Common search params
	let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } = args;

	// Search Result params
	let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } = args;

	// Resource Specific params
	let code = args['code'];
	let date = args['date'];
	let empty_reason = args['empty-reason'];
	let encounter = args['encounter'];
	let identifier = args['identifier'];
	let item = args['item'];
	let notes = args['notes'];
	let patient = args['patient'];
	let source = args['source'];
	let status = args['status'];
	let subject = args['subject'];
	let title = args['title'];

	// TODO: Build query from Parameters

	// TODO: Query database

	let List = getList(base_version);

	// Cast all results to List Class
	let list_resource = new List();
	// TODO: Set data with constructor or setter methods
	list_resource.id = 'test id';

	// Return Array
	resolve([list_resource]);
});

module.exports.searchById = (args, context, logger) => new Promise((resolve, reject) => {
	logger.info('List >>> searchById');

	let { base_version, id } = args;

	let List = getList(base_version);

	// TODO: Build query from Parameters

	// TODO: Query database

	// Cast result to List Class
	let list_resource = new List();
	// TODO: Set data with constructor or setter methods
	list_resource.id = 'test id';

	// Return resource class
	// resolve(list_resource);
	resolve();
});

module.exports.create = (args, context, logger) => new Promise((resolve, reject) => {
	logger.info('List >>> create');

	let { base_version, resource } = args;
	// Make sure to use this ID when inserting this resource
	let id = new ObjectID().toString();

	let List = getList(base_version);
	let Meta = getMeta(base_version);

	// TODO: determine if client/server sets ID

	// Cast resource to List Class
	let list_resource = new List(resource);
	list_resource.meta = new Meta();
	// TODO: set meta info

	// TODO: save record to database

	// Return Id
	resolve({ id });
});

module.exports.update = (args, context, logger) => new Promise((resolve, reject) => {
	logger.info('List >>> update');

	let { base_version, id, resource } = args;

	let List = getList(base_version);
	let Meta = getMeta(base_version);

	// Cast resource to List Class
	let list_resource = new List(resource);
	list_resource.meta = new Meta();
	// TODO: set meta info, increment meta ID

	// TODO: save record to database

	// Return id, if recorded was created or updated, new meta version id
	resolve({ id: list_resource.id, created: false, resource_version: list_resource.meta.versionId });
});

module.exports.remove = (args, context, logger) => new Promise((resolve, reject) => {
	logger.info('List >>> remove');

	let { id } = args;

	// TODO: delete record in database (soft/hard)

	// Return number of records deleted
	resolve({ deleted: 0 });
});

module.exports.searchByVersionId = (args, context, logger) => new Promise((resolve, reject) => {
	logger.info('List >>> searchByVersionId');

	let { base_version, id, version_id } = args;

	let List = getList(base_version);

	// TODO: Build query from Parameters

	// TODO: Query database

	// Cast result to List Class
	let list_resource = new List();

	// Return resource class
	resolve(list_resource);
});

module.exports.history = (args, context, logger) => new Promise((resolve, reject) => {
	logger.info('List >>> history');

	// Common search params
	let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } = args;

	// Search Result params
	let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } = args;

	// Resource Specific params
	let code = args['code'];
	let date = args['date'];
	let empty_reason = args['empty-reason'];
	let encounter = args['encounter'];
	let identifier = args['identifier'];
	let item = args['item'];
	let notes = args['notes'];
	let patient = args['patient'];
	let source = args['source'];
	let status = args['status'];
	let subject = args['subject'];
	let title = args['title'];

	// TODO: Build query from Parameters

	// TODO: Query database

	let List = getList(base_version);

	// Cast all results to List Class
	let list_resource = new List();

	// Return Array
	resolve([list_resource]);
});

module.exports.historyById = (args, context, logger) => new Promise((resolve, reject) => {
	logger.info('List >>> historyById');

	// Common search params
	let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } = args;

	// Search Result params
	let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } = args;

	// Resource Specific params
	let code = args['code'];
	let date = args['date'];
	let empty_reason = args['empty-reason'];
	let encounter = args['encounter'];
	let identifier = args['identifier'];
	let item = args['item'];
	let notes = args['notes'];
	let patient = args['patient'];
	let source = args['source'];
	let status = args['status'];
	let subject = args['subject'];
	let title = args['title'];

	// TODO: Build query from Parameters

	// TODO: Query database

	let List = getList(base_version);

	// Cast all results to List Class
	let list_resource = new List();

	// Return Array
	resolve([list_resource]);
});
