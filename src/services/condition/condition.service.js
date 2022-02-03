/*eslint no-unused-vars: "warn"*/

const { VERSIONS } = require('@asymmetrik/node-fhir-server-core').constants;
const { resolveSchema } = require('@asymmetrik/node-fhir-server-core');
const FHIRServer = require('@asymmetrik/node-fhir-server-core');
const { ObjectID } = require('mongodb');
const logger = require('@asymmetrik/node-fhir-server-core').loggers.get();

let getCondition = (base_version) => {
  return resolveSchema(base_version, 'Condition');
};

let getMeta = (base_version) => {
  return resolveSchema(base_version, 'Meta');
};

module.exports.search = (args) =>
  new Promise((resolve, reject) => {
    logger.info('Condition >>> search');

    // Common search params
    let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } =
      args;

    // Search Result params
    let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } =
      args;

    // Resource Specific params
    let abatement_age = args['abatement-age'];
    let abatement_boolean = args['abatement-boolean'];
    let abatement_date = args['abatement-date'];
    let abatement_string = args['abatement-string'];
    let asserted_date = args['asserted-date'];
    let asserter = args['asserter'];
    let body_site = args['body-site'];
    let category = args['category'];
    let clinical_status = args['clinical-status'];
    let code = args['code'];
    let _context = args['_context'];
    let encounter = args['encounter'];
    let evidence = args['evidence'];
    let evidence_detail = args['evidence-detail'];
    let identifier = args['identifier'];
    let onset_age = args['onset-age'];
    let onset_date = args['onset-date'];
    let onset_info = args['onset-info'];
    let patient = args['patient'];
    let severity = args['severity'];
    let stage = args['stage'];
    let subject = args['subject'];
    let verification_status = args['verification-status'];

    // TODO: Build query from Parameters

    // TODO: Query database

    let Condition = getCondition(base_version);

    // Cast all results to Condition Class
    let condition_resource = new Condition();
    // TODO: Set data with constructor or setter methods
    condition_resource.id = 'test id';

    // Return Array
    resolve([condition_resource]);
  });

module.exports.searchById = (args) =>
  new Promise((resolve, reject) => {
    logger.info('Condition >>> searchById');

    let { base_version, id } = args;

    let Condition = getCondition(base_version);

    // TODO: Build query from Parameters

    // TODO: Query database

    // Cast result to Condition Class
    let condition_resource = new Condition();
    // TODO: Set data with constructor or setter methods
    condition_resource.id = 'test id';

    // Return resource class
    // resolve(condition_resource);
    resolve();
  });

module.exports.create = (args, { req }) =>
  new Promise((resolve, reject) => {
    logger.info('Condition >>> create');

    let { base_version, resource } = args;
    // Make sure to use this ID when inserting this resource
    let id = new ObjectID().toString();

    let Condition = getCondition(base_version);
    let Meta = getMeta(base_version);

    // TODO: determine if client/server sets ID

    // Cast resource to Condition Class
    let condition_resource = new Condition(resource);
    condition_resource.meta = new Meta();
    // TODO: set meta info

    // TODO: save record to database

    // Return Id
    resolve({ id });
  });

module.exports.update = (args, { req }) =>
  new Promise((resolve, reject) => {
    logger.info('Condition >>> update');

    let { base_version, id, resource } = args;

    let Condition = getCondition(base_version);
    let Meta = getMeta(base_version);

    // Cast resource to Condition Class
    let condition_resource = new Condition(resource);
    condition_resource.meta = new Meta();
    // TODO: set meta info, increment meta ID

    // TODO: save record to database

    // Return id, if recorded was created or updated, new meta version id
    resolve({
      id: condition_resource.id,
      created: false,
      resource_version: condition_resource.meta.versionId,
    });
  });

module.exports.remove = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('Condition >>> remove');

    let { id } = args;

    // TODO: delete record in database (soft/hard)

    // Return number of records deleted
    resolve({ deleted: 0 });
  });

module.exports.searchByVersionId = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('Condition >>> searchByVersionId');

    let { base_version, id, version_id } = args;

    let Condition = getCondition(base_version);

    // TODO: Build query from Parameters

    // TODO: Query database

    // Cast result to Condition Class
    let condition_resource = new Condition();

    // Return resource class
    resolve(condition_resource);
  });

module.exports.history = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('Condition >>> history');

    // Common search params
    let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } =
      args;

    // Search Result params
    let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } =
      args;

    // Resource Specific params
    let abatement_age = args['abatement-age'];
    let abatement_boolean = args['abatement-boolean'];
    let abatement_date = args['abatement-date'];
    let abatement_string = args['abatement-string'];
    let asserted_date = args['asserted-date'];
    let asserter = args['asserter'];
    let body_site = args['body-site'];
    let category = args['category'];
    let clinical_status = args['clinical-status'];
    let code = args['code'];
    let _context = args['_context'];
    let encounter = args['encounter'];
    let evidence = args['evidence'];
    let evidence_detail = args['evidence-detail'];
    let identifier = args['identifier'];
    let onset_age = args['onset-age'];
    let onset_date = args['onset-date'];
    let onset_info = args['onset-info'];
    let patient = args['patient'];
    let severity = args['severity'];
    let stage = args['stage'];
    let subject = args['subject'];
    let verification_status = args['verification-status'];

    // TODO: Build query from Parameters

    // TODO: Query database

    let Condition = getCondition(base_version);

    // Cast all results to Condition Class
    let condition_resource = new Condition();

    // Return Array
    resolve([condition_resource]);
  });

module.exports.historyById = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('Condition >>> historyById');

    // Common search params
    let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } =
      args;

    // Search Result params
    let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } =
      args;

    // Resource Specific params
    let abatement_age = args['abatement-age'];
    let abatement_boolean = args['abatement-boolean'];
    let abatement_date = args['abatement-date'];
    let abatement_string = args['abatement-string'];
    let asserted_date = args['asserted-date'];
    let asserter = args['asserter'];
    let body_site = args['body-site'];
    let category = args['category'];
    let clinical_status = args['clinical-status'];
    let code = args['code'];
    let _context = args['_context'];
    let encounter = args['encounter'];
    let evidence = args['evidence'];
    let evidence_detail = args['evidence-detail'];
    let identifier = args['identifier'];
    let onset_age = args['onset-age'];
    let onset_date = args['onset-date'];
    let onset_info = args['onset-info'];
    let patient = args['patient'];
    let severity = args['severity'];
    let stage = args['stage'];
    let subject = args['subject'];
    let verification_status = args['verification-status'];

    // TODO: Build query from Parameters

    // TODO: Query database

    let Condition = getCondition(base_version);

    // Cast all results to Condition Class
    let condition_resource = new Condition();

    // Return Array
    resolve([condition_resource]);
  });
