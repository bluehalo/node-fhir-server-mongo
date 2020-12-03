const {VERSIONS} = require('@asymmetrik/node-fhir-server-core').constants;
const {resolveSchema} = require('@asymmetrik/node-fhir-server-core');
// const JSONSchemaValidator = require('@asymmetrik/fhir-json-schema-validator');
const {CLIENT_DB} = require('../../constants');
const moment = require('moment-timezone');
const globals = require('../../globals');
// noinspection JSCheckFunctionSignatures
const logger = require('@asymmetrik/node-fhir-server-core').loggers.get();
const {getUuid} = require('../../utils/uid.util');
const {validate, applyPatch, compare} = require('fast-json-patch');
const deepmerge = require('deepmerge');
const deepcopy = require('deepcopy');
const deepEqual = require('deep-equal');
// const Validator = require('jsonschema').Validator;
// const fhirSchema = require('../../fhir_schema/fhir.schema.json');

let getResource = (base_version, resource_name) => {
    return resolveSchema(base_version, resource_name);
};

let getMeta = (base_version) => {
    return resolveSchema(base_version, 'Meta');
};

let logInfo = (msg) => logger.info(msg);
// let logInfo = () => { };

const {
    stringQueryBuilder,
    // tokenQueryBuilder,
    // referenceQueryBuilder,
    // addressQueryBuilder,
    nameQueryBuilder,
    // dateQueryBuilder,
} = require('../../utils/querybuilder.util');


let buildR4SearchQuery = (resource_name, args) => {
    // Common search params
    let {id} = args;
    let patient = args['patient'];
    let practitioner = args['practitioner'];
    let organization = args['organization'];
    let location = args['location'];
    let healthcareService = args['healthcareService'];
    let name = args['name'];
    let family = args['family'];

    let address_city = args['address-city'];
    let address_country = args['address-country'];
    let address_postalcode = args['address-postalcode'];
    let address_state = args['address-state'];

    // Search Result params

    // Patient search params
    let active = args['active'];

    let query = {};

    if (id) {
        query.id = id;
    }

    if (patient) {
        const patient_reference = 'Patient/' + patient;
        // each Resource type has a different place to put the patient info
        if (['Patient'].includes(resource_name)) {
            query.id = patient;
        } else if (['AllergyIntolerance', 'Immunization', 'RelatedPerson', 'Device'].includes(resource_name)) {
            query['patient.reference'] = patient_reference;
        } else if (['Appointment'].includes(resource_name)) {
            query['participant.actor.reference'] = patient_reference; //TODO: participant is a list
        } else if (['CarePlan', 'Condition', 'DocumentReference', 'Encounter', 'MedicationRequest', 'Observation', 'Procedure', 'ServiceRequest', 'CareTeam'].includes(resource_name)) {
            query['subject.reference'] = patient_reference;
        } else if (['Coverage'].includes(resource_name)) {
            query['beneficiary.reference'] = patient_reference;
        } else {
            logger.error(`No mapping for searching by patient for ${resource_name}: `);
        }
    }
    if (practitioner) {
        const practitioner_reference = 'Practitioner/' + practitioner;
        // each Resource type has a different place to put the patient info
        if (['Practitioner'].includes(resource_name)) {
            query.id = practitioner;
        } else if (['PractitionerRole'].includes(resource_name)) {
            query['practitioner.reference'] = practitioner_reference;
        } else {
            logger.error(`No mapping for searching by practitioner for ${resource_name}: `);
        }
    }
    if (organization) {
        const organization_reference = 'Organization/' + organization;
        // each Resource type has a different place to put the patient info
        if (['Organization'].includes(resource_name)) {
            query.id = organization;
        } else if (['HealthcareService'].includes(resource_name)) {
            query['providedBy.reference'] = organization_reference;
        } else if (['InsurancePlan'].includes(resource_name)) {
            query['ownedBy.reference'] = organization_reference;
        } else if (['PractitionerRole'].includes(resource_name)) {
            query['organization.reference'] = organization_reference;
        } else {
            logger.error(`No mapping for searching by organization for ${resource_name}: `);
        }
    }
    if (location) {
        const location_reference = 'Location/' + location;
        // each Resource type has a different place to put the patient info
        if (['Location'].includes(resource_name)) {
            query.id = location;
        } else if (['PractitionerRole'].includes(resource_name)) {
            query['location.reference'] = location_reference;
        } else {
            logger.error(`No mapping for searching by location for ${resource_name}: `);
        }
    }
    if (healthcareService) {
        const healthcareService_reference = 'HealthcareService/' + healthcareService;
        // each Resource type has a different place to put the patient info
        if (['HealthcareService'].includes(resource_name)) {
            query.id = healthcareService;
        } else if (['PractitionerRole'].includes(resource_name)) {
            query['healthcareService.reference'] = healthcareService_reference;
        } else {
            logger.error(`No mapping for searching by healthcareService for ${resource_name}: `);
        }
    }
    if (name) {
        if (['Practitioner'].includes(resource_name)) {
            let ors = [];

            if (name) {
                let orsName = nameQueryBuilder(name);
                for (let i = 0; i < orsName.length; i++) {
                    ors.push(orsName[i]);
                }
            }
            if (ors.length !== 0) {
                query.$and = ors;
            }
        } else {
            query['name'] = stringQueryBuilder(name);
        }
    }
    if (family) {
        query['name.family'] = stringQueryBuilder(family);
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

    if (active) {
        query.active = active === 'true';
    }

    return query;
};


let buildStu3SearchQuery = (args) => {
    // Common search params
    let {id} = args;

    // Search Result params

    // Patient search params
    let active = args['active'];

    let query = {};

    if (id) {
        query.id = id;
    }

    if (active) {
        query.active = active === 'true';
    }

    return query;
};

let buildDstu2SearchQuery = (args) => {
    // Common search params
    let {id} = args;

    // Search Result params

    // Patient search params
    let active = args['active'];

    let query = {};
    if (id) {
        query.id = id;
    }

    if (active) {
        query.active = active === 'true';
    }
    return query;
};

// eslint-disable-next-line no-unused-vars
// let validateSchema = (instance) => {
//
//     // https://github.com/Asymmetrik/node-fhir-server-core/tree/master/packages/fhir-json-schema-validator
//     const validator = new JSONSchemaValidator();
//     let errors = validator.validate(instance);
//     console.log(errors);
//     return errors;
//
//     // var v = new Validator();
//     // var schema = fhirSchema;
//     // const validationResult = v.validate(instance, schema);
//     // console.log(validationResult);
// };

/**
 *
 * @param {*} args
 * @param resource_name
 * @param collection_name
 * @param {*} context
 */
module.exports.search = (args, {req}, resource_name, collection_name) =>
    new Promise((resolve, reject) => {
        logInfo(resource_name + ' >>> search');
        logInfo('---- args ----');
        logInfo(args);
        logInfo('--------');

        // asymmetric hides certain query parameters from us so we need to get them from the context
        const my_args = {};
        const my_args_array = Object.entries(req.query);
        my_args_array.forEach(x => {
            my_args[x[0]] = x[1];
        });

        const combined_args = Object.assign({}, args, my_args);
        logInfo('---- combined_args ----');
        logInfo(combined_args);
        logInfo('--------');

        let {base_version} = args;
        let query;

        if (base_version === VERSIONS['3_0_1']) {
            query = buildStu3SearchQuery(combined_args);
        } else if (base_version === VERSIONS['1_0_2']) {
            query = buildDstu2SearchQuery(combined_args);
        } else {
            query = buildR4SearchQuery(resource_name, combined_args);
        }

        // Grab an instance of our DB and collection
        let db = globals.get(CLIENT_DB);
        let collection = db.collection(`${collection_name}_${base_version}`);
        let Resource = getResource(base_version, resource_name);

        logInfo('---- query ----');
        logInfo(query);
        logInfo('--------');

        // Query our collection for this observation
        collection.find(query, (err, cursor) => {
            if (err) {
                logger.error(`Error with ${resource_name}.search: `, err);
                return reject(err);
            }


            if (combined_args['_count']) {
                const nPerPage = Number(combined_args['_count']);

                if (combined_args['_getpagesoffset']) {
                    const pageNumber = Number(combined_args['_getpagesoffset']);
                    cursor = cursor.skip(pageNumber > 0 ? ((pageNumber - 1) * nPerPage) : 0);
                }
                cursor = cursor.limit(nPerPage);
            }

            // Resource is a resource cursor, pull documents out before resolving
            cursor.toArray().then((resources) => {
                resources.forEach(function (element, i, returnArray) {
                    returnArray[i] = new Resource(element);
                });
                resolve(resources);
            });
        });

    });

// eslint-disable-next-line no-unused-vars
module.exports.searchById = (args, {req}, resource_name, collection_name) =>
    new Promise((resolve, reject) => {
        logInfo(`${resource_name} >>> searchById`);
        logInfo(args);

        // Common search params
        let {id} = args;
        let {base_version} = args;

        logInfo(`id: ${id}`);
        logInfo(`base_version: ${base_version}`);

        // Search Result param

        let query = {};
        query.id = id;
        // TODO: Build query from Parameters

        // TODO: Query database
        // Grab an instance of our DB and collection
        let db = globals.get(CLIENT_DB);
        let collection = db.collection(`${collection_name}_${base_version}`);
        let Resource = getResource(base_version, resource_name);

        collection.findOne({id: id.toString()}, (err, resource) => {
            if (err) {
                logger.error(`Error with ${resource_name}.searchById: `, err);
                return reject(err);
            }
            if (resource) {
                resolve(new Resource(resource));
            }
            resolve();
        });
    });

module.exports.create = (args, {req}, resource_name, collection_name) =>
    new Promise((resolve, reject) => {
        logInfo(`${resource_name} >>> create`);

        let resource_incoming = req.body;

        let {base_version} = args;

        logInfo('--- request ----');
        logInfo(req);
        logInfo('-----------------');

        logInfo('--- body ----');
        logInfo(resource_incoming);
        logInfo('-----------------');

        // Grab an instance of our DB and collection (by version)
        let db = globals.get(CLIENT_DB);
        let collection = db.collection(`${collection_name}_${base_version}`);

        // Get current record
        let Resource = getResource(base_version, resource_name);
        logInfo(`Resource: ${Resource}`);
        let resource = new Resource(resource_incoming);
        // noinspection JSUnresolvedFunction
        logInfo(`resource: ${resource.toJSON()}`);

        // If no resource ID was provided, generate one.
        let id = getUuid(resource);
        logInfo(`id: ${id}`);

        // Create the resource's metadata
        let Meta = getMeta(base_version);
        resource.meta = new Meta({
            versionId: '1',
            lastUpdated: moment.utc().format('YYYY-MM-DDTHH:mm:ssZ'),
        });

        // Create the document to be inserted into Mongo
        // noinspection JSUnresolvedFunction
        let doc = JSON.parse(JSON.stringify(resource.toJSON()));
        Object.assign(doc, {id: id});

        // Create a clone of the object without the _id parameter before assigning a value to
        // the _id parameter in the original document
        let history_doc = Object.assign({}, doc);
        Object.assign(doc, {_id: id});

        logInfo('---- inserting doc ---');
        logInfo(doc);
        logInfo('----------------------');

        // Insert our resource record
        collection.insertOne(doc, (err) => {
            if (err) {
                logger.error(`Error with P${resource_name}.create: `, err);
                return reject(err);
            }

            // Save the resource to history
            let history_collection = db.collection(`${collection_name}_${base_version}_History`);

            // Insert our resource record to history but don't assign _id
            return history_collection.insertOne(history_doc, (err2) => {
                if (err2) {
                    logger.error(`Error with ${resource_name}History.create: `, err2);
                    return reject(err2);
                }
                return resolve({id: doc.id, resource_version: doc.meta.versionId});
            });
        });
    });

module.exports.update = (args, {req}, resource_name, collection_name) =>
    new Promise((resolve, reject) => {
        logInfo(`'${resource_name} >>> update`);

        logInfo('--- request ----');
        logInfo(req);

        // read the incoming resource from request body
        let resource_incoming = req.body;
        let {base_version, id} = args;
        logInfo(base_version);
        logInfo(id);
        logInfo('--- body ----');
        logInfo(resource_incoming);

        // Grab an instance of our DB and collection
        let db = globals.get(CLIENT_DB);
        let collection = db.collection(`${collection_name}_${base_version}`);

        // Get current record
        // Query our collection for this observation
        // noinspection JSUnresolvedVariable
        collection.findOne({id: id.toString()}, (err, data) => {
            if (err) {
                logger.error(`Error with finding resource ${resource_name}.update: `, err);
                return reject(err);
            }

            // create a resource with incoming data
            let Resource = getResource(base_version, resource_name);

            let cleaned;
            let doc;

            // check if resource was found in database or not
            // noinspection JSUnresolvedVariable
            if (data && data.meta) {
                // found an existing resource
                logInfo('found resource: ' + data);
                let foundResource = new Resource(data);
                logInfo('------ found document --------');
                logInfo(data);
                logInfo('------ end found document --------');

                // use metadata of existing resource (overwrite any passed in metadata)
                resource_incoming.meta = foundResource.meta;
                logInfo('------ incoming document --------');
                logInfo(resource_incoming);
                logInfo('------ end incoming document --------');

                // now create a patch between the document in db and the incoming document
                //  this returns an array of patches
                let patchContent = compare(data, resource_incoming);
                // ignore any changes to _id since that's an internal field
                patchContent = patchContent.filter(item => item.path !== '/_id');
                logInfo('------ patches --------');
                logInfo(patchContent);
                logInfo('------ end patches --------');
                // see if there are any changes
                if (patchContent.length === 0) {
                    logInfo('No changes detected in updated resource');
                    return resolve({
                        id: id,
                        created: false,
                        resource_version: foundResource.meta.versionId,
                    });
                }
                // now apply the patches to the found resource
                let patched_incoming_data = applyPatch(data, patchContent).newDocument;
                let patched_resource_incoming = new Resource(patched_incoming_data);
                // update the metadata to increment versionId
                let meta = foundResource.meta;
                meta.versionId = `${parseInt(foundResource.meta.versionId) + 1}`;
                meta.lastUpdated = moment.utc().format('YYYY-MM-DDTHH:mm:ssZ');
                patched_resource_incoming.meta = meta;
                logInfo('------ patched document --------');
                logInfo(patched_resource_incoming);
                logInfo('------ end patched document --------');
                // Same as update from this point on
                cleaned = JSON.parse(JSON.stringify(patched_resource_incoming));
                doc = Object.assign(cleaned, {_id: id});
            } else {
                // not found so insert
                logInfo('update: new resource: ' + resource_incoming);
                // create the metadata
                let Meta = getMeta(base_version);
                resource_incoming.meta = new Meta({
                    versionId: '1',
                    lastUpdated: moment.utc().format('YYYY-MM-DDTHH:mm:ssZ'),
                });
                cleaned = JSON.parse(JSON.stringify(resource_incoming));
                doc = Object.assign(cleaned, {_id: id});
            }

            // Insert/update our resource record
            // When using the $set operator, only the specified fields are updated
            collection.findOneAndUpdate({id: id}, {$set: doc}, {upsert: true}, (err2, res) => {
                if (err2) {
                    logger.error(`Error with ${resource_name}.update: `, err2);
                    return reject(err2);
                }

                // save to history
                let history_collection = db.collection(`${collection_name}_${base_version}_History`);

                // let history_resource = Object.assign(cleaned, {id: id});
                let history_resource = Object.assign(cleaned, {_id: id + cleaned.meta.versionId});
                // delete history_resource['_id']; // make sure we don't have an _id field when inserting into history

                // Insert our resource record to history but don't assign _id
                return history_collection.insertOne(history_resource, (err3) => {
                    if (err3) {
                        logger.error(`Error with ${resource_name}.update: `, err3);
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

module.exports.merge = async (args, {req}, resource_name, collection_name) => {
    logInfo(`'${resource_name} >>> merge`);

    // read the incoming resource from request body
    let resources_incoming = req.body;
    logInfo('args', args);
    let {base_version} = args;

    // logInfo('--- request ----');
    // logInfo(req);
    // logInfo('-----------------');

    logInfo('--- body ----');
    logInfo(resources_incoming);
    logInfo('-----------------');

    async function merge_resource(resource_to_merge) {
        try {
            // logInfo('--- validate schema ----');
            // const errors = validateSchema(resource_incoming);
            // if (errors.length > 0){
            //     return reject(errors);
            // }
            // logInfo('-----------------');

            let id = resource_to_merge.id;

            logInfo(base_version);
            logInfo('--- body ----');
            logInfo(resource_to_merge);

            // Grab an instance of our DB and collection
            let db = globals.get(CLIENT_DB);
            let collection = db.collection(`${collection_name}_${base_version}`);

            // Get current record
            // Query our collection for this observation
            let data = await collection.findOne({id: id.toString()});

            // create a resource with incoming data
            let Resource = getResource(base_version, resource_name);

            let cleaned;
            let doc;

            // check if resource was found in database or not
            if (data && data.meta) {
                // found an existing resource
                logInfo(resource_name + ': merge found resource ' + '[' + data.id + ']: ' + data);
                let foundResource = new Resource(data);
                logInfo('------ found document --------');
                logInfo(data);
                logInfo('------ end found document --------');

                // use metadata of existing resource (overwrite any passed in metadata)
                if (!resource_to_merge.meta) {
                    resource_to_merge.meta = {};
                }
                resource_to_merge.meta.versionId = foundResource.meta.versionId;
                resource_to_merge.meta.lastUpdated = foundResource.meta.lastUpdated;
                logInfo('------ incoming document --------');
                logInfo(resource_to_merge);
                logInfo('------ end incoming document --------');

                // merge new data with old
                // const mergeNames = (nameA, nameB) => {
                //     return `${nameA.first} and ${nameB.first}`;
                // };
                // const mergeIdentifiers = (array1, array2) => {
                //     return array1.concat(array2);
                // };
                let mergeObjectOrArray;
                // noinspection JSUnusedGlobalSymbols,JSUnusedLocalSymbols
                const options = {
                    // eslint-disable-next-line no-unused-vars
                    customMerge: (key) => {
                        // if (key === 'name') {
                        //     return mergeNames;
                        // }
                        // if (key === 'identifier') {
                        //     return mergeIdentifiers;
                        // }
                        return mergeObjectOrArray;
                    }
                };

                mergeObjectOrArray = (item1, item2) => {
                    if (Array.isArray(item1)) {
                        let result_array = deepcopy(item1); // deep copy so we don't change the original object
                        // see if items are equal then skip them
                        for (let i = 0; i < item2.length; i++) {
                            let my_item = item2[i];
                            // if item2[i] does not matches any item in item1 then insert
                            if (item1.every(a => deepEqual(a, my_item) === false)) {
                                result_array.push(my_item);
                            }
                        }
                        return result_array;
                    }
                    return deepmerge(item1, item2, options);
                };

                // data seems to get updated below
                let resource_merged = deepmerge(data, resource_to_merge, options);


                // now create a patch between the document in db and the incoming document
                //  this returns an array of patches
                let patchContent = compare(data, resource_merged);
                // ignore any changes to _id since that's an internal field
                patchContent = patchContent.filter(item => item.path !== '/_id');
                logInfo('------ patches --------');
                logInfo(patchContent);
                logInfo('------ end patches --------');
                // see if there are any changes
                if (patchContent.length === 0) {
                    logInfo('No changes detected in updated resource');
                    return {
                        id: id,
                        created: false,
                        updated: false,
                        resource_version: foundResource.meta.versionId,
                    };
                }
                // now apply the patches to the found resource
                let patched_incoming_data = applyPatch(data, patchContent).newDocument;
                let patched_resource_incoming = new Resource(patched_incoming_data);
                // update the metadata to increment versionId
                let meta = foundResource.meta;
                meta.versionId = `${parseInt(foundResource.meta.versionId) + 1}`;
                meta.lastUpdated = moment.utc().format('YYYY-MM-DDTHH:mm:ssZ');
                patched_resource_incoming.meta = meta;
                logInfo('------ patched document --------');
                logInfo(patched_resource_incoming);
                logInfo('------ end patched document --------');
                // Same as update from this point on
                cleaned = JSON.parse(JSON.stringify(patched_resource_incoming));
                doc = Object.assign(cleaned, {_id: id});
            } else {
                // not found so insert
                logInfo(resource_name + ': merge new resource ' + '[' + resource_to_merge.id + ']: ' + resource_to_merge);
                if (!resource_to_merge.meta) {
                    // create the metadata
                    let Meta = getMeta(base_version);
                    resource_to_merge.meta = new Meta({
                        versionId: '1',
                        lastUpdated: moment.utc().format('YYYY-MM-DDTHH:mm:ssZ'),
                    });
                } else {
                    resource_to_merge.meta.versionId = '1';
                    resource_to_merge.meta.lastUpdated = moment.utc().format('YYYY-MM-DDTHH:mm:ssZ');
                }

                cleaned = JSON.parse(JSON.stringify(resource_to_merge));
                doc = Object.assign(cleaned, {_id: id});
            }

            // Insert/update our resource record
            // When using the $set operator, only the specified fields are updated
            let res = await collection.findOneAndUpdate({id: id.toString()}, {$set: doc}, {upsert: true});

            // save to history
            let history_collection = db.collection(`${collection_name}_${base_version}_History`);

            let history_resource = Object.assign(cleaned, {_id: id + cleaned.meta.versionId});

            const created_entity = res.lastErrorObject && !res.lastErrorObject.updatedExisting;
            // Insert our resource record to history but don't assign _id
            await history_collection.insertOne(history_resource);

            return {
                id: id,
                created: created_entity,
                updated: res.lastErrorObject.updatedExisting,
                resource_version: doc.meta.versionId,
            };
        } catch (e) {
            logger.error(`Error with finding resource ${resource_name}.merge: `, e);
        }
    }

    if (Array.isArray(resources_incoming)) {
        logInfo('==================' + resource_name + ': Merge received array ' + '(' + resources_incoming.length + ') ' + '====================');
        return await Promise.all(resources_incoming.map(async x => merge_resource(x)));
    } else {
        return await merge_resource(resources_incoming);
    }
};

// eslint-disable-next-line no-unused-vars
module.exports.everything = async (args, {req}, resource_name) => {
    logInfo(`${resource_name} >>> everything`);
    try {
        let {base_version, id} = args;

        logInfo(`id=${id}`);
        logInfo(`req=${req}`);

        const host = req.headers.host;
        // for now we only support Practitioner
        let query = {};
        query.id = id;
        // Grab an instance of our DB and collection
        let db = globals.get(CLIENT_DB);
        let collection_name = 'Practitioner';
        let collection = db.collection(`${collection_name}_${base_version}`);
        const PractitionerResource = getResource(base_version, resource_name);

        let practitioner = await collection.findOne({id: id.toString()});
        // noinspection JSUnresolvedFunction
        if (practitioner) {
            // first add the Practitioner
            let entries = [{
                'link': `https://${host}/${base_version}/${practitioner.resourceType}/${practitioner.id}`,
                'resource': new PractitionerResource(practitioner)
            }];
            // now look for practitioner_role
            collection_name = 'PractitionerRole';
            collection = db.collection(`${collection_name}_${base_version}`);
            const PractitionerRoleResource = getResource(base_version, 'PractitionerRole');
            query = {
                'practitioner.reference': 'Practitioner/' + id
            };
            const cursor = await collection.find(query);
            // noinspection JSUnresolvedFunction
            const items = await cursor.toArray();

            // noinspection JSUnresolvedFunction
            const practitioner_roles = items.map(x => new PractitionerRoleResource(x));
            for (const index in practitioner_roles) {
                // noinspection JSUnfilteredForInLoop
                const practitioner_role = practitioner_roles[index];
                entries += {
                    'link': `https://${host}/${base_version}/${practitioner_role.resourceType}/${practitioner_role.id}`,
                    'resource': practitioner_role
                };
                // now for each PractitionerRole, get the Organization
                collection_name = 'Organization';
                collection = db.collection(`${collection_name}_${base_version}`);
                const OrganizationRoleResource = getResource(base_version, collection_name);
                if (practitioner_role.organization && practitioner_role.organization.reference) {
                    const organization_id = practitioner_role.organization.reference.replace('Organization/', '');

                    const organization = await collection.findOne({id: organization_id.toString()});
                    if (organization) {
                        entries += {
                            'link': `https://${host}/${base_version}/${organization.resourceType}/${organization.id}`,
                            'resource': new OrganizationRoleResource(organization)
                        };
                    }
                }
                // now for each PractitionerRole, get the Location
                collection_name = 'Location';
                collection = db.collection(`${collection_name}_${base_version}`);
                const LocationRoleResource = getResource(base_version, collection_name);
                if (practitioner_role.location && practitioner_role.location.reference) {
                    const location_id = practitioner_role.location.reference.replace(collection_name + '/', '');

                    const location = await collection.findOne({id: location_id.toString()});
                    if (location) {
                        entries += {
                            'link': `https://${host}/${base_version}/${location.resourceType}/${location.id}`,
                            'resource': new LocationRoleResource(location)
                        };
                    }
                }
                // now for each PractitionerRole, get the HealthcareService
                collection_name = 'HealthcareService';
                collection = db.collection(`${collection_name}_${base_version}`);
                const HealthcareServiceRoleResource = getResource(base_version, collection_name);
                if (practitioner_role.healthcareService && practitioner_role.healthcareService.reference) {
                    const healthcareService_id = practitioner_role.healthcareService.reference.replace(collection_name + '/', '');

                    const healthcareService = await collection.findOne({id: healthcareService_id.toString()});
                    if (healthcareService) {
                        entries += {
                            'link': `https://${host}/${base_version}/${healthcareService.resourceType}/${healthcareService.id}`,
                            'resource': new HealthcareServiceRoleResource(healthcareService)
                        };
                    }
                }
            }

            // create a bundle
            return (
                {
                    'resourceType': 'Bundle',
                    'id': 'bundle-example',
                    'entry': entries
                });
        }

    } catch (err) {
        logger.error(`Error with ${resource_name}.searchById: `, err);
        throw err;
    }
};

// eslint-disable-next-line no-unused-vars
module.exports.remove = (args, {req}, resource_name, collection_name) =>
    new Promise((resolve, reject) => {
        logInfo(`${resource_name} >>> remove`);

        let {base_version, id} = args;

        logInfo(`Deleting id=${id}`);

        // Grab an instance of our DB and collection
        let db = globals.get(CLIENT_DB);
        let collection = db.collection(`${collection_name}_${base_version}`);
        // Delete our resource record
        collection.deleteOne({id: id}, (err, _) => {
            if (err) {
                logger.error(`Error with ${resource_name}.remove`);
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
            let history_collection = db.collection(`${collection_name}_${base_version}_History`);
            return history_collection.deleteMany({id: id}, (err2) => {
                if (err2) {
                    logger.error(`Error with ${resource_name}.remove`);
                    return reject({
                        // Must be 405 (Method Not Allowed) or 409 (Conflict)
                        // 405 if you do not want to allow the delete
                        // 409 if you can't delete because of referential
                        // integrity or some other reason
                        code: 409,
                        message: err2.message,
                    });
                }

                return resolve({deleted: _.result && _.result.n});
            });
        });
    });

// eslint-disable-next-line no-unused-vars
module.exports.searchByVersionId = (args, {req}, resource_name, collection_name) =>
    new Promise((resolve, reject) => {
        logInfo(`${resource_name} >>> searchByVersionId`);

        let {base_version, id, version_id} = args;

        let Resource = getResource(base_version, resource_name);

        let db = globals.get(CLIENT_DB);
        let history_collection = db.collection(`${collection_name}_${base_version}_History`);

        // Query our collection for this observation
        history_collection.findOne(
            {id: id.toString(), 'meta.versionId': `${version_id}`},
            (err, resource) => {
                if (err) {
                    logger.error(`Error with ${resource_name}.searchByVersionId: `, err);
                    return reject(err);
                }

                if (resource) {
                    resolve(new Resource(resource));
                }

                resolve();
            }
        );
    });

// eslint-disable-next-line no-unused-vars
module.exports.history = (args, {req}, resource_name, collection_name) =>
    new Promise((resolve, reject) => {
        logInfo(`${resource_name} >>> history`);

        // Common search params
        let {base_version} = args;

        let query = {};

        if (base_version === VERSIONS['3_0_1']) {
            query = buildStu3SearchQuery(args);
        } else if (base_version === VERSIONS['1_0_2']) {
            query = buildDstu2SearchQuery(args);
        }

        // Grab an instance of our DB and collection
        let db = globals.get(CLIENT_DB);
        let history_collection = db.collection(`${collection_name}_${base_version}_History`);
        let Resource = getResource(base_version, resource_name);

        // Query our collection for this observation
        history_collection.find(query, (err, data) => {
            if (err) {
                logger.error(`Error with ${resource_name}.history: `, err);
                return reject(err);
            }

            // Patient is a resource cursor, pull documents out before resolving
            data.toArray().then((resources) => {
                resources.forEach(function (element, i, returnArray) {
                    returnArray[i] = new Resource(element);
                });
                resolve(resources);
            });
        });
    });

// eslint-disable-next-line no-unused-vars
module.exports.historyById = (args, {req}, resource_name, collection_name) =>
    new Promise((resolve, reject) => {
        logInfo(`${resource_name} >>> historyById`);

        let {base_version, id} = args;
        let query = {};

        if (base_version === VERSIONS['3_0_1']) {
            query = buildStu3SearchQuery(args);
        } else if (base_version === VERSIONS['1_0_2']) {
            query = buildDstu2SearchQuery(args);
        }

        query.id = `${id}`;

        // Grab an instance of our DB and collection
        let db = globals.get(CLIENT_DB);
        let history_collection = db.collection(`${collection_name}_${base_version}_History`);
        let Resource = getResource(base_version, resource_name);

        // Query our collection for this observation
        history_collection.find(query, (err, data) => {
            if (err) {
                logger.error(`Error with ${resource_name}.historyById: `, err);
                return reject(err);
            }

            // Resource is a resource cursor, pull documents out before resolving
            data.toArray().then((resources) => {
                resources.forEach(function (element, i, returnArray) {
                    returnArray[i] = new Resource(element);
                });
                resolve(resources);
            });
        });
    });

// eslint-disable-next-line no-unused-vars
module.exports.patch = (args, {req}, resource_name, collection_name) =>
    new Promise((resolve, reject) => {
        logInfo('Patient >>> patch');

        let {base_version, id, patchContent} = args;

        // Grab an instance of our DB and collection
        let db = globals.get(CLIENT_DB);
        let collection = db.collection(`${collection_name}_${base_version}`);

        // Get current record
        // Query our collection for this observation
        collection.findOne({id: id.toString()}, (err, data) => {
            if (err) {
                logger.error(`Error with ${resource_name}.patch: `, err);
                return reject(err);
            }

            // Validate the patch
            let errors = validate(patchContent, data);
            if (errors && Object.keys(errors).length > 0) {
                logger.error('Error with patch contents');
                return reject(errors);
            }
            // Make the changes indicated in the patch
            let resource_incoming = applyPatch(data, patchContent).newDocument;

            let Resource = getResource(base_version, resource_name);
            let resource = new Resource(resource_incoming);

            if (data && data.meta) {
                let foundResource = new Resource(data);
                let meta = foundResource.meta;
                // noinspection JSUnresolvedVariable
                meta.versionId = `${parseInt(foundResource.meta.versionId) + 1}`;
                resource.meta = meta;
            } else {
                return reject('Unable to patch resource. Missing either data or metadata.');
            }

            // Same as update from this point on
            let cleaned = JSON.parse(JSON.stringify(resource));
            let doc = Object.assign(cleaned, {_id: id});

            // Insert/update our resource record
            collection.findOneAndUpdate({id: id}, {$set: doc}, {upsert: true}, (err2, res) => {
                if (err2) {
                    logger.error(`Error with ${resource_name}.update: `, err2);
                    return reject(err2);
                }

                // Save to history
                let history_collection = db.collection(`${collection_name}_${base_version}_History`);
                let history_resource = Object.assign(cleaned, {_id: id + cleaned.meta.versionId});

                // Insert our resource record to history but don't assign _id
                return history_collection.insertOne(history_resource, (err3) => {
                    if (err3) {
                        logger.error(`Error with ${resource_name}History.create: `, err3);
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
