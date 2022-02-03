/*eslint no-unused-vars: "warn"*/

const { VERSIONS } = require('@asymmetrik/node-fhir-server-core').constants;
const { resolveSchema } = require('@asymmetrik/node-fhir-server-core');
const FHIRServer = require('@asymmetrik/node-fhir-server-core');
const { ObjectID } = require('mongodb');
const logger = require('@asymmetrik/node-fhir-server-core').loggers.get();

let getReferralRequest = (base_version) => {
  return resolveSchema(base_version, 'ReferralRequest');
};

let getMeta = (base_version) => {
  return resolveSchema(base_version, 'Meta');
};

module.exports.search = (args) =>
  new Promise((resolve, reject) => {
    logger.info('ReferralRequest >>> search');

    // Common search params
    let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } =
      args;

    // Search Result params
    let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } =
      args;

    // Resource Specific params
    let authored_on = args['authored-on'];
    let based_on = args['based-on'];
    let _context = args['_context'];
    let definition = args['definition'];
    let encounter = args['encounter'];
    let group_identifier = args['group-identifier'];
    let identifier = args['identifier'];
    let intent = args['intent'];
    let occurrence_date = args['occurrence-date'];
    let patient = args['patient'];
    let priority = args['priority'];
    let recipient = args['recipient'];
    let replaces = args['replaces'];
    let requester = args['requester'];
    let service = args['service'];
    let specialty = args['specialty'];
    let status = args['status'];
    let subject = args['subject'];
    let type = args['type'];

    // TODO: Build query from Parameters

    // TODO: Query database

    let ReferralRequest = getReferralRequest(base_version);

    // Cast all results to ReferralRequest Class
    let referralrequest_resource = new ReferralRequest();
    // TODO: Set data with constructor or setter methods
    referralrequest_resource.id = 'test id';

    // Return Array
    resolve([referralrequest_resource]);
  });

module.exports.searchById = (args) =>
  new Promise((resolve, reject) => {
    logger.info('ReferralRequest >>> searchById');

    let { base_version, id } = args;

    let ReferralRequest = getReferralRequest(base_version);

    // TODO: Build query from Parameters

    // TODO: Query database

    // Cast result to ReferralRequest Class
    let referralrequest_resource = new ReferralRequest();
    // TODO: Set data with constructor or setter methods
    referralrequest_resource.id = 'test id';

    // Return resource class
    // resolve(referralrequest_resource);
    resolve();
  });

module.exports.create = (args, { req }) =>
  new Promise((resolve, reject) => {
    logger.info('ReferralRequest >>> create');

    let { base_version, resource } = args;
    // Make sure to use this ID when inserting this resource
    let id = new ObjectID().toString();

    let ReferralRequest = getReferralRequest(base_version);
    let Meta = getMeta(base_version);

    // TODO: determine if client/server sets ID

    // Cast resource to ReferralRequest Class
    let referralrequest_resource = new ReferralRequest(resource);
    referralrequest_resource.meta = new Meta();
    // TODO: set meta info

    // TODO: save record to database

    // Return Id
    resolve({ id });
  });

module.exports.update = (args, { req }) =>
  new Promise((resolve, reject) => {
    logger.info('ReferralRequest >>> update');

    let { base_version, id, resource } = args;

    let ReferralRequest = getReferralRequest(base_version);
    let Meta = getMeta(base_version);

    // Cast resource to ReferralRequest Class
    let referralrequest_resource = new ReferralRequest(resource);
    referralrequest_resource.meta = new Meta();
    // TODO: set meta info, increment meta ID

    // TODO: save record to database

    // Return id, if recorded was created or updated, new meta version id
    resolve({
      id: referralrequest_resource.id,
      created: false,
      resource_version: referralrequest_resource.meta.versionId,
    });
  });

module.exports.remove = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('ReferralRequest >>> remove');

    let { id } = args;

    // TODO: delete record in database (soft/hard)

    // Return number of records deleted
    resolve({ deleted: 0 });
  });

module.exports.searchByVersionId = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('ReferralRequest >>> searchByVersionId');

    let { base_version, id, version_id } = args;

    let ReferralRequest = getReferralRequest(base_version);

    // TODO: Build query from Parameters

    // TODO: Query database

    // Cast result to ReferralRequest Class
    let referralrequest_resource = new ReferralRequest();

    // Return resource class
    resolve(referralrequest_resource);
  });

module.exports.history = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('ReferralRequest >>> history');

    // Common search params
    let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } =
      args;

    // Search Result params
    let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } =
      args;

    // Resource Specific params
    let authored_on = args['authored-on'];
    let based_on = args['based-on'];
    let _context = args['_context'];
    let definition = args['definition'];
    let encounter = args['encounter'];
    let group_identifier = args['group-identifier'];
    let identifier = args['identifier'];
    let intent = args['intent'];
    let occurrence_date = args['occurrence-date'];
    let patient = args['patient'];
    let priority = args['priority'];
    let recipient = args['recipient'];
    let replaces = args['replaces'];
    let requester = args['requester'];
    let service = args['service'];
    let specialty = args['specialty'];
    let status = args['status'];
    let subject = args['subject'];
    let type = args['type'];

    // TODO: Build query from Parameters

    // TODO: Query database

    let ReferralRequest = getReferralRequest(base_version);

    // Cast all results to ReferralRequest Class
    let referralrequest_resource = new ReferralRequest();

    // Return Array
    resolve([referralrequest_resource]);
  });

module.exports.historyById = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('ReferralRequest >>> historyById');

    // Common search params
    let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } =
      args;

    // Search Result params
    let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } =
      args;

    // Resource Specific params
    let authored_on = args['authored-on'];
    let based_on = args['based-on'];
    let _context = args['_context'];
    let definition = args['definition'];
    let encounter = args['encounter'];
    let group_identifier = args['group-identifier'];
    let identifier = args['identifier'];
    let intent = args['intent'];
    let occurrence_date = args['occurrence-date'];
    let patient = args['patient'];
    let priority = args['priority'];
    let recipient = args['recipient'];
    let replaces = args['replaces'];
    let requester = args['requester'];
    let service = args['service'];
    let specialty = args['specialty'];
    let status = args['status'];
    let subject = args['subject'];
    let type = args['type'];

    // TODO: Build query from Parameters

    // TODO: Query database

    let ReferralRequest = getReferralRequest(base_version);

    // Cast all results to ReferralRequest Class
    let referralrequest_resource = new ReferralRequest();

    // Return Array
    resolve([referralrequest_resource]);
  });
