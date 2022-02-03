/*eslint no-unused-vars: "warn"*/

const { VERSIONS } = require('@asymmetrik/node-fhir-server-core').constants;
const { resolveSchema } = require('@asymmetrik/node-fhir-server-core');
const FHIRServer = require('@asymmetrik/node-fhir-server-core');
const { ObjectID } = require('mongodb');
const logger = require('@asymmetrik/node-fhir-server-core').loggers.get();

let getTask = (base_version) => {
  return resolveSchema(base_version, 'Task');
};

let getMeta = (base_version) => {
  return resolveSchema(base_version, 'Meta');
};

module.exports.search = (args) =>
  new Promise((resolve, reject) => {
    logger.info('Task >>> search');

    // Common search params
    let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } =
      args;

    // Search Result params
    let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } =
      args;

    // Resource Specific params
    let authored_on = args['authored-on'];
    let based_on = args['based-on'];
    let business_status = args['business-status'];
    let code = args['code'];
    let _context = args['_context'];
    let focus = args['focus'];
    let group_identifier = args['group-identifier'];
    let identifier = args['identifier'];
    let intent = args['intent'];
    let modified = args['modified'];
    let organization = args['organization'];
    let owner = args['owner'];
    let part_of = args['part-of'];
    let patient = args['patient'];
    let performer = args['performer'];
    let period = args['period'];
    let priority = args['priority'];
    let requester = args['requester'];
    let status = args['status'];
    let subject = args['subject'];

    // TODO: Build query from Parameters

    // TODO: Query database

    let Task = getTask(base_version);

    // Cast all results to Task Class
    let task_resource = new Task();
    // TODO: Set data with constructor or setter methods
    task_resource.id = 'test id';

    // Return Array
    resolve([task_resource]);
  });

module.exports.searchById = (args) =>
  new Promise((resolve, reject) => {
    logger.info('Task >>> searchById');

    let { base_version, id } = args;

    let Task = getTask(base_version);

    // TODO: Build query from Parameters

    // TODO: Query database

    // Cast result to Task Class
    let task_resource = new Task();
    // TODO: Set data with constructor or setter methods
    task_resource.id = 'test id';

    // Return resource class
    // resolve(task_resource);
    resolve();
  });

module.exports.create = (args, { req }) =>
  new Promise((resolve, reject) => {
    logger.info('Task >>> create');

    let { base_version, resource } = args;
    // Make sure to use this ID when inserting this resource
    let id = new ObjectID().toString();

    let Task = getTask(base_version);
    let Meta = getMeta(base_version);

    // TODO: determine if client/server sets ID

    // Cast resource to Task Class
    let task_resource = new Task(resource);
    task_resource.meta = new Meta();
    // TODO: set meta info

    // TODO: save record to database

    // Return Id
    resolve({ id });
  });

module.exports.update = (args, { req }) =>
  new Promise((resolve, reject) => {
    logger.info('Task >>> update');

    let { base_version, id, resource } = args;

    let Task = getTask(base_version);
    let Meta = getMeta(base_version);

    // Cast resource to Task Class
    let task_resource = new Task(resource);
    task_resource.meta = new Meta();
    // TODO: set meta info, increment meta ID

    // TODO: save record to database

    // Return id, if recorded was created or updated, new meta version id
    resolve({
      id: task_resource.id,
      created: false,
      resource_version: task_resource.meta.versionId,
    });
  });

module.exports.remove = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('Task >>> remove');

    let { id } = args;

    // TODO: delete record in database (soft/hard)

    // Return number of records deleted
    resolve({ deleted: 0 });
  });

module.exports.searchByVersionId = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('Task >>> searchByVersionId');

    let { base_version, id, version_id } = args;

    let Task = getTask(base_version);

    // TODO: Build query from Parameters

    // TODO: Query database

    // Cast result to Task Class
    let task_resource = new Task();

    // Return resource class
    resolve(task_resource);
  });

module.exports.history = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('Task >>> history');

    // Common search params
    let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } =
      args;

    // Search Result params
    let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } =
      args;

    // Resource Specific params
    let authored_on = args['authored-on'];
    let based_on = args['based-on'];
    let business_status = args['business-status'];
    let code = args['code'];
    let _context = args['_context'];
    let focus = args['focus'];
    let group_identifier = args['group-identifier'];
    let identifier = args['identifier'];
    let intent = args['intent'];
    let modified = args['modified'];
    let organization = args['organization'];
    let owner = args['owner'];
    let part_of = args['part-of'];
    let patient = args['patient'];
    let performer = args['performer'];
    let period = args['period'];
    let priority = args['priority'];
    let requester = args['requester'];
    let status = args['status'];
    let subject = args['subject'];

    // TODO: Build query from Parameters

    // TODO: Query database

    let Task = getTask(base_version);

    // Cast all results to Task Class
    let task_resource = new Task();

    // Return Array
    resolve([task_resource]);
  });

module.exports.historyById = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('Task >>> historyById');

    // Common search params
    let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } =
      args;

    // Search Result params
    let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } =
      args;

    // Resource Specific params
    let authored_on = args['authored-on'];
    let based_on = args['based-on'];
    let business_status = args['business-status'];
    let code = args['code'];
    let _context = args['_context'];
    let focus = args['focus'];
    let group_identifier = args['group-identifier'];
    let identifier = args['identifier'];
    let intent = args['intent'];
    let modified = args['modified'];
    let organization = args['organization'];
    let owner = args['owner'];
    let part_of = args['part-of'];
    let patient = args['patient'];
    let performer = args['performer'];
    let period = args['period'];
    let priority = args['priority'];
    let requester = args['requester'];
    let status = args['status'];
    let subject = args['subject'];

    // TODO: Build query from Parameters

    // TODO: Query database

    let Task = getTask(base_version);

    // Cast all results to Task Class
    let task_resource = new Task();

    // Return Array
    resolve([task_resource]);
  });
