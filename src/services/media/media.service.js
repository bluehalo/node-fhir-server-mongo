/*eslint no-unused-vars: "warn"*/

const { VERSIONS } = require('@bluehalo/node-fhir-server-core').constants;
const { resolveSchema } = require('@bluehalo/node-fhir-server-core');
const FHIRServer = require('@bluehalo/node-fhir-server-core');
const { ObjectID } = require('mongodb');
const logger = require('@bluehalo/node-fhir-server-core').loggers.get();

let getMedia = (base_version) => {
  return resolveSchema(base_version, 'Media');
};

let getMeta = (base_version) => {
  return resolveSchema(base_version, 'Meta');
};

module.exports.search = (args) =>
  new Promise((resolve, reject) => {
    logger.info('Media >>> search');

    // Common search params
    let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } =
      args;

    // Search Result params
    let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } =
      args;

    // Resource Specific params
    let based_on = args['based-on'];
    let _context = args['_context'];
    let created = args['created'];
    let date = args['date'];
    let device = args['device'];
    let identifier = args['identifier'];
    let operator = args['operator'];
    let patient = args['patient'];
    let site = args['site'];
    let subject = args['subject'];
    let subtype = args['subtype'];
    let type = args['type'];
    let view = args['view'];

    // TODO: Build query from Parameters

    // TODO: Query database

    let Media = getMedia(base_version);

    // Cast all results to Media Class
    let media_resource = new Media();
    // TODO: Set data with constructor or setter methods
    media_resource.id = 'test id';

    // Return Array
    resolve([media_resource]);
  });

module.exports.searchById = (args) =>
  new Promise((resolve, reject) => {
    logger.info('Media >>> searchById');

    let { base_version, id } = args;

    let Media = getMedia(base_version);

    // TODO: Build query from Parameters

    // TODO: Query database

    // Cast result to Media Class
    let media_resource = new Media();
    // TODO: Set data with constructor or setter methods
    media_resource.id = 'test id';

    // Return resource class
    // resolve(media_resource);
    resolve();
  });

module.exports.create = (args, { req }) =>
  new Promise((resolve, reject) => {
    logger.info('Media >>> create');

    let { base_version, resource } = args;
    // Make sure to use this ID when inserting this resource
    let id = new ObjectID().toString();

    let Media = getMedia(base_version);
    let Meta = getMeta(base_version);

    // TODO: determine if client/server sets ID

    // Cast resource to Media Class
    let media_resource = new Media(resource);
    media_resource.meta = new Meta();
    // TODO: set meta info

    // TODO: save record to database

    // Return Id
    resolve({ id });
  });

module.exports.update = (args, { req }) =>
  new Promise((resolve, reject) => {
    logger.info('Media >>> update');

    let { base_version, id, resource } = args;

    let Media = getMedia(base_version);
    let Meta = getMeta(base_version);

    // Cast resource to Media Class
    let media_resource = new Media(resource);
    media_resource.meta = new Meta();
    // TODO: set meta info, increment meta ID

    // TODO: save record to database

    // Return id, if recorded was created or updated, new meta version id
    resolve({
      id: media_resource.id,
      created: false,
      resource_version: media_resource.meta.versionId,
    });
  });

module.exports.remove = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('Media >>> remove');

    let { id } = args;

    // TODO: delete record in database (soft/hard)

    // Return number of records deleted
    resolve({ deleted: 0 });
  });

module.exports.searchByVersionId = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('Media >>> searchByVersionId');

    let { base_version, id, version_id } = args;

    let Media = getMedia(base_version);

    // TODO: Build query from Parameters

    // TODO: Query database

    // Cast result to Media Class
    let media_resource = new Media();

    // Return resource class
    resolve(media_resource);
  });

module.exports.history = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('Media >>> history');

    // Common search params
    let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } =
      args;

    // Search Result params
    let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } =
      args;

    // Resource Specific params
    let based_on = args['based-on'];
    let _context = args['_context'];
    let created = args['created'];
    let date = args['date'];
    let device = args['device'];
    let identifier = args['identifier'];
    let operator = args['operator'];
    let patient = args['patient'];
    let site = args['site'];
    let subject = args['subject'];
    let subtype = args['subtype'];
    let type = args['type'];
    let view = args['view'];

    // TODO: Build query from Parameters

    // TODO: Query database

    let Media = getMedia(base_version);

    // Cast all results to Media Class
    let media_resource = new Media();

    // Return Array
    resolve([media_resource]);
  });

module.exports.historyById = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('Media >>> historyById');

    // Common search params
    let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } =
      args;

    // Search Result params
    let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } =
      args;

    // Resource Specific params
    let based_on = args['based-on'];
    let _context = args['_context'];
    let created = args['created'];
    let date = args['date'];
    let device = args['device'];
    let identifier = args['identifier'];
    let operator = args['operator'];
    let patient = args['patient'];
    let site = args['site'];
    let subject = args['subject'];
    let subtype = args['subtype'];
    let type = args['type'];
    let view = args['view'];

    // TODO: Build query from Parameters

    // TODO: Query database

    let Media = getMedia(base_version);

    // Cast all results to Media Class
    let media_resource = new Media();

    // Return Array
    resolve([media_resource]);
  });
