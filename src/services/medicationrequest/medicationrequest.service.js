/*eslint no-unused-vars: "warn"*/

const { VERSIONS } = require('@asymmetrik/node-fhir-server-core').constants;
const { resolveSchema } = require('@asymmetrik/node-fhir-server-core');
const FHIRServer = require('@asymmetrik/node-fhir-server-core');
const { ObjectID } = require('mongodb');
const logger = require('@asymmetrik/node-fhir-server-core').loggers.get();

let getMedicationRequest = (base_version) => {
  return resolveSchema(base_version, 'MedicationRequest');
};

let getMeta = (base_version) => {
  return resolveSchema(base_version, 'Meta');
};

module.exports.search = (args) =>
  new Promise((resolve, reject) => {
    logger.info('MedicationRequest >>> search');

    // Common search params
    let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } =
      args;

    // Search Result params
    let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } =
      args;

    // Resource Specific params
    let authoredon = args['authoredon'];
    let category = args['category'];
    let code = args['code'];
    let _context = args['_context'];
    let date = args['date'];
    let identifier = args['identifier'];
    let intended_dispenser = args['intended-dispenser'];
    let intent = args['intent'];
    let medication = args['medication'];
    let patient = args['patient'];
    let priority = args['priority'];
    let requester = args['requester'];
    let status = args['status'];
    let subject = args['subject'];

    // TODO: Build query from Parameters

    // TODO: Query database

    let MedicationRequest = getMedicationRequest(base_version);

    // Cast all results to MedicationRequest Class
    let medicationrequest_resource = new MedicationRequest();
    // TODO: Set data with constructor or setter methods
    medicationrequest_resource.id = 'test id';

    // Return Array
    resolve([medicationrequest_resource]);
  });

module.exports.searchById = (args) =>
  new Promise((resolve, reject) => {
    logger.info('MedicationRequest >>> searchById');

    let { base_version, id } = args;

    let MedicationRequest = getMedicationRequest(base_version);

    // TODO: Build query from Parameters

    // TODO: Query database

    // Cast result to MedicationRequest Class
    let medicationrequest_resource = new MedicationRequest();
    // TODO: Set data with constructor or setter methods
    medicationrequest_resource.id = 'test id';

    // Return resource class
    // resolve(medicationrequest_resource);
    resolve();
  });

module.exports.create = (args, { req }) =>
  new Promise((resolve, reject) => {
    logger.info('MedicationRequest >>> create');

    let { base_version, resource } = args;
    // Make sure to use this ID when inserting this resource
    let id = new ObjectID().toString();

    let MedicationRequest = getMedicationRequest(base_version);
    let Meta = getMeta(base_version);

    // TODO: determine if client/server sets ID

    // Cast resource to MedicationRequest Class
    let medicationrequest_resource = new MedicationRequest(resource);
    medicationrequest_resource.meta = new Meta();
    // TODO: set meta info

    // TODO: save record to database

    // Return Id
    resolve({ id });
  });

module.exports.update = (args, { req }) =>
  new Promise((resolve, reject) => {
    logger.info('MedicationRequest >>> update');

    let { base_version, id, resource } = args;

    let MedicationRequest = getMedicationRequest(base_version);
    let Meta = getMeta(base_version);

    // Cast resource to MedicationRequest Class
    let medicationrequest_resource = new MedicationRequest(resource);
    medicationrequest_resource.meta = new Meta();
    // TODO: set meta info, increment meta ID

    // TODO: save record to database

    // Return id, if recorded was created or updated, new meta version id
    resolve({
      id: medicationrequest_resource.id,
      created: false,
      resource_version: medicationrequest_resource.meta.versionId,
    });
  });

module.exports.remove = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('MedicationRequest >>> remove');

    let { id } = args;

    // TODO: delete record in database (soft/hard)

    // Return number of records deleted
    resolve({ deleted: 0 });
  });

module.exports.searchByVersionId = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('MedicationRequest >>> searchByVersionId');

    let { base_version, id, version_id } = args;

    let MedicationRequest = getMedicationRequest(base_version);

    // TODO: Build query from Parameters

    // TODO: Query database

    // Cast result to MedicationRequest Class
    let medicationrequest_resource = new MedicationRequest();

    // Return resource class
    resolve(medicationrequest_resource);
  });

module.exports.history = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('MedicationRequest >>> history');

    // Common search params
    let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } =
      args;

    // Search Result params
    let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } =
      args;

    // Resource Specific params
    let authoredon = args['authoredon'];
    let category = args['category'];
    let code = args['code'];
    let _context = args['_context'];
    let date = args['date'];
    let identifier = args['identifier'];
    let intended_dispenser = args['intended-dispenser'];
    let intent = args['intent'];
    let medication = args['medication'];
    let patient = args['patient'];
    let priority = args['priority'];
    let requester = args['requester'];
    let status = args['status'];
    let subject = args['subject'];

    // TODO: Build query from Parameters

    // TODO: Query database

    let MedicationRequest = getMedicationRequest(base_version);

    // Cast all results to MedicationRequest Class
    let medicationrequest_resource = new MedicationRequest();

    // Return Array
    resolve([medicationrequest_resource]);
  });

module.exports.historyById = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('MedicationRequest >>> historyById');

    // Common search params
    let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } =
      args;

    // Search Result params
    let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } =
      args;

    // Resource Specific params
    let authoredon = args['authoredon'];
    let category = args['category'];
    let code = args['code'];
    let _context = args['_context'];
    let date = args['date'];
    let identifier = args['identifier'];
    let intended_dispenser = args['intended-dispenser'];
    let intent = args['intent'];
    let medication = args['medication'];
    let patient = args['patient'];
    let priority = args['priority'];
    let requester = args['requester'];
    let status = args['status'];
    let subject = args['subject'];

    // TODO: Build query from Parameters

    // TODO: Query database

    let MedicationRequest = getMedicationRequest(base_version);

    // Cast all results to MedicationRequest Class
    let medicationrequest_resource = new MedicationRequest();

    // Return Array
    resolve([medicationrequest_resource]);
  });
