const { COLLECTION, CLIENT_DB } = require('../../constants');
const globals = require('../../globals');

/**
 * @name getCount
 * @description Get the number of careplans in our database
 * @param {Object} args - Any provided args
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
module.exports.getCount = (args, logger) => new Promise((resolve, reject) => {
    logger.info('Careplan >>> getCount');
    // Grab an instance of our DB and collection
    let db = globals.get(CLIENT_DB);
    let collection = db.collection(COLLECTION.CAREPLAN);
    // Query all documents in this collection
    collection.count((err, count) => {
        if (err) {
            logger.error('Error with Careplan.getCount: ', err);
            return reject(err);
        }
        return resolve(count);
    });
});

/**
 * @name getCareplan
 * @description Get careplan(s) from our database
 * @param {Object} args - Any provided args
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
module.exports.getCareplan = (args, logger) => new Promise((resolve, reject) => {
    logger.info('Careplan >>> getCareplan');
    reject(new Error('Support coming soon'));
});

/**
 * @name getCareplanById
 * @description Get a careplan from our database
 * @param {Object} args - Any provided args
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
module.exports.getCareplanById = (args, logger) => new Promise((resolve, reject) => {
    logger.info('Careplan >>> getCareplanById');
    // Parse the required params, these are validated by sanitizeMiddleware in core
    let { id } = args;
    // Grab an instance of our DB and collection
    let db = globals.get(CLIENT_DB);
    let collection = db.collection(COLLECTION.CAREPLAN);
    // Query our collection for this careplan
    collection.findOne({ id: id.toString() }, (err, careplan) => {
        if (err) {
            logger.error('Error with Careplan.getCareplanById: ', err);
            return reject(err);
        }
        resolve(careplan);
    });
});

/**
 * @name createCareplan
 * @description Create a careplan
 * @param {Object} args - Any provided args
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
module.exports.createCareplan = (args, logger) => new Promise((resolve, reject) => {
    logger.info('Careplan >>> createCareplan');
    let { id, resource } = args;
    // Grab an instance of our DB and collection
    let db = globals.get(CLIENT_DB);
    let collection = db.collection(COLLECTION.CAREPLAN);
    // If there is an id, use it, otherwise let mongo generate it
    let doc = Object.assign(resource.toJSON(), { _id: id });
    // Insert our careplan record
    collection.insert(doc, (err, res) => {
        if (err) {
            logger.error('Error with Careplan.createCareplan: ', err);
            return reject(err);
        }
        // Grab the careplan record so we can pass back the id
        let [ careplan ] = res.ops;

        return resolve({ id: careplan.id });
    });
});

/**
 * @name updateCareplan
 * @description Update a careplan
 * @param {Object} args - Any provided args
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
module.exports.updateCareplan = (args, logger) => new Promise((resolve, reject) => {
    logger.info('Careplan >>> updateCareplan');
    let { id, resource } = args;
    // Grab an instance of our DB and collection
    let db = globals.get(CLIENT_DB);
    let collection = db.collection(COLLECTION.CAREPLAN);
    // Set the id of the resource
    let doc = Object.assign(resource.toJSON(), { _id: id });
    // Insert/update our careplan record
    collection.findOneAndUpdate({ id: id }, doc, { upsert: true }, (err, res) => {
        if (err) {
            logger.error('Error with Careplan.updateCareplan: ', err);
            return reject(err);
        }
        // If we support versioning, which we do not at the moment,
        // we need to return a version
        return resolve({ id: res.value && res.value.id });
    });
});

/**
 * @name deleteCareplan
 * @description Delete a careplan
 * @param {Object} args - Any provided args
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
module.exports.deleteCareplan = (args, logger) => new Promise((resolve, reject) => {
    logger.info('Careplan >>> deleteCareplan');
    let { id } = args;
    // Grab an instance of our DB and collection
    let db = globals.get(CLIENT_DB);
    let collection = db.collection(COLLECTION.CAREPLAN);
    // Delete our careplan record
    collection.remove({ id: id }, (err, _) => {
        if (err) {
            logger.error('Error with Careplan.deleteCareplan');
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
