/*eslint no-unused-vars: "warn"*/

const { VERSIONS } = require('@asymmetrik/node-fhir-server-core').constants;
const { resolveSchema } = require('@asymmetrik/node-fhir-server-core');
const FHIRServer = require('@asymmetrik/node-fhir-server-core');
const { ObjectID } = require('mongodb');
const logger = require('@asymmetrik/node-fhir-server-core').loggers.get();

let getChargeItem = (base_version) => {
  return resolveSchema(base_version, 'ChargeItem');
};

let getMeta = (base_version) => {
  return resolveSchema(base_version, 'Meta');
};

module.exports.search = (args) =>
  new Promise((resolve, reject) => {
    logger.info('ChargeItem >>> search');

    // Common search params
    let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } =
      args;

    // Search Result params
    let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } =
      args;

    // Resource Specific params
    let account = args['account'];
    let code = args['code'];
    let _context = args['_context'];
    let entered_date = args['entered-date'];
    let enterer = args['enterer'];
    let factor_override = args['factor-override'];
    let identifier = args['identifier'];
    let occurrence = args['occurrence'];
    let participant_actor = args['participant-actor'];
    let participant_role = args['participant-role'];
    let patient = args['patient'];
    let performing_organization = args['performing-organization'];
    let price_override = args['price-override'];
    let quantity = args['quantity'];
    let requesting_organization = args['requesting-organization'];
    let service = args['service'];
    let subject = args['subject'];

    // TODO: Build query from Parameters

    // TODO: Query database

    let ChargeItem = getChargeItem(base_version);

    // Cast all results to ChargeItem Class
    let chargeitem_resource = new ChargeItem();
    // TODO: Set data with constructor or setter methods
    chargeitem_resource.id = 'test id';

    // Return Array
    resolve([chargeitem_resource]);
  });

module.exports.searchById = (args) =>
  new Promise((resolve, reject) => {
    logger.info('ChargeItem >>> searchById');

    let { base_version, id } = args;

    let ChargeItem = getChargeItem(base_version);

    // TODO: Build query from Parameters

    // TODO: Query database

    // Cast result to ChargeItem Class
    let chargeitem_resource = new ChargeItem();
    // TODO: Set data with constructor or setter methods
    chargeitem_resource.id = 'test id';

    // Return resource class
    // resolve(chargeitem_resource);
    resolve();
  });

module.exports.create = (args, { req }) =>
  new Promise((resolve, reject) => {
    logger.info('ChargeItem >>> create');

    let { base_version, resource } = args;
    // Make sure to use this ID when inserting this resource
    let id = new ObjectID().toString();

    let ChargeItem = getChargeItem(base_version);
    let Meta = getMeta(base_version);

    // TODO: determine if client/server sets ID

    // Cast resource to ChargeItem Class
    let chargeitem_resource = new ChargeItem(resource);
    chargeitem_resource.meta = new Meta();
    // TODO: set meta info

    // TODO: save record to database

    // Return Id
    resolve({ id });
  });

module.exports.update = (args, { req }) =>
  new Promise((resolve, reject) => {
    logger.info('ChargeItem >>> update');

    let { base_version, id, resource } = args;

    let ChargeItem = getChargeItem(base_version);
    let Meta = getMeta(base_version);

    // Cast resource to ChargeItem Class
    let chargeitem_resource = new ChargeItem(resource);
    chargeitem_resource.meta = new Meta();
    // TODO: set meta info, increment meta ID

    // TODO: save record to database

    // Return id, if recorded was created or updated, new meta version id
    resolve({
      id: chargeitem_resource.id,
      created: false,
      resource_version: chargeitem_resource.meta.versionId,
    });
  });

module.exports.remove = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('ChargeItem >>> remove');

    let { id } = args;

    // TODO: delete record in database (soft/hard)

    // Return number of records deleted
    resolve({ deleted: 0 });
  });

module.exports.searchByVersionId = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('ChargeItem >>> searchByVersionId');

    let { base_version, id, version_id } = args;

    let ChargeItem = getChargeItem(base_version);

    // TODO: Build query from Parameters

    // TODO: Query database

    // Cast result to ChargeItem Class
    let chargeitem_resource = new ChargeItem();

    // Return resource class
    resolve(chargeitem_resource);
  });

module.exports.history = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('ChargeItem >>> history');

    // Common search params
    let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } =
      args;

    // Search Result params
    let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } =
      args;

    // Resource Specific params
    let account = args['account'];
    let code = args['code'];
    let _context = args['_context'];
    let entered_date = args['entered-date'];
    let enterer = args['enterer'];
    let factor_override = args['factor-override'];
    let identifier = args['identifier'];
    let occurrence = args['occurrence'];
    let participant_actor = args['participant-actor'];
    let participant_role = args['participant-role'];
    let patient = args['patient'];
    let performing_organization = args['performing-organization'];
    let price_override = args['price-override'];
    let quantity = args['quantity'];
    let requesting_organization = args['requesting-organization'];
    let service = args['service'];
    let subject = args['subject'];

    // TODO: Build query from Parameters

    // TODO: Query database

    let ChargeItem = getChargeItem(base_version);

    // Cast all results to ChargeItem Class
    let chargeitem_resource = new ChargeItem();

    // Return Array
    resolve([chargeitem_resource]);
  });

module.exports.historyById = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('ChargeItem >>> historyById');

    // Common search params
    let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } =
      args;

    // Search Result params
    let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } =
      args;

    // Resource Specific params
    let account = args['account'];
    let code = args['code'];
    let _context = args['_context'];
    let entered_date = args['entered-date'];
    let enterer = args['enterer'];
    let factor_override = args['factor-override'];
    let identifier = args['identifier'];
    let occurrence = args['occurrence'];
    let participant_actor = args['participant-actor'];
    let participant_role = args['participant-role'];
    let patient = args['patient'];
    let performing_organization = args['performing-organization'];
    let price_override = args['price-override'];
    let quantity = args['quantity'];
    let requesting_organization = args['requesting-organization'];
    let service = args['service'];
    let subject = args['subject'];

    // TODO: Build query from Parameters

    // TODO: Query database

    let ChargeItem = getChargeItem(base_version);

    // Cast all results to ChargeItem Class
    let chargeitem_resource = new ChargeItem();

    // Return Array
    resolve([chargeitem_resource]);
  });
