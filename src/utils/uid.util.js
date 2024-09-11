const { randomBytes } = require('node:crypto');

/**
 * Generates a UUID that matches with FHIR UUID data type https://build.fhir.org/datatypes.html#uuid
 * Regex: urn:uuid:[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}
 * ex: c757873d-ec9a-4326-a141-556f43239520
 */
let getUuid = function () {
  // Generate 16 random bytes
  const bytes = randomBytes(16);

  // Set the version to 4 (UUID v4)
  bytes[6] = (bytes[6] & 0x0f) | 0x40;

  // Set the variant to 10xx (UUID v4)
  bytes[8] = (bytes[8] & 0x3f) | 0x80;

  // Convert bytes to hex and format as UUID v4
  const uuid = [
    bytes.toString('hex').slice(0, 8), // 8 characters for the first part
    bytes.toString('hex').slice(8, 12), // 4 characters for the second part
    bytes.toString('hex').slice(12, 16), // 4 characters for the third part
    bytes.toString('hex').slice(16, 20), // 4 characters for the fourth part
    bytes.toString('hex').slice(20, 32), // 12 characters for the fifth part
  ].join('-');

  return `${uuid}`;
};

module.exports = {
  getUuid,
};
