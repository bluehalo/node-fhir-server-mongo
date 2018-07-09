// const { validateDate } = require('../../utils/date.validator');
const { COLLECTION, CLIENT_DB } = require('../../constants');
const globals = require('../../globals');
const { tokenQueryBuilder, referenceQueryBuilder } = require('../../utils/service.utils');

/**
 * @name count
 * @description Get the number of allergyintolerances in our database
 * @param {Object} args - Any provided args
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
module.exports.count = (args, logger) => new Promise((resolve, reject) => {
    logger.info('AllergyIntolerance >>> count');
    // Grab an instance of our DB and collection
    let db = globals.get(CLIENT_DB);
    let collection = db.collection(COLLECTION.ALLERGYINTOLERANCE);
    // Query all documents in this collection
    collection.count((err, count) => {
        if (err) {
            logger.error('Error with AllergyIntolerance.count: ', err);
            return reject(err);
        }
        return resolve(count);
    });
});

/**
 * @name search
 * @description Get allergyintolerance(s) from our database
 * @param {Object} args - Any provided args
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
module.exports.search = (args, logger) => new Promise((resolve, reject) => {
    logger.info('AllergyIntolerance >>> search');
    // Parse the params
    let { category, clinicalStatus, code, criticality, date, identifier, lastDate, manifestation, onset, patient, recorder,
        route, severity, type, verificationStatus } = args;

    // Patient and verificationStatus are required and guaranteed to be provided
    let query = {
        verificationStatus: verificationStatus
    };
    let patientQueryBuilder = referenceQueryBuilder(patient, 'patient.reference');
    for (let i in patientQueryBuilder) {
        query[i] = patientQueryBuilder[i];
    }

    if (category) {
        query.category = category;
    }

    if (clinicalStatus) {
        query.clinicalStatus = clinicalStatus;
    }

    if (code) {
        let queryBuilder = tokenQueryBuilder(code, 'code', 'code.coding');
        for (let i in queryBuilder) {
            query[i] = queryBuilder[i];
        }
    }

    if (criticality) {
        query.criticality = criticality;
    }

    // Date validator changes the date so it no longer matches
    if (date) {
        // let parsedDates = validateDate(date);
        // if (parsedDates) {
        //     query.assertedDate = parsedDates;
        // }
        query.assertedDate = date;
    }

    if (identifier) {
        let queryBuilder = tokenQueryBuilder(identifier, 'value', 'identifier');
        for (let i in queryBuilder) {
            query[i] = queryBuilder[i];
        }
    }

    // Date validator changes the date so it no longer matches
    if (lastDate) {
        // let parsedDates = validateDate(date);
        // if (parsedDates) {
        //     query.assertedDate = parsedDates;
        // }
        query.lastOccurrence = lastDate;
    }

    if (manifestation) {
        let queryBuilder = tokenQueryBuilder(manifestation, 'code', 'reaction.manifestation.coding');
        for (let i in queryBuilder) {
            query[i] = queryBuilder[i];
        }
    }

    if (onset) {
        // let parsedDates = validateDate(date);
        // if (parsedDates) {
        //     query.assertedDate = parsedDates;
        // }
        query['reaction.onset'] = onset;
    }

    if (recorder) {
        let queryBuilder = referenceQueryBuilder(recorder, 'recorder.reference');
        for (let i in queryBuilder) {
            query[i] = queryBuilder[i];
        }
    }

    if (route) {
        let queryBuilder = tokenQueryBuilder(route, 'code', 'reaction.exposureRoute.coding');
        for (let i in queryBuilder) {
            query[i] = queryBuilder[i];
        }
    }

    if (severity) {
        query['reaction.severity'] = severity;
    }

    if (type) {
        query.type = type;
    }

    // console.log(JSON.stringify(query));

    // Grab an instance of our DB and collection
    let db = globals.get(CLIENT_DB);
    let collection = db.collection(COLLECTION.ALLERGYINTOLERANCE);
    // Query our collection for this allergyintolerance
    collection.find(query, (err, allergyintolerances) => {
        if (err) {
            logger.error('Error with AllergyIntolerance.search: ', err);
            return reject(err);
        }
        // AllergyIntolerances is a cursor, grab the documents from that
        allergyintolerances.toArray().then(resolve, reject);
    });
});

/**
 * @name searchById
 * @description Get an allergyintolerance from our database
 * @param {Object} args - Any provided args
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
module.exports.searchById = (args, logger) => new Promise((resolve, reject) => {
    logger.info('AllergyIntolerance >>> searchById');
    // Parse the required params, these are validated by sanitizeMiddleware in core
    let { id } = args;
    // Grab an instance of our DB and collection
    let db = globals.get(CLIENT_DB);
    let collection = db.collection(COLLECTION.ALLERGYINTOLERANCE);
    // Query our collection for this allergyintolerance
    collection.findOne({ id: id.toString() }, (err, allergyintolerance) => {
        if (err) {
            logger.error('Error with AllergyIntolerance.searchById: ', err);
            return reject(err);
        }
        resolve(allergyintolerance);
    });
});

/**
 * @name create
 * @description Create an allergyintolerance
 * @param {Object} args - Any provided args
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
module.exports.create = (args, logger) => new Promise((resolve, reject) => {
    logger.info('AllergyIntolerance >>> create');
    let { id, resource } = args;
    // Grab an instance of our DB and collection
    let db = globals.get(CLIENT_DB);
    let collection = db.collection(COLLECTION.ALLERGYINTOLERANCE);
    // If there is an id, use it, otherwise let mongo generate it
    let doc = Object.assign(resource.toJSON(), { _id: id });
    // Insert our allergyintolerance record
    collection.insert(doc, (err, res) => {
        if (err) {
            logger.error('Error with AllergyIntolerance.create: ', err);
            return reject(err);
        }
        // Grab the allergyintolerance record so we can pass back the id
        let [ allergyintolerance ] = res.ops;

        return resolve({ id: allergyintolerance.id });
    });
});

/**
 * @name update
 * @description Update an allergyintolerance
 * @param {Object} args - Any provided args
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
module.exports.update = (args, logger) => new Promise((resolve, reject) => {
    logger.info('AllergyIntolerance >>> update');
    let { id, resource } = args;
    // Grab an instance of our DB and collection
    let db = globals.get(CLIENT_DB);
    let collection = db.collection(COLLECTION.ALLERGYINTOLERANCE);
    // Set the id of the resource
    let doc = Object.assign(resource.toJSON(), { _id: id });
    // Insert/update our allergyintolerance record
    collection.findOneAndUpdate({ id: id }, doc, { upsert: true }, (err, res) => {
        if (err) {
            logger.error('Error with AllergyIntolerance.update: ', err);
            return reject(err);
        }
        // If we support versioning, which we do not at the moment,
        // we need to return a version
        return resolve({ id: res.value && res.value.id });
    });
});

/**
 * @name remove
 * @description Delete an allergyintolerance
 * @param {Object} args - Any provided args
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
module.exports.remove = (args, logger) => new Promise((resolve, reject) => {
    logger.info('AllergyIntolerance >>> remove');
    let { id } = args;
    // Grab an instance of our DB and collection
    let db = globals.get(CLIENT_DB);
    let collection = db.collection(COLLECTION.ALLERGYINTOLERANCE);
    // Delete our allergyintolerance record
    collection.remove({ id: id }, (err, _) => {
        if (err) {
            logger.error('Error with AllergyIntolerance.remove');
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
