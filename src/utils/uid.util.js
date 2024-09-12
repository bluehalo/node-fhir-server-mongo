const { randomUUID } = require('node:crypto');

/**
 * Generates a UUID (aka GUID) represented as a URI (RFC 4122 icon)
 */
let getUuid = function () {
  return randomUUID();
};

module.exports = {
  getUuid,
};
