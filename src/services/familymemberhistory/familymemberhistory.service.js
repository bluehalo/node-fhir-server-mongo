/*eslint no-unused-vars: "warn"*/

const { VERSIONS } = require('@asymmetrik/node-fhir-server-core').constants;
const { resolveSchema } = require('@asymmetrik/node-fhir-server-core');
const FHIRServer = require('@asymmetrik/node-fhir-server-core');
const { ObjectID } = require('mongodb');
const logger = require('@asymmetrik/node-fhir-server-core').loggers.get();

let getFamilyMemberHistory = (base_version) => {
  return resolveSchema(base_version, 'FamilyMemberHistory');
};

let getMeta = (base_version) => {
  return resolveSchema(base_version, 'Meta');
};

module.exports.search = (args) =>
  new Promise((resolve, reject) => {
    logger.info('FamilyMemberHistory >>> search');

    // Common search params
    let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } =
      args;

    // Search Result params
    let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } =
      args;

    // Resource Specific params
    let code = args['code'];
    let date = args['date'];
    let definition = args['definition'];
    let gender = args['gender'];
    let identifier = args['identifier'];
    let patient = args['patient'];
    let relationship = args['relationship'];
    let status = args['status'];

    // TODO: Build query from Parameters

    // TODO: Query database

    let FamilyMemberHistory = getFamilyMemberHistory(base_version);

    // Cast all results to FamilyMemberHistory Class
    let familymemberhistory_resource = new FamilyMemberHistory();
    // TODO: Set data with constructor or setter methods
    familymemberhistory_resource.id = 'test id';

    // Return Array
    resolve([familymemberhistory_resource]);
  });

module.exports.searchById = (args) =>
  new Promise((resolve, reject) => {
    logger.info('FamilyMemberHistory >>> searchById');

    let { base_version, id } = args;

    let FamilyMemberHistory = getFamilyMemberHistory(base_version);

    // TODO: Build query from Parameters

    // TODO: Query database

    // Cast result to FamilyMemberHistory Class
    let familymemberhistory_resource = new FamilyMemberHistory();
    // TODO: Set data with constructor or setter methods
    familymemberhistory_resource.id = 'test id';

    // Return resource class
    // resolve(familymemberhistory_resource);
    resolve();
  });

module.exports.create = (args, { req }) =>
  new Promise((resolve, reject) => {
    logger.info('FamilyMemberHistory >>> create');

    let { base_version, resource } = args;
    // Make sure to use this ID when inserting this resource
    let id = new ObjectID().toString();

    let FamilyMemberHistory = getFamilyMemberHistory(base_version);
    let Meta = getMeta(base_version);

    // TODO: determine if client/server sets ID

    // Cast resource to FamilyMemberHistory Class
    let familymemberhistory_resource = new FamilyMemberHistory(resource);
    familymemberhistory_resource.meta = new Meta();
    // TODO: set meta info

    // TODO: save record to database

    // Return Id
    resolve({ id });
  });

module.exports.update = (args, { req }) =>
  new Promise((resolve, reject) => {
    logger.info('FamilyMemberHistory >>> update');

    let { base_version, id, resource } = args;

    let FamilyMemberHistory = getFamilyMemberHistory(base_version);
    let Meta = getMeta(base_version);

    // Cast resource to FamilyMemberHistory Class
    let familymemberhistory_resource = new FamilyMemberHistory(resource);
    familymemberhistory_resource.meta = new Meta();
    // TODO: set meta info, increment meta ID

    // TODO: save record to database

    // Return id, if recorded was created or updated, new meta version id
    resolve({
      id: familymemberhistory_resource.id,
      created: false,
      resource_version: familymemberhistory_resource.meta.versionId,
    });
  });

module.exports.remove = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('FamilyMemberHistory >>> remove');

    let { id } = args;

    // TODO: delete record in database (soft/hard)

    // Return number of records deleted
    resolve({ deleted: 0 });
  });

module.exports.searchByVersionId = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('FamilyMemberHistory >>> searchByVersionId');

    let { base_version, id, version_id } = args;

    let FamilyMemberHistory = getFamilyMemberHistory(base_version);

    // TODO: Build query from Parameters

    // TODO: Query database

    // Cast result to FamilyMemberHistory Class
    let familymemberhistory_resource = new FamilyMemberHistory();

    // Return resource class
    resolve(familymemberhistory_resource);
  });

module.exports.history = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('FamilyMemberHistory >>> history');

    // Common search params
    let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } =
      args;

    // Search Result params
    let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } =
      args;

    // Resource Specific params
    let code = args['code'];
    let date = args['date'];
    let definition = args['definition'];
    let gender = args['gender'];
    let identifier = args['identifier'];
    let patient = args['patient'];
    let relationship = args['relationship'];
    let status = args['status'];

    // TODO: Build query from Parameters

    // TODO: Query database

    let FamilyMemberHistory = getFamilyMemberHistory(base_version);

    // Cast all results to FamilyMemberHistory Class
    let familymemberhistory_resource = new FamilyMemberHistory();

    // Return Array
    resolve([familymemberhistory_resource]);
  });

module.exports.historyById = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('FamilyMemberHistory >>> historyById');

    // Common search params
    let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } =
      args;

    // Search Result params
    let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } =
      args;

    // Resource Specific params
    let code = args['code'];
    let date = args['date'];
    let definition = args['definition'];
    let gender = args['gender'];
    let identifier = args['identifier'];
    let patient = args['patient'];
    let relationship = args['relationship'];
    let status = args['status'];

    // TODO: Build query from Parameters

    // TODO: Query database

    let FamilyMemberHistory = getFamilyMemberHistory(base_version);

    // Cast all results to FamilyMemberHistory Class
    let familymemberhistory_resource = new FamilyMemberHistory();

    // Return Array
    resolve([familymemberhistory_resource]);
  });
