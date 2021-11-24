/**
 * This file defines the custom query filters
 * The format is we specify the filter passed in the query.  then we define the resourceType for it and mappings that
 *  map the resource we're searching for that filter and the reference property in that resource to use
 */
const customReferenceQueries = {
    'patient': {
        'resourceType': 'Patient',
        'mappings': {
            'Patient': 'id',
            'AllergyIntolerance': 'patient.reference',
            'Immunization': 'patient.reference',
            'RelatedPerson': 'patient.reference',
            'Device': 'patient.reference',
            'ExplanationOfBenefit': 'patient.reference',
            'Claim': 'patient.reference',
            'Appointment': 'participant.actor.reference',
            'Account': 'subject.reference',
            'CarePlan': 'subject.reference',
            'Condition': 'subject.reference',
            'DocumentReference': 'subject.reference',
            'Encounter': 'subject.reference',
            'MedicationRequest': 'subject.reference',
            'Observation': 'subject.reference',
            'Procedure': 'subject.reference',
            'ServiceRequest': 'subject.reference',
            'CareTeam': 'subject.reference',
            'QuestionnaireResponse': 'subject.reference',
            'MeasureReport': 'subject.reference',
            'Coverage': 'beneficiary.reference',
            'AuditEvent': 'agent.who.reference',
            'Person': 'link.target.reference',
            'Schedule': 'actor.reference'
        }
    },
    'practitioner': {
        'resourceType': 'Practitioner',
        'mappings': {
            'Practitioner': 'id',
            'PractitionerRole': 'practitioner.reference',
            'Schedule': 'actor.reference'
        }
    },
    'organization': {
        'resourceType': 'Organization',
        'mappings': {
            'Organization': 'id',
            'HealthcareService': 'providedBy.reference',
            'InsurancePlan': 'ownedBy.reference',
            'PractitionerRole': 'organization.reference'
        }
    },
    'location': {
        'resourceType': 'Location',
        'mappings': {
            'Location': 'id',
            'PractitionerRole': 'location.reference',
            'Schedule': 'actor.reference'
        }
    },
    'healthcareService': {
        'resourceType': 'HealthcareService',
        'mappings': {
            'HealthcareService': 'id',
            'PractitionerRole': 'healthcareService.reference',
            'Schedule': 'actor.reference'
        }
    },
    'schedule': {
        'resourceType': 'Schedule',
        'mappings': {
            'Schedule': 'id',
            'Slot': 'schedule.reference'
        }
    },
    'agent': {
        'resourceType': 'Person',
        'mappings': {
            'Person': 'id',
            'AuditEvent': 'agent.who.reference'
        }
    }
};

/*
    The format is that we list the resourceType, then the filter name and then the type and name of field to filter
 */
const customScalarQueries = {
    'AuditEvent': {
        'date': {
            'type': 'instant',
            'field': 'recorded'
        }
    },
    'ValueSet': {
        'url': {
            'type': 'uri',
            'field': 'url'
        }
    }
};

module.exports = {
    customReferenceQueries: customReferenceQueries,
    customScalarQueries: customScalarQueries
};
