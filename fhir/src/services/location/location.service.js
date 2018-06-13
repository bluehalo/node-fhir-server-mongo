const { COLLECTION, CLIENT_DB } = require('../../constants');
const globals = require('../../globals');

/**
 * @name getCount
 * @description Get the number of locations in our database
 * @param {Object} args - Any provided args
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
module.exports.getCount = (args, logger) => new Promise((resolve, reject) => {
    logger.info('Location >>> getCount');
    // Grab an instance of our DB and collection
    let db = globals.get(CLIENT_DB);
    let collection = db.collection(COLLECTION.LOCATION);
    // Query all documents in this collection
    collection.count((err, count) => {
        if (err) {
            logger.error('Error with Location.getCount: ', err);
            return reject(err);
        }
        return resolve(count);
    });
});

/**
 * @name getLocation
 * @description Get location(s) from our database
 * @param {Object} args - Any provided args
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
module.exports.getLocation = (args, logger) => new Promise((resolve, reject) => {
    logger.info('Location >>> getLocation');
    reject(new Error('Support coming soon'));
});

/**
 * @name getLocationById
 * @description Get a location from our database
 * @param {Object} args - Any provided args
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
module.exports.getLocationById = (args, logger) => new Promise((resolve, reject) => {
    logger.info('Location >>> getLocationById');
    // Parse the required params, these are validated by sanitizeMiddleware in core
    let { id } = args;
    // Grab an instance of our DB and collection
    let db = globals.get(CLIENT_DB);
    let collection = db.collection(COLLECTION.LOCATION);
    // Query our collection for this location
    collection.findOne({ id: id.toString() }, (err, location) => {
        if (err) {
            logger.error('Error with Location.getLocationById: ', err);
            return reject(err);
        }
        resolve(location);
    });
});

/**
 * @name createLocation
 * @description Create a location
 * @param {Object} args - Any provided args
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
module.exports.createLocation = (args, logger) => new Promise((resolve, reject) => {
    logger.info('Location >>> createLocation');
    let { id, resource } = args;
    // Grab an instance of our DB and collection
    let db = globals.get(CLIENT_DB);
    let collection = db.collection(COLLECTION.LOCATION);
    // If there is an id, use it, otherwise let mongo generate it
    let doc = Object.assign(resource.toJSON(), { _id: id });
    // Insert our location record
    collection.insert(doc, (err, res) => {
        if (err) {
            logger.error('Error with Location.createLocation: ', err);
            return reject(err);
        }
        // Grab the location record so we can pass back the id
        let [ location ] = res.ops;

        return resolve({ id: location.id });
    });
});

/**
 * @name updateLocation
 * @description Update a location
 * @param {Object} args - Any provided args
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
module.exports.updateLocation = (args, logger) => new Promise((resolve, reject) => {
    logger.info('Location >>> updateLocation');
    let { id, resource } = args;
    // Grab an instance of our DB and collection
    let db = globals.get(CLIENT_DB);
    let collection = db.collection(COLLECTION.LOCATION);
    // Set the id of the resource
    let doc = Object.assign(resource.toJSON(), { _id: id });
    // Insert/update our location record
    collection.findOneAndUpdate({ id: id }, doc, { upsert: true }, (err, res) => {
        if (err) {
            logger.error('Error with Location.updateLocation: ', err);
            return reject(err);
        }
        // If we support versioning, which we do not at the moment,
        // we need to return a version
        return resolve({ id: res.value && res.value.id });
    });
});

/**
 * @name deleteLocation
 * @description Delete a location
 * @param {Object} args - Any provided args
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
module.exports.deleteLocation = (args, logger) => new Promise((resolve, reject) => {
    logger.info('Location >>> deleteLocation');
    let { id } = args;
    // Grab an instance of our DB and collection
    let db = globals.get(CLIENT_DB);
    let collection = db.collection(COLLECTION.LOCATION);
    // Delete our location record
    collection.remove({ id: id }, (err, _) => {
        if (err) {
            logger.error('Error with Location.deleteLocation');
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
