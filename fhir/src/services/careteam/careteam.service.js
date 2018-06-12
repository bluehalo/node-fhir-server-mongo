const { COLLECTION, CLIENT_DB } = require('../../constants');
const globals = require('../../globals');

/**
 * @name getCount
 * @description Get the number of careteams in our database
 * @param {Object} args - Any provided args
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
module.exports.getCount = (args, logger) => new Promise((resolve, reject) => {
    logger.info('Careteam >>> getCount');
    // Grab an instance of our DB and collection
    let db = globals.get(CLIENT_DB);
    let collection = db.collection(COLLECTION.CARETEAM);
    // Query all documents in this collection
    collection.count((err, count) => {
        if (err) {
            logger.error('Error with Careteam.getCount: ', err);
            return reject(err);
        }
        return resolve(count);
    });
});

/**
 * @name getCareteam
 * @description Get medicationstatement(s) from our database
 * @param {Object} args - Any provided args
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
module.exports.getMedicationstatement = (args, logger) => new Promise((resolve, reject) => {
    logger.info('Careteam >>> getCareteam');
    reject(new Error('Support coming soon'));
});

/**
 * @name getCareteamById
 * @description Get a careteam by their unique identifier
 * @param {Object} args - Any provided args
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
module.exports.getCareteamById = (args, logger) => new Promise((resolve, reject) => {
    logger.info('Careteam >>> getCareteamById');
    // Parse the required params, these are validated by sanitizeMiddleware in core
    let { id } = args;
    // Grab an instance of our DB and collection
    let db = globals.get(CLIENT_DB);
    let collection = db.collection(COLLECTION.CARETEAM);
    // Query our collection for this observation
    collection.findOne({ id: id.toString() }, (err, careteam) => {
        if (err) {
            logger.error('Error with Careteam.getCareteamById: ', err);
            return reject(err);
        }
        resolve(careteam);
    });
});

/**
 * @name createCareteam
 * @description Create a careteam
 * @param {Object} args - Any provided args
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
module.exports.createCareteam = (args, logger) => new Promise((resolve, reject) => {
    logger.info('Careteam >>> createCareteam');
    let { id, resource } = args;
    // Grab an instance of our DB and collection
    let db = globals.get(CLIENT_DB);
    let collection = db.collection(COLLECTION.CARETEAM);
    // If there is an id, use it, otherwise let mongo generate it
    let doc = Object.assign(resource.toJSON(), { _id: id });
    // Insert our careteam record
    collection.insert(doc, (err, res) => {
        if (err) {
            logger.error('Error with Careteam.createCareteam: ', err);
            return reject(err);
        }
        // Grab the careteam record so we can pass back the id
        let [ careteam ] = res.ops;

        return resolve({ id: careteam.id });
    });
});

/**
 * @name updateCareteam
 * @description Update a careteam
 * @param {Object} args - Any provided args
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
module.exports.updateCareteam = (args, logger) => new Promise((resolve, reject) => {
    logger.info('Careteam >>> updateCareteam');
    let { id, resource } = args;
    // Grab an instance of our DB and collection
    let db = globals.get(CLIENT_DB);
    let collection = db.collection(COLLECTION.CARETEAM);
    // Set the id of the resource
    let doc = Object.assign(resource.toJSON(), { _id: id });
    // Insert/update our careteam record
    collection.findOneAndUpdate({ id: id }, doc, { upsert: true }, (err, res) => {
        if (err) {
            logger.error('Error with Careteam.updateCareteam: ', err);
            return reject(err);
        }
        // If we support versioning, which we do not at the moment,
        // we need to return a version
        return resolve({ id: res.value && res.value.id });
    });
});

/**
 * @name deleteCareteam
 * @description Delete a careteam
 * @param {Object} args - Any provided args
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
module.exports.deleteCareteam = (args, logger) => new Promise((resolve, reject) => {
    logger.info('Careteam >>> deleteCareteam');
    let { id } = args;
    // Grab an instance of our DB and collection
    let db = globals.get(CLIENT_DB);
    let collection = db.collection(COLLECTION.CARETEAM);
    // Delete our careteam record
    collection.remove({ id: id }, (err, _) => {
        if (err) {
            logger.error('Error with Careteam.deleteCareteam');
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
