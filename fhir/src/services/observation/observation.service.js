const { validateDate } = require('../../utils/date.validator');
const { COLLECTION, CLIENT_DB } = require('../../constants');
const globals = require('../../globals');

/**
 * @name count
 * @description Get the number of observations in our database
 * @param {Object} args - Any provided args
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
module.exports.count = (args, logger) => new Promise((resolve, reject) => {
	logger.info('Observation >>> count');
	// Grab an instance of our DB and collection
	let db = globals.get(CLIENT_DB);
	let collection = db.collection(COLLECTION.OBSERVATION);
	// Query all documents in this collection
	collection.count((err, count) => {
		if (err) {
			logger.error('Error with Observation.count: ', err);
			return reject(err);
		}
		return resolve(count);
	});
});

/**
 * @name search
 * @description Get observation(s) from our database
 * @param {Object} args - Any provided args
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
module.exports.search = (args, logger) => new Promise((resolve, reject) => {
	logger.info('Observation >>> search');
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

	// Grab an instance of our DB and collection
	let db = globals.get(CLIENT_DB);
	let collection = db.collection(COLLECTION.OBSERVATION);
	// Query our collection for this observation
	collection.find(query, (err, observations) => {
		if (err) {
			logger.error('Error with Observation.search: ', err);
			return reject(err);
		}
		// Observations is a cursor, grab the documents from that
		observations.toArray().then(resolve, reject);
	});
});

/**
 * @name searchById
 * @description Get an observation from our database
 * @param {Object} args - Any provided args
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
module.exports.searchById = (args, logger) => new Promise((resolve, reject) => {
	logger.info('Observation >>> searchById');
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
 * @name create
 * @description Create a observation
 * @param {Object} args - Any provided args
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
module.exports.create = (args, logger) => new Promise((resolve, reject) => {
	logger.info('Observation >>> create');
	let { id, resource } = args;
	// Grab an instance of our DB and collection
	let db = globals.get(CLIENT_DB);
	let collection = db.collection(COLLECTION.OBSERVATION);
	// If there is an id, use it, otherwise let mongo generate it
	let doc = Object.assign(resource.toJSON(), { _id: id });
	// Insert our observation record
	collection.insert(doc, (err, res) => {
		if (err) {
			logger.error('Error with Observation.create: ', err);
			return reject(err);
		}
		// Grab the observation record so we can pass back the id
		let [ observation ] = res.ops;

		return resolve({ id: observation.id });
	});
});

/**
 * @name update
 * @description Update a observation
 * @param {Object} args - Any provided args
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
module.exports.update = (args, logger) => new Promise((resolve, reject) => {
	logger.info('Observation >>> update');
	let { id, resource } = args;
	// Grab an instance of our DB and collection
	let db = globals.get(CLIENT_DB);
	let collection = db.collection(COLLECTION.OBSERVATION);
	// Set the id of the resource
	let doc = Object.assign(resource.toJSON(), { _id: id });
	// Insert/update our observation record
	collection.findOneAndUpdate({ id: id }, doc, { upsert: true }, (err, res) => {
		if (err) {
			logger.error('Error with Observation.update: ', err);
			return reject(err);
		}
		// If we support versioning, which we do not at the moment,
		// we need to return a version
		return resolve({ id: res.value && res.value.id });
	});
});

/**
 * @name remove
 * @description Delete a observation
 * @param {Object} args - Any provided args
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
module.exports.remove = (args, logger) => new Promise((resolve, reject) => {
	logger.info('Observation >>> remove');
	let { id } = args;
	// Grab an instance of our DB and collection
	let db = globals.get(CLIENT_DB);
	let collection = db.collection(COLLECTION.OBSERVATION);
	// Delete our observation record
	collection.remove({ id: id }, (err, _) => {
		if (err) {
			logger.error('Error with Observation.remove');
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
