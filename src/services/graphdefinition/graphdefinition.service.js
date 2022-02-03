/*eslint no-unused-vars: "warn"*/

const { VERSIONS } = require('@asymmetrik/node-fhir-server-core').constants;
const { resolveSchema } = require('@asymmetrik/node-fhir-server-core');
const FHIRServer = require('@asymmetrik/node-fhir-server-core');
const { ObjectID } = require('mongodb');
const logger = require('@asymmetrik/node-fhir-server-core').loggers.get();

let getGraphDefinition = (base_version) => {
  return resolveSchema(base_version, 'GraphDefinition');
};

let getMeta = (base_version) => {
  return resolveSchema(base_version, 'Meta');
};

module.exports.search = (args) =>
  new Promise((resolve, reject) => {
    logger.info('GraphDefinition >>> search');

    // Common search params
    let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } =
      args;

    // Search Result params
    let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } =
      args;

    // Resource Specific params
    let date = args['date'];
    let description = args['description'];
    let jurisdiction = args['jurisdiction'];
    let name = args['name'];
    let publisher = args['publisher'];
    let start = args['start'];
    let status = args['status'];
    let url = args['url'];
    let version = args['version'];

    // TODO: Build query from Parameters

    // TODO: Query database

    let GraphDefinition = getGraphDefinition(base_version);

    // Cast all results to GraphDefinition Class
    let graphdefinition_resource = new GraphDefinition();
    // TODO: Set data with constructor or setter methods
    graphdefinition_resource.id = 'test id';

    // Return Array
    resolve([graphdefinition_resource]);
  });

module.exports.searchById = (args) =>
  new Promise((resolve, reject) => {
    logger.info('GraphDefinition >>> searchById');

    let { base_version, id } = args;

    let GraphDefinition = getGraphDefinition(base_version);

    // TODO: Build query from Parameters

    // TODO: Query database

    // Cast result to GraphDefinition Class
    let graphdefinition_resource = new GraphDefinition();
    // TODO: Set data with constructor or setter methods
    graphdefinition_resource.id = 'test id';

    // Return resource class
    // resolve(graphdefinition_resource);
    resolve();
  });

module.exports.create = (args, { req }) =>
  new Promise((resolve, reject) => {
    logger.info('GraphDefinition >>> create');

    let { base_version, resource } = args;
    // Make sure to use this ID when inserting this resource
    let id = new ObjectID().toString();

    let GraphDefinition = getGraphDefinition(base_version);
    let Meta = getMeta(base_version);

    // TODO: determine if client/server sets ID

    // Cast resource to GraphDefinition Class
    let graphdefinition_resource = new GraphDefinition(resource);
    graphdefinition_resource.meta = new Meta();
    // TODO: set meta info

    // TODO: save record to database

    // Return Id
    resolve({ id });
  });

module.exports.update = (args, { req }) =>
  new Promise((resolve, reject) => {
    logger.info('GraphDefinition >>> update');

    let { base_version, id, resource } = args;

    let GraphDefinition = getGraphDefinition(base_version);
    let Meta = getMeta(base_version);

    // Cast resource to GraphDefinition Class
    let graphdefinition_resource = new GraphDefinition(resource);
    graphdefinition_resource.meta = new Meta();
    // TODO: set meta info, increment meta ID

    // TODO: save record to database

    // Return id, if recorded was created or updated, new meta version id
    resolve({
      id: graphdefinition_resource.id,
      created: false,
      resource_version: graphdefinition_resource.meta.versionId,
    });
  });

module.exports.remove = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('GraphDefinition >>> remove');

    let { id } = args;

    // TODO: delete record in database (soft/hard)

    // Return number of records deleted
    resolve({ deleted: 0 });
  });

module.exports.searchByVersionId = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('GraphDefinition >>> searchByVersionId');

    let { base_version, id, version_id } = args;

    let GraphDefinition = getGraphDefinition(base_version);

    // TODO: Build query from Parameters

    // TODO: Query database

    // Cast result to GraphDefinition Class
    let graphdefinition_resource = new GraphDefinition();

    // Return resource class
    resolve(graphdefinition_resource);
  });

module.exports.history = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('GraphDefinition >>> history');

    // Common search params
    let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } =
      args;

    // Search Result params
    let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } =
      args;

    // Resource Specific params
    let date = args['date'];
    let description = args['description'];
    let jurisdiction = args['jurisdiction'];
    let name = args['name'];
    let publisher = args['publisher'];
    let start = args['start'];
    let status = args['status'];
    let url = args['url'];
    let version = args['version'];

    // TODO: Build query from Parameters

    // TODO: Query database

    let GraphDefinition = getGraphDefinition(base_version);

    // Cast all results to GraphDefinition Class
    let graphdefinition_resource = new GraphDefinition();

    // Return Array
    resolve([graphdefinition_resource]);
  });

module.exports.historyById = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('GraphDefinition >>> historyById');

    // Common search params
    let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } =
      args;

    // Search Result params
    let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } =
      args;

    // Resource Specific params
    let date = args['date'];
    let description = args['description'];
    let jurisdiction = args['jurisdiction'];
    let name = args['name'];
    let publisher = args['publisher'];
    let start = args['start'];
    let status = args['status'];
    let url = args['url'];
    let version = args['version'];

    // TODO: Build query from Parameters

    // TODO: Query database

    let GraphDefinition = getGraphDefinition(base_version);

    // Cast all results to GraphDefinition Class
    let graphdefinition_resource = new GraphDefinition();

    // Return Array
    resolve([graphdefinition_resource]);
  });
