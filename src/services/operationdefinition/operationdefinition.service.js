/*eslint no-unused-vars: "warn"*/

const { VERSIONS } = require('@asymmetrik/node-fhir-server-core').constants;
const { resolveSchema } = require('@asymmetrik/node-fhir-server-core');
const FHIRServer = require('@asymmetrik/node-fhir-server-core');
const { ObjectID } = require('mongodb');
const logger = require('@asymmetrik/node-fhir-server-core').loggers.get();

let getOperationDefinition = (base_version) => {
  return resolveSchema(base_version, 'OperationDefinition');
};

let getMeta = (base_version) => {
  return resolveSchema(base_version, 'Meta');
};

module.exports.search = (args) =>
  new Promise((resolve, reject) => {
    logger.info('OperationDefinition >>> search');

    // Common search params
    let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } =
      args;

    // Search Result params
    let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } =
      args;

    // Resource Specific params
    let base = args['base'];
    let code = args['code'];
    let date = args['date'];
    let description = args['description'];
    let instance = args['instance'];
    let jurisdiction = args['jurisdiction'];
    let kind = args['kind'];
    let name = args['name'];
    let param_profile = args['param-profile'];
    let publisher = args['publisher'];
    let status = args['status'];
    let system = args['system'];
    let type = args['type'];
    let url = args['url'];
    let version = args['version'];

    // TODO: Build query from Parameters

    // TODO: Query database

    let OperationDefinition = getOperationDefinition(base_version);

    // Cast all results to OperationDefinition Class
    let operationdefinition_resource = new OperationDefinition();
    // TODO: Set data with constructor or setter methods
    operationdefinition_resource.id = 'test id';

    // Return Array
    resolve([operationdefinition_resource]);
  });

module.exports.searchById = (args) =>
  new Promise((resolve, reject) => {
    logger.info('OperationDefinition >>> searchById');

    let { base_version, id } = args;

    let OperationDefinition = getOperationDefinition(base_version);

    // TODO: Build query from Parameters

    // TODO: Query database

    // Cast result to OperationDefinition Class
    let operationdefinition_resource = new OperationDefinition();
    // TODO: Set data with constructor or setter methods
    operationdefinition_resource.id = 'test id';

    // Return resource class
    // resolve(operationdefinition_resource);
    resolve();
  });

module.exports.create = (args, { req }) =>
  new Promise((resolve, reject) => {
    logger.info('OperationDefinition >>> create');

    let { base_version, resource } = args;
    // Make sure to use this ID when inserting this resource
    let id = new ObjectID().toString();

    let OperationDefinition = getOperationDefinition(base_version);
    let Meta = getMeta(base_version);

    // TODO: determine if client/server sets ID

    // Cast resource to OperationDefinition Class
    let operationdefinition_resource = new OperationDefinition(resource);
    operationdefinition_resource.meta = new Meta();
    // TODO: set meta info

    // TODO: save record to database

    // Return Id
    resolve({ id });
  });

module.exports.update = (args, { req }) =>
  new Promise((resolve, reject) => {
    logger.info('OperationDefinition >>> update');

    let { base_version, id, resource } = args;

    let OperationDefinition = getOperationDefinition(base_version);
    let Meta = getMeta(base_version);

    // Cast resource to OperationDefinition Class
    let operationdefinition_resource = new OperationDefinition(resource);
    operationdefinition_resource.meta = new Meta();
    // TODO: set meta info, increment meta ID

    // TODO: save record to database

    // Return id, if recorded was created or updated, new meta version id
    resolve({
      id: operationdefinition_resource.id,
      created: false,
      resource_version: operationdefinition_resource.meta.versionId,
    });
  });

module.exports.remove = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('OperationDefinition >>> remove');

    let { id } = args;

    // TODO: delete record in database (soft/hard)

    // Return number of records deleted
    resolve({ deleted: 0 });
  });

module.exports.searchByVersionId = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('OperationDefinition >>> searchByVersionId');

    let { base_version, id, version_id } = args;

    let OperationDefinition = getOperationDefinition(base_version);

    // TODO: Build query from Parameters

    // TODO: Query database

    // Cast result to OperationDefinition Class
    let operationdefinition_resource = new OperationDefinition();

    // Return resource class
    resolve(operationdefinition_resource);
  });

module.exports.history = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('OperationDefinition >>> history');

    // Common search params
    let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } =
      args;

    // Search Result params
    let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } =
      args;

    // Resource Specific params
    let base = args['base'];
    let code = args['code'];
    let date = args['date'];
    let description = args['description'];
    let instance = args['instance'];
    let jurisdiction = args['jurisdiction'];
    let kind = args['kind'];
    let name = args['name'];
    let param_profile = args['param-profile'];
    let publisher = args['publisher'];
    let status = args['status'];
    let system = args['system'];
    let type = args['type'];
    let url = args['url'];
    let version = args['version'];

    // TODO: Build query from Parameters

    // TODO: Query database

    let OperationDefinition = getOperationDefinition(base_version);

    // Cast all results to OperationDefinition Class
    let operationdefinition_resource = new OperationDefinition();

    // Return Array
    resolve([operationdefinition_resource]);
  });

module.exports.historyById = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('OperationDefinition >>> historyById');

    // Common search params
    let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } =
      args;

    // Search Result params
    let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } =
      args;

    // Resource Specific params
    let base = args['base'];
    let code = args['code'];
    let date = args['date'];
    let description = args['description'];
    let instance = args['instance'];
    let jurisdiction = args['jurisdiction'];
    let kind = args['kind'];
    let name = args['name'];
    let param_profile = args['param-profile'];
    let publisher = args['publisher'];
    let status = args['status'];
    let system = args['system'];
    let type = args['type'];
    let url = args['url'];
    let version = args['version'];

    // TODO: Build query from Parameters

    // TODO: Query database

    let OperationDefinition = getOperationDefinition(base_version);

    // Cast all results to OperationDefinition Class
    let operationdefinition_resource = new OperationDefinition();

    // Return Array
    resolve([operationdefinition_resource]);
  });
