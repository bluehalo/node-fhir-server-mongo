/*eslint no-unused-vars: "warn"*/

const { VERSIONS } = require('@asymmetrik/node-fhir-server-core').constants;
const { resolveSchema } = require('@asymmetrik/node-fhir-server-core');
const FHIRServer = require('@asymmetrik/node-fhir-server-core');
const { ObjectID } = require('mongodb');
const { COLLECTION, CLIENT_DB } = require('../../constants');
const moment = require('moment-timezone');
const globals = require('../../globals');
const logger = require('@asymmetrik/node-fhir-server-core').loggers.get();

let getObservation = (base_version) => {
  return resolveSchema(base_version, 'Observation');
};

let getMeta = (base_version) => {
  return resolveSchema(base_version, 'Meta');
};

/*
 * @param {*} args
 * @param {*} context
 * @param {*} logger
 */
module.exports.search = (args) =>
  new Promise((resolve, reject) => {
    logger.info('Observation >>> search');

    let { base_version } = args;
    let query = {};

    if (base_version === VERSIONS['3_0_1']) {
      query = buildStu3SearchQuery(args);
    } else if (base_version === VERSIONS['1_0_2']) {
      query = buildDstu2SearchQuery(args);
    }

    // Grab an instance of our DB and collection
    let db = globals.get(CLIENT_DB);
    let collection = db.collection(`${COLLECTION.OBSERVATION}_${base_version}`);
    let Observation = getObservation(base_version);

    // Query our collection for this observation
    collection.find(query, (err, data) => {
      if (err) {
        logger.error('Error with Observation.search: ', err);
        return reject(err);
      }

      // Patient is a patient cursor, pull documents out before resolving
      data.toArray().then((observations) => {
        observations.forEach(function (element, i, returnArray) {
          returnArray[i] = new Observation(element);
        });
        resolve(observations);
      });
    });
  });

module.exports.searchById = (args) =>
  new Promise((resolve, reject) => {
    logger.info('Observation >>> search');

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
    let based_on = args['based-on'];
    let category = args['category'];
    let code = args['code'];
    let code_value_concept = args['code-value-concept'];
    let code_value_date = args['code-value-date'];
    let code_value_quantity = args['code-value-quantity'];
    let code_value_string = args['code-value-string'];
    let combo_code = args['combo-code'];
    let combo_code_value_concept = args['combo-code-value-concept'];
    let combo_code_value_quantity = args['combo-code-value-quantity'];
    let combo_data_absent_reason = args['combo-data-absent-reason'];
    let combo_value_concept = args['combo-value-concept'];
    let combo_value_quantity = args['combo-value-quantity'];
    let component_code = args['component-code'];
    let component_code_value_concept = args['component-code-value-concept'];
    let component_code_value_quantity = args['component-code-value-quantity'];
    let component_data_absent_reason = args['component-data-absent-reason'];
    let component_value_concept = args['component-value-concept'];
    let component_value_quantity = args['component-value-quantity'];
    let _context = args['_context'];
    let data_absent_reason = args['data-absent-reason'];
    let date = args['date'];
    let device = args['device'];
    let encounter = args['encounter'];
    let identifier = args['identifier'];
    let method = args['method'];
    let patient = args['patient'];
    let performer = args['performer'];
    let related = args['related'];
    let related_target = args['related-target'];
    let related_type = args['related-type'];
    let specimen = args['specimen'];
    let status = args['status'];
    let reference = args['reference'];
    let value_concept = args['value-concept'];
    let value_date = args['value-date'];
    let value_quantity = args['value-quantity'];
    let value_string = args['value-string'];

    // TODO: Build query from Parameters

    // TODO: Query database

    let Observation = getObservation(base_version);

    // Cast all results to Observation Class
    let observation_resource = new Observation();
    // TODO: Set data with constructor or setter methods
    observation_resource.id = 'test id';

    // Return Array
    resolve([observation_resource]);
  });

module.exports.searchById = (args) =>
  new Promise((resolve, reject) => {
    logger.info('Observation >>> searchById');

    let { base_version, id } = args;

    let Observation = getObservation(base_version);

    // TODO: Build query from Parameters

    // TODO: Query database

    // Cast result to Observation Class
    let observation_resource = new Observation();
    // TODO: Set data with constructor or setter methods
    observation_resource.id = 'test id';

    // Return resource class
    // resolve(observation_resource);
    resolve();
  });

module.exports.create = (args, { req }) =>
  new Promise((resolve, reject) => {
    logger.info('Observation >>> create');

    let { base_version, resource } = args;
    // Make sure to use this ID when inserting this resource
    let id = new ObjectID().toString();

    let Observation = getObservation(base_version);
    let Meta = getMeta(base_version);

    // TODO: determine if client/server sets ID

    // Cast resource to Observation Class
    let observation_resource = new Observation(resource);
    observation_resource.meta = new Meta();
    // TODO: set meta info

    // TODO: save record to database

    // Return Id
    resolve({ id });
  });

  module.exports.update = (args, { req }) =>
  new Promise((resolve, reject) => {
    logger.info('Observation >>> update');

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
    let collection = db.collection(`${COLLECTION.OBSERVATION}_${base_version}`);

    // Get current record
    // Query our collection for this observation
    collection.findOne({ id: id.toString() }, (err, data) => {
      if (err) {
        logger.error('Error with observation.searchById: ', err);
        return reject(err);
      }

      let Observation = getObservation(base_version);
      let observation = new Observation(resource);

      if (data && data.meta) {
        logger.info("found resource: "+ data)
        let foundObservation = new Observation(data);
        let meta = foundObservation.meta;
        meta.versionId = `${parseInt(foundObservation.meta.versionId) + 1}`;
        observation.meta = meta;
      } else {
        let Meta = getMeta(base_version);
        observation.meta = new Meta({
          versionId: '1',
          lastUpdated: moment.utc().format('YYYY-MM-DDTHH:mm:ssZ'),
        });
      }

      let cleaned = JSON.parse(JSON.stringify(observation));
      let doc = Object.assign(cleaned, { _id: id });

      // Insert/update our patient record
      collection.findOneAndUpdate({ id: id }, { $set: doc }, { upsert: true }, (err2, res) => {
        if (err2) {
          logger.error('Error with Observation.update: ', err2);
          return reject(err2);
        }

        // save to history
        let history_collection = db.collection(`${COLLECTION.OBSERVATION}_${base_version}_History`);

        let history_observation = Object.assign(cleaned, { id: id });
        delete history_observation["_id"]; // make sure we don't have an _id field when inserting into history

        // Insert our patient record to history but don't assign _id
        return history_collection.insertOne(history_observation, (err3) => {
          if (err3) {
            logger.error('Error with Observation.create: ', err3);
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
    logger.info('Observation >>> remove');

    let { id } = args;

    // TODO: delete record in database (soft/hard)

    // Return number of records deleted
    resolve({ deleted: 0 });
  });

module.exports.searchByVersionId = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('Observation >>> searchByVersionId');

    let { base_version, id, version_id } = args;

    let Observation = getObservation(base_version);

    // TODO: Build query from Parameters

    // TODO: Query database

    // Cast result to Observation Class
    let observation_resource = new Observation();

    // Return resource class
    resolve(observation_resource);
  });

module.exports.history = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('Observation >>> history');

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
    let based_on = args['based-on'];
    let category = args['category'];
    let code = args['code'];
    let code_value_concept = args['code-value-concept'];
    let code_value_date = args['code-value-date'];
    let code_value_quantity = args['code-value-quantity'];
    let code_value_string = args['code-value-string'];
    let combo_code = args['combo-code'];
    let combo_code_value_concept = args['combo-code-value-concept'];
    let combo_code_value_quantity = args['combo-code-value-quantity'];
    let combo_data_absent_reason = args['combo-data-absent-reason'];
    let combo_value_concept = args['combo-value-concept'];
    let combo_value_quantity = args['combo-value-quantity'];
    let component_code = args['component-code'];
    let component_code_value_concept = args['component-code-value-concept'];
    let component_code_value_quantity = args['component-code-value-quantity'];
    let component_data_absent_reason = args['component-data-absent-reason'];
    let component_value_concept = args['component-value-concept'];
    let component_value_quantity = args['component-value-quantity'];
    let _context = args['_context'];
    let data_absent_reason = args['data-absent-reason'];
    let date = args['date'];
    let device = args['device'];
    let encounter = args['encounter'];
    let identifier = args['identifier'];
    let method = args['method'];
    let patient = args['patient'];
    let performer = args['performer'];
    let related = args['related'];
    let related_target = args['related-target'];
    let related_type = args['related-type'];
    let specimen = args['specimen'];
    let status = args['status'];
    let reference = args['reference'];
    let value_concept = args['value-concept'];
    let value_date = args['value-date'];
    let value_quantity = args['value-quantity'];
    let value_string = args['value-string'];

    // TODO: Build query from Parameters

    // TODO: Query database

    let Observation = getObservation(base_version);

    // Cast all results to Observation Class
    let observation_resource = new Observation();

    // Return Array
    resolve([observation_resource]);
  });

module.exports.historyById = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('Observation >>> historyById');

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
    let based_on = args['based-on'];
    let category = args['category'];
    let code = args['code'];
    let code_value_concept = args['code-value-concept'];
    let code_value_date = args['code-value-date'];
    let code_value_quantity = args['code-value-quantity'];
    let code_value_string = args['code-value-string'];
    let combo_code = args['combo-code'];
    let combo_code_value_concept = args['combo-code-value-concept'];
    let combo_code_value_quantity = args['combo-code-value-quantity'];
    let combo_data_absent_reason = args['combo-data-absent-reason'];
    let combo_value_concept = args['combo-value-concept'];
    let combo_value_quantity = args['combo-value-quantity'];
    let component_code = args['component-code'];
    let component_code_value_concept = args['component-code-value-concept'];
    let component_code_value_quantity = args['component-code-value-quantity'];
    let component_data_absent_reason = args['component-data-absent-reason'];
    let component_value_concept = args['component-value-concept'];
    let component_value_quantity = args['component-value-quantity'];
    let _context = args['_context'];
    let data_absent_reason = args['data-absent-reason'];
    let date = args['date'];
    let device = args['device'];
    let encounter = args['encounter'];
    let identifier = args['identifier'];
    let method = args['method'];
    let patient = args['patient'];
    let performer = args['performer'];
    let related = args['related'];
    let related_target = args['related-target'];
    let related_type = args['related-type'];
    let specimen = args['specimen'];
    let status = args['status'];
    let reference = args['reference'];
    let value_concept = args['value-concept'];
    let value_date = args['value-date'];
    let value_quantity = args['value-quantity'];
    let value_string = args['value-string'];

    // TODO: Build query from Parameters

    // TODO: Query database

    let Observation = getObservation(base_version);

    // Cast all results to Observation Class
    let observation_resource = new Observation();

    // Return Array
    resolve([observation_resource]);
  });
