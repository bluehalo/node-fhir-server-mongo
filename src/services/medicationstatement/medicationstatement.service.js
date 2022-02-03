/*eslint no-unused-vars: "warn"*/

const { VERSIONS } = require('@asymmetrik/node-fhir-server-core').constants;
const { resolveSchema } = require('@asymmetrik/node-fhir-server-core');
const FHIRServer = require('@asymmetrik/node-fhir-server-core');
const { ObjectID } = require('mongodb');
const logger = require('@asymmetrik/node-fhir-server-core').loggers.get();

let getMedicationStatement = (base_version) => {
  return resolveSchema(base_version, 'MedicationStatement');
};

let getMeta = (base_version) => {
  return resolveSchema(base_version, 'Meta');
};

module.exports.search = (args) =>
  new Promise((resolve, reject) => {
    logger.info('MedicationStatement >>> search');

    // Common search params
    let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } =
      args;

    // Search Result params
    let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } =
      args;

    // Resource Specific params
    let category = args['category'];
    let code = args['code'];
    let _context = args['_context'];
    let effective = args['effective'];
    let identifier = args['identifier'];
    let medication = args['medication'];
    let part_of = args['part-of'];
    let patient = args['patient'];
    let source = args['source'];
    let status = args['status'];
    let subject = args['subject'];

    // TODO: Build query from Parameters

    // TODO: Query database

    let MedicationStatement = getMedicationStatement(base_version);

    // Cast all results to MedicationStatement Class
    let medicationstatement_resource = new MedicationStatement();
    // TODO: Set data with constructor or setter methods
    medicationstatement_resource.id = 'test id';

    // Return Array
    resolve([medicationstatement_resource]);
  });

module.exports.searchById = (args) =>
  new Promise((resolve, reject) => {
    logger.info('MedicationStatement >>> searchById');

    let { base_version, id } = args;

    let MedicationStatement = getMedicationStatement(base_version);

    // TODO: Build query from Parameters

    // TODO: Query database

    // Cast result to MedicationStatement Class
    let medicationstatement_resource = new MedicationStatement();
    // TODO: Set data with constructor or setter methods
    medicationstatement_resource.id = 'test id';

    // Return resource class
    // resolve(medicationstatement_resource);
    resolve();
  });

module.exports.create = (args, { req }) =>
  new Promise((resolve, reject) => {
    logger.info('MedicationStatement >>> create');

    let { base_version, resource } = args;
    // Make sure to use this ID when inserting this resource
    let id = new ObjectID().toString();

    let MedicationStatement = getMedicationStatement(base_version);
    let Meta = getMeta(base_version);

    // TODO: determine if client/server sets ID

    // Cast resource to MedicationStatement Class
    let medicationstatement_resource = new MedicationStatement(resource);
    medicationstatement_resource.meta = new Meta();
    // TODO: set meta info

    // TODO: save record to database

    // Return Id
    resolve({ id });
  });

module.exports.update = (args, { req }) =>
  new Promise((resolve, reject) => {
    logger.info('MedicationStatement >>> update');

    let { base_version, id, resource } = args;

    let MedicationStatement = getMedicationStatement(base_version);
    let Meta = getMeta(base_version);

    // Cast resource to MedicationStatement Class
    let medicationstatement_resource = new MedicationStatement(resource);
    medicationstatement_resource.meta = new Meta();
    // TODO: set meta info, increment meta ID

    // TODO: save record to database

    // Return id, if recorded was created or updated, new meta version id
    resolve({
      id: medicationstatement_resource.id,
      created: false,
      resource_version: medicationstatement_resource.meta.versionId,
    });
  });

module.exports.remove = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('MedicationStatement >>> remove');

    let { id } = args;

    // TODO: delete record in database (soft/hard)

    // Return number of records deleted
    resolve({ deleted: 0 });
  });

module.exports.searchByVersionId = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('MedicationStatement >>> searchByVersionId');

    let { base_version, id, version_id } = args;

    let MedicationStatement = getMedicationStatement(base_version);

    // TODO: Build query from Parameters

    // TODO: Query database

    // Cast result to MedicationStatement Class
    let medicationstatement_resource = new MedicationStatement();

    // Return resource class
    resolve(medicationstatement_resource);
  });

module.exports.history = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('MedicationStatement >>> history');

    // Common search params
    let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } =
      args;

    // Search Result params
    let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } =
      args;

    // Resource Specific params
    let category = args['category'];
    let code = args['code'];
    let _context = args['_context'];
    let effective = args['effective'];
    let identifier = args['identifier'];
    let medication = args['medication'];
    let part_of = args['part-of'];
    let patient = args['patient'];
    let source = args['source'];
    let status = args['status'];
    let subject = args['subject'];

    // TODO: Build query from Parameters

    // TODO: Query database

    let MedicationStatement = getMedicationStatement(base_version);

    // Cast all results to MedicationStatement Class
    let medicationstatement_resource = new MedicationStatement();

    // Return Array
    resolve([medicationstatement_resource]);
  });

module.exports.historyById = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('MedicationStatement >>> historyById');

    // Common search params
    let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } =
      args;

    // Search Result params
    let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } =
      args;

    // Resource Specific params
    let category = args['category'];
    let code = args['code'];
    let _context = args['_context'];
    let effective = args['effective'];
    let identifier = args['identifier'];
    let medication = args['medication'];
    let part_of = args['part-of'];
    let patient = args['patient'];
    let source = args['source'];
    let status = args['status'];
    let subject = args['subject'];

    // TODO: Build query from Parameters

    // TODO: Query database

    let MedicationStatement = getMedicationStatement(base_version);

    // Cast all results to MedicationStatement Class
    let medicationstatement_resource = new MedicationStatement();

    // Return Array
    resolve([medicationstatement_resource]);
  });
