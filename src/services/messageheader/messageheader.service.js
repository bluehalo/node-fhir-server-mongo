/*eslint no-unused-vars: "warn"*/

const { VERSIONS } = require('@asymmetrik/node-fhir-server-core').constants;
const { resolveSchema } = require('@asymmetrik/node-fhir-server-core');
const FHIRServer = require('@asymmetrik/node-fhir-server-core');
const { ObjectID } = require('mongodb');
const logger = require('@asymmetrik/node-fhir-server-core').loggers.get();

let getMessageHeader = (base_version) => {
  return resolveSchema(base_version, 'MessageHeader');
};

let getMeta = (base_version) => {
  return resolveSchema(base_version, 'Meta');
};

module.exports.search = (args) =>
  new Promise((resolve, reject) => {
    logger.info('MessageHeader >>> search');

    // Common search params
    let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } =
      args;

    // Search Result params
    let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } =
      args;

    // Resource Specific params
    let author = args['author'];
    let code = args['code'];
    let destination = args['destination'];
    let destination_uri = args['destination-uri'];
    let enterer = args['enterer'];
    let event = args['event'];
    let focus = args['focus'];
    let receiver = args['receiver'];
    let response_id = args['response-id'];
    let responsible = args['responsible'];
    let sender = args['sender'];
    let source = args['source'];
    let source_uri = args['source-uri'];
    let target = args['target'];
    let timestamp = args['timestamp'];

    // TODO: Build query from Parameters

    // TODO: Query database

    let MessageHeader = getMessageHeader(base_version);

    // Cast all results to MessageHeader Class
    let messageheader_resource = new MessageHeader();
    // TODO: Set data with constructor or setter methods
    messageheader_resource.id = 'test id';

    // Return Array
    resolve([messageheader_resource]);
  });

module.exports.searchById = (args) =>
  new Promise((resolve, reject) => {
    logger.info('MessageHeader >>> searchById');

    let { base_version, id } = args;

    let MessageHeader = getMessageHeader(base_version);

    // TODO: Build query from Parameters

    // TODO: Query database

    // Cast result to MessageHeader Class
    let messageheader_resource = new MessageHeader();
    // TODO: Set data with constructor or setter methods
    messageheader_resource.id = 'test id';

    // Return resource class
    // resolve(messageheader_resource);
    resolve();
  });

module.exports.create = (args, { req }) =>
  new Promise((resolve, reject) => {
    logger.info('MessageHeader >>> create');

    let { base_version, resource } = args;
    // Make sure to use this ID when inserting this resource
    let id = new ObjectID().toString();

    let MessageHeader = getMessageHeader(base_version);
    let Meta = getMeta(base_version);

    // TODO: determine if client/server sets ID

    // Cast resource to MessageHeader Class
    let messageheader_resource = new MessageHeader(resource);
    messageheader_resource.meta = new Meta();
    // TODO: set meta info

    // TODO: save record to database

    // Return Id
    resolve({ id });
  });

module.exports.update = (args, { req }) =>
  new Promise((resolve, reject) => {
    logger.info('MessageHeader >>> update');

    let { base_version, id, resource } = args;

    let MessageHeader = getMessageHeader(base_version);
    let Meta = getMeta(base_version);

    // Cast resource to MessageHeader Class
    let messageheader_resource = new MessageHeader(resource);
    messageheader_resource.meta = new Meta();
    // TODO: set meta info, increment meta ID

    // TODO: save record to database

    // Return id, if recorded was created or updated, new meta version id
    resolve({
      id: messageheader_resource.id,
      created: false,
      resource_version: messageheader_resource.meta.versionId,
    });
  });

module.exports.remove = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('MessageHeader >>> remove');

    let { id } = args;

    // TODO: delete record in database (soft/hard)

    // Return number of records deleted
    resolve({ deleted: 0 });
  });

module.exports.searchByVersionId = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('MessageHeader >>> searchByVersionId');

    let { base_version, id, version_id } = args;

    let MessageHeader = getMessageHeader(base_version);

    // TODO: Build query from Parameters

    // TODO: Query database

    // Cast result to MessageHeader Class
    let messageheader_resource = new MessageHeader();

    // Return resource class
    resolve(messageheader_resource);
  });

module.exports.history = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('MessageHeader >>> history');

    // Common search params
    let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } =
      args;

    // Search Result params
    let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } =
      args;

    // Resource Specific params
    let author = args['author'];
    let code = args['code'];
    let destination = args['destination'];
    let destination_uri = args['destination-uri'];
    let enterer = args['enterer'];
    let event = args['event'];
    let focus = args['focus'];
    let receiver = args['receiver'];
    let response_id = args['response-id'];
    let responsible = args['responsible'];
    let sender = args['sender'];
    let source = args['source'];
    let source_uri = args['source-uri'];
    let target = args['target'];
    let timestamp = args['timestamp'];

    // TODO: Build query from Parameters

    // TODO: Query database

    let MessageHeader = getMessageHeader(base_version);

    // Cast all results to MessageHeader Class
    let messageheader_resource = new MessageHeader();

    // Return Array
    resolve([messageheader_resource]);
  });

module.exports.historyById = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('MessageHeader >>> historyById');

    // Common search params
    let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } =
      args;

    // Search Result params
    let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } =
      args;

    // Resource Specific params
    let author = args['author'];
    let code = args['code'];
    let destination = args['destination'];
    let destination_uri = args['destination-uri'];
    let enterer = args['enterer'];
    let event = args['event'];
    let focus = args['focus'];
    let receiver = args['receiver'];
    let response_id = args['response-id'];
    let responsible = args['responsible'];
    let sender = args['sender'];
    let source = args['source'];
    let source_uri = args['source-uri'];
    let target = args['target'];
    let timestamp = args['timestamp'];

    // TODO: Build query from Parameters

    // TODO: Query database

    let MessageHeader = getMessageHeader(base_version);

    // Cast all results to MessageHeader Class
    let messageheader_resource = new MessageHeader();

    // Return Array
    resolve([messageheader_resource]);
  });
