/*eslint no-unused-vars: "warn"*/

const { VERSIONS } = require('@asymmetrik/node-fhir-server-core').constants;
const { resolveSchema } = require('@asymmetrik/node-fhir-server-core');
const FHIRServer = require('@asymmetrik/node-fhir-server-core');
const { ObjectID } = require('mongodb');
const logger = require('@asymmetrik/node-fhir-server-core').loggers.get();

let getExplanationOfBenefit = (base_version) => {
  return resolveSchema(base_version, 'ExplanationOfBenefit');
};

let getMeta = (base_version) => {
  return resolveSchema(base_version, 'Meta');
};

module.exports.search = (args) =>
  new Promise((resolve, reject) => {
    logger.info('ExplanationOfBenefit >>> search');

    // Common search params
    let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } =
      args;

    // Search Result params
    let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } =
      args;

    // Resource Specific params
    let care_team = args['care-team'];
    let claim = args['claim'];
    let coverage = args['coverage'];
    let created = args['created'];
    let disposition = args['disposition'];
    let encounter = args['encounter'];
    let enterer = args['enterer'];
    let facility = args['facility'];
    let identifier = args['identifier'];
    let organization = args['organization'];
    let patient = args['patient'];
    let payee = args['payee'];
    let provider = args['provider'];

    // TODO: Build query from Parameters

    // TODO: Query database

    let ExplanationOfBenefit = getExplanationOfBenefit(base_version);

    // Cast all results to ExplanationOfBenefit Class
    let explanationofbenefit_resource = new ExplanationOfBenefit();
    // TODO: Set data with constructor or setter methods
    explanationofbenefit_resource.id = 'test id';

    // Return Array
    resolve([explanationofbenefit_resource]);
  });

module.exports.searchById = (args) =>
  new Promise((resolve, reject) => {
    logger.info('ExplanationOfBenefit >>> searchById');

    let { base_version, id } = args;

    let ExplanationOfBenefit = getExplanationOfBenefit(base_version);

    // TODO: Build query from Parameters

    // TODO: Query database

    // Cast result to ExplanationOfBenefit Class
    let explanationofbenefit_resource = new ExplanationOfBenefit();
    // TODO: Set data with constructor or setter methods
    explanationofbenefit_resource.id = 'test id';

    // Return resource class
    // resolve(explanationofbenefit_resource);
    resolve();
  });

module.exports.create = (args, { req }) =>
  new Promise((resolve, reject) => {
    logger.info('ExplanationOfBenefit >>> create');

    let { base_version, resource } = args;
    // Make sure to use this ID when inserting this resource
    let id = new ObjectID().toString();

    let ExplanationOfBenefit = getExplanationOfBenefit(base_version);
    let Meta = getMeta(base_version);

    // TODO: determine if client/server sets ID

    // Cast resource to ExplanationOfBenefit Class
    let explanationofbenefit_resource = new ExplanationOfBenefit(resource);
    explanationofbenefit_resource.meta = new Meta();
    // TODO: set meta info

    // TODO: save record to database

    // Return Id
    resolve({ id });
  });

module.exports.update = (args, { req }) =>
  new Promise((resolve, reject) => {
    logger.info('ExplanationOfBenefit >>> update');

    let { base_version, id, resource } = args;

    let ExplanationOfBenefit = getExplanationOfBenefit(base_version);
    let Meta = getMeta(base_version);

    // Cast resource to ExplanationOfBenefit Class
    let explanationofbenefit_resource = new ExplanationOfBenefit(resource);
    explanationofbenefit_resource.meta = new Meta();
    // TODO: set meta info, increment meta ID

    // TODO: save record to database

    // Return id, if recorded was created or updated, new meta version id
    resolve({
      id: explanationofbenefit_resource.id,
      created: false,
      resource_version: explanationofbenefit_resource.meta.versionId,
    });
  });

module.exports.remove = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('ExplanationOfBenefit >>> remove');

    let { id } = args;

    // TODO: delete record in database (soft/hard)

    // Return number of records deleted
    resolve({ deleted: 0 });
  });

module.exports.searchByVersionId = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('ExplanationOfBenefit >>> searchByVersionId');

    let { base_version, id, version_id } = args;

    let ExplanationOfBenefit = getExplanationOfBenefit(base_version);

    // TODO: Build query from Parameters

    // TODO: Query database

    // Cast result to ExplanationOfBenefit Class
    let explanationofbenefit_resource = new ExplanationOfBenefit();

    // Return resource class
    resolve(explanationofbenefit_resource);
  });

module.exports.history = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('ExplanationOfBenefit >>> history');

    // Common search params
    let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } =
      args;

    // Search Result params
    let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } =
      args;

    // Resource Specific params
    let care_team = args['care-team'];
    let claim = args['claim'];
    let coverage = args['coverage'];
    let created = args['created'];
    let disposition = args['disposition'];
    let encounter = args['encounter'];
    let enterer = args['enterer'];
    let facility = args['facility'];
    let identifier = args['identifier'];
    let organization = args['organization'];
    let patient = args['patient'];
    let payee = args['payee'];
    let provider = args['provider'];

    // TODO: Build query from Parameters

    // TODO: Query database

    let ExplanationOfBenefit = getExplanationOfBenefit(base_version);

    // Cast all results to ExplanationOfBenefit Class
    let explanationofbenefit_resource = new ExplanationOfBenefit();

    // Return Array
    resolve([explanationofbenefit_resource]);
  });

module.exports.historyById = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('ExplanationOfBenefit >>> historyById');

    // Common search params
    let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } =
      args;

    // Search Result params
    let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } =
      args;

    // Resource Specific params
    let care_team = args['care-team'];
    let claim = args['claim'];
    let coverage = args['coverage'];
    let created = args['created'];
    let disposition = args['disposition'];
    let encounter = args['encounter'];
    let enterer = args['enterer'];
    let facility = args['facility'];
    let identifier = args['identifier'];
    let organization = args['organization'];
    let patient = args['patient'];
    let payee = args['payee'];
    let provider = args['provider'];

    // TODO: Build query from Parameters

    // TODO: Query database

    let ExplanationOfBenefit = getExplanationOfBenefit(base_version);

    // Cast all results to ExplanationOfBenefit Class
    let explanationofbenefit_resource = new ExplanationOfBenefit();

    // Return Array
    resolve([explanationofbenefit_resource]);
  });
