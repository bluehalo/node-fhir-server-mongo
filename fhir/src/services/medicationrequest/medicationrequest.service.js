const { COLLECTION, CLIENT_DB } = require('../../constants');
const globals = require('../../globals');

/**
 * @name getCount
 * @description Get the number of medicationrequests in our database
 * @param {Object} args - Any provided args
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
module.exports.getCount = (args, logger) => new Promise((resolve, reject) => {
    logger.info('Medicationrequest >>> getCount');
    // Grab an instance of our DB and collection
    let db = globals.get(CLIENT_DB);
    let collection = db.collection(COLLECTION.MEDICATIONREQUEST);
    // Query all documents in this collection
    collection.count((err, count) => {
        if (err) {
            logger.error('Error with Medicationrequest.getCount: ', err);
            return reject(err);
        }
        return resolve(count);
    });
});

/**
 * @name getMedicationrequest
 * @description Get getMedicationrequest(s) from our database
 * @param {Object} args - Any provided args
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
module.exports.getMedicationrequest = (args, logger) => new Promise((resolve, reject) => {
    logger.info('Medicationrequest >>> getMedicationrequest');
    reject(new Error('Support coming soon'));
});

/**
 * @name getMedicationrequestById
 * @description Get a medicationrequest by their unique identifier
 * @param {Object} args - Any provided args
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
module.exports.getMedicationrequestById = (args, logger) => new Promise((resolve, reject) => {
    logger.info('Medicationrequest >>> getMedicationrequestById');
    // Parse the required params, these are validated by sanitizeMiddleware in core
    let { id } = args;
    // Grab an instance of our DB and collection
    let db = globals.get(CLIENT_DB);
    let collection = db.collection(COLLECTION.MEDICATIONREQUEST);
    // Query our collection for this observation
    collection.findOne({ id: id.toString() }, (err, medicationrequest) => {
        if (err) {
            logger.error('Error with Medicationrequest.getMedicationrequestById: ', err);
            return reject(err);
        }
        resolve(medicationrequest);
    });
});

/**
 * @name createMedicationrequest
 * @description Create a medicationrequest
 * @param {Object} args - Any provided args
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
module.exports.createMedicationrequest = (args, logger) => new Promise((resolve, reject) => {
    logger.info('Medicationrequest >>> createMedicationrequest');
    let { id, resource } = args;
    // Grab an instance of our DB and collection
    let db = globals.get(CLIENT_DB);
    let collection = db.collection(COLLECTION.MEDICATIONREQUEST);
    // If there is an id, use it, otherwise let mongo generate it
    let doc = Object.assign(resource.toJSON(), { _id: id });
    // Insert our medicationrequest record
    collection.insert(doc, (err, res) => {
        if (err) {
            logger.error('Error with Medicationrequest.createMedicationrequest: ', err);
            return reject(err);
        }
        // Grab the medicationrequest record so we can pass back the id
        let [ medicationrequest ] = res.ops;

        return resolve({ id: medicationrequest.id });
    });
});

/**
 * @name updateMedicationrequest
 * @description Update a medicationrequest
 * @param {Object} args - Any provided args
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
module.exports.updateMedicationrequest = (args, logger) => new Promise((resolve, reject) => {
    logger.info('Medicationrequest >>> updateMedicationrequest');
    let { id, resource } = args;
    // Grab an instance of our DB and collection
    let db = globals.get(CLIENT_DB);
    let collection = db.collection(COLLECTION.MEDICATIONREQUEST);
    // Set the id of the resource
    let doc = Object.assign(resource.toJSON(), { _id: id });
    // Insert/update our medicationrequest record
    collection.findOneAndUpdate({ id: id }, doc, { upsert: true }, (err, res) => {
        if (err) {
            logger.error('Error with Medicationrequest.updateMedicationrequest: ', err);
            return reject(err);
        }
        // If we support versioning, which we do not at the moment,
        // we need to return a version
        return resolve({ id: res.value && res.value.id });
    });
});

/**
 * @name deleteMedicationrequest
 * @description Delete a medicationrequest
 * @param {Object} args - Any provided args
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
module.exports.deleteMedicationrequest = (args, logger) => new Promise((resolve, reject) => {
    logger.info('Medicationrequest >>> deleteMedicationrequest');
    let { id } = args;
    // Grab an instance of our DB and collection
    let db = globals.get(CLIENT_DB);
    let collection = db.collection(COLLECTION.MEDICATIONREQUEST);
    // Delete our medicationrequest record
    collection.remove({ id: id }, (err, _) => {
        if (err) {
            logger.error('Error with Medicationrequest.deleteMedicationrequest');
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
