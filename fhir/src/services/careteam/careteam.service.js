const { COLLECTION, CLIENT_DB } = require('../../constants');
const globals = require('../../globals');
const { tokenQueryBuilder, referenceQueryBuilder } = require('../../utils/service.utils');

/**
 * @name count
 * @description Get the number of careteams in our database
 * @param {Object} args - Any provided args
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
module.exports.count = (args, logger) => new Promise((resolve, reject) => {
    logger.info('CareTeam >>> count');
    // Grab an instance of our DB and collection
    let db = globals.get(CLIENT_DB);
    let collection = db.collection(COLLECTION.CARETEAM);
    // Query all documents in this collection
    collection.count((err, count) => {
        if (err) {
            logger.error('Error with CareTeam.count: ', err);
            return reject(err);
        }
        return resolve(count);
    });
});

/**
 * @name search
 * @description Get search(s) from our database
 * @param {Object} args - Any provided args
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
module.exports.search = (args, logger) => new Promise((resolve, reject) => {
    logger.info('CareTeam >>> search');
    // Parse the params
    let { category, context, date, encounter, identifier, participant, patient, status, subject } = args;
    // console.log(JSON.stringify(args));

    let query = {};

    if (category) {
        let queryBuilder = tokenQueryBuilder(category, 'code', 'category.coding');
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

    if (encounter) {
        let queryBuilder = referenceQueryBuilder(encounter, 'context.reference');
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

    if (participant) {
        let queryBuilder = referenceQueryBuilder(participant, 'participant.member.reference');
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

    if (status) {
        query.status = status;
    }

    if (subject) {
        let queryBuilder = referenceQueryBuilder(subject, 'subject.reference');
        for (let i in queryBuilder) {
            query[i] = queryBuilder[i];
        }
    }

    // console.log(JSON.stringify(query));

    // Grab an instance of our DB and collection
    let db = globals.get(CLIENT_DB);
    let collection = db.collection(COLLECTION.CARETEAM);
    // Query our collection for this careteam
    collection.find(query, (err, careteams) => {
        if (err) {
            logger.error('Error with Careteam.search: ', err);
            return reject(err);
        }
        // Careteams is a cursor, grab the documents from that
        careteams.toArray().then(resolve, reject);
    });
});

/**
 * @name searchById
 * @description Get a careteam by their unique identifier
 * @param {Object} args - Any provided args
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
module.exports.searchById = (args, logger) => new Promise((resolve, reject) => {
    logger.info('CareTeam >>> searchById');
    // Parse the required params, these are validated by sanitizeMiddleware in core
    let { id } = args;
    // Grab an instance of our DB and collection
    let db = globals.get(CLIENT_DB);
    let collection = db.collection(COLLECTION.CARETEAM);
    // Query our collection for this careteam
    collection.findOne({ id: id.toString() }, (err, careteam) => {
        if (err) {
            logger.error('Error with CareTeam.searchById: ', err);
            return reject(err);
        }
        resolve(careteam);
    });
});

/**
 * @name create
 * @description Create a careteam
 * @param {Object} args - Any provided args
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
module.exports.create = (args, logger) => new Promise((resolve, reject) => {
    logger.info('CareTeam >>> create');
    let { id, resource } = args;
    // Grab an instance of our DB and collection
    let db = globals.get(CLIENT_DB);
    let collection = db.collection(COLLECTION.CARETEAM);
    // If there is an id, use it, otherwise let mongo generate it
    let doc = Object.assign(resource.toJSON(), { _id: id });
    // Insert our careteam record
    collection.insert(doc, (err, res) => {
        if (err) {
            logger.error('Error with CareTeam.create: ', err);
            return reject(err);
        }
        // Grab the careteam record so we can pass back the id
        let [ careteam ] = res.ops;

        return resolve({ id: careteam.id });
    });
});

/**
 * @name update
 * @description Update a careteam
 * @param {Object} args - Any provided args
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
module.exports.update = (args, logger) => new Promise((resolve, reject) => {
    logger.info('CareTeam >>> update');
    let { id, resource } = args;
    // Grab an instance of our DB and collection
    let db = globals.get(CLIENT_DB);
    let collection = db.collection(COLLECTION.CARETEAM);
    // Set the id of the resource
    let doc = Object.assign(resource.toJSON(), { _id: id });
    // Insert/update our careteam record
    collection.findOneAndUpdate({ id: id }, { $set: doc}, { upsert: true }, (err, res) => {
        if (err) {
            logger.error('Error with CareTeam.update: ', err);
            return reject(err);
        }
        // If we support versioning, which we do not at the moment,
        // we need to return a version
        return resolve({ id: res.value && res.value.id });
    });
});

/**
 * @name remove
 * @description Delete a careteam
 * @param {Object} args - Any provided args
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
module.exports.remove = (args, logger) => new Promise((resolve, reject) => {
    logger.info('CareTeam >>> remove');
    let { id } = args;
    // Grab an instance of our DB and collection
    let db = globals.get(CLIENT_DB);
    let collection = db.collection(COLLECTION.CARETEAM);
    // Delete our careteam record
    collection.remove({ id: id }, (err, _) => {
        if (err) {
            logger.error('Error with CareTeam.remove');
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
