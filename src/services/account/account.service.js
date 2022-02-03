/*eslint no-unused-vars: "warn"*/

const { VERSIONS } = require('@asymmetrik/node-fhir-server-core').constants;
const { resolveSchema } = require('@asymmetrik/node-fhir-server-core');
const FHIRServer = require('@asymmetrik/node-fhir-server-core');
const { ObjectID } = require('mongodb');
const logger = require('@asymmetrik/node-fhir-server-core').loggers.get();

let getAccount = (base_version) => {
  return resolveSchema(base_version, 'Account');
};

let getMeta = (base_version) => {
  return resolveSchema(base_version, 'Meta');
};

module.exports.search = (args) =>
  new Promise((resolve, reject) => {
    logger.info('Account >>> search');

    // Common search params
    let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } =
      args;

    // Search Result params
    let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } =
      args;

    // Resource Specific params
    let balance = args['balance'];
    let identifier = args['identifier'];
    let name = args['name'];
    let owner = args['owner'];
    let patient = args['patient'];
    let period = args['period'];
    let status = args['status'];
    let subject = args['subject'];
    let type = args['type'];

    // TODO: Build query from Parameters

    // TODO: Query database

    let Account = getAccount(base_version);

    // Cast all results to Account Class
    let account_resource = new Account();
    // TODO: Set data with constructor or setter methods
    account_resource.id = 'test id';

    // Return Array
    resolve([account_resource]);
  });

module.exports.searchById = (args) =>
  new Promise((resolve, reject) => {
    logger.info('Account >>> searchById');

    let { base_version, id } = args;

    let Account = getAccount(base_version);

    // TODO: Build query from Parameters

    // TODO: Query database

    // Cast result to Account Class
    let account_resource = new Account();
    // TODO: Set data with constructor or setter methods
    account_resource.id = 'test id';

    // Return resource class
    // resolve(account_resource);
    resolve();
  });

module.exports.create = (args, { req }) =>
  new Promise((resolve, reject) => {
    logger.info('Account >>> create');

    let { base_version, resource } = args;
    // Make sure to use this ID when inserting this resource
    let id = new ObjectID().toString();

    let Account = getAccount(base_version);
    let Meta = getMeta(base_version);

    // TODO: determine if client/server sets ID

    // Cast resource to Account Class
    let account_resource = new Account(resource);
    account_resource.meta = new Meta();
    // TODO: set meta info

    // TODO: save record to database

    // Return Id
    resolve({ id });
  });

module.exports.update = (args, { req }) =>
  new Promise((resolve, reject) => {
    logger.info('Account >>> update');

    let { base_version, id, resource } = args;

    let Account = getAccount(base_version);
    let Meta = getMeta(base_version);

    // Cast resource to Account Class
    let account_resource = new Account(resource);
    account_resource.meta = new Meta();
    // TODO: set meta info, increment meta ID

    // TODO: save record to database

    // Return id, if recorded was created or updated, new meta version id
    resolve({
      id: account_resource.id,
      created: false,
      resource_version: account_resource.meta.versionId,
    });
  });

module.exports.remove = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('Account >>> remove');

    let { id } = args;

    // TODO: delete record in database (soft/hard)

    // Return number of records deleted
    resolve({ deleted: 0 });
  });

module.exports.searchByVersionId = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('Account >>> searchByVersionId');

    let { base_version, id, version_id } = args;

    let Account = getAccount(base_version);

    // TODO: Build query from Parameters

    // TODO: Query database

    // Cast result to Account Class
    let account_resource = new Account();

    // Return resource class
    resolve(account_resource);
  });

module.exports.history = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('Account >>> history');

    // Common search params
    let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } =
      args;

    // Search Result params
    let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } =
      args;

    // Resource Specific params
    let balance = args['balance'];
    let identifier = args['identifier'];
    let name = args['name'];
    let owner = args['owner'];
    let patient = args['patient'];
    let period = args['period'];
    let status = args['status'];
    let subject = args['subject'];
    let type = args['type'];

    // TODO: Build query from Parameters

    // TODO: Query database

    let Account = getAccount(base_version);

    // Cast all results to Account Class
    let account_resource = new Account();

    // Return Array
    resolve([account_resource]);
  });

module.exports.historyById = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('Account >>> historyById');

    // Common search params
    let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } =
      args;

    // Search Result params
    let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } =
      args;

    // Resource Specific params
    let balance = args['balance'];
    let identifier = args['identifier'];
    let name = args['name'];
    let owner = args['owner'];
    let patient = args['patient'];
    let period = args['period'];
    let status = args['status'];
    let subject = args['subject'];
    let type = args['type'];

    // TODO: Build query from Parameters

    // TODO: Query database

    let Account = getAccount(base_version);

    // Cast all results to Account Class
    let account_resource = new Account();

    // Return Array
    resolve([account_resource]);
  });
