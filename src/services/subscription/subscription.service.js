/*eslint no-unused-vars: "warn"*/

const { VERSIONS } = require('@asymmetrik/node-fhir-server-core').constants;
const { resolveSchema } = require('@asymmetrik/node-fhir-server-core');
const FHIRServer = require('@asymmetrik/node-fhir-server-core');
const { ObjectID } = require('mongodb');
const logger = require('@asymmetrik/node-fhir-server-core').loggers.get();

let getSubscription = (base_version) => {
  return resolveSchema(base_version, 'Subscription');
};

let getMeta = (base_version) => {
  return resolveSchema(base_version, 'Meta');
};

module.exports.search = (args) =>
  new Promise((resolve, reject) => {
    logger.info('Subscription >>> search');

    // Common search params
    let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } =
      args;

    // Search Result params
    let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } =
      args;

    // Resource Specific params
    let add_tag = args['add-tag'];
    let contact = args['contact'];
    let criteria = args['criteria'];
    let payload = args['payload'];
    let status = args['status'];
    let type = args['type'];
    let url = args['url'];

    // TODO: Build query from Parameters

    // TODO: Query database

    let Subscription = getSubscription(base_version);

    // Cast all results to Subscription Class
    let subscription_resource = new Subscription();
    // TODO: Set data with constructor or setter methods
    subscription_resource.id = 'test id';

    // Return Array
    resolve([subscription_resource]);
  });

module.exports.searchById = (args) =>
  new Promise((resolve, reject) => {
    logger.info('Subscription >>> searchById');

    let { base_version, id } = args;

    let Subscription = getSubscription(base_version);

    // TODO: Build query from Parameters

    // TODO: Query database

    // Cast result to Subscription Class
    let subscription_resource = new Subscription();
    // TODO: Set data with constructor or setter methods
    subscription_resource.id = 'test id';

    // Return resource class
    // resolve(subscription_resource);
    resolve();
  });

module.exports.create = (args, { req }) =>
  new Promise((resolve, reject) => {
    logger.info('Subscription >>> create');

    let { base_version, resource } = args;
    // Make sure to use this ID when inserting this resource
    let id = new ObjectID().toString();

    let Subscription = getSubscription(base_version);
    let Meta = getMeta(base_version);

    // TODO: determine if client/server sets ID

    // Cast resource to Subscription Class
    let subscription_resource = new Subscription(resource);
    subscription_resource.meta = new Meta();
    // TODO: set meta info

    // TODO: save record to database

    // Return Id
    resolve({ id });
  });

module.exports.update = (args, { req }) =>
  new Promise((resolve, reject) => {
    logger.info('Subscription >>> update');

    let { base_version, id, resource } = args;

    let Subscription = getSubscription(base_version);
    let Meta = getMeta(base_version);

    // Cast resource to Subscription Class
    let subscription_resource = new Subscription(resource);
    subscription_resource.meta = new Meta();
    // TODO: set meta info, increment meta ID

    // TODO: save record to database

    // Return id, if recorded was created or updated, new meta version id
    resolve({
      id: subscription_resource.id,
      created: false,
      resource_version: subscription_resource.meta.versionId,
    });
  });

module.exports.remove = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('Subscription >>> remove');

    let { id } = args;

    // TODO: delete record in database (soft/hard)

    // Return number of records deleted
    resolve({ deleted: 0 });
  });

module.exports.searchByVersionId = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('Subscription >>> searchByVersionId');

    let { base_version, id, version_id } = args;

    let Subscription = getSubscription(base_version);

    // TODO: Build query from Parameters

    // TODO: Query database

    // Cast result to Subscription Class
    let subscription_resource = new Subscription();

    // Return resource class
    resolve(subscription_resource);
  });

module.exports.history = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('Subscription >>> history');

    // Common search params
    let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } =
      args;

    // Search Result params
    let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } =
      args;

    // Resource Specific params
    let add_tag = args['add-tag'];
    let contact = args['contact'];
    let criteria = args['criteria'];
    let payload = args['payload'];
    let status = args['status'];
    let type = args['type'];
    let url = args['url'];

    // TODO: Build query from Parameters

    // TODO: Query database

    let Subscription = getSubscription(base_version);

    // Cast all results to Subscription Class
    let subscription_resource = new Subscription();

    // Return Array
    resolve([subscription_resource]);
  });

module.exports.historyById = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('Subscription >>> historyById');

    // Common search params
    let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } =
      args;

    // Search Result params
    let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } =
      args;

    // Resource Specific params
    let add_tag = args['add-tag'];
    let contact = args['contact'];
    let criteria = args['criteria'];
    let payload = args['payload'];
    let status = args['status'];
    let type = args['type'];
    let url = args['url'];

    // TODO: Build query from Parameters

    // TODO: Query database

    let Subscription = getSubscription(base_version);

    // Cast all results to Subscription Class
    let subscription_resource = new Subscription();

    // Return Array
    resolve([subscription_resource]);
  });
