/*eslint no-unused-vars: "warn"*/

const { VERSIONS } = require('@asymmetrik/node-fhir-server-core').constants;
const { resolveSchema } = require('@asymmetrik/node-fhir-server-core');
const FHIRServer = require('@asymmetrik/node-fhir-server-core');
const { ObjectID } = require('mongodb');
const logger = require('@asymmetrik/node-fhir-server-core').loggers.get();

let getCapabilityStatement = (base_version) => {
  return resolveSchema(base_version, 'CapabilityStatement');
};

let getMeta = (base_version) => {
  return resolveSchema(base_version, 'Meta');
};

module.exports.search = (args) =>
  new Promise((resolve, reject) => {
    logger.info('CapabilityStatement >>> search');

    // Common search params
    let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } =
      args;

    // Search Result params
    let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } =
      args;

    // Resource Specific params
    let date = args['date'];
    let description = args['description'];
    let event = args['event'];
    let fhirversion = args['fhirversion'];
    let format = args['format'];
    let guide = args['guide'];
    let jurisdiction = args['jurisdiction'];
    let mode = args['mode'];
    let name = args['name'];
    let publisher = args['publisher'];
    let resource = args['resource'];
    let resource_profile = args['resource-profile'];
    let security_service = args['security-service'];
    let software = args['software'];
    let status = args['status'];
    let supported_profile = args['supported-profile'];
    let title = args['title'];
    let url = args['url'];
    let version = args['version'];

    // TODO: Build query from Parameters

    // TODO: Query database

    let CapabilityStatement = getCapabilityStatement(base_version);

    // Cast all results to CapabilityStatement Class
    let capabilitystatement_resource = new CapabilityStatement();
    // TODO: Set data with constructor or setter methods
    capabilitystatement_resource.id = 'test id';

    // Return Array
    resolve([capabilitystatement_resource]);
  });

module.exports.searchById = (args) =>
  new Promise((resolve, reject) => {
    logger.info('CapabilityStatement >>> searchById');

    let { base_version, id } = args;

    let CapabilityStatement = getCapabilityStatement(base_version);

    // TODO: Build query from Parameters

    // TODO: Query database

    // Cast result to CapabilityStatement Class
    let capabilitystatement_resource = new CapabilityStatement();
    // TODO: Set data with constructor or setter methods
    capabilitystatement_resource.id = 'test id';

    // Return resource class
    // resolve(capabilitystatement_resource);
    resolve();
  });

module.exports.create = (args, { req }) =>
  new Promise((resolve, reject) => {
    logger.info('CapabilityStatement >>> create');

    let { base_version, resource } = args;
    // Make sure to use this ID when inserting this resource
    let id = new ObjectID().toString();

    let CapabilityStatement = getCapabilityStatement(base_version);
    let Meta = getMeta(base_version);

    // TODO: determine if client/server sets ID

    // Cast resource to CapabilityStatement Class
    let capabilitystatement_resource = new CapabilityStatement(resource);
    capabilitystatement_resource.meta = new Meta();
    // TODO: set meta info

    // TODO: save record to database

    // Return Id
    resolve({ id });
  });

module.exports.update = (args, { req }) =>
  new Promise((resolve, reject) => {
    logger.info('CapabilityStatement >>> update');

    let { base_version, id, resource } = args;

    let CapabilityStatement = getCapabilityStatement(base_version);
    let Meta = getMeta(base_version);

    // Cast resource to CapabilityStatement Class
    let capabilitystatement_resource = new CapabilityStatement(resource);
    capabilitystatement_resource.meta = new Meta();
    // TODO: set meta info, increment meta ID

    // TODO: save record to database

    // Return id, if recorded was created or updated, new meta version id
    resolve({
      id: capabilitystatement_resource.id,
      created: false,
      resource_version: capabilitystatement_resource.meta.versionId,
    });
  });

module.exports.remove = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('CapabilityStatement >>> remove');

    let { id } = args;

    // TODO: delete record in database (soft/hard)

    // Return number of records deleted
    resolve({ deleted: 0 });
  });

module.exports.searchByVersionId = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('CapabilityStatement >>> searchByVersionId');

    let { base_version, id, version_id } = args;

    let CapabilityStatement = getCapabilityStatement(base_version);

    // TODO: Build query from Parameters

    // TODO: Query database

    // Cast result to CapabilityStatement Class
    let capabilitystatement_resource = new CapabilityStatement();

    // Return resource class
    resolve(capabilitystatement_resource);
  });

module.exports.history = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('CapabilityStatement >>> history');

    // Common search params
    let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } =
      args;

    // Search Result params
    let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } =
      args;

    // Resource Specific params
    let date = args['date'];
    let description = args['description'];
    let event = args['event'];
    let fhirversion = args['fhirversion'];
    let format = args['format'];
    let guide = args['guide'];
    let jurisdiction = args['jurisdiction'];
    let mode = args['mode'];
    let name = args['name'];
    let publisher = args['publisher'];
    let resource = args['resource'];
    let resource_profile = args['resource-profile'];
    let security_service = args['security-service'];
    let software = args['software'];
    let status = args['status'];
    let supported_profile = args['supported-profile'];
    let title = args['title'];
    let url = args['url'];
    let version = args['version'];

    // TODO: Build query from Parameters

    // TODO: Query database

    let CapabilityStatement = getCapabilityStatement(base_version);

    // Cast all results to CapabilityStatement Class
    let capabilitystatement_resource = new CapabilityStatement();

    // Return Array
    resolve([capabilitystatement_resource]);
  });

module.exports.historyById = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('CapabilityStatement >>> historyById');

    // Common search params
    let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } =
      args;

    // Search Result params
    let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } =
      args;

    // Resource Specific params
    let date = args['date'];
    let description = args['description'];
    let event = args['event'];
    let fhirversion = args['fhirversion'];
    let format = args['format'];
    let guide = args['guide'];
    let jurisdiction = args['jurisdiction'];
    let mode = args['mode'];
    let name = args['name'];
    let publisher = args['publisher'];
    let resource = args['resource'];
    let resource_profile = args['resource-profile'];
    let security_service = args['security-service'];
    let software = args['software'];
    let status = args['status'];
    let supported_profile = args['supported-profile'];
    let title = args['title'];
    let url = args['url'];
    let version = args['version'];

    // TODO: Build query from Parameters

    // TODO: Query database

    let CapabilityStatement = getCapabilityStatement(base_version);

    // Cast all results to CapabilityStatement Class
    let capabilitystatement_resource = new CapabilityStatement();

    // Return Array
    resolve([capabilitystatement_resource]);
  });
