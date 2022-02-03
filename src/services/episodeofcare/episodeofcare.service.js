/*eslint no-unused-vars: "warn"*/

const { VERSIONS } = require('@asymmetrik/node-fhir-server-core').constants;
const { resolveSchema } = require('@asymmetrik/node-fhir-server-core');
const FHIRServer = require('@asymmetrik/node-fhir-server-core');
const { ObjectID } = require('mongodb');
const logger = require('@asymmetrik/node-fhir-server-core').loggers.get();

let getEpisodeOfCare = (base_version) => {
  return resolveSchema(base_version, 'EpisodeOfCare');
};

let getMeta = (base_version) => {
  return resolveSchema(base_version, 'Meta');
};

module.exports.search = (args) =>
  new Promise((resolve, reject) => {
    logger.info('EpisodeOfCare >>> search');

    // Common search params
    let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } =
      args;

    // Search Result params
    let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } =
      args;

    // Resource Specific params
    let care_manager = args['care-manager'];
    let condition = args['condition'];
    let date = args['date'];
    let identifier = args['identifier'];
    let incomingreferral = args['incomingreferral'];
    let organization = args['organization'];
    let patient = args['patient'];
    let status = args['status'];
    let type = args['type'];

    // TODO: Build query from Parameters

    // TODO: Query database

    let EpisodeOfCare = getEpisodeOfCare(base_version);

    // Cast all results to EpisodeOfCare Class
    let episodeofcare_resource = new EpisodeOfCare();
    // TODO: Set data with constructor or setter methods
    episodeofcare_resource.id = 'test id';

    // Return Array
    resolve([episodeofcare_resource]);
  });

module.exports.searchById = (args) =>
  new Promise((resolve, reject) => {
    logger.info('EpisodeOfCare >>> searchById');

    let { base_version, id } = args;

    let EpisodeOfCare = getEpisodeOfCare(base_version);

    // TODO: Build query from Parameters

    // TODO: Query database

    // Cast result to EpisodeOfCare Class
    let episodeofcare_resource = new EpisodeOfCare();
    // TODO: Set data with constructor or setter methods
    episodeofcare_resource.id = 'test id';

    // Return resource class
    // resolve(episodeofcare_resource);
    resolve();
  });

module.exports.create = (args, { req }) =>
  new Promise((resolve, reject) => {
    logger.info('EpisodeOfCare >>> create');

    let { base_version, resource } = args;
    // Make sure to use this ID when inserting this resource
    let id = new ObjectID().toString();

    let EpisodeOfCare = getEpisodeOfCare(base_version);
    let Meta = getMeta(base_version);

    // TODO: determine if client/server sets ID

    // Cast resource to EpisodeOfCare Class
    let episodeofcare_resource = new EpisodeOfCare(resource);
    episodeofcare_resource.meta = new Meta();
    // TODO: set meta info

    // TODO: save record to database

    // Return Id
    resolve({ id });
  });

module.exports.update = (args, { req }) =>
  new Promise((resolve, reject) => {
    logger.info('EpisodeOfCare >>> update');

    let { base_version, id, resource } = args;

    let EpisodeOfCare = getEpisodeOfCare(base_version);
    let Meta = getMeta(base_version);

    // Cast resource to EpisodeOfCare Class
    let episodeofcare_resource = new EpisodeOfCare(resource);
    episodeofcare_resource.meta = new Meta();
    // TODO: set meta info, increment meta ID

    // TODO: save record to database

    // Return id, if recorded was created or updated, new meta version id
    resolve({
      id: episodeofcare_resource.id,
      created: false,
      resource_version: episodeofcare_resource.meta.versionId,
    });
  });

module.exports.remove = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('EpisodeOfCare >>> remove');

    let { id } = args;

    // TODO: delete record in database (soft/hard)

    // Return number of records deleted
    resolve({ deleted: 0 });
  });

module.exports.searchByVersionId = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('EpisodeOfCare >>> searchByVersionId');

    let { base_version, id, version_id } = args;

    let EpisodeOfCare = getEpisodeOfCare(base_version);

    // TODO: Build query from Parameters

    // TODO: Query database

    // Cast result to EpisodeOfCare Class
    let episodeofcare_resource = new EpisodeOfCare();

    // Return resource class
    resolve(episodeofcare_resource);
  });

module.exports.history = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('EpisodeOfCare >>> history');

    // Common search params
    let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } =
      args;

    // Search Result params
    let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } =
      args;

    // Resource Specific params
    let care_manager = args['care-manager'];
    let condition = args['condition'];
    let date = args['date'];
    let identifier = args['identifier'];
    let incomingreferral = args['incomingreferral'];
    let organization = args['organization'];
    let patient = args['patient'];
    let status = args['status'];
    let type = args['type'];

    // TODO: Build query from Parameters

    // TODO: Query database

    let EpisodeOfCare = getEpisodeOfCare(base_version);

    // Cast all results to EpisodeOfCare Class
    let episodeofcare_resource = new EpisodeOfCare();

    // Return Array
    resolve([episodeofcare_resource]);
  });

module.exports.historyById = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('EpisodeOfCare >>> historyById');

    // Common search params
    let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } =
      args;

    // Search Result params
    let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } =
      args;

    // Resource Specific params
    let care_manager = args['care-manager'];
    let condition = args['condition'];
    let date = args['date'];
    let identifier = args['identifier'];
    let incomingreferral = args['incomingreferral'];
    let organization = args['organization'];
    let patient = args['patient'];
    let status = args['status'];
    let type = args['type'];

    // TODO: Build query from Parameters

    // TODO: Query database

    let EpisodeOfCare = getEpisodeOfCare(base_version);

    // Cast all results to EpisodeOfCare Class
    let episodeofcare_resource = new EpisodeOfCare();

    // Return Array
    resolve([episodeofcare_resource]);
  });
