const { validateDate } = require('../../utils/date.validator');
const { COLLECTION, CLIENT_DB } = require('../../constants');
const globals = require('../../globals');

/**
 * @name getCount
 * @description Get the number of observations in our database
 * @param {Object} args - Any provided args
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
module.exports.getCount = (args, logger) => new Promise((resolve, reject) => {
	logger.info('Observation >>> getCount');
	// Grab an instance of our DB and collection
	let db = globals.get(CLIENT_DB);
	let collection = db.collection(COLLECTION.OBSERVATION);
	// Query all documents in this collection
	collection.count((err, count) => {
		if (err) {
			logger.error('Error with Observation.getCount: ', err);
			return reject(err);
		}
		return resolve(count);
	});
});

/**
 * @name getObservation
 * @description Get observation(s) from our database
 * @param {Object} args - Any provided args
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
module.exports.getObservation = (args, logger) => new Promise((resolve, reject) => {
	logger.info('Observation >>> getObservation');
	// Parse out all the params for this service and start building our query
	let { patient, category, code, date } = args;
	// Patient is required and guaranteed to be provided
	let query = {
		subject: {
			reference: `Patient/${patient}`
		}
	};

	if (category) {
		query['category.coding.code'] = category;
	}

	if (code) {
		query['code.coding.code'] = { $in: code.split(',') };
	}

	if (date) {
		let parsedDates = validateDate(date);
		if (parsedDates) {
			query.effectiveDateTime = parsedDates;
		}
	}

	console.log(query);

	// Grab an instance of our DB and collection
	let db = globals.get(CLIENT_DB);
	let collection = db.collection(COLLECTION.OBSERVATION);
	// Query our collection for this observation
	collection.find(query, (err, observations) => {
		if (err) {
			logger.error('Error with Observation.getObservation: ', err);
			return reject(err);
		}
		// Observations is a cursor, grab the documents from that
		observations.toArray().then(resolve, reject);
	});
});

/**
 * @name getObservationById
 * @description Get an observation from our database
 * @param {Object} args - Any provided args
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
module.exports.getObservationById = (args, logger) => new Promise((resolve, reject) => {
	logger.info('Observation >>> getObservationById');
	// Parse the required params, these are validated by sanitizeMiddleware in core
	let { id } = args;
	// Grab an instance of our DB and collection
	let db = globals.get(CLIENT_DB);
	let collection = db.collection(COLLECTION.OBSERVATION);
	// Query our collection for this observation
	collection.findOne({ id: id.toString() }, (err, observation) => {
		if (err) {
			logger.error('Error with Observation.getObservationByID: ', err);
			return reject(err);
		}
		resolve(observation);
	});
});

/**
 * @name createObservation
 * @description Create a observation
 * @param {Object} args - Any provided args
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
module.exports.createObservation = (args, logger) => new Promise((resolve, reject) => {
	logger.info('Observation >>> createObservation');
	reject(new Error('Support coming soon'));
});

/**
 * @name updateObservation
 * @description Update a observation
 * @param {Object} args - Any provided args
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
module.exports.updateObservation = (args, logger) => new Promise((resolve, reject) => {
	logger.info('Observation >>> updateObservation');
	reject(new Error('Support coming soon'));
});

/**
 * @name deleteObservation
 * @description Delete a observation
 * @param {Object} args - Any provided args
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
module.exports.deleteObservation = (args, logger) => new Promise((resolve, reject) => {
	logger.info('Observation >>> deleteObservation');
	reject(new Error('Support coming soon'));
});
