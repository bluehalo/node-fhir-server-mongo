const identifierUrl = 'http://hl7.org/fhir/sid/us-npi|';
const advSearchJson = require('../graphql/v1/generator/json/definitions.json/search-parameters.json');
const searchLimit = 10;

function getSearchParams(req) {
    const bodyEntries = Object.entries(req.body);
    // eslint-disable-next-line no-unused-vars
    const nonEmptyOrNull = bodyEntries.filter(([key, val]) => val !== '' && val !== null);
    return Object.fromEntries(nonEmptyOrNull);
}

function handleModifierKey(key) {
    const modifierIndex = key.indexOf(':');
    return modifierIndex > 0 ? key.substring(0, modifierIndex) : key;
}

function getModifierParams(req) {
    const searchParams = getSearchParams(req);
    return Object.assign(
        {},
        ...Object.keys(searchParams).map((key) => ({
            [handleModifierKey(key)]: searchParams[key],
        }))
    );
}

function givenNameField(params) {
    return {
        label: 'Given (Name)',
        name: 'given',
        value: params.given ? params.given : '',
    };
}

function familyNameField(params) {
    return {
        label: 'Family (Name)',
        name: 'family',
        value: params.family ? params.family : '',
    };
}

function getPatientForm(params) {
    let patientArray = [];
    patientArray.push(givenNameField(params));
    patientArray.push(familyNameField(params));
    return patientArray;
}

function getPractitionerForm(params) {
    const practitionerArray = [];
    practitionerArray.push(givenNameField(params));
    practitionerArray.push(familyNameField(params));
    practitionerArray.push({
        label: 'NPI',
        name: 'npi',
        value: params.identifier ? params.identifier.replace(identifierUrl, '') : '',
    });
    return practitionerArray;
}

const getFormData = (req, resourceName) => {
    const params = getModifierParams(req);
    let formData = [];

    switch (resourceName) {
        case 'Patient':
            formData = formData.concat(getPatientForm(params));
            break;
        case 'Practitioner':
            formData = formData.concat(getPractitionerForm(params));
            break;
    }

    formData.push({
        label: 'Source',
        name: '_source',
        value: params._source ? params._source : '',
    });

    return formData;
};

const getAdvSearchFormData = (req, resourceName) => {
    const basicFormData = getFormData(req, resourceName);
    const params = getModifierParams(req);
    let advFormData = [];
    const resourceFields = advSearchJson.entry.filter((entry) => {
        return entry.resource.base.includes(resourceName) && entry.resource.type === 'string';
    });

    resourceFields.forEach((advParam) => {
        const foundBasic = basicFormData.find(
            (formData) => formData.name === advParam.resource.name
        );
        if (foundBasic) {
            return;
        }
        advFormData.push({
            label: advParam.resource.name
                .split('-')
                .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
                .join(' '),
            name: advParam.resource.name,
            value: params[advParam.resource.name] ? params[advParam.resource.name] : '',
        });
    });
    return advFormData;
};

function getCurrentPageIndex(req) {
    let pageIndex = req.body._getpagesoffset;
    pageIndex = pageIndex && pageIndex !== '' ? parseInt(pageIndex) : 0;
    return pageIndex;
}

const getHasPrev = (req) => {
    const pageIndex = getCurrentPageIndex(req);
    return pageIndex > 0;
};

const getHasNext = (req, total) => {
    const pageIndex = getCurrentPageIndex(req);
    return pageIndex * searchLimit < total - searchLimit;
};

const getLastUpdate = function (req, modifier) {
    const searchParams = getSearchParams(req);
    let dateString = '';
    Object.keys(searchParams).forEach((key) => {
        if (key.includes('_lastUpdated') && key.includes(modifier)) {
            dateString = searchParams[key];
        }
    });
    return dateString;
};

module.exports = {
    advSearchFormData: getAdvSearchFormData,
    searchFormData: getFormData,
    lastUpdateStart: getLastUpdate,
    lastUpdateEnd: getLastUpdate,
    hasPrev: getHasPrev,
    hasNext: getHasNext,
    limit: searchLimit,
    pageIndex: getCurrentPageIndex,
};
