const { COLLECTION, CLIENT_DB } = require('../../constants');
const globals = require('../../globals');
const { tokenQueryBuilder, referenceQueryBuilder } = require('../../utils/service.utils');

/**
 * @name count
 * @description Get the number of diagnosticreports in our database
 * @param {Object} args - Any provided args
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
module.exports.count = (args, logger) => new Promise((resolve, reject) => {
    logger.info('DiagnosticReport >>> count');
    // Grab an instance of our DB and collection
    let db = globals.get(CLIENT_DB);
    let collection = db.collection(COLLECTION.DIAGNOSTICREPORT);
    // Query all documents in this collection
    collection.count((err, count) => {
        if (err) {
            logger.error('Error with DiagnosticReport.count: ', err);
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
    logger.info('DiagnosticReport >>> search');
    // Parse the params
    let {basedOn, category, code, context, date, diagnosis, encounter, identifier, image, issued, patient, performer, result,
        specimen, status, subject} = args;
    let query = {};

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

    if (context) {
        let queryBuilder = referenceQueryBuilder(context, 'context.reference');
        for (let i in queryBuilder) {
            query[i] = queryBuilder[i];
        }
    }

    if (date) {
        query.effectiveDateTime = date;
    }

    if (diagnosis) {
        let queryBuilder = tokenQueryBuilder(diagnosis, 'code', 'codedDiagnosis.coding', '');
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

    if (image) {
        let queryBuilder = referenceQueryBuilder(image, 'image.link.reference');
        for (let i in queryBuilder) {
            query[i] = queryBuilder[i];
        }
    }

    if (issued) {
        query.issued = issued;
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

    if (result) {
        let queryBuilder = referenceQueryBuilder(result, 'result.reference');
        for (let i in queryBuilder) {
            query[i] = queryBuilder[i];
        }
    }

    if (specimen) {
        let queryBuilder = referenceQueryBuilder(specimen, 'specimen.reference');
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
    let collection = db.collection(COLLECTION.DIAGNOSTICREPORT);
    // Query our collection for this observation
    collection.find(query, (err, diagnosticreport) => {
        if (err) {
            logger.error('Error with Diagnosticreport.search: ', err);
            return reject(err);
        }
        // Diagnosticreport is a diagnosticreport cursor, pull documents out before resolving
        diagnosticreport.toArray().then(resolve, reject);
    });
});

/**
 * @name searchById
 * @description Get a diagnosticreport by their unique identifier
 * @param {Object} args - Any provided args
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
module.exports.searchById = (args, logger) => new Promise((resolve, reject) => {
    logger.info('DiagnosticReport >>> searchById');
    // Parse the required params, these are validated by sanitizeMiddleware in core
    let { id } = args;
    // Grab an instance of our DB and collection
    let db = globals.get(CLIENT_DB);
    let collection = db.collection(COLLECTION.DIAGNOSTICREPORT);
    // Query our collection for this observation
    collection.findOne({ id: id.toString() }, (err, diagnosticreport) => {
        if (err) {
            logger.error('Error with DiagnosticReport.searchById: ', err);
            return reject(err);
        }
        resolve(diagnosticreport);
    });
});

/**
 * @name create
 * @description Create a diagnosticreport
 * @param {Object} args - Any provided args
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
module.exports.create = (args, logger) => new Promise((resolve, reject) => {
    logger.info('DiagnosticReport >>> create');
    let { id, resource } = args;
    // Grab an instance of our DB and collection
    let db = globals.get(CLIENT_DB);
    let collection = db.collection(COLLECTION.DIAGNOSTICREPORT);
    // If there is an id, use it, otherwise let mongo generate it
    let doc = Object.assign(resource.toJSON(), { _id: id });
    // Insert our diagnosticreport record
    collection.insert(doc, (err, res) => {
        if (err) {
            logger.error('Error with DiagnosticReport.create: ', err);
            return reject(err);
        }
        // Grab the diagnosticreport record so we can pass back the id
        let [ diagnosticreport ] = res.ops;

        return resolve({ id: diagnosticreport.id });
    });
});

/**
 * @name update
 * @description Update a diagnosticreport
 * @param {Object} args - Any provided args
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
module.exports.update = (args, logger) => new Promise((resolve, reject) => {
    logger.info('DiagnosticReport >>> update');
    let { id, resource } = args;
    // Grab an instance of our DB and collection
    let db = globals.get(CLIENT_DB);
    let collection = db.collection(COLLECTION.DIAGNOSTICREPORT);
    // Set the id of the resource
    let doc = Object.assign(resource.toJSON(), { _id: id });
    // Insert/update our diagnosticreport record
    collection.findOneAndUpdate({ id: id }, { $set: doc}, { upsert: true }, (err, res) => {
        if (err) {
            logger.error('Error with DiagnosticReport.update: ', err);
            return reject(err);
        }
        // If we support versioning, which we do not at the moment,
        // we need to return a version
        return resolve({ id: res.value && res.value.id });
    });
});

/**
 * @name remove
 * @description Delete a diagnosticreport
 * @param {Object} args - Any provided args
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
module.exports.remove = (args, logger) => new Promise((resolve, reject) => {
    logger.info('DiagnosticReport >>> remove');
    let { id } = args;
    // Grab an instance of our DB and collection
    let db = globals.get(CLIENT_DB);
    let collection = db.collection(COLLECTION.DIAGNOSTICREPORT);
    // Delete our diagnosticreport record
    collection.remove({ id: id }, (err, _) => {
        if (err) {
            logger.error('Error with DiagnosticReport.remove');
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
