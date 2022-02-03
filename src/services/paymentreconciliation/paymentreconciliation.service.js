/*eslint no-unused-vars: "warn"*/

const { VERSIONS } = require('@asymmetrik/node-fhir-server-core').constants;
const { resolveSchema } = require('@asymmetrik/node-fhir-server-core');
const FHIRServer = require('@asymmetrik/node-fhir-server-core');
const { ObjectID } = require('mongodb');
const logger = require('@asymmetrik/node-fhir-server-core').loggers.get();

let getPaymentReconciliation = (base_version) => {
  return resolveSchema(base_version, 'PaymentReconciliation');
};

let getMeta = (base_version) => {
  return resolveSchema(base_version, 'Meta');
};

module.exports.search = (args) =>
  new Promise((resolve, reject) => {
    logger.info('PaymentReconciliation >>> search');

    // Common search params
    let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } =
      args;

    // Search Result params
    let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } =
      args;

    // Resource Specific params
    let created = args['created'];
    let disposition = args['disposition'];
    let identifier = args['identifier'];
    let organization = args['organization'];
    let outcome = args['outcome'];
    let request = args['request'];
    let request_organization = args['request-organization'];
    let request_provider = args['request-provider'];

    // TODO: Build query from Parameters

    // TODO: Query database

    let PaymentReconciliation = getPaymentReconciliation(base_version);

    // Cast all results to PaymentReconciliation Class
    let paymentreconciliation_resource = new PaymentReconciliation();
    // TODO: Set data with constructor or setter methods
    paymentreconciliation_resource.id = 'test id';

    // Return Array
    resolve([paymentreconciliation_resource]);
  });

module.exports.searchById = (args) =>
  new Promise((resolve, reject) => {
    logger.info('PaymentReconciliation >>> searchById');

    let { base_version, id } = args;

    let PaymentReconciliation = getPaymentReconciliation(base_version);

    // TODO: Build query from Parameters

    // TODO: Query database

    // Cast result to PaymentReconciliation Class
    let paymentreconciliation_resource = new PaymentReconciliation();
    // TODO: Set data with constructor or setter methods
    paymentreconciliation_resource.id = 'test id';

    // Return resource class
    // resolve(paymentreconciliation_resource);
    resolve();
  });

module.exports.create = (args, { req }) =>
  new Promise((resolve, reject) => {
    logger.info('PaymentReconciliation >>> create');

    let { base_version, resource } = args;
    // Make sure to use this ID when inserting this resource
    let id = new ObjectID().toString();

    let PaymentReconciliation = getPaymentReconciliation(base_version);
    let Meta = getMeta(base_version);

    // TODO: determine if client/server sets ID

    // Cast resource to PaymentReconciliation Class
    let paymentreconciliation_resource = new PaymentReconciliation(resource);
    paymentreconciliation_resource.meta = new Meta();
    // TODO: set meta info

    // TODO: save record to database

    // Return Id
    resolve({ id });
  });

module.exports.update = (args, { req }) =>
  new Promise((resolve, reject) => {
    logger.info('PaymentReconciliation >>> update');

    let { base_version, id, resource } = args;

    let PaymentReconciliation = getPaymentReconciliation(base_version);
    let Meta = getMeta(base_version);

    // Cast resource to PaymentReconciliation Class
    let paymentreconciliation_resource = new PaymentReconciliation(resource);
    paymentreconciliation_resource.meta = new Meta();
    // TODO: set meta info, increment meta ID

    // TODO: save record to database

    // Return id, if recorded was created or updated, new meta version id
    resolve({
      id: paymentreconciliation_resource.id,
      created: false,
      resource_version: paymentreconciliation_resource.meta.versionId,
    });
  });

module.exports.remove = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('PaymentReconciliation >>> remove');

    let { id } = args;

    // TODO: delete record in database (soft/hard)

    // Return number of records deleted
    resolve({ deleted: 0 });
  });

module.exports.searchByVersionId = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('PaymentReconciliation >>> searchByVersionId');

    let { base_version, id, version_id } = args;

    let PaymentReconciliation = getPaymentReconciliation(base_version);

    // TODO: Build query from Parameters

    // TODO: Query database

    // Cast result to PaymentReconciliation Class
    let paymentreconciliation_resource = new PaymentReconciliation();

    // Return resource class
    resolve(paymentreconciliation_resource);
  });

module.exports.history = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('PaymentReconciliation >>> history');

    // Common search params
    let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } =
      args;

    // Search Result params
    let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } =
      args;

    // Resource Specific params
    let created = args['created'];
    let disposition = args['disposition'];
    let identifier = args['identifier'];
    let organization = args['organization'];
    let outcome = args['outcome'];
    let request = args['request'];
    let request_organization = args['request-organization'];
    let request_provider = args['request-provider'];

    // TODO: Build query from Parameters

    // TODO: Query database

    let PaymentReconciliation = getPaymentReconciliation(base_version);

    // Cast all results to PaymentReconciliation Class
    let paymentreconciliation_resource = new PaymentReconciliation();

    // Return Array
    resolve([paymentreconciliation_resource]);
  });

module.exports.historyById = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('PaymentReconciliation >>> historyById');

    // Common search params
    let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } =
      args;

    // Search Result params
    let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } =
      args;

    // Resource Specific params
    let created = args['created'];
    let disposition = args['disposition'];
    let identifier = args['identifier'];
    let organization = args['organization'];
    let outcome = args['outcome'];
    let request = args['request'];
    let request_organization = args['request-organization'];
    let request_provider = args['request-provider'];

    // TODO: Build query from Parameters

    // TODO: Query database

    let PaymentReconciliation = getPaymentReconciliation(base_version);

    // Cast all results to PaymentReconciliation Class
    let paymentreconciliation_resource = new PaymentReconciliation();

    // Return Array
    resolve([paymentreconciliation_resource]);
  });
