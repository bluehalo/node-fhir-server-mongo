/**
 * This file defines the custom query filters
 */
/**
 * This is the enum for the types of filters we support
 */
const fhirFilterTypes = {
    /**
     * example usage: ?param=id1 where id1 is the id of the resource we're finding references to
     */
    reference: 'reference',
    /**
     * example usage: ?param={system}|{code} will require both to match
     * example usage: ?param={system}| will match only on system
     * example usage: ?param=code will match only on code
     */
    token: 'token',
    /**
     * example usage: ?param=lt{date}&date=gt{date}
     * can also pass in exact date e.g., ?param={date}
     */
    date: 'date',
    /**
     * example usage: ?param=lt{date}&date=gt{date}
     * can also pass in exact date e.g., ?param={date}
     */
    datetime: 'datetime',
    /**
     * example usage: ?param=lt{date}&date=gt{date}
     * can also pass in exact date e.g., ?param={date}
     */
    instant: 'instant',
    /**
     * example usage: ?param=lt{date}&date=gt{date}
     * can also pass in exact date e.g., ?param={date}
     */
    period: 'period',
    /**
     *     example usage: ?param=bar
     *     can also pass in multiple values separated by comma which are combined in an OR e.g., ?param=bar1,bar2
     */
    string: 'string',
    /**
     *     example usage: ?param=bar
     *     can also pass in multiple values separated by comma which are combined in an OR e.g., ?param=bar1,bar2
     */
    uri: 'uri',
    /**
     * usage: ?param=imran@hotmail.com
     */
    email: 'email',
    /**
     * usage: ?param=4086669999
     */
    phone: 'phone'
};
/**
 Try to keep this in list in alphabetical order to make it easier to search
 Follow the FHIR standard for any additions

 From: https://www.hl7.org/fhir/searchparameter-registry.html

 Format of items in this list:
 '{resourceType or * if this applies to all resources}': {
        '{queryParameter}': {
            'type': {type of filter},
            'field': '{field name in resourceType to filter}',
            'target': '{if type is reference then the resourceType of the referenced resource}'
        }
    },

 */
const customFilterQueries = {
    'Account': {
        'patient': {
            'type': fhirFilterTypes.reference,
            'field': 'subject.reference',
            'target': 'Patient'
        }
    },
    'AllergyIntolerance': {
        'code': {
            'type': fhirFilterTypes.token,
            'field': 'code'
        },
        'date': {
            'type': fhirFilterTypes.dateTime,
            'field': 'recordedDate'
        },
        'patient': {
            'type': fhirFilterTypes.reference,
            'field': 'patient.reference',
            'target': 'Patient'
        },
        'type': {
            'type': fhirFilterTypes.token,
            'field': 'type'
        }
    },
    'Appointment': {
        'patient': {
            'type': fhirFilterTypes.reference,
            'field': 'participant.actor.reference',
            'target': 'Patient'
        }
    },
    'AuditEvent': {
        'date': {
            'type': fhirFilterTypes.instant,
            'field': 'recorded'
        },
        'patient': {
            'type': fhirFilterTypes.reference,
            'field': 'agent.who.reference',
            'target': 'Patient'
        },
        'agent': {
            'type': fhirFilterTypes.reference,
            'field': 'agent.who.reference',
            'target': 'Person'
        }
    },
    'CapabilityStatement': {
        'date': {
            'type': fhirFilterTypes.dateTime,
            'field': 'date'
        },
        'name': {
            'type': fhirFilterTypes.string,
            'field': 'name'
        },
        'status': {
            'type': fhirFilterTypes.string,
            'field': 'status'
        },
        'url': {
            'type': fhirFilterTypes.uri,
            'field': 'url'
        },
        'version': {
            'type': fhirFilterTypes.token,
            'field': 'version'
        }
    },
    'CarePlan': {
        'date': {
            'type': fhirFilterTypes.period,
            'field': 'period'
        },
        'patient': {
            'type': fhirFilterTypes.reference,
            'field': 'subject.reference',
            'target': 'Patient'
        }
    },
    'CareTeam': {
        'date': {
            'type': fhirFilterTypes.period,
            'field': 'period'
        },
        'patient': {
            'type': fhirFilterTypes.reference,
            'field': 'subject.reference',
            'target': 'Patient'
        }
    },
    'Claim': {
        'patient': {
            'type': fhirFilterTypes.reference,
            'field': 'patient.reference',
            'target': 'Patient'
        }
    },
    'ClinicalImpression': {
        'date': {
            'type': fhirFilterTypes.dateTime,
            'field': 'date'
        },
        'patient': {
            'type': fhirFilterTypes.reference,
            'field': 'subject.reference',
            'target': 'Patient'
        }
    },
    'CodeSystem': {
        'name': {
            'type': fhirFilterTypes.string,
            'field': 'name'
        },
        'date': {
            'type': fhirFilterTypes.dateTime,
            'field': 'date'
        },
        'status': {
            'type': fhirFilterTypes.string,
            'field': 'status'
        },
        'url': {
            'type': fhirFilterTypes.uri,
            'field': 'url'
        },
        'version': {
            'type': fhirFilterTypes.token,
            'field': 'version'
        }
    },
    'CompartmentDefinition': {
        'name': {
            'type': fhirFilterTypes.string,
            'field': 'name'
        },
        'date': {
            'type': fhirFilterTypes.dateTime,
            'field': 'date'
        },
        'status': {
            'type': fhirFilterTypes.string,
            'field': 'status'
        },
        'url': {
            'type': fhirFilterTypes.uri,
            'field': 'url'
        },
        'version': {
            'type': fhirFilterTypes.token,
            'field': 'version'
        }
    },
    'Composition': {
        'date': {
            'type': fhirFilterTypes.dateTime,
            'field': 'date'
        },
        'patient': {
            'type': fhirFilterTypes.reference,
            'field': 'subject.reference',
            'target': 'Patient'
        },
        'type': {
            'type': fhirFilterTypes.token,
            'field': 'type'
        }
    },
    'ConceptMap': {
        'name': {
            'type': fhirFilterTypes.string,
            'field': 'name'
        },
        'date': {
            'type': fhirFilterTypes.dateTime,
            'field': 'date'
        },
        'status': {
            'type': fhirFilterTypes.string,
            'field': 'status'
        },
        'url': {
            'type': fhirFilterTypes.uri,
            'field': 'url'
        },
        'version': {
            'type': fhirFilterTypes.token,
            'field': 'version'
        }
    },
    'Condition': {
        'code': {
            'type': fhirFilterTypes.token,
            'field': 'code'
        },
        'patient': {
            'type': fhirFilterTypes.reference,
            'field': 'subject.reference',
            'target': 'Patient'
        }
    },
    'Consent': {
        'date': {
            'type': fhirFilterTypes.dateTime,
            'field': 'dateTime'
        },
        'patient': {
            'type': fhirFilterTypes.reference,
            'field': 'patient.reference',
            'target': 'Patient'
        }
    },
    'Coverage': {
        'patient': {
            'type': fhirFilterTypes.reference,
            'field': 'beneficiary.reference',
            'target': 'Patient'
        }
    },
    'DetectedIssue': {
        'patient': {
            'type': fhirFilterTypes.reference,
            'field': 'patient.reference',
            'target': 'Patient'
        }
    },
    'Device': {
        'patient': {
            'type': fhirFilterTypes.reference,
            'field': 'patient.reference',
            'target': 'Patient'
        }
    },
    'DeviceRequest': {
        'code': {
            'type': fhirFilterTypes.token,
            'field': 'code'
        },
        'patient': {
            'type': fhirFilterTypes.reference,
            'field': 'subject.reference',
            'target': 'Patient'
        }
    },
    'DeviceUseStatement': {
        'patient': {
            'type': fhirFilterTypes.reference,
            'field': 'subject.reference',
            'target': 'Patient'
        }
    },
    'DiagnosticReport': {
        'code': {
            'type': fhirFilterTypes.token,
            'field': 'code'
        },
        'date': {
            'type': fhirFilterTypes.dateTime,
            'field': 'effectiveDateTime'
        },
        'patient': {
            'type': fhirFilterTypes.reference,
            'field': 'subject.reference',
            'target': 'Patient'
        }
    },
    'DocumentManifest': {
        'patient': {
            'type': fhirFilterTypes.reference,
            'field': 'subject.reference',
            'target': 'Patient'
        },
        'type': {
            'type': fhirFilterTypes.token,
            'field': 'type'
        }
    },
    'DocumentReference': {
        'patient': {
            'type': fhirFilterTypes.reference,
            'field': 'subject.reference',
            'target': 'Patient'
        },
        'type': {
            'type': fhirFilterTypes.token,
            'field': 'type'
        }
    },
    'Encounter': {
        'date': {
            'type': fhirFilterTypes.period,
            'field': 'period'
        },
        'patient': {
            'type': fhirFilterTypes.reference,
            'field': 'subject.reference',
            'target': 'Patient'
        },
        'type': {
            'type': fhirFilterTypes.token,
            'field': 'type'
        }
    },
    'EpisodeOfCare': {
        'date': {
            'type': fhirFilterTypes.period,
            'field': 'period'
        },
        'patient': {
            'type': fhirFilterTypes.reference,
            'field': 'patient.reference',
            'target': 'Patient'
        },
        'type': {
            'type': fhirFilterTypes.token,
            'field': 'type'
        }
    },
    'ExplanationOfBenefit': {
        'patient': {
            'type': fhirFilterTypes.reference,
            'field': 'patient.reference',
            'target': 'Patient'
        }
    },
    'FamilyMemberHistory': {
        'code': {
            'type': fhirFilterTypes.token,
            'field': 'code'
        },
        'date': {
            'type': fhirFilterTypes.dateTime,
            'field': 'date'
        },
        'patient': {
            'type': fhirFilterTypes.reference,
            'field': 'patient.reference',
            'target': 'Patient'
        }
    },
    'Flag': {
        'date': {
            'type': fhirFilterTypes.period,
            'field': 'period'
        },
        'patient': {
            'type': fhirFilterTypes.reference,
            'field': 'subject.reference',
            'target': 'Patient'
        }
    },
    'Goal': {
        'patient': {
            'type': fhirFilterTypes.reference,
            'field': 'subject.reference',
            'target': 'Patient'
        }
    },
    'GraphDefinition': {
        'name': {
            'type': fhirFilterTypes.string,
            'field': 'name'
        },
        'date': {
            'type': fhirFilterTypes.dateTime,
            'field': 'date'
        },
        'status': {
            'type': fhirFilterTypes.string,
            'field': 'status'
        },
        'url': {
            'type': fhirFilterTypes.uri,
            'field': 'url'
        },
        'version': {
            'type': fhirFilterTypes.token,
            'field': 'version'
        }
    },
    'HealthcareService': {
        'healthcareService': {
            'type': fhirFilterTypes.string,
            'field': 'id'
        },
        'organization': {
            'type': fhirFilterTypes.reference,
            'field': 'providedBy.reference',
            'target': 'Organization'
        }
    },
    'ImagingStudy': {
        'patient': {
            'type': fhirFilterTypes.reference,
            'field': 'subject.reference',
            'target': 'Patient'
        }
    },
    'ImplementationGuide': {
        'name': {
            'type': fhirFilterTypes.string,
            'field': 'name'
        },
        'date': {
            'type': fhirFilterTypes.dateTime,
            'field': 'date'
        },
        'status': {
            'type': fhirFilterTypes.string,
            'field': 'status'
        },
        'url': {
            'type': fhirFilterTypes.uri,
            'field': 'url'
        },
        'version': {
            'type': fhirFilterTypes.token,
            'field': 'version'
        }
    },
    'Immunization': {
        'date': {
            'type': fhirFilterTypes.dateTime,
            'field': 'occurrenceDateTime'
        },
        'patient': {
            'type': fhirFilterTypes.reference,
            'field': 'patient.reference',
            'target': 'Patient'
        }
    },
    'InsurancePlan': {
        'organization': {
            'type': fhirFilterTypes.reference,
            'field': 'ownedBy.reference',
            'target': 'Organization'
        }
    },
    'Location': {
        'location': {
            'type': fhirFilterTypes.string,
            'field': 'id'
        }
    },
    'List': {
        'code': {
            'type': fhirFilterTypes.token,
            'field': 'code'
        },
        'date': {
            'type': fhirFilterTypes.dateTime,
            'field': 'date'
        },
        'patient': {
            'type': fhirFilterTypes.reference,
            'field': 'subject.reference',
            'target': 'Patient'
        }
    },
    'MeasureReport': {
        'patient': {
            'type': fhirFilterTypes.reference,
            'field': 'subject.reference',
            'target': 'Patient'
        }
    },
    'Medication': {
        'code': {
            'type': fhirFilterTypes.token,
            'field': 'code'
        }
    },
    'MedicationAdministration': {
        'code': {
            'type': fhirFilterTypes.token,
            'field': 'code'
        },
        'patient': {
            'type': fhirFilterTypes.reference,
            'field': 'subject.reference',
            'target': 'Patient'
        },
        'status': {
            'type': fhirFilterTypes.string,
            'field': 'status'
        }

    },
    'MedicationDispense': {
        'code': {
            'type': fhirFilterTypes.token,
            'field': 'code'
        },
        'patient': {
            'type': fhirFilterTypes.reference,
            'field': 'subject.reference',
            'target': 'Patient'
        },
        'status': {
            'type': fhirFilterTypes.string,
            'field': 'status'
        }

    },
    'MedicationRequest': {
        'code': {
            'type': fhirFilterTypes.token,
            'field': 'code'
        },
        'patient': {
            'type': fhirFilterTypes.reference,
            'field': 'subject.reference',
            'target': 'Patient'
        },
        'status': {
            'type': fhirFilterTypes.string,
            'field': 'status'
        }
    },
    'MedicationStatement': {
        'code': {
            'type': fhirFilterTypes.token,
            'field': 'code'
        },
        'patient': {
            'type': fhirFilterTypes.reference,
            'field': 'subject.reference',
            'target': 'Patient'
        },
        'status': {
            'type': fhirFilterTypes.string,
            'field': 'status'
        }
    },
    'MessageDefinition': {
        'name': {
            'type': fhirFilterTypes.string,
            'field': 'name'
        },
        'date': {
            'type': fhirFilterTypes.dateTime,
            'field': 'date'
        },
        'status': {
            'type': fhirFilterTypes.string,
            'field': 'status'
        },
        'url': {
            'type': fhirFilterTypes.uri,
            'field': 'url'
        },
        'version': {
            'type': fhirFilterTypes.token,
            'field': 'version'
        }
    },
    'NamingSystem': {
        'name': {
            'type': fhirFilterTypes.string,
            'field': 'name'
        },
        'date': {
            'type': fhirFilterTypes.dateTime,
            'field': 'date'
        },
        'status': {
            'type': fhirFilterTypes.string,
            'field': 'status'
        }
    },
    'NutritionOrder': {
        'patient': {
            'type': fhirFilterTypes.reference,
            'field': 'patient.reference',
            'target': 'Patient'
        }
    },
    'Observation': {
        'code': {
            'type': fhirFilterTypes.token,
            'field': 'code'
        },
        'date': {
            'type': fhirFilterTypes.period,
            'field': 'effectivePeriod'
        },
        'patient': {
            'type': fhirFilterTypes.reference,
            'field': 'subject.reference',
            'target': 'Patient'
        }
    },
    'OperationDefinition': {
        'name': {
            'type': fhirFilterTypes.string,
            'field': 'name'
        },
        'date': {
            'type': fhirFilterTypes.dateTime,
            'field': 'date'
        },
        'status': {
            'type': fhirFilterTypes.string,
            'field': 'status'
        },
        'url': {
            'type': fhirFilterTypes.uri,
            'field': 'url'
        },
        'version': {
            'type': fhirFilterTypes.token,
            'field': 'version'
        }
    },
    'Organization': {
        'organization': {
            'type': fhirFilterTypes.string,
            'field': 'id'
        }
    },
    'Patient': {
        'patient': {
            'type': fhirFilterTypes.string,
            'field': 'id'
        },
        'birthdate': {
            'type': fhirFilterTypes.dateTime,
            'field': 'birthDate'
        },
        'email': {
            'type': fhirFilterTypes.email,
            'field': 'telecom'
        },
        'phone': {
            'type': fhirFilterTypes.phone,
            'field': 'telecom'
        }
    },
    'Person': {
        'agent': {
            'type': fhirFilterTypes.string,
            'field': 'id'
        },
        'patient': {
            'type': fhirFilterTypes.reference,
            'field': 'link.target.reference',
            'target': 'Patient'
        },
        'birthdate': {
            'type': fhirFilterTypes.dateTime,
            'field': 'birthDate'
        },
        'email': {
            'type': fhirFilterTypes.email,
            'field': 'telecom'
        },
        'phone': {
            'type': fhirFilterTypes.phone,
            'field': 'telecom'
        }
    },
    'Practitioner': {
        'practitioner': {
            'type': fhirFilterTypes.string,
            'field': 'id'
        },
        'email': {
            'type': fhirFilterTypes.email,
            'field': 'telecom'
        },
        'phone': {
            'type': fhirFilterTypes.phone,
            'field': 'telecom'
        }
    },
    'PractitionerRole': {
        'practitioner': {
            'type': fhirFilterTypes.reference,
            'field': 'practitioner.reference',
            'target': 'Practitioner'
        },
        'organization': {
            'type': fhirFilterTypes.reference,
            'field': 'organization.reference',
            'target': 'Organization'
        },
        'location': {
            'type': fhirFilterTypes.reference,
            'field': 'location.reference',
            'target': 'Location'
        },
        'healthcareService': {
            'type': fhirFilterTypes.reference,
            'field': 'healthcareService.reference',
            'target': 'HealthcareService'
        },
        'email': {
            'type': fhirFilterTypes.email,
            'field': 'telecom'
        },
        'phone': {
            'type': fhirFilterTypes.phone,
            'field': 'telecom'
        }
    },
    'Procedure': {
        'code': {
            'type': fhirFilterTypes.token,
            'field': 'code'
        },
        'date': {
            'type': fhirFilterTypes.dateTime,
            'field': 'performedDateTime'
        },
        'patient': {
            'type': fhirFilterTypes.reference,
            'field': 'subject.reference',
            'target': 'Patient'
        }
    },
    'QuestionnaireResponse': {
        'patient': {
            'type': fhirFilterTypes.reference,
            'field': 'subject.reference',
            'target': 'Patient'
        }
    },
    'RelatedPerson': {
        'patient': {
            'type': fhirFilterTypes.reference,
            'field': 'patient.reference',
            'target': 'Patient'
        },
        'birthdate': {
            'type': fhirFilterTypes.dateTime,
            'field': 'birthDate'
        },
        'email': {
            'type': fhirFilterTypes.email,
            'field': 'telecom'
        },
        'phone': {
            'type': fhirFilterTypes.phone,
            'field': 'telecom'
        }
    },
    'RiskAssessment': {
        'date': {
            'type': fhirFilterTypes.dateTime,
            'field': 'occurrenceDateTime'
        },
        'patient': {
            'type': fhirFilterTypes.reference,
            'field': 'subject.reference',
            'target': 'Patient'
        }
    },
    'Schedule': {
        'schedule': {
            'type': fhirFilterTypes.string,
            'field': 'id'
        },
        'patient': {
            'type': fhirFilterTypes.reference,
            'field': 'actor.reference',
            'target': 'Patient'
        },
        'practitioner': {
            'type': fhirFilterTypes.reference,
            'field': 'actor.reference',
            'target': 'Practitioner'
        },
        'location': {
            'type': fhirFilterTypes.reference,
            'field': 'actor.reference',
            'target': 'Location'
        },
        'healthcareService': {
            'type': fhirFilterTypes.reference,
            'field': 'actor.reference',
            'target': 'HealthcareService'
        }
    },
    'SearchParameter': {
        'name': {
            'type': fhirFilterTypes.string,
            'field': 'name'
        },
        'date': {
            'type': fhirFilterTypes.dateTime,
            'field': 'date'
        },
        'status': {
            'type': fhirFilterTypes.string,
            'field': 'status'
        },
        'url': {
            'type': fhirFilterTypes.uri,
            'field': 'url'
        },
        'version': {
            'type': fhirFilterTypes.token,
            'field': 'version'
        }
    },
    'ServiceRequest': {
        'code': {
            'type': fhirFilterTypes.token,
            'field': 'code'
        },
        'patient': {
            'type': fhirFilterTypes.reference,
            'field': 'subject.reference',
            'target': 'Patient'
        }
    },
    'Slot': {
        'schedule': {
            'type': fhirFilterTypes.reference,
            'field': 'schedule.reference',
            'target': 'Schedule'
        }
    },
    'StructureDefinition': {
        'name': {
            'type': fhirFilterTypes.string,
            'field': 'name'
        },
        'date': {
            'type': fhirFilterTypes.dateTime,
            'field': 'date'
        },
        'status': {
            'type': fhirFilterTypes.string,
            'field': 'status'
        },
        'url': {
            'type': fhirFilterTypes.uri,
            'field': 'url'
        },
        'version': {
            'type': fhirFilterTypes.token,
            'field': 'version'
        }
    },
    'StructureMap': {
        'name': {
            'type': fhirFilterTypes.string,
            'field': 'name'
        },
        'date': {
            'type': fhirFilterTypes.dateTime,
            'field': 'date'
        },
        'status': {
            'type': fhirFilterTypes.string,
            'field': 'status'
        },
        'url': {
            'type': fhirFilterTypes.uri,
            'field': 'url'
        },
        'version': {
            'type': fhirFilterTypes.token,
            'field': 'version'
        }
    },
    'SupplyRequest': {
        'date': {
            'type': fhirFilterTypes.dateTime,
            'field': 'occurrenceDateTime'
        }
    },
    'SupplyDelivery': {
        'patient': {
            'type': fhirFilterTypes.reference,
            'field': 'patient.reference',
            'target': 'Patient'
        }
    },
    'TerminologyCapabilities': {
        'name': {
            'type': fhirFilterTypes.string,
            'field': 'name'
        },
        'date': {
            'type': fhirFilterTypes.dateTime,
            'field': 'date'
        },
        'status': {
            'type': fhirFilterTypes.string,
            'field': 'status'
        },
        'url': {
            'type': fhirFilterTypes.uri,
            'field': 'url'
        },
        'version': {
            'type': fhirFilterTypes.token,
            'field': 'version'
        }
    },
    'ValueSet': {
        'name': {
            'type': fhirFilterTypes.string,
            'field': 'name'
        },
        'date': {
            'type': fhirFilterTypes.dateTime,
            'field': 'date'
        },
        'url': {
            'type': fhirFilterTypes.uri,
            'field': 'url'
        },
        'status': {
            'type': fhirFilterTypes.string,
            'field': 'status'
        },
        'version': {
            'type': fhirFilterTypes.token,
            'field': 'version'
        }
    },
    'VisionPrescription': {
        'patient': {
            'type': fhirFilterTypes.reference,
            'field': 'patient.reference',
            'target': 'Patient'
        }
    }
};

module.exports = {
    fhirFilterTypes: fhirFilterTypes,
    customFilterQueries: customFilterQueries
};
