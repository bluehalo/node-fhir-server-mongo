/*eslint no-unused-vars: "warn"*/

const { VERSIONS } = require('@asymmetrik/node-fhir-server-core').constants;
const { resolveSchema } = require('@asymmetrik/node-fhir-server-core');
const FHIRServer = require('@asymmetrik/node-fhir-server-core');
const { ObjectID } = require('mongodb');
const logger = require('@asymmetrik/node-fhir-server-core').loggers.get();

let getEligibilityResponse = (base_version) => {
  return resolveSchema(base_version, 'EligibilityResponse');
};

let getMeta = (base_version) => {
  return resolveSchema(base_version, 'Meta');
};

module.exports.search = (args) =>
  new Promise((resolve, reject) => {
    logger.info('EligibilityResponse >>> search');

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
    let request = args['request'];
    let request_organization = args['request-organization'];
    let request_provider = args['request-provider'];

    // TODO: Build query from Parameters

    // TODO: Query database

    let EligibilityResponse = getEligibilityResponse(base_version);

    // Cast all results to EligibilityResponse Class
    let eligibilityresponse_resource = new EligibilityResponse();
    // TODO: Set data with constructor or setter methods
    eligibilityresponse_resource.id = 'test id';

    // Return Array
    resolve([eligibilityresponse_resource]);
  });

module.exports.searchById = (args) =>
  new Promise((resolve, reject) => {
    logger.info('EligibilityResponse >>> searchById');

    let { base_version, id } = args;

    let EligibilityResponse = getEligibilityResponse(base_version);

    // TODO: Build query from Parameters

    // TODO: Query database

    // Cast result to EligibilityResponse Class
    let eligibilityresponse_resource = new EligibilityResponse();
    // TODO: Set data with constructor or setter methods
    eligibilityresponse_resource.id = 'test id';

    // Return resource class
    // resolve(eligibilityresponse_resource);
    resolve();
  });

module.exports.create = (args, { req }) =>
  new Promise((resolve, reject) => {
    logger.info('EligibilityResponse >>> create');

    let { base_version, resource } = args;
    // Make sure to use this ID when inserting this resource
    let id = new ObjectID().toString();

    let EligibilityResponse = getEligibilityResponse(base_version);
    let Meta = getMeta(base_version);

    // TODO: determine if client/server sets ID

    // Cast resource to EligibilityResponse Class
    let eligibilityresponse_resource = new EligibilityResponse(resource);
    eligibilityresponse_resource.meta = new Meta();
    // TODO: set meta info

    // TODO: save record to database

    // Return Id
    resolve({ id });
  });

module.exports.update = (args, { req }) =>
  new Promise((resolve, reject) => {
    logger.info('EligibilityResponse >>> update');

    let { base_version, id, resource } = args;

    let EligibilityResponse = getEligibilityResponse(base_version);
    let Meta = getMeta(base_version);

    // Cast resource to EligibilityResponse Class
    let eligibilityresponse_resource = new EligibilityResponse(resource);
    eligibilityresponse_resource.meta = new Meta();
    // TODO: set meta info, increment meta ID

    // TODO: save record to database

    // Return id, if recorded was created or updated, new meta version id
    resolve({
      id: eligibilityresponse_resource.id,
      created: false,
      resource_version: eligibilityresponse_resource.meta.versionId,
    });
  });

module.exports.remove = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('EligibilityResponse >>> remove');

    let { id } = args;

    // TODO: delete record in database (soft/hard)

    // Return number of records deleted
    resolve({ deleted: 0 });
  });

module.exports.searchByVersionId = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('EligibilityResponse >>> searchByVersionId');

    let { base_version, id, version_id } = args;

    let EligibilityResponse = getEligibilityResponse(base_version);

    // TODO: Build query from Parameters

    // TODO: Query database

    // Cast result to EligibilityResponse Class
    let eligibilityresponse_resource = new EligibilityResponse();

    // Return resource class
    resolve(eligibilityresponse_resource);
  });

module.exports.history = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('EligibilityResponse >>> history');

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
    let request = args['request'];
    let request_organization = args['request-organization'];
    let request_provider = args['request-provider'];

    // TODO: Build query from Parameters

    // TODO: Query database

    let EligibilityResponse = getEligibilityResponse(base_version);

    // Cast all results to EligibilityResponse Class
    let eligibilityresponse_resource = new EligibilityResponse();

    // Return Array
    resolve([eligibilityresponse_resource]);
  });

module.exports.historyById = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('EligibilityResponse >>> historyById');

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
    let request = args['request'];
    let request_organization = args['request-organization'];
    let request_provider = args['request-provider'];

    // TODO: Build query from Parameters

    // TODO: Query database

    let EligibilityResponse = getEligibilityResponse(base_version);

    // Cast all results to EligibilityResponse Class
    let eligibilityresponse_resource = new EligibilityResponse();

    // Return Array
    resolve([eligibilityresponse_resource]);
  });
