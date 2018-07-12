const { COLLECTION, CLIENT_DB } = require('../../constants');
const globals = require('../../globals');
const { stringQueryBuilder, tokenQueryBuilder, referenceQueryBuilder } = require('../../utils/service.utils');


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
    let { patient, deviceName, identifier, manufacturer, model, status, type,
        udiDi, url, location, udiCarrier, organization } = args;
    let query = {};
    let ors = [];

    // Find all given arguments that are involved in an or and wrap them in an and
    if (deviceName) {
        ors.push( {$or: [{'udi.name': stringQueryBuilder(deviceName)}, {'type.text': stringQueryBuilder(deviceName)},
                {'type.coding.display': stringQueryBuilder(deviceName)}]} );
    }
    if (udiCarrier) {
        ors.push( {$or: [{'udi.carrierHRF': stringQueryBuilder(udiCarrier)},
                {'udi.carrierAIDC': stringQueryBuilder(udiCarrier)}]} );
    }
    if (ors.length !== 0) {
        query.$and = ors;
    }

    if (patient) {
        let queryBuilder = referenceQueryBuilder(patient, 'patient.reference');
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

    if (location) {
        let queryBuilder = referenceQueryBuilder(location, 'location.reference');
        for (let i in queryBuilder) {
            query[i] = queryBuilder[i];
        }
    }

    if (manufacturer) {
        query.manufacturer = stringQueryBuilder(manufacturer);
    }

    if (model) {
        query.model = stringQueryBuilder(model);
    }

    if (status) {
        query.status = status;
    }

    if (type) {
        let queryBuilder = tokenQueryBuilder(type, 'code', 'type.coding', '');
        for (let i in queryBuilder) {
            query[i] = queryBuilder[i];
        }
    }

    if (udiDi) {
        query['udi.deviceIdentifier'] = stringQueryBuilder(udiDi);
    }

    if (url) {
        query.url = url;
    }

    if (organization) {
        let queryBuilder = referenceQueryBuilder(organization, 'owner.reference');
        for (let i in queryBuilder) {
            query[i] = queryBuilder[i];
        }
    }

    // console.log(JSON.stringify(query));

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
    collection.findOneAndUpdate({ id: id }, { $set: doc}, { upsert: true }, (err, res) => {
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
