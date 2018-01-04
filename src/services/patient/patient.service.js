/**
 * @name getCount
 * @description Get the number of patients in our database
 * @param {Express.req} req - Express request object
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
module.exports.getCount = (req, logger) => new Promise((resolve, reject) => {
	let message = 'getCount - Work in Progress';
	logger.info(message);
	reject(new Error(message));
});

/**
 * @name getPatient
 * @description Get a patient from params
 * @param {Express.req} req - Express request object
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
module.exports.getPatient = (req, logger) => new Promise((resolve, reject) => {
	let message = 'getPatient - Work in Progress';
	logger.info(message);
	reject(new Error(message));
});

/**
 * @name getPatientById
 * @description Get a patient by their unique identifier
 * @param {Express.req} req - Express request object
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
module.exports.getPatientById = (req, logger) => new Promise((resolve, reject) => {
	let message = 'getPatientById - Work in Progress';
	logger.info(message);
	reject(new Error(message));
});
