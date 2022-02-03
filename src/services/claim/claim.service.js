/*eslint no-unused-vars: "warn"*/

const { VERSIONS } = require('@asymmetrik/node-fhir-server-core').constants;
const { resolveSchema } = require('@asymmetrik/node-fhir-server-core');
const FHIRServer = require('@asymmetrik/node-fhir-server-core');

const { ObjectID } = require('mongodb');
const logger = require('@asymmetrik/node-fhir-server-core').loggers.get();

let getClaim = (base_version) => {
  return resolveSchema(base_version, 'Claim');
};

let getMeta = (base_version) => {
  return resolveSchema(base_version, 'Meta');
};

module.exports.search = (args) =>
  new Promise((resolve, reject) => {
    logger.info('Claim >>> search');

    // Common search params
    let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } =
      args;

    // Search Result params
    let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } =
      args;

    // Resource Specific params
    let care_team = args['care-team'];
    let created = args['created'];
    let encounter = args['encounter'];
    let enterer = args['enterer'];
    let facility = args['facility'];
    let identifier = args['identifier'];
    let insurer = args['insurer'];
    let organization = args['organization'];
    let patient = args['patient'];
    let payee = args['payee'];
    let priority = args['priority'];
    let provider = args['provider'];
    let use = args['use'];

    // TODO: Build query from Parameters

    // TODO: Query database

    let Claim = getClaim(base_version);

    // Cast all results to Claim Class
    let claim_resource = new Claim();
    // TODO: Set data with constructor or setter methods
    claim_resource.id = 'test id';

    // Return Array
    resolve([claim_resource]);
  });

module.exports.searchById = (args) =>
  new Promise((resolve, reject) => {
    logger.info('Claim >>> searchById');

    let { base_version, id } = args;

    let Claim = getClaim(base_version);

    // TODO: Build query from Parameters

    // TODO: Query database

    // Cast result to Claim Class
    let claim_resource = new Claim();
    // TODO: Set data with constructor or setter methods
    claim_resource.id = 'test id';

    // Return resource class
    // resolve(claim_resource);
    resolve();
  });

module.exports.create = (args, { req }) =>
  new Promise((resolve, reject) => {
    logger.info('Claim >>> create');

    let { base_version, resource } = args;
    // Make sure to use this ID when inserting this resource
    let id = new ObjectID().toString();

    let Claim = getClaim(base_version);
    let Meta = getMeta(base_version);

    // TODO: determine if client/server sets ID

    // Cast resource to Claim Class
    let claim_resource = new Claim(resource);
    claim_resource.meta = new Meta();
    // TODO: set meta info

    // TODO: save record to database

    // Return Id
    resolve({ id });
  });

module.exports.update = (args, { req }) =>
  new Promise((resolve, reject) => {
    logger.info('Claim >>> update');

    let { base_version, id, resource } = args;

    let Claim = getClaim(base_version);
    let Meta = getMeta(base_version);

    // Cast resource to Claim Class
    let claim_resource = new Claim(resource);
    claim_resource.meta = new Meta();
    // TODO: set meta info, increment meta ID

    // TODO: save record to database

    // Return id, if recorded was created or updated, new meta version id
    resolve({
      id: claim_resource.id,
      created: false,
      resource_version: claim_resource.meta.versionId,
    });
  });

module.exports.remove = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('Claim >>> remove');

    let { id } = args;

    // TODO: delete record in database (soft/hard)

    // Return number of records deleted
    resolve({ deleted: 0 });
  });

module.exports.searchByVersionId = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('Claim >>> searchByVersionId');

    let { base_version, id, version_id } = args;

    let Claim = getClaim(base_version);

    // TODO: Build query from Parameters

    // TODO: Query database

    // Cast result to Claim Class
    let claim_resource = new Claim();

    // Return resource class
    resolve(claim_resource);
  });

module.exports.history = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('Claim >>> history');

    // Common search params
    let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } =
      args;

    // Search Result params
    let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } =
      args;

    // Resource Specific params
    let care_team = args['care-team'];
    let created = args['created'];
    let encounter = args['encounter'];
    let enterer = args['enterer'];
    let facility = args['facility'];
    let identifier = args['identifier'];
    let insurer = args['insurer'];
    let organization = args['organization'];
    let patient = args['patient'];
    let payee = args['payee'];
    let priority = args['priority'];
    let provider = args['provider'];
    let use = args['use'];

    // TODO: Build query from Parameters

    // TODO: Query database

    let Claim = getClaim(base_version);

    // Cast all results to Claim Class
    let claim_resource = new Claim();

    // Return Array
    resolve([claim_resource]);
  });

module.exports.historyById = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('Claim >>> historyById');

    // Common search params
    let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } =
      args;

    // Search Result params
    let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } =
      args;

    // Resource Specific params
    let care_team = args['care-team'];
    let created = args['created'];
    let encounter = args['encounter'];
    let enterer = args['enterer'];
    let facility = args['facility'];
    let identifier = args['identifier'];
    let insurer = args['insurer'];
    let organization = args['organization'];
    let patient = args['patient'];
    let payee = args['payee'];
    let priority = args['priority'];
    let provider = args['provider'];
    let use = args['use'];

    // TODO: Build query from Parameters

    // TODO: Query database

    let Claim = getClaim(base_version);

    // Cast all results to Claim Class
    let claim_resource = new Claim();

    // Return Array
    resolve([claim_resource]);
  });
