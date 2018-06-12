const { COLLECTION, CLIENT_DB } = require('../../constants');
const globals = require('../../globals');

/**
 * @name getCount
 * @description Get the number of immunizations in our database
 * @param {Object} args - Any provided args
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
module.exports.getCount = (args, logger) => new Promise((resolve, reject) => {
    logger.info('Immunization >>> getCount');
    // Grab an instance of our DB and collection
    let db = globals.get(CLIENT_DB);
    let collection = db.collection(COLLECTION.IMMUNIZATION);
    // Query all documents in this collection
    collection.count((err, count) => {
        if (err) {
            logger.error('Error with Immunization.getCount: ', err);
            return reject(err);
        }
        return resolve(count);
    });
});

/**
 * @name getImmunization
 * @description Get immunization(s) from our database
 * @param {Object} args - Any provided args
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
module.exports.getImmunization = (args, logger) => new Promise((resolve, reject) => {
    logger.info('Immunization >>> getImmunization');
    reject(new Error('Support coming soon'));
});

/**
 * @name getImmunizationById
 * @description Get an immunization from our database
 * @param {Object} args - Any provided args
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
module.exports.getImmunizationById = (args, logger) => new Promise((resolve, reject) => {
    logger.info('Immunization >>> getImmunizationById');
    // Parse the required params, these are validated by sanitizeMiddleware in core
    let { id } = args;
    // Grab an instance of our DB and collection
    let db = globals.get(CLIENT_DB);
    let collection = db.collection(COLLECTION.IMMUNIZATION);
    // Query our collection for this immunization
    collection.findOne({ id: id.toString() }, (err, immunization) => {
        if (err) {
            logger.error('Error with Immunization.getImmunizationById: ', err);
            return reject(err);
        }
        resolve(immunization);
    });
});

/**
 * @name createImmunization
 * @description Create an immunization
 * @param {Object} args - Any provided args
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
module.exports.createImmunization = (args, logger) => new Promise((resolve, reject) => {
    logger.info('Immunization >>> createImmunization');
    let { id, resource } = args;
    // Grab an instance of our DB and collection
    let db = globals.get(CLIENT_DB);
    let collection = db.collection(COLLECTION.IMMUNIZATION);
    // If there is an id, use it, otherwise let mongo generate it
    let doc = Object.assign(resource.toJSON(), { _id: id });
    // Insert our immunization record
    collection.insert(doc, (err, res) => {
        if (err) {
            logger.error('Error with Immunization.createImmunization: ', err);
            return reject(err);
        }
        // Grab the immunization record so we can pass back the id
        let [ immunization ] = res.ops;

        return resolve({ id: immunization.id });
    });
});

/**
 * @name updateImmunization
 * @description Update an immunization
 * @param {Object} args - Any provided args
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
module.exports.updateImmunization = (args, logger) => new Promise((resolve, reject) => {
    logger.info('Immunization >>> updateImmunization');
    let { id, resource } = args;
    // Grab an instance of our DB and collection
    let db = globals.get(CLIENT_DB);
    let collection = db.collection(COLLECTION.IMMUNIZATION);
    // Set the id of the resource
    let doc = Object.assign(resource.toJSON(), { _id: id });
    // Insert/update our immunization record
    collection.findOneAndUpdate({ id: id }, doc, { upsert: true }, (err, res) => {
        if (err) {
            logger.error('Error with Immunization.updateImmunization: ', err);
            return reject(err);
        }
        // If we support versioning, which we do not at the moment,
        // we need to return a version
        return resolve({ id: res.value && res.value.id });
    });
});

/**
 * @name deleteImmunization
 * @description Delete an immunization
 * @param {Object} args - Any provided args
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
module.exports.deleteImmunization = (args, logger) => new Promise((resolve, reject) => {
    logger.info('Immunization >>> deleteImmunization');
    let { id } = args;
    // Grab an instance of our DB and collection
    let db = globals.get(CLIENT_DB);
    let collection = db.collection(COLLECTION.IMMUNIZATION);
    // Delete our immunization record
    collection.remove({ id: id }, (err, _) => {
        if (err) {
            logger.error('Error with Immunization.deleteImmunization');
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
