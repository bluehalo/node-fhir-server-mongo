/*eslint no-unused-vars: "warn"*/

const { VERSIONS } = require('@asymmetrik/node-fhir-server-core').constants;
const { resolveSchema } = require('@asymmetrik/node-fhir-server-core');
const FHIRServer = require('@asymmetrik/node-fhir-server-core');
const { ObjectID } = require('mongodb');
const logger = require('@asymmetrik/node-fhir-server-core').loggers.get();

let getMedicationDispense = (base_version) => {
  return resolveSchema(base_version, 'MedicationDispense');
};

let getMeta = (base_version) => {
  return resolveSchema(base_version, 'Meta');
};

module.exports.search = (args) =>
  new Promise((resolve, reject) => {
    logger.info('MedicationDispense >>> search');

    // Common search params
    let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } =
      args;

    // Search Result params
    let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } =
      args;

    // Resource Specific params
    let code = args['code'];
    let _context = args['_context'];
    let destination = args['destination'];
    let identifier = args['identifier'];
    let medication = args['medication'];
    let patient = args['patient'];
    let performer = args['performer'];
    let prescription = args['prescription'];
    let receiver = args['receiver'];
    let responsibleparty = args['responsibleparty'];
    let status = args['status'];
    let subject = args['subject'];
    let type = args['type'];
    let whenhandedover = args['whenhandedover'];
    let whenprepared = args['whenprepared'];

    // TODO: Build query from Parameters

    // TODO: Query database

    let MedicationDispense = getMedicationDispense(base_version);

    // Cast all results to MedicationDispense Class
    let medicationdispense_resource = new MedicationDispense();
    // TODO: Set data with constructor or setter methods
    medicationdispense_resource.id = 'test id';

    // Return Array
    resolve([medicationdispense_resource]);
  });

module.exports.searchById = (args) =>
  new Promise((resolve, reject) => {
    logger.info('MedicationDispense >>> searchById');

    let { base_version, id } = args;

    let MedicationDispense = getMedicationDispense(base_version);

    // TODO: Build query from Parameters

    // TODO: Query database

    // Cast result to MedicationDispense Class
    let medicationdispense_resource = new MedicationDispense();
    // TODO: Set data with constructor or setter methods
    medicationdispense_resource.id = 'test id';

    // Return resource class
    // resolve(medicationdispense_resource);
    resolve();
  });

module.exports.create = (args, { req }) =>
  new Promise((resolve, reject) => {
    logger.info('MedicationDispense >>> create');

    let { base_version, resource } = args;
    // Make sure to use this ID when inserting this resource
    let id = new ObjectID().toString();

    let MedicationDispense = getMedicationDispense(base_version);
    let Meta = getMeta(base_version);

    // TODO: determine if client/server sets ID

    // Cast resource to MedicationDispense Class
    let medicationdispense_resource = new MedicationDispense(resource);
    medicationdispense_resource.meta = new Meta();
    // TODO: set meta info

    // TODO: save record to database

    // Return Id
    resolve({ id });
  });

module.exports.update = (args, { req }) =>
  new Promise((resolve, reject) => {
    logger.info('MedicationDispense >>> update');

    let { base_version, id, resource } = args;

    let MedicationDispense = getMedicationDispense(base_version);
    let Meta = getMeta(base_version);

    // Cast resource to MedicationDispense Class
    let medicationdispense_resource = new MedicationDispense(resource);
    medicationdispense_resource.meta = new Meta();
    // TODO: set meta info, increment meta ID

    // TODO: save record to database

    // Return id, if recorded was created or updated, new meta version id
    resolve({
      id: medicationdispense_resource.id,
      created: false,
      resource_version: medicationdispense_resource.meta.versionId,
    });
  });

module.exports.remove = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('MedicationDispense >>> remove');

    let { id } = args;

    // TODO: delete record in database (soft/hard)

    // Return number of records deleted
    resolve({ deleted: 0 });
  });

module.exports.searchByVersionId = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('MedicationDispense >>> searchByVersionId');

    let { base_version, id, version_id } = args;

    let MedicationDispense = getMedicationDispense(base_version);

    // TODO: Build query from Parameters

    // TODO: Query database

    // Cast result to MedicationDispense Class
    let medicationdispense_resource = new MedicationDispense();

    // Return resource class
    resolve(medicationdispense_resource);
  });

module.exports.history = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('MedicationDispense >>> history');

    // Common search params
    let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } =
      args;

    // Search Result params
    let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } =
      args;

    // Resource Specific params
    let code = args['code'];
    let _context = args['_context'];
    let destination = args['destination'];
    let identifier = args['identifier'];
    let medication = args['medication'];
    let patient = args['patient'];
    let performer = args['performer'];
    let prescription = args['prescription'];
    let receiver = args['receiver'];
    let responsibleparty = args['responsibleparty'];
    let status = args['status'];
    let subject = args['subject'];
    let type = args['type'];
    let whenhandedover = args['whenhandedover'];
    let whenprepared = args['whenprepared'];

    // TODO: Build query from Parameters

    // TODO: Query database

    let MedicationDispense = getMedicationDispense(base_version);

    // Cast all results to MedicationDispense Class
    let medicationdispense_resource = new MedicationDispense();

    // Return Array
    resolve([medicationdispense_resource]);
  });

module.exports.historyById = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('MedicationDispense >>> historyById');

    // Common search params
    let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } =
      args;

    // Search Result params
    let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } =
      args;

    // Resource Specific params
    let code = args['code'];
    let _context = args['_context'];
    let destination = args['destination'];
    let identifier = args['identifier'];
    let medication = args['medication'];
    let patient = args['patient'];
    let performer = args['performer'];
    let prescription = args['prescription'];
    let receiver = args['receiver'];
    let responsibleparty = args['responsibleparty'];
    let status = args['status'];
    let subject = args['subject'];
    let type = args['type'];
    let whenhandedover = args['whenhandedover'];
    let whenprepared = args['whenprepared'];

    // TODO: Build query from Parameters

    // TODO: Query database

    let MedicationDispense = getMedicationDispense(base_version);

    // Cast all results to MedicationDispense Class
    let medicationdispense_resource = new MedicationDispense();

    // Return Array
    resolve([medicationdispense_resource]);
  });
