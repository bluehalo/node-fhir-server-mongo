/*eslint no-unused-vars: "warn"*/

const { VERSIONS } = require('@asymmetrik/node-fhir-server-core').constants;
const { resolveSchema } = require('@asymmetrik/node-fhir-server-core');
const FHIRServer = require('@asymmetrik/node-fhir-server-core');
const { ObjectID } = require('mongodb');
const logger = require('@asymmetrik/node-fhir-server-core').loggers.get();

let getDetectedIssue = (base_version) => {
  return resolveSchema(base_version, 'DetectedIssue');
};

let getMeta = (base_version) => {
  return resolveSchema(base_version, 'Meta');
};

module.exports.search = (args) =>
  new Promise((resolve, reject) => {
    logger.info('DetectedIssue >>> search');

    // Common search params
    let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } =
      args;

    // Search Result params
    let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } =
      args;

    // Resource Specific params
    let author = args['author'];
    let category = args['category'];
    let date = args['date'];
    let identifier = args['identifier'];
    let implicated = args['implicated'];
    let patient = args['patient'];

    // TODO: Build query from Parameters

    // TODO: Query database

    let DetectedIssue = getDetectedIssue(base_version);

    // Cast all results to DetectedIssue Class
    let detectedissue_resource = new DetectedIssue();
    // TODO: Set data with constructor or setter methods
    detectedissue_resource.id = 'test id';

    // Return Array
    resolve([detectedissue_resource]);
  });

module.exports.searchById = (args) =>
  new Promise((resolve, reject) => {
    logger.info('DetectedIssue >>> searchById');

    let { base_version, id } = args;

    let DetectedIssue = getDetectedIssue(base_version);

    // TODO: Build query from Parameters

    // TODO: Query database

    // Cast result to DetectedIssue Class
    let detectedissue_resource = new DetectedIssue();
    // TODO: Set data with constructor or setter methods
    detectedissue_resource.id = 'test id';

    // Return resource class
    // resolve(detectedissue_resource);
    resolve();
  });

module.exports.create = (args, { req }) =>
  new Promise((resolve, reject) => {
    logger.info('DetectedIssue >>> create');

    let { base_version, resource } = args;
    // Make sure to use this ID when inserting this resource
    let id = new ObjectID().toString();

    let DetectedIssue = getDetectedIssue(base_version);
    let Meta = getMeta(base_version);

    // TODO: determine if client/server sets ID

    // Cast resource to DetectedIssue Class
    let detectedissue_resource = new DetectedIssue(resource);
    detectedissue_resource.meta = new Meta();
    // TODO: set meta info

    // TODO: save record to database

    // Return Id
    resolve({ id });
  });

module.exports.update = (args, { req }) =>
  new Promise((resolve, reject) => {
    logger.info('DetectedIssue >>> update');

    let { base_version, id, resource } = args;

    let DetectedIssue = getDetectedIssue(base_version);
    let Meta = getMeta(base_version);

    // Cast resource to DetectedIssue Class
    let detectedissue_resource = new DetectedIssue(resource);
    detectedissue_resource.meta = new Meta();
    // TODO: set meta info, increment meta ID

    // TODO: save record to database

    // Return id, if recorded was created or updated, new meta version id
    resolve({
      id: detectedissue_resource.id,
      created: false,
      resource_version: detectedissue_resource.meta.versionId,
    });
  });

module.exports.remove = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('DetectedIssue >>> remove');

    let { id } = args;

    // TODO: delete record in database (soft/hard)

    // Return number of records deleted
    resolve({ deleted: 0 });
  });

module.exports.searchByVersionId = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('DetectedIssue >>> searchByVersionId');

    let { base_version, id, version_id } = args;

    let DetectedIssue = getDetectedIssue(base_version);

    // TODO: Build query from Parameters

    // TODO: Query database

    // Cast result to DetectedIssue Class
    let detectedissue_resource = new DetectedIssue();

    // Return resource class
    resolve(detectedissue_resource);
  });

module.exports.history = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('DetectedIssue >>> history');

    // Common search params
    let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } =
      args;

    // Search Result params
    let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } =
      args;

    // Resource Specific params
    let author = args['author'];
    let category = args['category'];
    let date = args['date'];
    let identifier = args['identifier'];
    let implicated = args['implicated'];
    let patient = args['patient'];

    // TODO: Build query from Parameters

    // TODO: Query database

    let DetectedIssue = getDetectedIssue(base_version);

    // Cast all results to DetectedIssue Class
    let detectedissue_resource = new DetectedIssue();

    // Return Array
    resolve([detectedissue_resource]);
  });

module.exports.historyById = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('DetectedIssue >>> historyById');

    // Common search params
    let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } =
      args;

    // Search Result params
    let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } =
      args;

    // Resource Specific params
    let author = args['author'];
    let category = args['category'];
    let date = args['date'];
    let identifier = args['identifier'];
    let implicated = args['implicated'];
    let patient = args['patient'];

    // TODO: Build query from Parameters

    // TODO: Query database

    let DetectedIssue = getDetectedIssue(base_version);

    // Cast all results to DetectedIssue Class
    let detectedissue_resource = new DetectedIssue();

    // Return Array
    resolve([detectedissue_resource]);
  });
