/*eslint no-unused-vars: "warn"*/

const { VERSIONS } = require('@asymmetrik/node-fhir-server-core').constants;
const { resolveSchema } = require('@asymmetrik/node-fhir-server-core');
const FHIRServer = require('@asymmetrik/node-fhir-server-core');
const { ObjectID } = require('mongodb');
const logger = require('@asymmetrik/node-fhir-server-core').loggers.get();

let getProcedureRequest = (base_version) => {
  return resolveSchema(base_version, 'ProcedureRequest');
};

let getMeta = (base_version) => {
  return resolveSchema(base_version, 'Meta');
};

module.exports.search = (args) =>
  new Promise((resolve, reject) => {
    logger.info('ProcedureRequest >>> search');

    // Common search params
    let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } =
      args;

    // Search Result params
    let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } =
      args;

    // Resource Specific params
    let authored = args['authored'];
    let based_on = args['based-on'];
    let body_site = args['body-site'];
    let code = args['code'];
    let _context = args['_context'];
    let definition = args['definition'];
    let encounter = args['encounter'];
    let identifier = args['identifier'];
    let intent = args['intent'];
    let occurrence = args['occurrence'];
    let patient = args['patient'];
    let performer = args['performer'];
    let performer_type = args['performer-type'];
    let priority = args['priority'];
    let replaces = args['replaces'];
    let requester = args['requester'];
    let requisition = args['requisition'];
    let specimen = args['specimen'];
    let status = args['status'];
    let subject = args['subject'];

    // TODO: Build query from Parameters

    // TODO: Query database

    let ProcedureRequest = getProcedureRequest(base_version);

    // Cast all results to ProcedureRequest Class
    let procedurerequest_resource = new ProcedureRequest();
    // TODO: Set data with constructor or setter methods
    procedurerequest_resource.id = 'test id';

    // Return Array
    resolve([procedurerequest_resource]);
  });

module.exports.searchById = (args) =>
  new Promise((resolve, reject) => {
    logger.info('ProcedureRequest >>> searchById');

    let { base_version, id } = args;

    let ProcedureRequest = getProcedureRequest(base_version);

    // TODO: Build query from Parameters

    // TODO: Query database

    // Cast result to ProcedureRequest Class
    let procedurerequest_resource = new ProcedureRequest();
    // TODO: Set data with constructor or setter methods
    procedurerequest_resource.id = 'test id';

    // Return resource class
    // resolve(procedurerequest_resource);
    resolve();
  });

module.exports.create = (args, { req }) =>
  new Promise((resolve, reject) => {
    logger.info('ProcedureRequest >>> create');

    let { base_version, resource } = args;
    // Make sure to use this ID when inserting this resource
    let id = new ObjectID().toString();

    let ProcedureRequest = getProcedureRequest(base_version);
    let Meta = getMeta(base_version);

    // TODO: determine if client/server sets ID

    // Cast resource to ProcedureRequest Class
    let procedurerequest_resource = new ProcedureRequest(resource);
    procedurerequest_resource.meta = new Meta();
    // TODO: set meta info

    // TODO: save record to database

    // Return Id
    resolve({ id });
  });

module.exports.update = (args, { req }) =>
  new Promise((resolve, reject) => {
    logger.info('ProcedureRequest >>> update');

    let { base_version, id, resource } = args;

    let ProcedureRequest = getProcedureRequest(base_version);
    let Meta = getMeta(base_version);

    // Cast resource to ProcedureRequest Class
    let procedurerequest_resource = new ProcedureRequest(resource);
    procedurerequest_resource.meta = new Meta();
    // TODO: set meta info, increment meta ID

    // TODO: save record to database

    // Return id, if recorded was created or updated, new meta version id
    resolve({
      id: procedurerequest_resource.id,
      created: false,
      resource_version: procedurerequest_resource.meta.versionId,
    });
  });

module.exports.remove = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('ProcedureRequest >>> remove');

    let { id } = args;

    // TODO: delete record in database (soft/hard)

    // Return number of records deleted
    resolve({ deleted: 0 });
  });

module.exports.searchByVersionId = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('ProcedureRequest >>> searchByVersionId');

    let { base_version, id, version_id } = args;

    let ProcedureRequest = getProcedureRequest(base_version);

    // TODO: Build query from Parameters

    // TODO: Query database

    // Cast result to ProcedureRequest Class
    let procedurerequest_resource = new ProcedureRequest();

    // Return resource class
    resolve(procedurerequest_resource);
  });

module.exports.history = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('ProcedureRequest >>> history');

    // Common search params
    let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } =
      args;

    // Search Result params
    let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } =
      args;

    // Resource Specific params
    let authored = args['authored'];
    let based_on = args['based-on'];
    let body_site = args['body-site'];
    let code = args['code'];
    let _context = args['_context'];
    let definition = args['definition'];
    let encounter = args['encounter'];
    let identifier = args['identifier'];
    let intent = args['intent'];
    let occurrence = args['occurrence'];
    let patient = args['patient'];
    let performer = args['performer'];
    let performer_type = args['performer-type'];
    let priority = args['priority'];
    let replaces = args['replaces'];
    let requester = args['requester'];
    let requisition = args['requisition'];
    let specimen = args['specimen'];
    let status = args['status'];
    let subject = args['subject'];

    // TODO: Build query from Parameters

    // TODO: Query database

    let ProcedureRequest = getProcedureRequest(base_version);

    // Cast all results to ProcedureRequest Class
    let procedurerequest_resource = new ProcedureRequest();

    // Return Array
    resolve([procedurerequest_resource]);
  });

module.exports.historyById = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('ProcedureRequest >>> historyById');

    // Common search params
    let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } =
      args;

    // Search Result params
    let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } =
      args;

    // Resource Specific params
    let authored = args['authored'];
    let based_on = args['based-on'];
    let body_site = args['body-site'];
    let code = args['code'];
    let _context = args['_context'];
    let definition = args['definition'];
    let encounter = args['encounter'];
    let identifier = args['identifier'];
    let intent = args['intent'];
    let occurrence = args['occurrence'];
    let patient = args['patient'];
    let performer = args['performer'];
    let performer_type = args['performer-type'];
    let priority = args['priority'];
    let replaces = args['replaces'];
    let requester = args['requester'];
    let requisition = args['requisition'];
    let specimen = args['specimen'];
    let status = args['status'];
    let subject = args['subject'];

    // TODO: Build query from Parameters

    // TODO: Query database

    let ProcedureRequest = getProcedureRequest(base_version);

    // Cast all results to ProcedureRequest Class
    let procedurerequest_resource = new ProcedureRequest();

    // Return Array
    resolve([procedurerequest_resource]);
  });
