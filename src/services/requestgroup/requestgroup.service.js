/*eslint no-unused-vars: "warn"*/

const { VERSIONS } = require('@asymmetrik/node-fhir-server-core').constants;
const { resolveSchema } = require('@asymmetrik/node-fhir-server-core');
const FHIRServer = require('@asymmetrik/node-fhir-server-core');
const { ObjectID } = require('mongodb');
const logger = require('@asymmetrik/node-fhir-server-core').loggers.get();

let getRequestGroup = (base_version) => {
  return resolveSchema(base_version, 'RequestGroup');
};

let getMeta = (base_version) => {
  return resolveSchema(base_version, 'Meta');
};

module.exports.search = (args) =>
  new Promise((resolve, reject) => {
    logger.info('RequestGroup >>> search');

    // Common search params
    let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } =
      args;

    // Search Result params
    let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } =
      args;

    // Resource Specific params
    let author = args['author'];
    let authored = args['authored'];
    let _context = args['_context'];
    let definition = args['definition'];
    let encounter = args['encounter'];
    let group_identifier = args['group-identifier'];
    let identifier = args['identifier'];
    let intent = args['intent'];
    let participant = args['participant'];
    let patient = args['patient'];
    let priority = args['priority'];
    let status = args['status'];
    let subject = args['subject'];

    // TODO: Build query from Parameters

    // TODO: Query database

    let RequestGroup = getRequestGroup(base_version);

    // Cast all results to RequestGroup Class
    let requestgroup_resource = new RequestGroup();
    // TODO: Set data with constructor or setter methods
    requestgroup_resource.id = 'test id';

    // Return Array
    resolve([requestgroup_resource]);
  });

module.exports.searchById = (args) =>
  new Promise((resolve, reject) => {
    logger.info('RequestGroup >>> searchById');

    let { base_version, id } = args;

    let RequestGroup = getRequestGroup(base_version);

    // TODO: Build query from Parameters

    // TODO: Query database

    // Cast result to RequestGroup Class
    let requestgroup_resource = new RequestGroup();
    // TODO: Set data with constructor or setter methods
    requestgroup_resource.id = 'test id';

    // Return resource class
    // resolve(requestgroup_resource);
    resolve();
  });

module.exports.create = (args, { req }) =>
  new Promise((resolve, reject) => {
    logger.info('RequestGroup >>> create');

    let { base_version, resource } = args;
    // Make sure to use this ID when inserting this resource
    let id = new ObjectID().toString();

    let RequestGroup = getRequestGroup(base_version);
    let Meta = getMeta(base_version);

    // TODO: determine if client/server sets ID

    // Cast resource to RequestGroup Class
    let requestgroup_resource = new RequestGroup(resource);
    requestgroup_resource.meta = new Meta();
    // TODO: set meta info

    // TODO: save record to database

    // Return Id
    resolve({ id });
  });

module.exports.update = (args, { req }) =>
  new Promise((resolve, reject) => {
    logger.info('RequestGroup >>> update');

    let { base_version, id, resource } = args;

    let RequestGroup = getRequestGroup(base_version);
    let Meta = getMeta(base_version);

    // Cast resource to RequestGroup Class
    let requestgroup_resource = new RequestGroup(resource);
    requestgroup_resource.meta = new Meta();
    // TODO: set meta info, increment meta ID

    // TODO: save record to database

    // Return id, if recorded was created or updated, new meta version id
    resolve({
      id: requestgroup_resource.id,
      created: false,
      resource_version: requestgroup_resource.meta.versionId,
    });
  });

module.exports.remove = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('RequestGroup >>> remove');

    let { id } = args;

    // TODO: delete record in database (soft/hard)

    // Return number of records deleted
    resolve({ deleted: 0 });
  });

module.exports.searchByVersionId = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('RequestGroup >>> searchByVersionId');

    let { base_version, id, version_id } = args;

    let RequestGroup = getRequestGroup(base_version);

    // TODO: Build query from Parameters

    // TODO: Query database

    // Cast result to RequestGroup Class
    let requestgroup_resource = new RequestGroup();

    // Return resource class
    resolve(requestgroup_resource);
  });

module.exports.history = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('RequestGroup >>> history');

    // Common search params
    let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } =
      args;

    // Search Result params
    let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } =
      args;

    // Resource Specific params
    let author = args['author'];
    let authored = args['authored'];
    let _context = args['_context'];
    let definition = args['definition'];
    let encounter = args['encounter'];
    let group_identifier = args['group-identifier'];
    let identifier = args['identifier'];
    let intent = args['intent'];
    let participant = args['participant'];
    let patient = args['patient'];
    let priority = args['priority'];
    let status = args['status'];
    let subject = args['subject'];

    // TODO: Build query from Parameters

    // TODO: Query database

    let RequestGroup = getRequestGroup(base_version);

    // Cast all results to RequestGroup Class
    let requestgroup_resource = new RequestGroup();

    // Return Array
    resolve([requestgroup_resource]);
  });

module.exports.historyById = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('RequestGroup >>> historyById');

    // Common search params
    let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } =
      args;

    // Search Result params
    let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } =
      args;

    // Resource Specific params
    let author = args['author'];
    let authored = args['authored'];
    let _context = args['_context'];
    let definition = args['definition'];
    let encounter = args['encounter'];
    let group_identifier = args['group-identifier'];
    let identifier = args['identifier'];
    let intent = args['intent'];
    let participant = args['participant'];
    let patient = args['patient'];
    let priority = args['priority'];
    let status = args['status'];
    let subject = args['subject'];

    // TODO: Build query from Parameters

    // TODO: Query database

    let RequestGroup = getRequestGroup(base_version);

    // Cast all results to RequestGroup Class
    let requestgroup_resource = new RequestGroup();

    // Return Array
    resolve([requestgroup_resource]);
  });
