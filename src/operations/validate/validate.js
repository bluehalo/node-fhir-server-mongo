const {logRequest, logDebug} = require('../common/logging');
const {validateResource} = require('../../utils/validator.util');
const {doesResourceHaveAccessTags} = require('../security/scopes');
/**
 * does a FHIR Validate
 * @param {string[]} args
 * @param {IncomingMessage} req
 * @param {string} resource_name
 * @param {string} collection_name
 */
module.exports.validate = async (args, {req}, resource_name, collection_name) => {
    logRequest(req.user, `${resource_name} >>> validate`);

    // no auth check needed to call validate

    let resource_incoming = req.body;

    // eslint-disable-next-line no-unused-vars
    // let {base_version} = args;

    logDebug(req.user, '--- request ----');
    logDebug(req.user, req);
    logDebug(req.user, collection_name);
    logDebug(req.user, '-----------------');

    logDebug(req.user, '--- body ----');
    logDebug(req.user, resource_incoming);
    logDebug(req.user, '-----------------');


    logDebug(req.user, '--- validate schema ----');
    const operationOutcome = validateResource(resource_incoming, resource_name, req.path);
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
