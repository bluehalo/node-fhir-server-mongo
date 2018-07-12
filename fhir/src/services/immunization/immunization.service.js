const { COLLECTION, CLIENT_DB } = require('../../constants');
const globals = require('../../globals');
const { stringQueryBuilder, tokenQueryBuilder, referenceQueryBuilder, numberQueryBuilder } = require('../../utils/service.utils');

/**
 * @name count
 * @description Get the number of immunizations in our database
 * @param {Object} args - Any provided args
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
module.exports.count = (args, logger) => new Promise((resolve, reject) => {
    logger.info('Immunization >>> count');
    // Grab an instance of our DB and collection
    let db = globals.get(CLIENT_DB);
    let collection = db.collection(COLLECTION.IMMUNIZATION);
    // Query all documents in this collection
    collection.count((err, count) => {
        if (err) {
            logger.error('Error with Immunization.count: ', err);
            return reject(err);
        }
        return resolve(count);
    });
});

/**
 * @name search
 * @description Get immunization(s) from our database
 * @param {Object} args - Any provided args
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
module.exports.search = (args, logger) => new Promise((resolve, reject) => {
    logger.info('Immunization >>> search');
    let { patient, date, doseSequence, identifier, location, lotNumber, manufacturer,
        notGiven, practitioner, reaction, reactionDate, reason, reasonNotGiven, status,
        vaccineCode } = args;
    let query = {};

    if (patient) {
        let queryBuilder = referenceQueryBuilder(patient, 'patient.reference');
        for (let i in queryBuilder) {
            query[i] = queryBuilder[i];
        }
    }
    if (date) {
        query.date = date;
    }
    if (doseSequence) {
        query['vaccinationProtocol.doseSequence'] = numberQueryBuilder(doseSequence);
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
    if (lotNumber) {
        query.lotNumber = stringQueryBuilder(lotNumber);
    }
    if (manufacturer) {
        let queryBuilder = referenceQueryBuilder(manufacturer, 'manufacturer.reference');
        for (let i in queryBuilder) {
            query[i] = queryBuilder[i];
        }
    }
    if (notGiven) {
        query.notGiven = (notGiven === 'true');
    }
    if (practitioner) {
        let queryBuilder = referenceQueryBuilder(practitioner, 'practitioner.actor.reference');
        for (let i in queryBuilder) {
            query[i] = queryBuilder[i];
        }
    }
    if (reaction) {
        let queryBuilder = referenceQueryBuilder(reaction, 'reaction.detail.reference');
        for (let i in queryBuilder) {
            query[i] = queryBuilder[i];
        }
    }
    if (reactionDate) {
        query['reaction.date'] = reactionDate;
    }
    if (reason) {
        let queryBuilder = tokenQueryBuilder(reason, 'code', 'explanation.reason.coding', '');
        for (let i in queryBuilder) {
            query[i] = queryBuilder[i];
        }
    }
    if (reasonNotGiven) {
        let queryBuilder = tokenQueryBuilder(reasonNotGiven, 'code', 'explanation.reasonNotGiven.coding', '');
        for (let i in queryBuilder) {
            query[i] = queryBuilder[i];
        }
    }
    if (status) {
        query.status = status;
    }
    if (vaccineCode) {
        let queryBuilder = tokenQueryBuilder(vaccineCode, 'code', 'vaccineCode.coding', '');
        for (let i in queryBuilder) {
            query[i] = queryBuilder[i];
        }
    }

    // console.log(JSON.stringify(query));

    // Grab an instance of our DB and collection
    let db = globals.get(CLIENT_DB);
    let collection = db.collection(COLLECTION.IMMUNIZATION);

    collection.find(query, (err, immunizations) => {
        if (err) {
            logger.error('Error with immunization.search: ', err);
            return reject(err);
        }
        // immunizations is a cursor, grab the documents from that
        immunizations.toArray().then(resolve, reject);
    });
});

/**
 * @name searchById
 * @description Get an immunization from our database
 * @param {Object} args - Any provided args
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
module.exports.searchById = (args, logger) => new Promise((resolve, reject) => {
    logger.info('Immunization >>> searchById');
    // Parse the required params, these are validated by sanitizeMiddleware in core
    let { id } = args;
    // Grab an instance of our DB and collection
    let db = globals.get(CLIENT_DB);
    let collection = db.collection(COLLECTION.IMMUNIZATION);
    // Query our collection for this immunization
    collection.findOne({ id: id.toString() }, (err, immunization) => {
        if (err) {
            logger.error('Error with Immunization.searchById: ', err);
            return reject(err);
        }
        resolve(immunization);
    });
});

/**
 * @name create
 * @description Create an immunization
 * @param {Object} args - Any provided args
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
module.exports.create = (args, logger) => new Promise((resolve, reject) => {
    logger.info('Immunization >>> create');
    let { id, resource } = args;
    // Grab an instance of our DB and collection
    let db = globals.get(CLIENT_DB);
    let collection = db.collection(COLLECTION.IMMUNIZATION);
    // If there is an id, use it, otherwise let mongo generate it
    let doc = Object.assign(resource.toJSON(), { _id: id });
    // Insert our immunization record
    collection.insert(doc, (err, res) => {
        if (err) {
            logger.error('Error with Immunization.create: ', err);
            return reject(err);
        }
        // Grab the immunization record so we can pass back the id
        let [ immunization ] = res.ops;

        return resolve({ id: immunization.id });
    });
});

/**
 * @name update
 * @description Update an immunization
 * @param {Object} args - Any provided args
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
module.exports.update = (args, logger) => new Promise((resolve, reject) => {
    logger.info('Immunization >>> update');
    let { id, resource } = args;
    // Grab an instance of our DB and collection
    let db = globals.get(CLIENT_DB);
    let collection = db.collection(COLLECTION.IMMUNIZATION);
    // Set the id of the resource
    let doc = Object.assign(resource.toJSON(), { _id: id });
    // Insert/update our immunization record
    collection.findOneAndUpdate({ id: id }, { $set: doc}, { upsert: true }, (err, res) => {
        if (err) {
            logger.error('Error with Immunization.update: ', err);
            return reject(err);
        }
        // If we support versioning, which we do not at the moment,
        // we need to return a version
        return resolve({ id: res.value && res.value.id });
    });
});

/**
 * @name remove
 * @description Delete an immunization
 * @param {Object} args - Any provided args
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
module.exports.remove = (args, logger) => new Promise((resolve, reject) => {
    logger.info('Immunization >>> remove');
    let { id } = args;
    // Grab an instance of our DB and collection
    let db = globals.get(CLIENT_DB);
    let collection = db.collection(COLLECTION.IMMUNIZATION);
    // Delete our immunization record
    collection.remove({ id: id }, (err, _) => {
        if (err) {
            logger.error('Error with Immunization.remove');
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
