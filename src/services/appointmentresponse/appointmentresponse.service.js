/*eslint no-unused-vars: "warn"*/

const { VERSIONS } = require('@asymmetrik/node-fhir-server-core').constants;
const { resolveSchema } = require('@asymmetrik/node-fhir-server-core');
const FHIRServer = require('@asymmetrik/node-fhir-server-core');
const { ObjectID } = require('mongodb');
const logger = require('@asymmetrik/node-fhir-server-core').loggers.get();

let getAppointmentResponse = (base_version) => {
  return resolveSchema(base_version, 'AppointmentResponse');
};

let getMeta = (base_version) => {
  return resolveSchema(base_version, 'Meta');
};

module.exports.search = (args) =>
  new Promise((resolve, reject) => {
    logger.info('AppointmentResponse >>> search');

    // Common search params
    let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } =
      args;

    // Search Result params
    let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } =
      args;

    // Resource Specific params
    let actor = args['actor'];
    let appointment = args['appointment'];
    let identifier = args['identifier'];
    let location = args['location'];
    let part_status = args['part-status'];
    let patient = args['patient'];
    let practitioner = args['practitioner'];

    // TODO: Build query from Parameters

    // TODO: Query database

    let AppointmentResponse = getAppointmentResponse(base_version);

    // Cast all results to AppointmentResponse Class
    let appointmentresponse_resource = new AppointmentResponse();
    // TODO: Set data with constructor or setter methods
    appointmentresponse_resource.id = 'test id';

    // Return Array
    resolve([appointmentresponse_resource]);
  });

module.exports.searchById = (args) =>
  new Promise((resolve, reject) => {
    logger.info('AppointmentResponse >>> searchById');

    let { base_version, id } = args;

    let AppointmentResponse = getAppointmentResponse(base_version);

    // TODO: Build query from Parameters

    // TODO: Query database

    // Cast result to AppointmentResponse Class
    let appointmentresponse_resource = new AppointmentResponse();
    // TODO: Set data with constructor or setter methods
    appointmentresponse_resource.id = 'test id';

    // Return resource class
    // resolve(appointmentresponse_resource);
    resolve();
  });

module.exports.create = (args, { req }) =>
  new Promise((resolve, reject) => {
    logger.info('AppointmentResponse >>> create');

    let { base_version, resource } = args;
    // Make sure to use this ID when inserting this resource
    let id = new ObjectID().toString();

    let AppointmentResponse = getAppointmentResponse(base_version);
    let Meta = getMeta(base_version);

    // TODO: determine if client/server sets ID

    // Cast resource to AppointmentResponse Class
    let appointmentresponse_resource = new AppointmentResponse(resource);
    appointmentresponse_resource.meta = new Meta();
    // TODO: set meta info

    // TODO: save record to database

    // Return Id
    resolve({ id });
  });

module.exports.update = (args, { req }) =>
  new Promise((resolve, reject) => {
    logger.info('AppointmentResponse >>> update');

    let { base_version, id, resource } = args;

    let AppointmentResponse = getAppointmentResponse(base_version);
    let Meta = getMeta(base_version);

    // Cast resource to AppointmentResponse Class
    let appointmentresponse_resource = new AppointmentResponse(resource);
    appointmentresponse_resource.meta = new Meta();
    // TODO: set meta info, increment meta ID

    // TODO: save record to database

    // Return id, if recorded was created or updated, new meta version id
    resolve({
      id: appointmentresponse_resource.id,
      created: false,
      resource_version: appointmentresponse_resource.meta.versionId,
    });
  });

module.exports.remove = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('AppointmentResponse >>> remove');

    let { id } = args;

    // TODO: delete record in database (soft/hard)

    // Return number of records deleted
    resolve({ deleted: 0 });
  });

module.exports.searchByVersionId = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('AppointmentResponse >>> searchByVersionId');

    let { base_version, id, version_id } = args;

    let AppointmentResponse = getAppointmentResponse(base_version);

    // TODO: Build query from Parameters

    // TODO: Query database

    // Cast result to AppointmentResponse Class
    let appointmentresponse_resource = new AppointmentResponse();

    // Return resource class
    resolve(appointmentresponse_resource);
  });

module.exports.history = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('AppointmentResponse >>> history');

    // Common search params
    let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } =
      args;

    // Search Result params
    let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } =
      args;

    // Resource Specific params
    let actor = args['actor'];
    let appointment = args['appointment'];
    let identifier = args['identifier'];
    let location = args['location'];
    let part_status = args['part-status'];
    let patient = args['patient'];
    let practitioner = args['practitioner'];

    // TODO: Build query from Parameters

    // TODO: Query database

    let AppointmentResponse = getAppointmentResponse(base_version);

    // Cast all results to AppointmentResponse Class
    let appointmentresponse_resource = new AppointmentResponse();

    // Return Array
    resolve([appointmentresponse_resource]);
  });

module.exports.historyById = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('AppointmentResponse >>> historyById');

    // Common search params
    let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } =
      args;

    // Search Result params
    let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } =
      args;

    // Resource Specific params
    let actor = args['actor'];
    let appointment = args['appointment'];
    let identifier = args['identifier'];
    let location = args['location'];
    let part_status = args['part-status'];
    let patient = args['patient'];
    let practitioner = args['practitioner'];

    // TODO: Build query from Parameters

    // TODO: Query database

    let AppointmentResponse = getAppointmentResponse(base_version);

    // Cast all results to AppointmentResponse Class
    let appointmentresponse_resource = new AppointmentResponse();

    // Return Array
    resolve([appointmentresponse_resource]);
  });
