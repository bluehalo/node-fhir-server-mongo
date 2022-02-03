/*eslint no-unused-vars: "warn"*/

const { VERSIONS } = require('@asymmetrik/node-fhir-server-core').constants;
const { resolveSchema } = require('@asymmetrik/node-fhir-server-core');
const FHIRServer = require('@asymmetrik/node-fhir-server-core');
const { ObjectID } = require('mongodb');
const logger = require('@asymmetrik/node-fhir-server-core').loggers.get();

let getCareTeam = (base_version) => {
  return resolveSchema(base_version, 'CareTeam');
};

let getMeta = (base_version) => {
  return resolveSchema(base_version, 'Meta');
};

module.exports.search = (args) =>
  new Promise((resolve, reject) => {
    logger.info('CareTeam >>> search');

    // Common search params
    let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } =
      args;

    // Search Result params
    let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } =
      args;

    // Resource Specific params
    let category = args['category'];
    let _context = args['_context'];
    let date = args['date'];
    let encounter = args['encounter'];
    let identifier = args['identifier'];
    let participant = args['participant'];
    let patient = args['patient'];
    let status = args['status'];
    let subject = args['subject'];

    // TODO: Build query from Parameters

    // TODO: Query database

    let CareTeam = getCareTeam(base_version);

    // Cast all results to CareTeam Class
    let careteam_resource = new CareTeam();
    // TODO: Set data with constructor or setter methods
    careteam_resource.id = 'test id';

    // Return Array
    resolve([careteam_resource]);
  });

module.exports.searchById = (args) =>
  new Promise((resolve, reject) => {
    logger.info('CareTeam >>> searchById');

    let { base_version, id } = args;

    let CareTeam = getCareTeam(base_version);

    // TODO: Build query from Parameters

    // TODO: Query database

    // Cast result to CareTeam Class
    let careteam_resource = new CareTeam();
    // TODO: Set data with constructor or setter methods
    careteam_resource.id = 'test id';

    // Return resource class
    // resolve(careteam_resource);
    resolve();
  });

module.exports.create = (args, { req }) =>
  new Promise((resolve, reject) => {
    logger.info('CareTeam >>> create');

    let { base_version, resource } = args;
    // Make sure to use this ID when inserting this resource
    let id = new ObjectID().toString();

    let CareTeam = getCareTeam(base_version);
    let Meta = getMeta(base_version);

    // TODO: determine if client/server sets ID

    // Cast resource to CareTeam Class
    let careteam_resource = new CareTeam(resource);
    careteam_resource.meta = new Meta();
    // TODO: set meta info

    // TODO: save record to database

    // Return Id
    resolve({ id });
  });

module.exports.update = (args, { req }) =>
  new Promise((resolve, reject) => {
    logger.info('CareTeam >>> update');

    let { base_version, id, resource } = args;

    let CareTeam = getCareTeam(base_version);
    let Meta = getMeta(base_version);

    // Cast resource to CareTeam Class
    let careteam_resource = new CareTeam(resource);
    careteam_resource.meta = new Meta();
    // TODO: set meta info, increment meta ID

    // TODO: save record to database

    // Return id, if recorded was created or updated, new meta version id
    resolve({
      id: careteam_resource.id,
      created: false,
      resource_version: careteam_resource.meta.versionId,
    });
  });

module.exports.remove = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('CareTeam >>> remove');

    let { id } = args;

    // TODO: delete record in database (soft/hard)

    // Return number of records deleted
    resolve({ deleted: 0 });
  });

module.exports.searchByVersionId = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('CareTeam >>> searchByVersionId');

    let { base_version, id, version_id } = args;

    let CareTeam = getCareTeam(base_version);

    // TODO: Build query from Parameters

    // TODO: Query database

    // Cast result to CareTeam Class
    let careteam_resource = new CareTeam();

    // Return resource class
    resolve(careteam_resource);
  });

module.exports.history = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('CareTeam >>> history');

    // Common search params
    let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } =
      args;

    // Search Result params
    let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } =
      args;

    // Resource Specific params
    let category = args['category'];
    let _context = args['_context'];
    let date = args['date'];
    let encounter = args['encounter'];
    let identifier = args['identifier'];
    let participant = args['participant'];
    let patient = args['patient'];
    let status = args['status'];
    let subject = args['subject'];

    // TODO: Build query from Parameters

    // TODO: Query database

    let CareTeam = getCareTeam(base_version);

    // Cast all results to CareTeam Class
    let careteam_resource = new CareTeam();

    // Return Array
    resolve([careteam_resource]);
  });

module.exports.historyById = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('CareTeam >>> historyById');

    // Common search params
    let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } =
      args;

    // Search Result params
    let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } =
      args;

    // Resource Specific params
    let category = args['category'];
    let _context = args['_context'];
    let date = args['date'];
    let encounter = args['encounter'];
    let identifier = args['identifier'];
    let participant = args['participant'];
    let patient = args['patient'];
    let status = args['status'];
    let subject = args['subject'];

    // TODO: Build query from Parameters

    // TODO: Query database

    let CareTeam = getCareTeam(base_version);

    // Cast all results to CareTeam Class
    let careteam_resource = new CareTeam();

    // Return Array
    resolve([careteam_resource]);
  });
