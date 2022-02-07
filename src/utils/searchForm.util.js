const identifierUrl = 'http://hl7.org/fhir/sid/us-npi|';

function getParamsFromReq(req) {
  const queryStart = req.originalUrl.indexOf('?');
  const searchParams =
    queryStart > -1 ? new URLSearchParams(req.originalUrl.substring(queryStart + 1)) : '';
  return searchParams ? Object.fromEntries(searchParams.entries()) : {};
}

const getFormData = (req, resourceName) => {
  const params = getParamsFromReq(req);
  const identifierParts = params.identifier ? params.identifier.split('|') : [];

  const givenNameField = {
    label: 'Given (Name)',
    name: 'given',
    value: params.given ? params.given : '',
  };
  const familyNameField = {
    label: 'Family (Name)',
    name: 'family',
    value: params.family ? params.family : '',
  };

  let formData = [];

  switch (resourceName) {
    case 'Patient':
      formData.push(givenNameField);
      formData.push(familyNameField);
      formData.push({
        label: 'Identifier System',
        name: 'identifier_system',
        value: identifierParts[0] ? identifierParts[0] : '',
      });
      formData.push({
        label: 'Identifier Value',
        name: 'identifier_value',
        value: identifierParts[1] ? identifierParts[1] : '',
      });
      break;
    case 'Practitioner':
      formData.push(givenNameField);
      formData.push(familyNameField);
      formData.push({
        label: 'NPI',
        name: 'npi',
        value: params.identifier ? params.identifier.replace(identifierUrl, '') : '',
      });
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
