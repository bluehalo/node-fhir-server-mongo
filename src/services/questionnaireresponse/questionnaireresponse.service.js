/*eslint no-unused-vars: "warn"*/

const { VERSIONS } = require('@asymmetrik/node-fhir-server-core').constants;
const { resolveSchema } = require('@asymmetrik/node-fhir-server-core');
const FHIRServer = require('@asymmetrik/node-fhir-server-core');
const { ObjectID } = require('mongodb');
const logger = require('@asymmetrik/node-fhir-server-core').loggers.get();

let getQuestionnaireResponse = (base_version) => {
  return resolveSchema(base_version, 'QuestionnaireResponse');
};

let getMeta = (base_version) => {
  return resolveSchema(base_version, 'Meta');
};

module.exports.search = (args) =>
  new Promise((resolve, reject) => {
    logger.info('QuestionnaireResponse >>> search');

    // Common search params
    let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } =
      args;

    // Search Result params
    let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } =
      args;

    // Resource Specific params
    let author = args['author'];
    let authored = args['authored'];
    let based_on = args['based-on'];
    let _context = args['_context'];
    let identifier = args['identifier'];
    let parent = args['parent'];
    let patient = args['patient'];
    let questionnaire = args['questionnaire'];
    let source = args['source'];
    let status = args['status'];
    let subject = args['subject'];

    // TODO: Build query from Parameters

    // TODO: Query database

    let QuestionnaireResponse = getQuestionnaireResponse(base_version);

    // Cast all results to QuestionnaireResponse Class
    let questionnaireresponse_resource = new QuestionnaireResponse();
    // TODO: Set data with constructor or setter methods
    questionnaireresponse_resource.id = 'test id';

    // Return Array
    resolve([questionnaireresponse_resource]);
  });

module.exports.searchById = (args) =>
  new Promise((resolve, reject) => {
    logger.info('QuestionnaireResponse >>> searchById');

    let { base_version, id } = args;

    let QuestionnaireResponse = getQuestionnaireResponse(base_version);

    // TODO: Build query from Parameters

    // TODO: Query database

    // Cast result to QuestionnaireResponse Class
    let questionnaireresponse_resource = new QuestionnaireResponse();
    // TODO: Set data with constructor or setter methods
    questionnaireresponse_resource.id = 'test id';

    // Return resource class
    // resolve(questionnaireresponse_resource);
    resolve();
  });

module.exports.create = (args, { req }) =>
  new Promise((resolve, reject) => {
    logger.info('QuestionnaireResponse >>> create');

    let { base_version, resource } = args;
    // Make sure to use this ID when inserting this resource
    let id = new ObjectID().toString();

    let QuestionnaireResponse = getQuestionnaireResponse(base_version);
    let Meta = getMeta(base_version);

    // TODO: determine if client/server sets ID

    // Cast resource to QuestionnaireResponse Class
    let questionnaireresponse_resource = new QuestionnaireResponse(resource);
    questionnaireresponse_resource.meta = new Meta();
    // TODO: set meta info

    // TODO: save record to database

    // Return Id
    resolve({ id });
  });

module.exports.update = (args, { req }) =>
  new Promise((resolve, reject) => {
    logger.info('QuestionnaireResponse >>> update');

    let { base_version, id, resource } = args;

    let QuestionnaireResponse = getQuestionnaireResponse(base_version);
    let Meta = getMeta(base_version);

    // Cast resource to QuestionnaireResponse Class
    let questionnaireresponse_resource = new QuestionnaireResponse(resource);
    questionnaireresponse_resource.meta = new Meta();
    // TODO: set meta info, increment meta ID

    // TODO: save record to database

    // Return id, if recorded was created or updated, new meta version id
    resolve({
      id: questionnaireresponse_resource.id,
      created: false,
      resource_version: questionnaireresponse_resource.meta.versionId,
    });
  });

module.exports.remove = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('QuestionnaireResponse >>> remove');

    let { id } = args;

    // TODO: delete record in database (soft/hard)

    // Return number of records deleted
    resolve({ deleted: 0 });
  });

module.exports.searchByVersionId = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('QuestionnaireResponse >>> searchByVersionId');

    let { base_version, id, version_id } = args;

    let QuestionnaireResponse = getQuestionnaireResponse(base_version);

    // TODO: Build query from Parameters

    // TODO: Query database

    // Cast result to QuestionnaireResponse Class
    let questionnaireresponse_resource = new QuestionnaireResponse();

    // Return resource class
    resolve(questionnaireresponse_resource);
  });

module.exports.history = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('QuestionnaireResponse >>> history');

    // Common search params
    let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } =
      args;

    // Search Result params
    let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } =
      args;

    // Resource Specific params
    let author = args['author'];
    let authored = args['authored'];
    let based_on = args['based-on'];
    let _context = args['_context'];
    let identifier = args['identifier'];
    let parent = args['parent'];
    let patient = args['patient'];
    let questionnaire = args['questionnaire'];
    let source = args['source'];
    let status = args['status'];
    let subject = args['subject'];

    // TODO: Build query from Parameters

    // TODO: Query database

    let QuestionnaireResponse = getQuestionnaireResponse(base_version);

    // Cast all results to QuestionnaireResponse Class
    let questionnaireresponse_resource = new QuestionnaireResponse();

    // Return Array
    resolve([questionnaireresponse_resource]);
  });

module.exports.historyById = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('QuestionnaireResponse >>> historyById');

    // Common search params
    let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } =
      args;

    // Search Result params
    let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } =
      args;

    // Resource Specific params
    let author = args['author'];
    let authored = args['authored'];
    let based_on = args['based-on'];
    let _context = args['_context'];
    let identifier = args['identifier'];
    let parent = args['parent'];
    let patient = args['patient'];
    let questionnaire = args['questionnaire'];
    let source = args['source'];
    let status = args['status'];
    let subject = args['subject'];

    // TODO: Build query from Parameters

    // TODO: Query database

    let QuestionnaireResponse = getQuestionnaireResponse(base_version);

    // Cast all results to QuestionnaireResponse Class
    let questionnaireresponse_resource = new QuestionnaireResponse();

    // Return Array
    resolve([questionnaireresponse_resource]);
  });
