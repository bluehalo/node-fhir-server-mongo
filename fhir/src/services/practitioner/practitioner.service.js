const { COLLECTION, CLIENT_DB } = require('../../constants');
const globals = require('../../globals');

/**
 * @name getCount
 * @description Get the number of practitioners in our database
 * @param {Object} args - Any provided args
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
module.exports.getCount = (args, logger) => new Promise((resolve, reject) => {
    logger.info('Practitioner >>> getCount');
    // Grab an instance of our DB and collection
    let db = globals.get(CLIENT_DB);
    let collection = db.collection(COLLECTION.PRACTITIONER);
    // Query all documents in this collection
    collection.count((err, count) => {
        if (err) {
            logger.error('Error with Practitioner.getCount: ', err);
            return reject(err);
        }
        return resolve(count);
    });
});

/**
 * @name getPractitioner
 * @description Get practitioner(s) from our database
 * @param {Object} args - Any provided args
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
module.exports.getPractitioner = (args, logger) => new Promise((resolve, reject) => {
    logger.info('Practitioner >>> getPractitioner');
    reject(new Error('Support coming soon'));
});

/**
 * @name getPractitionerById
 * @description Get a practitioner from our database
 * @param {Object} args - Any provided args
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
module.exports.getPractitionerById = (args, logger) => new Promise((resolve, reject) => {
    logger.info('Practitioner >>> getPractitionerById');
    // Parse the required params, these are validated by sanitizeMiddleware in core
    let { id } = args;
    // Grab an instance of our DB and collection
    let db = globals.get(CLIENT_DB);
    let collection = db.collection(COLLECTION.PRACTITIONER);
    // Query our collection for this practitioner
    collection.findOne({ id: id.toString() }, (err, practitioner) => {
        if (err) {
            logger.error('Error with Practitioner.getPractitionerById: ', err);
            return reject(err);
        }
        resolve(practitioner);
    });
});

/**
 * @name createPractitioner
 * @description Create a practitioner
 * @param {Object} args - Any provided args
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
module.exports.createPractitioner = (args, logger) => new Promise((resolve, reject) => {
    logger.info('Practitioner >>> createPractitioner');
    let { id, resource } = args;
    // Grab an instance of our DB and collection
    let db = globals.get(CLIENT_DB);
    let collection = db.collection(COLLECTION.PRACTITIONER);
    // If there is an id, use it, otherwise let mongo generate it
    let doc = Object.assign(resource.toJSON(), { _id: id });
    // Insert our practitioner record
    collection.insert(doc, (err, res) => {
        if (err) {
            logger.error('Error with Practitioner.createPractitioner: ', err);
            return reject(err);
        }
        // Grab the practitioner record so we can pass back the id
        let [ practitioner ] = res.ops;

        return resolve({ id: practitioner.id });
    });
});

/**
 * @name updatePractitioner
 * @description Update a practitioner
 * @param {Object} args - Any provided args
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
module.exports.updatePractitioner = (args, logger) => new Promise((resolve, reject) => {
    logger.info('Practitioner >>> updatePractitioner');
    let { id, resource } = args;
    // Grab an instance of our DB and collection
    let db = globals.get(CLIENT_DB);
    let collection = db.collection(COLLECTION.PRACTITIONER);
    // Set the id of the resource
    let doc = Object.assign(resource.toJSON(), { _id: id });
    // Insert/update our practitioner record
    collection.findOneAndUpdate({ id: id }, doc, { upsert: true }, (err, res) => {
        if (err) {
            logger.error('Error with Practitioner.updatePractitioner: ', err);
            return reject(err);
        }
        // If we support versioning, which we do not at the moment,
        // we need to return a version
        return resolve({ id: res.value && res.value.id });
    });
});

/**
 * @name deletePractitioner
 * @description Delete a practitioner
 * @param {Object} args - Any provided args
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
module.exports.deletePractitioner = (args, logger) => new Promise((resolve, reject) => {
    logger.info('Practitioner >>> deletePractitioner');
    let { id } = args;
    // Grab an instance of our DB and collection
    let db = globals.get(CLIENT_DB);
    let collection = db.collection(COLLECTION.PRACTITIONER);
    // Delete our practitioner record
    collection.remove({ id: id }, (err, _) => {
        if (err) {
            logger.error('Error with Practitioner.deletePractitioner');
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
