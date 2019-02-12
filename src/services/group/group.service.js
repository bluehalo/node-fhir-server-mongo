/*eslint no-unused-vars: "warn"*/

const { RESOURCES } = require('@asymmetrik/node-fhir-server-core').constants;
const FHIRServer = require('@asymmetrik/node-fhir-server-core');
const { ObjectID } = require('mongodb');

let getGroup = (base_version) => {
	return require(FHIRServer.resolveFromVersion(base_version, RESOURCES.GROUP));};

let getMeta = (base_version) => {
	return require(FHIRServer.resolveFromVersion(base_version, RESOURCES.META));};

module.exports.search = (args, context, logger) => new Promise((resolve, reject) => {
	logger.info('Group >>> search');

	// Common search params
	let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } = args;

	// Search Result params
	let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } = args;

	// Resource Specific params
	let actual = args['actual'];
	let characteristic = args['characteristic'];
	let characteristic_value = args['characteristic-value'];
	let code = args['code'];
	let exclude = args['exclude'];
	let identifier = args['identifier'];
	let member = args['member'];
	let type = args['type'];
	let value = args['value'];

	// TODO: Build query from Parameters

	// TODO: Query database

	let Group = getGroup(base_version);

	// Cast all results to Group Class
	let group_resource = new Group();
	// TODO: Set data with constructor or setter methods
	group_resource.id = 'test id';

	// Return Array
	resolve([group_resource]);
});

module.exports.searchById = (args, context, logger) => new Promise((resolve, reject) => {
	logger.info('Group >>> searchById');

	let { base_version, id } = args;

	let Group = getGroup(base_version);

	// TODO: Build query from Parameters

	// TODO: Query database

	// Cast result to Group Class
	let group_resource = new Group();
	// TODO: Set data with constructor or setter methods
	group_resource.id = 'test id';

	// Return resource class
	// resolve(group_resource);
	resolve();
});

module.exports.create = (args, context, logger) => new Promise((resolve, reject) => {
	logger.info('Group >>> create');

	let { base_version, resource } = args;
	// Make sure to use this ID when inserting this resource
	let id = new ObjectID().toString();

	let Group = getGroup(base_version);
	let Meta = getMeta(base_version);

	// TODO: determine if client/server sets ID

	// Cast resource to Group Class
	let group_resource = new Group(resource);
	group_resource.meta = new Meta();
	// TODO: set meta info

	// TODO: save record to database

	// Return Id
	resolve({ id });
});

module.exports.update = (args, context, logger) => new Promise((resolve, reject) => {
	logger.info('Group >>> update');

	let { base_version, id, resource } = args;

	let Group = getGroup(base_version);
	let Meta = getMeta(base_version);

	// Cast resource to Group Class
	let group_resource = new Group(resource);
	group_resource.meta = new Meta();
	// TODO: set meta info, increment meta ID

	// TODO: save record to database

	// Return id, if recorded was created or updated, new meta version id
	resolve({ id: group_resource.id, created: false, resource_version: group_resource.meta.versionId });
});

module.exports.remove = (args, context, logger) => new Promise((resolve, reject) => {
	logger.info('Group >>> remove');

	let { id } = args;

	// TODO: delete record in database (soft/hard)

	// Return number of records deleted
	resolve({ deleted: 0 });
});

module.exports.searchByVersionId = (args, context, logger) => new Promise((resolve, reject) => {
	logger.info('Group >>> searchByVersionId');

	let { base_version, id, version_id } = args;

	let Group = getGroup(base_version);

	// TODO: Build query from Parameters

	// TODO: Query database

	// Cast result to Group Class
	let group_resource = new Group();

	// Return resource class
	resolve(group_resource);
});

module.exports.history = (args, context, logger) => new Promise((resolve, reject) => {
	logger.info('Group >>> history');

	// Common search params
	let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } = args;

	// Search Result params
	let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } = args;

	// Resource Specific params
	let actual = args['actual'];
	let characteristic = args['characteristic'];
	let characteristic_value = args['characteristic-value'];
	let code = args['code'];
	let exclude = args['exclude'];
	let identifier = args['identifier'];
	let member = args['member'];
	let type = args['type'];
	let value = args['value'];

	// TODO: Build query from Parameters

	// TODO: Query database

	let Group = getGroup(base_version);

	// Cast all results to Group Class
	let group_resource = new Group();

	// Return Array
	resolve([group_resource]);
});

module.exports.historyById = (args, context, logger) => new Promise((resolve, reject) => {
	logger.info('Group >>> historyById');

	// Common search params
	let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } = args;

	// Search Result params
	let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } = args;

	// Resource Specific params
	let actual = args['actual'];
	let characteristic = args['characteristic'];
	let characteristic_value = args['characteristic-value'];
	let code = args['code'];
	let exclude = args['exclude'];
	let identifier = args['identifier'];
	let member = args['member'];
	let type = args['type'];
	let value = args['value'];

	// TODO: Build query from Parameters

	// TODO: Query database

	let Group = getGroup(base_version);

	// Cast all results to Group Class
	let group_resource = new Group();

	// Return Array
	resolve([group_resource]);
});
