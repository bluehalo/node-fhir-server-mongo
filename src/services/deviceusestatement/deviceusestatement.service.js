/*eslint no-unused-vars: "warn"*/

const { VERSIONS } = require('@asymmetrik/node-fhir-server-core').constants;
const { resolveSchema } = require('@asymmetrik/node-fhir-server-core');
const FHIRServer = require('@asymmetrik/node-fhir-server-core');
const { ObjectID } = require('mongodb');
const logger = require('@asymmetrik/node-fhir-server-core').loggers.get();

let getDeviceUseStatement = (base_version) => {
  return resolveSchema(base_version, 'DeviceUseStatement');
};

let getMeta = (base_version) => {
  return resolveSchema(base_version, 'Meta');
};

module.exports.search = (args) =>
  new Promise((resolve, reject) => {
    logger.info('DeviceUseStatement >>> search');

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

    let DeviceUseStatement = getDeviceUseStatement(base_version);

    // Cast all results to DeviceUseStatement Class
    let deviceusestatement_resource = new DeviceUseStatement();
    // TODO: Set data with constructor or setter methods
    deviceusestatement_resource.id = 'test id';

    // Return Array
    resolve([deviceusestatement_resource]);
  });

module.exports.searchById = (args) =>
  new Promise((resolve, reject) => {
    logger.info('DeviceUseStatement >>> searchById');

    let { base_version, id } = args;

    let DeviceUseStatement = getDeviceUseStatement(base_version);

    // TODO: Build query from Parameters

    // TODO: Query database

    // Cast result to DeviceUseStatement Class
    let deviceusestatement_resource = new DeviceUseStatement();
    // TODO: Set data with constructor or setter methods
    deviceusestatement_resource.id = 'test id';

    // Return resource class
    // resolve(deviceusestatement_resource);
    resolve();
  });

module.exports.create = (args, { req }) =>
  new Promise((resolve, reject) => {
    logger.info('DeviceUseStatement >>> create');

    let { base_version, resource } = args;
    // Make sure to use this ID when inserting this resource
    let id = new ObjectID().toString();

    let DeviceUseStatement = getDeviceUseStatement(base_version);
    let Meta = getMeta(base_version);

    // TODO: determine if client/server sets ID

    // Cast resource to DeviceUseStatement Class
    let deviceusestatement_resource = new DeviceUseStatement(resource);
    deviceusestatement_resource.meta = new Meta();
    // TODO: set meta info

    // TODO: save record to database

    // Return Id
    resolve({ id });
  });

module.exports.update = (args, { req }) =>
  new Promise((resolve, reject) => {
    logger.info('DeviceUseStatement >>> update');

    let { base_version, id, resource } = args;

    let DeviceUseStatement = getDeviceUseStatement(base_version);
    let Meta = getMeta(base_version);

    // Cast resource to DeviceUseStatement Class
    let deviceusestatement_resource = new DeviceUseStatement(resource);
    deviceusestatement_resource.meta = new Meta();
    // TODO: set meta info, increment meta ID

    // TODO: save record to database

    // Return id, if recorded was created or updated, new meta version id
    resolve({
      id: deviceusestatement_resource.id,
      created: false,
      resource_version: deviceusestatement_resource.meta.versionId,
    });
  });

module.exports.remove = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('DeviceUseStatement >>> remove');

    let { id } = args;

    // TODO: delete record in database (soft/hard)

    // Return number of records deleted
    resolve({ deleted: 0 });
  });

module.exports.searchByVersionId = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('DeviceUseStatement >>> searchByVersionId');

    let { base_version, id, version_id } = args;

    let DeviceUseStatement = getDeviceUseStatement(base_version);

    // TODO: Build query from Parameters

    // TODO: Query database

    // Cast result to DeviceUseStatement Class
    let deviceusestatement_resource = new DeviceUseStatement();

    // Return resource class
    resolve(deviceusestatement_resource);
  });

module.exports.history = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('DeviceUseStatement >>> history');

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

    let DeviceUseStatement = getDeviceUseStatement(base_version);

    // Cast all results to DeviceUseStatement Class
    let deviceusestatement_resource = new DeviceUseStatement();

    // Return Array
    resolve([deviceusestatement_resource]);
  });

module.exports.historyById = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('DeviceUseStatement >>> historyById');

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

    let DeviceUseStatement = getDeviceUseStatement(base_version);

    // Cast all results to DeviceUseStatement Class
    let deviceusestatement_resource = new DeviceUseStatement();

    // Return Array
    resolve([deviceusestatement_resource]);
  });
