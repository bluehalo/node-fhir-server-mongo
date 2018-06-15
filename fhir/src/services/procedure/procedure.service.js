const { COLLECTION, CLIENT_DB } = require('../../constants');
const globals = require('../../globals');

/**
 * @name getCount
 * @description Get the number of procedures in our database
 * @param {Object} args - Any provided args
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
module.exports.getCount = (args, logger) => new Promise((resolve, reject) => {
    logger.info('Procedure >>> getCount');
    // Grab an instance of our DB and collection
    let db = globals.get(CLIENT_DB);
    let collection = db.collection(COLLECTION.PROCEDURE);
    // Query all documents in this collection
    collection.count((err, count) => {
        if (err) {
            logger.error('Error with Procedure.getCount: ', err);
            return reject(err);
        }
        return resolve(count);
    });
});

/**
 * @name getProcedure
 * @description Get procedure(s) from our database
 * @param {Object} args - Any provided args
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
module.exports.getProcedure = (args, logger) => new Promise((resolve, reject) => {
    logger.info('Procedure >>> getProcedure');
    let { patient, basedOn, category, status, code } = args;
    let query = {
    };
    query['subject.reference'] = `Patient/${patient}`;
    if (basedOn) {
      query['basedOn.reference'] = basedOn;
    }
    if (category) {
      if (category.includes('|')) {
          let [ system, code2 ] = category.split('|');
          // console.log(('' === system) + ' *** ' + value);
          if (system) {
              query['category.coding.system'] = system;
          }
          if (code2) {
              query['category.coding.code'] = code2;
          }
      }
      else {
          query['category.coding.code'] = category;
      }
    }
    if (code) {
      if (code.includes('|')) {
          let [ system, code2 ] = code.split('|');
          // console.log(('' === system) + ' *** ' + value);
          if (system) {
              query['code.coding.system'] = system;
          }
          if (code2) {
              query['code.coding.code'] = code2;
          }
      }
      else {
          query['code.coding.code'] = category;
      }
    }
    if (status) {
      query.status = status;
    }
  // Grab an instance of our DB and collection
  let db = globals.get(CLIENT_DB);
  let collection = db.collection(COLLECTION.PROCEDURE);

  collection.find(query, (err, procedures) => {
    if (err) {
      logger.error('Error with Procedure.getProcedure: ', err);
      return reject(err);
    }
    // Observations is a cursor, grab the documents from that
    procedures.toArray().then(resolve, reject);
  });
});

/**
 * @name getProcedureById
 * @description Get a procedure from our database
 * @param {Object} args - Any provided args
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
module.exports.getProcedureById = (args, logger) => new Promise((resolve, reject) => {
    logger.info('Procedure >>> getProcedureById');
    // Parse the required params, these are validated by sanitizeMiddleware in core
    let { id } = args;
    // Grab an instance of our DB and collection
    let db = globals.get(CLIENT_DB);
    let collection = db.collection(COLLECTION.PROCEDURE);
    // Query our collection for this procedure
    collection.findOne({ id: id.toString() }, (err, procedure) => {
        if (err) {
            logger.error('Error with Procedure.getProcedureById: ', err);
            return reject(err);
        }
        resolve(procedure);
    });
});

/**
 * @name createProcedure
 * @description Create a procedure
 * @param {Object} args - Any provided args
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
module.exports.createProcedure = (args, logger) => new Promise((resolve, reject) => {
    logger.info('Procedure >>> createProcedure');
    let { id, resource } = args;
    // Grab an instance of our DB and collection
    let db = globals.get(CLIENT_DB);
    let collection = db.collection(COLLECTION.PROCEDURE);
    // If there is an id, use it, otherwise let mongo generate it
    let doc = Object.assign(resource.toJSON(), { _id: id });
    // Insert our procedure record
    collection.insert(doc, (err, res) => {
        if (err) {
            logger.error('Error with Procedure.createProcedure: ', err);
            return reject(err);
        }
        // Grab the procedure record so we can pass back the id
        let [ procedure ] = res.ops;

        return resolve({ id: procedure.id });
    });
});

/**
 * @name updateProcedure
 * @description Update a procedure
 * @param {Object} args - Any provided args
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
module.exports.updateProcedure = (args, logger) => new Promise((resolve, reject) => {
    logger.info('Procedure >>> updateProcedure');
    let { id, resource } = args;
    // Grab an instance of our DB and collection
    let db = globals.get(CLIENT_DB);
    let collection = db.collection(COLLECTION.PROCEDURE);
    // Set the id of the resource
    let doc = Object.assign(resource.toJSON(), { _id: id });
    // Insert/update our procedure record
    collection.findOneAndUpdate({ id: id }, doc, { upsert: true }, (err, res) => {
        if (err) {
            logger.error('Error with Procedure.updateProcedure: ', err);
            return reject(err);
        }
        // If we support versioning, which we do not at the moment,
        // we need to return a version
        return resolve({ id: res.value && res.value.id });
    });
});

/**
 * @name deleteProcedure
 * @description Delete a procedure
 * @param {Object} args - Any provided args
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
module.exports.deleteProcedure = (args, logger) => new Promise((resolve, reject) => {
    logger.info('Procedure >>> deleteProcedure');
    let { id } = args;
    // Grab an instance of our DB and collection
    let db = globals.get(CLIENT_DB);
    let collection = db.collection(COLLECTION.PROCEDURE);
    // Delete our procedure record
    collection.remove({ id: id }, (err, _) => {
        if (err) {
            logger.error('Error with Procedure.deleteProcedure');
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
