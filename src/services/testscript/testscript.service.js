/*eslint no-unused-vars: "warn"*/

const { VERSIONS } = require('@asymmetrik/node-fhir-server-core').constants;
const { resolveSchema } = require('@asymmetrik/node-fhir-server-core');
const FHIRServer = require('@asymmetrik/node-fhir-server-core');
const { ObjectID } = require('mongodb');
const logger = require('@asymmetrik/node-fhir-server-core').loggers.get();

let getTestScript = (base_version) => {
  return resolveSchema(base_version, 'TestScript');
};

let getMeta = (base_version) => {
  return resolveSchema(base_version, 'Meta');
};

module.exports.search = (args) =>
  new Promise((resolve, reject) => {
    logger.info('TestScript >>> search');

    // Common search params
    let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } =
      args;

    // Search Result params
    let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } =
      args;

    // Resource Specific params
    let date = args['date'];
    let description = args['description'];
    let identifier = args['identifier'];
    let jurisdiction = args['jurisdiction'];
    let name = args['name'];
    let publisher = args['publisher'];
    let status = args['status'];
    let testscript_capability = args['testscript-capability'];
    let title = args['title'];
    let url = args['url'];
    let version = args['version'];

    // TODO: Build query from Parameters

    // TODO: Query database

    let TestScript = getTestScript(base_version);

    // Cast all results to TestScript Class
    let testscript_resource = new TestScript();
    // TODO: Set data with constructor or setter methods
    testscript_resource.id = 'test id';

    // Return Array
    resolve([testscript_resource]);
  });

module.exports.searchById = (args) =>
  new Promise((resolve, reject) => {
    logger.info('TestScript >>> searchById');

    let { base_version, id } = args;

    let TestScript = getTestScript(base_version);

    // TODO: Build query from Parameters

    // TODO: Query database

    // Cast result to TestScript Class
    let testscript_resource = new TestScript();
    // TODO: Set data with constructor or setter methods
    testscript_resource.id = 'test id';

    // Return resource class
    // resolve(testscript_resource);
    resolve();
  });

module.exports.create = (args, { req }) =>
  new Promise((resolve, reject) => {
    logger.info('TestScript >>> create');

    let { base_version, resource } = args;
    // Make sure to use this ID when inserting this resource
    let id = new ObjectID().toString();

    let TestScript = getTestScript(base_version);
    let Meta = getMeta(base_version);

    // TODO: determine if client/server sets ID

    // Cast resource to TestScript Class
    let testscript_resource = new TestScript(resource);
    testscript_resource.meta = new Meta();
    // TODO: set meta info

    // TODO: save record to database

    // Return Id
    resolve({ id });
  });

module.exports.update = (args, { req }) =>
  new Promise((resolve, reject) => {
    logger.info('TestScript >>> update');

    let { base_version, id, resource } = args;

    let TestScript = getTestScript(base_version);
    let Meta = getMeta(base_version);

    // Cast resource to TestScript Class
    let testscript_resource = new TestScript(resource);
    testscript_resource.meta = new Meta();
    // TODO: set meta info, increment meta ID

    // TODO: save record to database

    // Return id, if recorded was created or updated, new meta version id
    resolve({
      id: testscript_resource.id,
      created: false,
      resource_version: testscript_resource.meta.versionId,
    });
  });

module.exports.remove = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('TestScript >>> remove');

    let { id } = args;

    // TODO: delete record in database (soft/hard)

    // Return number of records deleted
    resolve({ deleted: 0 });
  });

module.exports.searchByVersionId = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('TestScript >>> searchByVersionId');

    let { base_version, id, version_id } = args;

    let TestScript = getTestScript(base_version);

    // TODO: Build query from Parameters

    // TODO: Query database

    // Cast result to TestScript Class
    let testscript_resource = new TestScript();

    // Return resource class
    resolve(testscript_resource);
  });

module.exports.history = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('TestScript >>> history');

    // Common search params
    let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } =
      args;

    // Search Result params
    let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } =
      args;

    // Resource Specific params
    let date = args['date'];
    let description = args['description'];
    let identifier = args['identifier'];
    let jurisdiction = args['jurisdiction'];
    let name = args['name'];
    let publisher = args['publisher'];
    let status = args['status'];
    let testscript_capability = args['testscript-capability'];
    let title = args['title'];
    let url = args['url'];
    let version = args['version'];

    // TODO: Build query from Parameters

    // TODO: Query database

    let TestScript = getTestScript(base_version);

    // Cast all results to TestScript Class
    let testscript_resource = new TestScript();

    // Return Array
    resolve([testscript_resource]);
  });

module.exports.historyById = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('TestScript >>> historyById');

    // Common search params
    let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } =
      args;

    // Search Result params
    let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } =
      args;

    // Resource Specific params
    let date = args['date'];
    let description = args['description'];
    let identifier = args['identifier'];
    let jurisdiction = args['jurisdiction'];
    let name = args['name'];
    let publisher = args['publisher'];
    let status = args['status'];
    let testscript_capability = args['testscript-capability'];
    let title = args['title'];
    let url = args['url'];
    let version = args['version'];

    // TODO: Build query from Parameters

    // TODO: Query database

    let TestScript = getTestScript(base_version);

    // Cast all results to TestScript Class
    let testscript_resource = new TestScript();

    // Return Array
    resolve([testscript_resource]);
  });
