/*eslint no-unused-vars: "warn"*/

const { VERSIONS } = require('@asymmetrik/node-fhir-server-core').constants;
const { resolveSchema } = require('@asymmetrik/node-fhir-server-core');
const FHIRServer = require('@asymmetrik/node-fhir-server-core');
const { ObjectID } = require('mongodb');
const logger = require('@asymmetrik/node-fhir-server-core').loggers.get();

let getContract = (base_version) => {
  return resolveSchema(base_version, 'Contract');
};

let getMeta = (base_version) => {
  return resolveSchema(base_version, 'Meta');
};

module.exports.search = (args) =>
  new Promise((resolve, reject) => {
    logger.info('Contract >>> search');

    // Common search params
    let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } =
      args;

    // Search Result params
    let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } =
      args;

    // Resource Specific params
    let agent = args['agent'];
    let authority = args['authority'];
    let domain = args['domain'];
    let identifier = args['identifier'];
    let issued = args['issued'];
    let patient = args['patient'];
    let signer = args['signer'];
    let subject = args['subject'];
    let term_topic = args['term-topic'];

    // TODO: Build query from Parameters

    // TODO: Query database

    let Contract = getContract(base_version);

    // Cast all results to Contract Class
    let contract_resource = new Contract();
    // TODO: Set data with constructor or setter methods
    contract_resource.id = 'test id';

    // Return Array
    resolve([contract_resource]);
  });

module.exports.searchById = (args) =>
  new Promise((resolve, reject) => {
    logger.info('Contract >>> searchById');

    let { base_version, id } = args;

    let Contract = getContract(base_version);

    // TODO: Build query from Parameters

    // TODO: Query database

    // Cast result to Contract Class
    let contract_resource = new Contract();
    // TODO: Set data with constructor or setter methods
    contract_resource.id = 'test id';

    // Return resource class
    // resolve(contract_resource);
    resolve();
  });

module.exports.create = (args, { req }) =>
  new Promise((resolve, reject) => {
    logger.info('Contract >>> create');

    let { base_version, resource } = args;
    // Make sure to use this ID when inserting this resource
    let id = new ObjectID().toString();

    let Contract = getContract(base_version);
    let Meta = getMeta(base_version);

    // TODO: determine if client/server sets ID

    // Cast resource to Contract Class
    let contract_resource = new Contract(resource);
    contract_resource.meta = new Meta();
    // TODO: set meta info

    // TODO: save record to database

    // Return Id
    resolve({ id });
  });

module.exports.update = (args, { req }) =>
  new Promise((resolve, reject) => {
    logger.info('Contract >>> update');

    let { base_version, id, resource } = args;

    let Contract = getContract(base_version);
    let Meta = getMeta(base_version);

    // Cast resource to Contract Class
    let contract_resource = new Contract(resource);
    contract_resource.meta = new Meta();
    // TODO: set meta info, increment meta ID

    // TODO: save record to database

    // Return id, if recorded was created or updated, new meta version id
    resolve({
      id: contract_resource.id,
      created: false,
      resource_version: contract_resource.meta.versionId,
    });
  });

module.exports.remove = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('Contract >>> remove');

    let { id } = args;

    // TODO: delete record in database (soft/hard)

    // Return number of records deleted
    resolve({ deleted: 0 });
  });

module.exports.searchByVersionId = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('Contract >>> searchByVersionId');

    let { base_version, id, version_id } = args;

    let Contract = getContract(base_version);

    // TODO: Build query from Parameters

    // TODO: Query database

    // Cast result to Contract Class
    let contract_resource = new Contract();

    // Return resource class
    resolve(contract_resource);
  });

module.exports.history = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('Contract >>> history');

    // Common search params
    let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } =
      args;

    // Search Result params
    let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } =
      args;

    // Resource Specific params
    let agent = args['agent'];
    let authority = args['authority'];
    let domain = args['domain'];
    let identifier = args['identifier'];
    let issued = args['issued'];
    let patient = args['patient'];
    let signer = args['signer'];
    let subject = args['subject'];
    let term_topic = args['term-topic'];

    // TODO: Build query from Parameters

    // TODO: Query database

    let Contract = getContract(base_version);

    // Cast all results to Contract Class
    let contract_resource = new Contract();

    // Return Array
    resolve([contract_resource]);
  });

module.exports.historyById = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('Contract >>> historyById');

    // Common search params
    let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } =
      args;

    // Search Result params
    let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } =
      args;

    // Resource Specific params
    let agent = args['agent'];
    let authority = args['authority'];
    let domain = args['domain'];
    let identifier = args['identifier'];
    let issued = args['issued'];
    let patient = args['patient'];
    let signer = args['signer'];
    let subject = args['subject'];
    let term_topic = args['term-topic'];

    // TODO: Build query from Parameters

    // TODO: Query database

    let Contract = getContract(base_version);

    // Cast all results to Contract Class
    let contract_resource = new Contract();

    // Return Array
    resolve([contract_resource]);
  });
