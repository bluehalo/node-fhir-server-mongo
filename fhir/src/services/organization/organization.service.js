const { COLLECTION, CLIENT_DB } = require('../../constants');
const globals = require('../../globals');
const { stringQueryBuilder, tokenQueryBuilder } = require('../../utils/service.utils');

/**
 * @name count
 * @description Get the number of organizations in our database
 * @param {Object} args - Any provided args
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
module.exports.count = (args, logger) => new Promise((resolve, reject) => {
    logger.info('Organization >>> count');
    // Grab an instance of our DB and collection
    let db = globals.get(CLIENT_DB);
    let collection = db.collection(COLLECTION.ORGANIZATION);
    // Query all documents in this collection
    collection.count((err, count) => {
        if (err) {
            logger.error('Error with Organization.count: ', err);
            return reject(err);
        }
        return resolve(count);
    });
});

/**
 * @name search
 * @description Get search(s) from our database
 * @param {Object} args - Any provided args
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
module.exports.search = (args, logger) => new Promise((resolve, reject) => {
    logger.info('Organization >>> search');
    // Parse the params
    let { active, address, addressCity, addressCountry, addressPostalCode, addressState, addressUse, endpoint, identifier,
        name, partof, phonetic, type } = args;
    // console.log(JSON.stringify(args));

    // Patient and verificationStatus are required and guaranteed to be provided
    let query = {};

    if (active) {
        query.active = (active === 'true');
    }

    // How robust should this be and what is the input's format?
    // Expecting it to be comma separated like on a letter
    if (address) {
        console.log('Not implemented');
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
        query['endpoint.reference'] = `Endpoint/${endpoint}`;
    }

    if (identifier) {
        // if (identifier.includes('|')) {
        //     let [ system, value ] = identifier.split('|');
        //     if (system) {
        //         query['identifier.system'] = system;
        //     }
        //     if (value) {
        //         query['identifier.value'] = value;
        //     }
        // }
        // else {
        //     query['identifier.value'] = identifier;
        // }

        // tokens can come in more than one format
        //      Needs to handle query[identifier.system] and query[identifier.value]
        //      Can pass in query instead to avoid Object.assign but loose return value
        query = Object.assign(query, tokenQueryBuilder(identifier, 'value', 'identifier'));
    }

    if (name) {
        query.$or = [{name: stringQueryBuilder(name)}, {alias: stringQueryBuilder(name)}];
    }

    if (partof) {
        query['partOf.reference'] = `Organization/${partof}`;
    }

    if (phonetic) {
        console.log('Not implemented');
    }

    if (type) {
        // if (type.includes('|')) {
        //     let [ system, value ] = type.split('|');
        //     if (system) {
        //         query['type.coding.system'] = system;
        //     }
        //     if (value) {
        //         query['type.coding.code'] = value;
        //     }
        // }
        // else {
        //     query['type.coding.code'] = { $in: type.split(',') };
        // }

        query = Object.assign(query, tokenQueryBuilder(type, 'code', 'type.coding'));
    }

    // console.log(JSON.stringify(query));

    // Grab an instance of our DB and collection
    let db = globals.get(CLIENT_DB);
    let collection = db.collection(COLLECTION.ORGANIZATION);
    // Query our collection for this organization
    collection.find(query, (err, organizations) => {
        if (err) {
            logger.error('Error with Organization.search: ', err);
            return reject(err);
        }
        // Organizations is a cursor, grab the documents from that
        organizations.toArray().then(resolve, reject);
    });
});

/**
 * @name searchById
 * @description Get a organization by their unique identifier
 * @param {Object} args - Any provided args
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
module.exports.searchById = (args, logger) => new Promise((resolve, reject) => {
    logger.info('Organization >>> searchById');
    // Parse the required params, these are validated by sanitizeMiddleware in core
    let { id } = args;
    // Grab an instance of our DB and collection
    let db = globals.get(CLIENT_DB);
    let collection = db.collection(COLLECTION.ORGANIZATION);
    // Query our collection for this observation
    collection.findOne({ id: id.toString() }, (err, organization) => {
        if (err) {
            logger.error('Error with Organization.searchById: ', err);
            return reject(err);
        }
        resolve(organization);
    });
});

/**
 * @name create
 * @description Create a organization
 * @param {Object} args - Any provided args
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
module.exports.create = (args, logger) => new Promise((resolve, reject) => {
    logger.info('Organization >>> create');
    let { id, resource } = args;
    // Grab an instance of our DB and collection
    let db = globals.get(CLIENT_DB);
    let collection = db.collection(COLLECTION.ORGANIZATION);
    // If there is an id, use it, otherwise let mongo generate it
    let doc = Object.assign(resource.toJSON(), { _id: id });
    // Insert our organization record
    collection.insert(doc, (err, res) => {
        if (err) {
            logger.error('Error with Organization.create: ', err);
            return reject(err);
        }
        // Grab the organization record so we can pass back the id
        let [ organization ] = res.ops;

        return resolve({ id: organization.id });
    });
});

/**
 * @name update
 * @description Update a organization
 * @param {Object} args - Any provided args
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
module.exports.update = (args, logger) => new Promise((resolve, reject) => {
    logger.info('Organization >>> update');
    let { id, resource } = args;
    // Grab an instance of our DB and collection
    let db = globals.get(CLIENT_DB);
    let collection = db.collection(COLLECTION.ORGANIZATION);
    // Set the id of the resource
    let doc = Object.assign(resource.toJSON(), { _id: id });
    // Insert/update our organization record
    collection.findOneAndUpdate({ id: id }, doc, { upsert: true }, (err, res) => {
        if (err) {
            logger.error('Error with Organization.update: ', err);
            return reject(err);
        }
        // If we support versioning, which we do not at the moment,
        // we need to return a version
        return resolve({ id: res.value && res.value.id });
    });
});

/**
 * @name remove
 * @description Delete a organization
 * @param {Object} args - Any provided args
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
module.exports.remove = (args, logger) => new Promise((resolve, reject) => {
    logger.info('Organization >>> remove');
    let { id } = args;
    // Grab an instance of our DB and collection
    let db = globals.get(CLIENT_DB);
    let collection = db.collection(COLLECTION.ORGANIZATION);
    // Delete our organization record
    collection.remove({ id: id }, (err, _) => {
        if (err) {
            logger.error('Error with Organization.remove');
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
