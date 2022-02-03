/*eslint no-unused-vars: "warn"*/

const { VERSIONS } = require('@asymmetrik/node-fhir-server-core').constants;
const { resolveSchema } = require('@asymmetrik/node-fhir-server-core');
const FHIRServer = require('@asymmetrik/node-fhir-server-core');
const { ObjectID } = require('mongodb');
const logger = require('@asymmetrik/node-fhir-server-core').loggers.get();

let getServiceDefinition = (base_version) => {
  return resolveSchema(base_version, 'ServiceDefinition');
};

let getMeta = (base_version) => {
  return resolveSchema(base_version, 'Meta');
};

module.exports.search = (args) =>
  new Promise((resolve, reject) => {
    logger.info('ServiceDefinition >>> search');

    // Common search params
    let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } =
      args;

    // Search Result params
    let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } =
      args;

    // Resource Specific params
    let composed_of = args['composed-of'];
    let date = args['date'];
    let depends_on = args['depends-on'];
    let derived_from = args['derived-from'];
    let description = args['description'];
    let effective = args['effective'];
    let identifier = args['identifier'];
    let jurisdiction = args['jurisdiction'];
    let name = args['name'];
    let predecessor = args['predecessor'];
    let publisher = args['publisher'];
    let status = args['status'];
    let successor = args['successor'];
    let title = args['title'];
    let topic = args['topic'];
    let url = args['url'];
    let version = args['version'];

    // TODO: Build query from Parameters

    // TODO: Query database

    let ServiceDefinition = getServiceDefinition(base_version);

    // Cast all results to ServiceDefinition Class
    let servicedefinition_resource = new ServiceDefinition();
    // TODO: Set data with constructor or setter methods
    servicedefinition_resource.id = 'test id';

    // Return Array
    resolve([servicedefinition_resource]);
  });

module.exports.searchById = (args) =>
  new Promise((resolve, reject) => {
    logger.info('ServiceDefinition >>> searchById');

    let { base_version, id } = args;

    let ServiceDefinition = getServiceDefinition(base_version);

    // TODO: Build query from Parameters

    // TODO: Query database

    // Cast result to ServiceDefinition Class
    let servicedefinition_resource = new ServiceDefinition();
    // TODO: Set data with constructor or setter methods
    servicedefinition_resource.id = 'test id';

    // Return resource class
    // resolve(servicedefinition_resource);
    resolve();
  });

module.exports.create = (args, { req }) =>
  new Promise((resolve, reject) => {
    logger.info('ServiceDefinition >>> create');

    let { base_version, resource } = args;
    // Make sure to use this ID when inserting this resource
    let id = new ObjectID().toString();

    let ServiceDefinition = getServiceDefinition(base_version);
    let Meta = getMeta(base_version);

    // TODO: determine if client/server sets ID

    // Cast resource to ServiceDefinition Class
    let servicedefinition_resource = new ServiceDefinition(resource);
    servicedefinition_resource.meta = new Meta();
    // TODO: set meta info

    // TODO: save record to database

    // Return Id
    resolve({ id });
  });

module.exports.update = (args, { req }) =>
  new Promise((resolve, reject) => {
    logger.info('ServiceDefinition >>> update');

    let { base_version, id, resource } = args;

    let ServiceDefinition = getServiceDefinition(base_version);
    let Meta = getMeta(base_version);

    // Cast resource to ServiceDefinition Class
    let servicedefinition_resource = new ServiceDefinition(resource);
    servicedefinition_resource.meta = new Meta();
    // TODO: set meta info, increment meta ID

    // TODO: save record to database

    // Return id, if recorded was created or updated, new meta version id
    resolve({
      id: servicedefinition_resource.id,
      created: false,
      resource_version: servicedefinition_resource.meta.versionId,
    });
  });

module.exports.remove = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('ServiceDefinition >>> remove');

    let { id } = args;

    // TODO: delete record in database (soft/hard)

    // Return number of records deleted
    resolve({ deleted: 0 });
  });

module.exports.searchByVersionId = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('ServiceDefinition >>> searchByVersionId');

    let { base_version, id, version_id } = args;

    let ServiceDefinition = getServiceDefinition(base_version);

    // TODO: Build query from Parameters

    // TODO: Query database

    // Cast result to ServiceDefinition Class
    let servicedefinition_resource = new ServiceDefinition();

    // Return resource class
    resolve(servicedefinition_resource);
  });

module.exports.history = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('ServiceDefinition >>> history');

    // Common search params
    let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } =
      args;

    // Search Result params
    let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } =
      args;

    // Resource Specific params
    let composed_of = args['composed-of'];
    let date = args['date'];
    let depends_on = args['depends-on'];
    let derived_from = args['derived-from'];
    let description = args['description'];
    let effective = args['effective'];
    let identifier = args['identifier'];
    let jurisdiction = args['jurisdiction'];
    let name = args['name'];
    let predecessor = args['predecessor'];
    let publisher = args['publisher'];
    let status = args['status'];
    let successor = args['successor'];
    let title = args['title'];
    let topic = args['topic'];
    let url = args['url'];
    let version = args['version'];

    // TODO: Build query from Parameters

    // TODO: Query database

    let ServiceDefinition = getServiceDefinition(base_version);

    // Cast all results to ServiceDefinition Class
    let servicedefinition_resource = new ServiceDefinition();

    // Return Array
    resolve([servicedefinition_resource]);
  });

module.exports.historyById = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('ServiceDefinition >>> historyById');

    // Common search params
    let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } =
      args;

    // Search Result params
    let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } =
      args;

    // Resource Specific params
    let composed_of = args['composed-of'];
    let date = args['date'];
    let depends_on = args['depends-on'];
    let derived_from = args['derived-from'];
    let description = args['description'];
    let effective = args['effective'];
    let identifier = args['identifier'];
    let jurisdiction = args['jurisdiction'];
    let name = args['name'];
    let predecessor = args['predecessor'];
    let publisher = args['publisher'];
    let status = args['status'];
    let successor = args['successor'];
    let title = args['title'];
    let topic = args['topic'];
    let url = args['url'];
    let version = args['version'];

    // TODO: Build query from Parameters

    // TODO: Query database

    let ServiceDefinition = getServiceDefinition(base_version);

    // Cast all results to ServiceDefinition Class
    let servicedefinition_resource = new ServiceDefinition();

    // Return Array
    resolve([servicedefinition_resource]);
  });
