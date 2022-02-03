/*eslint no-unused-vars: "warn"*/

const { VERSIONS } = require('@asymmetrik/node-fhir-server-core').constants;
const { resolveSchema } = require('@asymmetrik/node-fhir-server-core');
const FHIRServer = require('@asymmetrik/node-fhir-server-core');
const { ObjectID } = require('mongodb');
const logger = require('@asymmetrik/node-fhir-server-core').loggers.get();

let getHealthCareService = (base_version) => {
  return resolveSchema(base_version, 'HealthCareService');
};

let getMeta = (base_version) => {
  return resolveSchema(base_version, 'Meta');
};

module.exports.search = (args) =>
  new Promise((resolve, reject) => {
    logger.info('HealthCareService >>> search');

    // Common search params
    let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } =
      args;

    // Search Result params
    let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } =
      args;

    // Resource Specific params
    let active = args['active'];
    let category = args['category'];
    let characteristic = args['characteristic'];
    let endpoint = args['endpoint'];
    let identifier = args['identifier'];
    let location = args['location'];
    let name = args['name'];
    let organization = args['organization'];
    let programname = args['programname'];
    let type = args['type'];

    // TODO: Build query from Parameters

    // TODO: Query database

    let HealthCareService = getHealthCareService(base_version);

    // Cast all results to HealthCareService Class
    let healthcareservice_resource = new HealthCareService();
    // TODO: Set data with constructor or setter methods
    healthcareservice_resource.id = 'test id';

    // Return Array
    resolve([healthcareservice_resource]);
  });

module.exports.searchById = (args) =>
  new Promise((resolve, reject) => {
    logger.info('HealthCareService >>> searchById');

    let { base_version, id } = args;

    let HealthCareService = getHealthCareService(base_version);

    // TODO: Build query from Parameters

    // TODO: Query database

    // Cast result to HealthCareService Class
    let healthcareservice_resource = new HealthCareService();
    // TODO: Set data with constructor or setter methods
    healthcareservice_resource.id = 'test id';

    // Return resource class
    // resolve(healthcareservice_resource);
    resolve();
  });

module.exports.create = (args, { req }) =>
  new Promise((resolve, reject) => {
    logger.info('HealthCareService >>> create');

    let { base_version, resource } = args;
    // Make sure to use this ID when inserting this resource
    let id = new ObjectID().toString();

    let HealthCareService = getHealthCareService(base_version);
    let Meta = getMeta(base_version);

    // TODO: determine if client/server sets ID

    // Cast resource to HealthCareService Class
    let healthcareservice_resource = new HealthCareService(resource);
    healthcareservice_resource.meta = new Meta();
    // TODO: set meta info

    // TODO: save record to database

    // Return Id
    resolve({ id });
  });

module.exports.update = (args, { req }) =>
  new Promise((resolve, reject) => {
    logger.info('HealthCareService >>> update');

    let { base_version, id, resource } = args;

    let HealthCareService = getHealthCareService(base_version);
    let Meta = getMeta(base_version);

    // Cast resource to HealthCareService Class
    let healthcareservice_resource = new HealthCareService(resource);
    healthcareservice_resource.meta = new Meta();
    // TODO: set meta info, increment meta ID

    // TODO: save record to database

    // Return id, if recorded was created or updated, new meta version id
    resolve({
      id: healthcareservice_resource.id,
      created: false,
      resource_version: healthcareservice_resource.meta.versionId,
    });
  });

module.exports.remove = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('HealthCareService >>> remove');

    let { id } = args;

    // TODO: delete record in database (soft/hard)

    // Return number of records deleted
    resolve({ deleted: 0 });
  });

module.exports.searchByVersionId = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('HealthCareService >>> searchByVersionId');

    let { base_version, id, version_id } = args;

    let HealthCareService = getHealthCareService(base_version);

    // TODO: Build query from Parameters

    // TODO: Query database

    // Cast result to HealthCareService Class
    let healthcareservice_resource = new HealthCareService();

    // Return resource class
    resolve(healthcareservice_resource);
  });

module.exports.history = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('HealthCareService >>> history');

    // Common search params
    let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } =
      args;

    // Search Result params
    let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } =
      args;

    // Resource Specific params
    let active = args['active'];
    let category = args['category'];
    let characteristic = args['characteristic'];
    let endpoint = args['endpoint'];
    let identifier = args['identifier'];
    let location = args['location'];
    let name = args['name'];
    let organization = args['organization'];
    let programname = args['programname'];
    let type = args['type'];

    // TODO: Build query from Parameters

    // TODO: Query database

    let HealthCareService = getHealthCareService(base_version);

    // Cast all results to HealthCareService Class
    let healthcareservice_resource = new HealthCareService();

    // Return Array
    resolve([healthcareservice_resource]);
  });

module.exports.historyById = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('HealthCareService >>> historyById');

    // Common search params
    let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } =
      args;

    // Search Result params
    let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } =
      args;

    // Resource Specific params
    let active = args['active'];
    let category = args['category'];
    let characteristic = args['characteristic'];
    let endpoint = args['endpoint'];
    let identifier = args['identifier'];
    let location = args['location'];
    let name = args['name'];
    let organization = args['organization'];
    let programname = args['programname'];
    let type = args['type'];

    // TODO: Build query from Parameters

    // TODO: Query database

    let HealthCareService = getHealthCareService(base_version);

    // Cast all results to HealthCareService Class
    let healthcareservice_resource = new HealthCareService();

    // Return Array
    resolve([healthcareservice_resource]);
  });
