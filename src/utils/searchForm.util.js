const identifierUrl = 'http://hl7.org/fhir/sid/us-npi|';
const advSearchJson = require('../graphql/generator/json/definitions.json/search-parameters.json');

function getSearchParams(req) {
  const fakeBaseUrl = 'http://test.com'; // This is only used to form a full url
  const searchQuery = new URL(fakeBaseUrl + req.originalUrl).search;
  return new URLSearchParams(searchQuery);
}

function handleModifierKey(key) {
  const modifierIndex = key.indexOf(':');
  return modifierIndex > 0 ? key.substring(0, modifierIndex) : key;
}

function getModifierParams(req) {
  const searchParams = new URLSearchParams(getSearchParams(req));
  const paramEntries = searchParams ? Object.fromEntries(searchParams.entries()) : {};

  return Object.assign(
    {},
    ...Object.keys(paramEntries).map((key) => ({
      [handleModifierKey(key)]: paramEntries[key],
    }))
  );
}

function getIdentifierField(params) {
  const identifierParts = params.identifier ? params.identifier.split('|') : [];
  let identArray = [];
  if (identifierParts) {
    identArray.push({
      label: 'Identifier System',
      name: 'identifier_system',
      value: identifierParts[0] ? identifierParts[0] : '',
    });
    identArray.push({
      label: 'Identifier Value',
      name: 'identifier_value',
      value: identifierParts[1] ? identifierParts[1] : '',
    });
  }
  return identArray;
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
  patientArray = patientArray.concat(getIdentifierField(params));
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

  formData.push({ label: 'Source', name: '_source', value: params._source ? params._source : '' });

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
    const foundBasic = basicFormData.find((formData) => formData.name === advParam.resource.name);
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

const getLastUpdate = function (req, modifier) {
  const searchParams = getSearchParams(req);
  let dateString = '';
  searchParams.forEach((value, key) => {
    if (key.includes('_lastUpdated') && key.includes(modifier)) {
      dateString = value;
    }
  });
  return dateString;
};

module.exports = {
  advSearchFormData: getAdvSearchFormData,
  searchFormData: getFormData,
  lastUpdateStart: getLastUpdate,
  lastUpdateEnd: getLastUpdate,
};
