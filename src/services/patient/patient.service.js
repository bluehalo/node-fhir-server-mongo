/*eslint no-unused-vars: "warn"*/

const { VERSIONS } = require('@asymmetrik/node-fhir-server-core').constants;
const { resolveSchema } = require('@asymmetrik/node-fhir-server-core');
const { COLLECTION, CLIENT_DB } = require('../../constants');
const moment = require('moment-timezone');
const globals = require('../../globals');
const jsonpatch = require('fast-json-patch');

const { getUuid } = require('../../utils/uid.util');

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

let getMeta = (base_version) => {
  return resolveSchema(base_version, 'Meta');
};

let buildStu3SearchQuery = (args) => {
  // Common search params
  let { _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } = args;

  // Search Result params
  let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } =
    args;

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
  let phonetic = args['phonetic'];
  let telecom = args['telecom'];

  let query = {};
  let ors = [];

  if (address) {
    let orsAddresses = addressQueryBuilder(address);
    for (let orsAddress in orsAddresses) {
      ors.push(orsAddress);
    }
  }
  if (name) {
    let orsNames = nameQueryBuilder(name);
    for (let orsName in orsNames) {
      ors.push(orsName);
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
  let { _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } = args;

  // Search Result params
  let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } =
    args;

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
  let phonetic = args['phonetic'];
  let telecom = args['telecom'];

  let query = {};
  let ors = [];

  if (address) {
    let orsAddresses = addressQueryBuilder(address);
    for (let orsAddress in orsAddresses) {
      ors.push(orsAddress);
    }
  }
  if (name) {
    let orsNames = nameQueryBuilder(name);
    for (let orsName in orsNames) {
      ors.push(orsName);
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

    switch (base_version) {
      case VERSIONS['1_0_2']:
        query = buildDstu2SearchQuery(args);
        break;
      case VERSIONS['3_0_1']:
      case VERSIONS['4_0_0']:
      case VERSIONS['4_0_1']:
        query = buildStu3SearchQuery(args);
        break;
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
  new Promise((resolve, reject) => {
    logger.info('Patient >>> searchById');

    let { base_version, id } = args;
    let Patient = getPatient(base_version);

    // Grab an instance of our DB and collection
    let db = globals.get(CLIENT_DB);
    let collection = db.collection(`${COLLECTION.PATIENT}_${base_version}`);
    // Query our collection for this observation
    collection.findOne({ id: id.toString() }, (err, patient) => {
      if (err) {
        logger.error('Error with Patient.searchById: ', err);
        return reject(err);
      }
      if (patient) {
        resolve(new Patient(patient));
      }
      resolve();
    });
  });

module.exports.create = (args, { req }) =>
  new Promise((resolve, reject) => {
    logger.info('Patient >>> create');

    let resource = req.body;

    let { base_version } = args;

    // Grab an instance of our DB and collection (by version)
    let db = globals.get(CLIENT_DB);
    let collection = db.collection(`${COLLECTION.PATIENT}_${base_version}`);

    // Get current record
    let Patient = getPatient(base_version);
    let patient = new Patient(resource);

    // If no resource ID was provided, generate one.
    let id = getUuid(patient);

    // Create the resource's metadata
    let Meta = getMeta(base_version);
    patient.meta = new Meta({
      versionId: '1',
      lastUpdated: moment.utc().format('YYYY-MM-DDTHH:mm:ssZ'),
    });

    // Create the document to be inserted into Mongo
    let doc = JSON.parse(JSON.stringify(patient.toJSON()));
    Object.assign(doc, { id: id });

    // Create a clone of the object without the _id parameter before assigning a value to
    // the _id parameter in the original document
    let history_doc = Object.assign({}, doc);
    Object.assign(doc, { _id: id });

    // Insert our patient record
    collection.insertOne(doc, (err) => {
      if (err) {
        logger.error('Error with Patient.create: ', err);
        return reject(err);
      }

      // Save the resource to history
      let history_collection = db.collection(`${COLLECTION.PATIENT}_${base_version}_History`);

      // Insert our patient record to history but don't assign _id
      return history_collection.insertOne(history_doc, (err2) => {
        if (err2) {
          logger.error('Error with PatientHistory.create: ', err2);
          return reject(err2);
        }
        return resolve({ id: doc.id, resource_version: doc.meta.versionId });
      });
    });
  });

module.exports.update = (args, { req }) =>
  new Promise((resolve, reject) => {
    logger.info('Patient >>> update');

    let resource = req.body;

    let { base_version, id } = args;

    // Grab an instance of our DB and collection
    let db = globals.get(CLIENT_DB);
    let collection = db.collection(`${COLLECTION.PATIENT}_${base_version}`);

    // Get current record
    // Query our collection for this observation
    collection.findOne({ id: id.toString() }, (err, data) => {
      if (err) {
        logger.error('Error with Patient.searchById: ', err);
        return reject(err);
      }

      let Patient = getPatient(base_version);
      let patient = new Patient(resource);

      if (data && data.meta) {
        let foundPatient = new Patient(data);
        let meta = foundPatient.meta;
        meta.versionId = `${parseInt(foundPatient.meta.versionId) + 1}`;
        patient.meta = meta;
      } else {
        let Meta = getMeta(base_version);
        patient.meta = new Meta({
          versionId: '1',
          lastUpdated: moment.utc().format('YYYY-MM-DDTHH:mm:ssZ'),
        });
      }

      let cleaned = JSON.parse(JSON.stringify(patient));
      let doc = Object.assign(cleaned, { _id: id });

      // Insert/update our patient record
      collection.findOneAndUpdate({ id: id }, { $set: doc }, { upsert: true }, (err2, res) => {
        if (err2) {
          logger.error('Error with Patient.update: ', err2);
          return reject(err2);
        }

        // save to history
        let history_collection = db.collection(`${COLLECTION.PATIENT}_${base_version}_History`);

        let history_patient = Object.assign(cleaned, { id: id });

        // Insert our patient record to history but don't assign _id
        return history_collection.insertOne(history_patient, (err3) => {
          if (err3) {
            logger.error('Error with PatientHistory.create: ', err3);
            return reject(err3);
          }

          return resolve({
            id: id,
            created: res.lastErrorObject && !res.lastErrorObject.updatedExisting,
            resource_version: doc.meta.versionId,
          });
        });
      });
    });
  });

module.exports.remove = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('Patient >>> remove');

    let { base_version, id } = args;

    // Grab an instance of our DB and collection
    let db = globals.get(CLIENT_DB);
    let collection = db.collection(`${COLLECTION.PATIENT}_${base_version}`);
    // Delete our patient record
    collection.deleteOne({ id: id }, (err, _) => {
      if (err) {
        logger.error('Error with Patient.remove');
        return reject({
          // Must be 405 (Method Not Allowed) or 409 (Conflict)
          // 405 if you do not want to allow the delete
          // 409 if you can't delete because of referential
          // integrity or some other reason
          code: 409,
          message: err.message,
        });
      }

      // delete history as well.  You can chose to save history.  Up to you
      let history_collection = db.collection(`${COLLECTION.PATIENT}_${base_version}_History`);
      return history_collection.deleteMany({ id: id }, (err2) => {
        if (err2) {
          logger.error('Error with Patient.remove');
          return reject({
            // Must be 405 (Method Not Allowed) or 409 (Conflict)
            // 405 if you do not want to allow the delete
            // 409 if you can't delete because of referential
            // integrity or some other reason
            code: 409,
            message: err2.message,
          });
        }

        return resolve({ deleted: _.result && _.result.n });
      });
    });
  });

module.exports.searchByVersionId = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('Patient >>> searchByVersionId');

    let { base_version, id, version_id } = args;

    let Patient = getPatient(base_version);

    let db = globals.get(CLIENT_DB);
    let history_collection = db.collection(`${COLLECTION.PATIENT}_${base_version}_History`);

    // Query our collection for this observation
    history_collection.findOne(
      { id: id.toString(), 'meta.versionId': `${version_id}` },
      (err, patient) => {
        if (err) {
          logger.error('Error with Patient.searchByVersionId: ', err);
          return reject(err);
        }

        if (patient) {
          resolve(new Patient(patient));
        }

        resolve();
      }
    );
  });

module.exports.history = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('Patient >>> history');

    // Common search params
    let { base_version } = args;

    let query = {};

    switch (base_version) {
      case VERSIONS['1_0_2']:
        query = buildDstu2SearchQuery(args);
        break;
      case VERSIONS['3_0_1']:
      case VERSIONS['4_0_0']:
      case VERSIONS['4_0_1']:
        query = buildStu3SearchQuery(args);
        break;
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

module.exports.historyById = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('Patient >>> historyById');

    let { base_version, id } = args;
    let query = {};

    switch (base_version) {
      case VERSIONS['1_0_2']:
        query = buildDstu2SearchQuery(args);
        break;
      case VERSIONS['3_0_1']:
      case VERSIONS['4_0_0']:
      case VERSIONS['4_0_1']:
        query = buildStu3SearchQuery(args);
        break;
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

module.exports.patch = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('Patient >>> patch'); // Should this say update (instead of patch) because the end result is that of an update, not a patch

    let { base_version, id, patchContent } = args;

    // Grab an instance of our DB and collection
    let db = globals.get(CLIENT_DB);
    let collection = db.collection(`${COLLECTION.PATIENT}_${base_version}`);

    // Get current record
    // Query our collection for this observation
    collection.findOne({ id: id.toString() }, (err, data) => {
      if (err) {
        logger.error('Error with Patient.searchById: ', err);
        return reject(err);
      }

      // Validate the patch
      let errors = jsonpatch.validate(patchContent, data);
      if (errors && Object.keys(errors).length > 0) {
        logger.error('Error with patch contents');
        return reject(errors);
      }
      // Make the changes indicated in the patch
      let resource = jsonpatch.applyPatch(data, patchContent).newDocument;

      let Patient = getPatient(base_version);
      let patient = new Patient(resource);

      if (data && data.meta) {
        let foundPatient = new Patient(data);
        let meta = foundPatient.meta;
        meta.versionId = `${parseInt(foundPatient.meta.versionId) + 1}`;
        patient.meta = meta;
      } else {
        return reject('Unable to patch resource. Missing either data or metadata.');
      }

      // Same as update from this point on
      let cleaned = JSON.parse(JSON.stringify(patient));
      let doc = Object.assign(cleaned, { _id: id });

      // Insert/update our patient record
      collection.findOneAndUpdate({ id: id }, { $set: doc }, { upsert: true }, (err2, res) => {
        if (err2) {
          logger.error('Error with Patient.update: ', err2);
          return reject(err2);
        }

        // Save to history
        let history_collection = db.collection(`${COLLECTION.PATIENT}_${base_version}_History`);
        let history_patient = Object.assign(cleaned, { _id: id + cleaned.meta.versionId });

        // Insert our patient record to history but don't assign _id
        return history_collection.insertOne(history_patient, (err3) => {
          if (err3) {
            logger.error('Error with PatientHistory.create: ', err3);
            return reject(err3);
          }

          return resolve({
            id: doc.id,
            created: res.lastErrorObject && !res.lastErrorObject.updatedExisting,
            resource_version: doc.meta.versionId,
          });
        });
      });
    });
  });
