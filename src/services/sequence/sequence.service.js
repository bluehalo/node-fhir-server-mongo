/*eslint no-unused-vars: "warn"*/

const { VERSIONS } = require('@asymmetrik/node-fhir-server-core').constants;
const { resolveSchema } = require('@asymmetrik/node-fhir-server-core');
const FHIRServer = require('@asymmetrik/node-fhir-server-core');
const { ObjectID } = require('mongodb');
const logger = require('@asymmetrik/node-fhir-server-core').loggers.get();

let getSequence = (base_version) => {
  return resolveSchema(base_version, 'Sequence');
};

let getMeta = (base_version) => {
  return resolveSchema(base_version, 'Meta');
};

module.exports.search = (args) =>
  new Promise((resolve, reject) => {
    logger.info('Sequence >>> search');

    // Common search params
    let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } =
      args;

    // Search Result params
    let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } =
      args;

    // Resource Specific params
    let chromosome = args['chromosome'];
    let coordinate = args['coordinate'];
    let end = args['end'];
    let identifier = args['identifier'];
    let patient = args['patient'];
    let start = args['start'];
    let type = args['type'];

    // TODO: Build query from Parameters

    // TODO: Query database

    let Sequence = getSequence(base_version);

    // Cast all results to Sequence Class
    let sequence_resource = new Sequence();
    // TODO: Set data with constructor or setter methods
    sequence_resource.id = 'test id';

    // Return Array
    resolve([sequence_resource]);
  });

module.exports.searchById = (args) =>
  new Promise((resolve, reject) => {
    logger.info('Sequence >>> searchById');

    let { base_version, id } = args;

    let Sequence = getSequence(base_version);

    // TODO: Build query from Parameters

    // TODO: Query database

    // Cast result to Sequence Class
    let sequence_resource = new Sequence();
    // TODO: Set data with constructor or setter methods
    sequence_resource.id = 'test id';

    // Return resource class
    // resolve(sequence_resource);
    resolve();
  });

module.exports.create = (args, { req }) =>
  new Promise((resolve, reject) => {
    logger.info('Sequence >>> create');

    let { base_version, resource } = args;
    // Make sure to use this ID when inserting this resource
    let id = new ObjectID().toString();

    let Sequence = getSequence(base_version);
    let Meta = getMeta(base_version);

    // TODO: determine if client/server sets ID

    // Cast resource to Sequence Class
    let sequence_resource = new Sequence(resource);
    sequence_resource.meta = new Meta();
    // TODO: set meta info

    // TODO: save record to database

    // Return Id
    resolve({ id });
  });

module.exports.update = (args, { req }) =>
  new Promise((resolve, reject) => {
    logger.info('Sequence >>> update');

    let { base_version, id, resource } = args;

    let Sequence = getSequence(base_version);
    let Meta = getMeta(base_version);

    // Cast resource to Sequence Class
    let sequence_resource = new Sequence(resource);
    sequence_resource.meta = new Meta();
    // TODO: set meta info, increment meta ID

    // TODO: save record to database

    // Return id, if recorded was created or updated, new meta version id
    resolve({
      id: sequence_resource.id,
      created: false,
      resource_version: sequence_resource.meta.versionId,
    });
  });

module.exports.remove = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('Sequence >>> remove');

    let { id } = args;

    // TODO: delete record in database (soft/hard)

    // Return number of records deleted
    resolve({ deleted: 0 });
  });

module.exports.searchByVersionId = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('Sequence >>> searchByVersionId');

    let { base_version, id, version_id } = args;

    let Sequence = getSequence(base_version);

    // TODO: Build query from Parameters

    // TODO: Query database

    // Cast result to Sequence Class
    let sequence_resource = new Sequence();

    // Return resource class
    resolve(sequence_resource);
  });

module.exports.history = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('Sequence >>> history');

    // Common search params
    let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } =
      args;

    // Search Result params
    let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } =
      args;

    // Resource Specific params
    let chromosome = args['chromosome'];
    let coordinate = args['coordinate'];
    let end = args['end'];
    let identifier = args['identifier'];
    let patient = args['patient'];
    let start = args['start'];
    let type = args['type'];

    // TODO: Build query from Parameters

    // TODO: Query database

    let Sequence = getSequence(base_version);

    // Cast all results to Sequence Class
    let sequence_resource = new Sequence();

    // Return Array
    resolve([sequence_resource]);
  });

module.exports.historyById = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('Sequence >>> historyById');

    // Common search params
    let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } =
      args;

    // Search Result params
    let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } =
      args;

    // Resource Specific params
    let chromosome = args['chromosome'];
    let coordinate = args['coordinate'];
    let end = args['end'];
    let identifier = args['identifier'];
    let patient = args['patient'];
    let start = args['start'];
    let type = args['type'];

    // TODO: Build query from Parameters

    // TODO: Query database

    let Sequence = getSequence(base_version);

    // Cast all results to Sequence Class
    let sequence_resource = new Sequence();

    // Return Array
    resolve([sequence_resource]);
  });
