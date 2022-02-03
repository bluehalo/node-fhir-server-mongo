/*eslint no-unused-vars: "warn"*/

const { VERSIONS } = require('@asymmetrik/node-fhir-server-core').constants;
const { resolveSchema } = require('@asymmetrik/node-fhir-server-core');
const FHIRServer = require('@asymmetrik/node-fhir-server-core');
const { ObjectID } = require('mongodb');
const logger = require('@asymmetrik/node-fhir-server-core').loggers.get();

let getSpecimen = (base_version) => {
  return resolveSchema(base_version, 'Specimen');
};

let getMeta = (base_version) => {
  return resolveSchema(base_version, 'Meta');
};

module.exports.search = (args) =>
  new Promise((resolve, reject) => {
    logger.info('Specimen >>> search');

    // Common search params
    let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } =
      args;

    // Search Result params
    let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } =
      args;

    // Resource Specific params
    let accession = args['accession'];
    let bodysite = args['bodysite'];
    let collected = args['collected'];
    let collector = args['collector'];
    let container = args['container'];
    let container_id = args['container-id'];
    let identifier = args['identifier'];
    let parent = args['parent'];
    let patient = args['patient'];
    let status = args['status'];
    let subject = args['subject'];
    let type = args['type'];

    // TODO: Build query from Parameters

    // TODO: Query database

    let Specimen = getSpecimen(base_version);

    // Cast all results to Specimen Class
    let specimen_resource = new Specimen();
    // TODO: Set data with constructor or setter methods
    specimen_resource.id = 'test id';

    // Return Array
    resolve([specimen_resource]);
  });

module.exports.searchById = (args) =>
  new Promise((resolve, reject) => {
    logger.info('Specimen >>> searchById');

    let { base_version, id } = args;

    let Specimen = getSpecimen(base_version);

    // TODO: Build query from Parameters

    // TODO: Query database

    // Cast result to Specimen Class
    let specimen_resource = new Specimen();
    // TODO: Set data with constructor or setter methods
    specimen_resource.id = 'test id';

    // Return resource class
    // resolve(specimen_resource);
    resolve();
  });

module.exports.create = (args, { req }) =>
  new Promise((resolve, reject) => {
    logger.info('Specimen >>> create');

    let { base_version, resource } = args;
    // Make sure to use this ID when inserting this resource
    let id = new ObjectID().toString();

    let Specimen = getSpecimen(base_version);
    let Meta = getMeta(base_version);

    // TODO: determine if client/server sets ID

    // Cast resource to Specimen Class
    let specimen_resource = new Specimen(resource);
    specimen_resource.meta = new Meta();
    // TODO: set meta info

    // TODO: save record to database

    // Return Id
    resolve({ id });
  });

module.exports.update = (args, { req }) =>
  new Promise((resolve, reject) => {
    logger.info('Specimen >>> update');

    let { base_version, id, resource } = args;

    let Specimen = getSpecimen(base_version);
    let Meta = getMeta(base_version);

    // Cast resource to Specimen Class
    let specimen_resource = new Specimen(resource);
    specimen_resource.meta = new Meta();
    // TODO: set meta info, increment meta ID

    // TODO: save record to database

    // Return id, if recorded was created or updated, new meta version id
    resolve({
      id: specimen_resource.id,
      created: false,
      resource_version: specimen_resource.meta.versionId,
    });
  });

module.exports.remove = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('Specimen >>> remove');

    let { id } = args;

    // TODO: delete record in database (soft/hard)

    // Return number of records deleted
    resolve({ deleted: 0 });
  });

module.exports.searchByVersionId = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('Specimen >>> searchByVersionId');

    let { base_version, id, version_id } = args;

    let Specimen = getSpecimen(base_version);

    // TODO: Build query from Parameters

    // TODO: Query database

    // Cast result to Specimen Class
    let specimen_resource = new Specimen();

    // Return resource class
    resolve(specimen_resource);
  });

module.exports.history = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('Specimen >>> history');

    // Common search params
    let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } =
      args;

    // Search Result params
    let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } =
      args;

    // Resource Specific params
    let accession = args['accession'];
    let bodysite = args['bodysite'];
    let collected = args['collected'];
    let collector = args['collector'];
    let container = args['container'];
    let container_id = args['container-id'];
    let identifier = args['identifier'];
    let parent = args['parent'];
    let patient = args['patient'];
    let status = args['status'];
    let subject = args['subject'];
    let type = args['type'];

    // TODO: Build query from Parameters

    // TODO: Query database

    let Specimen = getSpecimen(base_version);

    // Cast all results to Specimen Class
    let specimen_resource = new Specimen();

    // Return Array
    resolve([specimen_resource]);
  });

module.exports.historyById = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('Specimen >>> historyById');

    // Common search params
    let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } =
      args;

    // Search Result params
    let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } =
      args;

    // Resource Specific params
    let accession = args['accession'];
    let bodysite = args['bodysite'];
    let collected = args['collected'];
    let collector = args['collector'];
    let container = args['container'];
    let container_id = args['container-id'];
    let identifier = args['identifier'];
    let parent = args['parent'];
    let patient = args['patient'];
    let status = args['status'];
    let subject = args['subject'];
    let type = args['type'];

    // TODO: Build query from Parameters

    // TODO: Query database

    let Specimen = getSpecimen(base_version);

    // Cast all results to Specimen Class
    let specimen_resource = new Specimen();

    // Return Array
    resolve([specimen_resource]);
  });
