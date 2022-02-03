/*eslint no-unused-vars: "warn"*/

const { VERSIONS } = require('@asymmetrik/node-fhir-server-core').constants;
const { resolveSchema } = require('@asymmetrik/node-fhir-server-core');
const FHIRServer = require('@asymmetrik/node-fhir-server-core');
const { ObjectID } = require('mongodb');
const logger = require('@asymmetrik/node-fhir-server-core').loggers.get();

let getSearchParameter = (base_version) => {
  return resolveSchema(base_version, 'SearchParameter');
};

let getMeta = (base_version) => {
  return resolveSchema(base_version, 'Meta');
};

module.exports.search = (args) =>
  new Promise((resolve, reject) => {
    logger.info('SearchParameter >>> search');

    // Common search params
    let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } =
      args;

    // Search Result params
    let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } =
      args;

    // Resource Specific params
    let base = args['base'];
    let code = args['code'];
    let component = args['component'];
    let date = args['date'];
    let derived_from = args['derived-from'];
    let description = args['description'];
    let jurisdiction = args['jurisdiction'];
    let name = args['name'];
    let publisher = args['publisher'];
    let status = args['status'];
    let target = args['target'];
    let type = args['type'];
    let url = args['url'];
    let version = args['version'];

    // TODO: Build query from Parameters

    // TODO: Query database

    let SearchParameter = getSearchParameter(base_version);

    // Cast all results to SearchParameter Class
    let searchparameter_resource = new SearchParameter();
    // TODO: Set data with constructor or setter methods
    searchparameter_resource.id = 'test id';

    // Return Array
    resolve([searchparameter_resource]);
  });

module.exports.searchById = (args) =>
  new Promise((resolve, reject) => {
    logger.info('SearchParameter >>> searchById');

    let { base_version, id } = args;

    let SearchParameter = getSearchParameter(base_version);

    // TODO: Build query from Parameters

    // TODO: Query database

    // Cast result to SearchParameter Class
    let searchparameter_resource = new SearchParameter();
    // TODO: Set data with constructor or setter methods
    searchparameter_resource.id = 'test id';

    // Return resource class
    // resolve(searchparameter_resource);
    resolve();
  });

module.exports.create = (args, { req }) =>
  new Promise((resolve, reject) => {
    logger.info('SearchParameter >>> create');

    let { base_version, resource } = args;
    // Make sure to use this ID when inserting this resource
    let id = new ObjectID().toString();

    let SearchParameter = getSearchParameter(base_version);
    let Meta = getMeta(base_version);

    // TODO: determine if client/server sets ID

    // Cast resource to SearchParameter Class
    let searchparameter_resource = new SearchParameter(resource);
    searchparameter_resource.meta = new Meta();
    // TODO: set meta info

    // TODO: save record to database

    // Return Id
    resolve({ id });
  });

module.exports.update = (args, { req }) =>
  new Promise((resolve, reject) => {
    logger.info('SearchParameter >>> update');

    let { base_version, id, resource } = args;

    let SearchParameter = getSearchParameter(base_version);
    let Meta = getMeta(base_version);

    // Cast resource to SearchParameter Class
    let searchparameter_resource = new SearchParameter(resource);
    searchparameter_resource.meta = new Meta();
    // TODO: set meta info, increment meta ID

    // TODO: save record to database

    // Return id, if recorded was created or updated, new meta version id
    resolve({
      id: searchparameter_resource.id,
      created: false,
      resource_version: searchparameter_resource.meta.versionId,
    });
  });

module.exports.remove = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('SearchParameter >>> remove');

    let { id } = args;

    // TODO: delete record in database (soft/hard)

    // Return number of records deleted
    resolve({ deleted: 0 });
  });

module.exports.searchByVersionId = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('SearchParameter >>> searchByVersionId');

    let { base_version, id, version_id } = args;

    let SearchParameter = getSearchParameter(base_version);

    // TODO: Build query from Parameters

    // TODO: Query database

    // Cast result to SearchParameter Class
    let searchparameter_resource = new SearchParameter();

    // Return resource class
    resolve(searchparameter_resource);
  });

module.exports.history = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('SearchParameter >>> history');

    // Common search params
    let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } =
      args;

    // Search Result params
    let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } =
      args;

    // Resource Specific params
    let base = args['base'];
    let code = args['code'];
    let component = args['component'];
    let date = args['date'];
    let derived_from = args['derived-from'];
    let description = args['description'];
    let jurisdiction = args['jurisdiction'];
    let name = args['name'];
    let publisher = args['publisher'];
    let status = args['status'];
    let target = args['target'];
    let type = args['type'];
    let url = args['url'];
    let version = args['version'];

    // TODO: Build query from Parameters

    // TODO: Query database

    let SearchParameter = getSearchParameter(base_version);

    // Cast all results to SearchParameter Class
    let searchparameter_resource = new SearchParameter();

    // Return Array
    resolve([searchparameter_resource]);
  });

module.exports.historyById = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('SearchParameter >>> historyById');

    // Common search params
    let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } =
      args;

    // Search Result params
    let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } =
      args;

    // Resource Specific params
    let base = args['base'];
    let code = args['code'];
    let component = args['component'];
    let date = args['date'];
    let derived_from = args['derived-from'];
    let description = args['description'];
    let jurisdiction = args['jurisdiction'];
    let name = args['name'];
    let publisher = args['publisher'];
    let status = args['status'];
    let target = args['target'];
    let type = args['type'];
    let url = args['url'];
    let version = args['version'];

    // TODO: Build query from Parameters

    // TODO: Query database

    let SearchParameter = getSearchParameter(base_version);

    // Cast all results to SearchParameter Class
    let searchparameter_resource = new SearchParameter();

    // Return Array
    resolve([searchparameter_resource]);
  });
