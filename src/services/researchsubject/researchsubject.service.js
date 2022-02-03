/*eslint no-unused-vars: "warn"*/

const { VERSIONS } = require('@asymmetrik/node-fhir-server-core').constants;
const { resolveSchema } = require('@asymmetrik/node-fhir-server-core');
const FHIRServer = require('@asymmetrik/node-fhir-server-core');
const { ObjectID } = require('mongodb');
const logger = require('@asymmetrik/node-fhir-server-core').loggers.get();

let getResearchSubject = (base_version) => {
  return resolveSchema(base_version, 'ResearchSubject');
};

let getMeta = (base_version) => {
  return resolveSchema(base_version, 'Meta');
};

module.exports.search = (args) =>
  new Promise((resolve, reject) => {
    logger.info('ResearchSubject >>> search');

    // Common search params
    let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } =
      args;

    // Search Result params
    let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } =
      args;

    // Resource Specific params
    let date = args['date'];
    let identifier = args['identifier'];
    let individual = args['individual'];
    let patient = args['patient'];
    let status = args['status'];

    // TODO: Build query from Parameters

    // TODO: Query database

    let ResearchSubject = getResearchSubject(base_version);

    // Cast all results to ResearchSubject Class
    let researchsubject_resource = new ResearchSubject();
    // TODO: Set data with constructor or setter methods
    researchsubject_resource.id = 'test id';

    // Return Array
    resolve([researchsubject_resource]);
  });

module.exports.searchById = (args) =>
  new Promise((resolve, reject) => {
    logger.info('ResearchSubject >>> searchById');

    let { base_version, id } = args;

    let ResearchSubject = getResearchSubject(base_version);

    // TODO: Build query from Parameters

    // TODO: Query database

    // Cast result to ResearchSubject Class
    let researchsubject_resource = new ResearchSubject();
    // TODO: Set data with constructor or setter methods
    researchsubject_resource.id = 'test id';

    // Return resource class
    // resolve(researchsubject_resource);
    resolve();
  });

module.exports.create = (args, { req }) =>
  new Promise((resolve, reject) => {
    logger.info('ResearchSubject >>> create');

    let { base_version, resource } = args;
    // Make sure to use this ID when inserting this resource
    let id = new ObjectID().toString();

    let ResearchSubject = getResearchSubject(base_version);
    let Meta = getMeta(base_version);

    // TODO: determine if client/server sets ID

    // Cast resource to ResearchSubject Class
    let researchsubject_resource = new ResearchSubject(resource);
    researchsubject_resource.meta = new Meta();
    // TODO: set meta info

    // TODO: save record to database

    // Return Id
    resolve({ id });
  });

module.exports.update = (args, { req }) =>
  new Promise((resolve, reject) => {
    logger.info('ResearchSubject >>> update');

    let { base_version, id, resource } = args;

    let ResearchSubject = getResearchSubject(base_version);
    let Meta = getMeta(base_version);

    // Cast resource to ResearchSubject Class
    let researchsubject_resource = new ResearchSubject(resource);
    researchsubject_resource.meta = new Meta();
    // TODO: set meta info, increment meta ID

    // TODO: save record to database

    // Return id, if recorded was created or updated, new meta version id
    resolve({
      id: researchsubject_resource.id,
      created: false,
      resource_version: researchsubject_resource.meta.versionId,
    });
  });

module.exports.remove = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('ResearchSubject >>> remove');

    let { id } = args;

    // TODO: delete record in database (soft/hard)

    // Return number of records deleted
    resolve({ deleted: 0 });
  });

module.exports.searchByVersionId = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('ResearchSubject >>> searchByVersionId');

    let { base_version, id, version_id } = args;

    let ResearchSubject = getResearchSubject(base_version);

    // TODO: Build query from Parameters

    // TODO: Query database

    // Cast result to ResearchSubject Class
    let researchsubject_resource = new ResearchSubject();

    // Return resource class
    resolve(researchsubject_resource);
  });

module.exports.history = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('ResearchSubject >>> history');

    // Common search params
    let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } =
      args;

    // Search Result params
    let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } =
      args;

    // Resource Specific params
    let date = args['date'];
    let identifier = args['identifier'];
    let individual = args['individual'];
    let patient = args['patient'];
    let status = args['status'];

    // TODO: Build query from Parameters

    // TODO: Query database

    let ResearchSubject = getResearchSubject(base_version);

    // Cast all results to ResearchSubject Class
    let researchsubject_resource = new ResearchSubject();

    // Return Array
    resolve([researchsubject_resource]);
  });

module.exports.historyById = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('ResearchSubject >>> historyById');

    // Common search params
    let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } =
      args;

    // Search Result params
    let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } =
      args;

    // Resource Specific params
    let date = args['date'];
    let identifier = args['identifier'];
    let individual = args['individual'];
    let patient = args['patient'];
    let status = args['status'];

    // TODO: Build query from Parameters

    // TODO: Query database

    let ResearchSubject = getResearchSubject(base_version);

    // Cast all results to ResearchSubject Class
    let researchsubject_resource = new ResearchSubject();

    // Return Array
    resolve([researchsubject_resource]);
  });
