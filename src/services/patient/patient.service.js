/*eslint no-unused-vars: "warn"*/

const { VERSIONS } = require('@asymmetrik/node-fhir-server-core').constants;
const { resolveSchema } = require('@asymmetrik/node-fhir-server-core');
const { COLLECTION, CLIENT_DB } = require('../../constants');
const globals = require('../../globals');

const logger = require('@asymmetrik/node-fhir-server-core').loggers.get();

const {
  stringQueryBuilder,
  tokenQueryBuilder,
  referenceQueryBuilder,
  addressQueryBuilder,
  nameQueryBuilder,
  dateQueryBuilder,
} = require('../../utils/querybuilder.util');

let getPatient = (base_version) => {
  return resolveSchema(base_version, 'Patient');
};


let buildStu3SearchQuery = (args) => {
  // Common search params
  let { _id } = args;

  // Search Result params

  // Patient search params
  let active = args['active'];
  let address = args['address'];
  let address_city = args['address-city'];
  let address_country = args['address-country'];
  let address_postalcode = args['address-postalcode'];
  let address_state = args['address-state'];
  let address_use = args['address-use'];
  let animal_breed = args['animal-breed'];
  let animal_species = args['animal-species'];
  let birthdate = args['birthdate'];
  let death_date = args['death-date'];
  let deceased = args['deceased'];
  let email = args['email'];
  let family = args['family'];
  let gender = args['gender'];
  let general_practitioner = args['general-practitioner'];
  let given = args['given'];
  let identifier = args['identifier'];
  let language = args['language'];
  let link = args['link'];
  let name = args['name'];
  let organization = args['organization'];
  let phone = args['phone'];
  let telecom = args['telecom'];

  let query = {};
  let ors = [];

  if (address) {
    let orsAddress = addressQueryBuilder(address);
    for (let i = 0; i < orsAddress.length; i++) {
      ors.push(orsAddress[i]);
    }
  }
  if (name) {
    let orsName = nameQueryBuilder(name);
    for (let i = 0; i < orsName.length; i++) {
      ors.push(orsName[i]);
    }
  }
  if (ors.length !== 0) {
    query.$and = ors;
  }

  if (_id) {
    query.id = _id;
  }

  if (active) {
    query.active = active === 'true';
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

  if (animal_breed) {
    let queryBuilder = tokenQueryBuilder(animal_breed, 'code', 'animal.breed.coding', '');
    for (let i in queryBuilder) {
      query[i] = queryBuilder[i];
    }
  }

  if (animal_species) {
    let queryBuilder = tokenQueryBuilder(animal_species, 'code', 'animal.species.coding', '');
    for (let i in queryBuilder) {
      query[i] = queryBuilder[i];
    }
  }

  if (birthdate) {
    query.birthDate = dateQueryBuilder(birthdate, 'date', '');
  }

  if (death_date) {
    query.deceasedDateTime = dateQueryBuilder(death_date, 'dateTime', '');
  }

  if (deceased) {
    query.deceasedBoolean = deceased === 'true';
  }

  // Forces system = 'email'
  if (email) {
    let queryBuilder = tokenQueryBuilder(email, 'value', 'telecom', 'email');
    for (let i in queryBuilder) {
      query[i] = queryBuilder[i];
    }
  }

  if (family) {
    query['name.family'] = stringQueryBuilder(family);
  }

  if (gender) {
    query.gender = gender;
  }

  if (general_practitioner) {
    let queryBuilder = referenceQueryBuilder(general_practitioner, 'generalPractitioner.reference');
    for (let i in queryBuilder) {
      query[i] = queryBuilder[i];
    }
  }

  if (given) {
    query['name.given'] = stringQueryBuilder(given);
  }

  if (identifier) {
    let queryBuilder = tokenQueryBuilder(identifier, 'value', 'identifier', '');
    for (let i in queryBuilder) {
      query[i] = queryBuilder[i];
    }
  }

  if (language) {
    let queryBuilder = tokenQueryBuilder(language, 'code', 'communication.language.coding', '');
    for (let i in queryBuilder) {
      query[i] = queryBuilder[i];
    }
  }

  if (link) {
    let queryBuilder = referenceQueryBuilder(link, 'link.other.reference');
    for (let i in queryBuilder) {
      query[i] = queryBuilder[i];
    }
  }

  if (organization) {
    let queryBuilder = referenceQueryBuilder(organization, 'managingOrganization.reference');
    for (let i in queryBuilder) {
      query[i] = queryBuilder[i];
    }
  }

  // Forces system = 'phone'
  if (phone) {
    let queryBuilder = tokenQueryBuilder(phone, 'value', 'telecom', 'phone');
    for (let i in queryBuilder) {
      query[i] = queryBuilder[i];
    }
  }

  // TODO:  mongo doesn't natively support fuzzy but there are ways to do it
  // or use Elastic?
  //
  // if (phonetic) {
  //
  // }

  if (telecom) {
    let queryBuilder = tokenQueryBuilder(telecom, 'value', 'telecom', '');
    for (let i in queryBuilder) {
      query[i] = queryBuilder[i];
    }
  }

  return query;
};

let buildDstu2SearchQuery = (args) => {
  // Common search params
  let { _id } = args;

  // Search Result params

  // Patient search params
  let active = args['active'];
  let address = args['address'];
  let address_city = args['address-city'];
  let address_country = args['address-country'];
  let address_postalcode = args['address-postalcode'];
  let address_state = args['address-state'];
  let address_use = args['address-use'];
  let animal_breed = args['animal-breed'];
  let animal_species = args['animal-species'];
  let birthdate = args['birthdate'];
  let death_date = args['deathdate'];
  let deceased = args['deceased'];
  let email = args['email'];
  let family = args['family'];
  let gender = args['gender'];
  let careprovider = args['careprovider'];
  let given = args['given'];
  let identifier = args['identifier'];
  let language = args['language'];
  let link = args['link'];
  let name = args['name'];
  let organization = args['organization'];
  let phone = args['phone'];
  let telecom = args['telecom'];

  let query = {};
  let ors = [];

  if (address) {
    let orsAddress = addressQueryBuilder(address);
    for (let i = 0; i < orsAddress.length; i++) {
      ors.push(orsAddress[i]);
    }
  }
  if (name) {
    let orsName = nameQueryBuilder(name);
    for (let i = 0; i < orsName.length; i++) {
      ors.push(orsName[i]);
    }
  }
  if (ors.length !== 0) {
    query.$and = ors;
  }

  if (_id) {
    query.id = _id;
  }

  if (active) {
    query.active = active === 'true';
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

  if (animal_breed) {
    let queryBuilder = tokenQueryBuilder(animal_breed, 'code', 'animal.breed.coding', '');
    for (let i in queryBuilder) {
      query[i] = queryBuilder[i];
    }
  }

  if (animal_species) {
    let queryBuilder = tokenQueryBuilder(animal_species, 'code', 'animal.species.coding', '');
    for (let i in queryBuilder) {
      query[i] = queryBuilder[i];
    }
  }

  if (birthdate) {
    query.birthDate = dateQueryBuilder(birthdate, 'date', '');
  }

  if (death_date) {
    query.deceasedDateTime = dateQueryBuilder(death_date, 'dateTime', '');
  }

  if (deceased) {
    query.deceasedBoolean = deceased === 'true';
  }

  // Forces system = 'email'
  if (email) {
    let queryBuilder = tokenQueryBuilder(email, 'value', 'telecom', 'email');
    for (let i in queryBuilder) {
      query[i] = queryBuilder[i];
    }
  }

  if (family) {
    query['name.family'] = stringQueryBuilder(family);
  }

  if (gender) {
    query.gender = gender;
  }

  if (careprovider) {
    let queryBuilder = referenceQueryBuilder(careprovider, 'careProvider.reference');
    for (let i in queryBuilder) {
      query[i] = queryBuilder[i];
    }
  }

  if (given) {
    query['name.given'] = stringQueryBuilder(given);
  }

  if (identifier) {
    let queryBuilder = tokenQueryBuilder(identifier, 'value', 'identifier', '');
    for (let i in queryBuilder) {
      query[i] = queryBuilder[i];
    }
  }

  if (language) {
    let queryBuilder = tokenQueryBuilder(language, 'code', 'communication.language.coding', '');
    for (let i in queryBuilder) {
      query[i] = queryBuilder[i];
    }
  }

  if (link) {
    let queryBuilder = referenceQueryBuilder(link, 'link.other.reference');
    for (let i in queryBuilder) {
      query[i] = queryBuilder[i];
    }
  }

  if (organization) {
    let queryBuilder = referenceQueryBuilder(organization, 'managingOrganization.reference');
    for (let i in queryBuilder) {
      query[i] = queryBuilder[i];
    }
  }

  // Forces system = 'phone'
  if (phone) {
    let queryBuilder = tokenQueryBuilder(phone, 'value', 'telecom', 'phone');
    for (let i in queryBuilder) {
      query[i] = queryBuilder[i];
    }
  }

  // TODO:  mongo doesn't natively support fuzzy but there are ways to do it
  // or use Elastic?
  //
  // if (phonetic) {
  //
  // }

  if (telecom) {
    let queryBuilder = tokenQueryBuilder(telecom, 'value', 'telecom', '');
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
module.exports.search = (args) =>
  new Promise((resolve, reject) => {
    logger.info('Patient >>> search');

    let { base_version } = args;
    let query = {};

    if (base_version === VERSIONS['3_0_1']) {
      query = buildStu3SearchQuery(args);
    } else if (base_version === VERSIONS['1_0_2']) {
      query = buildDstu2SearchQuery(args);
    }

    // Grab an instance of our DB and collection
    let db = globals.get(CLIENT_DB);
    let collection = db.collection(`${COLLECTION.PATIENT}_${base_version}`);
    let Patient = getPatient(base_version);

    // Query our collection for this observation
    collection.find(query, (err, data) => {
      if (err) {
        logger.error('Error with Patient.search: ', err);
        return reject(err);
      }

      // Patient is a patient cursor, pull documents out before resolving
      data.toArray().then((patients) => {
        patients.forEach(function (element, i, returnArray) {
          returnArray[i] = new Patient(element);
        });
        resolve(patients);
      });
    });
  });

  module.exports.searchById = (args) =>
  base_service.searchById(args, resource_name, collection_name)

module.exports.create = (args, { req }) =>
  base_service.create(args, { req }, resource_name, collection_name)

module.exports.update = (args, { req }) =>
  base_service.update(args, { req }, resource_name, collection_name)

module.exports.remove = (args, context) =>
  base_service.remove(args, context, resource_name, collection_name)

module.exports.searchByVersionId = (args, context) =>
  base_service.search(args, context, resource_name, collection_name)

module.exports.patch = (args, context) =>
  base_service.patch(args, context, resource_name, collection_name)

module.exports.history = (args) =>
  new Promise((resolve, reject) => {
    logger.info('Patient >>> history');

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
    let history_collection = db.collection(`${COLLECTION.PATIENT}_${base_version}_History`);
    let Patient = getPatient(base_version);

    // Query our collection for this observation
    history_collection.find(query, (err, data) => {
      if (err) {
        logger.error('Error with Patient.history: ', err);
        return reject(err);
      }

      // Patient is a patient cursor, pull documents out before resolving
      data.toArray().then((patients) => {
        patients.forEach(function (element, i, returnArray) {
          returnArray[i] = new Patient(element);
        });
        resolve(patients);
      });
    });
  });

module.exports.historyById = (args) =>
  new Promise((resolve, reject) => {
    logger.info('Patient >>> historyById');

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
    let history_collection = db.collection(`${COLLECTION.PATIENT}_${base_version}_History`);
    let Patient = getPatient(base_version);

    // Query our collection for this observation
    history_collection.find(query, (err, data) => {
      if (err) {
        logger.error('Error with Patient.historyById: ', err);
        return reject(err);
      }

      // Patient is a patient cursor, pull documents out before resolving
      data.toArray().then((patients) => {
        patients.forEach(function (element, i, returnArray) {
          returnArray[i] = new Patient(element);
        });
        resolve(patients);
      });
    });
  });
