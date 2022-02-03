/*eslint no-unused-vars: "warn"*/

const { VERSIONS } = require('@asymmetrik/node-fhir-server-core').constants;
const { resolveSchema } = require('@asymmetrik/node-fhir-server-core');
const FHIRServer = require('@asymmetrik/node-fhir-server-core');
const { ObjectID } = require('mongodb');
const logger = require('@asymmetrik/node-fhir-server-core').loggers.get();

let getPractitionerRole = (base_version) => {
  return resolveSchema(base_version, 'PractitionerRole');
};

let getMeta = (base_version) => {
  return resolveSchema(base_version, 'Meta');
};

module.exports.search = (args) =>
  new Promise((resolve, reject) => {
    logger.info('PractitionerRole >>> search');

    // Common search params
    let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } =
      args;

    // Search Result params
    let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } =
      args;

    // Resource Specific params
    let active = args['active'];
    let date = args['date'];
    let email = args['email'];
    let endpoint = args['endpoint'];
    let identifier = args['identifier'];
    let location = args['location'];
    let organization = args['organization'];
    let phone = args['phone'];
    let practitioner = args['practitioner'];
    let role = args['role'];
    let service = args['service'];
    let specialty = args['specialty'];
    let telecom = args['telecom'];

    // TODO: Build query from Parameters

    // TODO: Query database

    let PractitionerRole = getPractitionerRole(base_version);

    // Cast all results to PractitionerRole Class
    let practitionerrole_resource = new PractitionerRole();
    // TODO: Set data with constructor or setter methods
    practitionerrole_resource.id = 'test id';

    // Return Array
    resolve([practitionerrole_resource]);
  });

module.exports.searchById = (args) =>
  new Promise((resolve, reject) => {
    logger.info('PractitionerRole >>> searchById');

    let { base_version, id } = args;

    let PractitionerRole = getPractitionerRole(base_version);

    // TODO: Build query from Parameters

    // TODO: Query database

    // Cast result to PractitionerRole Class
    let practitionerrole_resource = new PractitionerRole();
    // TODO: Set data with constructor or setter methods
    practitionerrole_resource.id = 'test id';

    // Return resource class
    // resolve(practitionerrole_resource);
    resolve();
  });

module.exports.create = (args, { req }) =>
  new Promise((resolve, reject) => {
    logger.info('PractitionerRole >>> create');

    let { base_version, resource } = args;
    // Make sure to use this ID when inserting this resource
    let id = new ObjectID().toString();

    let PractitionerRole = getPractitionerRole(base_version);
    let Meta = getMeta(base_version);

    // TODO: determine if client/server sets ID

    // Cast resource to PractitionerRole Class
    let practitionerrole_resource = new PractitionerRole(resource);
    practitionerrole_resource.meta = new Meta();
    // TODO: set meta info

    // TODO: save record to database

    // Return Id
    resolve({ id });
  });

module.exports.update = (args, { req }) =>
  new Promise((resolve, reject) => {
    logger.info('PractitionerRole >>> update');

    let { base_version, id, resource } = args;

    let PractitionerRole = getPractitionerRole(base_version);
    let Meta = getMeta(base_version);

    // Cast resource to PractitionerRole Class
    let practitionerrole_resource = new PractitionerRole(resource);
    practitionerrole_resource.meta = new Meta();
    // TODO: set meta info, increment meta ID

    // TODO: save record to database

    // Return id, if recorded was created or updated, new meta version id
    resolve({
      id: practitionerrole_resource.id,
      created: false,
      resource_version: practitionerrole_resource.meta.versionId,
    });
  });

module.exports.remove = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('PractitionerRole >>> remove');

    let { id } = args;

    // TODO: delete record in database (soft/hard)

    // Return number of records deleted
    resolve({ deleted: 0 });
  });

module.exports.searchByVersionId = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('PractitionerRole >>> searchByVersionId');

    let { base_version, id, version_id } = args;

    let PractitionerRole = getPractitionerRole(base_version);

    // TODO: Build query from Parameters

    // TODO: Query database

    // Cast result to PractitionerRole Class
    let practitionerrole_resource = new PractitionerRole();

    // Return resource class
    resolve(practitionerrole_resource);
  });

module.exports.history = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('PractitionerRole >>> history');

    // Common search params
    let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } =
      args;

    // Search Result params
    let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } =
      args;

    // Resource Specific params
    let active = args['active'];
    let date = args['date'];
    let email = args['email'];
    let endpoint = args['endpoint'];
    let identifier = args['identifier'];
    let location = args['location'];
    let organization = args['organization'];
    let phone = args['phone'];
    let practitioner = args['practitioner'];
    let role = args['role'];
    let service = args['service'];
    let specialty = args['specialty'];
    let telecom = args['telecom'];

    // TODO: Build query from Parameters

    // TODO: Query database

    let PractitionerRole = getPractitionerRole(base_version);

    // Cast all results to PractitionerRole Class
    let practitionerrole_resource = new PractitionerRole();

    // Return Array
    resolve([practitionerrole_resource]);
  });

module.exports.historyById = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('PractitionerRole >>> historyById');

    // Common search params
    let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } =
      args;

    // Search Result params
    let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } =
      args;

    // Resource Specific params
    let active = args['active'];
    let date = args['date'];
    let email = args['email'];
    let endpoint = args['endpoint'];
    let identifier = args['identifier'];
    let location = args['location'];
    let organization = args['organization'];
    let phone = args['phone'];
    let practitioner = args['practitioner'];
    let role = args['role'];
    let service = args['service'];
    let specialty = args['specialty'];
    let telecom = args['telecom'];

    // TODO: Build query from Parameters

    // TODO: Query database

    let PractitionerRole = getPractitionerRole(base_version);

    // Cast all results to PractitionerRole Class
    let practitionerrole_resource = new PractitionerRole();

    // Return Array
    resolve([practitionerrole_resource]);
  });
