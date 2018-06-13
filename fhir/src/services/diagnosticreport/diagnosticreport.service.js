const { COLLECTION, CLIENT_DB } = require('../../constants');
const globals = require('../../globals');

/**
 * @name getCount
 * @description Get the number of diagnosticreports in our database
 * @param {Object} args - Any provided args
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
module.exports.getCount = (args, logger) => new Promise((resolve, reject) => {
    logger.info('Diagnosticreport >>> getCount');
    // Grab an instance of our DB and collection
    let db = globals.get(CLIENT_DB);
    let collection = db.collection(COLLECTION.DIAGNOSTICREPORT);
    // Query all documents in this collection
    collection.count((err, count) => {
        if (err) {
            logger.error('Error with Diagnosticreport.getCount: ', err);
            return reject(err);
        }
        return resolve(count);
    });
});

/**
 * @name getDiagnosticreport
 * @description Get getDiagnosticreport(s) from our database
 * @param {Object} args - Any provided args
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
module.exports.getDiagnosticreport = (args, logger) => new Promise((resolve, reject) => {
    logger.info('Diagnosticreport >>> getDiagnosticreport');
    reject(new Error('Support coming soon'));
});

/**
 * @name getDiagnosticreportById
 * @description Get a diagnosticreport by their unique identifier
 * @param {Object} args - Any provided args
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
module.exports.getDiagnosticreportById = (args, logger) => new Promise((resolve, reject) => {
    logger.info('Diagnosticreport >>> getDiagnosticreportById');
    // Parse the required params, these are validated by sanitizeMiddleware in core
    let { id } = args;
    // Grab an instance of our DB and collection
    let db = globals.get(CLIENT_DB);
    let collection = db.collection(COLLECTION.DIAGNOSTICREPORT);
    // Query our collection for this observation
    collection.findOne({ id: id.toString() }, (err, diagnosticreport) => {
        if (err) {
            logger.error('Error with Diagnosticreport.getDiagnosticreportById: ', err);
            return reject(err);
        }
        resolve(diagnosticreport);
    });
});

/**
 * @name createDiagnosticreport
 * @description Create a diagnosticreport
 * @param {Object} args - Any provided args
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
module.exports.createDiagnosticreport = (args, logger) => new Promise((resolve, reject) => {
    logger.info('Diagnosticreport >>> createDiagnosticreport');
    let { id, resource } = args;
    // Grab an instance of our DB and collection
    let db = globals.get(CLIENT_DB);
    let collection = db.collection(COLLECTION.DIAGNOSTICREPORT);
    // If there is an id, use it, otherwise let mongo generate it
    let doc = Object.assign(resource.toJSON(), { _id: id });
    // Insert our diagnosticreport record
    collection.insert(doc, (err, res) => {
        if (err) {
            logger.error('Error with Diagnosticreport.createDiagnosticreport: ', err);
            return reject(err);
        }
        // Grab the diagnosticreport record so we can pass back the id
        let [ diagnosticreport ] = res.ops;

        return resolve({ id: diagnosticreport.id });
    });
});

/**
 * @name updateDiagnosticreport
 * @description Update a diagnosticreport
 * @param {Object} args - Any provided args
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
module.exports.updateDiagnosticreport = (args, logger) => new Promise((resolve, reject) => {
    logger.info('Diagnosticreport >>> updateDiagnosticreport');
    let { id, resource } = args;
    // Grab an instance of our DB and collection
    let db = globals.get(CLIENT_DB);
    let collection = db.collection(COLLECTION.DIAGNOSTICREPORT);
    // Set the id of the resource
    let doc = Object.assign(resource.toJSON(), { _id: id });
    // Insert/update our diagnosticreport record
    collection.findOneAndUpdate({ id: id }, doc, { upsert: true }, (err, res) => {
        if (err) {
            logger.error('Error with Diagnosticreport.updateDiagnosticreport: ', err);
            return reject(err);
        }
        // If we support versioning, which we do not at the moment,
        // we need to return a version
        return resolve({ id: res.value && res.value.id });
    });
});

/**
 * @name deleteDiagnosticreport
 * @description Delete a diagnosticreport
 * @param {Object} args - Any provided args
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
module.exports.deleteDiagnosticreport = (args, logger) => new Promise((resolve, reject) => {
    logger.info('Diagnosticreport >>> deleteDiagnosticreport');
    let { id } = args;
    // Grab an instance of our DB and collection
    let db = globals.get(CLIENT_DB);
    let collection = db.collection(COLLECTION.DIAGNOSTICREPORT);
    // Delete our diagnosticreport record
    collection.remove({ id: id }, (err, _) => {
        if (err) {
            logger.error('Error with Diagnosticreport.deleteDiagnosticreport');
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
