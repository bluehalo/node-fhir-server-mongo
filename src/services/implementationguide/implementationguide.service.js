/*eslint no-unused-vars: "warn"*/

const { VERSIONS } = require('@asymmetrik/node-fhir-server-core').constants;
const { resolveSchema } = require('@asymmetrik/node-fhir-server-core');
const FHIRServer = require('@asymmetrik/node-fhir-server-core');
const { ObjectID } = require('mongodb');
const logger = require('@asymmetrik/node-fhir-server-core').loggers.get();

let getImplementationGuide = (base_version) => {
  return resolveSchema(base_version, 'ImplementationGuide');
};

let getMeta = (base_version) => {
  return resolveSchema(base_version, 'Meta');
};

module.exports.search = (args) =>
  new Promise((resolve, reject) => {
    logger.info('ImplementationGuide >>> search');

    // Common search params
    let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } =
      args;

    // Search Result params
    let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } =
      args;

    // Resource Specific params
    let date = args['date'];
    let dependency = args['dependency'];
    let description = args['description'];
    let experimental = args['experimental'];
    let jurisdiction = args['jurisdiction'];
    let name = args['name'];
    let publisher = args['publisher'];
    let resource = args['resource'];
    let status = args['status'];
    let url = args['url'];
    let version = args['version'];

    // TODO: Build query from Parameters

    // TODO: Query database

    let ImplementationGuide = getImplementationGuide(base_version);

    // Cast all results to ImplementationGuide Class
    let implementationguide_resource = new ImplementationGuide();
    // TODO: Set data with constructor or setter methods
    implementationguide_resource.id = 'test id';

    // Return Array
    resolve([implementationguide_resource]);
  });

module.exports.searchById = (args) =>
  new Promise((resolve, reject) => {
    logger.info('ImplementationGuide >>> searchById');

    let { base_version, id } = args;

    let ImplementationGuide = getImplementationGuide(base_version);

    // TODO: Build query from Parameters

    // TODO: Query database

    // Cast result to ImplementationGuide Class
    let implementationguide_resource = new ImplementationGuide();
    // TODO: Set data with constructor or setter methods
    implementationguide_resource.id = 'test id';

    // Return resource class
    // resolve(implementationguide_resource);
    resolve();
  });

module.exports.create = (args, { req }) =>
  new Promise((resolve, reject) => {
    logger.info('ImplementationGuide >>> create');

    let { base_version, resource } = args;
    // Make sure to use this ID when inserting this resource
    let id = new ObjectID().toString();

    let ImplementationGuide = getImplementationGuide(base_version);
    let Meta = getMeta(base_version);

    // TODO: determine if client/server sets ID

    // Cast resource to ImplementationGuide Class
    let implementationguide_resource = new ImplementationGuide(resource);
    implementationguide_resource.meta = new Meta();
    // TODO: set meta info

    // TODO: save record to database

    // Return Id
    resolve({ id });
  });

module.exports.update = (args, { req }) =>
  new Promise((resolve, reject) => {
    logger.info('ImplementationGuide >>> update');

    let { base_version, id, resource } = args;

    let ImplementationGuide = getImplementationGuide(base_version);
    let Meta = getMeta(base_version);

    // Cast resource to ImplementationGuide Class
    let implementationguide_resource = new ImplementationGuide(resource);
    implementationguide_resource.meta = new Meta();
    // TODO: set meta info, increment meta ID

    // TODO: save record to database

    // Return id, if recorded was created or updated, new meta version id
    resolve({
      id: implementationguide_resource.id,
      created: false,
      resource_version: implementationguide_resource.meta.versionId,
    });
  });

module.exports.remove = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('ImplementationGuide >>> remove');

    let { id } = args;

    // TODO: delete record in database (soft/hard)

    // Return number of records deleted
    resolve({ deleted: 0 });
  });

module.exports.searchByVersionId = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('ImplementationGuide >>> searchByVersionId');

    let { base_version, id, version_id } = args;

    let ImplementationGuide = getImplementationGuide(base_version);

    // TODO: Build query from Parameters

    // TODO: Query database

    // Cast result to ImplementationGuide Class
    let implementationguide_resource = new ImplementationGuide();

    // Return resource class
    resolve(implementationguide_resource);
  });

module.exports.history = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('ImplementationGuide >>> history');

    // Common search params
    let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } =
      args;

    // Search Result params
    let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } =
      args;

    // Resource Specific params
    let date = args['date'];
    let dependency = args['dependency'];
    let description = args['description'];
    let experimental = args['experimental'];
    let jurisdiction = args['jurisdiction'];
    let name = args['name'];
    let publisher = args['publisher'];
    let resource = args['resource'];
    let status = args['status'];
    let url = args['url'];
    let version = args['version'];

    // TODO: Build query from Parameters

    // TODO: Query database

    let ImplementationGuide = getImplementationGuide(base_version);

    // Cast all results to ImplementationGuide Class
    let implementationguide_resource = new ImplementationGuide();

    // Return Array
    resolve([implementationguide_resource]);
  });

module.exports.historyById = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('ImplementationGuide >>> historyById');

    // Common search params
    let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } =
      args;

    // Search Result params
    let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } =
      args;

    // Resource Specific params
    let date = args['date'];
    let dependency = args['dependency'];
    let description = args['description'];
    let experimental = args['experimental'];
    let jurisdiction = args['jurisdiction'];
    let name = args['name'];
    let publisher = args['publisher'];
    let resource = args['resource'];
    let status = args['status'];
    let url = args['url'];
    let version = args['version'];

    // TODO: Build query from Parameters

    // TODO: Query database

    let ImplementationGuide = getImplementationGuide(base_version);

    // Cast all results to ImplementationGuide Class
    let implementationguide_resource = new ImplementationGuide();

    // Return Array
    resolve([implementationguide_resource]);
  });
