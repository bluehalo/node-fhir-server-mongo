/*eslint no-unused-vars: "warn"*/

const { RESOURCES, VERSIONS } = require('@asymmetrik/node-fhir-server-core').constants;
const { COLLECTION, CLIENT_DB } = require('../../constants');
const FHIRServer = require('@asymmetrik/node-fhir-server-core');
const moment = require('moment-timezone');
const globals = require('../../globals');

const { stringQueryBuilder,
	tokenQueryBuilder,
	referenceQueryBuilder,
	addressQueryBuilder } = require('../../utils/querybuilder.util');

let getOrganization = (base_version) => {
	return require(FHIRServer.resolveFromVersion(base_version, RESOURCES.ORGANIZATION));
};

let getMeta = (base_version) => {
	return require(FHIRServer.resolveFromVersion(base_version, 'Meta'));
};

let buildStu3SearchQuery = (args) =>	 {

	// Common search params
	let { _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } = args;

	// Search Result params
	let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } = args;

	// Resource Specific params
	let active = args['active'];
	let address = args['address'];
	let address_city = args['address-city'];
	let address_country = args['address-country'];
	let address_postalcode = args['address-postalcode'];
	let address_state = args['address-state'];
	let address_use = args['address-use'];
	let endpoint = args['endpoint'];
	let identifier = args['identifier'];
	let name = args['name'];
	let partof = args['partof'];
	let phonetic = args['phonetic'];
	let type = args['type'];

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

	if (address_city) {
		query['address.city'] = stringQueryBuilder(address_city);
	}

	if (address_country) {
		query['address.country'] = stringQueryBuilder(address_country);
	}

	if (address_postalcode) {
		query['address.postalCode'] = stringQueryBuilder(address_postalcode);
	}

	if (address_state) {
		query['address.state'] = stringQueryBuilder(address_state);
	}

	if (address_use) {
		query['address.use'] = address_use;
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

	return query;

};

let buildDstu2SearchQuery = (args) =>	 {

	// Common search params
	let { _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } = args;

	// Search Result params
	let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } = args;

	// Resource Specific params
	let active = args['active'];
	let address = args['address'];
	let address_city = args['address-city'];
	let address_country = args['address-country'];
	let address_postalcode = args['address-postalcode'];
	let address_state = args['address-state'];
	let address_use = args['address-use'];
	let identifier = args['identifier'];
	let name = args['name'];
	let partof = args['partof'];
	let phonetic = args['phonetic'];
	let type = args['type'];

	let query = {};
	let ors = [];

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

	if (address_city) {
		query['address.city'] = stringQueryBuilder(address_city);
	}

	if (address_country) {
		query['address.country'] = stringQueryBuilder(address_country);
	}

	if (address_postalcode) {
		query['address.postalCode'] = stringQueryBuilder(address_postalcode);
	}

	if (address_state) {
		query['address.state'] = stringQueryBuilder(address_state);
	}

	if (address_use) {
		query['address.use'] = address_use;
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

	return query;
};

/**
 *
 * @param {*} args
 * @param {*} context
 * @param {*} logger
 */
module.exports.search = (args, context, logger) => new Promise((resolve, reject) => {
	logger.info('Organization >>> search');

	let { base_version } = args;
	let query = {};

	if (base_version === VERSIONS['3_0_1']) {
		query = buildStu3SearchQuery(args);
	} else if (base_version === VERSIONS['1_0_2']) {
		query = buildDstu2SearchQuery(args);
	}

	// Grab an instance of our DB and collection
	let db = globals.get(CLIENT_DB);
	let collection = db.collection(`${COLLECTION.ORGANIZATION}_${base_version}`);
	let Organization = getOrganization(base_version);

	// Query our collection for this observation
	collection.find(query, (err, data) => {
		if (err) {
			logger.error('Error with Organization.search: ', err);
			return reject(err);
		}

		// Organization is a organization cursor, pull documents out before resolving
		data.toArray().then((organizations) => {
			organizations.forEach(function(element, i, returnArray) {
				returnArray[i] = new Organization(element);
			});
			resolve(organizations);
		});
	});
});

module.exports.searchById = (args, context, logger) => new Promise((resolve, reject) => {
	logger.info('Organization >>> searchById');

	let { base_version, id } = args;
	let Organization = getOrganization(base_version);

	// Grab an instance of our DB and collection
	let db = globals.get(CLIENT_DB);
	let collection = db.collection(`${COLLECTION.ORGANIZATION}_${base_version}`);
	// Query our collection for this observation
	collection.findOne({ id: id.toString() }, (err, organization) => {
		if (err) {
			logger.error('Error with Organization.searchById: ', err);
			return reject(err);
		}
		if (organization) {
			resolve(new Organization(organization));
		}
		resolve();
	});
});

module.exports.create = (args, context, logger) => new Promise((resolve, reject) => {
	logger.info('Organization >>> create');

	let { base_version, id, resource } = args;

	// Grab an instance of our DB and collection
	let db = globals.get(CLIENT_DB);
	let collection = db.collection(`${COLLECTION.ORGANIZATION}_${base_version}`);

	// get current record
	let Organization = getOrganization(base_version);
	let organization = new Organization(resource);

	let Meta = getMeta(base_version);
	organization.meta = new Meta({versionId: '1', lastUpdated: moment.utc().format('YYYY-MM-DDTHH:mm:ssZ')});

	let cleaned = JSON.parse(JSON.stringify(organization.toJSON()));
	let doc = Object.assign(cleaned, { _id: id });

	// Insert/update our organization record
	collection.insertOne({ id: id }, { $set: doc }, { upsert: true }, (err2, res) => {
		if (err2) {
			logger.error('Error with Organization.create: ', err2);
			return reject(err2);
		}

		// save to history
		let history_collection = db.collection(`${COLLECTION.ORGANIZATION}_${base_version}_History`);

		let history_organization = Object.assign(cleaned, { _id: id + cleaned.meta.versionId });

		// Insert our organization record to history but don't assign _id
		return history_collection.insertOne(history_organization, (err3) => {
			if (err3) {
				logger.error('Error with OrganizationHistory.create: ', err3);
				return reject(err3);
			}

			return resolve({ id: res.value && res.value.id, created: res.lastErrorObject && !res.lastErrorObject.updatedExisting, resource_version: doc.meta.versionId });
		});

	});
	// Return Id
});

module.exports.update = (args, context, logger) => new Promise((resolve, reject) => {
	logger.info('Organization >>> update');

	let { base_version, id, resource } = args;

	// Grab an instance of our DB and collection
	let db = globals.get(CLIENT_DB);
	let collection = db.collection(`${COLLECTION.ORGANIZATION}_${base_version}`);

	// get current record
	// Query our collection for this observation
	collection.findOne({ id: id.toString() }, (err, data) => {
		if (err) {
			logger.error('Error with Organization.searchById: ', err);
			return reject(err);
		}

		let Organization = getOrganization(base_version);
		let organization = new Organization(resource);

		if (data && data.meta) {
			let foundOrganization = new Organization(data);
			let meta = foundOrganization.meta;
			meta.versionId = `${parseInt(foundOrganization.meta.versionId) + 1}`;
			organization.meta = meta;
		} else {
			let Meta = getMeta(base_version);
			organization.meta = new Meta({versionId: '1', lastUpdated: moment.utc().format('YYYY-MM-DDTHH:mm:ssZ')});
		}

		let cleaned = JSON.parse(JSON.stringify(organization));
		let doc = Object.assign(cleaned, { _id: id });

		// Insert/update our organization record
		collection.findOneAndUpdate({ id: id }, { $set: doc }, { upsert: true }, (err2, res) => {
			if (err2) {
				logger.error('Error with Organization.update: ', err2);
				return reject(err2);
			}

			// save to history
			let history_collection = db.collection(`${COLLECTION.ORGANIZATION}_${base_version}_History`);

			let history_organization = Object.assign(cleaned, { _id: id + cleaned.meta.versionId });

			// Insert our organization record to history but don't assign _id
			return history_collection.insertOne(history_organization, (err3) => {
				if (err3) {
					logger.error('Error with OrganizationHistory.create: ', err3);
					return reject(err3);
				}

				return resolve({ id: res.value && res.value.id, created: res.lastErrorObject && !res.lastErrorObject.updatedExisting, resource_version: doc.meta.versionId });
			});

		});
	});
});

module.exports.remove = (args, context, logger) => new Promise((resolve, reject) => {
	logger.info('Organization >>> remove');

	let { base_version, id } = args;

	// Grab an instance of our DB and collection
	let db = globals.get(CLIENT_DB);
	let collection = db.collection(`${COLLECTION.ORGANIZATION}_${base_version}`);
	// Delete our organization record
	collection.deleteOne({ id: id }, (err, _) => {
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

		// delete history as well.  You can chose to save history.  Up to you
		let history_collection = db.collection(`${COLLECTION.ORGANIZATION}_${base_version}_History`);
		return history_collection.deleteMany({ id: id }, (err2) => {
			if (err2) {
				logger.error('Error with Organization.remove');
				return reject({
					// Must be 405 (Method Not Allowed) or 409 (Conflict)
					// 405 if you do not want to allow the delete
					// 409 if you can't delete because of referential
					// integrity or some other reason
					code: 409,
					message: err2.message
				});
			}

			return resolve({ deleted: _.result && _.result.n });
		});

	});
});

module.exports.searchByVersionId = (args, context, logger) => new Promise((resolve, reject) => {
	logger.info('Organization >>> searchByVersionId');

	let { base_version, id, version_id } = args;

	let Organization = getOrganization(base_version);

	let db = globals.get(CLIENT_DB);
	let history_collection = db.collection(`${COLLECTION.ORGANIZATION}_${base_version}_History`);
	// Query our collection for this observation
	history_collection.findOne({ id: id.toString(), 'meta.versionId': `${version_id}` }, (err, organization) => {
		if (err) {
			logger.error('Error with Organization.searchByVersionId: ', err);
			return reject(err);
		}

		if (organization) {
			resolve(new Organization(organization));
		}

		resolve();

	});
});

module.exports.history = (args, context, logger) => new Promise((resolve, reject) => {
	logger.info('Organization >>> history');

	// Common search params
	let { base_version } = args;

	let query = {};

	if (base_version === VERSIONS['3_0_1']) {
		query = buildStu3SearchQuery(args);
	} else if (base_version === VERSIONS['1_0_2']) {
		query = buildDstu2SearchQuery(args);
	}

	// Grab an instance of our DB and collection
	let db = globals.get(CLIENT_DB);
	let history_collection = db.collection(`${COLLECTION.ORGANIZATION}_${base_version}_History`);
	let Organization = getOrganization(base_version);

	// Query our collection for this observation
	history_collection.find(query, (err, data) => {
		if (err) {
			logger.error('Error with Organization.history: ', err);
			return reject(err);
		}

		// Organization is a organization cursor, pull documents out before resolving
		data.toArray().then((organizations) => {
			organizations.forEach(function(element, i, returnArray) {
				returnArray[i] = new Organization(element);
			});
			resolve(organizations);
		});
	});
});

module.exports.historyById = (args, context, logger) => new Promise((resolve, reject) => {
	logger.info('Organization >>> historyById');

	let { base_version, id } = args;
	let query = {};

	if (base_version === VERSIONS['3_0_1']) {
		query = buildStu3SearchQuery(args);
	} else if (base_version === VERSIONS['1_0_2']) {
		query = buildDstu2SearchQuery(args);
	}

	query.id = `${id}`;

	// Grab an instance of our DB and collection
	let db = globals.get(CLIENT_DB);
	let history_collection = db.collection(`${COLLECTION.ORGANIZATION}_${base_version}_History`);
	let Organization = getOrganization(base_version);

	// Query our collection for this observation
	history_collection.find(query, (err, data) => {
		if (err) {
			logger.error('Error with Organization.historyById: ', err);
			return reject(err);
		}

		// Organization is a organization cursor, pull documents out before resolving
		data.toArray().then((organizations) => {
			organizations.forEach(function(element, i, returnArray) {
				returnArray[i] = new Organization(element);
			});
			resolve(organizations);
		});
	});
});

