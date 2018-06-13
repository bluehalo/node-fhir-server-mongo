const { COLLECTION, CLIENT_DB } = require('../../constants');
const globals = require('../../globals');

/**
 * @name getCount
 * @description Get the number of medications in our database
 * @param {Object} args - Any provided args
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
module.exports.getCount = (args, logger) => new Promise((resolve, reject) => {
    logger.info('Medication >>> getCount');
    // Grab an instance of our DB and collection
    let db = globals.get(CLIENT_DB);
    let collection = db.collection(COLLECTION.MEDICATION);
    // Query all documents in this collection
    collection.count((err, count) => {
        if (err) {
            logger.error('Error with Medication.getCount: ', err);
            return reject(err);
        }
        return resolve(count);
    });
});

/**
 * @name getMedication
 * @description Get medication(s) from our database
 * @param {Object} args - Any provided args
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
module.exports.getMedication = (args, logger) => new Promise((resolve, reject) => {
    logger.info('Medication >>> getMedication');
    reject(new Error('Support coming soon'));
});

/**
 * @name getMedicationById
 * @description Get a medication from our database
 * @param {Object} args - Any provided args
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
module.exports.getMedicationById = (args, logger) => new Promise((resolve, reject) => {
    logger.info('Medication >>> getMedicationById');
    // Parse the required params, these are validated by sanitizeMiddleware in core
    let { id } = args;
    // Grab an instance of our DB and collection
    let db = globals.get(CLIENT_DB);
    let collection = db.collection(COLLECTION.MEDICATION);
    // Query our collection for this medication
    collection.findOne({ id: id.toString() }, (err, medication) => {
        if (err) {
            logger.error('Error with Medication.getMedicationById: ', err);
            return reject(err);
        }
        resolve(medication);
    });
});

/**
 * @name createMedication
 * @description Create a medication
 * @param {Object} args - Any provided args
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
module.exports.createMedication = (args, logger) => new Promise((resolve, reject) => {
    logger.info('Medication >>> createMedication');
    let { id, resource } = args;
    // Grab an instance of our DB and collection
    let db = globals.get(CLIENT_DB);
    let collection = db.collection(COLLECTION.MEDICATION);
    // If there is an id, use it, otherwise let mongo generate it
    let doc = Object.assign(resource.toJSON(), { _id: id });
    // Insert our medication record
    collection.insert(doc, (err, res) => {
        if (err) {
            logger.error('Error with Medication.createMedication: ', err);
            return reject(err);
        }
        // Grab the medication record so we can pass back the id
        let [ medication ] = res.ops;

        return resolve({ id: medication.id });
    });
});

/**
 * @name updateMedication
 * @description Update a medication
 * @param {Object} args - Any provided args
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
module.exports.updateMedication = (args, logger) => new Promise((resolve, reject) => {
    logger.info('Medication >>> updateMedication');
    let { id, resource } = args;
    // Grab an instance of our DB and collection
    let db = globals.get(CLIENT_DB);
    let collection = db.collection(COLLECTION.MEDICATION);
    // Set the id of the resource
    let doc = Object.assign(resource.toJSON(), { _id: id });
    // Insert/update our medication record
    collection.findOneAndUpdate({ id: id }, doc, { upsert: true }, (err, res) => {
        if (err) {
            logger.error('Error with Medication.updateMedication: ', err);
            return reject(err);
        }
        // If we support versioning, which we do not at the moment,
        // we need to return a version
        return resolve({ id: res.value && res.value.id });
    });
});

/**
 * @name deleteMedication
 * @description Delete a medication
 * @param {Object} args - Any provided args
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
module.exports.deleteMedication = (args, logger) => new Promise((resolve, reject) => {
    logger.info('Medication >>> deleteMedication');
    let { id } = args;
    // Grab an instance of our DB and collection
    let db = globals.get(CLIENT_DB);
    let collection = db.collection(COLLECTION.MEDICATION);
    // Delete our medication record
    collection.remove({ id: id }, (err, _) => {
        if (err) {
            logger.error('Error with Medication.deleteMedication');
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
