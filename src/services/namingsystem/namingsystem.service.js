/*eslint no-unused-vars: "warn"*/

const { VERSIONS } = require('@asymmetrik/node-fhir-server-core').constants;
const { resolveSchema } = require('@asymmetrik/node-fhir-server-core');
const FHIRServer = require('@asymmetrik/node-fhir-server-core');
const { ObjectID } = require('mongodb');
const logger = require('@asymmetrik/node-fhir-server-core').loggers.get();

let getNamingSystem = (base_version) => {
  return resolveSchema(base_version, 'NamingSystem');
};

let getMeta = (base_version) => {
  return resolveSchema(base_version, 'Meta');
};

module.exports.search = (args) =>
  new Promise((resolve, reject) => {
    logger.info('NamingSystem >>> search');

    // Common search params
    let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } =
      args;

    // Search Result params
    let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } =
      args;

    // Resource Specific params
    let contact = args['contact'];
    let date = args['date'];
    let description = args['description'];
    let id_type = args['id-type'];
    let jurisdiction = args['jurisdiction'];
    let kind = args['kind'];
    let name = args['name'];
    let period = args['period'];
    let publisher = args['publisher'];
    let replaced_by = args['replaced-by'];
    let responsible = args['responsible'];
    let status = args['status'];
    let telecom = args['telecom'];
    let type = args['type'];
    let value = args['value'];

    // TODO: Build query from Parameters

    // TODO: Query database

    let NamingSystem = getNamingSystem(base_version);

    // Cast all results to NamingSystem Class
    let namingsystem_resource = new NamingSystem();
    // TODO: Set data with constructor or setter methods
    namingsystem_resource.id = 'test id';

    // Return Array
    resolve([namingsystem_resource]);
  });

module.exports.searchById = (args) =>
  new Promise((resolve, reject) => {
    logger.info('NamingSystem >>> searchById');

    let { base_version, id } = args;

    let NamingSystem = getNamingSystem(base_version);

    // TODO: Build query from Parameters

    // TODO: Query database

    // Cast result to NamingSystem Class
    let namingsystem_resource = new NamingSystem();
    // TODO: Set data with constructor or setter methods
    namingsystem_resource.id = 'test id';

    // Return resource class
    // resolve(namingsystem_resource);
    resolve();
  });

module.exports.create = (args, { req }) =>
  new Promise((resolve, reject) => {
    logger.info('NamingSystem >>> create');

    let { base_version, resource } = args;
    // Make sure to use this ID when inserting this resource
    let id = new ObjectID().toString();

    let NamingSystem = getNamingSystem(base_version);
    let Meta = getMeta(base_version);

    // TODO: determine if client/server sets ID

    // Cast resource to NamingSystem Class
    let namingsystem_resource = new NamingSystem(resource);
    namingsystem_resource.meta = new Meta();
    // TODO: set meta info

    // TODO: save record to database

    // Return Id
    resolve({ id });
  });

module.exports.update = (args, { req }) =>
  new Promise((resolve, reject) => {
    logger.info('NamingSystem >>> update');

    let { base_version, id, resource } = args;

    let NamingSystem = getNamingSystem(base_version);
    let Meta = getMeta(base_version);

    // Cast resource to NamingSystem Class
    let namingsystem_resource = new NamingSystem(resource);
    namingsystem_resource.meta = new Meta();
    // TODO: set meta info, increment meta ID

    // TODO: save record to database

    // Return id, if recorded was created or updated, new meta version id
    resolve({
      id: namingsystem_resource.id,
      created: false,
      resource_version: namingsystem_resource.meta.versionId,
    });
  });

module.exports.remove = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('NamingSystem >>> remove');

    let { id } = args;

    // TODO: delete record in database (soft/hard)

    // Return number of records deleted
    resolve({ deleted: 0 });
  });

module.exports.searchByVersionId = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('NamingSystem >>> searchByVersionId');

    let { base_version, id, version_id } = args;

    let NamingSystem = getNamingSystem(base_version);

    // TODO: Build query from Parameters

    // TODO: Query database

    // Cast result to NamingSystem Class
    let namingsystem_resource = new NamingSystem();

    // Return resource class
    resolve(namingsystem_resource);
  });

module.exports.history = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('NamingSystem >>> history');

    // Common search params
    let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } =
      args;

    // Search Result params
    let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } =
      args;

    // Resource Specific params
    let contact = args['contact'];
    let date = args['date'];
    let description = args['description'];
    let id_type = args['id-type'];
    let jurisdiction = args['jurisdiction'];
    let kind = args['kind'];
    let name = args['name'];
    let period = args['period'];
    let publisher = args['publisher'];
    let replaced_by = args['replaced-by'];
    let responsible = args['responsible'];
    let status = args['status'];
    let telecom = args['telecom'];
    let type = args['type'];
    let value = args['value'];

    // TODO: Build query from Parameters

    // TODO: Query database

    let NamingSystem = getNamingSystem(base_version);

    // Cast all results to NamingSystem Class
    let namingsystem_resource = new NamingSystem();

    // Return Array
    resolve([namingsystem_resource]);
  });

module.exports.historyById = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('NamingSystem >>> historyById');

    // Common search params
    let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } =
      args;

    // Search Result params
    let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } =
      args;

    // Resource Specific params
    let contact = args['contact'];
    let date = args['date'];
    let description = args['description'];
    let id_type = args['id-type'];
    let jurisdiction = args['jurisdiction'];
    let kind = args['kind'];
    let name = args['name'];
    let period = args['period'];
    let publisher = args['publisher'];
    let replaced_by = args['replaced-by'];
    let responsible = args['responsible'];
    let status = args['status'];
    let telecom = args['telecom'];
    let type = args['type'];
    let value = args['value'];

    // TODO: Build query from Parameters

    // TODO: Query database

    let NamingSystem = getNamingSystem(base_version);

    // Cast all results to NamingSystem Class
    let namingsystem_resource = new NamingSystem();

    // Return Array
    resolve([namingsystem_resource]);
  });
