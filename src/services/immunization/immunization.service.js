/*eslint no-unused-vars: "warn"*/

const { VERSIONS } = require('@asymmetrik/node-fhir-server-core').constants;
const { resolveSchema } = require('@asymmetrik/node-fhir-server-core');
const FHIRServer = require('@asymmetrik/node-fhir-server-core');
const { ObjectID } = require('mongodb');
const logger = require('@asymmetrik/node-fhir-server-core').loggers.get();

let getImmunization = (base_version) => {
  return resolveSchema(base_version, 'Immunization');
};

let getMeta = (base_version) => {
  return resolveSchema(base_version, 'Meta');
};

module.exports.search = (args) =>
  new Promise((resolve, reject) => {
    logger.info('Immunization >>> search');

    // Common search params
    let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } =
      args;

    // Search Result params
    let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } =
      args;

    // Resource Specific params
    let date = args['date'];
    let dose_sequence = args['dose-sequence'];
    let identifier = args['identifier'];
    let location = args['location'];
    let lot_number = args['lot-number'];
    let manufacturer = args['manufacturer'];
    let notgiven = args['notgiven'];
    let patient = args['patient'];
    let practitioner = args['practitioner'];
    let reaction = args['reaction'];
    let reaction_date = args['reaction-date'];
    let reason = args['reason'];
    let reason_not_given = args['reason-not-given'];
    let status = args['status'];
    let vaccine_code = args['vaccine-code'];

    // TODO: Build query from Parameters

    // TODO: Query database

    let Immunization = getImmunization(base_version);

    // Cast all results to Immunization Class
    let immunization_resource = new Immunization();
    // TODO: Set data with constructor or setter methods
    immunization_resource.id = 'test id';

    // Return Array
    resolve([immunization_resource]);
  });

module.exports.searchById = (args) =>
  new Promise((resolve, reject) => {
    logger.info('Immunization >>> searchById');

    let { base_version, id } = args;

    let Immunization = getImmunization(base_version);

    // TODO: Build query from Parameters

    // TODO: Query database

    // Cast result to Immunization Class
    let immunization_resource = new Immunization();
    // TODO: Set data with constructor or setter methods
    immunization_resource.id = 'test id';

    // Return resource class
    // resolve(immunization_resource);
    resolve();
  });

module.exports.create = (args, { req }) =>
  new Promise((resolve, reject) => {
    logger.info('Immunization >>> create');

    let { base_version, resource } = args;
    // Make sure to use this ID when inserting this resource
    let id = new ObjectID().toString();

    let Immunization = getImmunization(base_version);
    let Meta = getMeta(base_version);

    // TODO: determine if client/server sets ID

    // Cast resource to Immunization Class
    let immunization_resource = new Immunization(resource);
    immunization_resource.meta = new Meta();
    // TODO: set meta info

    // TODO: save record to database

    // Return Id
    resolve({ id });
  });

module.exports.update = (args, { req }) =>
  new Promise((resolve, reject) => {
    logger.info('Immunization >>> update');

    let { base_version, id, resource } = args;

    let Immunization = getImmunization(base_version);
    let Meta = getMeta(base_version);

    // Cast resource to Immunization Class
    let immunization_resource = new Immunization(resource);
    immunization_resource.meta = new Meta();
    // TODO: set meta info, increment meta ID

    // TODO: save record to database

    // Return id, if recorded was created or updated, new meta version id
    resolve({
      id: immunization_resource.id,
      created: false,
      resource_version: immunization_resource.meta.versionId,
    });
  });

module.exports.remove = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('Immunization >>> remove');

    let { id } = args;

    // TODO: delete record in database (soft/hard)

    // Return number of records deleted
    resolve({ deleted: 0 });
  });

module.exports.searchByVersionId = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('Immunization >>> searchByVersionId');

    let { base_version, id, version_id } = args;

    let Immunization = getImmunization(base_version);

    // TODO: Build query from Parameters

    // TODO: Query database

    // Cast result to Immunization Class
    let immunization_resource = new Immunization();

    // Return resource class
    resolve(immunization_resource);
  });

module.exports.history = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('Immunization >>> history');

    // Common search params
    let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } =
      args;

    // Search Result params
    let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } =
      args;

    // Resource Specific params
    let date = args['date'];
    let dose_sequence = args['dose-sequence'];
    let identifier = args['identifier'];
    let location = args['location'];
    let lot_number = args['lot-number'];
    let manufacturer = args['manufacturer'];
    let notgiven = args['notgiven'];
    let patient = args['patient'];
    let practitioner = args['practitioner'];
    let reaction = args['reaction'];
    let reaction_date = args['reaction-date'];
    let reason = args['reason'];
    let reason_not_given = args['reason-not-given'];
    let status = args['status'];
    let vaccine_code = args['vaccine-code'];

    // TODO: Build query from Parameters

    // TODO: Query database

    let Immunization = getImmunization(base_version);

    // Cast all results to Immunization Class
    let immunization_resource = new Immunization();

    // Return Array
    resolve([immunization_resource]);
  });

module.exports.historyById = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('Immunization >>> historyById');

    // Common search params
    let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } =
      args;

    // Search Result params
    let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } =
      args;

    // Resource Specific params
    let date = args['date'];
    let dose_sequence = args['dose-sequence'];
    let identifier = args['identifier'];
    let location = args['location'];
    let lot_number = args['lot-number'];
    let manufacturer = args['manufacturer'];
    let notgiven = args['notgiven'];
    let patient = args['patient'];
    let practitioner = args['practitioner'];
    let reaction = args['reaction'];
    let reaction_date = args['reaction-date'];
    let reason = args['reason'];
    let reason_not_given = args['reason-not-given'];
    let status = args['status'];
    let vaccine_code = args['vaccine-code'];

    // TODO: Build query from Parameters

    // TODO: Query database

    let Immunization = getImmunization(base_version);

    // Cast all results to Immunization Class
    let immunization_resource = new Immunization();

    // Return Array
    resolve([immunization_resource]);
  });
