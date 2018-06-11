const { COLLECTION, CLIENT_DB } = require('../../constants');
const globals = require('../../globals');

/**
 * @name getCount
 * @description Get the number of allergyintolerances in our database
 * @param {Object} args - Any provided args
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
module.exports.getCount = (args, logger) => new Promise((resolve, reject) => {
    logger.info('Allergyintolerance >>> getCount');
    // Grab an instance of our DB and collection
    let db = globals.get(CLIENT_DB);
    let collection = db.collection(COLLECTION.ALLERGYINTOLERANCE);
    // Query all documents in this collection
    collection.count((err, count) => {
        if (err) {
            logger.error('Error with Allergyintolerance.getCount: ', err);
            return reject(err);
        }
        return resolve(count);
    });
});

/**
 * @name getAllergyIntolerance
 * @description Get allergyintolerance(s) from our database
 * @param {Object} args - Any provided args
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
module.exports.getAllergyIntolerance = (args, logger) => new Promise((resolve, reject) => {
    logger.info('Allergyintolerance >>> getAllergyintolerance');
    reject(new Error('Support coming soon'));
});

/**
 * @name getAllergyintoleranceById
 * @description Get an allergyintolerance from our database
 * @param {Object} args - Any provided args
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
module.exports.getAllergyintoleranceById = (args, logger) => new Promise((resolve, reject) => {
    logger.info('Allergyintolerance >>> getAllergyintoleranceById');
    // Parse the required params, these are validated by sanitizeMiddleware in core
    let { id } = args;
    // Grab an instance of our DB and collection
    let db = globals.get(CLIENT_DB);
    let collection = db.collection(COLLECTION.ALLERGYINTOLERANCE);
    // Query our collection for this allergyintolerance
    collection.findOne({ id: id.toString() }, (err, allergyintolerance) => {
        if (err) {
            logger.error('Error with Allergyintolerance.getAllergyintoleranceById: ', err);
            return reject(err);
        }
        resolve(allergyintolerance);
    });
});

/**
 * @name createAllergyintolerance
 * @description Create an allergyintolerance
 * @param {Object} args - Any provided args
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
module.exports.createAllergyintolerance = (args, logger) => new Promise((resolve, reject) => {
    logger.info('Allergyintolerance >>> createAllergyintolerance');
    let { id, resource } = args;
    // Grab an instance of our DB and collection
    let db = globals.get(CLIENT_DB);
    let collection = db.collection(COLLECTION.ALLERGYINTOLERANCE);
    // If there is an id, use it, otherwise let mongo generate it
    let doc = Object.assign(resource.toJSON(), { _id: id });
    // Insert our allergyintolerance record
    collection.insert(doc, (err, res) => {
        if (err) {
            logger.error('Error with Allergyintolerance.createAllergyintolerance: ', err);
            return reject(err);
        }
        // Grab the allergyintolerance record so we can pass back the id
        let [ allergyintolerance ] = res.ops;

        return resolve({ id: allergyintolerance.id });
    });
});

/**
 * @name updateAllergyintolerance
 * @description Update an allergyintolerance
 * @param {Object} args - Any provided args
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
module.exports.updateAllergyintolerance = (args, logger) => new Promise((resolve, reject) => {
    logger.info('Allergyintolerance >>> updateAllergyintolerance');
    let { id, resource } = args;
    // Grab an instance of our DB and collection
    let db = globals.get(CLIENT_DB);
    let collection = db.collection(COLLECTION.ALLERGYINTOLERANCE);
    // Set the id of the resource
    let doc = Object.assign(resource.toJSON(), { _id: id });
    // Insert/update our allergyintolerance record
    collection.findOneAndUpdate({ id: id }, doc, { upsert: true }, (err, res) => {
        if (err) {
            logger.error('Error with Allergyintolerance.updateAllergyintolerance: ', err);
            return reject(err);
        }
        // If we support versioning, which we do not at the moment,
        // we need to return a version
        return resolve({ id: res.value && res.value.id });
    });
});

/**
 * @name deleteAllergyintolerance
 * @description Delete an allergyintolerance
 * @param {Object} args - Any provided args
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
module.exports.deleteAllergyintolerance = (args, logger) => new Promise((resolve, reject) => {
    logger.info('Allergyintolerance >>> deleteAllergyintolerance');
    let { id } = args;
    // Grab an instance of our DB and collection
    let db = globals.get(CLIENT_DB);
    let collection = db.collection(COLLECTION.ALLERGYINTOLERANCE);
    // Delete our allergyintolerance record
    collection.remove({ id: id }, (err, _) => {
        if (err) {
            logger.error('Error with Allergyintolerance.deleteAllergyintolerance');
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
