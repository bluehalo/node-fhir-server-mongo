/*eslint no-unused-vars: "warn"*/

const { VERSIONS } = require('@asymmetrik/node-fhir-server-core').constants;
const { resolveSchema } = require('@asymmetrik/node-fhir-server-core');
const FHIRServer = require('@asymmetrik/node-fhir-server-core');
const { ObjectID } = require('mongodb');
const logger = require('@asymmetrik/node-fhir-server-core').loggers.get();

let getPaymentNotice = (base_version) => {
  return resolveSchema(base_version, 'PaymentNotice');
};

let getMeta = (base_version) => {
  return resolveSchema(base_version, 'Meta');
};

module.exports.search = (args) =>
  new Promise((resolve, reject) => {
    logger.info('PaymentNotice >>> search');

    // Common search params
    let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } =
      args;

    // Search Result params
    let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } =
      args;

    // Resource Specific params
    let created = args['created'];
    let identifier = args['identifier'];
    let organization = args['organization'];
    let payment_status = args['payment-status'];
    let provider = args['provider'];
    let request = args['request'];
    let response = args['response'];
    let statusdate = args['statusdate'];

    // TODO: Build query from Parameters

    // TODO: Query database

    let PaymentNotice = getPaymentNotice(base_version);

    // Cast all results to PaymentNotice Class
    let paymentnotice_resource = new PaymentNotice();
    // TODO: Set data with constructor or setter methods
    paymentnotice_resource.id = 'test id';

    // Return Array
    resolve([paymentnotice_resource]);
  });

module.exports.searchById = (args) =>
  new Promise((resolve, reject) => {
    logger.info('PaymentNotice >>> searchById');

    let { base_version, id } = args;

    let PaymentNotice = getPaymentNotice(base_version);

    // TODO: Build query from Parameters

    // TODO: Query database

    // Cast result to PaymentNotice Class
    let paymentnotice_resource = new PaymentNotice();
    // TODO: Set data with constructor or setter methods
    paymentnotice_resource.id = 'test id';

    // Return resource class
    // resolve(paymentnotice_resource);
    resolve();
  });

module.exports.create = (args, { req }) =>
  new Promise((resolve, reject) => {
    logger.info('PaymentNotice >>> create');

    let { base_version, resource } = args;
    // Make sure to use this ID when inserting this resource
    let id = new ObjectID().toString();

    let PaymentNotice = getPaymentNotice(base_version);
    let Meta = getMeta(base_version);

    // TODO: determine if client/server sets ID

    // Cast resource to PaymentNotice Class
    let paymentnotice_resource = new PaymentNotice(resource);
    paymentnotice_resource.meta = new Meta();
    // TODO: set meta info

    // TODO: save record to database

    // Return Id
    resolve({ id });
  });

module.exports.update = (args, { req }) =>
  new Promise((resolve, reject) => {
    logger.info('PaymentNotice >>> update');

    let { base_version, id, resource } = args;

    let PaymentNotice = getPaymentNotice(base_version);
    let Meta = getMeta(base_version);

    // Cast resource to PaymentNotice Class
    let paymentnotice_resource = new PaymentNotice(resource);
    paymentnotice_resource.meta = new Meta();
    // TODO: set meta info, increment meta ID

    // TODO: save record to database

    // Return id, if recorded was created or updated, new meta version id
    resolve({
      id: paymentnotice_resource.id,
      created: false,
      resource_version: paymentnotice_resource.meta.versionId,
    });
  });

module.exports.remove = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('PaymentNotice >>> remove');

    let { id } = args;

    // TODO: delete record in database (soft/hard)

    // Return number of records deleted
    resolve({ deleted: 0 });
  });

module.exports.searchByVersionId = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('PaymentNotice >>> searchByVersionId');

    let { base_version, id, version_id } = args;

    let PaymentNotice = getPaymentNotice(base_version);

    // TODO: Build query from Parameters

    // TODO: Query database

    // Cast result to PaymentNotice Class
    let paymentnotice_resource = new PaymentNotice();

    // Return resource class
    resolve(paymentnotice_resource);
  });

module.exports.history = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('PaymentNotice >>> history');

    // Common search params
    let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } =
      args;

    // Search Result params
    let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } =
      args;

    // Resource Specific params
    let created = args['created'];
    let identifier = args['identifier'];
    let organization = args['organization'];
    let payment_status = args['payment-status'];
    let provider = args['provider'];
    let request = args['request'];
    let response = args['response'];
    let statusdate = args['statusdate'];

    // TODO: Build query from Parameters

    // TODO: Query database

    let PaymentNotice = getPaymentNotice(base_version);

    // Cast all results to PaymentNotice Class
    let paymentnotice_resource = new PaymentNotice();

    // Return Array
    resolve([paymentnotice_resource]);
  });

module.exports.historyById = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('PaymentNotice >>> historyById');

    // Common search params
    let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } =
      args;

    // Search Result params
    let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } =
      args;

    // Resource Specific params
    let created = args['created'];
    let identifier = args['identifier'];
    let organization = args['organization'];
    let payment_status = args['payment-status'];
    let provider = args['provider'];
    let request = args['request'];
    let response = args['response'];
    let statusdate = args['statusdate'];

    // TODO: Build query from Parameters

    // TODO: Query database

    let PaymentNotice = getPaymentNotice(base_version);

    // Cast all results to PaymentNotice Class
    let paymentnotice_resource = new PaymentNotice();

    // Return Array
    resolve([paymentnotice_resource]);
  });
