/*eslint no-unused-vars: "warn"*/

const { VERSIONS } = require('@asymmetrik/node-fhir-server-core').constants;
const { resolveSchema } = require('@asymmetrik/node-fhir-server-core');
const FHIRServer = require('@asymmetrik/node-fhir-server-core');
const { ObjectID } = require('mongodb');
const logger = require('@asymmetrik/node-fhir-server-core').loggers.get();

let getAppointment = (base_version) => {
  return resolveSchema(base_version, 'Appointment');
};

let getMeta = (base_version) => {
  return resolveSchema(base_version, 'Meta');
};

module.exports.search = (args) =>
  new Promise((resolve, reject) => {
    logger.info('Appointment >>> search');

    // Common search params
    let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } =
      args;

    // Search Result params
    let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } =
      args;

    // Resource Specific params
    let actor = args['actor'];
    let appointment_type = args['appointment-type'];
    let date = args['date'];
    let identifier = args['identifier'];
    let incomingreferral = args['incomingreferral'];
    let location = args['location'];
    let part_status = args['part-status'];
    let patient = args['patient'];
    let practitioner = args['practitioner'];
    let service_type = args['service-type'];
    let status = args['status'];

    // TODO: Build query from Parameters

    // TODO: Query database

    let Appointment = getAppointment(base_version);

    // Cast all results to Appointment Class
    let appointment_resource = new Appointment();
    // TODO: Set data with constructor or setter methods
    appointment_resource.id = 'test id';

    // Return Array
    resolve([appointment_resource]);
  });

module.exports.searchById = (args) =>
  new Promise((resolve, reject) => {
    logger.info('Appointment >>> searchById');

    let { base_version, id } = args;

    let Appointment = getAppointment(base_version);

    // TODO: Build query from Parameters

    // TODO: Query database

    // Cast result to Appointment Class
    let appointment_resource = new Appointment();
    // TODO: Set data with constructor or setter methods
    appointment_resource.id = 'test id';

    // Return resource class
    // resolve(appointment_resource);
    resolve();
  });

module.exports.create = (args, { req }) =>
  new Promise((resolve, reject) => {
    logger.info('Appointment >>> create');

    let { base_version, resource } = args;
    // Make sure to use this ID when inserting this resource
    let id = new ObjectID().toString();

    let Appointment = getAppointment(base_version);
    let Meta = getMeta(base_version);

    // TODO: determine if client/server sets ID

    // Cast resource to Appointment Class
    let appointment_resource = new Appointment(resource);
    appointment_resource.meta = new Meta();
    // TODO: set meta info

    // TODO: save record to database

    // Return Id
    resolve({ id });
  });

module.exports.update = (args, { req }) =>
  new Promise((resolve, reject) => {
    logger.info('Appointment >>> update');

    let { base_version, id, resource } = args;

    let Appointment = getAppointment(base_version);
    let Meta = getMeta(base_version);

    // Cast resource to Appointment Class
    let appointment_resource = new Appointment(resource);
    appointment_resource.meta = new Meta();
    // TODO: set meta info, increment meta ID

    // TODO: save record to database

    // Return id, if recorded was created or updated, new meta version id
    resolve({
      id: appointment_resource.id,
      created: false,
      resource_version: appointment_resource.meta.versionId,
    });
  });

module.exports.remove = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('Appointment >>> remove');

    let { id } = args;

    // TODO: delete record in database (soft/hard)

    // Return number of records deleted
    resolve({ deleted: 0 });
  });

module.exports.searchByVersionId = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('Appointment >>> searchByVersionId');

    let { base_version, id, version_id } = args;

    let Appointment = getAppointment(base_version);

    // TODO: Build query from Parameters

    // TODO: Query database

    // Cast result to Appointment Class
    let appointment_resource = new Appointment();

    // Return resource class
    resolve(appointment_resource);
  });

module.exports.history = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('Appointment >>> history');

    // Common search params
    let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } =
      args;

    // Search Result params
    let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } =
      args;

    // Resource Specific params
    let actor = args['actor'];
    let appointment_type = args['appointment-type'];
    let date = args['date'];
    let identifier = args['identifier'];
    let incomingreferral = args['incomingreferral'];
    let location = args['location'];
    let part_status = args['part-status'];
    let patient = args['patient'];
    let practitioner = args['practitioner'];
    let service_type = args['service-type'];
    let status = args['status'];

    // TODO: Build query from Parameters

    // TODO: Query database

    let Appointment = getAppointment(base_version);

    // Cast all results to Appointment Class
    let appointment_resource = new Appointment();

    // Return Array
    resolve([appointment_resource]);
  });

module.exports.historyById = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('Appointment >>> historyById');

    // Common search params
    let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } =
      args;

    // Search Result params
    let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } =
      args;

    // Resource Specific params
    let actor = args['actor'];
    let appointment_type = args['appointment-type'];
    let date = args['date'];
    let identifier = args['identifier'];
    let incomingreferral = args['incomingreferral'];
    let location = args['location'];
    let part_status = args['part-status'];
    let patient = args['patient'];
    let practitioner = args['practitioner'];
    let service_type = args['service-type'];
    let status = args['status'];

    // TODO: Build query from Parameters

    // TODO: Query database

    let Appointment = getAppointment(base_version);

    // Cast all results to Appointment Class
    let appointment_resource = new Appointment();

    // Return Array
    resolve([appointment_resource]);
  });
