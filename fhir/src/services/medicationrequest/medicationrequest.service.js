const { COLLECTION, CLIENT_DB } = require('../../constants');
const globals = require('../../globals');
const { tokenQueryBuilder, referenceQueryBuilder, dateQueryBuilder } = require('../../utils/service.utils');

/**
 * @name count
 * @description Get the number of medicationrequests in our database
 * @param {Object} args - Any provided args
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
module.exports.count = (args, logger) => new Promise((resolve, reject) => {
    logger.info('MedicationRequest >>> count');
    // Grab an instance of our DB and collection
    let db = globals.get(CLIENT_DB);
    let collection = db.collection(COLLECTION.MEDICATIONREQUEST);
    // Query all documents in this collection
    collection.count((err, count) => {
        if (err) {
            logger.error('Error with MedicationRequest.count: ', err);
            return reject(err);
        }
        return resolve(count);
    });
});

/**
 * @name search
 * @description Get medication requests(s) from our database
 * @param {Object} args - Any provided args
 * @param {Object} contexts - Any provided contexts
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
module.exports.search = (args, contexts, logger) => new Promise((resolve, reject) => {
    logger.info('MedicationRequest >>> search');
    // Parse the params
    let { _id, authoredon, category, code, context, date, identifier, intendedDispenser, intent, medication, patient, priority,
        requester, status, subject } = args;
    // console.log(JSON.stringify(args));

    let query = {};

    if (_id) {
        query.id = _id;
    }

    if (authoredon) {
        query.authoredOn = dateQueryBuilder(authoredon, 'dateTime', '');
    }

    if (category) {
        let queryBuilder = tokenQueryBuilder(category, 'code', 'category.coding', '');
        for (let i in queryBuilder) {
            query[i] = queryBuilder[i];
        }
    }

    if (code) {
        let queryBuilder = tokenQueryBuilder(code, 'code', 'medicationCodeableConcept.coding', '');
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
        query['dosageInstruction.timing.event'] = dateQueryBuilder(date, 'dateTime', '');
    }

    if (identifier) {
        let queryBuilder = tokenQueryBuilder(identifier, 'value', 'identifier', '');
        for (let i in queryBuilder) {
            query[i] = queryBuilder[i];
        }
    }

    if (intendedDispenser) {
        let queryBuilder = referenceQueryBuilder(intendedDispenser, 'dispenseRequest.performer.reference');
        for (let i in queryBuilder) {
            query[i] = queryBuilder[i];
        }
    }

    if (intent) {
        query.intent = intent;
    }

    if (medication) {
        let queryBuilder = referenceQueryBuilder(medication, 'medicationReference.reference');
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

    if (priority) {
        query.priority = priority;
    }

    if (requester) {
        let queryBuilder = referenceQueryBuilder(requester, 'requester.agent.reference');
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
    let collection = db.collection(COLLECTION.MEDICATIONREQUEST);
    // Query our collection for this medicationrequest
    collection.find(query, (err, medicationrequest) => {
        if (err) {
            logger.error('Error with MedicationRequest.search: ', err);
            return reject(err);
        }
        // MedicationRequest is a cursor, grab the documents from that
        medicationrequest.toArray().then(resolve, reject);
    });
});

/**
 * @name searchById
 * @description Get a medicationrequest by their unique identifier
 * @param {Object} args - Any provided args
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
module.exports.searchById = (args, logger) => new Promise((resolve, reject) => {
    logger.info('MedicationRequest >>> searchById');
    // Parse the required params, these are validated by sanitizeMiddleware in core
    let { id } = args;
    // Grab an instance of our DB and collection
    let db = globals.get(CLIENT_DB);
    let collection = db.collection(COLLECTION.MEDICATIONREQUEST);
    // Query our collection for this observation
    collection.findOne({ id: id.toString() }, (err, medicationrequest) => {
        if (err) {
            logger.error('Error with MedicationRequest.searchById: ', err);
            return reject(err);
        }
        resolve(medicationrequest);
    });
});

/**
 * @name create
 * @description Create a medicationrequest
 * @param {Object} args - Any provided args
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
module.exports.create = (args, logger) => new Promise((resolve, reject) => {
    logger.info('MedicationRequest >>> create');
    let { id, resource } = args;
    // Grab an instance of our DB and collection
    let db = globals.get(CLIENT_DB);
    let collection = db.collection(COLLECTION.MEDICATIONREQUEST);
    // If there is an id, use it, otherwise let mongo generate it
    let doc = Object.assign(resource.toJSON(), { _id: id });
    // Insert our medicationrequest record
    collection.insert(doc, (err, res) => {
        if (err) {
            logger.error('Error with MedicationRequest.create: ', err);
            return reject(err);
        }
        // Grab the medicationrequest record so we can pass back the id
        let [ medicationrequest ] = res.ops;

        return resolve({ id: medicationrequest.id });
    });
});

/**
 * @name update
 * @description Update a medicationrequest
 * @param {Object} args - Any provided args
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
module.exports.update = (args, logger) => new Promise((resolve, reject) => {
    logger.info('MedicationRequest >>> update');
    let { id, resource } = args;
    // Grab an instance of our DB and collection
    let db = globals.get(CLIENT_DB);
    let collection = db.collection(COLLECTION.MEDICATIONREQUEST);
    // Set the id of the resource
    let doc = Object.assign(resource.toJSON(), { _id: id });
    // Insert/update our medicationrequest record
    collection.findOneAndUpdate({ id: id }, { $set: doc}, { upsert: true }, (err, res) => {
        if (err) {
            logger.error('Error with MedicationRequest.update: ', err);
            return reject(err);
        }
        // If we support versioning, which we do not at the moment,
        // we need to return a version
        return resolve({ id: res.value && res.value.id });
    });
});

/**
 * @name remove
 * @description Delete a medicationrequest
 * @param {Object} args - Any provided args
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
module.exports.remove = (args, logger) => new Promise((resolve, reject) => {
    logger.info('MedicationRequest >>> remove');
    let { id } = args;
    // Grab an instance of our DB and collection
    let db = globals.get(CLIENT_DB);
    let collection = db.collection(COLLECTION.MEDICATIONREQUEST);
    // Delete our medicationrequest record
    collection.remove({ id: id }, (err, _) => {
        if (err) {
            logger.error('Error with MedicationRequest.remove');
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
