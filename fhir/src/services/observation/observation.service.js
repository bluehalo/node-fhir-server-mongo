// const { validateDate } = require('../../utils/date.validator');
const { COLLECTION, CLIENT_DB } = require('../../constants');
const globals = require('../../globals');
const { stringQueryBuilder, tokenQueryBuilder, referenceQueryBuilder, quantityQueryBuilder, compositeQueryBuilder, dateQueryBuilder } = require('../../utils/service.utils');

/**
 * @name count
 * @description Get the number of observations in our database
 * @param {Object} args - Any provided args
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
module.exports.count = (args, logger) => new Promise((resolve, reject) => {
    logger.info('Observation >>> count');
    // Grab an instance of our DB and collection
    let db = globals.get(CLIENT_DB);
    let collection = db.collection(COLLECTION.OBSERVATION);
    // Query all documents in this collection
    collection.count((err, count) => {
        if (err) {
            logger.error('Error with Observation.count: ', err);
            return reject(err);
        }
        return resolve(count);
    });
});

/**
 * @name search
 * @description Get observation(s) from our database
 * @param {Object} args - Any provided args
 * @param {Object} contexts - Any provided contexts
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
module.exports.search = (args, contexts, logger) => new Promise((resolve, reject) => {
    logger.info('Observation >>> search');
    // Parse out all the params for this service and start building our query
    let { _id, basedOn, category, code, codeValueConcept, /*codeValueDate,*/ codeValueQuantity, codeValueString, comboCode,
        comboCodeValueConcept, comboCodeValueQuantity, comboDataAbsentReason, comboValueConcept, comboValueQuantity, componentCode,
        componentCodeValueConcept, componentCodeValueQuantity, componentDataAbsentReason, componentValueCodeableConcept,
        componentValueQuantity, context, dataAbsentReason, date, device, encounter, identifier, method, patient, performer,
        related, relatedTarget, relatedType, specimen, status, subject, valueCodeableConcept, valueDate, valueQuantity,
        valueString } = args;
    let query = {};
    let ors = [];
    // console.log(JSON.stringify(args));

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

    if (codeValueConcept) {
        ors.push(compositeQueryBuilder(codeValueConcept, 'code.coding|token', 'valueCodeableConcept.coding|token'));
    }

    // if (codeValueDate) {
    //
    // }

    if (codeValueQuantity) {
        ors.push(compositeQueryBuilder(codeValueQuantity, 'code.coding|token', 'valueQuantity|quantity'));
    }

    if (codeValueString) {
        ors.push(compositeQueryBuilder(codeValueString, 'code.coding|token', 'valueString|string'));
    }

    if (comboCode) {
        ors.push({$or: [tokenQueryBuilder(comboCode, 'code', 'code.coding', ''), tokenQueryBuilder(comboCode, 'code', 'component.code.coding', '')]});
    }

    if (comboCodeValueConcept) {
        ors.push({$or: [compositeQueryBuilder(comboCodeValueConcept, 'code.coding|token', 'valueCodeableConcept.coding|token'),
                compositeQueryBuilder(comboCodeValueConcept, 'component.code.coding|token', 'component.valueCodeableConcept.coding|token')]});
    }

    if (comboCodeValueQuantity) {
        ors.push({$or: [compositeQueryBuilder(comboCodeValueQuantity, 'code.coding|token', 'valueQuantity|quantity'),
                compositeQueryBuilder(comboCodeValueQuantity, 'component.code.coding|token', 'component.valueQuantity|quantity')]});
    }

    if (comboDataAbsentReason) {
        ors.push({$or: [tokenQueryBuilder(comboDataAbsentReason, 'code', 'dataAbsentReason.coding', ''),
                tokenQueryBuilder(comboDataAbsentReason, 'code', 'component.dataAbsentReason.coding', '')]});
    }

    if (comboValueConcept) {
        ors.push({$or: [tokenQueryBuilder(comboValueConcept, 'code', 'valueCodeableConcept.coding', ''),
                tokenQueryBuilder(comboValueConcept, 'code', 'component.valueCodeableConcept.coding', '')]});
    }

    if (comboValueQuantity) {
        ors.push({$or: [quantityQueryBuilder(comboValueQuantity, 'valueQuantity'),
                quantityQueryBuilder(comboValueQuantity, 'component.valueQuantity')]});
    }

    if (componentCode) {
        let queryBuilder = tokenQueryBuilder(componentCode, 'code', 'component.code.coding', '');
        for (let i in queryBuilder) {
            query[i] = queryBuilder[i];
        }
    }

    if (componentCodeValueConcept) {
        ors.push(compositeQueryBuilder(componentCodeValueConcept, 'component.code.coding|token', 'component.valueCodeableConcept.coding|token'));
    }

    if (componentCodeValueQuantity) {
        ors.push(compositeQueryBuilder(componentCodeValueQuantity, 'component.code.coding|token', 'component.valueQuantity|quantity'));
    }

    if (componentDataAbsentReason) {
        let queryBuilder = tokenQueryBuilder(componentDataAbsentReason, 'code', 'component.dataAbsentReason.coding', '');
        for (let i in queryBuilder) {
            query[i] = queryBuilder[i];
        }
    }

    if (componentValueCodeableConcept) {
        let queryBuilder = tokenQueryBuilder(componentValueCodeableConcept, 'code', 'component.valueCodeableConcept.coding', '');
        for (let i in queryBuilder) {
            query[i] = queryBuilder[i];
        }
    }

    if (componentValueQuantity) {
        let queryBuilder = quantityQueryBuilder(componentValueQuantity, 'component.valueQuantity');
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

    if (dataAbsentReason) {
        let queryBuilder = tokenQueryBuilder(dataAbsentReason, 'code', 'dataAbsentReason.coding', '');
        for (let i in queryBuilder) {
            query[i] = queryBuilder[i];
        }
    }

    if (date) {
      ors.push({$or: [{effectiveDateTime: dateQueryBuilder(date, 'dateTime', '')},
    {$or: dateQueryBuilder(date, 'period', 'effectivePeriod')}]});
    }

    if (device) {
        let queryBuilder = referenceQueryBuilder(device, 'device.reference');
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

    if (method) {
        let queryBuilder = tokenQueryBuilder(method, 'code', 'method.coding', '');
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
        let queryBuilder = referenceQueryBuilder(performer, 'performer.reference');
        for (let i in queryBuilder) {
            query[i] = queryBuilder[i];
        }
    }

    if (related) {
        ors.push(compositeQueryBuilder(related, 'related.type|code', 'related.target.reference|reference'));
    }

    if (relatedTarget) {
        let queryBuilder = referenceQueryBuilder(relatedTarget, 'related.target.reference');
        for (let i in queryBuilder) {
            query[i] = queryBuilder[i];
        }
    }

    if (relatedType) {
        query['related.type'] = relatedType;
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

    if (valueCodeableConcept) {
        let queryBuilder = tokenQueryBuilder(valueCodeableConcept, 'code', 'valueCodeableConcept.coding', '');
        for (let i in queryBuilder) {
            query[i] = queryBuilder[i];
        }
    }

    if (valueDate) {
      ors.push({$or: [{valueDateTime: dateQueryBuilder(valueDate, 'dateTime', '')},
    {$or: dateQueryBuilder(valueDate, 'period', 'valuePeriod')}]});
    }

    if (valueQuantity) {
        let queryBuilder = quantityQueryBuilder(valueQuantity, 'valueQuantity');
        for (let i in queryBuilder) {
            query[i] = queryBuilder[i];
        }
    }

    if (valueString) {
        query.valueString = stringQueryBuilder(valueString);
    }

    if (ors.length !== 0) {
        query.$and = ors;
    }

    // console.log(JSON.stringify(query));

    // Grab an instance of our DB and collection
    let db = globals.get(CLIENT_DB);
    let collection = db.collection(COLLECTION.OBSERVATION);
    // Query our collection for this observation
    collection.find(query, (err, observations) => {
        if (err) {
            logger.error('Error with Observation.search: ', err);
            return reject(err);
        }
        // Observations is a cursor, grab the documents from that
        observations.toArray().then(resolve, reject);
    });
});

/**
 * @name searchById
 * @description Get an observation from our database
 * @param {Object} args - Any provided args
 * @param {Object} contexts - Any provided contexts
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
module.exports.searchById = (args, contexts, logger) => new Promise((resolve, reject) => {
    logger.info('Observation >>> searchById');
    // Parse the required params, these are validated by sanitizeMiddleware in core
    let { id } = args;
    // Grab an instance of our DB and collection
    let db = globals.get(CLIENT_DB);
    let collection = db.collection(COLLECTION.OBSERVATION);
    // Query our collection for this observation
    collection.findOne({ id: id.toString() }, (err, observation) => {
        if (err) {
            logger.error('Error with Observation.getObservationByID: ', err);
            return reject(err);
        }
        resolve(observation);
    });
});

/**
 * @name create
 * @description Create a observation
 * @param {Object} args - Any provided args
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
module.exports.create = (args, logger) => new Promise((resolve, reject) => {
    logger.info('Observation >>> create');
    let { id, resource } = args;
    // Grab an instance of our DB and collection
    let db = globals.get(CLIENT_DB);
    let collection = db.collection(COLLECTION.OBSERVATION);
    // If there is an id, use it, otherwise let mongo generate it
    let doc = Object.assign(resource.toJSON(), { _id: id });
    // Insert our observation record
    collection.insert(doc, (err, res) => {
        if (err) {
            logger.error('Error with Observation.create: ', err);
            return reject(err);
        }
        // Grab the observation record so we can pass back the id
        let [ observation ] = res.ops;

        return resolve({ id: observation.id });
    });
});

/**
 * @name update
 * @description Update a observation
 * @param {Object} args - Any provided args
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
module.exports.update = (args, logger) => new Promise((resolve, reject) => {
    logger.info('Observation >>> update');
    let { id, resource } = args;
    // Grab an instance of our DB and collection
    let db = globals.get(CLIENT_DB);
    let collection = db.collection(COLLECTION.OBSERVATION);
    // Set the id of the resource
    let doc = Object.assign(resource.toJSON(), { _id: id });
    // Insert/update our observation record
    collection.findOneAndUpdate({ id: id }, { $set: doc}, { upsert: true }, (err, res) => {
        if (err) {
            logger.error('Error with Observation.update: ', err);
            return reject(err);
        }
        // If we support versioning, which we do not at the moment,
        // we need to return a version
        return resolve({ id: res.value && res.value.id });
    });
});

/**
 * @name remove
 * @description Delete a observation
 * @param {Object} args - Any provided args
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
module.exports.remove = (args, logger) => new Promise((resolve, reject) => {
    logger.info('Observation >>> remove');
    let { id } = args;
    // Grab an instance of our DB and collection
    let db = globals.get(CLIENT_DB);
    let collection = db.collection(COLLECTION.OBSERVATION);
    // Delete our observation record
    collection.remove({ id: id }, (err, _) => {
        if (err) {
            logger.error('Error with Observation.remove');
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
