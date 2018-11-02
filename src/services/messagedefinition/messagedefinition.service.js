/*eslint no-unused-vars: "warn"*/

const { RESOURCES } = require('@asymmetrik/node-fhir-server-core').constants;
const FHIRServer = require('@asymmetrik/node-fhir-server-core');
const { ObjectID } = require('mongodb');

let getMessageDefinition = (base_version) => {
	return require(FHIRServer.resolveFromVersion(base_version, RESOURCES.MESSAGEDEFINITION));};

let getMeta = (base_version) => {
	return require(FHIRServer.resolveFromVersion(base_version, RESOURCES.META));};

module.exports.search = (args, context, logger) => new Promise((resolve, reject) => {
	logger.info('MessageDefinition >>> search');

	// Common search params
	let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } = args;

	// Search Result params
	let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } = args;

	// Resource Specific params
	let category = args['category'];
	let date = args['date'];
	let description = args['description'];
	let event = args['event'];
	let focus = args['focus'];
	let identifier = args['identifier'];
	let jurisdiction = args['jurisdiction'];
	let name = args['name'];
	let publisher = args['publisher'];
	let status = args['status'];
	let title = args['title'];
	let url = args['url'];
	let version = args['version'];

	// TODO: Build query from Parameters

	// TODO: Query database

	let MessageDefinition = getMessageDefinition(base_version);

	// Cast all results to MessageDefinition Class
	let messagedefinition_resource = new MessageDefinition();
	// TODO: Set data with constructor or setter methods
	messagedefinition_resource.id = 'test id';

	// Return Array
	resolve([messagedefinition_resource]);
});

module.exports.searchById = (args, context, logger) => new Promise((resolve, reject) => {
	logger.info('MessageDefinition >>> searchById');

	let { base_version, id } = args;

	let MessageDefinition = getMessageDefinition(base_version);

	// TODO: Build query from Parameters

	// TODO: Query database

	// Cast result to MessageDefinition Class
	let messagedefinition_resource = new MessageDefinition();
	// TODO: Set data with constructor or setter methods
	messagedefinition_resource.id = 'test id';

	// Return resource class
	// resolve(messagedefinition_resource);
	resolve();
});

module.exports.create = (args, context, logger) => new Promise((resolve, reject) => {
	logger.info('MessageDefinition >>> create');

	let { base_version, resource } = args;
	// Make sure to use this ID when inserting this resource
	let id = new ObjectID().toString();

	let MessageDefinition = getMessageDefinition(base_version);
	let Meta = getMeta(base_version);

	// TODO: determine if client/server sets ID

	// Cast resource to MessageDefinition Class
	let messagedefinition_resource = new MessageDefinition(resource);
	messagedefinition_resource.meta = new Meta();
	// TODO: set meta info

	// TODO: save record to database

	// Return Id
	resolve({ id });
});

module.exports.update = (args, context, logger) => new Promise((resolve, reject) => {
	logger.info('MessageDefinition >>> update');

	let { base_version, id, resource } = args;

	let MessageDefinition = getMessageDefinition(base_version);
	let Meta = getMeta(base_version);

	// Cast resource to MessageDefinition Class
	let messagedefinition_resource = new MessageDefinition(resource);
	messagedefinition_resource.meta = new Meta();
	// TODO: set meta info, increment meta ID

	// TODO: save record to database

	// Return id, if recorded was created or updated, new meta version id
	resolve({ id: messagedefinition_resource.id, created: false, resource_version: messagedefinition_resource.meta.versionId });
});

module.exports.remove = (args, context, logger) => new Promise((resolve, reject) => {
	logger.info('MessageDefinition >>> remove');

	let { id } = args;

	// TODO: delete record in database (soft/hard)

	// Return number of records deleted
	resolve({ deleted: 0 });
});

module.exports.searchByVersionId = (args, context, logger) => new Promise((resolve, reject) => {
	logger.info('MessageDefinition >>> searchByVersionId');

	let { base_version, id, version_id } = args;

	let MessageDefinition = getMessageDefinition(base_version);

	// TODO: Build query from Parameters

	// TODO: Query database

	// Cast result to MessageDefinition Class
	let messagedefinition_resource = new MessageDefinition();

	// Return resource class
	resolve(messagedefinition_resource);
});

module.exports.history = (args, context, logger) => new Promise((resolve, reject) => {
	logger.info('MessageDefinition >>> history');

	// Common search params
	let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } = args;

	// Search Result params
	let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } = args;

	// Resource Specific params
	let category = args['category'];
	let date = args['date'];
	let description = args['description'];
	let event = args['event'];
	let focus = args['focus'];
	let identifier = args['identifier'];
	let jurisdiction = args['jurisdiction'];
	let name = args['name'];
	let publisher = args['publisher'];
	let status = args['status'];
	let title = args['title'];
	let url = args['url'];
	let version = args['version'];

	// TODO: Build query from Parameters

	// TODO: Query database

	let MessageDefinition = getMessageDefinition(base_version);

	// Cast all results to MessageDefinition Class
	let messagedefinition_resource = new MessageDefinition();

	// Return Array
	resolve([messagedefinition_resource]);
});

module.exports.historyById = (args, context, logger) => new Promise((resolve, reject) => {
	logger.info('MessageDefinition >>> historyById');

	// Common search params
	let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } = args;

	// Search Result params
	let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } = args;

	// Resource Specific params
	let category = args['category'];
	let date = args['date'];
	let description = args['description'];
	let event = args['event'];
	let focus = args['focus'];
	let identifier = args['identifier'];
	let jurisdiction = args['jurisdiction'];
	let name = args['name'];
	let publisher = args['publisher'];
	let status = args['status'];
	let title = args['title'];
	let url = args['url'];
	let version = args['version'];

	// TODO: Build query from Parameters

	// TODO: Query database

	let MessageDefinition = getMessageDefinition(base_version);

	// Cast all results to MessageDefinition Class
	let messagedefinition_resource = new MessageDefinition();

	// Return Array
	resolve([messagedefinition_resource]);
});
