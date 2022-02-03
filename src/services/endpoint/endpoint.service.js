/*eslint no-unused-vars: "warn"*/

const { VERSIONS } = require('@asymmetrik/node-fhir-server-core').constants;
const { resolveSchema } = require('@asymmetrik/node-fhir-server-core');
const FHIRServer = require('@asymmetrik/node-fhir-server-core');
const { ObjectID } = require('mongodb');
const logger = require('@asymmetrik/node-fhir-server-core').loggers.get();

let getEndpoint = (base_version) => {
  return resolveSchema(base_version, 'Endpoint');
};

let getMeta = (base_version) => {
  return resolveSchema(base_version, 'Meta');
};

module.exports.search = (args) =>
  new Promise((resolve, reject) => {
    logger.info('Endpoint >>> search');

    // Common search params
    let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } =
      args;

    // Search Result params
    let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } =
      args;

    // Resource Specific params
    let connection_type = args['connection-type'];
    let identifier = args['identifier'];
    let name = args['name'];
    let organization = args['organization'];
    let payload_type = args['payload-type'];
    let status = args['status'];

    // TODO: Build query from Parameters

    // TODO: Query database

    let Endpoint = getEndpoint(base_version);

    // Cast all results to Endpoint Class
    let endpoint_resource = new Endpoint();
    // TODO: Set data with constructor or setter methods
    endpoint_resource.id = 'test id';

    // Return Array
    resolve([endpoint_resource]);
  });

module.exports.searchById = (args) =>
  new Promise((resolve, reject) => {
    logger.info('Endpoint >>> searchById');

    let { base_version, id } = args;

    let Endpoint = getEndpoint(base_version);

    // TODO: Build query from Parameters

    // TODO: Query database

    // Cast result to Endpoint Class
    let endpoint_resource = new Endpoint();
    // TODO: Set data with constructor or setter methods
    endpoint_resource.id = 'test id';

    // Return resource class
    // resolve(endpoint_resource);
    resolve();
  });

module.exports.create = (args, { req }) =>
  new Promise((resolve, reject) => {
    logger.info('Endpoint >>> create');

    let { base_version, resource } = args;
    // Make sure to use this ID when inserting this resource
    let id = new ObjectID().toString();

    let Endpoint = getEndpoint(base_version);
    let Meta = getMeta(base_version);

    // TODO: determine if client/server sets ID

    // Cast resource to Endpoint Class
    let endpoint_resource = new Endpoint(resource);
    endpoint_resource.meta = new Meta();
    // TODO: set meta info

    // TODO: save record to database

    // Return Id
    resolve({ id });
  });

module.exports.update = (args, { req }) =>
  new Promise((resolve, reject) => {
    logger.info('Endpoint >>> update');

    let { base_version, id, resource } = args;

    let Endpoint = getEndpoint(base_version);
    let Meta = getMeta(base_version);

    // Cast resource to Endpoint Class
    let endpoint_resource = new Endpoint(resource);
    endpoint_resource.meta = new Meta();
    // TODO: set meta info, increment meta ID

    // TODO: save record to database

    // Return id, if recorded was created or updated, new meta version id
    resolve({
      id: endpoint_resource.id,
      created: false,
      resource_version: endpoint_resource.meta.versionId,
    });
  });

module.exports.remove = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('Endpoint >>> remove');

    let { id } = args;

    // TODO: delete record in database (soft/hard)

    // Return number of records deleted
    resolve({ deleted: 0 });
  });

module.exports.searchByVersionId = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('Endpoint >>> searchByVersionId');

    let { base_version, id, version_id } = args;

    let Endpoint = getEndpoint(base_version);

    // TODO: Build query from Parameters

    // TODO: Query database

    // Cast result to Endpoint Class
    let endpoint_resource = new Endpoint();

    // Return resource class
    resolve(endpoint_resource);
  });

module.exports.history = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('Endpoint >>> history');

    // Common search params
    let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } =
      args;

    // Search Result params
    let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } =
      args;

    // Resource Specific params
    let connection_type = args['connection-type'];
    let identifier = args['identifier'];
    let name = args['name'];
    let organization = args['organization'];
    let payload_type = args['payload-type'];
    let status = args['status'];

    // TODO: Build query from Parameters

    // TODO: Query database

    let Endpoint = getEndpoint(base_version);

    // Cast all results to Endpoint Class
    let endpoint_resource = new Endpoint();

    // Return Array
    resolve([endpoint_resource]);
  });

module.exports.historyById = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('Endpoint >>> historyById');

    // Common search params
    let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } =
      args;

    // Search Result params
    let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } =
      args;

    // Resource Specific params
    let connection_type = args['connection-type'];
    let identifier = args['identifier'];
    let name = args['name'];
    let organization = args['organization'];
    let payload_type = args['payload-type'];
    let status = args['status'];

    // TODO: Build query from Parameters

    // TODO: Query database

    let Endpoint = getEndpoint(base_version);

    // Cast all results to Endpoint Class
    let endpoint_resource = new Endpoint();

    // Return Array
    resolve([endpoint_resource]);
  });
