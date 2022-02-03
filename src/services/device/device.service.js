/*eslint no-unused-vars: "warn"*/

const { VERSIONS } = require('@asymmetrik/node-fhir-server-core').constants;
const { resolveSchema } = require('@asymmetrik/node-fhir-server-core');
const FHIRServer = require('@asymmetrik/node-fhir-server-core');
const { ObjectID } = require('mongodb');
const logger = require('@asymmetrik/node-fhir-server-core').loggers.get();

let getDevice = (base_version) => {
  return resolveSchema(base_version, 'Device');
};

let getMeta = (base_version) => {
  return resolveSchema(base_version, 'Meta');
};

module.exports.search = (args) =>
  new Promise((resolve, reject) => {
    logger.info('Device >>> search');

    // Common search params
    let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } =
      args;

    // Search Result params
    let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } =
      args;

    // Resource Specific params
    let device_name = args['device-name'];
    let identifier = args['identifier'];
    let location = args['location'];
    let manufacturer = args['manufacturer'];
    let model = args['model'];
    let organization = args['organization'];
    let patient = args['patient'];
    let status = args['status'];
    let type = args['type'];
    let udi_carrier = args['udi-carrier'];
    let udi_di = args['udi-di'];
    let url = args['url'];

    // TODO: Build query from Parameters

    // TODO: Query database

    let Device = getDevice(base_version);

    // Cast all results to Device Class
    let device_resource = new Device();
    // TODO: Set data with constructor or setter methods
    device_resource.id = 'test id';

    // Return Array
    resolve([device_resource]);
  });

module.exports.searchById = (args) =>
  new Promise((resolve, reject) => {
    logger.info('Device >>> searchById');

    let { base_version, id } = args;

    let Device = getDevice(base_version);

    // TODO: Build query from Parameters

    // TODO: Query database

    // Cast result to Device Class
    let device_resource = new Device();
    // TODO: Set data with constructor or setter methods
    device_resource.id = 'test id';

    // Return resource class
    // resolve(device_resource);
    resolve();
  });

module.exports.create = (args, { req }) =>
  new Promise((resolve, reject) => {
    logger.info('Device >>> create');

    let { base_version, resource } = args;
    // Make sure to use this ID when inserting this resource
    let id = new ObjectID().toString();

    let Device = getDevice(base_version);
    let Meta = getMeta(base_version);

    // TODO: determine if client/server sets ID

    // Cast resource to Device Class
    let device_resource = new Device(resource);
    device_resource.meta = new Meta();
    // TODO: set meta info

    // TODO: save record to database

    // Return Id
    resolve({ id });
  });

module.exports.update = (args, { req }) =>
  new Promise((resolve, reject) => {
    logger.info('Device >>> update');

    let { base_version, id, resource } = args;

    let Device = getDevice(base_version);
    let Meta = getMeta(base_version);

    // Cast resource to Device Class
    let device_resource = new Device(resource);
    device_resource.meta = new Meta();
    // TODO: set meta info, increment meta ID

    // TODO: save record to database

    // Return id, if recorded was created or updated, new meta version id
    resolve({
      id: device_resource.id,
      created: false,
      resource_version: device_resource.meta.versionId,
    });
  });

module.exports.remove = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('Device >>> remove');

    let { id } = args;

    // TODO: delete record in database (soft/hard)

    // Return number of records deleted
    resolve({ deleted: 0 });
  });

module.exports.searchByVersionId = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('Device >>> searchByVersionId');

    let { base_version, id, version_id } = args;

    let Device = getDevice(base_version);

    // TODO: Build query from Parameters

    // TODO: Query database

    // Cast result to Device Class
    let device_resource = new Device();

    // Return resource class
    resolve(device_resource);
  });

module.exports.history = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('Device >>> history');

    // Common search params
    let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } =
      args;

    // Search Result params
    let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } =
      args;

    // Resource Specific params
    let device_name = args['device-name'];
    let identifier = args['identifier'];
    let location = args['location'];
    let manufacturer = args['manufacturer'];
    let model = args['model'];
    let organization = args['organization'];
    let patient = args['patient'];
    let status = args['status'];
    let type = args['type'];
    let udi_carrier = args['udi-carrier'];
    let udi_di = args['udi-di'];
    let url = args['url'];

    // TODO: Build query from Parameters

    // TODO: Query database

    let Device = getDevice(base_version);

    // Cast all results to Device Class
    let device_resource = new Device();

    // Return Array
    resolve([device_resource]);
  });

module.exports.historyById = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('Device >>> historyById');

    // Common search params
    let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } =
      args;

    // Search Result params
    let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } =
      args;

    // Resource Specific params
    let device_name = args['device-name'];
    let identifier = args['identifier'];
    let location = args['location'];
    let manufacturer = args['manufacturer'];
    let model = args['model'];
    let organization = args['organization'];
    let patient = args['patient'];
    let status = args['status'];
    let type = args['type'];
    let udi_carrier = args['udi-carrier'];
    let udi_di = args['udi-di'];
    let url = args['url'];

    // TODO: Build query from Parameters

    // TODO: Query database

    let Device = getDevice(base_version);

    // Cast all results to Device Class
    let device_resource = new Device();

    // Return Array
    resolve([device_resource]);
  });
