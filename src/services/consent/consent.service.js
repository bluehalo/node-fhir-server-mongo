/*eslint no-unused-vars: "warn"*/

const { VERSIONS } = require('@bluehalo/node-fhir-server-core').constants;
const { resolveSchema } = require('@bluehalo/node-fhir-server-core');
const FHIRServer = require('@bluehalo/node-fhir-server-core');
const { ObjectID } = require('mongodb');
const logger = require('@bluehalo/node-fhir-server-core').loggers.get();

let getConsent = (base_version) => {
  return resolveSchema(base_version, 'Consent');
};

let getMeta = (base_version) => {
  return resolveSchema(base_version, 'Meta');
};

module.exports.search = (args) =>
  new Promise((resolve, reject) => {
    logger.info('Consent >>> search');

    // Common search params
    let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } =
      args;

    // Search Result params
    let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } =
      args;

    // Resource Specific params
    let action = args['action'];
    let actor = args['actor'];
    let category = args['category'];
    let consentor = args['consentor'];
    let data = args['data'];
    let date = args['date'];
    let identifier = args['identifier'];
    let organization = args['organization'];
    let patient = args['patient'];
    let period = args['period'];
    let purpose = args['purpose'];
    let securitylabel = args['securitylabel'];
    let source = args['source'];
    let status = args['status'];

    // TODO: Build query from Parameters

    // TODO: Query database

    let Consent = getConsent(base_version);

    // Cast all results to Consent Class
    let consent_resource = new Consent();
    // TODO: Set data with constructor or setter methods
    consent_resource.id = 'test id';

    // Return Array
    resolve([consent_resource]);
  });

module.exports.searchById = (args) =>
  new Promise((resolve, reject) => {
    logger.info('Consent >>> searchById');

    let { base_version, id } = args;

    let Consent = getConsent(base_version);

    // TODO: Build query from Parameters

    // TODO: Query database

    // Cast result to Consent Class
    let consent_resource = new Consent();
    // TODO: Set data with constructor or setter methods
    consent_resource.id = 'test id';

    // Return resource class
    // resolve(consent_resource);
    resolve();
  });

module.exports.create = (args, { req }) =>
  new Promise((resolve, reject) => {
    logger.info('Consent >>> create');

    let { base_version, resource } = args;
    // Make sure to use this ID when inserting this resource
    let id = new ObjectID().toString();

    let Consent = getConsent(base_version);
    let Meta = getMeta(base_version);

    // TODO: determine if client/server sets ID

    // Cast resource to Consent Class
    let consent_resource = new Consent(resource);
    consent_resource.meta = new Meta();
    // TODO: set meta info

    // TODO: save record to database

    // Return Id
    resolve({ id });
  });

module.exports.update = (args, { req }) =>
  new Promise((resolve, reject) => {
    logger.info('Consent >>> update');

    let { base_version, id, resource } = args;

    let Consent = getConsent(base_version);
    let Meta = getMeta(base_version);

    // Cast resource to Consent Class
    let consent_resource = new Consent(resource);
    consent_resource.meta = new Meta();
    // TODO: set meta info, increment meta ID

    // TODO: save record to database

    // Return id, if recorded was created or updated, new meta version id
    resolve({
      id: consent_resource.id,
      created: false,
      resource_version: consent_resource.meta.versionId,
    });
  });

module.exports.remove = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('Consent >>> remove');

    let { id } = args;

    // TODO: delete record in database (soft/hard)

    // Return number of records deleted
    resolve({ deleted: 0 });
  });

module.exports.searchByVersionId = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('Consent >>> searchByVersionId');

    let { base_version, id, version_id } = args;

    let Consent = getConsent(base_version);

    // TODO: Build query from Parameters

    // TODO: Query database

    // Cast result to Consent Class
    let consent_resource = new Consent();

    // Return resource class
    resolve(consent_resource);
  });

module.exports.history = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('Consent >>> history');

    // Common search params
    let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } =
      args;

    // Search Result params
    let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } =
      args;

    // Resource Specific params
    let action = args['action'];
    let actor = args['actor'];
    let category = args['category'];
    let consentor = args['consentor'];
    let data = args['data'];
    let date = args['date'];
    let identifier = args['identifier'];
    let organization = args['organization'];
    let patient = args['patient'];
    let period = args['period'];
    let purpose = args['purpose'];
    let securitylabel = args['securitylabel'];
    let source = args['source'];
    let status = args['status'];

    // TODO: Build query from Parameters

    // TODO: Query database

    let Consent = getConsent(base_version);

    // Cast all results to Consent Class
    let consent_resource = new Consent();

    // Return Array
    resolve([consent_resource]);
  });

module.exports.historyById = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('Consent >>> historyById');

    // Common search params
    let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } =
      args;

    // Search Result params
    let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } =
      args;

    // Resource Specific params
    let action = args['action'];
    let actor = args['actor'];
    let category = args['category'];
    let consentor = args['consentor'];
    let data = args['data'];
    let date = args['date'];
    let identifier = args['identifier'];
    let organization = args['organization'];
    let patient = args['patient'];
    let period = args['period'];
    let purpose = args['purpose'];
    let securitylabel = args['securitylabel'];
    let source = args['source'];
    let status = args['status'];

    // TODO: Build query from Parameters

    // TODO: Query database

    let Consent = getConsent(base_version);

    // Cast all results to Consent Class
    let consent_resource = new Consent();

    // Return Array
    resolve([consent_resource]);
  });
