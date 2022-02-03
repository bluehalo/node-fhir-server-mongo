/*eslint no-unused-vars: "warn"*/

const { VERSIONS } = require('@asymmetrik/node-fhir-server-core').constants;
const { resolveSchema } = require('@asymmetrik/node-fhir-server-core');
const FHIRServer = require('@asymmetrik/node-fhir-server-core');
const { ObjectID } = require('mongodb');
const logger = require('@asymmetrik/node-fhir-server-core').loggers.get();

let getDocumentManifest = (base_version) => {
  return resolveSchema(base_version, 'DocumentManifest');
};

let getMeta = (base_version) => {
  return resolveSchema(base_version, 'Meta');
};

module.exports.search = (args) =>
  new Promise((resolve, reject) => {
    logger.info('DocumentManifest >>> search');

    // Common search params
    let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } =
      args;

    // Search Result params
    let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } =
      args;

    // Resource Specific params
    let author = args['author'];
    let content_ref = args['content-ref'];
    let created = args['created'];
    let description = args['description'];
    let identifier = args['identifier'];
    let patient = args['patient'];
    let recipient = args['recipient'];
    let related_id = args['related-id'];
    let related_ref = args['related-ref'];
    let source = args['source'];
    let status = args['status'];
    let subject = args['subject'];
    let type = args['type'];

    // TODO: Build query from Parameters

    // TODO: Query database

    let DocumentManifest = getDocumentManifest(base_version);

    // Cast all results to DocumentManifest Class
    let documentmanifest_resource = new DocumentManifest();
    // TODO: Set data with constructor or setter methods
    documentmanifest_resource.id = 'test id';

    // Return Array
    resolve([documentmanifest_resource]);
  });

module.exports.searchById = (args) =>
  new Promise((resolve, reject) => {
    logger.info('DocumentManifest >>> searchById');

    let { base_version, id } = args;

    let DocumentManifest = getDocumentManifest(base_version);

    // TODO: Build query from Parameters

    // TODO: Query database

    // Cast result to DocumentManifest Class
    let documentmanifest_resource = new DocumentManifest();
    // TODO: Set data with constructor or setter methods
    documentmanifest_resource.id = 'test id';

    // Return resource class
    // resolve(documentmanifest_resource);
    resolve();
  });

module.exports.create = (args, { req }) =>
  new Promise((resolve, reject) => {
    logger.info('DocumentManifest >>> create');

    let { base_version, resource } = args;
    // Make sure to use this ID when inserting this resource
    let id = new ObjectID().toString();

    let DocumentManifest = getDocumentManifest(base_version);
    let Meta = getMeta(base_version);

    // TODO: determine if client/server sets ID

    // Cast resource to DocumentManifest Class
    let documentmanifest_resource = new DocumentManifest(resource);
    documentmanifest_resource.meta = new Meta();
    // TODO: set meta info

    // TODO: save record to database

    // Return Id
    resolve({ id });
  });

module.exports.update = (args, { req }) =>
  new Promise((resolve, reject) => {
    logger.info('DocumentManifest >>> update');

    let { base_version, id, resource } = args;

    let DocumentManifest = getDocumentManifest(base_version);
    let Meta = getMeta(base_version);

    // Cast resource to DocumentManifest Class
    let documentmanifest_resource = new DocumentManifest(resource);
    documentmanifest_resource.meta = new Meta();
    // TODO: set meta info, increment meta ID

    // TODO: save record to database

    // Return id, if recorded was created or updated, new meta version id
    resolve({
      id: documentmanifest_resource.id,
      created: false,
      resource_version: documentmanifest_resource.meta.versionId,
    });
  });

module.exports.remove = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('DocumentManifest >>> remove');

    let { id } = args;

    // TODO: delete record in database (soft/hard)

    // Return number of records deleted
    resolve({ deleted: 0 });
  });

module.exports.searchByVersionId = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('DocumentManifest >>> searchByVersionId');

    let { base_version, id, version_id } = args;

    let DocumentManifest = getDocumentManifest(base_version);

    // TODO: Build query from Parameters

    // TODO: Query database

    // Cast result to DocumentManifest Class
    let documentmanifest_resource = new DocumentManifest();

    // Return resource class
    resolve(documentmanifest_resource);
  });

module.exports.history = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('DocumentManifest >>> history');

    // Common search params
    let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } =
      args;

    // Search Result params
    let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } =
      args;

    // Resource Specific params
    let author = args['author'];
    let content_ref = args['content-ref'];
    let created = args['created'];
    let description = args['description'];
    let identifier = args['identifier'];
    let patient = args['patient'];
    let recipient = args['recipient'];
    let related_id = args['related-id'];
    let related_ref = args['related-ref'];
    let source = args['source'];
    let status = args['status'];
    let subject = args['subject'];
    let type = args['type'];

    // TODO: Build query from Parameters

    // TODO: Query database

    let DocumentManifest = getDocumentManifest(base_version);

    // Cast all results to DocumentManifest Class
    let documentmanifest_resource = new DocumentManifest();

    // Return Array
    resolve([documentmanifest_resource]);
  });

module.exports.historyById = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('DocumentManifest >>> historyById');

    // Common search params
    let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } =
      args;

    // Search Result params
    let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } =
      args;

    // Resource Specific params
    let author = args['author'];
    let content_ref = args['content-ref'];
    let created = args['created'];
    let description = args['description'];
    let identifier = args['identifier'];
    let patient = args['patient'];
    let recipient = args['recipient'];
    let related_id = args['related-id'];
    let related_ref = args['related-ref'];
    let source = args['source'];
    let status = args['status'];
    let subject = args['subject'];
    let type = args['type'];

    // TODO: Build query from Parameters

    // TODO: Query database

    let DocumentManifest = getDocumentManifest(base_version);

    // Cast all results to DocumentManifest Class
    let documentmanifest_resource = new DocumentManifest();

    // Return Array
    resolve([documentmanifest_resource]);
  });
