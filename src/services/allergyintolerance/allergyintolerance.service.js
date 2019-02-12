/*eslint no-unused-vars: "warn"*/

const { RESOURCES, VERSIONS } = require('@asymmetrik/node-fhir-server-core').constants;
const FHIRServer = require('@asymmetrik/node-fhir-server-core');
const { ObjectID } = require('mongodb');
const { COLLECTION, CLIENT_DB } = require('../../constants');
const moment = require('moment-timezone');
const globals = require('../../globals');

const { dateQueryBuilder,
	tokenQueryBuilder,
	referenceQueryBuilder } = require('../../utils/querybuilder.util');


let getAllergyIntolerance = (base_version) => {
	return require(FHIRServer.resolveFromVersion(base_version, RESOURCES.ALLERGYINTOLERANCE));};

let getMeta = (base_version) => {
	return require(FHIRServer.resolveFromVersion(base_version, RESOURCES.META));};


let buildStu3SearchQuery = (args) =>	 {

	// Common search params
	let { _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } = args;

	// Search Result params
	let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } = args;

	// AllergyIntolerance search params
	let asserter = args['asserter'];
	let category = args['category'];
	let clinical_status = args['clinical-status'];
	let code = args['code'];
	let criticality = args['criticality'];
	let date = args['date'];
	let identifier = args['identifier'];
	let last_date = args['last-date'];
	let manifestation = args['manifestation'];
	let onset = args['onset'];
	let patient = args['patient'];
	let recorder = args['recorder'];
	let route = args['route'];
	let severity = args['severity'];
	let type = args['type'];
	let verification_status = args['verification-status'];

	let query = {};

	if (asserter) {
		let queryBuilder = referenceQueryBuilder(asserter, 'asserter.reference');
		for (let i in queryBuilder) {
			query[i] = queryBuilder[i];
		}
	}

	if (category) {
		query.category = category;
	}

	if (clinical_status) {
		query.clinicalStatus = clinical_status;
	}

	if (code) {
		query.$or = [tokenQueryBuilder(code, 'code', 'code.coding'), tokenQueryBuilder(code, 'code', 'reaction.substance.coding')];
	}

	if (criticality) {
		query.criticality = criticality;
	}

	if (date) {
		query['assertedDate'] = dateQueryBuilder(date);
	}

	if (identifier) {
		let queryBuilder = tokenQueryBuilder(identifier, 'value', 'identifier', '');
		for (let i in queryBuilder) {
			query[i] = queryBuilder[i];
		}
	}

	if (last_date) {
		query['lastOccurrence'] = dateQueryBuilder(last_date);
	}

	if (manifestation) {
		let queryBuilder = tokenQueryBuilder(manifestation, 'code', 'reaction.manifestation.coding', '');
		for (let i in queryBuilder) {
			query[i] = queryBuilder[i];
		}
	}

	if (onset) {
		query['reaction.onset'] = dateQueryBuilder(onset);
	}

	if (patient) {
		let queryBuilder = referenceQueryBuilder(patient, 'patient.reference');
		for (let i in queryBuilder) {
			query[i] = queryBuilder[i];
		}
	}

	if (recorder) {
		let queryBuilder = referenceQueryBuilder(recorder, 'recorder.reference');
		for (let i in queryBuilder) {
			query[i] = queryBuilder[i];
		}
	}

	if (route) {
		let queryBuilder = tokenQueryBuilder(route, 'code', 'reaction.exposureRoute.coding', '');
		for (let i in queryBuilder) {
			query[i] = queryBuilder[i];
		}
	}

	if (severity) {
		query['reaction.severity'] = severity;
	}

	if (type) {
		query.type = type;
	}

	if (verification_status) {
		query['verificationStatus'] = verification_status;
	}

	return query;

};

let buildDstu2SearchQuery = (args) =>	 {

	// TODO: Build query from Parameters

	// TODO: Query database

	// AllergyIntolerance search params
	let category = args['category'];
	let criticality = args['criticality'];
	let date = args['date'];
	let identifier = args['identifier'];
	let last_date = args['last-date'];
	let manifestation = args['manifestation'];
	let onset = args['onset'];
	let patient = args['patient'];
	let recorder = args['recorder'];
	let reporter = args['reporter'];
	let route = args['route'];
	let severity = args['severity'];
	let status = args['status'];
	let substance = args['status'];
	let type = args['type'];


	let query = {};

	return query;
};

/**
 *
 * @param {*} args
 * @param {*} context
 * @param {*} logger
 */
module.exports.search = (args, context, logger) => new Promise((resolve, reject) => {
	logger.info('AllergyIntolerance >>> search');

	let { base_version } = args;
	let query = {};

	if (base_version === VERSIONS['3_0_1']) {
		query = buildStu3SearchQuery(args);
	} else if (base_version === VERSIONS['1_0_2']) {
		query = buildDstu2SearchQuery(args);
	}

	// Grab an instance of our DB and collection
	let db = globals.get(CLIENT_DB);
	let collection = db.collection(`${COLLECTION.ALLERGYINTOLERANCE}_${base_version}`);
	let AllergyIntolerance = getAllergyIntolerance(base_version);

	// Query our collection for this observation
	collection.find(query, (err, data) => {
		if (err) {
			logger.error('Error with AllergyIntolerance.search: ', err);
			return reject(err);
		}

		// AllergyIntolerance is a allergy_intolerance cursor, pull documents out before resolving
		data.toArray().then((allergyintolerances) => {
			allergyintolerances.forEach(function(element, i, returnArray) {
				returnArray[i] = new AllergyIntolerance(element);
			});
			resolve(allergyintolerances);
		});
	});
});

module.exports.searchById = (args, context, logger) => new Promise((resolve, reject) => {
	logger.info('AllergyIntolerance >>> searchById');

	let { base_version, id } = args;
	let AllergyIntolerance = getAllergyIntolerance(base_version);

	// Grab an instance of our DB and collection
	let db = globals.get(CLIENT_DB);
	let collection = db.collection(`${COLLECTION.ALLERGYINTOLERANCE}_${base_version}`);
	// Query our collection for this observation
	collection.findOne({ id: id.toString() }, (err, allergyintolerance) => {
		if (err) {
			logger.error('Error with AllergyIntolerance.searchById: ', err);
			return reject(err);
		}
		if (allergyintolerance) {
			resolve(new AllergyIntolerance(allergyintolerance));
		}
		resolve();
	});
});

module.exports.create = (args, context, logger) => new Promise((resolve, reject) => {
	logger.info('AllergyIntolerance >>> create');

	let { base_version, resource } = args;
	// Make sure to use this ID when inserting this resource
	let id = new ObjectID().toString();

	// Grab an instance of our DB and collection
	let db = globals.get(CLIENT_DB);
	let collection = db.collection(`${COLLECTION.ALLERGYINTOLERANCE}_${base_version}`);

	// get current record
	let AllergyIntolerance = getAllergyIntolerance(base_version);
	let allergyintolerance = new AllergyIntolerance(resource);

	let Meta = getMeta(base_version);
	allergyintolerance.meta = new Meta({versionId: '1', lastUpdated: moment.utc().format('YYYY-MM-DDTHH:mm:ssZ')});

	let cleaned = JSON.parse(JSON.stringify(allergyintolerance.toJSON()));
	let doc = Object.assign(cleaned, { _id: id });

	// Insert/update our allergyintolerance record
	collection.updateOne({ id: id }, { $set: doc }, { upsert: true }, (err2, res) => {
		if (err2) {
			logger.error('Error with AllergyIntolerance.create: ', err2);
			return reject(err2);
		}

		// save to history
		let history_collection = db.collection(`${COLLECTION.ALLERGYINTOLERANCE}_${base_version}_History`);

		let history_allergyintolerance = Object.assign(cleaned, { id: id });

		// Insert our allergyintolerance record to history but don't assign _id
		return history_collection.insertOne(history_allergyintolerance, (err3) => {
			if (err3) {
				logger.error('Error with AllergyIntoleranceHistory.create: ', err3);
				return reject(err3);
			}

			return resolve({ id: id, created: res.lastErrorObject && !res.lastErrorObject.updatedExisting, resource_version: doc.meta.versionId });
		});

	});
	// Return Id
});

module.exports.update = (args, context, logger) => new Promise((resolve, reject) => {
	logger.info('AllergyIntolerance >>> update');

	let { base_version, id, resource } = args;

	// Grab an instance of our DB and collection
	let db = globals.get(CLIENT_DB);
	let collection = db.collection(`${COLLECTION.ALLERGYINTOLERANCE}_${base_version}`);

	// get current record
	// Query our collection for this observation
	collection.findOne({ id: id.toString() }, (err, data) => {
		if (err) {
			logger.error('Error with AllergyIntolerance.searchById: ', err);
			return reject(err);
		}

		let AllergyIntolerance = getAllergyIntolerance(base_version);
		let allergyintolerance = new AllergyIntolerance(resource);

		if (data && data.meta) {
			let foundAllergyIntolerance = new AllergyIntolerance(data);
			let meta = foundAllergyIntolerance.meta;
			meta.versionId = `${parseInt(foundAllergyIntolerance.meta.versionId) + 1}`;
			allergyintolerance.meta = meta;
		} else {
			let Meta = getMeta(base_version);
			allergyintolerance.meta = new Meta({versionId: '1', lastUpdated: moment.utc().format('YYYY-MM-DDTHH:mm:ssZ')});
		}

		let cleaned = JSON.parse(JSON.stringify(allergyintolerance));
		let doc = Object.assign(cleaned, { _id: id });

		// Insert/update our allergyintolerance record
		collection.findOneAndUpdate({ id: id }, { $set: doc }, { upsert: true }, (err2, res) => {
			if (err2) {
				logger.error('Error with AllergyIntolerance.update: ', err2);
				return reject(err2);
			}

			// save to history
			let history_collection = db.collection(`${COLLECTION.ALLERGYINTOLERANCE}_${base_version}_History`);

			let history_allergyintolerance = Object.assign(cleaned, { id: id });

			// Insert our allergyintolerance record to history but don't assign _id
			return history_collection.insertOne(history_allergyintolerance, (err3) => {
				if (err3) {
					logger.error('Error with AllergyIntoleranceHistory.create: ', err3);
					return reject(err3);
				}

				return resolve({ id: id, created: res.lastErrorObject && !res.lastErrorObject.updatedExisting, resource_version: doc.meta.versionId });
			});

		});
	});
});

module.exports.remove = (args, context, logger) => new Promise((resolve, reject) => {
	logger.info('AllergyIntolerance >>> remove');

	let { base_version, id } = args;

	// Grab an instance of our DB and collection
	let db = globals.get(CLIENT_DB);
	let collection = db.collection(`${COLLECTION.ALLERGYINTOLERANCE}_${base_version}`);
	// Delete our allergyintolerance record
	collection.deleteOne({ id: id }, (err, _) => {
		if (err) {
			logger.error('Error with AllergyIntolerance.remove');
			return reject({
				// Must be 405 (Method Not Allowed) or 409 (Conflict)
				// 405 if you do not want to allow the delete
				// 409 if you can't delete because of referential
				// integrity or some other reason
				code: 409,
				message: err.message
			});
		}

		// delete history as well.  You can chose to save history.  Up to you
		let history_collection = db.collection(`${COLLECTION.ALLERGYINTOLERANCE}_${base_version}_History`);
		return history_collection.deleteMany({ id: id }, (err2) => {
			if (err2) {
				logger.error('Error with AllergyIntolerance.remove');
				return reject({
					// Must be 405 (Method Not Allowed) or 409 (Conflict)
					// 405 if you do not want to allow the delete
					// 409 if you can't delete because of referential
					// integrity or some other reason
					code: 409,
					message: err2.message
				});
			}

			return resolve({ deleted: _.result && _.result.n });
		});

	});
});

module.exports.searchByVersionId = (args, context, logger) => new Promise((resolve, reject) => {
	logger.info('AllergyIntolerance >>> searchByVersionId');

	let { base_version, id, version_id } = args;

	let AllergyIntolerance = getAllergyIntolerance(base_version);

	let db = globals.get(CLIENT_DB);
	let history_collection = db.collection(`${COLLECTION.ALLERGYINTOLERANCE}_${base_version}_History`);

	// Query our collection for this observation
	history_collection.findOne({ id: id.toString(), 'meta.versionId': `${version_id}` }, (err, allergyintolerance) => {
		if (err) {
			logger.error('Error with AllergyIntolerance.searchByVersionId: ', err);
			return reject(err);
		}

		if (allergyintolerance) {
			resolve(new AllergyIntolerance(allergyintolerance));
		}

		resolve();

	});
});

module.exports.history = (args, context, logger) => new Promise((resolve, reject) => {
	logger.info('AllergyIntolerance >>> history');

	// Common search params
	let { base_version } = args;

	let query = {};

	if (base_version === VERSIONS['3_0_1']) {
		query = buildStu3SearchQuery(args);
	} else if (base_version === VERSIONS['1_0_2']) {
		query = buildDstu2SearchQuery(args);
	}

	// Grab an instance of our DB and collection
	let db = globals.get(CLIENT_DB);
	let history_collection = db.collection(`${COLLECTION.ALLERGYINTOLERANCE}_${base_version}_History`);
	let AllergyIntolerance = getAllergyIntolerance(base_version);

	// Query our collection for this observation
	history_collection.find(query, (err, data) => {
		if (err) {
			logger.error('Error with AllergyIntolerance.history: ', err);
			return reject(err);
		}

		// AllergyIntolerance is a allergyintolerance cursor, pull documents out before resolving
		data.toArray().then((allergyintolerances) => {
			allergyintolerances.forEach(function(element, i, returnArray) {
				returnArray[i] = new AllergyIntolerance(element);
			});
			resolve(allergyintolerances);
		});
	});
});

module.exports.historyById = (args, context, logger) => new Promise((resolve, reject) => {
	logger.info('AllergyIntolerance >>> historyById');

	let { base_version, id } = args;
	let query = {};

	if (base_version === VERSIONS['3_0_1']) {
		query = buildStu3SearchQuery(args);
	} else if (base_version === VERSIONS['1_0_2']) {
		query = buildDstu2SearchQuery(args);
	}

	query.id = `${id}`;

	// Grab an instance of our DB and collection
	let db = globals.get(CLIENT_DB);
	let history_collection = db.collection(`${COLLECTION.ALLERGYINTOLERANCE}_${base_version}_History`);
	let AllergyIntolerance = getAllergyIntolerance(base_version);

	// Query our collection for this observation
	history_collection.find(query, (err, data) => {
		if (err) {
			logger.error('Error with AllergyIntolerance.historyById: ', err);
			return reject(err);
		}

		// AllergyIntolerance is a allergyintolerance cursor, pull documents out before resolving
		data.toArray().then((allergyintolerances) => {
			allergyintolerances.forEach(function(element, i, returnArray) {
				returnArray[i] = new AllergyIntolerance(element);
			});
			resolve(allergyintolerances);
		});
	});
});
