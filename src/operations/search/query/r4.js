const {
    dateQueryBuilder,
    referenceQueryBuilder,
    nameQueryBuilder,
    stringQueryBuilder,
    addressQueryBuilder,
    tokenQueryBuilder
} = require('../../../utils/querybuilder.util');
const {isTrue} = require('../../../utils/isTrue');

const {customReferenceQueries, customScalarQueries} = require('./customQueries');

// /**
//  * @type {import('winston').logger}
//  */
// const logger = require('@asymmetrik/node-fhir-server-core').loggers.get();

/**
 * Builds a mongo query for search parameters
 * @param {string} resourceName
 * @param {Object} args
 * @returns {{query:import('mongodb').Document, columns: Set}} A query object to use with Mongo
 */
module.exports.buildR4SearchQuery = (resourceName, args) => {
    // Common search params
    let id = args['id'] || args['_id'];
    // let patient = args['patient'];
    // let practitioner = args['practitioner'];
    // let organization = args['organization'];
    // let location = args['location'];
    // let healthcareService = args['healthcareService'];
    // let schedule = args['schedule'];
    // let agent = args['agent'];
    let name = args['name'];
    let family = args['family'];

    let address = args['address'];
    let address_city = args['address-city'];
    let address_country = args['address-country'];
    let addressPostalCode = args['address-postalcode'];
    let address_state = args['address-state'];

    let identifier = args['identifier'];
    let type_ = args['type'];

    let gender = args['gender'];
    let email = args['email'];
    let phone = args['phone'];
    let source = args['source'];
    let versionId = args['versionId'];
    let lastUpdated = args['_lastUpdated']; // _lastUpdated=gt2010-10-01
    let security = args['_security'];
    let tag = args['_tag'];
    // Search Result params

    // let extension_missing = args['extension:missing'];
    // extension:missing=true

    // Patient search params
    let active = args['active'];

    let query = {};

    /**
     * list of columns
     * @type {Set}
     */
    let columns = new Set();
    /**
     * and segments
     * @type {Object[]}
     */
    let and_segments = [];

    if (id) {
        if (Array.isArray(id)) {
            query.id = {
                $in: id
            };
        } else if (id.includes(',')) { // see if this is a comma separated list
            const id_list = id.split(',');
            query.id = {
                $in: id_list
            };
        } else {
            query.id = id;
        }
        columns.add('id');
    }
    if (args['id:above']) {
        query.id = {
            $gt: args['id:above']
        };
        columns.add('id');
    }

    if (args['id:below']) {
        query.id = {
            $lt: args['id:below']
        };
        columns.add('id');
    }

    if (source) {
        query['meta.source'] = source;
        columns.add('meta.source');
    }

    if (versionId) {
        query['meta.versionId'] = versionId;
        columns.add('meta.versionId');
    }

    if (lastUpdated) {
        if (Array.isArray(lastUpdated)) {
            for (const lastUpdatedItem of lastUpdated) {
                and_segments.push({'meta.lastUpdated': dateQueryBuilder(lastUpdatedItem, 'instant', '')});
            }
        } else {
            query['meta.lastUpdated'] = dateQueryBuilder(lastUpdated, 'instant', '');
        }
        columns.add('meta.lastUpdated');
    }

    for (const [resourceType, filterObj] of Object.entries(customScalarQueries)) {
        if (resourceType === resourceName) {
            for (const [property, propertyObj] of Object.entries(filterObj)) {
                if (args[`${property}`]) {
                    switch (propertyObj.type) {
                        case 'instant':
                            query[`${propertyObj.field}`] = dateQueryBuilder(args[`${property}`], 'instant', '');
                            break;
                        case 'uri':
                            query[`${propertyObj.field}`] = args[`${property}`];
                            break;
                    }
                    columns.add(`${propertyObj.field}`);
                }
            }
        }
    }

    for (const [field, filterObj] of Object.entries(customReferenceQueries)) {
        const resourceType = filterObj.resourceType;
        if (args[`${field}`] || args[`${field}:missing`]) {
            const reference = `${resourceType}/` + args[`${field}`];
            /**
             * @type {?boolean}
             */
            let reference_exists_flag = null;
            if (args[`${field}:missing`]) {
                reference_exists_flag = !isTrue(args[`${field}:missing`]);
            }
            for (const [resource, property] of Object.entries(filterObj.mappings)) {
                if ([`${resource}`].includes(resourceName)) {
                    if (property === 'id') {
                        columns.add('id');
                        query.id = args[`${field}`];
                    } else {
                        and_segments.push(referenceQueryBuilder(reference, property, reference_exists_flag));
                        columns.add(property);
                    }
                }
            }
        }
    }

    if (name) {
        if (['Practitioner'].includes(resourceName)) {
            if (name) {
                let orsName = nameQueryBuilder(name);
                for (let i = 0; i < orsName.length; i++) {
                    and_segments.push(orsName[`${i}`]);
                }
            }
        } else {
            query['name'] = stringQueryBuilder(name);
        }
        columns.add('name');
    }
    if (family) {
        query['name.family'] = stringQueryBuilder(family);
        columns.add('name.family');
    }

    if (address) {
        let orsAddress = addressQueryBuilder(address);
        for (let i = 0; i < orsAddress.length; i++) {
            and_segments.push(orsAddress[`${i}`]);
        }
        columns.add('address');
    }

    if (address_city) {
        query['address.city'] = stringQueryBuilder(address_city);
        columns.add('address.city');
    }

    if (address_country) {
        query['address.country'] = stringQueryBuilder(address_country);
        columns.add('address.country');
    }

    if (addressPostalCode) {
        query['address.postalCode'] = stringQueryBuilder(addressPostalCode);
        columns.add('address.postalCode');
    }

    if (address_state) {
        query['address.state'] = stringQueryBuilder(address_state);
        columns.add('address.state');
    }

    if (identifier || args['identifier:missing']) {
        let identifier_exists_flag = null;
        if (args['identifier:missing']) {
            identifier_exists_flag = !isTrue(args['identifier:missing']);
        }
        let queryBuilder = tokenQueryBuilder(identifier, 'value', 'identifier', '', identifier_exists_flag);
        /**
         * @type {string}
         */
        for (let i in queryBuilder) {
            query[`${i}`] = queryBuilder[`${i}`];
        }
        columns.add('identifier.system');
        columns.add('identifier.value');
    }
    if (type_) {
        let queryBuilder = tokenQueryBuilder(type_, 'code', 'type.coding', '');
        /**
         * @type {string}
         */
        for (let i in queryBuilder) {
            query[`${i}`] = queryBuilder[`${i}`];
        }
        columns.add('type.coding.system');
        columns.add('type.coding.code');
    }
    if (security) {
        let queryBuilder = tokenQueryBuilder(security, 'code', 'meta.security', '');
        /**
         * @type {string}
         */
        for (let i in queryBuilder) {
            query[`${i}`] = queryBuilder[`${i}`];
        }
        columns.add('meta.security.system');
        columns.add('meta.security.code');
    }
    if (tag) {
        let queryBuilder = tokenQueryBuilder(tag, 'code', 'meta.tag', '');
        /**
         * @type {string}
         */
        for (let i in queryBuilder) {
            query[`${i}`] = queryBuilder[`${i}`];
        }
        columns.add('meta.tag.system');
        columns.add('meta.tag.code');
    }
    if (active) {
        query.active = active === 'true';
        columns.add('active');
    }

    if (gender) {
        query.gender = gender;
        columns.add('gender');
    }

    // Forces system = 'email'
    if (email) {
        let queryBuilder = tokenQueryBuilder(email, 'value', 'telecom', 'email');
        for (let i in queryBuilder) {
            query[`${i}`] = queryBuilder[`${i}`];
        }
        columns.add('telecom.system');
        columns.add('telecom.value');
    }

    // Forces system = 'phone'
    if (phone) {
        let queryBuilder = tokenQueryBuilder(phone, 'value', 'telecom', 'phone');
        for (let i in queryBuilder) {
            query[`${i}`] = queryBuilder[`${i}`];
        }
        columns.add('telecom.system');
        columns.add('telecom.value');
    }

    if (and_segments.length !== 0) {
        query.$and = and_segments;
    }

    return {
        query: query,
        columns: columns
    };
}
;
