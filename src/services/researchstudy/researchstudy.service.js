/*eslint no-unused-vars: "warn"*/

const { VERSIONS } = require('@asymmetrik/node-fhir-server-core').constants;
const { resolveSchema } = require('@asymmetrik/node-fhir-server-core');
const FHIRServer = require('@asymmetrik/node-fhir-server-core');
const { ObjectID } = require('mongodb');
const logger = require('@asymmetrik/node-fhir-server-core').loggers.get();

let getResearchStudy = (base_version) => {
  return resolveSchema(base_version, 'ResearchStudy');
};

let getMeta = (base_version) => {
  return resolveSchema(base_version, 'Meta');
};

module.exports.search = (args) =>
  new Promise((resolve, reject) => {
    logger.info('ResearchStudy >>> search');

    // Common search params
    let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } =
      args;

    // Search Result params
    let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } =
      args;

    // Resource Specific params
    let category = args['category'];
    let date = args['date'];
    let focus = args['focus'];
    let identifier = args['identifier'];
    let jurisdiction = args['jurisdiction'];
    let keyword = args['keyword'];
    let partof = args['partof'];
    let principalinvestigator = args['principalinvestigator'];
    let protocol = args['protocol'];
    let site = args['site'];
    let sponsor = args['sponsor'];
    let status = args['status'];
    let title = args['title'];

    // TODO: Build query from Parameters

    // TODO: Query database

    let ResearchStudy = getResearchStudy(base_version);

    // Cast all results to ResearchStudy Class
    let researchstudy_resource = new ResearchStudy();
    // TODO: Set data with constructor or setter methods
    researchstudy_resource.id = 'test id';

    // Return Array
    resolve([researchstudy_resource]);
  });

module.exports.searchById = (args) =>
  new Promise((resolve, reject) => {
    logger.info('ResearchStudy >>> searchById');

    let { base_version, id } = args;

    let ResearchStudy = getResearchStudy(base_version);

    // TODO: Build query from Parameters

    // TODO: Query database

    // Cast result to ResearchStudy Class
    let researchstudy_resource = new ResearchStudy();
    // TODO: Set data with constructor or setter methods
    researchstudy_resource.id = 'test id';

    // Return resource class
    // resolve(researchstudy_resource);
    resolve();
  });

module.exports.create = (args, { req }) =>
  new Promise((resolve, reject) => {
    logger.info('ResearchStudy >>> create');

    let { base_version, resource } = args;
    // Make sure to use this ID when inserting this resource
    let id = new ObjectID().toString();

    let ResearchStudy = getResearchStudy(base_version);
    let Meta = getMeta(base_version);

    // TODO: determine if client/server sets ID

    // Cast resource to ResearchStudy Class
    let researchstudy_resource = new ResearchStudy(resource);
    researchstudy_resource.meta = new Meta();
    // TODO: set meta info

    // TODO: save record to database

    // Return Id
    resolve({ id });
  });

module.exports.update = (args, { req }) =>
  new Promise((resolve, reject) => {
    logger.info('ResearchStudy >>> update');

    let { base_version, id, resource } = args;

    let ResearchStudy = getResearchStudy(base_version);
    let Meta = getMeta(base_version);

    // Cast resource to ResearchStudy Class
    let researchstudy_resource = new ResearchStudy(resource);
    researchstudy_resource.meta = new Meta();
    // TODO: set meta info, increment meta ID

    // TODO: save record to database

    // Return id, if recorded was created or updated, new meta version id
    resolve({
      id: researchstudy_resource.id,
      created: false,
      resource_version: researchstudy_resource.meta.versionId,
    });
  });

module.exports.remove = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('ResearchStudy >>> remove');

    let { id } = args;

    // TODO: delete record in database (soft/hard)

    // Return number of records deleted
    resolve({ deleted: 0 });
  });

module.exports.searchByVersionId = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('ResearchStudy >>> searchByVersionId');

    let { base_version, id, version_id } = args;

    let ResearchStudy = getResearchStudy(base_version);

    // TODO: Build query from Parameters

    // TODO: Query database

    // Cast result to ResearchStudy Class
    let researchstudy_resource = new ResearchStudy();

    // Return resource class
    resolve(researchstudy_resource);
  });

module.exports.history = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('ResearchStudy >>> history');

    // Common search params
    let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } =
      args;

    // Search Result params
    let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } =
      args;

    // Resource Specific params
    let category = args['category'];
    let date = args['date'];
    let focus = args['focus'];
    let identifier = args['identifier'];
    let jurisdiction = args['jurisdiction'];
    let keyword = args['keyword'];
    let partof = args['partof'];
    let principalinvestigator = args['principalinvestigator'];
    let protocol = args['protocol'];
    let site = args['site'];
    let sponsor = args['sponsor'];
    let status = args['status'];
    let title = args['title'];

    // TODO: Build query from Parameters

    // TODO: Query database

    let ResearchStudy = getResearchStudy(base_version);

    // Cast all results to ResearchStudy Class
    let researchstudy_resource = new ResearchStudy();

    // Return Array
    resolve([researchstudy_resource]);
  });

module.exports.historyById = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('ResearchStudy >>> historyById');

    // Common search params
    let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } =
      args;

    // Search Result params
    let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } =
      args;

    // Resource Specific params
    let category = args['category'];
    let date = args['date'];
    let focus = args['focus'];
    let identifier = args['identifier'];
    let jurisdiction = args['jurisdiction'];
    let keyword = args['keyword'];
    let partof = args['partof'];
    let principalinvestigator = args['principalinvestigator'];
    let protocol = args['protocol'];
    let site = args['site'];
    let sponsor = args['sponsor'];
    let status = args['status'];
    let title = args['title'];

    // TODO: Build query from Parameters

    // TODO: Query database

    let ResearchStudy = getResearchStudy(base_version);

    // Cast all results to ResearchStudy Class
    let researchstudy_resource = new ResearchStudy();

    // Return Array
    resolve([researchstudy_resource]);
  });
