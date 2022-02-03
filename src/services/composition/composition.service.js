/*eslint no-unused-vars: "warn"*/

const { VERSIONS } = require('@asymmetrik/node-fhir-server-core').constants;
const { resolveSchema } = require('@asymmetrik/node-fhir-server-core');
const FHIRServer = require('@asymmetrik/node-fhir-server-core');
const { ObjectID } = require('mongodb');
const logger = require('@asymmetrik/node-fhir-server-core').loggers.get();

let getComposition = (base_version) => {
  return resolveSchema(base_version, 'Composition');
};

let getMeta = (base_version) => {
  return resolveSchema(base_version, 'Meta');
};

module.exports.search = (args) =>
  new Promise((resolve, reject) => {
    logger.info('Composition >>> search');

    // Common search params
    let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } =
      args;

    // Search Result params
    let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } =
      args;

    // Resource Specific params
    let attester = args['attester'];
    let author = args['author'];
    let _class = args['_class'];
    let confidentiality = args['confidentiality'];
    let _context = args['_context'];
    let date = args['date'];
    let encounter = args['encounter'];
    let entry = args['entry'];
    let identifier = args['identifier'];
    let patient = args['patient'];
    let period = args['period'];
    let related_id = args['related-id'];
    let related_ref = args['related-ref'];
    let section = args['section'];
    let status = args['status'];
    let subject = args['subject'];
    let title = args['title'];
    let type = args['type'];

    // TODO: Build query from Parameters

    // TODO: Query database

    let Composition = getComposition(base_version);

    // Cast all results to Composition Class
    let composition_resource = new Composition();
    // TODO: Set data with constructor or setter methods
    composition_resource.id = 'test id';

    // Return Array
    resolve([composition_resource]);
  });

module.exports.searchById = (args) =>
  new Promise((resolve, reject) => {
    logger.info('Composition >>> searchById');

    let { base_version, id } = args;

    let Composition = getComposition(base_version);

    // TODO: Build query from Parameters

    // TODO: Query database

    // Cast result to Composition Class
    let composition_resource = new Composition();
    // TODO: Set data with constructor or setter methods
    composition_resource.id = 'test id';

    // Return resource class
    // resolve(composition_resource);
    resolve();
  });

module.exports.create = (args, { req }) =>
  new Promise((resolve, reject) => {
    logger.info('Composition >>> create');

    let { base_version, resource } = args;
    // Make sure to use this ID when inserting this resource
    let id = new ObjectID().toString();

    let Composition = getComposition(base_version);
    let Meta = getMeta(base_version);

    // TODO: determine if client/server sets ID

    // Cast resource to Composition Class
    let composition_resource = new Composition(resource);
    composition_resource.meta = new Meta();
    // TODO: set meta info

    // TODO: save record to database

    // Return Id
    resolve({ id });
  });

module.exports.update = (args, { req }) =>
  new Promise((resolve, reject) => {
    logger.info('Composition >>> update');

    let { base_version, id, resource } = args;

    let Composition = getComposition(base_version);
    let Meta = getMeta(base_version);

    // Cast resource to Composition Class
    let composition_resource = new Composition(resource);
    composition_resource.meta = new Meta();
    // TODO: set meta info, increment meta ID

    // TODO: save record to database

    // Return id, if recorded was created or updated, new meta version id
    resolve({
      id: composition_resource.id,
      created: false,
      resource_version: composition_resource.meta.versionId,
    });
  });

module.exports.remove = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('Composition >>> remove');

    let { id } = args;

    // TODO: delete record in database (soft/hard)

    // Return number of records deleted
    resolve({ deleted: 0 });
  });

module.exports.searchByVersionId = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('Composition >>> searchByVersionId');

    let { base_version, id, version_id } = args;

    let Composition = getComposition(base_version);

    // TODO: Build query from Parameters

    // TODO: Query database

    // Cast result to Composition Class
    let composition_resource = new Composition();

    // Return resource class
    resolve(composition_resource);
  });

module.exports.history = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('Composition >>> history');

    // Common search params
    let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } =
      args;

    // Search Result params
    let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } =
      args;

    // Resource Specific params
    let attester = args['attester'];
    let author = args['author'];
    let _class = args['_class'];
    let confidentiality = args['confidentiality'];
    let _context = args['_context'];
    let date = args['date'];
    let encounter = args['encounter'];
    let entry = args['entry'];
    let identifier = args['identifier'];
    let patient = args['patient'];
    let period = args['period'];
    let related_id = args['related-id'];
    let related_ref = args['related-ref'];
    let section = args['section'];
    let status = args['status'];
    let subject = args['subject'];
    let title = args['title'];
    let type = args['type'];

    // TODO: Build query from Parameters

    // TODO: Query database

    let Composition = getComposition(base_version);

    // Cast all results to Composition Class
    let composition_resource = new Composition();

    // Return Array
    resolve([composition_resource]);
  });

module.exports.historyById = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('Composition >>> historyById');

    // Common search params
    let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } =
      args;

    // Search Result params
    let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } =
      args;

    // Resource Specific params
    let attester = args['attester'];
    let author = args['author'];
    let _class = args['_class'];
    let confidentiality = args['confidentiality'];
    let _context = args['_context'];
    let date = args['date'];
    let encounter = args['encounter'];
    let entry = args['entry'];
    let identifier = args['identifier'];
    let patient = args['patient'];
    let period = args['period'];
    let related_id = args['related-id'];
    let related_ref = args['related-ref'];
    let section = args['section'];
    let status = args['status'];
    let subject = args['subject'];
    let title = args['title'];
    let type = args['type'];

    // TODO: Build query from Parameters

    // TODO: Query database

    let Composition = getComposition(base_version);

    // Cast all results to Composition Class
    let composition_resource = new Composition();

    // Return Array
    resolve([composition_resource]);
  });
