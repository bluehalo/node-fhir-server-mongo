/**
 * @typedef Meta
 * @type {object}
 * @property {string} versionId - an ID.
 * @property {string} lastUpdated
 * @property {string} source
 * @property {{system: string, code: string, display: string}[]} tag
 */

/**
 * @typedef Resource
 * @type {object}
 * @property {string} id - an ID.
 * @property {string} resourceType
 */

// from https://www.hl7.org/fhir/operationoutcome.html
/**
 * @typedef OperationOutcome
 * @type {object}
 * @property {string} resourceType
 * @property {?[{severity: string, code: string, details: {text: string}, diagnostics: string, expression:[string]}]} issue
 */
