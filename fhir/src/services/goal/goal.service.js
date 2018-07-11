const { COLLECTION, CLIENT_DB } = require('../../constants');
const globals = require('../../globals');
const { tokenQueryBuilder, referenceQueryBuilder } = require('../../utils/service.utils');

/**
 * @name count
 * @description Get the number of goals in our database
 * @param {Object} args - Any provided args
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
module.exports.count = (args, logger) => new Promise((resolve, reject) => {
    logger.info('Goal >>> count');
    // Grab an instance of our DB and collection
    let db = globals.get(CLIENT_DB);
    let collection = db.collection(COLLECTION.GOAL);
    // Query all documents in this collection
    collection.count((err, count) => {
        if (err) {
            logger.error('Error with Goal.count: ', err);
            return reject(err);
        }
        return resolve(count);
    });
});

/**
 * @name search
 * @description Get goal(s) from our database
 * @param {Object} args - Any provided args
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
module.exports.search = (args, logger) => new Promise((resolve, reject) => {
    logger.info('Goal >>> search');
    // Parse the params
    let { category, identifier, patient, startDate, status, subject, targetDate } = args;
    // Status is required and guaranteed to be provided
    let query = {
        status: status
    };

    if (category) {
        let queryBuilder = tokenQueryBuilder(category, 'code', 'category.coding');
        for (let i in queryBuilder) {
            query[i] = queryBuilder[i];
        }
    }

    if (identifier) {
        let queryBuilder = tokenQueryBuilder(identifier, 'value', 'identifier');
        for (let i in queryBuilder) {
            query[i] = queryBuilder[i];
        }
    }

    if (patient) {
        let queryBuilder = referenceQueryBuilder(patient, 'subject.reference');
        for (let i in queryBuilder) {
            query[i] = queryBuilder[i];
        }
    }

    if (startDate) {
        query.startDate = startDate;
    }

    if (subject) {
        let queryBuilder = referenceQueryBuilder(subject, 'subject.reference');
        for (let i in queryBuilder) {
            query[i] = queryBuilder[i];
        }
    }

    if (targetDate) {
        query['target.dueDate'] = targetDate;
    }

    // console.log(JSON.stringify(query));

    // Grab an instance of our DB and collection
    let db = globals.get(CLIENT_DB);
    let collection = db.collection(COLLECTION.GOAL);
    // Query our collection for this observation
    collection.find(query, (err, goal) => {
        if (err) {
            logger.error('Error with Goal.search: ', err);
            return reject(err);
        }
        // Goal is a goal cursor, pull documents out before resolving
        goal.toArray().then(resolve, reject);
    });
});

/**
 * @name searchById
 * @description Get a goal from our database
 * @param {Object} args - Any provided args
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
module.exports.searchById = (args, logger) => new Promise((resolve, reject) => {
    logger.info('Goal >>> searchById');
    // Parse the required params, these are validated by sanitizeMiddleware in core
    let { id } = args;
    // Grab an instance of our DB and collection
    let db = globals.get(CLIENT_DB);
    let collection = db.collection(COLLECTION.GOAL);
    // Query our collection for this goal
    collection.findOne({ id: id.toString() }, (err, goal) => {
        if (err) {
            logger.error('Error with Goal.searchById: ', err);
            return reject(err);
        }
        resolve(goal);
    });
});

/**
 * @name create
 * @description Create a goal
 * @param {Object} args - Any provided args
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
module.exports.create = (args, logger) => new Promise((resolve, reject) => {
    logger.info('Goal >>> create');
    let { id, resource } = args;
    // Grab an instance of our DB and collection
    let db = globals.get(CLIENT_DB);
    let collection = db.collection(COLLECTION.GOAL);
    // If there is an id, use it, otherwise let mongo generate it
    let doc = Object.assign(resource.toJSON(), { _id: id });
    // Insert our goal record
    collection.insert(doc, (err, res) => {
        if (err) {
            logger.error('Error with Goal.create: ', err);
            return reject(err);
        }
        // Grab the goal record so we can pass back the id
        let [ goal ] = res.ops;

        return resolve({ id: goal.id });
    });
});

/**
 * @name update
 * @description Update a goal
 * @param {Object} args - Any provided args
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
module.exports.update = (args, logger) => new Promise((resolve, reject) => {
    logger.info('Goal >>> update');
    let { id, resource } = args;
    // Grab an instance of our DB and collection
    let db = globals.get(CLIENT_DB);
    let collection = db.collection(COLLECTION.GOAL);
    // Set the id of the resource
    let doc = Object.assign(resource.toJSON(), { _id: id });
    // Insert/update our goal record
    collection.findOneAndUpdate({ id: id }, { $set: doc}, { upsert: true }, (err, res) => {
        if (err) {
            logger.error('Error with Goal.update: ', err);
            return reject(err);
        }
        // If we support versioning, which we do not at the moment,
        // we need to return a version
        return resolve({ id: res.value && res.value.id });
    });
});

/**
 * @name remove
 * @description Delete a goal
 * @param {Object} args - Any provided args
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
module.exports.remove = (args, logger) => new Promise((resolve, reject) => {
    logger.info('Goal >>> remove');
    let { id } = args;
    // Grab an instance of our DB and collection
    let db = globals.get(CLIENT_DB);
    let collection = db.collection(COLLECTION.GOAL);
    // Delete our goal record
    collection.remove({ id: id }, (err, _) => {
        if (err) {
            logger.error('Error with Goal.remove');
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
