const {logRequest} = require('../common/logging');
const {validateResource} = require('../../utils/validator.util');
const {doesResourceHaveAccessTags} = require('../security/scopes');
/**
 * does a FHIR Validate
 * @param {string[]} args
 * @param {string} user
 * @param {string} scope
 * @param {Object} body
 * @param {string} path
 * @param {string} resource_name
 */
module.exports.validate = async (args, user, scope, body, path, resource_name) => {
    logRequest(user, `${resource_name} >>> validate`);

    // no auth check needed to call validate

    let resource_incoming = body;

    // eslint-disable-next-line no-unused-vars
    // let {base_version} = args;

    const operationOutcome = validateResource(resource_incoming, resource_name, path);
    if (operationOutcome && operationOutcome.statusCode === 400) {
        return operationOutcome;
    }

    if (!doesResourceHaveAccessTags(resource_incoming)) {
        return {
            resourceType: 'OperationOutcome',
            issue: [
                {
                    severity: 'error',
                    code: 'invalid',
                    details: {
                        text: 'Resource is missing a security access tag with system: https://www.icanbwell.com/access'
                    },
                    expression: [
                        resource_name
                    ]
                }
            ]
        };
    }
    return {
        resourceType: 'OperationOutcome',
        issue: [
            {
                severity: 'information',
                code: 'informational',
                details: {
                    text: 'OK'
                },
                expression: [
                    resource_name
                ]
            }
        ]
    };
};
