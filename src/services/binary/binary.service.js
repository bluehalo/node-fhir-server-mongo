/*eslint no-unused-vars: "warn"*/

const { VERSIONS } = require('@asymmetrik/node-fhir-server-core').constants;
const { resolveSchema } = require('@asymmetrik/node-fhir-server-core');
const FHIRServer = require('@asymmetrik/node-fhir-server-core');
const { ObjectID } = require('mongodb');
const logger = require('@asymmetrik/node-fhir-server-core').loggers.get();

let getBinary = (base_version) => {
  return resolveSchema(base_version, 'Binary');
};

let getMeta = (base_version) => {
  return resolveSchema(base_version, 'Meta');
};

module.exports.search = (args) =>
  new Promise((resolve, reject) => {
    logger.info('Binary >>> search');

    // Common search params
    let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } =
      args;

    // Search Result params
    let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } =
      args;

    // Resource Specific params
    let contenttype = args['contenttype'];

    // TODO: Build query from Parameters

    // TODO: Query database

    let Binary = getBinary(base_version);

    // Cast all results to Binary Class
    let binary_resource = new Binary();
    // TODO: Set data with constructor or setter methods
    binary_resource.id = 'test id';

    // Return Array
    resolve([binary_resource]);
  });

module.exports.searchById = (args) =>
  new Promise((resolve, reject) => {
    logger.info('Binary >>> searchById');

    let { base_version, id } = args;

    let Binary = getBinary(base_version);

    // TODO: Build query from Parameters

    // TODO: Query database

    // Cast result to Binary Class
    let binary_resource = new Binary();
    // TODO: Set data with constructor or setter methods
    binary_resource.id = 'test id';

    // Return resource class
    // resolve(binary_resource);
    resolve();
  });

module.exports.create = (args, { req }) =>
  new Promise((resolve, reject) => {
    logger.info('Binary >>> create');

    let { base_version, resource } = args;
    // Make sure to use this ID when inserting this resource
    let id = new ObjectID().toString();

    let Binary = getBinary(base_version);
    let Meta = getMeta(base_version);

    // TODO: determine if client/server sets ID

    // Cast resource to Binary Class
    let binary_resource = new Binary(resource);
    binary_resource.meta = new Meta();
    // TODO: set meta info

    // TODO: save record to database

    // Return Id
    resolve({ id });
  });

module.exports.update = (args, { req }) =>
  new Promise((resolve, reject) => {
    logger.info('Binary >>> update');

    let { base_version, id, resource } = args;

    let Binary = getBinary(base_version);
    let Meta = getMeta(base_version);

    // Cast resource to Binary Class
    let binary_resource = new Binary(resource);
    binary_resource.meta = new Meta();
    // TODO: set meta info, increment meta ID

    // TODO: save record to database

    // Return id, if recorded was created or updated, new meta version id
    resolve({
      id: binary_resource.id,
      created: false,
      resource_version: binary_resource.meta.versionId,
    });
  });

module.exports.remove = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('Binary >>> remove');

    let { id } = args;

    // TODO: delete record in database (soft/hard)

    // Return number of records deleted
    resolve({ deleted: 0 });
  });

module.exports.searchByVersionId = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('Binary >>> searchByVersionId');

    let { base_version, id, version_id } = args;

    let Binary = getBinary(base_version);

    // TODO: Build query from Parameters

    // TODO: Query database

    // Cast result to Binary Class
    let binary_resource = new Binary();

    // Return resource class
    resolve(binary_resource);
  });

module.exports.history = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('Binary >>> history');

    // Common search params
    let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } =
      args;

    // Search Result params
    let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } =
      args;

    // Resource Specific params
    let contenttype = args['contenttype'];

    // TODO: Build query from Parameters

    // TODO: Query database

    let Binary = getBinary(base_version);

    // Cast all results to Binary Class
    let binary_resource = new Binary();

    // Return Array
    resolve([binary_resource]);
  });

module.exports.historyById = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('Binary >>> historyById');

    // Common search params
    let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } =
      args;

    // Search Result params
    let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } =
      args;

    // Resource Specific params
    let contenttype = args['contenttype'];

    // TODO: Build query from Parameters

    // TODO: Query database

    let Binary = getBinary(base_version);

    // Cast all results to Binary Class
    let binary_resource = new Binary();

    // Return Array
    resolve([binary_resource]);
  });
