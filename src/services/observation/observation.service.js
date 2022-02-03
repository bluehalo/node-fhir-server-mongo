/*eslint no-unused-vars: "warn"*/

const { VERSIONS } = require('@asymmetrik/node-fhir-server-core').constants;
const { resolveSchema } = require('@asymmetrik/node-fhir-server-core');
const FHIRServer = require('@asymmetrik/node-fhir-server-core');
const { ObjectID } = require('mongodb');
const logger = require('@asymmetrik/node-fhir-server-core').loggers.get();

let getObservation = (base_version) => {
  return resolveSchema(base_version, 'Observation');
};

let getMeta = (base_version) => {
  return resolveSchema(base_version, 'Meta');
};

module.exports.search = (args) =>
  new Promise((resolve, reject) => {
    logger.info('Observation >>> search');

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

    let { base_version, id, resource } = args;

    let Observation = getObservation(base_version);
    let Meta = getMeta(base_version);

    // Cast resource to Observation Class
    let observation_resource = new Observation(resource);
    observation_resource.meta = new Meta();
    // TODO: set meta info, increment meta ID

    // TODO: save record to database

    // Return id, if recorded was created or updated, new meta version id
    resolve({
      id: observation_resource.id,
      created: false,
      resource_version: observation_resource.meta.versionId,
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
    let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } =
      args;

    // Search Result params
    let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } =
      args;

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
    let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } =
      args;

    // Search Result params
    let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } =
      args;

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
