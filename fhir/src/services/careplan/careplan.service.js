const { COLLECTION, CLIENT_DB } = require('../../constants');
const globals = require('../../globals');
const { tokenQueryBuilder, referenceQueryBuilder } = require('../../utils/service.utils');

/**
 * @name count
 * @description Get the number of careplans in our database
 * @param {Object} args - Any provided args
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
module.exports.count = (args, logger) => new Promise((resolve, reject) => {
    logger.info('CarePlan >>> count');
    // Grab an instance of our DB and collection
    let db = globals.get(CLIENT_DB);
    let collection = db.collection(COLLECTION.CAREPLAN);
    // Query all documents in this collection
    collection.count((err, count) => {
        if (err) {
            logger.error('Error with CarePlan.count: ', err);
            return reject(err);
        }
        return resolve(count);
    });
});

/**
 * @name search
 * @description Get careplan(s) from our database
 * @param {Object} args - Any provided args
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
// Not implemented: activityDate and date
module.exports.search = (args, logger) => new Promise((resolve, reject) => {
    logger.info('CarePlan >>> search');
    // Parse the params
    let { activityCode, activityDate, activityReference, basedOn, careTeam, category, condition, context, date, definition,
        encounter, goal, identifier, intent, partOf, patient, performer, replaces, status, subject } = args;

    // Status, intent, and subject are required and guaranteed to be provided
    let query = {
        'status': status,
        'intent': intent,
    };
    let subjectQueryBuilder = referenceQueryBuilder(subject, 'subject.reference');
    for (let i in subjectQueryBuilder) {
        query[i] = subjectQueryBuilder[i];
    }

    if (activityCode) {
        let queryBuilder = tokenQueryBuilder(activityCode, 'code', 'activity.detail.code.coding');
        for (let i in queryBuilder) {
            query[i] = queryBuilder[i];
        }
    }

    if (activityDate) {
        console.log('Not implemented');
    }

    if (activityReference) {
        let queryBuilder = referenceQueryBuilder(activityReference, 'activity.reference.reference');
        for (let i in queryBuilder) {
            query[i] = queryBuilder[i];
        }
    }

    if (basedOn) {
        let queryBuilder = referenceQueryBuilder(basedOn, 'basedOn.reference');
        for (let i in queryBuilder) {
            query[i] = queryBuilder[i];
        }
    }

    if (careTeam) {
        let queryBuilder = referenceQueryBuilder(careTeam, 'careTeam.reference');
        for (let i in queryBuilder) {
            query[i] = queryBuilder[i];
        }
    }

    if (category) {
        let queryBuilder = tokenQueryBuilder(category, 'code', 'category.coding');
        for (let i in queryBuilder) {
            query[i] = queryBuilder[i];
        }
    }

    if (condition) {
        let queryBuilder = referenceQueryBuilder(condition, 'addresses.reference');
        for (let i in queryBuilder) {
            query[i] = queryBuilder[i];
        }
    }

    if (context) {
        let queryBuilder = referenceQueryBuilder(context, 'context.reference');
        for (let i in queryBuilder) {
            query[i] = queryBuilder[i];
        }
    }

    if (date) {
        console.log('Not implemented');
    }

    if (definition) {
        let queryBuilder = referenceQueryBuilder(definition, 'definition.reference');
        for (let i in queryBuilder) {
            query[i] = queryBuilder[i];
        }
    }

    if (encounter) {
        let queryBuilder = referenceQueryBuilder(encounter, 'context.reference');
        for (let i in queryBuilder) {
            query[i] = queryBuilder[i];
        }
    }

    if (goal) {
        let queryBuilder = referenceQueryBuilder(goal, 'goal.reference');
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

    if (partOf) {
        let queryBuilder = referenceQueryBuilder(partOf, 'partOf.reference');
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

    if (performer) {
        let queryBuilder = referenceQueryBuilder(performer, 'activity.detail.performer.reference');
        for (let i in queryBuilder) {
            query[i] = queryBuilder[i];
        }
    }

    if (replaces) {
        let queryBuilder = referenceQueryBuilder(replaces, 'replaces.reference');
        for (let i in queryBuilder) {
            query[i] = queryBuilder[i];
        }
    }

    // console.log(JSON.stringify(query));

    // Grab an instance of our DB and collection
    let db = globals.get(CLIENT_DB);
    let collection = db.collection(COLLECTION.CAREPLAN);
    // Query our collection for this careplan
    collection.find(query, (err, careplans) => {
        if (err) {
            logger.error('Error with CarePlan.search: ', err);
            return reject(err);
        }
        // CarePlans is a cursor, grab the documents from that
        careplans.toArray().then(resolve, reject);
    });
});

/**
 * @name searchById
 * @description Get a careplan from our database
 * @param {Object} args - Any provided args
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
module.exports.searchById = (args, logger) => new Promise((resolve, reject) => {
    logger.info('CarePlan >>> searchById');
    // Parse the required params, these are validated by sanitizeMiddleware in core
    let { id } = args;
    // Grab an instance of our DB and collection
    let db = globals.get(CLIENT_DB);
    let collection = db.collection(COLLECTION.CAREPLAN);
    // Query our collection for this careplan
    collection.findOne({ id: id.toString() }, (err, careplan) => {
        if (err) {
            logger.error('Error with CarePlan.searchById: ', err);
            return reject(err);
        }
        resolve(careplan);
    });
});

/**
 * @name create
 * @description Create a careplan
 * @param {Object} args - Any provided args
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
module.exports.create = (args, logger) => new Promise((resolve, reject) => {
    logger.info('CarePlan >>> create');
    let { id, resource } = args;
    // Grab an instance of our DB and collection
    let db = globals.get(CLIENT_DB);
    let collection = db.collection(COLLECTION.CAREPLAN);
    // If there is an id, use it, otherwise let mongo generate it
    let doc = Object.assign(resource.toJSON(), { _id: id });
    // Insert our careplan record
    collection.insert(doc, (err, res) => {
        if (err) {
            logger.error('Error with CarePlan.create: ', err);
            return reject(err);
        }
        // Grab the careplan record so we can pass back the id
        let [ careplan ] = res.ops;

        return resolve({ id: careplan.id });
    });
});

/**
 * @name update
 * @description Update a careplan
 * @param {Object} args - Any provided args
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
module.exports.update = (args, logger) => new Promise((resolve, reject) => {
    logger.info('CarePlan >>> update');
    let { id, resource } = args;
    // Grab an instance of our DB and collection
    let db = globals.get(CLIENT_DB);
    let collection = db.collection(COLLECTION.CAREPLAN);
    // Set the id of the resource
    let doc = Object.assign(resource.toJSON(), { _id: id });
    // Insert/update our careplan record
    collection.findOneAndUpdate({ id: id }, { $set: doc}, { upsert: true }, (err, res) => {
        if (err) {
            logger.error('Error with CarePlan.update: ', err);
            return reject(err);
        }
        // If we support versioning, which we do not at the moment,
        // we need to return a version
        return resolve({ id: res.value && res.value.id });
    });
});

/**
 * @name remove
 * @description Delete a careplan
 * @param {Object} args - Any provided args
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
module.exports.remove = (args, logger) => new Promise((resolve, reject) => {
    logger.info('CarePlan >>> remove');
    let { id } = args;
    // Grab an instance of our DB and collection
    let db = globals.get(CLIENT_DB);
    let collection = db.collection(COLLECTION.CAREPLAN);
    // Delete our careplan record
    collection.remove({ id: id }, (err, _) => {
        if (err) {
            logger.error('Error with CarePlan.remove');
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
