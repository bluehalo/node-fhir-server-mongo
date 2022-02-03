/*eslint no-unused-vars: "warn"*/

const { VERSIONS } = require('@asymmetrik/node-fhir-server-core').constants;
const { resolveSchema } = require('@asymmetrik/node-fhir-server-core');
const FHIRServer = require('@asymmetrik/node-fhir-server-core');
const { ObjectID } = require('mongodb');
const logger = require('@asymmetrik/node-fhir-server-core').loggers.get();

let getMedicationAdministration = (base_version) => {
  return resolveSchema(base_version, 'MedicationAdministration');
};

let getMeta = (base_version) => {
  return resolveSchema(base_version, 'Meta');
};

module.exports.search = (args) =>
  new Promise((resolve, reject) => {
    logger.info('MedicationAdministration >>> search');

    // Common search params
    let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } =
      args;

    // Search Result params
    let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } =
      args;

    // Resource Specific params
    let code = args['code'];
    let _context = args['_context'];
    let device = args['device'];
    let effective_time = args['effective-time'];
    let identifier = args['identifier'];
    let medication = args['medication'];
    let not_given = args['not-given'];
    let patient = args['patient'];
    let performer = args['performer'];
    let prescription = args['prescription'];
    let reason_given = args['reason-given'];
    let reason_not_given = args['reason-not-given'];
    let status = args['status'];
    let subject = args['subject'];

    // TODO: Build query from Parameters

    // TODO: Query database

    let MedicationAdministration = getMedicationAdministration(base_version);

    // Cast all results to MedicationAdministration Class
    let medicationadministration_resource = new MedicationAdministration();
    // TODO: Set data with constructor or setter methods
    medicationadministration_resource.id = 'test id';

    // Return Array
    resolve([medicationadministration_resource]);
  });

module.exports.searchById = (args) =>
  new Promise((resolve, reject) => {
    logger.info('MedicationAdministration >>> searchById');

    let { base_version, id } = args;

    let MedicationAdministration = getMedicationAdministration(base_version);

    // TODO: Build query from Parameters

    // TODO: Query database

    // Cast result to MedicationAdministration Class
    let medicationadministration_resource = new MedicationAdministration();
    // TODO: Set data with constructor or setter methods
    medicationadministration_resource.id = 'test id';

    // Return resource class
    // resolve(medicationadministration_resource);
    resolve();
  });

module.exports.create = (args, { req }) =>
  new Promise((resolve, reject) => {
    logger.info('MedicationAdministration >>> create');

    let { base_version, resource } = args;
    // Make sure to use this ID when inserting this resource
    let id = new ObjectID().toString();

    let MedicationAdministration = getMedicationAdministration(base_version);
    let Meta = getMeta(base_version);

    // TODO: determine if client/server sets ID

    // Cast resource to MedicationAdministration Class
    let medicationadministration_resource = new MedicationAdministration(resource);
    medicationadministration_resource.meta = new Meta();
    // TODO: set meta info

    // TODO: save record to database

    // Return Id
    resolve({ id });
  });

module.exports.update = (args, { req }) =>
  new Promise((resolve, reject) => {
    logger.info('MedicationAdministration >>> update');

    let { base_version, id, resource } = args;

    let MedicationAdministration = getMedicationAdministration(base_version);
    let Meta = getMeta(base_version);

    // Cast resource to MedicationAdministration Class
    let medicationadministration_resource = new MedicationAdministration(resource);
    medicationadministration_resource.meta = new Meta();
    // TODO: set meta info, increment meta ID

    // TODO: save record to database

    // Return id, if recorded was created or updated, new meta version id
    resolve({
      id: medicationadministration_resource.id,
      created: false,
      resource_version: medicationadministration_resource.meta.versionId,
    });
  });

module.exports.remove = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('MedicationAdministration >>> remove');

    let { id } = args;

    // TODO: delete record in database (soft/hard)

    // Return number of records deleted
    resolve({ deleted: 0 });
  });

module.exports.searchByVersionId = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('MedicationAdministration >>> searchByVersionId');

    let { base_version, id, version_id } = args;

    let MedicationAdministration = getMedicationAdministration(base_version);

    // TODO: Build query from Parameters

    // TODO: Query database

    // Cast result to MedicationAdministration Class
    let medicationadministration_resource = new MedicationAdministration();

    // Return resource class
    resolve(medicationadministration_resource);
  });

module.exports.history = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('MedicationAdministration >>> history');

    // Common search params
    let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } =
      args;

    // Search Result params
    let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } =
      args;

    // Resource Specific params
    let code = args['code'];
    let _context = args['_context'];
    let device = args['device'];
    let effective_time = args['effective-time'];
    let identifier = args['identifier'];
    let medication = args['medication'];
    let not_given = args['not-given'];
    let patient = args['patient'];
    let performer = args['performer'];
    let prescription = args['prescription'];
    let reason_given = args['reason-given'];
    let reason_not_given = args['reason-not-given'];
    let status = args['status'];
    let subject = args['subject'];

    // TODO: Build query from Parameters

    // TODO: Query database

    let MedicationAdministration = getMedicationAdministration(base_version);

    // Cast all results to MedicationAdministration Class
    let medicationadministration_resource = new MedicationAdministration();

    // Return Array
    resolve([medicationadministration_resource]);
  });

module.exports.historyById = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('MedicationAdministration >>> historyById');

    // Common search params
    let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } =
      args;

    // Search Result params
    let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } =
      args;

    // Resource Specific params
    let code = args['code'];
    let _context = args['_context'];
    let device = args['device'];
    let effective_time = args['effective-time'];
    let identifier = args['identifier'];
    let medication = args['medication'];
    let not_given = args['not-given'];
    let patient = args['patient'];
    let performer = args['performer'];
    let prescription = args['prescription'];
    let reason_given = args['reason-given'];
    let reason_not_given = args['reason-not-given'];
    let status = args['status'];
    let subject = args['subject'];

    // TODO: Build query from Parameters

    // TODO: Query database

    let MedicationAdministration = getMedicationAdministration(base_version);

    // Cast all results to MedicationAdministration Class
    let medicationadministration_resource = new MedicationAdministration();

    // Return Array
    resolve([medicationadministration_resource]);
  });
