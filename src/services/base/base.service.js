const {VERSIONS} = require('@asymmetrik/node-fhir-server-core').constants;
const {resolveSchema} = require('@asymmetrik/node-fhir-server-core');
const {CLIENT_DB} = require('../../constants');
const moment = require('moment-timezone');
const globals = require('../../globals');
// noinspection JSCheckFunctionSignatures
const logger = require('@asymmetrik/node-fhir-server-core').loggers.get();
const {getUuid} = require('../../utils/uid.util');
const {validateResource} = require('../../utils/validator.util');
const {NotAllowedError, NotFoundError, BadRequestError, NotValidatedError} = require('../../utils/httpErrors');
const {validate, applyPatch, compare} = require('fast-json-patch');
const deepmerge = require('deepmerge');
const deepcopy = require('deepcopy');
const deepEqual = require('deep-equal');
const env = require('var');

let getResource = (base_version, resource_name) => {
    return resolveSchema(base_version, resource_name);
};

let getMeta = (base_version) => {
    return resolveSchema(base_version, 'Meta');
};

let logInfo = (msg) => {
    if (!env.IS_PRODUCTION) {
        logger.info(msg);
    }
};

const {
    stringQueryBuilder,
    tokenQueryBuilder,
    // referenceQueryBuilder,
    addressQueryBuilder,
    nameQueryBuilder,
    dateQueryBuilder,
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

    let address = args['address'];
    let address_city = args['address-city'];
    let address_country = args['address-country'];
    let address_postalcode = args['address-postalcode'];
    let address_state = args['address-state'];

    let identifier = args['identifier'];

    let gender = args['gender'];
    let email = args['email'];
    let phone = args['phone'];
    let source = args['source'];
    let versionId = args['versionId'];
    let lastUpdated = args['_lastUpdated']; // _lastUpdated=gt2010-10-01
    // Search Result params

    // let extension_missing = args['extension:missing'];
    // extension:missing=true

    // Patient search params
    let active = args['active'];

    let query = {};
    let and_segments = [];

    if (id) {
        // see if this is an array
        if (id.includes(',')) {
            const id_list = id.split(',');
            query.id = {
                $in: id_list
            };
        } else {
            query.id = id;
        }
    }

    if (source) {
        query['meta.source'] = stringQueryBuilder(source);
    }

    if (versionId) {
        query['meta.versionId'] = versionId;
    }

    if (lastUpdated) {
        logInfo('meta.lastUpdated:' + lastUpdated);
        if (Array.isArray(lastUpdated)) {
            for (const lastUpdatedItem of lastUpdated) {
                and_segments.push({'meta.lastUpdated': dateQueryBuilder(lastUpdatedItem, 'date', '')});
            }
        } else {
            query['meta.lastUpdated'] = dateQueryBuilder(lastUpdated, 'date', '');
        }
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
            if (name) {
                let orsName = nameQueryBuilder(name);
                for (let i = 0; i < orsName.length; i++) {
                    and_segments.push(orsName[i]);
                }
            }
        } else {
            query['name'] = stringQueryBuilder(name);
        }
    }
    if (family) {
        query['name.family'] = stringQueryBuilder(family);
    }

    if (address) {
        let orsAddress = addressQueryBuilder(address);
        for (let i = 0; i < orsAddress.length; i++) {
            and_segments.push(orsAddress[i]);
        }
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

    if (identifier) {
        let queryBuilder = tokenQueryBuilder(identifier, 'value', 'identifier', '');
        for (let i in queryBuilder) {
            // noinspection JSUnfilteredForInLoop
            query[i] = queryBuilder[i];
        }
    }
    if (active) {
        query.active = active === 'true';
    }

    if (gender) {
        query.gender = gender;
    }

    // Forces system = 'email'
    if (email) {
        let queryBuilder = tokenQueryBuilder(email, 'value', 'telecom', 'email');
        for (let i in queryBuilder) {
            // noinspection JSUnfilteredForInLoop
            query[i] = queryBuilder[i];
        }
    }

    // Forces system = 'phone'
    if (phone) {
        let queryBuilder = tokenQueryBuilder(phone, 'value', 'telecom', 'phone');
        for (let i in queryBuilder) {
            // noinspection JSUnfilteredForInLoop
            query[i] = queryBuilder[i];
        }
    }

    if (and_segments.length !== 0) {
        query.$and = and_segments;
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

let get_all_args = (req, args) => {
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
    return combined_args;
};

/**
 *
 * @param {*} args
 * @param resource_name
 * @param collection_name
 * @param {*} context
 */
module.exports.search = async (args, {req}, resource_name, collection_name) => {
    logInfo(resource_name + ' >>> search');
    logInfo('---- args ----');
    logInfo(args);
    logInfo('--------');
    const combined_args = get_all_args(req, args);

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

    let options = {};
    if (combined_args['_elements']) {
        const properties_to_return_as_csv = combined_args['_elements'];
        const properties_to_return_list = properties_to_return_as_csv.split(',');
        options = {['projection']: properties_to_return_list};
    }
    // Query our collection for this observation
    let cursor = await collection.find(query, options);
    // noinspection JSUnfilteredForInLoop
    if (combined_args['_sort']) {
        // GET [base]/Observation?_sort=status,-date,category
        // Each item in the comma separated list is a search parameter, optionally with a '-' prefix.
        // The prefix indicates decreasing order; in its absence, the parameter is applied in increasing order.
        const sort_properties_as_csv = combined_args['_sort'];
        const sort_properties_list = sort_properties_as_csv.split(',');
        for (let i in sort_properties_list) {
            // noinspection JSUnfilteredForInLoop
            const x = sort_properties_list[i];
            if (x.startsWith('-')) {
                // eslint-disable-next-line no-unused-vars
                const x1 = x.substring(1);
                cursor = cursor.sort({[x1]: -1});
            } else {
                cursor = cursor.sort({[x]: 1});
            }
        }
    }

    if (combined_args['_count']) {
        const nPerPage = Number(combined_args['_count']);

        if (combined_args['_getpagesoffset']) {
            const pageNumber = Number(combined_args['_getpagesoffset']);
            cursor = cursor.skip(pageNumber > 0 ? (pageNumber * nPerPage) : 0);
        }
        cursor = cursor.limit(nPerPage);
    } else {
        // set a limit so the server does not come down due to volume of data
        cursor = cursor.limit(1000);
    }

    // Resource is a resource cursor, pull documents out before resolving
    const resources = [];
    while (await cursor.hasNext()) {
        const element = await cursor.next();
        if (combined_args['_elements']) {
            const properties_to_return_as_csv = combined_args['_elements'];
            const properties_to_return_list = properties_to_return_as_csv.split(',');
            const element_to_return = new Resource();
            for (const property of properties_to_return_list) {
                if (property in element_to_return) {
                    // noinspection JSUnfilteredForInLoop
                    element_to_return[property] = element[property];
                }
            }
            resources.push(element_to_return);
        } else {
            resources.push(new Resource(element));
        }
    }

    if (env.RETURN_BUNDLE || combined_args['_bundle']) {
        const Bundle = getResource(base_version, 'bundle');
        const entries = resources.map(resource => {
            return {resource: resource};
        });
        return new Bundle({
            type: 'searchset',
            timestamp: moment.utc().format('YYYY-MM-DDThh:mm:ss.sss') + 'Z',
            entry: entries
        });
    } else {
        return resources;
    }
};

// eslint-disable-next-line no-unused-vars
module.exports.searchById = async (args, {req}, resource_name, collection_name) => {
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

    let resource;
    try {
        resource = await collection.findOne({id: id.toString()});
    } catch (e) {
        logger.error(`Error with ${resource_name}.searchById: `, e);
        throw new BadRequestError(e.message);
    }
    if (resource) {
        return new Resource(resource);
    } else {
        throw new NotFoundError();
    }
};

module.exports.create = async (args, {req}, resource_name, collection_name) => {
    logInfo(`${resource_name} >>> create`);

    let resource_incoming = req.body;

    let {base_version} = args;

    logInfo('--- request ----');
    logInfo(req);
    logInfo('-----------------');

    logInfo('--- body ----');
    logInfo(resource_incoming);
    logInfo('-----------------');

    const combined_args = get_all_args(req, args);
    if (env.VALIDATE_SCHEMA || combined_args['_validate']) {
        logInfo('--- validate schema ----');
        const operationOutcome = validateResource(resource_incoming, resource_name, req.path);
        if (operationOutcome && operationOutcome.statusCode === 400) {
            throw new NotValidatedError(operationOutcome);
        }
        logInfo('-----------------');
    }

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
    try {
        await collection.insertOne(doc);
    } catch (e) {
        throw new BadRequestError(e.message);
    }
    // Save the resource to history
    let history_collection = db.collection(`${collection_name}_${base_version}_History`);

    // Insert our resource record to history but don't assign _id
    await history_collection.insertOne(history_doc);
    return {id: doc.id, resource_version: doc.meta.versionId};
};

module.exports.update = async (args, {req}, resource_name, collection_name) => {
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

    const combined_args = get_all_args(req, args);
    if (env.VALIDATE_SCHEMA || combined_args['_validate']) {
        logInfo('--- validate schema ----');
        const operationOutcome = validateResource(resource_incoming, resource_name, req.path);
        if (operationOutcome && operationOutcome.statusCode === 400) {
            throw new NotValidatedError(operationOutcome);
        }
        logInfo('-----------------');
    }

    // Grab an instance of our DB and collection
    let db = globals.get(CLIENT_DB);
    let collection = db.collection(`${collection_name}_${base_version}`);

    // Get current record
    // Query our collection for this observation
    // noinspection JSUnresolvedVariable
    const data = await collection.findOne({id: id.toString()});
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
            return {
                id: id,
                created: false,
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
    const res = await collection.findOneAndUpdate({id: id}, {$set: doc}, {upsert: true});
    // save to history
    let history_collection = db.collection(`${collection_name}_${base_version}_History`);

    // let history_resource = Object.assign(cleaned, {id: id});
    let history_resource = Object.assign(cleaned, {_id: id + cleaned.meta.versionId});
    // delete history_resource['_id']; // make sure we don't have an _id field when inserting into history

    // Insert our resource record to history but don't assign _id
    await history_collection.insertOne(history_resource);

    return {
        id: id,
        created: res.lastErrorObject && !res.lastErrorObject.updatedExisting,
        resource_version: doc.meta.versionId,
    };
};

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

        let id = resource_to_merge.id;

        const combined_args = get_all_args(req, args);
        if (env.VALIDATE_SCHEMA || combined_args['_validate']) {
            logInfo('--- validate schema ----');
            const operationOutcome = validateResource(resource_to_merge, resource_name, req.path);
            if (operationOutcome && operationOutcome.statusCode === 400) {
                throw new NotValidatedError(operationOutcome);
            }
            logInfo('-----------------');
        }
        try {
            logInfo('-----------------');
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
                // compare without checking source so we don't create a new version just because of a difference in source
                const original_source = resource_to_merge.meta.source;
                resource_to_merge.meta.versionId = foundResource.meta.versionId;
                resource_to_merge.meta.lastUpdated = foundResource.meta.lastUpdated;
                resource_to_merge.meta.source = foundResource.meta.source;
                logInfo('------ incoming document --------');
                logInfo(resource_to_merge);
                logInfo('------ end incoming document --------');

                let mergeObjectOrArray;
                // noinspection JSUnusedGlobalSymbols,JSUnusedLocalSymbols
                const options = {
                    // eslint-disable-next-line no-unused-vars
                    customMerge: (key) => {
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
                        message: 'No changes detected in updated resource'
                    };
                }
                // now apply the patches to the found resource
                let patched_incoming_data = applyPatch(data, patchContent).newDocument;
                let patched_resource_incoming = new Resource(patched_incoming_data);
                // update the metadata to increment versionId
                let meta = foundResource.meta;
                meta.versionId = `${parseInt(foundResource.meta.versionId) + 1}`;
                meta.lastUpdated = moment.utc().format('YYYY-MM-DDTHH:mm:ssZ');
                // set the source from the incoming resource
                meta.source = original_source;
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
            delete history_resource['_id']; // make sure we don't have an _id field when inserting into history
            await history_collection.insertOne(history_resource);

            return {
                id: id,
                created: created_entity,
                updated: res.lastErrorObject.updatedExisting,
                resource_version: doc.meta.versionId
            };
        } catch (e) {
            logger.error(`Error with merging resource ${resource_name}.merge: `, e);
            return {
                resourceType: 'OperationOutcome',
                issue: [
                    {
                        severity: 'error',
                        code: 'exception',
                        details: {
                            text: 'Error merging: ' + resource_to_merge
                        },
                        diagnostics: e.toString(),
                        expression: [
                            resource_name + '/' + id
                        ]
                    }
                ]
            };
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
module.exports.everything = async (args, {req}, resource_name, collection_name) => {
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
        collection_name = 'Practitioner'; // for now we only support this for Practitioner
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
            const PractitionerRoleResource = getResource(base_version, collection_name);
            query = {
                'practitioner.reference': 'Practitioner/' + id
            };
            const cursor = collection.find(query);
            // noinspection JSUnresolvedFunction
            const practitioner_roles = await cursor.toArray();

            // noinspection JSUnresolvedFunction
            // const practitioner_roles = items;
            for (const index in practitioner_roles) {
                // noinspection JSUnfilteredForInLoop
                const practitioner_role = practitioner_roles[index];
                // for some reason a simple append doesn't work here
                entries = entries.concat(
                    [
                        {
                            'link': `https://${host}/${base_version}/${practitioner_role.resourceType}/${practitioner_role.id}`,
                            'resource': new PractitionerRoleResource(practitioner_role)
                        }
                    ]
                );
                // entries += {
                //     'resource': 'foo'
                // };
                // now for each PractitionerRole, get the Organization
                collection_name = 'Organization';
                collection = db.collection(`${collection_name}_${base_version}`);
                const OrganizationRoleResource = getResource(base_version, collection_name);
                if (practitioner_role.organization) {
                    const organization_id = practitioner_role.organization.reference.replace(collection_name + '/', '');

                    const organization = await collection.findOne({id: organization_id.toString()});
                    if (organization) {
                        entries = entries.concat(
                            [{
                                'link': `https://${host}/${base_version}/${organization.resourceType}/${organization.id}`,
                                'resource': new OrganizationRoleResource(organization)
                            }]);
                    }
                }
                // now for each PractitionerRole, get the Location
                collection_name = 'Location';
                collection = db.collection(`${collection_name}_${base_version}`);
                const LocationRoleResource = getResource(base_version, collection_name);
                if (practitioner_role.location && practitioner_role.location.length > 0) {
                    const location_id = practitioner_role.location[0].reference.replace(collection_name + '/', '');

                    const location = await collection.findOne({id: location_id.toString()});
                    if (location) {
                        entries = entries.concat(
                            [{
                                'link': `https://${host}/${base_version}/${location.resourceType}/${location.id}`,
                                'resource': new LocationRoleResource(location)
                            }]);
                    }
                }
                // now for each PractitionerRole, get the HealthcareService
                collection_name = 'HealthcareService';
                collection = db.collection(`${collection_name}_${base_version}`);
                const HealthcareServiceRoleResource = getResource(base_version, collection_name);
                if (practitioner_role.healthcareService && practitioner_role.healthcareService.length > 0) {
                    const healthcareService_id = practitioner_role.healthcareService[0].reference.replace(collection_name + '/', '');

                    const healthcareService = await collection.findOne({id: healthcareService_id.toString()});
                    if (healthcareService) {
                        entries = entries.concat(
                            [{
                                'link': `https://${host}/${base_version}/${healthcareService.resourceType}/${healthcareService.id}`,
                                'resource': new HealthcareServiceRoleResource(healthcareService)
                            }]);
                    }
                }
                // now for each PractitionerRole, get the InsurancePlan
                collection_name = 'InsurancePlan';
                collection = db.collection(`${collection_name}_${base_version}`);
                const InsurancePlanResource = getResource(base_version, collection_name);
                if (practitioner_role.extension && practitioner_role.extension.length > 0) {
                    const first_level_extension = practitioner_role.extension[0];
                    if (first_level_extension.url.endsWith('insurance_plan') && first_level_extension.extension.length > 0) {
                        const insurancePlanId = first_level_extension.extension[0].valueReference.reference.replace(collection_name + '/', '');

                        const insurancePlan = await collection.findOne({id: insurancePlanId.toString()});
                        if (insurancePlan) {
                            entries = entries.concat(
                                [{
                                    'link': `https://${host}/${base_version}/${insurancePlan.resourceType}/${insurancePlan.id}`,
                                    'resource': new InsurancePlanResource(insurancePlan)
                                }]);
                        }
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
        throw new BadRequestError(err.message);
    }
};

// eslint-disable-next-line no-unused-vars
module.exports.remove = async (args, {req}, resource_name, collection_name) => {
    logInfo(`${resource_name} >>> remove`);

    let {base_version, id} = args;

    logInfo(`Deleting id=${id}`);

    // Grab an instance of our DB and collection
    let db = globals.get(CLIENT_DB);
    let collection = db.collection(`${collection_name}_${base_version}`);
    // Delete our resource record
    let res;
    try {
        res = await collection.deleteOne({id: id});
    } catch (e) {
        logger.error(`Error with ${resource_name}.remove`);
        throw new NotAllowedError(e.message);
    }
    // delete history as well.  You can chose to save history.  Up to you
    let history_collection = db.collection(`${collection_name}_${base_version}_History`);
    try {
        await history_collection.deleteMany({id: id});
    } catch (e) {
        logger.error(`Error with ${resource_name}.remove`);
        throw new NotAllowedError(e.message);
    }
    return {deleted: res.result && res.result.n};
};

// eslint-disable-next-line no-unused-vars
module.exports.searchByVersionId = async (args, {req}, resource_name, collection_name) => {
    logInfo(`${resource_name} >>> searchByVersionId`);

    let {base_version, id, version_id} = args;

    let Resource = getResource(base_version, resource_name);

    let db = globals.get(CLIENT_DB);
    let history_collection = db.collection(`${collection_name}_${base_version}_History`);

    // Query our collection for this observation
    let resource;
    try {
        resource = await history_collection.findOne(
            {id: id.toString(), 'meta.versionId': `${version_id}`});
    } catch (e) {
        throw new BadRequestError(e.message);
    }
    if (resource) {
        return (new Resource(resource));
    } else {
        throw new NotFoundError();
    }
};

// eslint-disable-next-line no-unused-vars
module.exports.history = async (args, {req}, resource_name, collection_name) => {
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
    let cursor;
    try {
        cursor = await history_collection.find(query);
    } catch (e) {
        throw new NotFoundError(e.message);
    }
    const resources = [];
    while (await cursor.hasNext()) {
        const element = await cursor.next();
        resources.push(new Resource(element));
    }
    if (resources.length === 0) {
        throw new NotFoundError();
    }
    return (resources);
};

// eslint-disable-next-line no-unused-vars
module.exports.historyById = async (args, {req}, resource_name, collection_name) => {
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
    let cursor;
    try {
        cursor = await history_collection.find(query);
    } catch (e) {
        logger.error(`Error with ${resource_name}.historyById: `, e);
        throw new BadRequestError(e.message);
    }
    const resources = [];
    while (await cursor.hasNext()) {
        const element = await cursor.next();
        resources.push(new Resource(element));
    }
    if (resources.length === 0) {
        throw new NotFoundError();
    }
    return (resources);
};

// eslint-disable-next-line no-unused-vars
module.exports.patch = async (args, {req}, resource_name, collection_name) => {
    logInfo('Patient >>> patch');

    let {base_version, id, patchContent} = args;

    // Grab an instance of our DB and collection
    let db = globals.get(CLIENT_DB);
    let collection = db.collection(`${collection_name}_${base_version}`);

    // Get current record
    // Query our collection for this observation
    let data;
    try {
        data = await collection.findOne({id: id.toString()});
    } catch (e) {
        logger.error(`Error with ${resource_name}.patch: `, e);
        throw new BadRequestError(e.message);
    }
    if (!data) {
        throw new NotFoundError();
    }
    // Validate the patch
    let errors = validate(patchContent, data);
    if (errors && Object.keys(errors).length > 0) {
        logger.error('Error with patch contents');
        throw new BadRequestError(errors.toString());
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
        throw new BadRequestError('Unable to patch resource. Missing either data or metadata.');
    }

    // Same as update from this point on
    let cleaned = JSON.parse(JSON.stringify(resource));
    let doc = Object.assign(cleaned, {_id: id});

    // Insert/update our resource record
    let res;
    try {
        res = await collection.findOneAndUpdate({id: id}, {$set: doc}, {upsert: true});
    } catch (e) {
        logger.error(`Error with ${resource_name}.update: `, e);
        throw new BadRequestError(e.message);
    }
    // Save to history
    let history_collection = db.collection(`${collection_name}_${base_version}_History`);
    let history_resource = Object.assign(cleaned, {_id: id + cleaned.meta.versionId});

    // Insert our resource record to history but don't assign _id
    try {
        await history_collection.insertOne(history_resource);
    } catch (e) {
        logger.error(`Error with ${resource_name}History.create: `, e);
        throw new BadRequestError(e.message);
    }
    return {
        id: doc.id,
        created: res.lastErrorObject && !res.lastErrorObject.updatedExisting,
        resource_version: doc.meta.versionId,
    };
};

// noinspection JSUnusedLocalSymbols
// eslint-disable-next-line no-unused-vars
module.exports.validate = async (args, {req}, resource_name, collection_name) => {
    logInfo(`${resource_name} >>> validate`);

    let resource_incoming = req.body;

    // eslint-disable-next-line no-unused-vars
    // let {base_version} = args;

    logInfo('--- request ----');
    logInfo(req);
    logInfo('-----------------');

    logInfo('--- body ----');
    logInfo(resource_incoming);
    logInfo('-----------------');


    logInfo('--- validate schema ----');
    const operationOutcome = validateResource(resource_incoming, resource_name, req.path);
    if (operationOutcome && operationOutcome.statusCode === 400) {
        return operationOutcome;
    }

    return {
        resourceType: 'OperationOutcome',
        issue: [
            {
                severity: 'information',
                code: 'informational',
                details: {
                    text: 'OK'
                },
                expression: [
                    resource_name
                ]
            }
        ]
    };
};
