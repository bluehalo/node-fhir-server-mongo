/*eslint no-unused-vars: "warn"*/

const { VERSIONS } = require('@asymmetrik/node-fhir-server-core').constants;
const { resolveSchema } = require('@asymmetrik/node-fhir-server-core');
const FHIRServer = require('@asymmetrik/node-fhir-server-core');
const { ObjectID } = require('mongodb');
const logger = require('@asymmetrik/node-fhir-server-core').loggers.get();

let getCommunicationRequest = (base_version) => {
  return resolveSchema(base_version, 'CommunicationRequest');
};

let getMeta = (base_version) => {
  return resolveSchema(base_version, 'Meta');
};

module.exports.search = (args) =>
  new Promise((resolve, reject) => {
    logger.info('CommunicationRequest >>> search');

    // Common search params
    let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } =
      args;

    // Search Result params
    let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } =
      args;

    // Resource Specific params
    let authored = args['authored'];
    let based_on = args['based-on'];
    let category = args['category'];
    let _context = args['_context'];
    let encounter = args['encounter'];
    let group_identifier = args['group-identifier'];
    let identifier = args['identifier'];
    let medium = args['medium'];
    let occurrence = args['occurrence'];
    let patient = args['patient'];
    let priority = args['priority'];
    let recipient = args['recipient'];
    let replaces = args['replaces'];
    let requester = args['requester'];
    let sender = args['sender'];
    let status = args['status'];
    let subject = args['subject'];

    // TODO: Build query from Parameters

    // TODO: Query database

    let CommunicationRequest = getCommunicationRequest(base_version);

    // Cast all results to CommunicationRequest Class
    let communicationrequest_resource = new CommunicationRequest();
    // TODO: Set data with constructor or setter methods
    communicationrequest_resource.id = 'test id';

    // Return Array
    resolve([communicationrequest_resource]);
  });

module.exports.searchById = (args) =>
  new Promise((resolve, reject) => {
    logger.info('CommunicationRequest >>> searchById');

    let { base_version, id } = args;

    let CommunicationRequest = getCommunicationRequest(base_version);

    // TODO: Build query from Parameters

    // TODO: Query database

    // Cast result to CommunicationRequest Class
    let communicationrequest_resource = new CommunicationRequest();
    // TODO: Set data with constructor or setter methods
    communicationrequest_resource.id = 'test id';

    // Return resource class
    // resolve(communicationrequest_resource);
    resolve();
  });

module.exports.create = (args, { req }) =>
  new Promise((resolve, reject) => {
    logger.info('CommunicationRequest >>> create');

    let { base_version, resource } = args;
    // Make sure to use this ID when inserting this resource
    let id = new ObjectID().toString();

    let CommunicationRequest = getCommunicationRequest(base_version);
    let Meta = getMeta(base_version);

    // TODO: determine if client/server sets ID

    // Cast resource to CommunicationRequest Class
    let communicationrequest_resource = new CommunicationRequest(resource);
    communicationrequest_resource.meta = new Meta();
    // TODO: set meta info

    // TODO: save record to database

    // Return Id
    resolve({ id });
  });

module.exports.update = (args, { req }) =>
  new Promise((resolve, reject) => {
    logger.info('CommunicationRequest >>> update');

    let { base_version, id, resource } = args;

    let CommunicationRequest = getCommunicationRequest(base_version);
    let Meta = getMeta(base_version);

    // Cast resource to CommunicationRequest Class
    let communicationrequest_resource = new CommunicationRequest(resource);
    communicationrequest_resource.meta = new Meta();
    // TODO: set meta info, increment meta ID

    // TODO: save record to database

    // Return id, if recorded was created or updated, new meta version id
    resolve({
      id: communicationrequest_resource.id,
      created: false,
      resource_version: communicationrequest_resource.meta.versionId,
    });
  });

module.exports.remove = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('CommunicationRequest >>> remove');

    let { id } = args;

    // TODO: delete record in database (soft/hard)

    // Return number of records deleted
    resolve({ deleted: 0 });
  });

module.exports.searchByVersionId = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('CommunicationRequest >>> searchByVersionId');

    let { base_version, id, version_id } = args;

    let CommunicationRequest = getCommunicationRequest(base_version);

    // TODO: Build query from Parameters

    // TODO: Query database

    // Cast result to CommunicationRequest Class
    let communicationrequest_resource = new CommunicationRequest();

    // Return resource class
    resolve(communicationrequest_resource);
  });

module.exports.history = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('CommunicationRequest >>> history');

    // Common search params
    let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } =
      args;

    // Search Result params
    let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } =
      args;

    // Resource Specific params
    let authored = args['authored'];
    let based_on = args['based-on'];
    let category = args['category'];
    let _context = args['_context'];
    let encounter = args['encounter'];
    let group_identifier = args['group-identifier'];
    let identifier = args['identifier'];
    let medium = args['medium'];
    let occurrence = args['occurrence'];
    let patient = args['patient'];
    let priority = args['priority'];
    let recipient = args['recipient'];
    let replaces = args['replaces'];
    let requester = args['requester'];
    let sender = args['sender'];
    let status = args['status'];
    let subject = args['subject'];

    // TODO: Build query from Parameters

    // TODO: Query database

    let CommunicationRequest = getCommunicationRequest(base_version);

    // Cast all results to CommunicationRequest Class
    let communicationrequest_resource = new CommunicationRequest();

    // Return Array
    resolve([communicationrequest_resource]);
  });

module.exports.historyById = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('CommunicationRequest >>> historyById');

    // Common search params
    let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } =
      args;

    // Search Result params
    let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } =
      args;

    // Resource Specific params
    let authored = args['authored'];
    let based_on = args['based-on'];
    let category = args['category'];
    let _context = args['_context'];
    let encounter = args['encounter'];
    let group_identifier = args['group-identifier'];
    let identifier = args['identifier'];
    let medium = args['medium'];
    let occurrence = args['occurrence'];
    let patient = args['patient'];
    let priority = args['priority'];
    let recipient = args['recipient'];
    let replaces = args['replaces'];
    let requester = args['requester'];
    let sender = args['sender'];
    let status = args['status'];
    let subject = args['subject'];

    // TODO: Build query from Parameters

    // TODO: Query database

    let CommunicationRequest = getCommunicationRequest(base_version);

    // Cast all results to CommunicationRequest Class
    let communicationrequest_resource = new CommunicationRequest();

    // Return Array
    resolve([communicationrequest_resource]);
  });
