const { COLLECTION, CLIENT_DB } = require('../../constants');
const globals = require('../../globals');

/**
 * @name getCount
 * @description Get the number of patients in our database
 * @param {Express.req} req - Express request object
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
module.exports.getCount = (req, logger) => new Promise((resolve, reject) => {
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
 * @param {Express.req} req - Express request object
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
module.exports.getPatient = (req, logger) => new Promise((resolve, reject) => {
	logger.info('Patient >>> getPatient');
	// Parse the params
	let { id, identifier, name, family, given, gender, birthDate } = req.query;
	let query = {};

	if (id) {
		query.id = id;
	}

	if (identifier) {
		let [ system, value ] = identifier.split('|');
		query.identifier = [{ system, value }];
	}

	if (name || given || family) {
		let nameOptions = {};
		if (name) { nameOptions.text = name; }
		if (given) { nameOptions.text = [given]; }
		if (family) { nameOptions.text = [family]; }
		query.name = [nameOptions];
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
	collection.findOne(query, (err, patient) => {
		if (err) {
			logger.error('Error with Patient.getPatient: ', err);
			return reject(err);
		}
		resolve(patient);
	});
});

/**
 * @name getPatientById
 * @description Get a patient by their unique identifier
 * @param {Express.req} req - Express request object
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
module.exports.getPatientById = (req, logger) => new Promise((resolve, reject) => {
	logger.info('Patient >>> getPatientById');
	// Parse the required params, these are validated by sanitizeMiddleware in core
	let { id } = req.params;
	// Grab an instance of our DB and collection
	let db = globals.get(CLIENT_DB);
	let collection = db.collection(COLLECTION.PATIENT);
	// Query our collection for this observation
	collection.findOne({ id }, (err, patient) => {
		if (err) {
			logger.error('Error with Patient.getPatientById: ', err);
			return reject(err);
		}
		resolve(patient);
	});
});
