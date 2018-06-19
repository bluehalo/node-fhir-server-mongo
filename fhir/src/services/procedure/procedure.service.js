const { COLLECTION, CLIENT_DB } = require('../../constants');
const globals = require('../../globals');

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
    let { patient, basedOn, category, status, code, context, date, definition, encounter,
    identifier, location, partOf, performer, subject } = args;
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
          query['code.coding.code'] = code;
      }
    }
    if (status) {
      query.status = status;
    }
    if (context) {
      query['context.reference'] = context;
    }
    if (date) {
      query.performedDateTime = date;
    }
    if (definition) {
      query['definition.reference'] = definition;
    }
    if (encounter) {
      query['context.reference'] = `Encounter/${encounter}`;
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
    if (location) {
      query['location.reference'] = location;
    }
    if (partOf) {
      query['partOf.reference'] = partOf;
    }
    if (performer) {
      query['performer.actor.reference'] = performer;
    }
    if (subject) {
      query['subject.reference'] = subject;
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
    collection.findOneAndUpdate({ id: id }, doc, { upsert: true }, (err, res) => {
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
