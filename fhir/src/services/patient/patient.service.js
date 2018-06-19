const { COLLECTION, CLIENT_DB } = require('../../constants');
const globals = require('../../globals');

/**
 * @name count
 * @description Get the number of patients in our database
 * @param {Object} args - Any provided args
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
module.exports.count = (args, logger) => new Promise((resolve, reject) => {
	logger.info('Patient >>> count');
	// Grab an instance of our DB and collection
	let db = globals.get(CLIENT_DB);
	let collection = db.collection(COLLECTION.PATIENT);
	// Query all documents in this collection
	collection.count((err, count) => {
		if (err) {
			logger.error('Error with Patient.count: ', err);
			return reject(err);
		}
		return resolve(count);
	});
});

/**
 * @name search
 * @description Get a patient from params
 * @param {Object} args - Any provided args
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
module.exports.search = (args, logger) => new Promise((resolve, reject) => {
	logger.info('Patient >>> search');
	// Parse the params
	let { id, identifier, name, family, given, gender, birthDate } = args;
	let query = {};

	if (id) {
		query.id = id;
	}

	if (identifier) {
		let [ system, value ] = identifier.split('|');

		query.identifier = {$elemMatch: { system, value }};
	}

	if (name) {
		query['name.family'] = name;
	}

	if (given) {
		query['name.given'] = given;
	}

	if (family) {
		query['name.family'] = family;
	}

	if (gender) {
		query.gender = gender;
	}

	if (birthDate) {
		query.birthDate = birthDate;
	}

	// Grab an instance of our DB and collection
	let db = globals.get(CLIENT_DB);
	let collection = db.collection(COLLECTION.PATIENT);
	// Query our collection for this observation
	collection.find(query, (err, patient) => {
		if (err) {
			logger.error('Error with Patient.search: ', err);
			return reject(err);
		}
		// Patient is a patient cursor, pull documents out before resolving
		patient.toArray().then(resolve, reject);
	});
});

/**
 * @name searchById
 * @description Get a patient by their unique identifier
 * @param {Object} args - Any provided args
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
module.exports.searchById = (args, logger) => new Promise((resolve, reject) => {
	logger.info('Patient >>> searchById');
	// Parse the required params, these are validated by sanitizeMiddleware in core
	let { id } = args;
	// Grab an instance of our DB and collection
	let db = globals.get(CLIENT_DB);
	let collection = db.collection(COLLECTION.PATIENT);
	// Query our collection for this observation
	collection.findOne({ id: id.toString() }, (err, patient) => {
		if (err) {
			logger.error('Error with Patient.searchById: ', err);
			return reject(err);
		}
		resolve(patient);
	});
});

/**
 * @name create
 * @description Create a patient
 * @param {Object} args - Any provided args
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
module.exports.create = (args, logger) => new Promise((resolve, reject) => {
	logger.info('Patient >>> create');
	let { id, resource } = args;
	// Grab an instance of our DB and collection
	let db = globals.get(CLIENT_DB);
	let collection = db.collection(COLLECTION.PATIENT);
	// If there is an id, use it, otherwise let mongo generate it
	let doc = Object.assign(resource.toJSON(), { _id: id });
	// Insert our patient record
	collection.insert(doc, (err, res) => {
		if (err) {
			logger.error('Error with Patient.create: ', err);
			return reject(err);
		}
		// Grab the patient record so we can pass back the id
		let [ patient ] = res.ops;

		return resolve({ id: patient.id });
	});
});

/**
 * @name update
 * @description Update a patient
 * @param {Object} args - Any provided args
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
module.exports.update = (args, logger) => new Promise((resolve, reject) => {
	logger.info('Patient >>> update');
	let { id, resource } = args;
	// Grab an instance of our DB and collection
	let db = globals.get(CLIENT_DB);
	let collection = db.collection(COLLECTION.PATIENT);
	// Set the id of the resource
	let doc = Object.assign(resource.toJSON(), { _id: id });
	// Insert/update our patient record
	collection.findOneAndUpdate({ id: id }, doc, { upsert: true }, (err, res) => {
		if (err) {
			logger.error('Error with Patient.update: ', err);
			return reject(err);
		}
		// If we support versioning, which we do not at the moment,
		// we need to return a version
		return resolve({ id: res.value && res.value.id });
	});
});

/**
 * @name remove
 * @description Delete a patient
 * @param {Object} args - Any provided args
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
module.exports.remove = (args, logger) => new Promise((resolve, reject) => {
	logger.info('Patient >>> remove');
	let { id } = args;
	// Grab an instance of our DB and collection
	let db = globals.get(CLIENT_DB);
	let collection = db.collection(COLLECTION.PATIENT);
	// Delete our patient record
	collection.remove({ id: id }, (err, _) => {
		if (err) {
			logger.error('Error with Patient.remove');
			return reject({
				// Must be 405 (Method Not Allowed) or 409 (Conflict)
				// 405 if you do not want to allow the delete
				// 409 if you can't delete because of referential
				// integrity or some other reason
				code: 409,
				message: err.message
			});
		}
		return resolve();
	});
});
