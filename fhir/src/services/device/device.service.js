const { COLLECTION, CLIENT_DB } = require('../../constants');
const globals = require('../../globals');
const { stringQueryBuilder, referenceQueryBuilder } = require('../../utils/service.utils');


/**
 * @name count
 * @description Get the number of devices in our database
 * @param {Object} args - Any provided args
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
module.exports.count = (args, logger) => new Promise((resolve, reject) => {
    logger.info('Device >>> count');
    // Grab an instance of our DB and collection
    let db = globals.get(CLIENT_DB);
    let collection = db.collection(COLLECTION.DEVICE);
    // Query all documents in this collection
    collection.count((err, count) => {
        if (err) {
            logger.error('Error with Device.count: ', err);
            return reject(err);
        }
        return resolve(count);
    });
});

/**
 * @name search
 * @description Get device(s) from our database
 * @param {Object} args - Any provided args
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
module.exports.search = (args, logger) => new Promise((resolve, reject) => {
  logger.info('Device >>> search');
  let { patient, name, identifier, manufacturer, model, status, type,
  deviceIdentifier, url } = args;
  let query = {
  };
  query['patient.reference'] = `Patient/${patient}`;
  if (name) { //NOT DONE - must work around the two other things name could be
    query.$or = [ {'udi.name': stringQueryBuilder(name)}, {'type.text': stringQueryBuilder(name)},
      {'type.coding.display': stringQueryBuilder(name)} ];
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
  //SKIPPED LOCATION
  if (manufacturer) { //probably should use stringQueryBuilder
    query.manufacturer = manufacturer;
  }
  if (model) { //probably should use stringQueryBuilder
    query.model = model;
  }
  if (status) {
    query.status = status;
  }
  if (type) {
      if (type.includes('|')) {
          let [ system, code2 ] = type.split('|');
          // console.log(('' === system) + ' *** ' + value);
          if (system) {
              query['type.coding.system'] = system;
          }
          if (code2) {
              query['type.coding.code'] = code2;
          }
      }
      else {
          query['type.coding.code'] = { $in: type.split(',') };
      }
  }
  //SKIPPED UDICARRIER
  if (deviceIdentifier) { //probably should use stringQueryBuilder
    query['udi.deviceIdentifier'] = deviceIdentifier;
  }
  if (url) {
    query.url = url;
  }

  // Grab an instance of our DB and collection
  let db = globals.get(CLIENT_DB);
  let collection = db.collection(COLLECTION.DEVICE);

  collection.find(query, (err, devices) => {
    if (err) {
      logger.error('Error with device.search: ', err);
      return reject(err);
    }
    // devices is a cursor, grab the documents from that
    devices.toArray().then(resolve, reject);
  });
});

/**
 * @name searchById
 * @description Get a device by their unique identifier
 * @param {Object} args - Any provided args
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
module.exports.searchById = (args, logger) => new Promise((resolve, reject) => {
    logger.info('Device >>> searchById');
    // Parse the required params, these are validated by sanitizeMiddleware in core
    let { id } = args;
    // Grab an instance of our DB and collection
    let db = globals.get(CLIENT_DB);
    let collection = db.collection(COLLECTION.DEVICE);
    // Query our collection for this observation
    collection.findOne({ id: id.toString() }, (err, device) => {
        if (err) {
            logger.error('Error with Device.searchById: ', err);
            return reject(err);
        }
        resolve(device);
    });
});

/**
 * @name create
 * @description Create a device
 * @param {Object} args - Any provided args
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
module.exports.create = (args, logger) => new Promise((resolve, reject) => {
    logger.info('Device >>> create');
    let { id, resource } = args;
    // Grab an instance of our DB and collection
    let db = globals.get(CLIENT_DB);
    let collection = db.collection(COLLECTION.DEVICE);
    // If there is an id, use it, otherwise let mongo generate it
    let doc = Object.assign(resource.toJSON(), { _id: id });
    // Insert our device record
    collection.insert(doc, (err, res) => {
        if (err) {
            logger.error('Error with Device.create: ', err);
            return reject(err);
        }
        // Grab the device record so we can pass back the id
        let [ device ] = res.ops;

        return resolve({ id: device.id });
    });
});

/**
 * @name update
 * @description Update a device
 * @param {Object} args - Any provided args
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
module.exports.update = (args, logger) => new Promise((resolve, reject) => {
    logger.info('Device >>> update');
    let { id, resource } = args;
    // Grab an instance of our DB and collection
    let db = globals.get(CLIENT_DB);
    let collection = db.collection(COLLECTION.DEVICE);
    // Set the id of the resource
    let doc = Object.assign(resource.toJSON(), { _id: id });
    // Insert/update our device record
    collection.findOneAndUpdate({ id: id }, doc, { upsert: true }, (err, res) => {
        if (err) {
            logger.error('Error with Device.update: ', err);
            return reject(err);
        }
        // If we support versioning, which we do not at the moment,
        // we need to return a version
        return resolve({ id: res.value && res.value.id });
    });
});

/**
 * @name remove
 * @description Delete a device
 * @param {Object} args - Any provided args
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
module.exports.remove = (args, logger) => new Promise((resolve, reject) => {
    logger.info('Device >>> remove');
    let { id } = args;
    // Grab an instance of our DB and collection
    let db = globals.get(CLIENT_DB);
    let collection = db.collection(COLLECTION.DEVICE);
    // Delete our device record
    collection.remove({ id: id }, (err, _) => {
        if (err) {
            logger.error('Error with Device.remove');
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
