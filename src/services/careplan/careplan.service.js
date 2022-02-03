/*eslint no-unused-vars: "warn"*/

const { VERSIONS } = require('@asymmetrik/node-fhir-server-core').constants;
const { resolveSchema } = require('@asymmetrik/node-fhir-server-core');
const FHIRServer = require('@asymmetrik/node-fhir-server-core');
const { ObjectID } = require('mongodb');
const logger = require('@asymmetrik/node-fhir-server-core').loggers.get();

let getCarePlan = (base_version) => {
  return resolveSchema(base_version, 'CarePlan');
};

let getMeta = (base_version) => {
  return resolveSchema(base_version, 'Meta');
};

module.exports.search = (args) =>
  new Promise((resolve, reject) => {
    logger.info('CarePlan >>> search');

    // Common search params
    let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } =
      args;

    // Search Result params
    let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } =
      args;

    // Resource Specific params
    let activity_code = args['activity-code'];
    let activity_date = args['activity-date'];
    let activity_reference = args['activity-reference'];
    let based_on = args['based-on'];
    let care_team = args['care-team'];
    let category = args['category'];
    let condition = args['condition'];
    let _context = args['_context'];
    let date = args['date'];
    let definition = args['definition'];
    let encounter = args['encounter'];
    let goal = args['goal'];
    let identifier = args['identifier'];
    let intent = args['intent'];
    let part_of = args['part-of'];
    let patient = args['patient'];
    let performer = args['performer'];
    let replaces = args['replaces'];
    let status = args['status'];
    let subject = args['subject'];

    // TODO: Build query from Parameters

    // TODO: Query database

    let CarePlan = getCarePlan(base_version);

    // Cast all results to CarePlan Class
    let careplan_resource = new CarePlan();
    // TODO: Set data with constructor or setter methods
    careplan_resource.id = 'test id';

    // Return Array
    resolve([careplan_resource]);
  });

module.exports.searchById = (args) =>
  new Promise((resolve, reject) => {
    logger.info('CarePlan >>> searchById');

    let { base_version, id } = args;

    let CarePlan = getCarePlan(base_version);

    // TODO: Build query from Parameters

    // TODO: Query database

    // Cast result to CarePlan Class
    let careplan_resource = new CarePlan();
    // TODO: Set data with constructor or setter methods
    careplan_resource.id = 'test id';

    // Return resource class
    // resolve(careplan_resource);
    resolve();
  });

module.exports.create = (args, { req }) =>
  new Promise((resolve, reject) => {
    logger.info('CarePlan >>> create');

    let { base_version, resource } = args;
    // Make sure to use this ID when inserting this resource
    let id = new ObjectID().toString();

    let CarePlan = getCarePlan(base_version);
    let Meta = getMeta(base_version);

    // TODO: determine if client/server sets ID

    // Cast resource to CarePlan Class
    let careplan_resource = new CarePlan(resource);
    careplan_resource.meta = new Meta();
    // TODO: set meta info

    // TODO: save record to database

    // Return Id
    resolve({ id });
  });

module.exports.update = (args, { req }) =>
  new Promise((resolve, reject) => {
    logger.info('CarePlan >>> update');

    let { base_version, id, resource } = args;

    let CarePlan = getCarePlan(base_version);
    let Meta = getMeta(base_version);

    // Cast resource to CarePlan Class
    let careplan_resource = new CarePlan(resource);
    careplan_resource.meta = new Meta();
    // TODO: set meta info, increment meta ID

    // TODO: save record to database

    // Return id, if recorded was created or updated, new meta version id
    resolve({
      id: careplan_resource.id,
      created: false,
      resource_version: careplan_resource.meta.versionId,
    });
  });

module.exports.remove = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('CarePlan >>> remove');

    let { id } = args;

    // TODO: delete record in database (soft/hard)

    // Return number of records deleted
    resolve({ deleted: 0 });
  });

module.exports.searchByVersionId = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('CarePlan >>> searchByVersionId');

    let { base_version, id, version_id } = args;

    let CarePlan = getCarePlan(base_version);

    // TODO: Build query from Parameters

    // TODO: Query database

    // Cast result to CarePlan Class
    let careplan_resource = new CarePlan();

    // Return resource class
    resolve(careplan_resource);
  });

module.exports.history = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('CarePlan >>> history');

    // Common search params
    let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } =
      args;

    // Search Result params
    let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } =
      args;

    // Resource Specific params
    let activity_code = args['activity-code'];
    let activity_date = args['activity-date'];
    let activity_reference = args['activity-reference'];
    let based_on = args['based-on'];
    let care_team = args['care-team'];
    let category = args['category'];
    let condition = args['condition'];
    let _context = args['_context'];
    let date = args['date'];
    let definition = args['definition'];
    let encounter = args['encounter'];
    let goal = args['goal'];
    let identifier = args['identifier'];
    let intent = args['intent'];
    let part_of = args['part-of'];
    let patient = args['patient'];
    let performer = args['performer'];
    let replaces = args['replaces'];
    let status = args['status'];
    let subject = args['subject'];

    // TODO: Build query from Parameters

    // TODO: Query database

    let CarePlan = getCarePlan(base_version);

    // Cast all results to CarePlan Class
    let careplan_resource = new CarePlan();

    // Return Array
    resolve([careplan_resource]);
  });

module.exports.historyById = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('CarePlan >>> historyById');

    // Common search params
    let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } =
      args;

    // Search Result params
    let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } =
      args;

    // Resource Specific params
    let activity_code = args['activity-code'];
    let activity_date = args['activity-date'];
    let activity_reference = args['activity-reference'];
    let based_on = args['based-on'];
    let care_team = args['care-team'];
    let category = args['category'];
    let condition = args['condition'];
    let _context = args['_context'];
    let date = args['date'];
    let definition = args['definition'];
    let encounter = args['encounter'];
    let goal = args['goal'];
    let identifier = args['identifier'];
    let intent = args['intent'];
    let part_of = args['part-of'];
    let patient = args['patient'];
    let performer = args['performer'];
    let replaces = args['replaces'];
    let status = args['status'];
    let subject = args['subject'];

    // TODO: Build query from Parameters

    // TODO: Query database

    let CarePlan = getCarePlan(base_version);

    // Cast all results to CarePlan Class
    let careplan_resource = new CarePlan();

    // Return Array
    resolve([careplan_resource]);
  });
