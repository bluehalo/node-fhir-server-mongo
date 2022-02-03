/*eslint no-unused-vars: "warn"*/

const { VERSIONS } = require('@asymmetrik/node-fhir-server-core').constants;
const { resolveSchema } = require('@asymmetrik/node-fhir-server-core');
const FHIRServer = require('@asymmetrik/node-fhir-server-core');
const { ObjectID } = require('mongodb');
const logger = require('@asymmetrik/node-fhir-server-core').loggers.get();

let getDataElement = (base_version) => {
  return resolveSchema(base_version, 'DataElement');
};

let getMeta = (base_version) => {
  return resolveSchema(base_version, 'Meta');
};

module.exports.search = (args) =>
  new Promise((resolve, reject) => {
    logger.info('DataElement >>> search');

    // Common search params
    let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } =
      args;

    // Search Result params
    let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } =
      args;

    // Resource Specific params
    let code = args['code'];
    let date = args['date'];
    let description = args['description'];
    let identifier = args['identifier'];
    let jurisdiction = args['jurisdiction'];
    let name = args['name'];
    let objectClass = args['objectClass'];
    let objectClassProperty = args['objectClassProperty'];
    let publisher = args['publisher'];
    let status = args['status'];
    let stringency = args['stringency'];
    let title = args['title'];
    let url = args['url'];
    let version = args['version'];

    // TODO: Build query from Parameters

    // TODO: Query database

    let DataElement = getDataElement(base_version);

    // Cast all results to DataElement Class
    let dataelement_resource = new DataElement();
    // TODO: Set data with constructor or setter methods
    dataelement_resource.id = 'test id';

    // Return Array
    resolve([dataelement_resource]);
  });

module.exports.searchById = (args) =>
  new Promise((resolve, reject) => {
    logger.info('DataElement >>> searchById');

    let { base_version, id } = args;

    let DataElement = getDataElement(base_version);

    // TODO: Build query from Parameters

    // TODO: Query database

    // Cast result to DataElement Class
    let dataelement_resource = new DataElement();
    // TODO: Set data with constructor or setter methods
    dataelement_resource.id = 'test id';

    // Return resource class
    // resolve(dataelement_resource);
    resolve();
  });

module.exports.create = (args, { req }) =>
  new Promise((resolve, reject) => {
    logger.info('DataElement >>> create');

    let { base_version, resource } = args;
    // Make sure to use this ID when inserting this resource
    let id = new ObjectID().toString();

    let DataElement = getDataElement(base_version);
    let Meta = getMeta(base_version);

    // TODO: determine if client/server sets ID

    // Cast resource to DataElement Class
    let dataelement_resource = new DataElement(resource);
    dataelement_resource.meta = new Meta();
    // TODO: set meta info

    // TODO: save record to database

    // Return Id
    resolve({ id });
  });

module.exports.update = (args, { req }) =>
  new Promise((resolve, reject) => {
    logger.info('DataElement >>> update');

    let { base_version, id, resource } = args;

    let DataElement = getDataElement(base_version);
    let Meta = getMeta(base_version);

    // Cast resource to DataElement Class
    let dataelement_resource = new DataElement(resource);
    dataelement_resource.meta = new Meta();
    // TODO: set meta info, increment meta ID

    // TODO: save record to database

    // Return id, if recorded was created or updated, new meta version id
    resolve({
      id: dataelement_resource.id,
      created: false,
      resource_version: dataelement_resource.meta.versionId,
    });
  });

module.exports.remove = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('DataElement >>> remove');

    let { id } = args;

    // TODO: delete record in database (soft/hard)

    // Return number of records deleted
    resolve({ deleted: 0 });
  });

module.exports.searchByVersionId = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('DataElement >>> searchByVersionId');

    let { base_version, id, version_id } = args;

    let DataElement = getDataElement(base_version);

    // TODO: Build query from Parameters

    // TODO: Query database

    // Cast result to DataElement Class
    let dataelement_resource = new DataElement();

    // Return resource class
    resolve(dataelement_resource);
  });

module.exports.history = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('DataElement >>> history');

    // Common search params
    let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } =
      args;

    // Search Result params
    let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } =
      args;

    // Resource Specific params
    let code = args['code'];
    let date = args['date'];
    let description = args['description'];
    let identifier = args['identifier'];
    let jurisdiction = args['jurisdiction'];
    let name = args['name'];
    let objectClass = args['objectClass'];
    let objectClassProperty = args['objectClassProperty'];
    let publisher = args['publisher'];
    let status = args['status'];
    let stringency = args['stringency'];
    let title = args['title'];
    let url = args['url'];
    let version = args['version'];

    // TODO: Build query from Parameters

    // TODO: Query database

    let DataElement = getDataElement(base_version);

    // Cast all results to DataElement Class
    let dataelement_resource = new DataElement();

    // Return Array
    resolve([dataelement_resource]);
  });

module.exports.historyById = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('DataElement >>> historyById');

    // Common search params
    let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } =
      args;

    // Search Result params
    let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } =
      args;

    // Resource Specific params
    let code = args['code'];
    let date = args['date'];
    let description = args['description'];
    let identifier = args['identifier'];
    let jurisdiction = args['jurisdiction'];
    let name = args['name'];
    let objectClass = args['objectClass'];
    let objectClassProperty = args['objectClassProperty'];
    let publisher = args['publisher'];
    let status = args['status'];
    let stringency = args['stringency'];
    let title = args['title'];
    let url = args['url'];
    let version = args['version'];

    // TODO: Build query from Parameters

    // TODO: Query database

    let DataElement = getDataElement(base_version);

    // Cast all results to DataElement Class
    let dataelement_resource = new DataElement();

    // Return Array
    resolve([dataelement_resource]);
  });
