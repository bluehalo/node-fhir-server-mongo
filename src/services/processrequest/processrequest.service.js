/*eslint no-unused-vars: "warn"*/

const { VERSIONS } = require('@asymmetrik/node-fhir-server-core').constants;
const { resolveSchema } = require('@asymmetrik/node-fhir-server-core');
const FHIRServer = require('@asymmetrik/node-fhir-server-core');
const { ObjectID } = require('mongodb');
const logger = require('@asymmetrik/node-fhir-server-core').loggers.get();

let getProcessRequest = (base_version) => {
  return resolveSchema(base_version, 'ProcessRequest');
};

let getMeta = (base_version) => {
  return resolveSchema(base_version, 'Meta');
};

module.exports.search = (args) =>
  new Promise((resolve, reject) => {
    logger.info('ProcessRequest >>> search');

    // Common search params
    let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } =
      args;

    // Search Result params
    let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } =
      args;

    // Resource Specific params
    let action = args['action'];
    let identifier = args['identifier'];
    let organization = args['organization'];
    let provider = args['provider'];

    // TODO: Build query from Parameters

    // TODO: Query database

    let ProcessRequest = getProcessRequest(base_version);

    // Cast all results to ProcessRequest Class
    let processrequest_resource = new ProcessRequest();
    // TODO: Set data with constructor or setter methods
    processrequest_resource.id = 'test id';

    // Return Array
    resolve([processrequest_resource]);
  });

module.exports.searchById = (args) =>
  new Promise((resolve, reject) => {
    logger.info('ProcessRequest >>> searchById');

    let { base_version, id } = args;

    let ProcessRequest = getProcessRequest(base_version);

    // TODO: Build query from Parameters

    // TODO: Query database

    // Cast result to ProcessRequest Class
    let processrequest_resource = new ProcessRequest();
    // TODO: Set data with constructor or setter methods
    processrequest_resource.id = 'test id';

    // Return resource class
    // resolve(processrequest_resource);
    resolve();
  });

module.exports.create = (args, { req }) =>
  new Promise((resolve, reject) => {
    logger.info('ProcessRequest >>> create');

    let { base_version, resource } = args;
    // Make sure to use this ID when inserting this resource
    let id = new ObjectID().toString();

    let ProcessRequest = getProcessRequest(base_version);
    let Meta = getMeta(base_version);

    // TODO: determine if client/server sets ID

    // Cast resource to ProcessRequest Class
    let processrequest_resource = new ProcessRequest(resource);
    processrequest_resource.meta = new Meta();
    // TODO: set meta info

    // TODO: save record to database

    // Return Id
    resolve({ id });
  });

module.exports.update = (args, { req }) =>
  new Promise((resolve, reject) => {
    logger.info('ProcessRequest >>> update');

    let { base_version, id, resource } = args;

    let ProcessRequest = getProcessRequest(base_version);
    let Meta = getMeta(base_version);

    // Cast resource to ProcessRequest Class
    let processrequest_resource = new ProcessRequest(resource);
    processrequest_resource.meta = new Meta();
    // TODO: set meta info, increment meta ID

    // TODO: save record to database

    // Return id, if recorded was created or updated, new meta version id
    resolve({
      id: processrequest_resource.id,
      created: false,
      resource_version: processrequest_resource.meta.versionId,
    });
  });

module.exports.remove = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('ProcessRequest >>> remove');

    let { id } = args;

    // TODO: delete record in database (soft/hard)

    // Return number of records deleted
    resolve({ deleted: 0 });
  });

module.exports.searchByVersionId = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('ProcessRequest >>> searchByVersionId');

    let { base_version, id, version_id } = args;

    let ProcessRequest = getProcessRequest(base_version);

    // TODO: Build query from Parameters

    // TODO: Query database

    // Cast result to ProcessRequest Class
    let processrequest_resource = new ProcessRequest();

    // Return resource class
    resolve(processrequest_resource);
  });

module.exports.history = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('ProcessRequest >>> history');

    // Common search params
    let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } =
      args;

    // Search Result params
    let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } =
      args;

    // Resource Specific params
    let action = args['action'];
    let identifier = args['identifier'];
    let organization = args['organization'];
    let provider = args['provider'];

    // TODO: Build query from Parameters

    // TODO: Query database

    let ProcessRequest = getProcessRequest(base_version);

    // Cast all results to ProcessRequest Class
    let processrequest_resource = new ProcessRequest();

    // Return Array
    resolve([processrequest_resource]);
  });

module.exports.historyById = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('ProcessRequest >>> historyById');

    // Common search params
    let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } =
      args;

    // Search Result params
    let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } =
      args;

    // Resource Specific params
    let action = args['action'];
    let identifier = args['identifier'];
    let organization = args['organization'];
    let provider = args['provider'];

    // TODO: Build query from Parameters

    // TODO: Query database

    let ProcessRequest = getProcessRequest(base_version);

    // Cast all results to ProcessRequest Class
    let processrequest_resource = new ProcessRequest();

    // Return Array
    resolve([processrequest_resource]);
  });
