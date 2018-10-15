/*eslint no-unused-vars: "warn"*/

const { RESOURCES } = require('@asymmetrik/node-fhir-server-core').constants;
const FHIRServer = require('@asymmetrik/node-fhir-server-core');
const { ObjectID } = require('mongodb');

let getLinkage = (base_version) => {
	return require(FHIRServer.resolveFromVersion(base_version, RESOURCES.LINKAGE));};

let getMeta = (base_version) => {
	return require(FHIRServer.resolveFromVersion(base_version, RESOURCES.META));};

module.exports.search = (args, context, logger) => new Promise((resolve, reject) => {
	logger.info('Linkage >>> search');

	// Common search params
	let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } = args;

	// Search Result params
	let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } = args;

	// Resource Specific params
	let author = args['author'];
	let item = args['item'];
	let source = args['source'];

	// TODO: Build query from Parameters

	// TODO: Query database

	let Linkage = getLinkage(base_version);

	// Cast all results to Linkage Class
	let linkage_resource = new Linkage();
	// TODO: Set data with constructor or setter methods
	linkage_resource.id = 'test id';

	// Return Array
	resolve([linkage_resource]);
});

module.exports.searchById = (args, context, logger) => new Promise((resolve, reject) => {
	logger.info('Linkage >>> searchById');

	let { base_version, id } = args;

	let Linkage = getLinkage(base_version);

	// TODO: Build query from Parameters

	// TODO: Query database

	// Cast result to Linkage Class
	let linkage_resource = new Linkage();
	// TODO: Set data with constructor or setter methods
	linkage_resource.id = 'test id';

	// Return resource class
	// resolve(linkage_resource);
	resolve();
});

module.exports.create = (args, context, logger) => new Promise((resolve, reject) => {
	logger.info('Linkage >>> create');

	let { base_version, resource } = args;
	// Make sure to use this ID when inserting this resource
	let id = new ObjectID().toString();

	let Linkage = getLinkage(base_version);
	let Meta = getMeta(base_version);

	// TODO: determine if client/server sets ID

	// Cast resource to Linkage Class
	let linkage_resource = new Linkage(resource);
	linkage_resource.meta = new Meta();
	// TODO: set meta info

	// TODO: save record to database

	// Return Id
	resolve({ id });
});

module.exports.update = (args, context, logger) => new Promise((resolve, reject) => {
	logger.info('Linkage >>> update');

	let { base_version, id, resource } = args;

	let Linkage = getLinkage(base_version);
	let Meta = getMeta(base_version);

	// Cast resource to Linkage Class
	let linkage_resource = new Linkage(resource);
	linkage_resource.meta = new Meta();
	// TODO: set meta info, increment meta ID

	// TODO: save record to database

	// Return id, if recorded was created or updated, new meta version id
	resolve({ id: linkage_resource.id, created: false, resource_version: linkage_resource.meta.versionId });
});

module.exports.remove = (args, context, logger) => new Promise((resolve, reject) => {
	logger.info('Linkage >>> remove');

	let { id } = args;

	// TODO: delete record in database (soft/hard)

	// Return number of records deleted
	resolve({ deleted: 0 });
});

module.exports.searchByVersionId = (args, context, logger) => new Promise((resolve, reject) => {
	logger.info('Linkage >>> searchByVersionId');

	let { base_version, id, version_id } = args;

	let Linkage = getLinkage(base_version);

	// TODO: Build query from Parameters

	// TODO: Query database

	// Cast result to Linkage Class
	let linkage_resource = new Linkage();

	// Return resource class
	resolve(linkage_resource);
});

module.exports.history = (args, context, logger) => new Promise((resolve, reject) => {
	logger.info('Linkage >>> history');

	// Common search params
	let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } = args;

	// Search Result params
	let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } = args;

	// Resource Specific params
	let author = args['author'];
	let item = args['item'];
	let source = args['source'];

	// TODO: Build query from Parameters

	// TODO: Query database

	let Linkage = getLinkage(base_version);

	// Cast all results to Linkage Class
	let linkage_resource = new Linkage();

	// Return Array
	resolve([linkage_resource]);
});

module.exports.historyById = (args, context, logger) => new Promise((resolve, reject) => {
	logger.info('Linkage >>> historyById');

	// Common search params
	let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } = args;

	// Search Result params
	let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } = args;

	// Resource Specific params
	let author = args['author'];
	let item = args['item'];
	let source = args['source'];

	// TODO: Build query from Parameters

	// TODO: Query database

	let Linkage = getLinkage(base_version);

	// Cast all results to Linkage Class
	let linkage_resource = new Linkage();

	// Return Array
	resolve([linkage_resource]);
});
