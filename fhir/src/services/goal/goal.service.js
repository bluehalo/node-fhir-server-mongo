const { COLLECTION, CLIENT_DB } = require('../../constants');
const globals = require('../../globals');

/**
 * @name getCount
 * @description Get the number of goals in our database
 * @param {Object} args - Any provided args
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
module.exports.getCount = (args, logger) => new Promise((resolve, reject) => {
    logger.info('Goal >>> getCount');
    // Grab an instance of our DB and collection
    let db = globals.get(CLIENT_DB);
    let collection = db.collection(COLLECTION.GOAL);
    // Query all documents in this collection
    collection.count((err, count) => {
        if (err) {
            logger.error('Error with Goal.getCount: ', err);
            return reject(err);
        }
        return resolve(count);
    });
});

/**
 * @name getGoal
 * @description Get goal(s) from our database
 * @param {Object} args - Any provided args
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
module.exports.getGoal = (args, logger) => new Promise((resolve, reject) => {
    logger.info('Goal >>> getGoal');
    reject(new Error('Support coming soon'));
});

/**
 * @name getGoalById
 * @description Get a goal from our database
 * @param {Object} args - Any provided args
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
module.exports.getGoalById = (args, logger) => new Promise((resolve, reject) => {
    logger.info('Goal >>> getGoalById');
    // Parse the required params, these are validated by sanitizeMiddleware in core
    let { id } = args;
    // Grab an instance of our DB and collection
    let db = globals.get(CLIENT_DB);
    let collection = db.collection(COLLECTION.GOAL);
    // Query our collection for this goal
    collection.findOne({ id: id.toString() }, (err, goal) => {
        if (err) {
            logger.error('Error with Goal.getGoalById: ', err);
            return reject(err);
        }
        resolve(goal);
    });
});

/**
 * @name createGoal
 * @description Create a goal
 * @param {Object} args - Any provided args
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
module.exports.createGoal = (args, logger) => new Promise((resolve, reject) => {
    logger.info('Goal >>> createGoal');
    let { id, resource } = args;
    // Grab an instance of our DB and collection
    let db = globals.get(CLIENT_DB);
    let collection = db.collection(COLLECTION.GOAL);
    // If there is an id, use it, otherwise let mongo generate it
    let doc = Object.assign(resource.toJSON(), { _id: id });
    // Insert our goal record
    collection.insert(doc, (err, res) => {
        if (err) {
            logger.error('Error with Goal.createGoal: ', err);
            return reject(err);
        }
        // Grab the goal record so we can pass back the id
        let [ goal ] = res.ops;

        return resolve({ id: goal.id });
    });
});

/**
 * @name updateGoal
 * @description Update a goal
 * @param {Object} args - Any provided args
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
module.exports.updateGoal = (args, logger) => new Promise((resolve, reject) => {
    logger.info('Goal >>> updateGoal');
    let { id, resource } = args;
    // Grab an instance of our DB and collection
    let db = globals.get(CLIENT_DB);
    let collection = db.collection(COLLECTION.GOAL);
    // Set the id of the resource
    let doc = Object.assign(resource.toJSON(), { _id: id });
    // Insert/update our goal record
    collection.findOneAndUpdate({ id: id }, doc, { upsert: true }, (err, res) => {
        if (err) {
            logger.error('Error with Goal.updateGoal: ', err);
            return reject(err);
        }
        // If we support versioning, which we do not at the moment,
        // we need to return a version
        return resolve({ id: res.value && res.value.id });
    });
});

/**
 * @name deleteGoal
 * @description Delete a goal
 * @param {Object} args - Any provided args
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
module.exports.deleteGoal = (args, logger) => new Promise((resolve, reject) => {
    logger.info('Goal >>> deleteGoal');
    let { id } = args;
    // Grab an instance of our DB and collection
    let db = globals.get(CLIENT_DB);
    let collection = db.collection(COLLECTION.GOAL);
    // Delete our goal record
    collection.remove({ id: id }, (err, _) => {
        if (err) {
            logger.error('Error with Goal.deleteGoal');
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
