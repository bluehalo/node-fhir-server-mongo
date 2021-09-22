const {
    dateQueryBuilder,
    referenceQueryBuilder,
    nameQueryBuilder,
    stringQueryBuilder,
    addressQueryBuilder,
    tokenQueryBuilder
} = require('../../../utils/querybuilder.util');
const {isTrue} = require('../../common/isTrue');
/**
 * @type {import('winston').logger}
 */
const logger = require('@asymmetrik/node-fhir-server-core').loggers.get();

/**
 * Builds a mongo query for search parameters
 * @param {string} resource_name
 * @param {string[]} args
 * @returns {Object} A query object to use with Mongo
 */
module.exports.buildR4SearchQuery = (resource_name, args) => {
    // Common search params
    let {id} = args;
    let patient = args['patient'];
    let practitioner = args['practitioner'];
    let organization = args['organization'];
    let location = args['location'];
    let healthcareService = args['healthcareService'];
    let schedule = args['schedule'];
    let agent = args['agent'];
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
     * and segments
     * @type {Object[]}
     */
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
        query['meta.source'] = source;
    }

    if (versionId) {
        query['meta.versionId'] = versionId;
    }

    if (lastUpdated) {
        if (Array.isArray(lastUpdated)) {
            for (const lastUpdatedItem of lastUpdated) {
                and_segments.push({'meta.lastUpdated': dateQueryBuilder(lastUpdatedItem, 'instant', '')});
            }
        } else {
            query['meta.lastUpdated'] = dateQueryBuilder(lastUpdated, 'instant', '');
        }
    }
    if (patient || args['patient:missing']) {
        const patient_reference = 'Patient/' + patient;
        /**
         * @type {?boolean}
         */
        let patient_exists_flag = null;
        if (args['patient:missing']) {
            patient_exists_flag = !isTrue(args['patient:missing']);
        }
        // each Resource type has a different place to put the patient info
        if (['Patient'].includes(resource_name)) {
            query.id = patient;
        } else if (['AllergyIntolerance', 'Immunization', 'RelatedPerson', 'Device', 'ExplanationOfBenefit', 'Claim'].includes(resource_name)) {
            and_segments.push(referenceQueryBuilder(patient_reference, 'patient.reference', patient_exists_flag));
        } else if (['Appointment'].includes(resource_name)) {
            //TODO: participant is a list
            and_segments.push(referenceQueryBuilder(patient_reference, 'participant.actor.reference', patient_exists_flag));
        } else if ([
            'Account',
            'CarePlan',
            'Condition',
            'DocumentReference',
            'Encounter',
            'MedicationRequest',
            'Observation',
            'Procedure',
            'ServiceRequest',
            'CareTeam',
            'QuestionnaireResponse',
            'MeasureReport'].includes(resource_name)) {
            and_segments.push(referenceQueryBuilder(patient_reference, 'subject.reference', patient_exists_flag));
        } else if (['Coverage'].includes(resource_name)) {
            and_segments.push(referenceQueryBuilder(patient_reference, 'beneficiary.reference', patient_exists_flag));
        } else if (['AuditEvent'].includes(resource_name)) {
            and_segments.push(referenceQueryBuilder(patient_reference, 'agent.who.reference', patient_exists_flag));
        } else if (['Person'].includes(resource_name)) {
            and_segments.push(referenceQueryBuilder(patient_reference, 'link.target.reference', patient_exists_flag));
        } else if (['Schedule'].includes(resource_name)) {
            and_segments.push(referenceQueryBuilder(patient_reference, 'actor.reference', patient_exists_flag));
        } else {
            logger.info('user', `No mapping for searching by patient for ${resource_name}: `);
        }
    }
    if (practitioner || args['practitioner:missing']) {
        const practitioner_reference = 'Practitioner/' + practitioner;
        /**
         * @type {?boolean}
         */
        let practitioner_exists_flag = null;
        if (args['practitioner:missing']) {
            practitioner_exists_flag = !isTrue(args['practitioner:missing']);
        }

        // each Resource type has a different place to put the patient info
        if (['Practitioner'].includes(resource_name)) {
            query.id = practitioner;
        } else if (['PractitionerRole'].includes(resource_name)) {
            and_segments.push(referenceQueryBuilder(practitioner_reference, 'practitioner.reference', practitioner_exists_flag));
        } else if (['Schedule'].includes(resource_name)) {
            and_segments.push(referenceQueryBuilder(practitioner_reference, 'actor.reference', practitioner_exists_flag));
        } else {
            logger.error(`No mapping for searching by practitioner for ${resource_name}: `);
        }
    }
    if (organization || args['organization:missing']) {
        const organization_reference = 'Organization/' + organization;
        /**
         * @type {?boolean}
         */
        let organization_exists_flag = null;
        if (args['organization:missing']) {
            organization_exists_flag = !isTrue(args['organization:missing']);
        }

        // each Resource type has a different place to put the patient info
        if (['Organization'].includes(resource_name)) {
            query.id = organization;
        } else if (['HealthcareService'].includes(resource_name)) {
            and_segments.push(referenceQueryBuilder(organization_reference, 'providedBy.reference', organization_exists_flag));
        } else if (['InsurancePlan'].includes(resource_name)) {
            and_segments.push(referenceQueryBuilder(organization_reference, 'ownedBy.reference', organization_exists_flag));
        } else if (['PractitionerRole'].includes(resource_name)) {
            and_segments.push(referenceQueryBuilder(organization_reference, 'organization.reference', organization_exists_flag));
        } else {
            logger.error(`No mapping for searching by organization for ${resource_name}: `);
        }
    }
    if (location || args['location:missing']) {
        const location_reference = 'Location/' + location;
        /**
         * @type {?boolean}
         */
        let location_exists_flag = null;
        if (args['location:missing']) {
            location_exists_flag = !isTrue(args['location:missing']);
        }

        // each Resource type has a different place to put the patient info
        if (['Location'].includes(resource_name)) {
            query.id = location;
        } else if (['PractitionerRole'].includes(resource_name)) {
            and_segments.push(referenceQueryBuilder(location_reference, 'location.reference', location_exists_flag));
        } else if (['Schedule'].includes(resource_name)) {
            and_segments.push(referenceQueryBuilder(location_reference, 'actor.reference', location_exists_flag));
        } else {
            logger.error(`No mapping for searching by location for ${resource_name}: `);
        }
    }
    if (healthcareService || args['healthcareService:missing']) {
        const healthcareService_reference = 'HealthcareService/' + healthcareService;
        /**
         * @type {?boolean}
         */
        let healthcareService_exists_flag = null;
        if (args['healthcareService:missing']) {
            healthcareService_exists_flag = !isTrue(args['healthcareService:missing']);
        }

        // each Resource type has a different place to put the patient info
        if (['HealthcareService'].includes(resource_name)) {
            query.id = healthcareService;
        } else if (['PractitionerRole'].includes(resource_name)) {
            and_segments.push(referenceQueryBuilder(healthcareService_reference, 'healthcareService.reference', healthcareService_exists_flag));
        } else if (['Schedule'].includes(resource_name)) {
            and_segments.push(referenceQueryBuilder(healthcareService_reference, 'actor.reference', healthcareService_exists_flag));
        } else {
            logger.error(`No mapping for searching by healthcareService for ${resource_name}: `);
        }
    }
    if (schedule || args['schedule:missing']) {
        const schedule_reference = 'Schedule/' + schedule;
        /**
         * @type {?boolean}
         */
        let schedule_exists_flag = null;
        if (args['schedule:missing']) {
            schedule_exists_flag = !isTrue(args['schedule:missing']);
        }

        // each Resource type has a different place to put the patient info
        if (['Schedule'].includes(resource_name)) {
            query.id = schedule;
        } else if (['Slot'].includes(resource_name)) {
            and_segments.push(referenceQueryBuilder(schedule_reference, 'schedule.reference', schedule_exists_flag));
        } else {
            logger.error(`No mapping for searching by schedule for ${resource_name}: `);
        }
    }
    if (agent || args['agent:missing']) {
        const agent_reference = agent.includes('/') ? agent : ('Person/' + agent);
        /**
         * @type {?boolean}
         */
        let agent_exists_flag = null;
        if (args['agent:missing']) {
            agent_exists_flag = !isTrue(args['agent:missing']);
        }

        // each Resource type has a different place to put the patient info
        if (['Person'].includes(resource_name)) {
            query.id = agent;
        } else if (['AuditEvent'].includes(resource_name)) {
            and_segments.push(referenceQueryBuilder(agent_reference, 'agent.who.reference', agent_exists_flag));
        } else {
            logger.error(`No mapping for searching by agent for ${resource_name}: `);
        }
    }
    if (name) {
        if (['Practitioner'].includes(resource_name)) {
            if (name) {
                let orsName = nameQueryBuilder(name);
                for (let i = 0; i < orsName.length; i++) {
                    and_segments.push(orsName[`${i}`]);
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
            and_segments.push(orsAddress[`${i}`]);
        }
    }

    if (address_city) {
        query['address.city'] = stringQueryBuilder(address_city);
    }

    if (address_country) {
        query['address.country'] = stringQueryBuilder(address_country);
    }

    if (addressPostalCode) {
        query['address.postalCode'] = stringQueryBuilder(addressPostalCode);
    }

    if (address_state) {
        query['address.state'] = stringQueryBuilder(address_state);
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
    }
    if (type_) {
        let queryBuilder = tokenQueryBuilder(type_, 'code', 'type.coding', '');
        /**
         * @type {string}
         */
        for (let i in queryBuilder) {
            query[`${i}`] = queryBuilder[`${i}`];
        }
    }
    if (security) {
        let queryBuilder = tokenQueryBuilder(security, 'code', 'meta.security', '');
        /**
         * @type {string}
         */
        for (let i in queryBuilder) {
            query[`${i}`] = queryBuilder[`${i}`];
        }
    }
    if (tag) {
        let queryBuilder = tokenQueryBuilder(tag, 'code', 'meta.tag', '');
        /**
         * @type {string}
         */
        for (let i in queryBuilder) {
            query[`${i}`] = queryBuilder[`${i}`];
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
            query[`${i}`] = queryBuilder[`${i}`];
        }
    }

    // Forces system = 'phone'
    if (phone) {
        let queryBuilder = tokenQueryBuilder(phone, 'value', 'telecom', 'phone');
        for (let i in queryBuilder) {
            query[`${i}`] = queryBuilder[`${i}`];
        }
    }

    if (and_segments.length !== 0) {
        query.$and = and_segments;
    }
    return query;
};
