/*eslint no-unused-vars: "warn"*/

const { VERSIONS } = require('@asymmetrik/node-fhir-server-core').constants;
const { resolveSchema } = require('@asymmetrik/node-fhir-server-core');
const FHIRServer = require('@asymmetrik/node-fhir-server-core');
const { ObjectID } = require('mongodb');
const logger = require('@asymmetrik/node-fhir-server-core').loggers.get();

let getBundle = base_version => {
  return require(resolveSchema(base_version, 'Bundle'));
};

let getMeta = base_version => {
  return require(resolveSchema(base_version, 'Meta'));
};

module.exports.searchById = args =>
  new Promise((resolve, reject) => {
    logger.info('Bundle >>> search');

    // Common search params
    let {
      base_version,
      _content,
      _format,
      _id,
      _lastUpdated,
      _profile,
      _query,
      _security,
      _tag,
    } = args;

    // Search Result params
    let {
      _INCLUDE,
      _REVINCLUDE,
      _SORT,
      _COUNT,
      _SUMMARY,
      _ELEMENTS,
      _CONTAINED,
      _CONTAINEDTYPED,
    } = args;

    // Resource Specific params
    let composition = args['composition'];
    let identifier = args['identifier'];
    let message = args['message'];
    let type = args['type'];

    // TODO: Build query from Parameters

    // TODO: Query database

    let Bundle = getBundle(base_version);

    // Cast all results to Bundle Class
    let bundle_resource = new Bundle();
    // TODO: Set data with constructor or setter methods
    bundle_resource.id = 'test id';

    // Return Array
    resolve([bundle_resource]);
  });

module.exports.searchById = args =>
  new Promise((resolve, reject) => {
    logger.info('Bundle >>> searchById');

    let { base_version, id } = args;

    let Bundle = getBundle(base_version);

    // TODO: Build query from Parameters

    // TODO: Query database

    // Cast result to Bundle Class
    let bundle_resource = new Bundle();
    // TODO: Set data with constructor or setter methods
    bundle_resource.id = 'test id';

    // Return resource class
    // resolve(bundle_resource);
    resolve();
  });

module.exports.create = (args, { req }) =>
  new Promise((resolve, reject) => {
    logger.info('Bundle >>> create');

    let { base_version, resource } = args;
    // Make sure to use this ID when inserting this resource
    let id = new ObjectID().toString();

    let Bundle = getBundle(base_version);
    let Meta = getMeta(base_version);

    // TODO: determine if client/server sets ID

    // Cast resource to Bundle Class
    let bundle_resource = new Bundle(resource);
    bundle_resource.meta = new Meta();
    // TODO: set meta info

    // TODO: save record to database

    // Return Id
    resolve({ id });
  });

module.exports.update = (args, { req }) =>
  new Promise((resolve, reject) => {
    logger.info('Bundle >>> update');

    let { base_version, id, resource } = args;

    let Bundle = getBundle(base_version);
    let Meta = getMeta(base_version);

    // Cast resource to Bundle Class
    let bundle_resource = new Bundle(resource);
    bundle_resource.meta = new Meta();
    // TODO: set meta info, increment meta ID

    // TODO: save record to database

    // Return id, if recorded was created or updated, new meta version id
    resolve({
      id: bundle_resource.id,
      created: false,
      resource_version: bundle_resource.meta.versionId,
    });
  });

module.exports.remove = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('Bundle >>> remove');

    let { id } = args;

    // TODO: delete record in database (soft/hard)

    // Return number of records deleted
    resolve({ deleted: 0 });
  });

module.exports.searchByVersionId = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('Bundle >>> searchByVersionId');

    let { base_version, id, version_id } = args;

    let Bundle = getBundle(base_version);

    // TODO: Build query from Parameters

    // TODO: Query database

    // Cast result to Bundle Class
    let bundle_resource = new Bundle();

    // Return resource class
    resolve(bundle_resource);
  });

module.exports.history = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('Bundle >>> history');

    // Common search params
    let {
      base_version,
      _content,
      _format,
      _id,
      _lastUpdated,
      _profile,
      _query,
      _security,
      _tag,
    } = args;

    // Search Result params
    let {
      _INCLUDE,
      _REVINCLUDE,
      _SORT,
      _COUNT,
      _SUMMARY,
      _ELEMENTS,
      _CONTAINED,
      _CONTAINEDTYPED,
    } = args;

    // Resource Specific params
    let composition = args['composition'];
    let identifier = args['identifier'];
    let message = args['message'];
    let type = args['type'];

    // TODO: Build query from Parameters

    // TODO: Query database

    let Bundle = getBundle(base_version);

    // Cast all results to Bundle Class
    let bundle_resource = new Bundle();

    // Return Array
    resolve([bundle_resource]);
  });

module.exports.historyById = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('Bundle >>> historyById');

    // Common search params
    let {
      base_version,
      _content,
      _format,
      _id,
      _lastUpdated,
      _profile,
      _query,
      _security,
      _tag,
    } = args;

    // Search Result params
    let {
      _INCLUDE,
      _REVINCLUDE,
      _SORT,
      _COUNT,
      _SUMMARY,
      _ELEMENTS,
      _CONTAINED,
      _CONTAINEDTYPED,
    } = args;

    // Resource Specific params
    let composition = args['composition'];
    let identifier = args['identifier'];
    let message = args['message'];
    let type = args['type'];

    // TODO: Build query from Parameters

    // TODO: Query database

    let Bundle = getBundle(base_version);

    // Cast all results to Bundle Class
    let bundle_resource = new Bundle();

    // Return Array
    resolve([bundle_resource]);
  });
