/*eslint no-unused-vars: "warn"*/

const { RESOURCES } = require('@asymmetrik/node-fhir-server-core').constants;
const FHIRServer = require('@asymmetrik/node-fhir-server-core');

let getEncounter = (base_version) => {
	return require(FHIRServer.resolveFromVersion(base_version, RESOURCES.ENCOUNTER));};

let getMeta = (base_version) => {
	return require(FHIRServer.resolveFromVersion(base_version, RESOURCES.META));};

module.exports.search = (args, context, logger) => new Promise((resolve, reject) => {
	logger.info('Encounter >>> search');

	// Common search params
	let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } = args;

	// Search Result params
	let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } = args;

	// Resource Specific params
	let appointment = args['appointment'];
	let _class = args['_class'];
	let date = args['date'];
	let diagnosis = args['diagnosis'];
	let episodeofcare = args['episodeofcare'];
	let identifier = args['identifier'];
	let incomingreferral = args['incomingreferral'];
	let length = args['length'];
	let location = args['location'];
	let location_period = args['location-period'];
	let part_of = args['part-of'];
	let participant = args['participant'];
	let participant_type = args['participant-type'];
	let patient = args['patient'];
	let practitioner = args['practitioner'];
	let reason = args['reason'];
	let service_provider = args['service-provider'];
	let special_arrangement = args['special-arrangement'];
	let status = args['status'];
	let subject = args['subject'];
	let type = args['type'];

	// TODO: Build query from Parameters

	// TODO: Query database

	let Encounter = getEncounter(base_version);

	// Cast all results to Encounter Class
	let encounter_resource = new Encounter();
	// TODO: Set data with constructor or setter methods
	encounter_resource.id = 'test id';

	// Return Array
	resolve([encounter_resource]);
});

module.exports.searchById = (args, context, logger) => new Promise((resolve, reject) => {
	logger.info('Encounter >>> searchById');

	let { base_version, id } = args;

	let Encounter = getEncounter(base_version);

	// TODO: Build query from Parameters

	// TODO: Query database

	// Cast result to Encounter Class
	let encounter_resource = new Encounter();
	// TODO: Set data with constructor or setter methods
	encounter_resource.id = 'test id';

	// Return resource class
	// resolve(encounter_resource);
	resolve();
});

module.exports.create = (args, context, logger) => new Promise((resolve, reject) => {
	logger.info('Encounter >>> create');

	let { base_version, id, resource } = args;

	let Encounter = getEncounter(base_version);
	let Meta = getMeta(base_version);

	// TODO: determine if client/server sets ID

	// Cast resource to Encounter Class
	let encounter_resource = new Encounter(resource);
	encounter_resource.meta = new Meta();
	// TODO: set meta info

	// TODO: save record to database

	// Return Id
	resolve({ id: encounter_resource.id });
});

module.exports.update = (args, context, logger) => new Promise((resolve, reject) => {
	logger.info('Encounter >>> update');

	let { base_version, id, resource } = args;

	let Encounter = getEncounter(base_version);
	let Meta = getMeta(base_version);

	// Cast resource to Encounter Class
	let encounter_resource = new Encounter(resource);
	encounter_resource.meta = new Meta();
	// TODO: set meta info, increment meta ID

	// TODO: save record to database

	// Return id, if recorded was created or updated, new meta version id
	resolve({ id: encounter_resource.id, created: false, resource_version: encounter_resource.meta.versionId });
});

module.exports.remove = (args, context, logger) => new Promise((resolve, reject) => {
	logger.info('Encounter >>> remove');

	let { id } = args;

	// TODO: delete record in database (soft/hard)

	// Return number of records deleted
	resolve({ deleted: 0 });
});

module.exports.searchByVersionId = (args, context, logger) => new Promise((resolve, reject) => {
	logger.info('Encounter >>> searchByVersionId');

	let { base_version, id, version_id } = args;

	let Encounter = getEncounter(base_version);

	// TODO: Build query from Parameters

	// TODO: Query database

	// Cast result to Encounter Class
	let encounter_resource = new Encounter();

	// Return resource class
	resolve(encounter_resource);
});

module.exports.history = (args, context, logger) => new Promise((resolve, reject) => {
	logger.info('Encounter >>> history');

	// Common search params
	let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } = args;

	// Search Result params
	let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } = args;

	// Resource Specific params
	let appointment = args['appointment'];
	let _class = args['_class'];
	let date = args['date'];
	let diagnosis = args['diagnosis'];
	let episodeofcare = args['episodeofcare'];
	let identifier = args['identifier'];
	let incomingreferral = args['incomingreferral'];
	let length = args['length'];
	let location = args['location'];
	let location_period = args['location-period'];
	let part_of = args['part-of'];
	let participant = args['participant'];
	let participant_type = args['participant-type'];
	let patient = args['patient'];
	let practitioner = args['practitioner'];
	let reason = args['reason'];
	let service_provider = args['service-provider'];
	let special_arrangement = args['special-arrangement'];
	let status = args['status'];
	let subject = args['subject'];
	let type = args['type'];

	// TODO: Build query from Parameters

	// TODO: Query database

	let Encounter = getEncounter(base_version);

	// Cast all results to Encounter Class
	let encounter_resource = new Encounter();

	// Return Array
	resolve([encounter_resource]);
});

module.exports.historyById = (args, context, logger) => new Promise((resolve, reject) => {
	logger.info('Encounter >>> historyById');

	// Common search params
	let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } = args;

	// Search Result params
	let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } = args;

	// Resource Specific params
	let appointment = args['appointment'];
	let _class = args['_class'];
	let date = args['date'];
	let diagnosis = args['diagnosis'];
	let episodeofcare = args['episodeofcare'];
	let identifier = args['identifier'];
	let incomingreferral = args['incomingreferral'];
	let length = args['length'];
	let location = args['location'];
	let location_period = args['location-period'];
	let part_of = args['part-of'];
	let participant = args['participant'];
	let participant_type = args['participant-type'];
	let patient = args['patient'];
	let practitioner = args['practitioner'];
	let reason = args['reason'];
	let service_provider = args['service-provider'];
	let special_arrangement = args['special-arrangement'];
	let status = args['status'];
	let subject = args['subject'];
	let type = args['type'];

	// TODO: Build query from Parameters

	// TODO: Query database

	let Encounter = getEncounter(base_version);

	// Cast all results to Encounter Class
	let encounter_resource = new Encounter();

	// Return Array
	resolve([encounter_resource]);
});

