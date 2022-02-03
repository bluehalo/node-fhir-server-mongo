/*eslint no-unused-vars: "warn"*/

const { VERSIONS } = require('@asymmetrik/node-fhir-server-core').constants;
const { resolveSchema } = require('@asymmetrik/node-fhir-server-core');
const FHIRServer = require('@asymmetrik/node-fhir-server-core');
const { ObjectID } = require('mongodb');
const logger = require('@asymmetrik/node-fhir-server-core').loggers.get();

let getClaimResponse = (base_version) => {
  return resolveSchema(base_version, 'ClaimResponse');
};

let getMeta = (base_version) => {
  return resolveSchema(base_version, 'Meta');
};

module.exports.search = (args) =>
  new Promise((resolve, reject) => {
    logger.info('ClaimResponse >>> search');

    // Common search params
    let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } =
      args;

    // Search Result params
    let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } =
      args;

    // Resource Specific params
    let created = args['created'];
    let disposition = args['disposition'];
    let identifier = args['identifier'];
    let insurer = args['insurer'];
    let outcome = args['outcome'];
    let patient = args['patient'];
    let payment_date = args['payment-date'];
    let request = args['request'];
    let request_provider = args['request-provider'];

    // TODO: Build query from Parameters

    // TODO: Query database

    let ClaimResponse = getClaimResponse(base_version);

    // Cast all results to ClaimResponse Class
    let claimresponse_resource = new ClaimResponse();
    // TODO: Set data with constructor or setter methods
    claimresponse_resource.id = 'test id';

    // Return Array
    resolve([claimresponse_resource]);
  });

module.exports.searchById = (args) =>
  new Promise((resolve, reject) => {
    logger.info('ClaimResponse >>> searchById');

    let { base_version, id } = args;

    let ClaimResponse = getClaimResponse(base_version);

    // TODO: Build query from Parameters

    // TODO: Query database

    // Cast result to ClaimResponse Class
    let claimresponse_resource = new ClaimResponse();
    // TODO: Set data with constructor or setter methods
    claimresponse_resource.id = 'test id';

    // Return resource class
    // resolve(claimresponse_resource);
    resolve();
  });

module.exports.create = (args, { req }) =>
  new Promise((resolve, reject) => {
    logger.info('ClaimResponse >>> create');

    let { base_version, resource } = args;
    // Make sure to use this ID when inserting this resource
    let id = new ObjectID().toString();

    let ClaimResponse = getClaimResponse(base_version);
    let Meta = getMeta(base_version);

    // TODO: determine if client/server sets ID

    // Cast resource to ClaimResponse Class
    let claimresponse_resource = new ClaimResponse(resource);
    claimresponse_resource.meta = new Meta();
    // TODO: set meta info

    // TODO: save record to database

    // Return Id
    resolve({ id });
  });

module.exports.update = (args, { req }) =>
  new Promise((resolve, reject) => {
    logger.info('ClaimResponse >>> update');

    let { base_version, id, resource } = args;

    let ClaimResponse = getClaimResponse(base_version);
    let Meta = getMeta(base_version);

    // Cast resource to ClaimResponse Class
    let claimresponse_resource = new ClaimResponse(resource);
    claimresponse_resource.meta = new Meta();
    // TODO: set meta info, increment meta ID

    // TODO: save record to database

    // Return id, if recorded was created or updated, new meta version id
    resolve({
      id: claimresponse_resource.id,
      created: false,
      resource_version: claimresponse_resource.meta.versionId,
    });
  });

module.exports.remove = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('ClaimResponse >>> remove');

    let { id } = args;

    // TODO: delete record in database (soft/hard)

    // Return number of records deleted
    resolve({ deleted: 0 });
  });

module.exports.searchByVersionId = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('ClaimResponse >>> searchByVersionId');

    let { base_version, id, version_id } = args;

    let ClaimResponse = getClaimResponse(base_version);

    // TODO: Build query from Parameters

    // TODO: Query database

    // Cast result to ClaimResponse Class
    let claimresponse_resource = new ClaimResponse();

    // Return resource class
    resolve(claimresponse_resource);
  });

module.exports.history = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('ClaimResponse >>> history');

    // Common search params
    let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } =
      args;

    // Search Result params
    let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } =
      args;

    // Resource Specific params
    let created = args['created'];
    let disposition = args['disposition'];
    let identifier = args['identifier'];
    let insurer = args['insurer'];
    let outcome = args['outcome'];
    let patient = args['patient'];
    let payment_date = args['payment-date'];
    let request = args['request'];
    let request_provider = args['request-provider'];

    // TODO: Build query from Parameters

    // TODO: Query database

    let ClaimResponse = getClaimResponse(base_version);

    // Cast all results to ClaimResponse Class
    let claimresponse_resource = new ClaimResponse();

    // Return Array
    resolve([claimresponse_resource]);
  });

module.exports.historyById = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('ClaimResponse >>> historyById');

    // Common search params
    let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } =
      args;

    // Search Result params
    let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } =
      args;

    // Resource Specific params
    let created = args['created'];
    let disposition = args['disposition'];
    let identifier = args['identifier'];
    let insurer = args['insurer'];
    let outcome = args['outcome'];
    let patient = args['patient'];
    let payment_date = args['payment-date'];
    let request = args['request'];
    let request_provider = args['request-provider'];

    // TODO: Build query from Parameters

    // TODO: Query database

    let ClaimResponse = getClaimResponse(base_version);

    // Cast all results to ClaimResponse Class
    let claimresponse_resource = new ClaimResponse();

    // Return Array
    resolve([claimresponse_resource]);
  });
