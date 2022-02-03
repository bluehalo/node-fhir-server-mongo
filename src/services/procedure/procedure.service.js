/*eslint no-unused-vars: "warn"*/

const { VERSIONS } = require('@asymmetrik/node-fhir-server-core').constants;
const { resolveSchema } = require('@asymmetrik/node-fhir-server-core');
const FHIRServer = require('@asymmetrik/node-fhir-server-core');
const { ObjectID } = require('mongodb');
const logger = require('@asymmetrik/node-fhir-server-core').loggers.get();

let getProcedure = (base_version) => {
  return resolveSchema(base_version, 'Procedure');
};

let getMeta = (base_version) => {
  return resolveSchema(base_version, 'Meta');
};

module.exports.search = (args) =>
  new Promise((resolve, reject) => {
    logger.info('Procedure >>> search');

    // Common search params
    let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } =
      args;

    // Search Result params
    let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } =
      args;

    // Resource Specific params
    let based_on = args['based-on'];
    let category = args['category'];
    let code = args['code'];
    let _context = args['_context'];
    let date = args['date'];
    let definition = args['definition'];
    let encounter = args['encounter'];
    let identifier = args['identifier'];
    let location = args['location'];
    let part_of = args['part-of'];
    let patient = args['patient'];
    let performer = args['performer'];
    let status = args['status'];
    let subject = args['subject'];

    // TODO: Build query from Parameters

    // TODO: Query database

    let Procedure = getProcedure(base_version);

    // Cast all results to Procedure Class
    let procedure_resource = new Procedure();
    // TODO: Set data with constructor or setter methods
    procedure_resource.id = 'test id';

    // Return Array
    resolve([procedure_resource]);
  });

module.exports.searchById = (args) =>
  new Promise((resolve, reject) => {
    logger.info('Procedure >>> searchById');

    let { base_version, id } = args;

    let Procedure = getProcedure(base_version);

    // TODO: Build query from Parameters

    // TODO: Query database

    // Cast result to Procedure Class
    let procedure_resource = new Procedure();
    // TODO: Set data with constructor or setter methods
    procedure_resource.id = 'test id';

    // Return resource class
    // resolve(procedure_resource);
    resolve();
  });

module.exports.create = (args, { req }) =>
  new Promise((resolve, reject) => {
    logger.info('Procedure >>> create');

    let { base_version, resource } = args;
    // Make sure to use this ID when inserting this resource
    let id = new ObjectID().toString();

    let Procedure = getProcedure(base_version);
    let Meta = getMeta(base_version);

    // TODO: determine if client/server sets ID

    // Cast resource to Procedure Class
    let procedure_resource = new Procedure(resource);
    procedure_resource.meta = new Meta();
    // TODO: set meta info

    // TODO: save record to database

    // Return Id
    resolve({ id });
  });

module.exports.update = (args, { req }) =>
  new Promise((resolve, reject) => {
    logger.info('Procedure >>> update');

    let { base_version, id, resource } = args;

    let Procedure = getProcedure(base_version);
    let Meta = getMeta(base_version);

    // Cast resource to Procedure Class
    let procedure_resource = new Procedure(resource);
    procedure_resource.meta = new Meta();
    // TODO: set meta info, increment meta ID

    // TODO: save record to database

    // Return id, if recorded was created or updated, new meta version id
    resolve({
      id: procedure_resource.id,
      created: false,
      resource_version: procedure_resource.meta.versionId,
    });
  });

module.exports.remove = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('Procedure >>> remove');

    let { id } = args;

    // TODO: delete record in database (soft/hard)

    // Return number of records deleted
    resolve({ deleted: 0 });
  });

module.exports.searchByVersionId = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('Procedure >>> searchByVersionId');

    let { base_version, id, version_id } = args;

    let Procedure = getProcedure(base_version);

    // TODO: Build query from Parameters

    // TODO: Query database

    // Cast result to Procedure Class
    let procedure_resource = new Procedure();

    // Return resource class
    resolve(procedure_resource);
  });

module.exports.history = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('Procedure >>> history');

    // Common search params
    let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } =
      args;

    // Search Result params
    let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } =
      args;

    // Resource Specific params
    let based_on = args['based-on'];
    let category = args['category'];
    let code = args['code'];
    let _context = args['_context'];
    let date = args['date'];
    let definition = args['definition'];
    let encounter = args['encounter'];
    let identifier = args['identifier'];
    let location = args['location'];
    let part_of = args['part-of'];
    let patient = args['patient'];
    let performer = args['performer'];
    let status = args['status'];
    let subject = args['subject'];

    // TODO: Build query from Parameters

    // TODO: Query database

    let Procedure = getProcedure(base_version);

    // Cast all results to Procedure Class
    let procedure_resource = new Procedure();

    // Return Array
    resolve([procedure_resource]);
  });

module.exports.historyById = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('Procedure >>> historyById');

    // Common search params
    let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } =
      args;

    // Search Result params
    let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } =
      args;

    // Resource Specific params
    let based_on = args['based-on'];
    let category = args['category'];
    let code = args['code'];
    let _context = args['_context'];
    let date = args['date'];
    let definition = args['definition'];
    let encounter = args['encounter'];
    let identifier = args['identifier'];
    let location = args['location'];
    let part_of = args['part-of'];
    let patient = args['patient'];
    let performer = args['performer'];
    let status = args['status'];
    let subject = args['subject'];

    // TODO: Build query from Parameters

    // TODO: Query database

    let Procedure = getProcedure(base_version);

    // Cast all results to Procedure Class
    let procedure_resource = new Procedure();

    // Return Array
    resolve([procedure_resource]);
  });
