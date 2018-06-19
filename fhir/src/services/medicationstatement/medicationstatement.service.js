const { COLLECTION, CLIENT_DB } = require('../../constants');
const globals = require('../../globals');

/**
 * @name count
 * @description Get the number of medicationstatement in our database
 * @param {Object} args - Any provided args
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
module.exports.count = (args, logger) => new Promise((resolve, reject) => {
    logger.info('MedicationStatement >>> count');
    // Grab an instance of our DB and collection
    let db = globals.get(CLIENT_DB);
    let collection = db.collection(COLLECTION.MEDICATIONSTATEMENT);
    // Query all documents in this collection
    collection.count((err, count) => {
        if (err) {
            logger.error('Error with MedicationStatement.count: ', err);
            return reject(err);
        }
        return resolve(count);
    });
});

/**
 * @name search
 * @description Get medicationstatement(s) from our database
 * @param {Object} args - Any provided args
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
module.exports.search = (args, logger) => new Promise((resolve, reject) => {
    logger.info('MedicationStatement >>> search');
    reject(new Error('Support coming soon'));
});

/**
 * @name searchById
 * @description Get a medicationstatement from our database
 * @param {Object} args - Any provided args
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
module.exports.searchById = (args, logger) => new Promise((resolve, reject) => {
    logger.info('MedicationStatement >>> searchById');
    // Parse the required params, these are validated by sanitizeMiddleware in core
    let { id } = args;
    // Grab an instance of our DB and collection
    let db = globals.get(CLIENT_DB);
    let collection = db.collection(COLLECTION.MEDICATIONSTATEMENT);
    // Query our collection for this medicationstatement
    collection.findOne({ id: id.toString() }, (err, medicationstatement) => {
        if (err) {
            logger.error('Error with MedicationStatement.searchById: ', err);
            return reject(err);
        }
        resolve(medicationstatement);
    });
});

/**
 * @name create
 * @description Create a medicationstatement
 * @param {Object} args - Any provided args
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
module.exports.create = (args, logger) => new Promise((resolve, reject) => {
    logger.info('MedicationStatement >>> create');
    let { id, resource } = args;
    // Grab an instance of our DB and collection
    let db = globals.get(CLIENT_DB);
    let collection = db.collection(COLLECTION.MEDICATIONSTATEMENT);
    // If there is an id, use it, otherwise let mongo generate it
    let doc = Object.assign(resource.toJSON(), { _id: id });
    // Insert our medicationstatement record
    collection.insert(doc, (err, res) => {
        if (err) {
            logger.error('Error with MedicationStatement.create: ', err);
            return reject(err);
        }
        // Grab the medicationstatement record so we can pass back the id
        let [ medicationstatement ] = res.ops;

        return resolve({ id: medicationstatement.id });
    });
});

/**
 * @name update
 * @description Update a medicationstatement
 * @param {Object} args - Any provided args
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
module.exports.update = (args, logger) => new Promise((resolve, reject) => {
    logger.info('MedicationStatement >>> update');
    let { id, resource } = args;
    // Grab an instance of our DB and collection
    let db = globals.get(CLIENT_DB);
    let collection = db.collection(COLLECTION.MEDICATIONSTATEMENT);
    // Set the id of the resource
    let doc = Object.assign(resource.toJSON(), { _id: id });
    // Insert/update our medicationstatement record
    collection.findOneAndUpdate({ id: id }, doc, { upsert: true }, (err, res) => {
        if (err) {
            logger.error('Error with MedicationStatement.update: ', err);
            return reject(err);
        }
        // If we support versioning, which we do not at the moment,
        // we need to return a version
        return resolve({ id: res.value && res.value.id });
    });
});

/**
 * @name remove
 * @description Delete a medicationstatement
 * @param {Object} args - Any provided args
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
module.exports.remove = (args, logger) => new Promise((resolve, reject) => {
    logger.info('MedicationStatement >>> remove');
    let { id } = args;
    // Grab an instance of our DB and collection
    let db = globals.get(CLIENT_DB);
    let collection = db.collection(COLLECTION.MEDICATIONSTATEMENT);
    // Delete our medicationstatement record
    collection.remove({ id: id }, (err, _) => {
        if (err) {
            logger.error('Error with MedicationStatement.remove');
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
