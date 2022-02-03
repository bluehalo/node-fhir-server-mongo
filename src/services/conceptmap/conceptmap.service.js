/*eslint no-unused-vars: "warn"*/

const { VERSIONS } = require('@asymmetrik/node-fhir-server-core').constants;
const { resolveSchema } = require('@asymmetrik/node-fhir-server-core');
const FHIRServer = require('@asymmetrik/node-fhir-server-core');
const { ObjectID } = require('mongodb');
const logger = require('@asymmetrik/node-fhir-server-core').loggers.get();

let getConceptMap = (base_version) => {
  return resolveSchema(base_version, 'ConceptMap');
};

let getMeta = (base_version) => {
  return resolveSchema(base_version, 'Meta');
};

module.exports.search = (args) =>
  new Promise((resolve, reject) => {
    logger.info('ConceptMap >>> search');

    // Common search params
    let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } =
      args;

    // Search Result params
    let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } =
      args;

    // Resource Specific params
    let date = args['date'];
    let dependson = args['dependson'];
    let description = args['description'];
    let identifier = args['identifier'];
    let jurisdiction = args['jurisdiction'];
    let name = args['name'];
    let other = args['other'];
    let product = args['product'];
    let publisher = args['publisher'];
    let source = args['source'];
    let source_code = args['source-code'];
    let source_system = args['source-system'];
    let source_uri = args['source-uri'];
    let status = args['status'];
    let target = args['target'];
    let target_code = args['target-code'];
    let target_system = args['target-system'];
    let target_uri = args['target-uri'];
    let title = args['title'];
    let url = args['url'];
    let version = args['version'];

    // TODO: Build query from Parameters

    // TODO: Query database

    let ConceptMap = getConceptMap(base_version);

    // Cast all results to ConceptMap Class
    let conceptmap_resource = new ConceptMap();
    // TODO: Set data with constructor or setter methods
    conceptmap_resource.id = 'test id';

    // Return Array
    resolve([conceptmap_resource]);
  });

module.exports.searchById = (args) =>
  new Promise((resolve, reject) => {
    logger.info('ConceptMap >>> searchById');

    let { base_version, id } = args;

    let ConceptMap = getConceptMap(base_version);

    // TODO: Build query from Parameters

    // TODO: Query database

    // Cast result to ConceptMap Class
    let conceptmap_resource = new ConceptMap();
    // TODO: Set data with constructor or setter methods
    conceptmap_resource.id = 'test id';

    // Return resource class
    // resolve(conceptmap_resource);
    resolve();
  });

module.exports.create = (args, { req }) =>
  new Promise((resolve, reject) => {
    logger.info('ConceptMap >>> create');

    let { base_version, resource } = args;
    // Make sure to use this ID when inserting this resource
    let id = new ObjectID().toString();

    let ConceptMap = getConceptMap(base_version);
    let Meta = getMeta(base_version);

    // TODO: determine if client/server sets ID

    // Cast resource to ConceptMap Class
    let conceptmap_resource = new ConceptMap(resource);
    conceptmap_resource.meta = new Meta();
    // TODO: set meta info

    // TODO: save record to database

    // Return Id
    resolve({ id });
  });

module.exports.update = (args, { req }) =>
  new Promise((resolve, reject) => {
    logger.info('ConceptMap >>> update');

    let { base_version, id, resource } = args;

    let ConceptMap = getConceptMap(base_version);
    let Meta = getMeta(base_version);

    // Cast resource to ConceptMap Class
    let conceptmap_resource = new ConceptMap(resource);
    conceptmap_resource.meta = new Meta();
    // TODO: set meta info, increment meta ID

    // TODO: save record to database

    // Return id, if recorded was created or updated, new meta version id
    resolve({
      id: conceptmap_resource.id,
      created: false,
      resource_version: conceptmap_resource.meta.versionId,
    });
  });

module.exports.remove = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('ConceptMap >>> remove');

    let { id } = args;

    // TODO: delete record in database (soft/hard)

    // Return number of records deleted
    resolve({ deleted: 0 });
  });

module.exports.searchByVersionId = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('ConceptMap >>> searchByVersionId');

    let { base_version, id, version_id } = args;

    let ConceptMap = getConceptMap(base_version);

    // TODO: Build query from Parameters

    // TODO: Query database

    // Cast result to ConceptMap Class
    let conceptmap_resource = new ConceptMap();

    // Return resource class
    resolve(conceptmap_resource);
  });

module.exports.history = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('ConceptMap >>> history');

    // Common search params
    let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } =
      args;

    // Search Result params
    let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } =
      args;

    // Resource Specific params
    let date = args['date'];
    let dependson = args['dependson'];
    let description = args['description'];
    let identifier = args['identifier'];
    let jurisdiction = args['jurisdiction'];
    let name = args['name'];
    let other = args['other'];
    let product = args['product'];
    let publisher = args['publisher'];
    let source = args['source'];
    let source_code = args['source-code'];
    let source_system = args['source-system'];
    let source_uri = args['source-uri'];
    let status = args['status'];
    let target = args['target'];
    let target_code = args['target-code'];
    let target_system = args['target-system'];
    let target_uri = args['target-uri'];
    let title = args['title'];
    let url = args['url'];
    let version = args['version'];

    // TODO: Build query from Parameters

    // TODO: Query database

    let ConceptMap = getConceptMap(base_version);

    // Cast all results to ConceptMap Class
    let conceptmap_resource = new ConceptMap();

    // Return Array
    resolve([conceptmap_resource]);
  });

module.exports.historyById = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('ConceptMap >>> historyById');

    // Common search params
    let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } =
      args;

    // Search Result params
    let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } =
      args;

    // Resource Specific params
    let date = args['date'];
    let dependson = args['dependson'];
    let description = args['description'];
    let identifier = args['identifier'];
    let jurisdiction = args['jurisdiction'];
    let name = args['name'];
    let other = args['other'];
    let product = args['product'];
    let publisher = args['publisher'];
    let source = args['source'];
    let source_code = args['source-code'];
    let source_system = args['source-system'];
    let source_uri = args['source-uri'];
    let status = args['status'];
    let target = args['target'];
    let target_code = args['target-code'];
    let target_system = args['target-system'];
    let target_uri = args['target-uri'];
    let title = args['title'];
    let url = args['url'];
    let version = args['version'];

    // TODO: Build query from Parameters

    // TODO: Query database

    let ConceptMap = getConceptMap(base_version);

    // Cast all results to ConceptMap Class
    let conceptmap_resource = new ConceptMap();

    // Return Array
    resolve([conceptmap_resource]);
  });
