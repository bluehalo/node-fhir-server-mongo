/*eslint no-unused-vars: "warn"*/

const { VERSIONS } = require('@asymmetrik/node-fhir-server-core').constants;
const { resolveSchema } = require('@asymmetrik/node-fhir-server-core');
const FHIRServer = require('@asymmetrik/node-fhir-server-core');
const { ObjectID } = require('mongodb');
const logger = require('@asymmetrik/node-fhir-server-core').loggers.get();

let getSlot = (base_version) => {
  return resolveSchema(base_version, 'Slot');
};

let getMeta = (base_version) => {
  return resolveSchema(base_version, 'Meta');
};

module.exports.search = (args) =>
  new Promise((resolve, reject) => {
    logger.info('Slot >>> search');

    // Common search params
    let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } =
      args;

    // Search Result params
    let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } =
      args;

    // Resource Specific params
    let identifier = args['identifier'];
    let schedule = args['schedule'];
    let slot_type = args['slot-type'];
    let start = args['start'];
    let status = args['status'];

    // TODO: Build query from Parameters

    // TODO: Query database

    let Slot = getSlot(base_version);

    // Cast all results to Slot Class
    let slot_resource = new Slot();
    // TODO: Set data with constructor or setter methods
    slot_resource.id = 'test id';

    // Return Array
    resolve([slot_resource]);
  });

module.exports.searchById = (args) =>
  new Promise((resolve, reject) => {
    logger.info('Slot >>> searchById');

    let { base_version, id } = args;

    let Slot = getSlot(base_version);

    // TODO: Build query from Parameters

    // TODO: Query database

    // Cast result to Slot Class
    let slot_resource = new Slot();
    // TODO: Set data with constructor or setter methods
    slot_resource.id = 'test id';

    // Return resource class
    // resolve(slot_resource);
    resolve();
  });

module.exports.create = (args, { req }) =>
  new Promise((resolve, reject) => {
    logger.info('Slot >>> create');

    let { base_version, resource } = args;
    // Make sure to use this ID when inserting this resource
    let id = new ObjectID().toString();

    let Slot = getSlot(base_version);
    let Meta = getMeta(base_version);

    // TODO: determine if client/server sets ID

    // Cast resource to Slot Class
    let slot_resource = new Slot(resource);
    slot_resource.meta = new Meta();
    // TODO: set meta info

    // TODO: save record to database

    // Return Id
    resolve({ id });
  });

module.exports.update = (args, { req }) =>
  new Promise((resolve, reject) => {
    logger.info('Slot >>> update');

    let { base_version, id, resource } = args;

    let Slot = getSlot(base_version);
    let Meta = getMeta(base_version);

    // Cast resource to Slot Class
    let slot_resource = new Slot(resource);
    slot_resource.meta = new Meta();
    // TODO: set meta info, increment meta ID

    // TODO: save record to database

    // Return id, if recorded was created or updated, new meta version id
    resolve({
      id: slot_resource.id,
      created: false,
      resource_version: slot_resource.meta.versionId,
    });
  });

module.exports.remove = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('Slot >>> remove');

    let { id } = args;

    // TODO: delete record in database (soft/hard)

    // Return number of records deleted
    resolve({ deleted: 0 });
  });

module.exports.searchByVersionId = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('Slot >>> searchByVersionId');

    let { base_version, id, version_id } = args;

    let Slot = getSlot(base_version);

    // TODO: Build query from Parameters

    // TODO: Query database

    // Cast result to Slot Class
    let slot_resource = new Slot();

    // Return resource class
    resolve(slot_resource);
  });

module.exports.history = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('Slot >>> history');

    // Common search params
    let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } =
      args;

    // Search Result params
    let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } =
      args;

    // Resource Specific params
    let identifier = args['identifier'];
    let schedule = args['schedule'];
    let slot_type = args['slot-type'];
    let start = args['start'];
    let status = args['status'];

    // TODO: Build query from Parameters

    // TODO: Query database

    let Slot = getSlot(base_version);

    // Cast all results to Slot Class
    let slot_resource = new Slot();

    // Return Array
    resolve([slot_resource]);
  });

module.exports.historyById = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('Slot >>> historyById');

    // Common search params
    let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } =
      args;

    // Search Result params
    let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } =
      args;

    // Resource Specific params
    let identifier = args['identifier'];
    let schedule = args['schedule'];
    let slot_type = args['slot-type'];
    let start = args['start'];
    let status = args['status'];

    // TODO: Build query from Parameters

    // TODO: Query database

    let Slot = getSlot(base_version);

    // Cast all results to Slot Class
    let slot_resource = new Slot();

    // Return Array
    resolve([slot_resource]);
  });
