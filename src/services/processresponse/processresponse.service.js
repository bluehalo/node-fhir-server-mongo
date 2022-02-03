/*eslint no-unused-vars: "warn"*/

const { VERSIONS } = require('@asymmetrik/node-fhir-server-core').constants;
const { resolveSchema } = require('@asymmetrik/node-fhir-server-core');
const FHIRServer = require('@asymmetrik/node-fhir-server-core');
const { ObjectID } = require('mongodb');
const logger = require('@asymmetrik/node-fhir-server-core').loggers.get();

let getProcessResponse = (base_version) => {
  return resolveSchema(base_version, 'ProcessResponse');
};

let getMeta = (base_version) => {
  return resolveSchema(base_version, 'Meta');
};

module.exports.search = (args) =>
  new Promise((resolve, reject) => {
    logger.info('ProcessResponse >>> search');

    // Common search params
    let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } =
      args;

    // Search Result params
    let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } =
      args;

    // Resource Specific params
    let identifier = args['identifier'];
    let organization = args['organization'];
    let request = args['request'];
    let request_organization = args['request-organization'];
    let request_provider = args['request-provider'];

    // TODO: Build query from Parameters

    // TODO: Query database

    let ProcessResponse = getProcessResponse(base_version);

    // Cast all results to ProcessResponse Class
    let processresponse_resource = new ProcessResponse();
    // TODO: Set data with constructor or setter methods
    processresponse_resource.id = 'test id';

    // Return Array
    resolve([processresponse_resource]);
  });

module.exports.searchById = (args) =>
  new Promise((resolve, reject) => {
    logger.info('ProcessResponse >>> searchById');

    let { base_version, id } = args;

    let ProcessResponse = getProcessResponse(base_version);

    // TODO: Build query from Parameters

    // TODO: Query database

    // Cast result to ProcessResponse Class
    let processresponse_resource = new ProcessResponse();
    // TODO: Set data with constructor or setter methods
    processresponse_resource.id = 'test id';

    // Return resource class
    // resolve(processresponse_resource);
    resolve();
  });

module.exports.create = (args, { req }) =>
  new Promise((resolve, reject) => {
    logger.info('ProcessResponse >>> create');

    let { base_version, resource } = args;
    // Make sure to use this ID when inserting this resource
    let id = new ObjectID().toString();

    let ProcessResponse = getProcessResponse(base_version);
    let Meta = getMeta(base_version);

    // TODO: determine if client/server sets ID

    // Cast resource to ProcessResponse Class
    let processresponse_resource = new ProcessResponse(resource);
    processresponse_resource.meta = new Meta();
    // TODO: set meta info

    // TODO: save record to database

    // Return Id
    resolve({ id });
  });

module.exports.update = (args, { req }) =>
  new Promise((resolve, reject) => {
    logger.info('ProcessResponse >>> update');

    let { base_version, id, resource } = args;

    let ProcessResponse = getProcessResponse(base_version);
    let Meta = getMeta(base_version);

    // Cast resource to ProcessResponse Class
    let processresponse_resource = new ProcessResponse(resource);
    processresponse_resource.meta = new Meta();
    // TODO: set meta info, increment meta ID

    // TODO: save record to database

    // Return id, if recorded was created or updated, new meta version id
    resolve({
      id: processresponse_resource.id,
      created: false,
      resource_version: processresponse_resource.meta.versionId,
    });
  });

module.exports.remove = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('ProcessResponse >>> remove');

    let { id } = args;

    // TODO: delete record in database (soft/hard)

    // Return number of records deleted
    resolve({ deleted: 0 });
  });

module.exports.searchByVersionId = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('ProcessResponse >>> searchByVersionId');

    let { base_version, id, version_id } = args;

    let ProcessResponse = getProcessResponse(base_version);

    // TODO: Build query from Parameters

    // TODO: Query database

    // Cast result to ProcessResponse Class
    let processresponse_resource = new ProcessResponse();

    // Return resource class
    resolve(processresponse_resource);
  });

module.exports.history = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('ProcessResponse >>> history');

    // Common search params
    let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } =
      args;

    // Search Result params
    let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } =
      args;

    // Resource Specific params
    let identifier = args['identifier'];
    let organization = args['organization'];
    let request = args['request'];
    let request_organization = args['request-organization'];
    let request_provider = args['request-provider'];

    // TODO: Build query from Parameters

    // TODO: Query database

    let ProcessResponse = getProcessResponse(base_version);

    // Cast all results to ProcessResponse Class
    let processresponse_resource = new ProcessResponse();

    // Return Array
    resolve([processresponse_resource]);
  });

module.exports.historyById = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('ProcessResponse >>> historyById');

    // Common search params
    let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } =
      args;

    // Search Result params
    let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } =
      args;

    // Resource Specific params
    let identifier = args['identifier'];
    let organization = args['organization'];
    let request = args['request'];
    let request_organization = args['request-organization'];
    let request_provider = args['request-provider'];

    // TODO: Build query from Parameters

    // TODO: Query database

    let ProcessResponse = getProcessResponse(base_version);

    // Cast all results to ProcessResponse Class
    let processresponse_resource = new ProcessResponse();

    // Return Array
    resolve([processresponse_resource]);
  });
