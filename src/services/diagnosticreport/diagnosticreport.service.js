/*eslint no-unused-vars: "warn"*/

const { VERSIONS } = require('@asymmetrik/node-fhir-server-core').constants;
const { resolveSchema } = require('@asymmetrik/node-fhir-server-core');
const FHIRServer = require('@asymmetrik/node-fhir-server-core');
const { ObjectID } = require('mongodb');
const logger = require('@asymmetrik/node-fhir-server-core').loggers.get();

let getDiagnosticReport = (base_version) => {
  return resolveSchema(base_version, 'DiagnosticReport');
};

let getMeta = (base_version) => {
  return resolveSchema(base_version, 'Meta');
};

module.exports.search = (args) =>
  new Promise((resolve, reject) => {
    logger.info('DiagnosticReport >>> search');

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
    let diagnosis = args['diagnosis'];
    let encounter = args['encounter'];
    let identifier = args['identifier'];
    let image = args['image'];
    let issued = args['issued'];
    let patient = args['patient'];
    let performer = args['performer'];
    let result = args['result'];
    let specimen = args['specimen'];
    let status = args['status'];
    let subject = args['subject'];

    // TODO: Build query from Parameters

    // TODO: Query database

    let DiagnosticReport = getDiagnosticReport(base_version);

    // Cast all results to DiagnosticReport Class
    let diagnosticreport_resource = new DiagnosticReport();
    // TODO: Set data with constructor or setter methods
    diagnosticreport_resource.id = 'test id';

    // Return Array
    resolve([diagnosticreport_resource]);
  });

module.exports.searchById = (args) =>
  new Promise((resolve, reject) => {
    logger.info('DiagnosticReport >>> searchById');

    let { base_version, id } = args;

    let DiagnosticReport = getDiagnosticReport(base_version);

    // TODO: Build query from Parameters

    // TODO: Query database

    // Cast result to DiagnosticReport Class
    let diagnosticreport_resource = new DiagnosticReport();
    // TODO: Set data with constructor or setter methods
    diagnosticreport_resource.id = 'test id';

    // Return resource class
    // resolve(diagnosticreport_resource);
    resolve();
  });

module.exports.create = (args, { req }) =>
  new Promise((resolve, reject) => {
    logger.info('DiagnosticReport >>> create');

    let { base_version, resource } = args;
    // Make sure to use this ID when inserting this resource
    let id = new ObjectID().toString();

    let DiagnosticReport = getDiagnosticReport(base_version);
    let Meta = getMeta(base_version);

    // TODO: determine if client/server sets ID

    // Cast resource to DiagnosticReport Class
    let diagnosticreport_resource = new DiagnosticReport(resource);
    diagnosticreport_resource.meta = new Meta();
    // TODO: set meta info

    // TODO: save record to database

    // Return Id
    resolve({ id });
  });

module.exports.update = (args, { req }) =>
  new Promise((resolve, reject) => {
    logger.info('DiagnosticReport >>> update');

    let { base_version, id, resource } = args;

    let DiagnosticReport = getDiagnosticReport(base_version);
    let Meta = getMeta(base_version);

    // Cast resource to DiagnosticReport Class
    let diagnosticreport_resource = new DiagnosticReport(resource);
    diagnosticreport_resource.meta = new Meta();
    // TODO: set meta info, increment meta ID

    // TODO: save record to database

    // Return id, if recorded was created or updated, new meta version id
    resolve({
      id: diagnosticreport_resource.id,
      created: false,
      resource_version: diagnosticreport_resource.meta.versionId,
    });
  });

module.exports.remove = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('DiagnosticReport >>> remove');

    let { id } = args;

    // TODO: delete record in database (soft/hard)

    // Return number of records deleted
    resolve({ deleted: 0 });
  });

module.exports.searchByVersionId = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('DiagnosticReport >>> searchByVersionId');

    let { base_version, id, version_id } = args;

    let DiagnosticReport = getDiagnosticReport(base_version);

    // TODO: Build query from Parameters

    // TODO: Query database

    // Cast result to DiagnosticReport Class
    let diagnosticreport_resource = new DiagnosticReport();

    // Return resource class
    resolve(diagnosticreport_resource);
  });

module.exports.history = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('DiagnosticReport >>> history');

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
    let diagnosis = args['diagnosis'];
    let encounter = args['encounter'];
    let identifier = args['identifier'];
    let image = args['image'];
    let issued = args['issued'];
    let patient = args['patient'];
    let performer = args['performer'];
    let result = args['result'];
    let specimen = args['specimen'];
    let status = args['status'];
    let subject = args['subject'];

    // TODO: Build query from Parameters

    // TODO: Query database

    let DiagnosticReport = getDiagnosticReport(base_version);

    // Cast all results to DiagnosticReport Class
    let diagnosticreport_resource = new DiagnosticReport();

    // Return Array
    resolve([diagnosticreport_resource]);
  });

module.exports.historyById = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('DiagnosticReport >>> historyById');

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
    let diagnosis = args['diagnosis'];
    let encounter = args['encounter'];
    let identifier = args['identifier'];
    let image = args['image'];
    let issued = args['issued'];
    let patient = args['patient'];
    let performer = args['performer'];
    let result = args['result'];
    let specimen = args['specimen'];
    let status = args['status'];
    let subject = args['subject'];

    // TODO: Build query from Parameters

    // TODO: Query database

    let DiagnosticReport = getDiagnosticReport(base_version);

    // Cast all results to DiagnosticReport Class
    let diagnosticreport_resource = new DiagnosticReport();

    // Return Array
    resolve([diagnosticreport_resource]);
  });
