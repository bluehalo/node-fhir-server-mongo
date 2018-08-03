const { COLLECTION, CLIENT_DB } = require('../../constants');
const globals = require('../../globals');
const FHIRServer = require('@asymmetrik/node-fhir-server-core');

const { stringQueryBuilder, tokenQueryBuilder, referenceQueryBuilder, addressQueryBuilder } = require('../../utils/service.utils');

/**
 * @description Construct a resource with base/uscore path
 */
let getOrganization = (base) => {
	return require(FHIRServer.resolveFromVersion(base, 'Organization'));
};

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
 * @param {Object} contexts - Any provided contexts
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
module.exports.search = (args, logger) => new Promise((resolve, reject) => {
    logger.info('Organization >>> search');
    // Parse the params
    let { base, _id, active, address, addressCity, addressCountry, addressPostalCode, addressState, addressUse, endpoint, identifier,
        name, partof, phonetic, type } = args;
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

    if (active) {
        query.active = (active === 'true');
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
        let queryBuilder = tokenQueryBuilder(identifier, 'value', 'identifier', '');
        for (let i in queryBuilder) {
            query[i] = queryBuilder[i];
        }
    }

    if (partof) {
        let queryBuilder = referenceQueryBuilder(partof, 'partOf.reference');
        for (let i in queryBuilder) {
            query[i] = queryBuilder[i];
        }
    }

    if (phonetic) {
        console.log('Not implemented');
    }

    if (type) {
        let queryBuilder = tokenQueryBuilder(type, 'code', 'type.coding', '');
        for (let i in queryBuilder) {
            query[i] = queryBuilder[i];
        }
    }

    // console.log(JSON.stringify(query));

    // Grab an instance of our DB and collection
    let db = globals.get(CLIENT_DB);
    let collection = db.collection(COLLECTION.ORGANIZATION);

    let Organization = getOrganization(base);

	// Query our collection for this observation
	collection.find(query, (err, data) => {
		if (err) {
			logger.error('Error with Patient.search: ', err);
			return reject(err);
		}
		// Patient is a patient cursor, pull documents out before resolving
		data.toArray().then((organizations) => {
			organizations.forEach(function(element, i, returnArray) {
				returnArray[i] = new Organization(element);
            });
			resolve(organizations);
		});
	});
});

/**
 * @name searchById
 * @description Get a organization by their unique identifier
 * @param {Object} args - Any provided args
 * @param {Object} contexts - Any provided contexts
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
module.exports.searchById = (args, logger) => new Promise((resolve, reject) => {
    logger.info('Organization >>> searchById');
    // Parse the required params, these are validated by sanitizeMiddleware in core
    let { id, base } = args;

	let Observation = getOrganization(base);
    // Grab an instance of our DB and collection
    let db = globals.get(CLIENT_DB);
    let collection = db.collection(COLLECTION.ORGANIZATION);
    // Query our collection for this observation
    collection.findOne({ id: id.toString() }, (err, organization) => {
        if (err) {
            logger.error('Error with Organization.searchById: ', err);
            return reject(err);
        }

        if (organization) {
			resolve(new Observation(organization));
		}

		resolve();
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

    let cleaned = JSON.parse(JSON.stringify(resource));

    // Set the id of the resource
    let doc = Object.assign(cleaned, { _id: id });

    // Insert/update our organization record
    collection.findOneAndUpdate({ id: id }, { $set: doc}, { upsert: true }, (err, res) => {
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
