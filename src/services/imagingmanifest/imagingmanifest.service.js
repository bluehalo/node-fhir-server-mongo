/*eslint no-unused-vars: "warn"*/

const { VERSIONS } = require('@asymmetrik/node-fhir-server-core').constants;
const { resolveSchema } = require('@asymmetrik/node-fhir-server-core');
const FHIRServer = require('@asymmetrik/node-fhir-server-core');
const { ObjectID } = require('mongodb');
const logger = require('@asymmetrik/node-fhir-server-core').loggers.get();

let getImagingManifest = (base_version) => {
  return resolveSchema(base_version, 'ImagingManifest');
};

let getMeta = (base_version) => {
  return resolveSchema(base_version, 'Meta');
};

module.exports.search = (args) =>
  new Promise((resolve, reject) => {
    logger.info('ImagingManifest >>> search');

    // Common search params
    let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } =
      args;

    // Search Result params
    let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } =
      args;

    // Resource Specific params
    let author = args['author'];
    let authoring_time = args['authoring-time'];
    let endpoint = args['endpoint'];
    let identifier = args['identifier'];
    let imaging_study = args['imaging-study'];
    let patient = args['patient'];
    let selected_study = args['selected-study'];

    // TODO: Build query from Parameters

    // TODO: Query database

    let ImagingManifest = getImagingManifest(base_version);

    // Cast all results to ImagingManifest Class
    let imagingmanifest_resource = new ImagingManifest();
    // TODO: Set data with constructor or setter methods
    imagingmanifest_resource.id = 'test id';

    // Return Array
    resolve([imagingmanifest_resource]);
  });

module.exports.searchById = (args) =>
  new Promise((resolve, reject) => {
    logger.info('ImagingManifest >>> searchById');

    let { base_version, id } = args;

    let ImagingManifest = getImagingManifest(base_version);

    // TODO: Build query from Parameters

    // TODO: Query database

    // Cast result to ImagingManifest Class
    let imagingmanifest_resource = new ImagingManifest();
    // TODO: Set data with constructor or setter methods
    imagingmanifest_resource.id = 'test id';

    // Return resource class
    // resolve(imagingmanifest_resource);
    resolve();
  });

module.exports.create = (args, { req }) =>
  new Promise((resolve, reject) => {
    logger.info('ImagingManifest >>> create');

    let { base_version, resource } = args;
    // Make sure to use this ID when inserting this resource
    let id = new ObjectID().toString();

    let ImagingManifest = getImagingManifest(base_version);
    let Meta = getMeta(base_version);

    // TODO: determine if client/server sets ID

    // Cast resource to ImagingManifest Class
    let imagingmanifest_resource = new ImagingManifest(resource);
    imagingmanifest_resource.meta = new Meta();
    // TODO: set meta info

    // TODO: save record to database

    // Return Id
    resolve({ id });
  });

module.exports.update = (args, { req }) =>
  new Promise((resolve, reject) => {
    logger.info('ImagingManifest >>> update');

    let { base_version, id, resource } = args;

    let ImagingManifest = getImagingManifest(base_version);
    let Meta = getMeta(base_version);

    // Cast resource to ImagingManifest Class
    let imagingmanifest_resource = new ImagingManifest(resource);
    imagingmanifest_resource.meta = new Meta();
    // TODO: set meta info, increment meta ID

    // TODO: save record to database

    // Return id, if recorded was created or updated, new meta version id
    resolve({
      id: imagingmanifest_resource.id,
      created: false,
      resource_version: imagingmanifest_resource.meta.versionId,
    });
  });

module.exports.remove = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('ImagingManifest >>> remove');

    let { id } = args;

    // TODO: delete record in database (soft/hard)

    // Return number of records deleted
    resolve({ deleted: 0 });
  });

module.exports.searchByVersionId = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('ImagingManifest >>> searchByVersionId');

    let { base_version, id, version_id } = args;

    let ImagingManifest = getImagingManifest(base_version);

    // TODO: Build query from Parameters

    // TODO: Query database

    // Cast result to ImagingManifest Class
    let imagingmanifest_resource = new ImagingManifest();

    // Return resource class
    resolve(imagingmanifest_resource);
  });

module.exports.history = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('ImagingManifest >>> history');

    // Common search params
    let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } =
      args;

    // Search Result params
    let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } =
      args;

    // Resource Specific params
    let author = args['author'];
    let authoring_time = args['authoring-time'];
    let endpoint = args['endpoint'];
    let identifier = args['identifier'];
    let imaging_study = args['imaging-study'];
    let patient = args['patient'];
    let selected_study = args['selected-study'];

    // TODO: Build query from Parameters

    // TODO: Query database

    let ImagingManifest = getImagingManifest(base_version);

    // Cast all results to ImagingManifest Class
    let imagingmanifest_resource = new ImagingManifest();

    // Return Array
    resolve([imagingmanifest_resource]);
  });

module.exports.historyById = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('ImagingManifest >>> historyById');

    // Common search params
    let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } =
      args;

    // Search Result params
    let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } =
      args;

    // Resource Specific params
    let author = args['author'];
    let authoring_time = args['authoring-time'];
    let endpoint = args['endpoint'];
    let identifier = args['identifier'];
    let imaging_study = args['imaging-study'];
    let patient = args['patient'];
    let selected_study = args['selected-study'];

    // TODO: Build query from Parameters

    // TODO: Query database

    let ImagingManifest = getImagingManifest(base_version);

    // Cast all results to ImagingManifest Class
    let imagingmanifest_resource = new ImagingManifest();

    // Return Array
    resolve([imagingmanifest_resource]);
  });
