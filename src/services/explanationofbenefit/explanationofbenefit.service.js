/*eslint no-unused-vars: "warn"*/

const { VERSIONS } = require('@asymmetrik/node-fhir-server-core').constants;
const { resolveSchema } = require('@asymmetrik/node-fhir-server-core');
const FHIRServer = require('@asymmetrik/node-fhir-server-core');
const { ObjectID } = require('mongodb');
const { COLLECTION, CLIENT_DB } = require('../../constants');
const moment = require('moment-timezone');
const globals = require('../../globals');
const logger = require('@asymmetrik/node-fhir-server-core').loggers.get();

let getExplanationOfBenefit = (base_version) => {
  return resolveSchema(base_version, 'ExplanationOfBenefit');
};

let getMeta = (base_version) => {
  return resolveSchema(base_version, 'Meta');
};

/**
 *
 * @param {*} args
 * @param {*} context
 * @param {*} logger
 */
module.exports.search = (args) =>
  new Promise((resolve, reject) => {
    logger.info('ExplanationOfBenefit >>> search');

    let { base_version } = args;
    let query = {};

    if (base_version === VERSIONS['3_0_1']) {
      query = buildStu3SearchQuery(args);
    } else if (base_version === VERSIONS['1_0_2']) {
      query = buildDstu2SearchQuery(args);
    }

    // Grab an instance of our DB and collection
    let db = globals.get(CLIENT_DB);
    let collection = db.collection(`${COLLECTION.EXPLANATIONOFBENEFIT}_${base_version}`);
    let ExplanationOfBenefit = getExplanationOfBenefit(base_version);

    // Query our collection for this observation
    collection.find(query, (err, data) => {
      if (err) {
        logger.error('Error with ExplanationOfBenefit.search: ', err);
        return reject(err);
      }

      // Patient is a patient cursor, pull documents out before resolving
      data.toArray().then((explanationofbenefits) => {
        explanationofbenefits.forEach(function (element, i, returnArray) {
          returnArray[i] = new ExplanationOfBenefit(element);
        });
        resolve(explanationofbenefits);
      });
    });
  });

module.exports.searchById = (args) =>
  new Promise((resolve, reject) => {
    logger.info('ExplanationOfBenefit >>> search');

    // Common search params
    let {
      base_version,
      _content,
      _format,
      _id,
      _lastUpdated,
      _profile,
      _query,
      _security,
      _tag,
    } = args;

    // Search Result params
    let {
      _INCLUDE,
      _REVINCLUDE,
      _SORT,
      _COUNT,
      _SUMMARY,
      _ELEMENTS,
      _CONTAINED,
      _CONTAINEDTYPED,
    } = args;

    // Resource Specific params
    let care_team = args['care-team'];
    let claim = args['claim'];
    let coverage = args['coverage'];
    let created = args['created'];
    let disposition = args['disposition'];
    let encounter = args['encounter'];
    let enterer = args['enterer'];
    let facility = args['facility'];
    let identifier = args['identifier'];
    let organization = args['organization'];
    let patient = args['patient'];
    let payee = args['payee'];
    let provider = args['provider'];

    // TODO: Build query from Parameters

    // TODO: Query database

    let ExplanationOfBenefit = getExplanationOfBenefit(base_version);

    // Cast all results to ExplanationOfBenefit Class
    let explanationofbenefit_resource = new ExplanationOfBenefit();
    // TODO: Set data with constructor or setter methods
    explanationofbenefit_resource.id = 'test id';

    // Return Array
    resolve([explanationofbenefit_resource]);
  });

module.exports.searchById = (args) =>
  new Promise((resolve, reject) => {
    logger.info('ExplanationOfBenefit >>> searchById');

    let { base_version, id } = args;

    let ExplanationOfBenefit = getExplanationOfBenefit(base_version);

    // TODO: Build query from Parameters

    // TODO: Query database

    // Cast result to ExplanationOfBenefit Class
    let explanationofbenefit_resource = new ExplanationOfBenefit();
    // TODO: Set data with constructor or setter methods
    explanationofbenefit_resource.id = 'test id';

    // Return resource class
    // resolve(explanationofbenefit_resource);
    resolve();
  });

module.exports.create = (args, { req }) =>
  new Promise((resolve, reject) => {
    logger.info('ExplanationOfBenefit >>> create');

    let { base_version, resource } = args;
    // Make sure to use this ID when inserting this resource
    let id = new ObjectID().toString();

    let ExplanationOfBenefit = getExplanationOfBenefit(base_version);
    let Meta = getMeta(base_version);

    // TODO: determine if client/server sets ID

    // Cast resource to ExplanationOfBenefit Class
    let explanationofbenefit_resource = new ExplanationOfBenefit(resource);
    explanationofbenefit_resource.meta = new Meta();
    // TODO: set meta info

    // TODO: save record to database

    // Return Id
    resolve({ id });
  });

module.exports.update = (args, { req }) =>
  new Promise((resolve, reject) => {
    logger.info('ExplanationOfBenefit >>> update');

    logger.info('--- request ----')
    logger.info(req)

    let resource = req.body;
    let { base_version, id } = args;
    logger.info(base_version)
    logger.info(id)
    logger.info('--- body ----')
    logger.info(resource)

    // Grab an instance of our DB and collection
    let db = globals.get(CLIENT_DB);
    let collection = db.collection(`${COLLECTION.EXPLANATIONOFBENEFIT}_${base_version}`);

    // Get current record
    // Query our collection for this observation
    collection.findOne({ id: id.toString() }, (err, data) => {
      if (err) {
        logger.error('Error with explanationofbenefit.searchById: ', err);
        return reject(err);
      }

      let ExplanationOfBenefit = getExplanationOfBenefit(base_version);
      let explanationofbenefit = new ExplanationOfBenefit(resource);

      if (data && data.meta) {
        logger.info("found resource: "+ data)
        let foundExplanationOfBenefit = new ExplanationOfBenefit(data);
        let meta = foundExplanationOfBenefit.meta;
        meta.versionId = `${parseInt(foundExplanationOfBenefit.meta.versionId) + 1}`;
        explanationofbenefit.meta = meta;
      } else {
        let Meta = getMeta(base_version);
        explanationofbenefit.meta = new Meta({
          versionId: '1',
          lastUpdated: moment.utc().format('YYYY-MM-DDTHH:mm:ssZ'),
        });
      }

      let cleaned = JSON.parse(JSON.stringify(explanationofbenefit));
      let doc = Object.assign(cleaned, { _id: id });

      // Insert/update our patient record
      collection.findOneAndUpdate({ id: id }, { $set: doc }, { upsert: true }, (err2, res) => {
        if (err2) {
          logger.error('Error with ExplanationOfBenefit.update: ', err2);
          return reject(err2);
        }

        // save to history
        let history_collection = db.collection(`${COLLECTION.EXPLANATIONOFBENEFIT}_${base_version}_History`);

        let history_explanationofbenefit = Object.assign(cleaned, { id: id });
        delete history_explanationofbenefit["_id"]; // make sure we don't have an _id field when inserting into history

        // Insert our patient record to history but don't assign _id
        return history_collection.insertOne(history_explanationofbenefit, (err3) => {
          if (err3) {
            logger.error('Error with ExplanationOfBenefit.create: ', err3);
            return reject(err3);
          }

          return resolve({
            id: id,
            created: res.lastErrorObject && !res.lastErrorObject.updatedExisting,
            resource_version: doc.meta.versionId,
          });
        });
    });
  });
});

module.exports.remove = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('ExplanationOfBenefit >>> remove');

    let { id } = args;

    // TODO: delete record in database (soft/hard)

    // Return number of records deleted
    resolve({ deleted: 0 });
  });

module.exports.searchByVersionId = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('ExplanationOfBenefit >>> searchByVersionId');

    let { base_version, id, version_id } = args;

    let ExplanationOfBenefit = getExplanationOfBenefit(base_version);

    // TODO: Build query from Parameters

    // TODO: Query database

    // Cast result to ExplanationOfBenefit Class
    let explanationofbenefit_resource = new ExplanationOfBenefit();

    // Return resource class
    resolve(explanationofbenefit_resource);
  });

module.exports.history = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('ExplanationOfBenefit >>> history');

    // Common search params
    let {
      base_version,
      _content,
      _format,
      _id,
      _lastUpdated,
      _profile,
      _query,
      _security,
      _tag,
    } = args;

    // Search Result params
    let {
      _INCLUDE,
      _REVINCLUDE,
      _SORT,
      _COUNT,
      _SUMMARY,
      _ELEMENTS,
      _CONTAINED,
      _CONTAINEDTYPED,
    } = args;

    // Resource Specific params
    let care_team = args['care-team'];
    let claim = args['claim'];
    let coverage = args['coverage'];
    let created = args['created'];
    let disposition = args['disposition'];
    let encounter = args['encounter'];
    let enterer = args['enterer'];
    let facility = args['facility'];
    let identifier = args['identifier'];
    let organization = args['organization'];
    let patient = args['patient'];
    let payee = args['payee'];
    let provider = args['provider'];

    // TODO: Build query from Parameters

    // TODO: Query database

    let ExplanationOfBenefit = getExplanationOfBenefit(base_version);

    // Cast all results to ExplanationOfBenefit Class
    let explanationofbenefit_resource = new ExplanationOfBenefit();

    // Return Array
    resolve([explanationofbenefit_resource]);
  });

module.exports.historyById = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('ExplanationOfBenefit >>> historyById');

    // Common search params
    let {
      base_version,
      _content,
      _format,
      _id,
      _lastUpdated,
      _profile,
      _query,
      _security,
      _tag,
    } = args;

    // Search Result params
    let {
      _INCLUDE,
      _REVINCLUDE,
      _SORT,
      _COUNT,
      _SUMMARY,
      _ELEMENTS,
      _CONTAINED,
      _CONTAINEDTYPED,
    } = args;

    // Resource Specific params
    let care_team = args['care-team'];
    let claim = args['claim'];
    let coverage = args['coverage'];
    let created = args['created'];
    let disposition = args['disposition'];
    let encounter = args['encounter'];
    let enterer = args['enterer'];
    let facility = args['facility'];
    let identifier = args['identifier'];
    let organization = args['organization'];
    let patient = args['patient'];
    let payee = args['payee'];
    let provider = args['provider'];

    // TODO: Build query from Parameters

    // TODO: Query database

    let ExplanationOfBenefit = getExplanationOfBenefit(base_version);

    // Cast all results to ExplanationOfBenefit Class
    let explanationofbenefit_resource = new ExplanationOfBenefit();

    // Return Array
    resolve([explanationofbenefit_resource]);
  });
