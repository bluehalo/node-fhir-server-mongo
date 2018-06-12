const { COLLECTION, CLIENT_DB } = require('../../constants');
const globals = require('../../globals');

/**
 * @name getCount
 * @description Get the number of devices in our database
 * @param {Object} args - Any provided args
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
module.exports.getCount = (args, logger) => new Promise((resolve, reject) => {
    logger.info('Device >>> getCount');
    // Grab an instance of our DB and collection
    let db = globals.get(CLIENT_DB);
    let collection = db.collection(COLLECTION.DEVICE);
    // Query all documents in this collection
    collection.count((err, count) => {
        if (err) {
            logger.error('Error with Device.getCount: ', err);
            return reject(err);
        }
        return resolve(count);
    });
});

/**
 * @name getDevice
 * @description Get medicationstatement(s) from our database
 * @param {Object} args - Any provided args
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
module.exports.getMedicationstatement = (args, logger) => new Promise((resolve, reject) => {
    logger.info('Device >>> getDevice');
    reject(new Error('Support coming soon'));
});

/**
 * @name getDeviceById
 * @description Get a device by their unique identifier
 * @param {Object} args - Any provided args
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
module.exports.getDeviceById = (args, logger) => new Promise((resolve, reject) => {
    logger.info('Device >>> getDeviceById');
    // Parse the required params, these are validated by sanitizeMiddleware in core
    let { id } = args;
    // Grab an instance of our DB and collection
    let db = globals.get(CLIENT_DB);
    let collection = db.collection(COLLECTION.DEVICE);
    // Query our collection for this observation
    collection.findOne({ id: id.toString() }, (err, device) => {
        if (err) {
            logger.error('Error with Device.getDeviceById: ', err);
            return reject(err);
        }
        resolve(device);
    });
});

/**
 * @name createDevice
 * @description Create a device
 * @param {Object} args - Any provided args
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
module.exports.createDevice = (args, logger) => new Promise((resolve, reject) => {
    logger.info('Device >>> createDevice');
    let { id, resource } = args;
    // Grab an instance of our DB and collection
    let db = globals.get(CLIENT_DB);
    let collection = db.collection(COLLECTION.DEVICE);
    // If there is an id, use it, otherwise let mongo generate it
    let doc = Object.assign(resource.toJSON(), { _id: id });
    // Insert our device record
    collection.insert(doc, (err, res) => {
        if (err) {
            logger.error('Error with Device.createDevice: ', err);
            return reject(err);
        }
        // Grab the device record so we can pass back the id
        let [ device ] = res.ops;

        return resolve({ id: device.id });
    });
});

/**
 * @name updateDevice
 * @description Update a device
 * @param {Object} args - Any provided args
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
module.exports.updateDevice = (args, logger) => new Promise((resolve, reject) => {
    logger.info('Device >>> updateDevice');
    let { id, resource } = args;
    // Grab an instance of our DB and collection
    let db = globals.get(CLIENT_DB);
    let collection = db.collection(COLLECTION.DEVICE);
    // Set the id of the resource
    let doc = Object.assign(resource.toJSON(), { _id: id });
    // Insert/update our device record
    collection.findOneAndUpdate({ id: id }, doc, { upsert: true }, (err, res) => {
        if (err) {
            logger.error('Error with Device.updateDevice: ', err);
            return reject(err);
        }
        // If we support versioning, which we do not at the moment,
        // we need to return a version
        return resolve({ id: res.value && res.value.id });
    });
});

/**
 * @name deleteDevice
 * @description Delete a device
 * @param {Object} args - Any provided args
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
module.exports.deleteDevice = (args, logger) => new Promise((resolve, reject) => {
    logger.info('Device >>> deleteDevice');
    let { id } = args;
    // Grab an instance of our DB and collection
    let db = globals.get(CLIENT_DB);
    let collection = db.collection(COLLECTION.DEVICE);
    // Delete our device record
    collection.remove({ id: id }, (err, _) => {
        if (err) {
            logger.error('Error with Device.deleteDevice');
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
