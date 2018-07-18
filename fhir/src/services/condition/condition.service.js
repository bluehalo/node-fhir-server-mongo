const { COLLECTION, CLIENT_DB } = require('../../constants');
//const { validateDate } = require('../../utils/date.validator');
const globals = require('../../globals');
const { stringQueryBuilder, quantityQueryBuilder, referenceQueryBuilder, tokenQueryBuilder, dateQueryBuilder } = require('../../utils/service.utils');

/**
 * @name count
 * @description Get the number of condition in our database
 * @param {Object} args - Any provided args
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
module.exports.count = (args, logger) => new Promise((resolve, reject) => {
    logger.info('Condition >>> count');
    // Grab an instance of our DB and collection
    let db = globals.get(CLIENT_DB);
    let collection = db.collection(COLLECTION.CONDITION);
    // Query all documents in this collection
    collection.count((err, count) => {
        if (err) {
            logger.error('Error with Condition.count: ', err);
            return reject(err);
        }
        return resolve(count);
    });
});

/**
 * @name search
 * @description Get condition(s) from our database
 * @param {Object} args - Any provided args
 * @param {Object} contexts - Any provided contexts
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
module.exports.search = (args, contexts, logger) => new Promise((resolve, reject) => {
    logger.info('Condition >>> search');
    // Parse out all the params for this service and start building our query
    let { _id, patient, category, code, assertedDate, onsetDate, clinicalStatus,
        verificationStatus, abatementAge, abatementBoolean, abatementDate,
        abatementString, asserter, bodySite, context, encounter, evidence,
        evidenceDetail, identifier, onsetAge, onsetInfo, severity, stage, subject } = args;
    let query = {
    };
    let ors = [];
    if (_id) {
        query.id = _id;
    }
    if (patient) {
      let queryBuilder = referenceQueryBuilder(patient, 'subject.reference');
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
    if (onsetDate) {
        ors.push({$or: [{onsetDateTime: dateQueryBuilder(onsetDate, 'dateTime')},
      {$or: dateQueryBuilder(onsetDate, 'period', 'onsetPeriod')}]});
    }
    if (assertedDate) {
        query.assertedDate = dateQueryBuilder(assertedDate, 'date');
    }
    if (clinicalStatus) {
        query.clinicalStatus = clinicalStatus;
    }
    if (verificationStatus) {
        query.verificationStatus = verificationStatus;
    }
    if (abatementAge) {
        ors.push({$or: [quantityQueryBuilder(abatementAge, 'abatementAge'), quantityQueryBuilder(abatementAge, 'abatementRange')] });
    }
    if (abatementBoolean) {
        let t = {$regex: new RegExp('.', 'i')};
        ors.push({$or: [{abatementBoolean: (abatementBoolean === 'true')}, {abatementDateTime: t},
                {'abatementAge.system': t}, {'abatementRange.system': t}, {abatementPeriod: t}, {abatementString: t}]});
    }
    if (abatementDate) {
        ors.push({$or: [{abatementDateTime: dateQueryBuilder(abatementDate, 'dateTime')},
      {$or: dateQueryBuilder(abatementDate, 'period', 'abatementPeriod')}]});
    }
    if (ors.length !== 0) {
        query.$and = ors;
    }
    if (abatementString) {
        query.abatementString = stringQueryBuilder(abatementString, query);
    }
    if (asserter) {
        let queryBuilder = referenceQueryBuilder(asserter, 'asserter.reference');
        for (let i in queryBuilder) {
            query[i] = queryBuilder[i];
        }
    }
    if (bodySite) {
      let queryBuilder = tokenQueryBuilder(bodySite, 'code', 'bodySite.coding', '');
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
    if (encounter) {
      let queryBuilder = referenceQueryBuilder(encounter, 'context.reference');
      for (let i in queryBuilder) {
          query[i] = queryBuilder[i];
      }
    }
    if (evidence) {
      let queryBuilder = tokenQueryBuilder(evidence, 'code', 'evidence.code.coding', '');
      for (let i in queryBuilder) {
          query[i] = queryBuilder[i];
      }
    }
    if (evidenceDetail) {
      let queryBuilder = referenceQueryBuilder(evidenceDetail, 'evidence.detail.reference');
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
    // Implement quantity range
    if (onsetAge) {
        let queryBuilder = quantityQueryBuilder(onsetAge, 'onsetAge');
        for (let i in queryBuilder) {
            query[i] = queryBuilder[i];
        }
    }
    if (onsetInfo) {
        query.onsetString = stringQueryBuilder(onsetInfo);
    }
    if (severity) {
      let queryBuilder = tokenQueryBuilder(severity, 'code', 'severity.coding', '');
      for (let i in queryBuilder) {
          query[i] = queryBuilder[i];
      }
    }
    if (stage) {
      let queryBuilder = tokenQueryBuilder(stage, 'code', 'stage.summary.coding', '');
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
    let collection = db.collection(COLLECTION.CONDITION);

    collection.find(query, (err, conditions) => {
        if (err) {
            logger.error('Error with Condition.search: ', err);
            return reject(err);
        }
        // Conditions is a cursor, grab the documents from that
        conditions.toArray().then(resolve, reject);
    });
});

/**
 * @name searchById
 * @description Get a condition from our database
 * @param {Object} args - Any provided args
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
module.exports.searchById = (args, logger) => new Promise((resolve, reject) => {
    logger.info('Condition >>> searchById');
    // Parse the required params, these are validated by sanitizeMiddleware in core
    let { id } = args;
    // Grab an instance of our DB and collection
    let db = globals.get(CLIENT_DB);
    let collection = db.collection(COLLECTION.CONDITION);
    // Query our collection for this condition
    collection.findOne({ id: id.toString() }, (err, condition) => {
        if (err) {
            logger.error('Error with Condition.searchById: ', err);
            return reject(err);
        }
        resolve(condition);
    });
});

/**
 * @name create
 * @description Create a condition
 * @param {Object} args - Any provided args
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
module.exports.create = (args, logger) => new Promise((resolve, reject) => {
    logger.info('Condition >>> create');
    let { id, resource } = args;
    // Grab an instance of our DB and collection
    let db = globals.get(CLIENT_DB);
    let collection = db.collection(COLLECTION.CONDITION);
    // If there is an id, use it, otherwise let mongo generate it
    let doc = Object.assign(resource.toJSON(), { _id: id });
    // Insert our condition record
    collection.insert(doc, (err, res) => {
        if (err) {
            logger.error('Error with Condition.create: ', err);
            return reject(err);
        }
        // Grab the condition record so we can pass back the id
        let [ condition ] = res.ops;

        return resolve({ id: condition.id });
    });
});

/**
 * @name update
 * @description Update a condition
 * @param {Object} args - Any provided args
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
module.exports.update = (args, logger) => new Promise((resolve, reject) => {
    logger.info('Condition >>> update');
    let { id, resource } = args;
    // Grab an instance of our DB and collection
    let db = globals.get(CLIENT_DB);
    let collection = db.collection(COLLECTION.CONDITION);
    // Set the id of the resource
    let doc = Object.assign(resource.toJSON(), { _id: id });
    // Insert/update our condition record
    collection.findOneAndUpdate({ id: id }, { $set: doc}, { upsert: true }, (err, res) => {
        if (err) {
            logger.error('Error with Condition.update: ', err);
            return reject(err);
        }
        // If we support versioning, which we do not at the moment,
        // we need to return a version
        return resolve({ id: res.value && res.value.id });
    });
});

/**
 * @name remove
 * @description Delete a condition
 * @param {Object} args - Any provided args
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
module.exports.remove = (args, logger) => new Promise((resolve, reject) => {
    logger.info('Condition >>> remove');
    let { id } = args;
    // Grab an instance of our DB and collection
    let db = globals.get(CLIENT_DB);
    let collection = db.collection(COLLECTION.CONDITION);
    // Delete our condition record
    collection.remove({ id: id }, (err, _) => {
        if (err) {
            logger.error('Error with Condition.remove');
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
