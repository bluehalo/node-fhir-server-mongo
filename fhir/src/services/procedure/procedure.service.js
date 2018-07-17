const { COLLECTION, CLIENT_DB } = require('../../constants');
const globals = require('../../globals');
const { tokenQueryBuilder, referenceQueryBuilder, dateQueryBuilder } = require('../../utils/service.utils');

/**
 * @name count
 * @description Get the number of procedures in our database
 * @param {Object} args - Any provided args
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
module.exports.count = (args, logger) => new Promise((resolve, reject) => {
    logger.info('Procedure >>> count');
    // Grab an instance of our DB and collection
    let db = globals.get(CLIENT_DB);
    let collection = db.collection(COLLECTION.PROCEDURE);
    // Query all documents in this collection
    collection.count((err, count) => {
        if (err) {
            logger.error('Error with Procedure.count: ', err);
            return reject(err);
        }
        return resolve(count);
    });
});

/**
 * @name search
 * @description Get procedure(s) from our database
 * @param {Object} args - Any provided args
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
module.exports.search = (args, logger) => new Promise((resolve, reject) => {
    logger.info('Procedure >>> search');
    let { _id, patient, basedOn, category, status, code, context, date, definition, encounter,
        identifier, location, partOf, performer, subject } = args;
    let query = {};
    let ors = [];
    if (_id) {
        query.id = _id;
    }
    if (basedOn) {
        let queryBuilder = referenceQueryBuilder(basedOn, 'basedOn.reference');
        for (let i in queryBuilder) {
            query[i] = queryBuilder[i];
        }
    }
    if (category) {
        let queryBuilder = tokenQueryBuilder(category, 'code', 'category.coding', '');
        for (let i in queryBuilder) {
            query[i] = queryBuilder[i];
        }
    }
    if (code) {
        let queryBuilder = tokenQueryBuilder(code, 'code', 'code.coding', '');
        for (let i in queryBuilder) {
            query[i] = queryBuilder[i];
        }
    }
    if (status) {
        query.status = status;
    }
    if (context) {
        let queryBuilder = referenceQueryBuilder(context, 'context.reference');
        for (let i in queryBuilder) {
            query[i] = queryBuilder[i];
        }
    }
    if (date) {
        ors.push({$or: [{performedDateTime: dateQueryBuilder(date, 'dateTime')},
                {$and: [{'performedPeriod.start': {$lte: dateQueryBuilder(date, 'period')}},
                        {'performedPeriod.end': {$gte: dateQueryBuilder(date, 'period')}}]}]});
    }
    if (ors.length !== 0) {
        query.$and = ors;
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
    if (identifier) {
        let queryBuilder = tokenQueryBuilder(identifier, 'value', 'identifier', '');
        for (let i in queryBuilder) {
            query[i] = queryBuilder[i];
        }
    }
    if (location) {
        let queryBuilder = referenceQueryBuilder(location, 'location.reference');
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
        let queryBuilder = referenceQueryBuilder(performer, 'performer.actor.reference');
        for (let i in queryBuilder) {
            query[i] = queryBuilder[i];
        }
    }
    if (subject) {
        let queryBuilder = referenceQueryBuilder(subject, 'subject.reference');
        for (let i in queryBuilder) {
            query[i] = queryBuilder[i];
        }
    }

    // Grab an instance of our DB and collection
    let db = globals.get(CLIENT_DB);
    let collection = db.collection(COLLECTION.PROCEDURE);

    collection.find(query, (err, procedures) => {
        if (err) {
            logger.error('Error with Procedure.search: ', err);
            return reject(err);
        }
        // Procedures is a cursor, grab the documents from that
        procedures.toArray().then(resolve, reject);
    });
});

/**
 * @name searchById
 * @description Get a procedure from our database
 * @param {Object} args - Any provided args
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
module.exports.searchById = (args, logger) => new Promise((resolve, reject) => {
    logger.info('Procedure >>> searchById');
    // Parse the required params, these are validated by sanitizeMiddleware in core
    let { id } = args;
    // Grab an instance of our DB and collection
    let db = globals.get(CLIENT_DB);
    let collection = db.collection(COLLECTION.PROCEDURE);
    // Query our collection for this procedure
    collection.findOne({ id: id.toString() }, (err, procedure) => {
        if (err) {
            logger.error('Error with Procedure.searchById: ', err);
            return reject(err);
        }
        resolve(procedure);
    });
});

/**
 * @name create
 * @description Create a procedure
 * @param {Object} args - Any provided args
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
module.exports.create = (args, logger) => new Promise((resolve, reject) => {
    logger.info('Procedure >>> create');
    let { id, resource } = args;
    // Grab an instance of our DB and collection
    let db = globals.get(CLIENT_DB);
    let collection = db.collection(COLLECTION.PROCEDURE);
    // If there is an id, use it, otherwise let mongo generate it
    let doc = Object.assign(resource.toJSON(), { _id: id });
    // Insert our procedure record
    collection.insert(doc, (err, res) => {
        if (err) {
            logger.error('Error with Procedure.create: ', err);
            return reject(err);
        }
        // Grab the procedure record so we can pass back the id
        let [ procedure ] = res.ops;

        return resolve({ id: procedure.id });
    });
});

/**
 * @name update
 * @description Update a procedure
 * @param {Object} args - Any provided args
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
module.exports.update = (args, logger) => new Promise((resolve, reject) => {
    logger.info('Procedure >>> update');
    let { id, resource } = args;
    // Grab an instance of our DB and collection
    let db = globals.get(CLIENT_DB);
    let collection = db.collection(COLLECTION.PROCEDURE);
    // Set the id of the resource
    let doc = Object.assign(resource.toJSON(), { _id: id });
    // Insert/update our procedure record
    collection.findOneAndUpdate({ id: id }, { $set: doc}, { upsert: true }, (err, res) => {
        if (err) {
            logger.error('Error with Procedure.update: ', err);
            return reject(err);
        }
        // If we support versioning, which we do not at the moment,
        // we need to return a version
        return resolve({ id: res.value && res.value.id });
    });
});

/**
 * @name remove
 * @description Delete a procedure
 * @param {Object} args - Any provided args
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
module.exports.remove = (args, logger) => new Promise((resolve, reject) => {
    logger.info('Procedure >>> remove');
    let { id } = args;
    // Grab an instance of our DB and collection
    let db = globals.get(CLIENT_DB);
    let collection = db.collection(COLLECTION.PROCEDURE);
    // Delete our procedure record
    collection.remove({ id: id }, (err, _) => {
        if (err) {
            logger.error('Error with Procedure.remove');
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
