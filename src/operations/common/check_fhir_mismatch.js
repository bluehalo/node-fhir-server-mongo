const deepEqual = require('fast-deep-equal');
const {compare} = require('fast-json-patch');
const {logWarn} = require('./logging');

module.exports.check_fhir_mismatch = (cleaned, patched) => {
    if (deepEqual(cleaned, patched) === false) {
        let diff = compare(cleaned, patched);
        logWarn('user', 'Possible FHIR mismatch between incoming resource and updated resource - ' + cleaned.resourceType + cleaned.id + ':' + cleaned.resourceType);
        logWarn('user', diff);
    }
};
