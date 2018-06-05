const { COLLECTION, CLIENT_DB } = require('../../constants');
const globals = require('../../globals');

/**
 * @name getCount
 * @description Get the number of patients in our database
 * @param {Object} args - Any provided args
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
module.exports.getCount = (args, logger) => new Promise((resolve, reject) => {
	logger.info('Patient >>> getCount');
	// Grab an instance of our DB and collection
	let db = globals.get(CLIENT_DB);
	let collection = db.collection(COLLECTION.PATIENT);
	// Query all documents in this collection
	collection.count((err, count) => {
		if (err) {
			logger.error('Error with Patient.getCount: ', err);
			return reject(err);
		}
		return resolve(count);
	});
});

/**
 * @name getPatient
 * @description Get a patient from params
 * @param {Object} args - Any provided args
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
module.exports.getPatient = (args, logger) => new Promise((resolve, reject) => {
	logger.info('Patient >>> getPatient');
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
			logger.error('Error with Patient.getPatient: ', err);
			return reject(err);
		}
		// Patient is a patient cursor, pull documents out before resolving
		patient.toArray().then(resolve, reject);
	});
});

/**
 * @name getPatientById
 * @description Get a patient by their unique identifier
 * @param {Object} args - Any provided args
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
module.exports.getPatientById = (args, logger) => new Promise((resolve, reject) => {
	logger.info('Patient >>> getPatientById');
	// Parse the required params, these are validated by sanitizeMiddleware in core
	let { id } = args;
	// Grab an instance of our DB and collection
	let db = globals.get(CLIENT_DB);
	let collection = db.collection(COLLECTION.PATIENT);
	// Query our collection for this observation
	collection.findOne({ id: id.toString() }, (err, patient) => {
		if (err) {
			logger.error('Error with Patient.getPatientById: ', err);
			return reject(err);
		}
		resolve(patient);
	});
});

/**
 * @name createPatient
 * @description Create a patient
 * @param {Object} args - Any provided args
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
module.exports.createPatient = (args, logger) => new Promise((resolve, reject) => {
	logger.info('Patient >>> createPatient');
	let { id, resource } = args;
	// Grab an instance of our DB and collection
	let db = globals.get(CLIENT_DB);
	let collection = db.collection(COLLECTION.PATIENT);
	// If there is an id, use it, otherwise let mongo generate it
	let doc = Object.assign(resource.toJSON(), { _id: id });
	// Insert our patient record
	collection.insert(doc, (err, res) => {
		if (err) {
			logger.error('Error with Patient.createPatient: ', err);
			return reject(err);
		}
		// Grab the patient record so we can pass back the id
		let [ patient ] = res.ops;

		return resolve({ id: patient.id });
	});
});

/**
 * @name updatePatient
 * @description Update a patient
 * @param {Object} args - Any provided args
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
module.exports.updatePatient = (args, logger) => new Promise((resolve, reject) => {
	logger.info('Patient >>> updatePatient');
	let { id, resource } = args;
	// Grab an instance of our DB and collection
	let db = globals.get(CLIENT_DB);
	let collection = db.collection(COLLECTION.PATIENT);
	// Set the id of the resource
	let doc = Object.assign(resource.toJSON(), { _id: id });
	// Insert/update our patient record
	collection.findOneAndUpdate({ id: id }, doc, { upsert: true }, (err, res) => {
		if (err) {
			logger.error('Error with Patient.updatePatient: ', err);
			return reject(err);
		}
		// If we support versioning, which we do not at the moment,
		// we need to return a version
		return resolve({ id: res.value && res.value.id });
	});
});

/**
 * @name deletePatient
 * @description Delete a patient
 * @param {Object} args - Any provided args
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
module.exports.deletePatient = (args, logger) => new Promise((resolve, reject) => {
	logger.info('Patient >>> deletePatient');
	let { id } = args;
	// Grab an instance of our DB and collection
	let db = globals.get(CLIENT_DB);
	let collection = db.collection(COLLECTION.PATIENT);
	// Delete our patient record
	collection.remove({ id: id }, (err, _) => {
		if (err) {
			logger.error('Error with Patient.deletePatient');
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
