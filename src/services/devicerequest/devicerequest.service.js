/*eslint no-unused-vars: "warn"*/

const { VERSIONS } = require('@asymmetrik/node-fhir-server-core').constants;
const { resolveSchema } = require('@asymmetrik/node-fhir-server-core');
const FHIRServer = require('@asymmetrik/node-fhir-server-core');
const { ObjectID } = require('mongodb');
const logger = require('@asymmetrik/node-fhir-server-core').loggers.get();

let getDeviceRequest = (base_version) => {
  return resolveSchema(base_version, 'DeviceRequest');
};

let getMeta = (base_version) => {
  return resolveSchema(base_version, 'Meta');
};

module.exports.search = (args) =>
  new Promise((resolve, reject) => {
    logger.info('DeviceRequest >>> search');

    // Common search params
    let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } =
      args;

    // Search Result params
    let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } =
      args;

    // Resource Specific params
    let authored_on = args['authored-on'];
    let based_on = args['based-on'];
    let code = args['code'];
    let definition = args['definition'];
    let device = args['device'];
    let encounter = args['encounter'];
    let event_date = args['event-date'];
    let group_identifier = args['group-identifier'];
    let identifier = args['identifier'];
    let intent = args['intent'];
    let patient = args['patient'];
    let performer = args['performer'];
    let priorrequest = args['priorrequest'];
    let requester = args['requester'];
    let status = args['status'];
    let subject = args['subject'];

    // TODO: Build query from Parameters

    // TODO: Query database

    let DeviceRequest = getDeviceRequest(base_version);

    // Cast all results to DeviceRequest Class
    let devicerequest_resource = new DeviceRequest();
    // TODO: Set data with constructor or setter methods
    devicerequest_resource.id = 'test id';

    // Return Array
    resolve([devicerequest_resource]);
  });

module.exports.searchById = (args) =>
  new Promise((resolve, reject) => {
    logger.info('DeviceRequest >>> searchById');

    let { base_version, id } = args;

    let DeviceRequest = getDeviceRequest(base_version);

    // TODO: Build query from Parameters

    // TODO: Query database

    // Cast result to DeviceRequest Class
    let devicerequest_resource = new DeviceRequest();
    // TODO: Set data with constructor or setter methods
    devicerequest_resource.id = 'test id';

    // Return resource class
    // resolve(devicerequest_resource);
    resolve();
  });

module.exports.create = (args, { req }) =>
  new Promise((resolve, reject) => {
    logger.info('DeviceRequest >>> create');

    let { base_version, resource } = args;
    // Make sure to use this ID when inserting this resource
    let id = new ObjectID().toString();

    let DeviceRequest = getDeviceRequest(base_version);
    let Meta = getMeta(base_version);

    // TODO: determine if client/server sets ID

    // Cast resource to DeviceRequest Class
    let devicerequest_resource = new DeviceRequest(resource);
    devicerequest_resource.meta = new Meta();
    // TODO: set meta info

    // TODO: save record to database

    // Return Id
    resolve({ id });
  });

module.exports.update = (args, { req }) =>
  new Promise((resolve, reject) => {
    logger.info('DeviceRequest >>> update');

    let { base_version, id, resource } = args;

    let DeviceRequest = getDeviceRequest(base_version);
    let Meta = getMeta(base_version);

    // Cast resource to DeviceRequest Class
    let devicerequest_resource = new DeviceRequest(resource);
    devicerequest_resource.meta = new Meta();
    // TODO: set meta info, increment meta ID

    // TODO: save record to database

    // Return id, if recorded was created or updated, new meta version id
    resolve({
      id: devicerequest_resource.id,
      created: false,
      resource_version: devicerequest_resource.meta.versionId,
    });
  });

module.exports.remove = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('DeviceRequest >>> remove');

    let { id } = args;

    // TODO: delete record in database (soft/hard)

    // Return number of records deleted
    resolve({ deleted: 0 });
  });

module.exports.searchByVersionId = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('DeviceRequest >>> searchByVersionId');

    let { base_version, id, version_id } = args;

    let DeviceRequest = getDeviceRequest(base_version);

    // TODO: Build query from Parameters

    // TODO: Query database

    // Cast result to DeviceRequest Class
    let devicerequest_resource = new DeviceRequest();

    // Return resource class
    resolve(devicerequest_resource);
  });

module.exports.history = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('DeviceRequest >>> history');

    // Common search params
    let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } =
      args;

    // Search Result params
    let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } =
      args;

    // Resource Specific params
    let authored_on = args['authored-on'];
    let based_on = args['based-on'];
    let code = args['code'];
    let definition = args['definition'];
    let device = args['device'];
    let encounter = args['encounter'];
    let event_date = args['event-date'];
    let group_identifier = args['group-identifier'];
    let identifier = args['identifier'];
    let intent = args['intent'];
    let patient = args['patient'];
    let performer = args['performer'];
    let priorrequest = args['priorrequest'];
    let requester = args['requester'];
    let status = args['status'];
    let subject = args['subject'];

    // TODO: Build query from Parameters

    // TODO: Query database

    let DeviceRequest = getDeviceRequest(base_version);

    // Cast all results to DeviceRequest Class
    let devicerequest_resource = new DeviceRequest();

    // Return Array
    resolve([devicerequest_resource]);
  });

module.exports.historyById = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('DeviceRequest >>> historyById');

    // Common search params
    let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } =
      args;

    // Search Result params
    let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } =
      args;

    // Resource Specific params
    let authored_on = args['authored-on'];
    let based_on = args['based-on'];
    let code = args['code'];
    let definition = args['definition'];
    let device = args['device'];
    let encounter = args['encounter'];
    let event_date = args['event-date'];
    let group_identifier = args['group-identifier'];
    let identifier = args['identifier'];
    let intent = args['intent'];
    let patient = args['patient'];
    let performer = args['performer'];
    let priorrequest = args['priorrequest'];
    let requester = args['requester'];
    let status = args['status'];
    let subject = args['subject'];

    // TODO: Build query from Parameters

    // TODO: Query database

    let DeviceRequest = getDeviceRequest(base_version);

    // Cast all results to DeviceRequest Class
    let devicerequest_resource = new DeviceRequest();

    // Return Array
    resolve([devicerequest_resource]);
  });
