/**
 * @name getCount
 * @description Get the number of observations in our database
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
 * @name getObservation
 * @description Get observation(s) from our database
 * @param {Express.req} req - Express request object
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
module.exports.getObservation = (req, logger) => new Promise((resolve, reject) => {
	let message = 'getObservation - Work in Progress';
	logger.info(message);
	reject(new Error(message));
});
