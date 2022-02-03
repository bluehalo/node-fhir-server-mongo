/*eslint no-unused-vars: "warn"*/

const { VERSIONS } = require('@asymmetrik/node-fhir-server-core').constants;
const { resolveSchema } = require('@asymmetrik/node-fhir-server-core');
const FHIRServer = require('@asymmetrik/node-fhir-server-core');
const { ObjectID } = require('mongodb');
const logger = require('@asymmetrik/node-fhir-server-core').loggers.get();

let getStructureDefinition = (base_version) => {
  return resolveSchema(base_version, 'StructureDefinition');
};

let getMeta = (base_version) => {
  return resolveSchema(base_version, 'Meta');
};

module.exports.search = (args) =>
  new Promise((resolve, reject) => {
    logger.info('StructureDefinition >>> search');

    // Common search params
    let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } =
      args;

    // Search Result params
    let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } =
      args;

    // Resource Specific params
    let abstract = args['abstract'];
    let base = args['base'];
    let base_path = args['base-path'];
    let context_type = args['context-type'];
    let date = args['date'];
    let derivation = args['derivation'];
    let description = args['description'];
    let experimental = args['experimental'];
    let ext_context = args['ext-context'];
    let identifier = args['identifier'];
    let jurisdiction = args['jurisdiction'];
    let keyword = args['keyword'];
    let kind = args['kind'];
    let name = args['name'];
    let path = args['path'];
    let publisher = args['publisher'];
    let status = args['status'];
    let title = args['title'];
    let type = args['type'];
    let url = args['url'];
    let valueset = args['valueset'];
    let version = args['version'];

    // TODO: Build query from Parameters

    // TODO: Query database

    let StructureDefinition = getStructureDefinition(base_version);

    // Cast all results to StructureDefinition Class
    let structuredefinition_resource = new StructureDefinition();
    // TODO: Set data with constructor or setter methods
    structuredefinition_resource.id = 'test id';

    // Return Array
    resolve([structuredefinition_resource]);
  });

module.exports.searchById = (args) =>
  new Promise((resolve, reject) => {
    logger.info('StructureDefinition >>> searchById');

    let { base_version, id } = args;

    let StructureDefinition = getStructureDefinition(base_version);

    // TODO: Build query from Parameters

    // TODO: Query database

    // Cast result to StructureDefinition Class
    let structuredefinition_resource = new StructureDefinition();
    // TODO: Set data with constructor or setter methods
    structuredefinition_resource.id = 'test id';

    // Return resource class
    // resolve(structuredefinition_resource);
    resolve();
  });

module.exports.create = (args, { req }) =>
  new Promise((resolve, reject) => {
    logger.info('StructureDefinition >>> create');

    let { base_version, resource } = args;
    // Make sure to use this ID when inserting this resource
    let id = new ObjectID().toString();

    let StructureDefinition = getStructureDefinition(base_version);
    let Meta = getMeta(base_version);

    // TODO: determine if client/server sets ID

    // Cast resource to StructureDefinition Class
    let structuredefinition_resource = new StructureDefinition(resource);
    structuredefinition_resource.meta = new Meta();
    // TODO: set meta info

    // TODO: save record to database

    // Return Id
    resolve({ id });
  });

module.exports.update = (args, { req }) =>
  new Promise((resolve, reject) => {
    logger.info('StructureDefinition >>> update');

    let { base_version, id, resource } = args;

    let StructureDefinition = getStructureDefinition(base_version);
    let Meta = getMeta(base_version);

    // Cast resource to StructureDefinition Class
    let structuredefinition_resource = new StructureDefinition(resource);
    structuredefinition_resource.meta = new Meta();
    // TODO: set meta info, increment meta ID

    // TODO: save record to database

    // Return id, if recorded was created or updated, new meta version id
    resolve({
      id: structuredefinition_resource.id,
      created: false,
      resource_version: structuredefinition_resource.meta.versionId,
    });
  });

module.exports.remove = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('StructureDefinition >>> remove');

    let { id } = args;

    // TODO: delete record in database (soft/hard)

    // Return number of records deleted
    resolve({ deleted: 0 });
  });

module.exports.searchByVersionId = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('StructureDefinition >>> searchByVersionId');

    let { base_version, id, version_id } = args;

    let StructureDefinition = getStructureDefinition(base_version);

    // TODO: Build query from Parameters

    // TODO: Query database

    // Cast result to StructureDefinition Class
    let structuredefinition_resource = new StructureDefinition();

    // Return resource class
    resolve(structuredefinition_resource);
  });

module.exports.history = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('StructureDefinition >>> history');

    // Common search params
    let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } =
      args;

    // Search Result params
    let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } =
      args;

    // Resource Specific params
    let abstract = args['abstract'];
    let base = args['base'];
    let base_path = args['base-path'];
    let context_type = args['context-type'];
    let date = args['date'];
    let derivation = args['derivation'];
    let description = args['description'];
    let experimental = args['experimental'];
    let ext_context = args['ext-context'];
    let identifier = args['identifier'];
    let jurisdiction = args['jurisdiction'];
    let keyword = args['keyword'];
    let kind = args['kind'];
    let name = args['name'];
    let path = args['path'];
    let publisher = args['publisher'];
    let status = args['status'];
    let title = args['title'];
    let type = args['type'];
    let url = args['url'];
    let valueset = args['valueset'];
    let version = args['version'];

    // TODO: Build query from Parameters

    // TODO: Query database

    let StructureDefinition = getStructureDefinition(base_version);

    // Cast all results to StructureDefinition Class
    let structuredefinition_resource = new StructureDefinition();

    // Return Array
    resolve([structuredefinition_resource]);
  });

module.exports.historyById = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('StructureDefinition >>> historyById');

    // Common search params
    let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } =
      args;

    // Search Result params
    let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } =
      args;

    // Resource Specific params
    let abstract = args['abstract'];
    let base = args['base'];
    let base_path = args['base-path'];
    let context_type = args['context-type'];
    let date = args['date'];
    let derivation = args['derivation'];
    let description = args['description'];
    let experimental = args['experimental'];
    let ext_context = args['ext-context'];
    let identifier = args['identifier'];
    let jurisdiction = args['jurisdiction'];
    let keyword = args['keyword'];
    let kind = args['kind'];
    let name = args['name'];
    let path = args['path'];
    let publisher = args['publisher'];
    let status = args['status'];
    let title = args['title'];
    let type = args['type'];
    let url = args['url'];
    let valueset = args['valueset'];
    let version = args['version'];

    // TODO: Build query from Parameters

    // TODO: Query database

    let StructureDefinition = getStructureDefinition(base_version);

    // Cast all results to StructureDefinition Class
    let structuredefinition_resource = new StructureDefinition();

    // Return Array
    resolve([structuredefinition_resource]);
  });
