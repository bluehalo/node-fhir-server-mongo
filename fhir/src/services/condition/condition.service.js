const { COLLECTION, CLIENT_DB } = require('../../constants');
const { validateDate } = require('../../utils/date.validator');
const globals = require('../../globals');

/**
 * @name getCount
 * @description Get the number of condition in our database
 * @param {Object} args - Any provided args
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
module.exports.getCount = (args, logger) => new Promise((resolve, reject) => {
    logger.info('Condition >>> getCount');
    // Grab an instance of our DB and collection
    let db = globals.get(CLIENT_DB);
    let collection = db.collection(COLLECTION.CONDITION);
    // Query all documents in this collection
    collection.count((err, count) => {
        if (err) {
            logger.error('Error with Condition.getCount: ', err);
            return reject(err);
        }
        return resolve(count);
    });
});

/**
 * @name getCondition
 * @description Get condition(s) from our database
 * @param {Object} args - Any provided args
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
module.exports.getCondition = (args, logger) => new Promise((resolve, reject) => {
    logger.info('Condition >>> getCondition');
    // Parse out all the params for this service and start building our query
    let { patient, category, code, assertedDate, onsetDate, clinicalStatus,
      verificationStatus, abatementAge, abatementBoolean, abatementDateTime,
    abatementString, asserter, bodySite, context, encounter, evidence,
  detail, identifier, onsetAge, onsetString, severity, stage, subject } = args;
    let query = {
    };
    query['subject.reference'] = `Patient/${patient}`;
    if (category) {
      query['category.coding.code'] = category;
    }
    if (code) {
      query['code.coding.code'] = { $in: code.split(',') };
    }
    if (onsetDate) {
      query.onsetDateTime = onsetDate;
    }
    if (assertedDate) {
      query.assertedDate = assertedDate;
    }
    if (clinicalStatus) {
      query.clinicalStatus = clinicalStatus;
    }
    if (verificationStatus) {
      query.verificationStatus = verificationStatus;
    }
    if (abatementAge) {
      const regex2 = /^\D*(\d+[.]?\d*)\|(https?:\/\/[a-zA-Z0-9_-]+\.[a-z]+(\/[a-zA-Z0-9_-]+)*)\|([\s]?[^\s]+)+/;
      const match2 = abatementAge.match(regex2);
      // let prefix = '$eq';
      // if (match[1]) {
      //   prefix = '$' + match[1].replace('ge', 'gte').replace('le', 'lte');
      // }
      if (match2 && match2.length >= 3) {
      let value = match2[1];
      let system = match2[2];
      let codeT = match2[4];
      query['abatementAge.value'] = Number(value);
      query['abatementAge.system'] = system;
      query['abatementAge.code'] = codeT;
    }
    }
    if (abatementBoolean) {
      query.abatementBoolean = abatementBoolean;
    }
    if (abatementDateTime) {
      let parsedates = validateDate(abatementDateTime);
      if (parsedates) {
        query.abatementDateTime = parsedates;
      }
    }
    if (abatementString) {
      query.abatementString = abatementString;
    }
    if (asserter) {
      query['asserter.reference'] = asserter;
    }
    if (bodySite) {
      const regex3 = /^(https?:\/\/[a-zA-Z0-9_-]+\.[a-z]+(\/[a-zA-Z0-9_-]+)*)\|([\s]?[^\s]+)+/;
      const match3 = bodySite.match(regex3);
      if (match3 && match3.length >= 3) {
        query['bodySite.coding.system'] = match3[1];
        query['bodySite.coding.code'] = match3[3];
      }
    }
    if (context) {
      query['context.reference'] = context;
    }
    if (encounter) {
      query['context.reference'] = `Encounter/${encounter}`;
    }
    if (evidence) {
      if (evidence.includes('|')) {
          let [ system, code2 ] = evidence.split('|');
          // console.log(('' === system) + ' *** ' + value);
          if (system) {
              query['evidence.code.coding.system'] = system;
          }
          if (code2) {
              query['evidence.code.coding.code'] = code2;
          }
      }
      else {
          query['evidence.code.coding.code'] = { $in: evidence.split(',') };
      }
    }
    if (detail) {
      query['evidence.detail.reference'] = detail;
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
    if (onsetAge) {
        const regex2 = /^\D*(\d+[.]?\d*)\|(https?:\/\/[a-zA-Z0-9_-]+\.[a-z]+(\/[a-zA-Z0-9_-]+)*)\|([\s]?[^\s]+)+/;
        const match2 = onsetAge.match(regex2);
        // let prefix = '$eq';
        // if (match[1]) {
        //   prefix = '$' + match[1].replace('ge', 'gte').replace('le', 'lte');
        // }
        if (match2 && match2.length >= 3) {
        let value = match2[1];
        let system = match2[2];
        let codeT = match2[4];
        query['onsetAge.value'] = Number(value);
        query['onsetAge.system'] = system;
        query['onsetAge.code'] = codeT;
      }
    }
    if (onsetString) {
      query.onsetString = onsetString;
    }
    if (severity) {
      if (severity.includes('|')) {
          let [ system, code2 ] = severity.split('|');
          // console.log(('' === system) + ' *** ' + value);
          if (system) {
              query['severity.coding.system'] = system;
          }
          if (code2) {
              query['severity.coding.code'] = code2;
          }
      }
      else {
          query['severity.coding.code'] = { $in: severity.split(',') };
      }
    }
    if (stage) {
      if (stage.includes('|')) {
          let [ system, code2 ] = stage.split('|');
          // console.log(('' === system) + ' *** ' + value);
          if (system) {
              query['stage.summary.coding.system'] = system;
          }
          if (code2) {
              query['stage.summary.coding.code'] = code2;
          }
      }
      else {
          query['stage.summary.coding.code'] = { $in: severity.split(',') };
      }
    }
    if (subject) {
      query['subject.reference'] = subject;
    }

    // Grab an instance of our DB and collection
    let db = globals.get(CLIENT_DB);
    let collection = db.collection(COLLECTION.CONDITION);

    collection.find(query, (err, conditions) => {
      if (err) {
        logger.error('Error with Condition.getCondition: ', err);
        return reject(err);
      }
      // Observations is a cursor, grab the documents from that
      conditions.toArray().then(resolve, reject);
    });
});

/**
 * @name getConditionById
 * @description Get a condition from our database
 * @param {Object} args - Any provided args
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
module.exports.getConditionById = (args, logger) => new Promise((resolve, reject) => {
    logger.info('Condition >>> getConditionById');
    // Parse the required params, these are validated by sanitizeMiddleware in core
    let { id } = args;
    // Grab an instance of our DB and collection
    let db = globals.get(CLIENT_DB);
    let collection = db.collection(COLLECTION.CONDITION);
    // Query our collection for this condition
    collection.findOne({ id: id.toString() }, (err, condition) => {
        if (err) {
            logger.error('Error with Condition.getConditionById: ', err);
            return reject(err);
        }
        resolve(condition);
    });
});

/**
 * @name createCondition
 * @description Create a condition
 * @param {Object} args - Any provided args
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
module.exports.createCondition = (args, logger) => new Promise((resolve, reject) => {
    logger.info('Condition >>> createCondition');
    let { id, resource } = args;
    // Grab an instance of our DB and collection
    let db = globals.get(CLIENT_DB);
    let collection = db.collection(COLLECTION.CONDITION);
    // If there is an id, use it, otherwise let mongo generate it
    let doc = Object.assign(resource.toJSON(), { _id: id });
    // Insert our condition record
    collection.insert(doc, (err, res) => {
        if (err) {
            logger.error('Error with Condition.createCondition: ', err);
            return reject(err);
        }
        // Grab the condition record so we can pass back the id
        let [ condition ] = res.ops;

        return resolve({ id: condition.id });
    });
});

/**
 * @name updateCondition
 * @description Update a condition
 * @param {Object} args - Any provided args
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
module.exports.updateCondition = (args, logger) => new Promise((resolve, reject) => {
    logger.info('Condition >>> updateCondition');
    let { id, resource } = args;
    // Grab an instance of our DB and collection
    let db = globals.get(CLIENT_DB);
    let collection = db.collection(COLLECTION.CONDITION);
    // Set the id of the resource
    let doc = Object.assign(resource.toJSON(), { _id: id });
    // Insert/update our condition record
    collection.findOneAndUpdate({ id: id }, doc, { upsert: true }, (err, res) => {
        if (err) {
            logger.error('Error with Condition.updateCondition: ', err);
            return reject(err);
        }
        // If we support versioning, which we do not at the moment,
        // we need to return a version
        return resolve({ id: res.value && res.value.id });
    });
});

/**
 * @name deleteCondition
 * @description Delete a condition
 * @param {Object} args - Any provided args
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
module.exports.deleteCondition = (args, logger) => new Promise((resolve, reject) => {
    logger.info('Condition >>> deleteCondition');
    let { id } = args;
    // Grab an instance of our DB and collection
    let db = globals.get(CLIENT_DB);
    let collection = db.collection(COLLECTION.CONDITION);
    // Delete our condition record
    collection.remove({ id: id }, (err, _) => {
        if (err) {
            logger.error('Error with Condition.deleteCondition');
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
