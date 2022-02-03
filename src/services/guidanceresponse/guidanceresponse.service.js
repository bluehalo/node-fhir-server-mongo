/*eslint no-unused-vars: "warn"*/

const { VERSIONS } = require('@asymmetrik/node-fhir-server-core').constants;
const { resolveSchema } = require('@asymmetrik/node-fhir-server-core');
const FHIRServer = require('@asymmetrik/node-fhir-server-core');
const { ObjectID } = require('mongodb');
const logger = require('@asymmetrik/node-fhir-server-core').loggers.get();

let getGuidanceResponse = (base_version) => {
  return resolveSchema(base_version, 'GuidanceResponse');
};

let getMeta = (base_version) => {
  return resolveSchema(base_version, 'Meta');
};

module.exports.search = (args) =>
  new Promise((resolve, reject) => {
    logger.info('GuidanceResponse >>> search');

    // Common search params
    let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } =
      args;

    // Search Result params
    let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } =
      args;

    // Resource Specific params
    let identifier = args['identifier'];
    let patient = args['patient'];
    let request = args['request'];
    let subject = args['subject'];

    // TODO: Build query from Parameters

    // TODO: Query database

    let GuidanceResponse = getGuidanceResponse(base_version);

    // Cast all results to GuidanceResponse Class
    let guidanceresponse_resource = new GuidanceResponse();
    // TODO: Set data with constructor or setter methods
    guidanceresponse_resource.id = 'test id';

    // Return Array
    resolve([guidanceresponse_resource]);
  });

module.exports.searchById = (args) =>
  new Promise((resolve, reject) => {
    logger.info('GuidanceResponse >>> searchById');

    let { base_version, id } = args;

    let GuidanceResponse = getGuidanceResponse(base_version);

    // TODO: Build query from Parameters

    // TODO: Query database

    // Cast result to GuidanceResponse Class
    let guidanceresponse_resource = new GuidanceResponse();
    // TODO: Set data with constructor or setter methods
    guidanceresponse_resource.id = 'test id';

    // Return resource class
    // resolve(guidanceresponse_resource);
    resolve();
  });

module.exports.create = (args, { req }) =>
  new Promise((resolve, reject) => {
    logger.info('GuidanceResponse >>> create');

    let { base_version, resource } = args;
    // Make sure to use this ID when inserting this resource
    let id = new ObjectID().toString();

    let GuidanceResponse = getGuidanceResponse(base_version);
    let Meta = getMeta(base_version);

    // TODO: determine if client/server sets ID

    // Cast resource to GuidanceResponse Class
    let guidanceresponse_resource = new GuidanceResponse(resource);
    guidanceresponse_resource.meta = new Meta();
    // TODO: set meta info

    // TODO: save record to database

    // Return Id
    resolve({ id });
  });

module.exports.update = (args, { req }) =>
  new Promise((resolve, reject) => {
    logger.info('GuidanceResponse >>> update');

    let { base_version, id, resource } = args;

    let GuidanceResponse = getGuidanceResponse(base_version);
    let Meta = getMeta(base_version);

    // Cast resource to GuidanceResponse Class
    let guidanceresponse_resource = new GuidanceResponse(resource);
    guidanceresponse_resource.meta = new Meta();
    // TODO: set meta info, increment meta ID

    // TODO: save record to database

    // Return id, if recorded was created or updated, new meta version id
    resolve({
      id: guidanceresponse_resource.id,
      created: false,
      resource_version: guidanceresponse_resource.meta.versionId,
    });
  });

module.exports.remove = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('GuidanceResponse >>> remove');

    let { id } = args;

    // TODO: delete record in database (soft/hard)

    // Return number of records deleted
    resolve({ deleted: 0 });
  });

module.exports.searchByVersionId = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('GuidanceResponse >>> searchByVersionId');

    let { base_version, id, version_id } = args;

    let GuidanceResponse = getGuidanceResponse(base_version);

    // TODO: Build query from Parameters

    // TODO: Query database

    // Cast result to GuidanceResponse Class
    let guidanceresponse_resource = new GuidanceResponse();

    // Return resource class
    resolve(guidanceresponse_resource);
  });

module.exports.history = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('GuidanceResponse >>> history');

    // Common search params
    let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } =
      args;

    // Search Result params
    let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } =
      args;

    // Resource Specific params
    let identifier = args['identifier'];
    let patient = args['patient'];
    let request = args['request'];
    let subject = args['subject'];

    // TODO: Build query from Parameters

    // TODO: Query database

    let GuidanceResponse = getGuidanceResponse(base_version);

    // Cast all results to GuidanceResponse Class
    let guidanceresponse_resource = new GuidanceResponse();

    // Return Array
    resolve([guidanceresponse_resource]);
  });

module.exports.historyById = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('GuidanceResponse >>> historyById');

    // Common search params
    let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } =
      args;

    // Search Result params
    let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } =
      args;

    // Resource Specific params
    let identifier = args['identifier'];
    let patient = args['patient'];
    let request = args['request'];
    let subject = args['subject'];

    // TODO: Build query from Parameters

    // TODO: Query database

    let GuidanceResponse = getGuidanceResponse(base_version);

    // Cast all results to GuidanceResponse Class
    let guidanceresponse_resource = new GuidanceResponse();

    // Return Array
    resolve([guidanceresponse_resource]);
  });
