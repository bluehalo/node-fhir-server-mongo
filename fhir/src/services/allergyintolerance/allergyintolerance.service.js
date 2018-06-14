// const { validateDate } = require('../../utils/date.validator');
const { COLLECTION, CLIENT_DB } = require('../../constants');
const globals = require('../../globals');

/**
 * @name getCount
 * @description Get the number of allergyintolerances in our database
 * @param {Object} args - Any provided args
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
module.exports.getCount = (args, logger) => new Promise((resolve, reject) => {
    logger.info('AllergyIntolerance >>> getCount');
    // Grab an instance of our DB and collection
    let db = globals.get(CLIENT_DB);
    let collection = db.collection(COLLECTION.ALLERGYINTOLERANCE);
    // Query all documents in this collection
    collection.count((err, count) => {
        if (err) {
            logger.error('Error with AllergyIntolerance.getCount: ', err);
            return reject(err);
        }
        return resolve(count);
    });
});

/**
 * @name getAllergyIntolerance
 * @description Get allergyintolerance(s) from our database
 * @param {Object} args - Any provided args
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
module.exports.getAllergyIntolerance = (args, logger) => new Promise((resolve, reject) => {
    logger.info('AllergyIntolerance >>> getAllergyIntolerance');
    // Parse the params
    let { category, clinicalStatus, code, criticality, date, identifier, lastDate, manifestation, onset, patient, recorder,
        route, severity, type, verificationStatus } = args;

    // Patient and verificationStatus are required and guaranteed to be provided
    let query = {
        'patient.reference': `Patient/${patient}`,
        verificationStatus: verificationStatus
    };

    if (category) {
        query.category = category;
    }

    if (clinicalStatus) {
        query.clinicalStatus = clinicalStatus;
    }

    if (code) {
        if (code.includes('|')) {
            let [ system, value ] = code.split('|');
            // console.log(('' === system) + ' *** ' + value);
            if (system) {
                query['code.coding.system'] = system;
            }
            if (value) {
                query['code.coding.code'] = value;
            }
        }
        else {
            query['code.coding.code'] = { $in: code.split(',') };
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
        if (identifier.includes('|')) {
            let [ system, value ] = identifier.split('|');
            // console.log(('' === system) + ' *** ' + value);
            if (system) {
                query['identifier.system'] = system;
            }
            if (value) {
                query['identifier.value'] = value;
            }
        }
        else {
            query['identifier.value'] = identifier;
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
        if (manifestation.includes('|')) {
            let [ system, value ] = manifestation.split('|');
            // console.log(('' === system) + ' *** ' + value);
            if (system) {
                query['reaction.manifestation.coding.system'] = system;
            }
            if (value) {
                query['reaction.manifestation.coding.code'] = value;
            }
        }
        else {
            query['reaction.manifestation.coding.code'] = { $in: manifestation.split(',') };
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
        query['recorder.reference'] = `Practitioner/${recorder}`;
    }

    if (route) {
        if (route.includes('|')) {
            let [ system, value ] = route.split('|');
            // console.log(('' === system) + ' *** ' + value);
            if (system) {
                query['reaction.exposureRoute.coding.system'] = system;
            }
            if (value) {
                query['reaction.exposureRoute.coding.code'] = value;
            }
        }
        else {
            query['reaction.exposureRoute.coding.code'] = { $in: route.split(',') };
        }
    }

    if (severity) {
        query['reaction.severity'] = severity;
    }

    if (type) {
        query.type = type;
    }
    /************************ ^^^ TESTED ^^^ ************************/

    console.log(JSON.stringify(query));

    // Grab an instance of our DB and collection
    let db = globals.get(CLIENT_DB);
    let collection = db.collection(COLLECTION.ALLERGYINTOLERANCE);
    // Query our collection for this allergyintolerance
    collection.find(query, (err, allergyintolerances) => {
        if (err) {
            logger.error('Error with AllergyIntolerance.getAllergyIntolerance: ', err);
            return reject(err);
        }
        // AllergyIntolerances is a cursor, grab the documents from that
        allergyintolerances.toArray().then(resolve, reject);
    });
});

/**
 * @name getAllergyIntoleranceById
 * @description Get an allergyintolerance from our database
 * @param {Object} args - Any provided args
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
module.exports.getAllergyIntoleranceById = (args, logger) => new Promise((resolve, reject) => {
    logger.info('AllergyIntolerance >>> getAllergyIntoleranceById');
    // Parse the required params, these are validated by sanitizeMiddleware in core
    let { id } = args;
    // Grab an instance of our DB and collection
    let db = globals.get(CLIENT_DB);
    let collection = db.collection(COLLECTION.ALLERGYINTOLERANCE);
    // Query our collection for this allergyintolerance
    collection.findOne({ id: id.toString() }, (err, allergyintolerance) => {
        if (err) {
            logger.error('Error with AllergyIntolerance.getAllergyIntoleranceById: ', err);
            return reject(err);
        }
        resolve(allergyintolerance);
    });
});

/**
 * @name createAllergyIntolerance
 * @description Create an allergyintolerance
 * @param {Object} args - Any provided args
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
module.exports.createAllergyIntolerance = (args, logger) => new Promise((resolve, reject) => {
    logger.info('AllergyIntolerance >>> createAllergyIntolerance');
    let { id, resource } = args;
    // Grab an instance of our DB and collection
    let db = globals.get(CLIENT_DB);
    let collection = db.collection(COLLECTION.ALLERGYINTOLERANCE);
    // If there is an id, use it, otherwise let mongo generate it
    let doc = Object.assign(resource.toJSON(), { _id: id });
    // Insert our allergyintolerance record
    collection.insert(doc, (err, res) => {
        if (err) {
            logger.error('Error with AllergyIntolerance.createAllergyIntolerance: ', err);
            return reject(err);
        }
        // Grab the allergyintolerance record so we can pass back the id
        let [ allergyintolerance ] = res.ops;

        return resolve({ id: allergyintolerance.id });
    });
});

/**
 * @name updateAllergyIntolerance
 * @description Update an allergyintolerance
 * @param {Object} args - Any provided args
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
module.exports.updateAllergyIntolerance = (args, logger) => new Promise((resolve, reject) => {
    logger.info('AllergyIntolerance >>> updateAllergyIntolerance');
    let { id, resource } = args;
    // Grab an instance of our DB and collection
    let db = globals.get(CLIENT_DB);
    let collection = db.collection(COLLECTION.ALLERGYINTOLERANCE);
    // Set the id of the resource
    let doc = Object.assign(resource.toJSON(), { _id: id });
    // Insert/update our allergyintolerance record
    collection.findOneAndUpdate({ id: id }, doc, { upsert: true }, (err, res) => {
        if (err) {
            logger.error('Error with AllergyIntolerance.updateAllergyIntolerance: ', err);
            return reject(err);
        }
        // If we support versioning, which we do not at the moment,
        // we need to return a version
        return resolve({ id: res.value && res.value.id });
    });
});

/**
 * @name deleteAllergyIntolerance
 * @description Delete an allergyintolerance
 * @param {Object} args - Any provided args
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
module.exports.deleteAllergyIntolerance = (args, logger) => new Promise((resolve, reject) => {
    logger.info('AllergyIntolerance >>> deleteAllergyIntolerance');
    let { id } = args;
    // Grab an instance of our DB and collection
    let db = globals.get(CLIENT_DB);
    let collection = db.collection(COLLECTION.ALLERGYINTOLERANCE);
    // Delete our allergyintolerance record
    collection.remove({ id: id }, (err, _) => {
        if (err) {
            logger.error('Error with AllergyIntolerance.deleteAllergyIntolerance');
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
