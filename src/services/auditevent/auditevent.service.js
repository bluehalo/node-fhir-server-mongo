/*eslint no-unused-vars: "warn"*/

const { VERSIONS } = require('@asymmetrik/node-fhir-server-core').constants;
const { resolveSchema } = require('@asymmetrik/node-fhir-server-core');
const FHIRServer = require('@asymmetrik/node-fhir-server-core');
const { ObjectID } = require('mongodb');
const logger = require('@asymmetrik/node-fhir-server-core').loggers.get();

let getAuditEvent = (base_version) => {
  return resolveSchema(base_version, 'AuditEvent');
};

let getMeta = (base_version) => {
  return resolveSchema(base_version, 'Meta');
};

module.exports.search = (args) =>
  new Promise((resolve, reject) => {
    logger.info('AuditEvent >>> search');

    // Common search params
    let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } =
      args;

    // Search Result params
    let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } =
      args;

    // Resource Specific params
    let action = args['action'];
    let address = args['address'];
    let agent = args['agent'];
    let agent_name = args['agent-name'];
    let agent_role = args['agent-role'];
    let altid = args['altid'];
    let date = args['date'];
    let entity = args['entity'];
    let entity_id = args['entity-id'];
    let entity_name = args['entity-name'];
    let entity_role = args['entity-role'];
    let entity_type = args['entity-type'];
    let outcome = args['outcome'];
    let patient = args['patient'];
    let policy = args['policy'];
    let site = args['site'];
    let source = args['source'];
    let subtype = args['subtype'];
    let type = args['type'];
    let user = args['user'];

    // TODO: Build query from Parameters

    // TODO: Query database

    let AuditEvent = getAuditEvent(base_version);

    // Cast all results to AuditEvent Class
    let auditevent_resource = new AuditEvent();
    // TODO: Set data with constructor or setter methods
    auditevent_resource.id = 'test id';

    // Return Array
    resolve([auditevent_resource]);
  });

module.exports.searchById = (args) =>
  new Promise((resolve, reject) => {
    logger.info('AuditEvent >>> searchById');

    let { base_version, id } = args;

    let AuditEvent = getAuditEvent(base_version);

    // TODO: Build query from Parameters

    // TODO: Query database

    // Cast result to AuditEvent Class
    let auditevent_resource = new AuditEvent();
    // TODO: Set data with constructor or setter methods
    auditevent_resource.id = 'test id';

    // Return resource class
    // resolve(auditevent_resource);
    resolve();
  });

module.exports.create = (args, { req }) =>
  new Promise((resolve, reject) => {
    logger.info('AuditEvent >>> create');

    let { base_version, resource } = args;
    // Make sure to use this ID when inserting this resource
    let id = new ObjectID().toString();

    let AuditEvent = getAuditEvent(base_version);
    let Meta = getMeta(base_version);

    // TODO: determine if client/server sets ID

    // Cast resource to AuditEvent Class
    let auditevent_resource = new AuditEvent(resource);
    auditevent_resource.meta = new Meta();
    // TODO: set meta info

    // TODO: save record to database

    // Return Id
    resolve({ id });
  });

module.exports.update = (args, { req }) =>
  new Promise((resolve, reject) => {
    logger.info('AuditEvent >>> update');

    let { base_version, id, resource } = args;

    let AuditEvent = getAuditEvent(base_version);
    let Meta = getMeta(base_version);

    // Cast resource to AuditEvent Class
    let auditevent_resource = new AuditEvent(resource);
    auditevent_resource.meta = new Meta();
    // TODO: set meta info, increment meta ID

    // TODO: save record to database

    // Return id, if recorded was created or updated, new meta version id
    resolve({
      id: auditevent_resource.id,
      created: false,
      resource_version: auditevent_resource.meta.versionId,
    });
  });

module.exports.remove = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('AuditEvent >>> remove');

    let { id } = args;

    // TODO: delete record in database (soft/hard)

    // Return number of records deleted
    resolve({ deleted: 0 });
  });

module.exports.searchByVersionId = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('AuditEvent >>> searchByVersionId');

    let { base_version, id, version_id } = args;

    let AuditEvent = getAuditEvent(base_version);

    // TODO: Build query from Parameters

    // TODO: Query database

    // Cast result to AuditEvent Class
    let auditevent_resource = new AuditEvent();

    // Return resource class
    resolve(auditevent_resource);
  });

module.exports.history = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('AuditEvent >>> history');

    // Common search params
    let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } =
      args;

    // Search Result params
    let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } =
      args;

    // Resource Specific params
    let action = args['action'];
    let address = args['address'];
    let agent = args['agent'];
    let agent_name = args['agent-name'];
    let agent_role = args['agent-role'];
    let altid = args['altid'];
    let date = args['date'];
    let entity = args['entity'];
    let entity_id = args['entity-id'];
    let entity_name = args['entity-name'];
    let entity_role = args['entity-role'];
    let entity_type = args['entity-type'];
    let outcome = args['outcome'];
    let patient = args['patient'];
    let policy = args['policy'];
    let site = args['site'];
    let source = args['source'];
    let subtype = args['subtype'];
    let type = args['type'];
    let user = args['user'];

    // TODO: Build query from Parameters

    // TODO: Query database

    let AuditEvent = getAuditEvent(base_version);

    // Cast all results to AuditEvent Class
    let auditevent_resource = new AuditEvent();

    // Return Array
    resolve([auditevent_resource]);
  });

module.exports.historyById = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('AuditEvent >>> historyById');

    // Common search params
    let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } =
      args;

    // Search Result params
    let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } =
      args;

    // Resource Specific params
    let action = args['action'];
    let address = args['address'];
    let agent = args['agent'];
    let agent_name = args['agent-name'];
    let agent_role = args['agent-role'];
    let altid = args['altid'];
    let date = args['date'];
    let entity = args['entity'];
    let entity_id = args['entity-id'];
    let entity_name = args['entity-name'];
    let entity_role = args['entity-role'];
    let entity_type = args['entity-type'];
    let outcome = args['outcome'];
    let patient = args['patient'];
    let policy = args['policy'];
    let site = args['site'];
    let source = args['source'];
    let subtype = args['subtype'];
    let type = args['type'];
    let user = args['user'];

    // TODO: Build query from Parameters

    // TODO: Query database

    let AuditEvent = getAuditEvent(base_version);

    // Cast all results to AuditEvent Class
    let auditevent_resource = new AuditEvent();

    // Return Array
    resolve([auditevent_resource]);
  });
