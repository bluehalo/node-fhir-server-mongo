const env = require('var');
const { searchById } = require('../searchById/searchById');
const { logRequest } = require('../common/logging');
const { verifyHasValidScopes } = require('../security/scopes');
const { getRequestInfo } = require('../../graphql/v2/requestInfoHelper');

module.exports.filter = async (requestInfo, args, resourceName) => {
    /**
     * @type {string | null}
     */
    const user = requestInfo.user.id;
    /**
     * @type {string | null}
     */
    const scope = requestInfo.scope;

    logRequest(user, resourceName + ' >>> search' + ' scope:' + scope);
    // logRequest('user: ' + req.user);
    // logRequest('scope: ' + req.authInfo.scope);
    verifyHasValidScopes(resourceName, 'read', user, scope);
    logRequest(user, '---- args ----');
    logRequest(user, JSON.stringify(args));
    logRequest(user, '--------');

    let patients = [];
    // if (env.ENABLE_PATIENT_FILTERING && requestInfo.user.isUser) {
    if (env.ENABLE_PATIENT_FILTERING) {
        // let patients = getPatientsFromUser(user);
        // requestInfo['custom:bwell_fhir_id'] = 'bwell-123456789';
        let person = await searchById(
            getRequestInfo(requestInfo),
            { ...args, id: 'bwell-123456789' },
            'Person',
            'Person'
        );
        let promises = [];
        person.link.forEach((link) => {
            const [resource, id] = link.target.reference.split('/');
            promises.push(
                searchById(getRequestInfo(requestInfo), { ...args, id }, resource, resource)
            );
        });
        const persons = await Promise.all(promises);
        patients = persons.flatMap((p) =>
            p.link.map((link) => link.target.reference.split('/')[1])
        );
        logRequest(user, JSON.stringify(patients, null, 2));

        // let people = search();
        //let patients = search({}, args, resourceName, collection_name)
    }
    /**
     * mongo db connection
     * @type {import('mongodb').Db}
     */
    return patients;
};
