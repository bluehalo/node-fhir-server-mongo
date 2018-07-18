const { COLLECTION, CLIENT_DB } = require('../../constants');
const globals = require('../../globals');
const { stringQueryBuilder, tokenQueryBuilder, addressQueryBuilder, referenceQueryBuilder } = require('../../utils/service.utils');

/**
 * @name count
 * @description Get the number of locations in our database
 * @param {Object} args - Any provided args
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
module.exports.count = (args, logger) => new Promise((resolve, reject) => {
    logger.info('Location >>> count');
    // Grab an instance of our DB and collection
    let db = globals.get(CLIENT_DB);
    let collection = db.collection(COLLECTION.LOCATION);
    // Query all documents in this collection
    collection.count((err, count) => {
        if (err) {
            logger.error('Error with Location.count: ', err);
            return reject(err);
        }
        return resolve(count);
    });
});

/**
 * @name search
 * @description Get location(s) from our database
 * @param {Object} args - Any provided args
 * @param {Object} contexts - Any provided contexts
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
// To be implemented: address, near, and nearDistance
module.exports.search = (args, contexts, logger) => new Promise((resolve, reject) => {
    logger.info('Location >>> search');
    // Parse the params
    let { _id, address, addressCity, addressCountry, addressPostalCode, addressState, addressUse, endpoint, identifier,
        name, near, nearDistance, operationalStatus, organization, partof, status, type } = args;

    // console.log(JSON.stringify(args));

    let query = {};
    let ors = [];

    // Handle all arguments that have or logic
    if (address) {
        let orsAddress = addressQueryBuilder(address);
        for (let i = 0; i < orsAddress.length; i++) {
            ors.push(orsAddress[i]);
        }
    }
    if (name) {
        ors.push({$or: [{name: stringQueryBuilder(name)}, {alias: stringQueryBuilder(name)}]});
    }
    if (ors.length !== 0) {
        query.$and = ors;
    }

    if (_id) {
        query.id = _id;
    }

    if (addressCity) {
        query['address.city'] = stringQueryBuilder(addressCity);
    }

    if (addressCountry) {
        query['address.country'] = stringQueryBuilder(addressCountry);
    }

    if (addressPostalCode) {
        query['address.postalCode'] = stringQueryBuilder(addressPostalCode);
    }

    if (addressState) {
        query['address.state'] = stringQueryBuilder(addressState);
    }

    if (addressUse) {
        query['address.use'] = addressUse;
    }

    if (endpoint) {
        let queryBuilder = referenceQueryBuilder(endpoint, 'endpoint.reference');
        for (let i in queryBuilder) {
            query[i] = queryBuilder[i];
        }
    }

    if (identifier) {
        query = Object.assign(query, tokenQueryBuilder(identifier, 'value', 'identifier', ''));
    }

    // Not sure how to implement?
    // Both need to be provided
    if (near && nearDistance) {
        console.log('Not implemented');
    }

    if (operationalStatus) {
        query = Object.assign(query, tokenQueryBuilder(operationalStatus, 'code', 'operationalStatus', ''));
    }

    if (organization) {
        let queryBuilder = referenceQueryBuilder(organization, 'managingOrganization.reference');
        for (let i in queryBuilder) {
            query[i] = queryBuilder[i];
        }
    }

    if (partof) {
        query['partOf.reference'] = `Location/${partof}`;
    }

    if (status) {
        query.status = status;
    }

    if (type) {
        query = Object.assign(query, tokenQueryBuilder(type, 'code', 'type.coding', ''));
    }

    // console.log(JSON.stringify(query));

    // Grab an instance of our DB and collection
    let db = globals.get(CLIENT_DB);
    let collection = db.collection(COLLECTION.LOCATION);
    // Query our collection for this location
    collection.find(query, (err, locations) => {
        if (err) {
            logger.error('Error with Location.search: ', err);
            return reject(err);
        }
        // Locations is a cursor, grab the documents from that
        locations.toArray().then(resolve, reject);
    });
});

/**
 * @name searchById
 * @description Get a location from our database
 * @param {Object} args - Any provided args
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
module.exports.searchById = (args, logger) => new Promise((resolve, reject) => {
    logger.info('Location >>> searchById');
    // Parse the required params, these are validated by sanitizeMiddleware in core
    let { id } = args;
    // Grab an instance of our DB and collection
    let db = globals.get(CLIENT_DB);
    let collection = db.collection(COLLECTION.LOCATION);
    // Query our collection for this location
    collection.findOne({ id: id.toString() }, (err, location) => {
        if (err) {
            logger.error('Error with Location.searchById: ', err);
            return reject(err);
        }
        resolve(location);
    });
});

/**
 * @name create
 * @description Create a location
 * @param {Object} args - Any provided args
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
module.exports.create = (args, logger) => new Promise((resolve, reject) => {
    logger.info('Location >>> create');
    let { id, resource } = args;
    // Grab an instance of our DB and collection
    let db = globals.get(CLIENT_DB);
    let collection = db.collection(COLLECTION.LOCATION);
    // If there is an id, use it, otherwise let mongo generate it
    let doc = Object.assign(resource.toJSON(), { _id: id });
    // Insert our location record
    collection.insert(doc, (err, res) => {
        if (err) {
            logger.error('Error with Location.create: ', err);
            return reject(err);
        }
        // Grab the location record so we can pass back the id
        let [ location ] = res.ops;

        return resolve({ id: location.id });
    });
});

/**
 * @name update
 * @description Update a location
 * @param {Object} args - Any provided args
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
module.exports.update = (args, logger) => new Promise((resolve, reject) => {
    logger.info('Location >>> update');
    let { id, resource } = args;
    // Grab an instance of our DB and collection
    let db = globals.get(CLIENT_DB);
    let collection = db.collection(COLLECTION.LOCATION);
    // Set the id of the resource
    let doc = Object.assign(resource.toJSON(), { _id: id });
    // Insert/update our location record
    collection.findOneAndUpdate({ id: id }, { $set: doc}, { upsert: true }, (err, res) => {
        if (err) {
            logger.error('Error with Location.update: ', err);
            return reject(err);
        }
        // If we support versioning, which we do not at the moment,
        // we need to return a version
        return resolve({ id: res.value && res.value.id });
    });
});

/**
 * @name remove
 * @description Delete a location
 * @param {Object} args - Any provided args
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
module.exports.remove = (args, logger) => new Promise((resolve, reject) => {
    logger.info('Location >>> remove');
    let { id } = args;
    // Grab an instance of our DB and collection
    let db = globals.get(CLIENT_DB);
    let collection = db.collection(COLLECTION.LOCATION);
    // Delete our location record
    collection.remove({ id: id }, (err, _) => {
        if (err) {
            logger.error('Error with Location.remove');
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
