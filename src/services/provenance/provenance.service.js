/*eslint no-unused-vars: "warn"*/

const { VERSIONS } = require('@asymmetrik/node-fhir-server-core').constants;
const { resolveSchema } = require('@asymmetrik/node-fhir-server-core');
const FHIRServer = require('@asymmetrik/node-fhir-server-core');
const { ObjectID } = require('mongodb');
const logger = require('@asymmetrik/node-fhir-server-core').loggers.get();

let getProvenance = (base_version) => {
  return resolveSchema(base_version, 'Provenance');
};

let getMeta = (base_version) => {
  return resolveSchema(base_version, 'Meta');
};

module.exports.search = (args) =>
  new Promise((resolve, reject) => {
    logger.info('Provenance >>> search');

    // Common search params
    let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } =
      args;

    // Search Result params
    let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } =
      args;

    // Resource Specific params
    let agent = args['agent'];
    let agent_role = args['agent-role'];
    let end = args['end'];
    let entity_id = args['entity-id'];
    let entity_ref = args['entity-ref'];
    let location = args['location'];
    let patient = args['patient'];
    let recorded = args['recorded'];
    let signature_type = args['signature-type'];
    let start = args['start'];
    let target = args['target'];

    // TODO: Build query from Parameters

    // TODO: Query database

    let Provenance = getProvenance(base_version);

    // Cast all results to Provenance Class
    let provenance_resource = new Provenance();
    // TODO: Set data with constructor or setter methods
    provenance_resource.id = 'test id';

    // Return Array
    resolve([provenance_resource]);
  });

module.exports.searchById = (args) =>
  new Promise((resolve, reject) => {
    logger.info('Provenance >>> searchById');

    let { base_version, id } = args;

    let Provenance = getProvenance(base_version);

    // TODO: Build query from Parameters

    // TODO: Query database

    // Cast result to Provenance Class
    let provenance_resource = new Provenance();
    // TODO: Set data with constructor or setter methods
    provenance_resource.id = 'test id';

    // Return resource class
    // resolve(provenance_resource);
    resolve();
  });

module.exports.create = (args, { req }) =>
  new Promise((resolve, reject) => {
    logger.info('Provenance >>> create');

    let { base_version, resource } = args;
    // Make sure to use this ID when inserting this resource
    let id = new ObjectID().toString();

    let Provenance = getProvenance(base_version);
    let Meta = getMeta(base_version);

    // TODO: determine if client/server sets ID

    // Cast resource to Provenance Class
    let provenance_resource = new Provenance(resource);
    provenance_resource.meta = new Meta();
    // TODO: set meta info

    // TODO: save record to database

    // Return Id
    resolve({ id });
  });

module.exports.update = (args, { req }) =>
  new Promise((resolve, reject) => {
    logger.info('Provenance >>> update');

    let { base_version, id, resource } = args;

    let Provenance = getProvenance(base_version);
    let Meta = getMeta(base_version);

    // Cast resource to Provenance Class
    let provenance_resource = new Provenance(resource);
    provenance_resource.meta = new Meta();
    // TODO: set meta info, increment meta ID

    // TODO: save record to database

    // Return id, if recorded was created or updated, new meta version id
    resolve({
      id: provenance_resource.id,
      created: false,
      resource_version: provenance_resource.meta.versionId,
    });
  });

module.exports.remove = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('Provenance >>> remove');

    let { id } = args;

    // TODO: delete record in database (soft/hard)

    // Return number of records deleted
    resolve({ deleted: 0 });
  });

module.exports.searchByVersionId = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('Provenance >>> searchByVersionId');

    let { base_version, id, version_id } = args;

    let Provenance = getProvenance(base_version);

    // TODO: Build query from Parameters

    // TODO: Query database

    // Cast result to Provenance Class
    let provenance_resource = new Provenance();

    // Return resource class
    resolve(provenance_resource);
  });

module.exports.history = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('Provenance >>> history');

    // Common search params
    let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } =
      args;

    // Search Result params
    let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } =
      args;

    // Resource Specific params
    let agent = args['agent'];
    let agent_role = args['agent-role'];
    let end = args['end'];
    let entity_id = args['entity-id'];
    let entity_ref = args['entity-ref'];
    let location = args['location'];
    let patient = args['patient'];
    let recorded = args['recorded'];
    let signature_type = args['signature-type'];
    let start = args['start'];
    let target = args['target'];

    // TODO: Build query from Parameters

    // TODO: Query database

    let Provenance = getProvenance(base_version);

    // Cast all results to Provenance Class
    let provenance_resource = new Provenance();

    // Return Array
    resolve([provenance_resource]);
  });

module.exports.historyById = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('Provenance >>> historyById');

    // Common search params
    let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } =
      args;

    // Search Result params
    let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } =
      args;

    // Resource Specific params
    let agent = args['agent'];
    let agent_role = args['agent-role'];
    let end = args['end'];
    let entity_id = args['entity-id'];
    let entity_ref = args['entity-ref'];
    let location = args['location'];
    let patient = args['patient'];
    let recorded = args['recorded'];
    let signature_type = args['signature-type'];
    let start = args['start'];
    let target = args['target'];

    // TODO: Build query from Parameters

    // TODO: Query database

    let Provenance = getProvenance(base_version);

    // Cast all results to Provenance Class
    let provenance_resource = new Provenance();

    // Return Array
    resolve([provenance_resource]);
  });
