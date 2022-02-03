/*eslint no-unused-vars: "warn"*/

const { VERSIONS } = require('@asymmetrik/node-fhir-server-core').constants;
const { resolveSchema } = require('@asymmetrik/node-fhir-server-core');
const FHIRServer = require('@asymmetrik/node-fhir-server-core');
const { ObjectID } = require('mongodb');
const logger = require('@asymmetrik/node-fhir-server-core').loggers.get();

let getLocation = (base_version) => {
  return resolveSchema(base_version, 'Location');
};

let getMeta = (base_version) => {
  return resolveSchema(base_version, 'Meta');
};

module.exports.search = (args) =>
  new Promise((resolve, reject) => {
    logger.info('Location >>> search');

    // Common search params
    let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } =
      args;

    // Search Result params
    let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } =
      args;

    // Resource Specific params
    let address = args['address'];
    let address_city = args['address-city'];
    let address_country = args['address-country'];
    let address_postalcode = args['address-postalcode'];
    let address_state = args['address-state'];
    let address_use = args['address-use'];
    let endpoint = args['endpoint'];
    let identifier = args['identifier'];
    let name = args['name'];
    let near = args['near'];
    let near_distance = args['near-distance'];
    let operational_status = args['operational-status'];
    let organization = args['organization'];
    let partof = args['partof'];
    let status = args['status'];
    let type = args['type'];

    // TODO: Build query from Parameters

    // TODO: Query database

    let Location = getLocation(base_version);

    // Cast all results to Location Class
    let location_resource = new Location();
    // TODO: Set data with constructor or setter methods
    location_resource.id = 'test id';

    // Return Array
    resolve([location_resource]);
  });

module.exports.searchById = (args) =>
  new Promise((resolve, reject) => {
    logger.info('Location >>> searchById');

    let { base_version, id } = args;

    let Location = getLocation(base_version);

    // TODO: Build query from Parameters

    // TODO: Query database

    // Cast result to Location Class
    let location_resource = new Location();
    // TODO: Set data with constructor or setter methods
    location_resource.id = 'test id';

    // Return resource class
    // resolve(location_resource);
    resolve();
  });

module.exports.create = (args, { req }) =>
  new Promise((resolve, reject) => {
    logger.info('Location >>> create');

    let { base_version, resource } = args;
    // Make sure to use this ID when inserting this resource
    let id = new ObjectID().toString();

    let Location = getLocation(base_version);
    let Meta = getMeta(base_version);

    // TODO: determine if client/server sets ID

    // Cast resource to Location Class
    let location_resource = new Location(resource);
    location_resource.meta = new Meta();
    // TODO: set meta info

    // TODO: save record to database

    // Return Id
    resolve({ id });
  });

module.exports.update = (args, { req }) =>
  new Promise((resolve, reject) => {
    logger.info('Location >>> update');

    let { base_version, id, resource } = args;

    let Location = getLocation(base_version);
    let Meta = getMeta(base_version);

    // Cast resource to Location Class
    let location_resource = new Location(resource);
    location_resource.meta = new Meta();
    // TODO: set meta info, increment meta ID

    // TODO: save record to database

    // Return id, if recorded was created or updated, new meta version id
    resolve({
      id: location_resource.id,
      created: false,
      resource_version: location_resource.meta.versionId,
    });
  });

module.exports.remove = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('Location >>> remove');

    let { id } = args;

    // TODO: delete record in database (soft/hard)

    // Return number of records deleted
    resolve({ deleted: 0 });
  });

module.exports.searchByVersionId = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('Location >>> searchByVersionId');

    let { base_version, id, version_id } = args;

    let Location = getLocation(base_version);

    // TODO: Build query from Parameters

    // TODO: Query database

    // Cast result to Location Class
    let location_resource = new Location();

    // Return resource class
    resolve(location_resource);
  });

module.exports.history = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('Location >>> history');

    // Common search params
    let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } =
      args;

    // Search Result params
    let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } =
      args;

    // Resource Specific params
    let address = args['address'];
    let address_city = args['address-city'];
    let address_country = args['address-country'];
    let address_postalcode = args['address-postalcode'];
    let address_state = args['address-state'];
    let address_use = args['address-use'];
    let endpoint = args['endpoint'];
    let identifier = args['identifier'];
    let name = args['name'];
    let near = args['near'];
    let near_distance = args['near-distance'];
    let operational_status = args['operational-status'];
    let organization = args['organization'];
    let partof = args['partof'];
    let status = args['status'];
    let type = args['type'];

    // TODO: Build query from Parameters

    // TODO: Query database

    let Location = getLocation(base_version);

    // Cast all results to Location Class
    let location_resource = new Location();

    // Return Array
    resolve([location_resource]);
  });

module.exports.historyById = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('Location >>> historyById');

    // Common search params
    let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } =
      args;

    // Search Result params
    let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } =
      args;

    // Resource Specific params
    let address = args['address'];
    let address_city = args['address-city'];
    let address_country = args['address-country'];
    let address_postalcode = args['address-postalcode'];
    let address_state = args['address-state'];
    let address_use = args['address-use'];
    let endpoint = args['endpoint'];
    let identifier = args['identifier'];
    let name = args['name'];
    let near = args['near'];
    let near_distance = args['near-distance'];
    let operational_status = args['operational-status'];
    let organization = args['organization'];
    let partof = args['partof'];
    let status = args['status'];
    let type = args['type'];

    // TODO: Build query from Parameters

    // TODO: Query database

    let Location = getLocation(base_version);

    // Cast all results to Location Class
    let location_resource = new Location();

    // Return Array
    resolve([location_resource]);
  });
