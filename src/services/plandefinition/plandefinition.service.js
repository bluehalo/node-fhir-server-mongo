/*eslint no-unused-vars: "warn"*/

const { VERSIONS } = require('@asymmetrik/node-fhir-server-core').constants;
const { resolveSchema } = require('@asymmetrik/node-fhir-server-core');
const FHIRServer = require('@asymmetrik/node-fhir-server-core');
const { ObjectID } = require('mongodb');
const logger = require('@asymmetrik/node-fhir-server-core').loggers.get();

let getPlanDefinition = (base_version) => {
  return resolveSchema(base_version, 'PlanDefinition');
};

let getMeta = (base_version) => {
  return resolveSchema(base_version, 'Meta');
};

module.exports.search = (args) =>
  new Promise((resolve, reject) => {
    logger.info('PlanDefinition >>> search');

    // Common search params
    let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } =
      args;

    // Search Result params
    let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } =
      args;

    // Resource Specific params
    let composed_of = args['composed-of'];
    let date = args['date'];
    let depends_on = args['depends-on'];
    let derived_from = args['derived-from'];
    let description = args['description'];
    let effective = args['effective'];
    let identifier = args['identifier'];
    let jurisdiction = args['jurisdiction'];
    let name = args['name'];
    let predecessor = args['predecessor'];
    let publisher = args['publisher'];
    let status = args['status'];
    let successor = args['successor'];
    let title = args['title'];
    let topic = args['topic'];
    let url = args['url'];
    let version = args['version'];

    // TODO: Build query from Parameters

    // TODO: Query database

    let PlanDefinition = getPlanDefinition(base_version);

    // Cast all results to PlanDefinition Class
    let plandefinition_resource = new PlanDefinition();
    // TODO: Set data with constructor or setter methods
    plandefinition_resource.id = 'test id';

    // Return Array
    resolve([plandefinition_resource]);
  });

module.exports.searchById = (args) =>
  new Promise((resolve, reject) => {
    logger.info('PlanDefinition >>> searchById');

    let { base_version, id } = args;

    let PlanDefinition = getPlanDefinition(base_version);

    // TODO: Build query from Parameters

    // TODO: Query database

    // Cast result to PlanDefinition Class
    let plandefinition_resource = new PlanDefinition();
    // TODO: Set data with constructor or setter methods
    plandefinition_resource.id = 'test id';

    // Return resource class
    // resolve(plandefinition_resource);
    resolve();
  });

module.exports.create = (args, { req }) =>
  new Promise((resolve, reject) => {
    logger.info('PlanDefinition >>> create');

    let { base_version, resource } = args;
    // Make sure to use this ID when inserting this resource
    let id = new ObjectID().toString();

    let PlanDefinition = getPlanDefinition(base_version);
    let Meta = getMeta(base_version);

    // TODO: determine if client/server sets ID

    // Cast resource to PlanDefinition Class
    let plandefinition_resource = new PlanDefinition(resource);
    plandefinition_resource.meta = new Meta();
    // TODO: set meta info

    // TODO: save record to database

    // Return Id
    resolve({ id });
  });

module.exports.update = (args, { req }) =>
  new Promise((resolve, reject) => {
    logger.info('PlanDefinition >>> update');

    let { base_version, id, resource } = args;

    let PlanDefinition = getPlanDefinition(base_version);
    let Meta = getMeta(base_version);

    // Cast resource to PlanDefinition Class
    let plandefinition_resource = new PlanDefinition(resource);
    plandefinition_resource.meta = new Meta();
    // TODO: set meta info, increment meta ID

    // TODO: save record to database

    // Return id, if recorded was created or updated, new meta version id
    resolve({
      id: plandefinition_resource.id,
      created: false,
      resource_version: plandefinition_resource.meta.versionId,
    });
  });

module.exports.remove = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('PlanDefinition >>> remove');

    let { id } = args;

    // TODO: delete record in database (soft/hard)

    // Return number of records deleted
    resolve({ deleted: 0 });
  });

module.exports.searchByVersionId = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('PlanDefinition >>> searchByVersionId');

    let { base_version, id, version_id } = args;

    let PlanDefinition = getPlanDefinition(base_version);

    // TODO: Build query from Parameters

    // TODO: Query database

    // Cast result to PlanDefinition Class
    let plandefinition_resource = new PlanDefinition();

    // Return resource class
    resolve(plandefinition_resource);
  });

module.exports.history = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('PlanDefinition >>> history');

    // Common search params
    let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } =
      args;

    // Search Result params
    let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } =
      args;

    // Resource Specific params
    let composed_of = args['composed-of'];
    let date = args['date'];
    let depends_on = args['depends-on'];
    let derived_from = args['derived-from'];
    let description = args['description'];
    let effective = args['effective'];
    let identifier = args['identifier'];
    let jurisdiction = args['jurisdiction'];
    let name = args['name'];
    let predecessor = args['predecessor'];
    let publisher = args['publisher'];
    let status = args['status'];
    let successor = args['successor'];
    let title = args['title'];
    let topic = args['topic'];
    let url = args['url'];
    let version = args['version'];

    // TODO: Build query from Parameters

    // TODO: Query database

    let PlanDefinition = getPlanDefinition(base_version);

    // Cast all results to PlanDefinition Class
    let plandefinition_resource = new PlanDefinition();

    // Return Array
    resolve([plandefinition_resource]);
  });

module.exports.historyById = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('PlanDefinition >>> historyById');

    // Common search params
    let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } =
      args;

    // Search Result params
    let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } =
      args;

    // Resource Specific params
    let composed_of = args['composed-of'];
    let date = args['date'];
    let depends_on = args['depends-on'];
    let derived_from = args['derived-from'];
    let description = args['description'];
    let effective = args['effective'];
    let identifier = args['identifier'];
    let jurisdiction = args['jurisdiction'];
    let name = args['name'];
    let predecessor = args['predecessor'];
    let publisher = args['publisher'];
    let status = args['status'];
    let successor = args['successor'];
    let title = args['title'];
    let topic = args['topic'];
    let url = args['url'];
    let version = args['version'];

    // TODO: Build query from Parameters

    // TODO: Query database

    let PlanDefinition = getPlanDefinition(base_version);

    // Cast all results to PlanDefinition Class
    let plandefinition_resource = new PlanDefinition();

    // Return Array
    resolve([plandefinition_resource]);
  });
