const { COLLECTION, CLIENT_DB } = require('../../constants');
const globals = require('../../globals');

/**
 * @name getCount
 * @description Get the number of condition in our database
 * @param {Object} args - Any provided args
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
module.exports.getCount = (args, logger) => new Promise((resolve, reject) => {
    logger.info('Condition >>> getCount');
    // Grab an instance of our DB and collection
    let db = globals.get(CLIENT_DB);
    let collection = db.collection(COLLECTION.CONDITION);
    // Query all documents in this collection
    collection.count((err, count) => {
        if (err) {
            logger.error('Error with Condition.getCount: ', err);
            return reject(err);
        }
        return resolve(count);
    });
});

/**
 * @name getCondition
 * @description Get condition(s) from our database
 * @param {Object} args - Any provided args
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
module.exports.getCondition = (args, logger) => new Promise((resolve, reject) => {
    logger.info('Condition >>> getCondition');
    reject(new Error('Support coming soon'));
});

/**
 * @name getConditionById
 * @description Get a condition from our database
 * @param {Object} args - Any provided args
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
module.exports.getConditionById = (args, logger) => new Promise((resolve, reject) => {
    logger.info('Condition >>> getConditionById');
    // Parse the required params, these are validated by sanitizeMiddleware in core
    let { id } = args;
    // Grab an instance of our DB and collection
    let db = globals.get(CLIENT_DB);
    let collection = db.collection(COLLECTION.CONDITION);
    // Query our collection for this condition
    collection.findOne({ id: id.toString() }, (err, condition) => {
        if (err) {
            logger.error('Error with Condition.getConditionById: ', err);
            return reject(err);
        }
        resolve(condition);
    });
});

/**
 * @name createCondition
 * @description Create a condition
 * @param {Object} args - Any provided args
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
module.exports.createCondition = (args, logger) => new Promise((resolve, reject) => {
    logger.info('Condition >>> createCondition');
    let { id, resource } = args;
    // Grab an instance of our DB and collection
    let db = globals.get(CLIENT_DB);
    let collection = db.collection(COLLECTION.CONDITION);
    // If there is an id, use it, otherwise let mongo generate it
    let doc = Object.assign(resource.toJSON(), { _id: id });
    // Insert our condition record
    collection.insert(doc, (err, res) => {
        if (err) {
            logger.error('Error with Condition.createCondition: ', err);
            return reject(err);
        }
        // Grab the condition record so we can pass back the id
        let [ condition ] = res.ops;

        return resolve({ id: condition.id });
    });
});

/**
 * @name updateCondition
 * @description Update a condition
 * @param {Object} args - Any provided args
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
module.exports.updateCondition = (args, logger) => new Promise((resolve, reject) => {
    logger.info('Condition >>> updateCondition');
    let { id, resource } = args;
    // Grab an instance of our DB and collection
    let db = globals.get(CLIENT_DB);
    let collection = db.collection(COLLECTION.CONDITION);
    // Set the id of the resource
    let doc = Object.assign(resource.toJSON(), { _id: id });
    // Insert/update our condition record
    collection.findOneAndUpdate({ id: id }, doc, { upsert: true }, (err, res) => {
        if (err) {
            logger.error('Error with Condition.updateCondition: ', err);
            return reject(err);
        }
        // If we support versioning, which we do not at the moment,
        // we need to return a version
        return resolve({ id: res.value && res.value.id });
    });
});

/**
 * @name deleteCondition
 * @description Delete a condition
 * @param {Object} args - Any provided args
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
module.exports.deleteCondition = (args, logger) => new Promise((resolve, reject) => {
    logger.info('Condition >>> deleteCondition');
    let { id } = args;
    // Grab an instance of our DB and collection
    let db = globals.get(CLIENT_DB);
    let collection = db.collection(COLLECTION.CONDITION);
    // Delete our condition record
    collection.remove({ id: id }, (err, _) => {
        if (err) {
            logger.error('Error with Condition.deleteCondition');
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
