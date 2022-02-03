/*eslint no-unused-vars: "warn"*/

const { VERSIONS } = require('@asymmetrik/node-fhir-server-core').constants;
const { resolveSchema } = require('@asymmetrik/node-fhir-server-core');
const FHIRServer = require('@asymmetrik/node-fhir-server-core');
const { ObjectID } = require('mongodb');
const logger = require('@asymmetrik/node-fhir-server-core').loggers.get();

let getSupplyRequest = (base_version) => {
  return resolveSchema(base_version, 'SupplyRequest');
};

let getMeta = (base_version) => {
  return resolveSchema(base_version, 'Meta');
};

module.exports.search = (args) =>
  new Promise((resolve, reject) => {
    logger.info('SupplyRequest >>> search');

    // Common search params
    let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } =
      args;

    // Search Result params
    let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } =
      args;

    // Resource Specific params
    let category = args['category'];
    let date = args['date'];
    let identifier = args['identifier'];
    let requester = args['requester'];
    let status = args['status'];
    let supplier = args['supplier'];

    // TODO: Build query from Parameters

    // TODO: Query database

    let SupplyRequest = getSupplyRequest(base_version);

    // Cast all results to SupplyRequest Class
    let supplyrequest_resource = new SupplyRequest();
    // TODO: Set data with constructor or setter methods
    supplyrequest_resource.id = 'test id';

    // Return Array
    resolve([supplyrequest_resource]);
  });

module.exports.searchById = (args) =>
  new Promise((resolve, reject) => {
    logger.info('SupplyRequest >>> searchById');

    let { base_version, id } = args;

    let SupplyRequest = getSupplyRequest(base_version);

    // TODO: Build query from Parameters

    // TODO: Query database

    // Cast result to SupplyRequest Class
    let supplyrequest_resource = new SupplyRequest();
    // TODO: Set data with constructor or setter methods
    supplyrequest_resource.id = 'test id';

    // Return resource class
    // resolve(supplyrequest_resource);
    resolve();
  });

module.exports.create = (args, { req }) =>
  new Promise((resolve, reject) => {
    logger.info('SupplyRequest >>> create');

    let { base_version, resource } = args;
    // Make sure to use this ID when inserting this resource
    let id = new ObjectID().toString();

    let SupplyRequest = getSupplyRequest(base_version);
    let Meta = getMeta(base_version);

    // TODO: determine if client/server sets ID

    // Cast resource to SupplyRequest Class
    let supplyrequest_resource = new SupplyRequest(resource);
    supplyrequest_resource.meta = new Meta();
    // TODO: set meta info

    // TODO: save record to database

    // Return Id
    resolve({ id });
  });

module.exports.update = (args, { req }) =>
  new Promise((resolve, reject) => {
    logger.info('SupplyRequest >>> update');

    let { base_version, id, resource } = args;

    let SupplyRequest = getSupplyRequest(base_version);
    let Meta = getMeta(base_version);

    // Cast resource to SupplyRequest Class
    let supplyrequest_resource = new SupplyRequest(resource);
    supplyrequest_resource.meta = new Meta();
    // TODO: set meta info, increment meta ID

    // TODO: save record to database

    // Return id, if recorded was created or updated, new meta version id
    resolve({
      id: supplyrequest_resource.id,
      created: false,
      resource_version: supplyrequest_resource.meta.versionId,
    });
  });

module.exports.remove = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('SupplyRequest >>> remove');

    let { id } = args;

    // TODO: delete record in database (soft/hard)

    // Return number of records deleted
    resolve({ deleted: 0 });
  });

module.exports.searchByVersionId = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('SupplyRequest >>> searchByVersionId');

    let { base_version, id, version_id } = args;

    let SupplyRequest = getSupplyRequest(base_version);

    // TODO: Build query from Parameters

    // TODO: Query database

    // Cast result to SupplyRequest Class
    let supplyrequest_resource = new SupplyRequest();

    // Return resource class
    resolve(supplyrequest_resource);
  });

module.exports.history = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('SupplyRequest >>> history');

    // Common search params
    let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } =
      args;

    // Search Result params
    let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } =
      args;

    // Resource Specific params
    let category = args['category'];
    let date = args['date'];
    let identifier = args['identifier'];
    let requester = args['requester'];
    let status = args['status'];
    let supplier = args['supplier'];

    // TODO: Build query from Parameters

    // TODO: Query database

    let SupplyRequest = getSupplyRequest(base_version);

    // Cast all results to SupplyRequest Class
    let supplyrequest_resource = new SupplyRequest();

    // Return Array
    resolve([supplyrequest_resource]);
  });

module.exports.historyById = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('SupplyRequest >>> historyById');

    // Common search params
    let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } =
      args;

    // Search Result params
    let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } =
      args;

    // Resource Specific params
    let category = args['category'];
    let date = args['date'];
    let identifier = args['identifier'];
    let requester = args['requester'];
    let status = args['status'];
    let supplier = args['supplier'];

    // TODO: Build query from Parameters

    // TODO: Query database

    let SupplyRequest = getSupplyRequest(base_version);

    // Cast all results to SupplyRequest Class
    let supplyrequest_resource = new SupplyRequest();

    // Return Array
    resolve([supplyrequest_resource]);
  });
