/*eslint no-unused-vars: "warn"*/

const { VERSIONS } = require('@asymmetrik/node-fhir-server-core').constants;
const { resolveSchema } = require('@asymmetrik/node-fhir-server-core');
const FHIRServer = require('@asymmetrik/node-fhir-server-core');
const { ObjectID } = require('mongodb');
const logger = require('@asymmetrik/node-fhir-server-core').loggers.get();

let getImagingStudy = (base_version) => {
  return resolveSchema(base_version, 'ImagingStudy');
};

let getMeta = (base_version) => {
  return resolveSchema(base_version, 'Meta');
};

module.exports.search = (args) =>
  new Promise((resolve, reject) => {
    logger.info('ImagingStudy >>> search');

    // Common search params
    let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } =
      args;

    // Search Result params
    let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } =
      args;

    // Resource Specific params
    let accession = args['accession'];
    let basedon = args['basedon'];
    let bodysite = args['bodysite'];
    let _context = args['_context'];
    let dicom_class = args['dicom-class'];
    let endpoint = args['endpoint'];
    let identifier = args['identifier'];
    let modality = args['modality'];
    let patient = args['patient'];
    let performer = args['performer'];
    let reason = args['reason'];
    let series = args['series'];
    let started = args['started'];
    let study = args['study'];
    let uid = args['uid'];

    // TODO: Build query from Parameters

    // TODO: Query database

    let ImagingStudy = getImagingStudy(base_version);

    // Cast all results to ImagingStudy Class
    let imagingstudy_resource = new ImagingStudy();
    // TODO: Set data with constructor or setter methods
    imagingstudy_resource.id = 'test id';

    // Return Array
    resolve([imagingstudy_resource]);
  });

module.exports.searchById = (args) =>
  new Promise((resolve, reject) => {
    logger.info('ImagingStudy >>> searchById');

    let { base_version, id } = args;

    let ImagingStudy = getImagingStudy(base_version);

    // TODO: Build query from Parameters

    // TODO: Query database

    // Cast result to ImagingStudy Class
    let imagingstudy_resource = new ImagingStudy();
    // TODO: Set data with constructor or setter methods
    imagingstudy_resource.id = 'test id';

    // Return resource class
    // resolve(imagingstudy_resource);
    resolve();
  });

module.exports.create = (args, { req }) =>
  new Promise((resolve, reject) => {
    logger.info('ImagingStudy >>> create');

    let { base_version, resource } = args;
    // Make sure to use this ID when inserting this resource
    let id = new ObjectID().toString();

    let ImagingStudy = getImagingStudy(base_version);
    let Meta = getMeta(base_version);

    // TODO: determine if client/server sets ID

    // Cast resource to ImagingStudy Class
    let imagingstudy_resource = new ImagingStudy(resource);
    imagingstudy_resource.meta = new Meta();
    // TODO: set meta info

    // TODO: save record to database

    // Return Id
    resolve({ id });
  });

module.exports.update = (args, { req }) =>
  new Promise((resolve, reject) => {
    logger.info('ImagingStudy >>> update');

    let { base_version, id, resource } = args;

    let ImagingStudy = getImagingStudy(base_version);
    let Meta = getMeta(base_version);

    // Cast resource to ImagingStudy Class
    let imagingstudy_resource = new ImagingStudy(resource);
    imagingstudy_resource.meta = new Meta();
    // TODO: set meta info, increment meta ID

    // TODO: save record to database

    // Return id, if recorded was created or updated, new meta version id
    resolve({
      id: imagingstudy_resource.id,
      created: false,
      resource_version: imagingstudy_resource.meta.versionId,
    });
  });

module.exports.remove = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('ImagingStudy >>> remove');

    let { id } = args;

    // TODO: delete record in database (soft/hard)

    // Return number of records deleted
    resolve({ deleted: 0 });
  });

module.exports.searchByVersionId = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('ImagingStudy >>> searchByVersionId');

    let { base_version, id, version_id } = args;

    let ImagingStudy = getImagingStudy(base_version);

    // TODO: Build query from Parameters

    // TODO: Query database

    // Cast result to ImagingStudy Class
    let imagingstudy_resource = new ImagingStudy();

    // Return resource class
    resolve(imagingstudy_resource);
  });

module.exports.history = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('ImagingStudy >>> history');

    // Common search params
    let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } =
      args;

    // Search Result params
    let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } =
      args;

    // Resource Specific params
    let accession = args['accession'];
    let basedon = args['basedon'];
    let bodysite = args['bodysite'];
    let _context = args['_context'];
    let dicom_class = args['dicom-class'];
    let endpoint = args['endpoint'];
    let identifier = args['identifier'];
    let modality = args['modality'];
    let patient = args['patient'];
    let performer = args['performer'];
    let reason = args['reason'];
    let series = args['series'];
    let started = args['started'];
    let study = args['study'];
    let uid = args['uid'];

    // TODO: Build query from Parameters

    // TODO: Query database

    let ImagingStudy = getImagingStudy(base_version);

    // Cast all results to ImagingStudy Class
    let imagingstudy_resource = new ImagingStudy();

    // Return Array
    resolve([imagingstudy_resource]);
  });

module.exports.historyById = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('ImagingStudy >>> historyById');

    // Common search params
    let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } =
      args;

    // Search Result params
    let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } =
      args;

    // Resource Specific params
    let accession = args['accession'];
    let basedon = args['basedon'];
    let bodysite = args['bodysite'];
    let _context = args['_context'];
    let dicom_class = args['dicom-class'];
    let endpoint = args['endpoint'];
    let identifier = args['identifier'];
    let modality = args['modality'];
    let patient = args['patient'];
    let performer = args['performer'];
    let reason = args['reason'];
    let series = args['series'];
    let started = args['started'];
    let study = args['study'];
    let uid = args['uid'];

    // TODO: Build query from Parameters

    // TODO: Query database

    let ImagingStudy = getImagingStudy(base_version);

    // Cast all results to ImagingStudy Class
    let imagingstudy_resource = new ImagingStudy();

    // Return Array
    resolve([imagingstudy_resource]);
  });
