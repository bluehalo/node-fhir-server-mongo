const { COLLECTION, CLIENT_DB } = require('../../constants');
const globals = require('../../globals');
const { stringQueryBuilder, addressQueryBuilder, nameQueryBuilder } = require('../../utils/service.utils');


/**
 * @name count
 * @description Get the number of practitioners in our database
 * @param {Object} args - Any provided args
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
module.exports.count = (args, logger) => new Promise((resolve, reject) => {
    logger.info('Practitioner >>> count');
    // Grab an instance of our DB and collection
    let db = globals.get(CLIENT_DB);
    let collection = db.collection(COLLECTION.PRACTITIONER);
    // Query all documents in this collection
    collection.count((err, count) => {
        if (err) {
            logger.error('Error with Practitioner.count: ', err);
            return reject(err);
        }
        return resolve(count);
    });
});

/**
 * @name search
 * @description Get practitioner(s) from our database
 * @param {Object} args - Any provided args
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
module.exports.search = (args, logger) => new Promise((resolve, reject) => {
    logger.info('Practitioner >>> search');
    let { active, address, addressCity, addressCountry, addressPostalCode,
    addressState, addressUse, communication, email, family, gender, given, identifier,
  name, phone } = args;
//   let orArr = { name: [args.name, 'string', 'name.text', 'name.family', 'name.given', 'name.prefix', 'name.suffix'],
//   address: [args.address, 'string', 'address.district', 'address.line', 'address.city', 'address.state', 'address.country',
// 'address.postalCode', 'address.text']};
    let ors = [];
    let query = {
    };
    if (active) {
      query.active = active;
    }
    if (name) {
        let orsName = nameQueryBuilder(name);
        for (let i = 0; i < orsName.length; i++) {
            ors.push(orsName[i]);
        }
    }
    if (address) {
        let orsAddress = addressQueryBuilder(address);
        for (let i = 0; i < orsAddress.length; i++) {
            ors.push(orsAddress[i]);
        }
    }
    if (ors.length !== 0) {
      if (ors.length === 1) {
        ors.push(ors[0]);
      }
      query.$and = ors;
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
      query['address.use'] = stringQueryBuilder(addressUse);
    }
    if (communication) {
      if (communication.includes('|')) {
        let [ system, code2 ] = communication.split('|');
        // console.log(('' === system) + ' *** ' + value);
        if (system) {
          query['communication.coding.system'] = system;
        }
        if (code2) {
          query['communication.coding.code'] = code2;
        }
      }
      else {
        query['communication.coding.code'] = { $in: communication.split(',') };
      }
    }
    if (email) {
      query['telecom.system'] = 'email';
      query['telecom.value'] = email;
    }
    if (family) {
      query['name.family'] = stringQueryBuilder(family);
    }
    if (gender) {
      query.gender = gender;
    }
    if (given) {
      query['name.given'] = stringQueryBuilder(given);
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
    if (phone) {
      query['telecom.system'] = 'phone';
      query['telecom.value'] = phone;
    }


    // Grab an instance of our DB and collection
    let db = globals.get(CLIENT_DB);
    let collection = db.collection(COLLECTION.PRACTITIONER);

    collection.find(query, (err, practitioners) => {
        if (err) {
            logger.error('Error with Practitioner.search: ', err);
            return reject(err);
        }
        // Practitioners is a cursor, grab the documents from that
        practitioners.toArray().then(resolve, reject);
    });
});

/**
 * @name searchById
 * @description Get a practitioner from our database
 * @param {Object} args - Any provided args
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
module.exports.searchById = (args, logger) => new Promise((resolve, reject) => {
    logger.info('Practitioner >>> searchById');
    // Parse the required params, these are validated by sanitizeMiddleware in core
    let { id } = args;
    // Grab an instance of our DB and collection
    let db = globals.get(CLIENT_DB);
    let collection = db.collection(COLLECTION.PRACTITIONER);
    // Query our collection for this practitioner
    collection.findOne({ id: id.toString() }, (err, practitioner) => {
        if (err) {
            logger.error('Error with Practitioner.searchById: ', err);
            return reject(err);
        }
        resolve(practitioner);
    });
});

/**
 * @name create
 * @description Create a practitioner
 * @param {Object} args - Any provided args
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
module.exports.create = (args, logger) => new Promise((resolve, reject) => {
    logger.info('Practitioner >>> create');
    let { id, resource } = args;
    // Grab an instance of our DB and collection
    let db = globals.get(CLIENT_DB);
    let collection = db.collection(COLLECTION.PRACTITIONER);
    // If there is an id, use it, otherwise let mongo generate it
    let doc = Object.assign(resource.toJSON(), { _id: id });
    // Insert our practitioner record
    collection.insert(doc, (err, res) => {
        if (err) {
            logger.error('Error with Practitioner.create: ', err);
            return reject(err);
        }
        // Grab the practitioner record so we can pass back the id
        let [ practitioner ] = res.ops;

        return resolve({ id: practitioner.id });
    });
});

/**
 * @name update
 * @description Update a practitioner
 * @param {Object} args - Any provided args
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
module.exports.update = (args, logger) => new Promise((resolve, reject) => {
    logger.info('Practitioner >>> update');
    let { id, resource } = args;
    // Grab an instance of our DB and collection
    let db = globals.get(CLIENT_DB);
    let collection = db.collection(COLLECTION.PRACTITIONER);
    // Set the id of the resource
    let doc = Object.assign(resource.toJSON(), { _id: id });
    // Insert/update our practitioner record
    collection.findOneAndUpdate({ id: id }, doc, { upsert: true }, (err, res) => {
        if (err) {
            logger.error('Error with Practitioner.update: ', err);
            return reject(err);
        }
        // If we support versioning, which we do not at the moment,
        // we need to return a version
        return resolve({ id: res.value && res.value.id });
    });
});

/**
 * @name remove
 * @description Delete a practitioner
 * @param {Object} args - Any provided args
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
module.exports.remove = (args, logger) => new Promise((resolve, reject) => {
    logger.info('Practitioner >>> remove');
    let { id } = args;
    // Grab an instance of our DB and collection
    let db = globals.get(CLIENT_DB);
    let collection = db.collection(COLLECTION.PRACTITIONER);
    // Delete our practitioner record
    collection.remove({ id: id }, (err, _) => {
        if (err) {
            logger.error('Error with Practitioner.remove');
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
