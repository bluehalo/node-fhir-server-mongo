/*eslint no-unused-vars: "warn"*/

const { VERSIONS } = require('@asymmetrik/node-fhir-server-core').constants;
const { resolveSchema } = require('@asymmetrik/node-fhir-server-core');
const FHIRServer = require('@asymmetrik/node-fhir-server-core');
const { ObjectID } = require('mongodb');
const logger = require('@asymmetrik/node-fhir-server-core').loggers.get();

let getGoal = (base_version) => {
  return resolveSchema(base_version, 'Goal');
};

let getMeta = (base_version) => {
  return resolveSchema(base_version, 'Meta');
};

module.exports.search = (args) =>
  new Promise((resolve, reject) => {
    logger.info('Goal >>> search');

    // Common search params
    let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } =
      args;

    // Search Result params
    let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } =
      args;

    // Resource Specific params
    let category = args['category'];
    let identifier = args['identifier'];
    let patient = args['patient'];
    let start_date = args['start-date'];
    let status = args['status'];
    let subject = args['subject'];
    let target_date = args['target-date'];

    // TODO: Build query from Parameters

    // TODO: Query database

    let Goal = getGoal(base_version);

    // Cast all results to Goal Class
    let goal_resource = new Goal();
    // TODO: Set data with constructor or setter methods
    goal_resource.id = 'test id';

    // Return Array
    resolve([goal_resource]);
  });

module.exports.searchById = (args) =>
  new Promise((resolve, reject) => {
    logger.info('Goal >>> searchById');

    let { base_version, id } = args;

    let Goal = getGoal(base_version);

    // TODO: Build query from Parameters

    // TODO: Query database

    // Cast result to Goal Class
    let goal_resource = new Goal();
    // TODO: Set data with constructor or setter methods
    goal_resource.id = 'test id';

    // Return resource class
    // resolve(goal_resource);
    resolve();
  });

module.exports.create = (args, { req }) =>
  new Promise((resolve, reject) => {
    logger.info('Goal >>> create');

    let { base_version, resource } = args;
    // Make sure to use this ID when inserting this resource
    let id = new ObjectID().toString();

    let Goal = getGoal(base_version);
    let Meta = getMeta(base_version);

    // TODO: determine if client/server sets ID

    // Cast resource to Goal Class
    let goal_resource = new Goal(resource);
    goal_resource.meta = new Meta();
    // TODO: set meta info

    // TODO: save record to database

    // Return Id
    resolve({ id });
  });

module.exports.update = (args, { req }) =>
  new Promise((resolve, reject) => {
    logger.info('Goal >>> update');

    let { base_version, id, resource } = args;

    let Goal = getGoal(base_version);
    let Meta = getMeta(base_version);

    // Cast resource to Goal Class
    let goal_resource = new Goal(resource);
    goal_resource.meta = new Meta();
    // TODO: set meta info, increment meta ID

    // TODO: save record to database

    // Return id, if recorded was created or updated, new meta version id
    resolve({
      id: goal_resource.id,
      created: false,
      resource_version: goal_resource.meta.versionId,
    });
  });

module.exports.remove = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('Goal >>> remove');

    let { id } = args;

    // TODO: delete record in database (soft/hard)

    // Return number of records deleted
    resolve({ deleted: 0 });
  });

module.exports.searchByVersionId = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('Goal >>> searchByVersionId');

    let { base_version, id, version_id } = args;

    let Goal = getGoal(base_version);

    // TODO: Build query from Parameters

    // TODO: Query database

    // Cast result to Goal Class
    let goal_resource = new Goal();

    // Return resource class
    resolve(goal_resource);
  });

module.exports.history = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('Goal >>> history');

    // Common search params
    let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } =
      args;

    // Search Result params
    let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } =
      args;

    // Resource Specific params
    let category = args['category'];
    let identifier = args['identifier'];
    let patient = args['patient'];
    let start_date = args['start-date'];
    let status = args['status'];
    let subject = args['subject'];
    let target_date = args['target-date'];

    // TODO: Build query from Parameters

    // TODO: Query database

    let Goal = getGoal(base_version);

    // Cast all results to Goal Class
    let goal_resource = new Goal();

    // Return Array
    resolve([goal_resource]);
  });

module.exports.historyById = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('Goal >>> historyById');

    // Common search params
    let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } =
      args;

    // Search Result params
    let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } =
      args;

    // Resource Specific params
    let category = args['category'];
    let identifier = args['identifier'];
    let patient = args['patient'];
    let start_date = args['start-date'];
    let status = args['status'];
    let subject = args['subject'];
    let target_date = args['target-date'];

    // TODO: Build query from Parameters

    // TODO: Query database

    let Goal = getGoal(base_version);

    // Cast all results to Goal Class
    let goal_resource = new Goal();

    // Return Array
    resolve([goal_resource]);
  });
