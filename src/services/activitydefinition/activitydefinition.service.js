/*eslint no-unused-vars: "warn"*/

const { RESOURCES } = require('@asymmetrik/node-fhir-server-core').constants;
const FHIRServer = require('@asymmetrik/node-fhir-server-core');
const { ObjectID } = require('mongodb');

let getActivityDefinition = (base_version) => {
	return require(FHIRServer.resolveFromVersion(base_version, RESOURCES.ACTIVITYDEFINITION));};

let getMeta = (base_version) => {
	return require(FHIRServer.resolveFromVersion(base_version, RESOURCES.META));};

module.exports.search = (args, context, logger) => new Promise((resolve, reject) => {
	logger.info('ActivityDefinition >>> search');

	// Common search params
	let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } = args;

	// Search Result params
	let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } = args;

	// Resource Specific params
	let composed_of = args['composed-of'];
	let date = args['date'];
	let depends_on = args['depends-on'];
	let derived_from = args['derived-from'];
	let description = args['description'];
	let effective = args['effective'];
	let identifier = args['identifier'];
	let jurisdiction = args['jurisdiction'];
	let name = args['name'];
	let predecessor = args['predecessor'];
	let publisher = args['publisher'];
	let status = args['status'];
	let successor = args['successor'];
	let title = args['title'];
	let topic = args['topic'];
	let url = args['url'];
	let version = args['version'];

	// TODO: Build query from Parameters

	// TODO: Query database

	let ActivityDefinition = getActivityDefinition(base_version);

	// Cast all results to ActivityDefinition Class
	let activitydefinition_resource = new ActivityDefinition();
	// TODO: Set data with constructor or setter methods
	activitydefinition_resource.id = 'test id';

	// Return Array
	resolve([activitydefinition_resource]);
});

module.exports.searchById = (args, context, logger) => new Promise((resolve, reject) => {
	logger.info('ActivityDefinition >>> searchById');

	let { base_version, id } = args;

	let ActivityDefinition = getActivityDefinition(base_version);

	// TODO: Build query from Parameters

	// TODO: Query database

	// Cast result to ActivityDefinition Class
	let activitydefinition_resource = new ActivityDefinition();
	// TODO: Set data with constructor or setter methods
	activitydefinition_resource.id = 'test id';

	// Return resource class
	// resolve(activitydefinition_resource);
	resolve();
});

module.exports.create = (args, context, logger) => new Promise((resolve, reject) => {
	logger.info('ActivityDefinition >>> create');

	let { base_version, resource } = args;
	// Make sure to use this ID when inserting this resource
	let id = new ObjectID().toString();

	let ActivityDefinition = getActivityDefinition(base_version);
	let Meta = getMeta(base_version);

	// TODO: determine if client/server sets ID

	// Cast resource to ActivityDefinition Class
	let activitydefinition_resource = new ActivityDefinition(resource);
	activitydefinition_resource.meta = new Meta();
	// TODO: set meta info

	// TODO: save record to database

	// Return Id
	resolve({ id });
});

module.exports.update = (args, context, logger) => new Promise((resolve, reject) => {
	logger.info('ActivityDefinition >>> update');

	let { base_version, id, resource } = args;

	let ActivityDefinition = getActivityDefinition(base_version);
	let Meta = getMeta(base_version);

	// Cast resource to ActivityDefinition Class
	let activitydefinition_resource = new ActivityDefinition(resource);
	activitydefinition_resource.meta = new Meta();
	// TODO: set meta info, increment meta ID

	// TODO: save record to database

	// Return id, if recorded was created or updated, new meta version id
	resolve({ id: activitydefinition_resource.id, created: false, resource_version: activitydefinition_resource.meta.versionId });
});

module.exports.remove = (args, context, logger) => new Promise((resolve, reject) => {
	logger.info('ActivityDefinition >>> remove');

	let { id } = args;

	// TODO: delete record in database (soft/hard)

	// Return number of records deleted
	resolve({ deleted: 0 });
});

module.exports.searchByVersionId = (args, context, logger) => new Promise((resolve, reject) => {
	logger.info('ActivityDefinition >>> searchByVersionId');

	let { base_version, id, version_id } = args;

	let ActivityDefinition = getActivityDefinition(base_version);

	// TODO: Build query from Parameters

	// TODO: Query database

	// Cast result to ActivityDefinition Class
	let activitydefinition_resource = new ActivityDefinition();

	// Return resource class
	resolve(activitydefinition_resource);
});

module.exports.history = (args, context, logger) => new Promise((resolve, reject) => {
	logger.info('ActivityDefinition >>> history');

	// Common search params
	let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } = args;

	// Search Result params
	let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } = args;

	// Resource Specific params
	let composed_of = args['composed-of'];
	let date = args['date'];
	let depends_on = args['depends-on'];
	let derived_from = args['derived-from'];
	let description = args['description'];
	let effective = args['effective'];
	let identifier = args['identifier'];
	let jurisdiction = args['jurisdiction'];
	let name = args['name'];
	let predecessor = args['predecessor'];
	let publisher = args['publisher'];
	let status = args['status'];
	let successor = args['successor'];
	let title = args['title'];
	let topic = args['topic'];
	let url = args['url'];
	let version = args['version'];

	// TODO: Build query from Parameters

	// TODO: Query database

	let ActivityDefinition = getActivityDefinition(base_version);

	// Cast all results to ActivityDefinition Class
	let activitydefinition_resource = new ActivityDefinition();

	// Return Array
	resolve([activitydefinition_resource]);
});

module.exports.historyById = (args, context, logger) => new Promise((resolve, reject) => {
	logger.info('ActivityDefinition >>> historyById');

	// Common search params
	let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } = args;

	// Search Result params
	let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } = args;

	// Resource Specific params
	let composed_of = args['composed-of'];
	let date = args['date'];
	let depends_on = args['depends-on'];
	let derived_from = args['derived-from'];
	let description = args['description'];
	let effective = args['effective'];
	let identifier = args['identifier'];
	let jurisdiction = args['jurisdiction'];
	let name = args['name'];
	let predecessor = args['predecessor'];
	let publisher = args['publisher'];
	let status = args['status'];
	let successor = args['successor'];
	let title = args['title'];
	let topic = args['topic'];
	let url = args['url'];
	let version = args['version'];

	// TODO: Build query from Parameters

	// TODO: Query database

	let ActivityDefinition = getActivityDefinition(base_version);

	// Cast all results to ActivityDefinition Class
	let activitydefinition_resource = new ActivityDefinition();

	// Return Array
	resolve([activitydefinition_resource]);
});
