/*eslint no-unused-vars: "warn"*/

const { VERSIONS } = require('@asymmetrik/node-fhir-server-core').constants;
const { resolveSchema } = require('@asymmetrik/node-fhir-server-core');
const FHIRServer = require('@asymmetrik/node-fhir-server-core');
const { ObjectID } = require('mongodb');
const logger = require('@asymmetrik/node-fhir-server-core').loggers.get();

let getAdverseEvent = (base_version) => {
  return resolveSchema(base_version, 'AdverseEvent');
};

let getMeta = (base_version) => {
  return resolveSchema(base_version, 'Meta');
};

module.exports.search = (args) =>
  new Promise((resolve, reject) => {
    logger.info('AdverseEvent >>> search');

    // Common search params
    let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } =
      args;

    // Search Result params
    let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } =
      args;

    // Resource Specific params
    let category = args['category'];
    let date = args['date'];
    let location = args['location'];
    let reaction = args['reaction'];
    let recorder = args['recorder'];
    let seriousness = args['seriousness'];
    let study = args['study'];
    let subject = args['subject'];
    let substance = args['substance'];
    let type = args['type'];

    // TODO: Build query from Parameters

    // TODO: Query database

    let AdverseEvent = getAdverseEvent(base_version);

    // Cast all results to AdverseEvent Class
    let adverseevent_resource = new AdverseEvent();
    // TODO: Set data with constructor or setter methods
    adverseevent_resource.id = 'test id';

    // Return Array
    resolve([adverseevent_resource]);
  });

module.exports.searchById = (args) =>
  new Promise((resolve, reject) => {
    logger.info('AdverseEvent >>> searchById');

    let { base_version, id } = args;

    let AdverseEvent = getAdverseEvent(base_version);

    // TODO: Build query from Parameters

    // TODO: Query database

    // Cast result to AdverseEvent Class
    let adverseevent_resource = new AdverseEvent();
    // TODO: Set data with constructor or setter methods
    adverseevent_resource.id = 'test id';

    // Return resource class
    // resolve(adverseevent_resource);
    resolve();
  });

module.exports.create = (args, { req }) =>
  new Promise((resolve, reject) => {
    logger.info('AdverseEvent >>> create');

    let { base_version, resource } = args;
    // Make sure to use this ID when inserting this resource
    let id = new ObjectID().toString();

    let AdverseEvent = getAdverseEvent(base_version);
    let Meta = getMeta(base_version);

    // TODO: determine if client/server sets ID

    // Cast resource to AdverseEvent Class
    let adverseevent_resource = new AdverseEvent(resource);
    adverseevent_resource.meta = new Meta();
    // TODO: set meta info

    // TODO: save record to database

    // Return Id
    resolve({ id });
  });

module.exports.update = (args, { req }) =>
  new Promise((resolve, reject) => {
    logger.info('AdverseEvent >>> update');

    let { base_version, id, resource } = args;

    let AdverseEvent = getAdverseEvent(base_version);
    let Meta = getMeta(base_version);

    // Cast resource to AdverseEvent Class
    let adverseevent_resource = new AdverseEvent(resource);
    adverseevent_resource.meta = new Meta();
    // TODO: set meta info, increment meta ID

    // TODO: save record to database

    // Return id, if recorded was created or updated, new meta version id
    resolve({
      id: adverseevent_resource.id,
      created: false,
      resource_version: adverseevent_resource.meta.versionId,
    });
  });

module.exports.remove = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('AdverseEvent >>> remove');

    let { id } = args;

    // TODO: delete record in database (soft/hard)

    // Return number of records deleted
    resolve({ deleted: 0 });
  });

module.exports.searchByVersionId = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('AdverseEvent >>> searchByVersionId');

    let { base_version, id, version_id } = args;

    let AdverseEvent = getAdverseEvent(base_version);

    // TODO: Build query from Parameters

    // TODO: Query database

    // Cast result to AdverseEvent Class
    let adverseevent_resource = new AdverseEvent();

    // Return resource class
    resolve(adverseevent_resource);
  });

module.exports.history = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('AdverseEvent >>> history');

    // Common search params
    let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } =
      args;

    // Search Result params
    let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } =
      args;

    // Resource Specific params
    let category = args['category'];
    let date = args['date'];
    let location = args['location'];
    let reaction = args['reaction'];
    let recorder = args['recorder'];
    let seriousness = args['seriousness'];
    let study = args['study'];
    let subject = args['subject'];
    let substance = args['substance'];
    let type = args['type'];

    // TODO: Build query from Parameters

    // TODO: Query database

    let AdverseEvent = getAdverseEvent(base_version);

    // Cast all results to AdverseEvent Class
    let adverseevent_resource = new AdverseEvent();

    // Return Array
    resolve([adverseevent_resource]);
  });

module.exports.historyById = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('AdverseEvent >>> historyById');

    // Common search params
    let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } =
      args;

    // Search Result params
    let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } =
      args;

    // Resource Specific params
    let category = args['category'];
    let date = args['date'];
    let location = args['location'];
    let reaction = args['reaction'];
    let recorder = args['recorder'];
    let seriousness = args['seriousness'];
    let study = args['study'];
    let subject = args['subject'];
    let substance = args['substance'];
    let type = args['type'];

    // TODO: Build query from Parameters

    // TODO: Query database

    let AdverseEvent = getAdverseEvent(base_version);

    // Cast all results to AdverseEvent Class
    let adverseevent_resource = new AdverseEvent();

    // Return Array
    resolve([adverseevent_resource]);
  });
