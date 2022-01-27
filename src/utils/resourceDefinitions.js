/**
 * This file specifies information for FHIR resources shown on the home opage
 */

const resourceDefinitions = [
    {
        name: 'Patient',
        description: 'Demographics and other administrative information about an individual or animal receiving care or other health-related services.',
        url: 'https://www.hl7.org/fhir/patient.html'
    },
    {
        name: 'Practitioner',
        description: 'A person who is directly or indirectly involved in the provisioning of healthcare.',
        url: 'https://hl7.org/fhir/practitioner.html'
    },
    {
        name: 'PractitionerRole',
        description: 'A specific set of Roles/Locations/specialties/services that a practitioner may perform at an organization for a period of time.',
        url: 'http://hl7.org/fhir/R4/practitionerrole.html'
    },
    {
        name: 'Location',
        description: 'Details and position information for a physical place where services are provided and resources and participants may be stored, found, contained, or accommodated.',
        url: 'http://hl7.org/fhir/R4/location.html'
    },
    {
        name: 'Organization',
        description: 'A formally or informally recognized grouping of people or organizations formed for the purpose of achieving some form of collective action. Includes companies, institutions, corporations, departments, community groups, healthcare practice groups, payer/insurer, etc.',
        url: 'http://hl7.org/fhir/R4/organization.html'
    },
    {
        name: 'ExplanationOfBenefit',
        description: 'This resource provides: the claim details; adjudication details from the processing of a Claim; and optionally account balance information, for informing the subscriber of the benefits provided.',
        url: 'http://hl7.org/fhir/R4/explanationofbenefit.html'
    },
    {
        name: 'AuditEvent',
        description: 'A record of an event made for purposes of maintaining a security log. Typical uses include detection of intrusion attempts and monitoring for inappropriate usage.',
        url: 'https://www.hl7.org/fhir/auditevent.html'
    },
    {
        name: 'Person',
        description: 'Demographics and administrative information about a person independent of a specific health-related context.',
        url: 'https://www.hl7.org/fhir/person.html'
    },
    {
        name: 'Condition',
        description: 'A clinical condition, problem, diagnosis, or other event, situation, issue, or clinical concept that has risen to a level of concern.',
        url: 'https://www.hl7.org/fhir/condition.html'
    },
    {
        name: 'Observation',
        description: 'Measurements and simple assertions made about a patient, device or other subject.',
        url: 'https://www.hl7.org/fhir/observation.html'
    },
    {
        name: 'Appointment',
        description: 'A booking of a healthcare event among patient(s), practitioner(s), related person(s) and/or device(s) for a specific date/time. This may result in one or more Encounter(s).',
        url: 'https://www.hl7.org/fhir/appointment.html'
    },
    {
        name: 'Coverage',
        description: 'Financial instrument which may be used to reimburse or pay for health care products and services. Includes both insurance and self-payment.',
        url: 'https://www.hl7.org/fhir/coverage.html'
    },
    {
        name: 'Schedule',
        description: 'A container for slots of time that may be available for booking appointments.',
        url: 'https://www.hl7.org/fhir/schedule.html'
    },
    {
        name: 'Encounter',
        description: 'An interaction between a patient and healthcare provider(s) for the purpose of providing healthcare service(s) or assessing the health status of a patient.',
        url: 'https://www.hl7.org/fhir/encounter.html'
    },
    {
        name: 'Account',
        description: 'A financial tool for tracking value accrued for a particular purpose. In the healthcare field, used to track charges for a patient, cost centers, etc.',
        url: 'https://www.hl7.org/fhir/account.html'
    },
    {
        name: 'CareTeam',
        description: 'The Care Team includes all the people and organizations who plan to participate in the coordination and delivery of care for a patient.',
        url: 'https://www.hl7.org/fhir/careteam.html'
    },
    {
        name: 'HealthcareService',
        description: 'The details of a healthcare service available at a location.',
        url: 'https://www.hl7.org/fhir/healthcareservice.html'
    },
    {
        name: 'InsurancePlan',
        description: 'Details of a Health Insurance product/plan provided by an organization.',
        url: 'https://www.hl7.org/fhir/insuranceplan.html'
    },
    {
        name: 'MeasureReport',
        description: 'The MeasureReport resource contains the results of the calculation of a measure; and optionally a reference to the resources involved in that calculation.',
        url: 'https://www.hl7.org/fhir/measurereport.html'
    },
    {
        name: 'OrganizationAffiliation',
        description: 'Defines an affiliation/assotiation/relationship between 2 distinct oganizations, that is not a part-of relationship/sub-division relationship.',
        url: 'https://www.hl7.org/fhir/organizationaffiliation.html'
    },
    {
        name: 'ServiceRequest',
        description: 'A record of a request for service such as diagnostic investigations, treatments, or operations to be performed.',
        url: 'https://hl7.org/fhir/servicerequest.html'
    },
    {
        name: 'Slot',
        description: 'A slot of time on a schedule that may be available for booking appointments.',
        url: 'https://www.hl7.org/fhir/slot.html#Slot'
    },
    {
        name: 'ValueSet',
        description: 'A ValueSet resource instance specifies a set of codes drawn from one or more code systems, intended for use in a particular context. Value sets link between CodeSystem definitions and their use in coded elements.',
        url: 'http://hl7.org/fhir/valueset.html'
    },
    {
        name: 'Library',
        description: 'The Library resource is a general-purpose container for knowledge asset definitions. It can be used to describe and expose existing knowledge assets such as logic libraries and information model descriptions, as well as to describe a collection of knowledge assets.',
        url: 'https://www.hl7.org/fhir/library.html'
    },
];

module.exports = {
    resourceDefinitions
};

