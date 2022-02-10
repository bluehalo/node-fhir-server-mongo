const identifierUrl = 'http://hl7.org/fhir/sid/us-npi|';

function getParamsFromReq(req) {
  const queryStart = req.originalUrl.indexOf('?');
  const searchParams =
    queryStart > -1 ? new URLSearchParams(req.originalUrl.substring(queryStart + 1)) : '';
  return searchParams ? Object.fromEntries(searchParams.entries()) : {};
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
  const params = getParamsFromReq(req);

  let formData = [];

  switch (resourceName) {
    case 'Patient':
      formData = formData.concat(getPatientForm(params));
      break;
    case 'Practitioner':
      formData = formData.concat(getPractitionerForm(params));
      break;
  }

  formData.push({ label: 'Source', name: 'source', value: params.source ? params.source : '' });

  return formData;
};

const getLastUpdated = function (req) {
  const params = getParamsFromReq(req);
  return params._lastUpdated ? params._lastUpdated.replace('le', '').replace('ge', '') : '';
};

const isBefore = function (req) {
  const params = getParamsFromReq(req);
  return !params._lastUpdated || params._lastUpdated.includes('le', 0);
};

module.exports = {
  searchFormData: getFormData,
  lastUpdated: getLastUpdated,
  lastUpdatedBefore: isBefore,
};
