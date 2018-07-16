const { COLLECTION, CLIENT_DB } = require('../../constants');
const globals = require('../../globals');
const { tokenQueryBuilder, referenceQueryBuilder } = require('../../utils/service.utils');


/**
 * @name count
 * @description Get the number of medications in our database
 * @param {Object} args - Any provided args
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
module.exports.count = (args, logger) => new Promise((resolve, reject) => {
    logger.info('Medication >>> count');
    // Grab an instance of our DB and collection
    let db = globals.get(CLIENT_DB);
    let collection = db.collection(COLLECTION.MEDICATION);
    // Query all documents in this collection
    collection.count((err, count) => {
        if (err) {
            logger.error('Error with Medication.count: ', err);
            return reject(err);
        }
        return resolve(count);
    });
});

/**
 * @name search
 * @description Get medication(s) from our database
 * @param {Object} args - Any provided args
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
module.exports.search = (args, logger) => new Promise((resolve, reject) => {
    logger.info('Medication >>> search');
    let { code, container, form, ingredient, ingredientCode, manufacturer, overTheCounter,
    packageItem, packageItemCode, status } = args;
    let query = {};

    if (code) {
      let queryBuilder = tokenQueryBuilder(code, 'code', 'code.coding', '');
      for (let i in queryBuilder) {
          query[i] = queryBuilder[i];
      }
    }
    if (container) {
      let queryBuilder = tokenQueryBuilder(container, 'code', 'package.container.coding', '');
      for (let i in queryBuilder) {
          query[i] = queryBuilder[i];
      }
    }
    if (form) {
      let queryBuilder = tokenQueryBuilder(form, 'code', 'form.coding', '');
      for (let i in queryBuilder) {
          query[i] = queryBuilder[i];
      }
    }
    if (ingredient) {
      let queryBuilder = referenceQueryBuilder(ingredient, 'ingredient.itemReference.reference');
      for (let i in queryBuilder) {
          query[i] = queryBuilder[i];
      }
    }
    if (ingredientCode) {
      let queryBuilder = tokenQueryBuilder(ingredientCode, 'code', 'ingredient.itemCodeableConcept.coding', '');
      for (let i in queryBuilder) {
          query[i] = queryBuilder[i];
      }
    }
    if (manufacturer) {
      let queryBuilder = referenceQueryBuilder(manufacturer, 'manufacturer.reference');
      for (let i in queryBuilder) {
          query[i] = queryBuilder[i];
      }
    }
    if (overTheCounter) {
      query.isOverTheCounter = (overTheCounter === 'true');
    }
    if (packageItem) {
      let queryBuilder = referenceQueryBuilder(packageItem, 'package.content.itemReference.reference');
      for (let i in queryBuilder) {
          query[i] = queryBuilder[i];
      }
    }
    if (packageItemCode) {
      let queryBuilder = tokenQueryBuilder(packageItemCode, 'code', 'package.content.itemCodeableConcept.coding', '');
      for (let i in queryBuilder) {
          query[i] = queryBuilder[i];
      }
    }
    if (status) {
      query.status = status;
    }

    // Grab an instance of our DB and collection
    let db = globals.get(CLIENT_DB);
    let collection = db.collection(COLLECTION.MEDICATION);

    collection.find(query, (err, medications) => {
        if (err) {
            logger.error('Error with medication.search: ', err);
            return reject(err);
        }
        // medications is a cursor, grab the documents from that
        medications.toArray().then(resolve, reject);
    });
});

/**
 * @name searchById
 * @description Get a medication from our database
 * @param {Object} args - Any provided args
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
module.exports.searchById = (args, logger) => new Promise((resolve, reject) => {
    logger.info('Medication >>> searchById');
    // Parse the required params, these are validated by sanitizeMiddleware in core
    let { id } = args;
    // Grab an instance of our DB and collection
    let db = globals.get(CLIENT_DB);
    let collection = db.collection(COLLECTION.MEDICATION);
    // Query our collection for this medication
    collection.findOne({ id: id.toString() }, (err, medication) => {
        if (err) {
            logger.error('Error with Medication.searchById: ', err);
            return reject(err);
        }
        resolve(medication);
    });
});

/**
 * @name create
 * @description Create a medication
 * @param {Object} args - Any provided args
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
module.exports.create = (args, logger) => new Promise((resolve, reject) => {
    logger.info('Medication >>> create');
    let { id, resource } = args;
    // Grab an instance of our DB and collection
    let db = globals.get(CLIENT_DB);
    let collection = db.collection(COLLECTION.MEDICATION);
    // If there is an id, use it, otherwise let mongo generate it
    let doc = Object.assign(resource.toJSON(), { _id: id });
    // Insert our medication record
    collection.insert(doc, (err, res) => {
        if (err) {
            logger.error('Error with Medication.create: ', err);
            return reject(err);
        }
        // Grab the medication record so we can pass back the id
        let [ medication ] = res.ops;

        return resolve({ id: medication.id });
    });
});

/**
 * @name update
 * @description Update a medication
 * @param {Object} args - Any provided args
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
module.exports.update = (args, logger) => new Promise((resolve, reject) => {
    logger.info('Medication >>> update');
    let { id, resource } = args;
    // Grab an instance of our DB and collection
    let db = globals.get(CLIENT_DB);
    let collection = db.collection(COLLECTION.MEDICATION);
    // Set the id of the resource
    let doc = Object.assign(resource.toJSON(), { _id: id });
    // Insert/update our medication record
    collection.findOneAndUpdate({ id: id }, { $set: doc}, { upsert: true }, (err, res) => {
        if (err) {
            logger.error('Error with Medication.update: ', err);
            return reject(err);
        }
        // If we support versioning, which we do not at the moment,
        // we need to return a version
        return resolve({ id: res.value && res.value.id });
    });
});

/**
 * @name remove
 * @description Delete a medication
 * @param {Object} args - Any provided args
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
module.exports.remove = (args, logger) => new Promise((resolve, reject) => {
    logger.info('Medication >>> remove');
    let { id } = args;
    // Grab an instance of our DB and collection
    let db = globals.get(CLIENT_DB);
    let collection = db.collection(COLLECTION.MEDICATION);
    // Delete our medication record
    collection.remove({ id: id }, (err, _) => {
        if (err) {
            logger.error('Error with Medication.remove');
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
