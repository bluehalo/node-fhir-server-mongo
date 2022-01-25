const env = require('var');
const scopeChecker = require('@asymmetrik/sof-scope-checker');
const {ForbiddenError} = require('../../utils/httpErrors');
/**
 * converts a space separated list of scopes into an array of scopes
 * @param {string} scope
 * @return {string[]}
 */
const parseScopes = (scope) => {
    if (!scope) {
        return [];
    }
    return scope.split(' ');
};

/**
 * Throws an error if no scope is valid for this request
 * @param {string} name
 * @param {string} action
 * @param {string} user
 * @param {?string} scope
 */
const verifyHasValidScopes = (name, action, user, scope) => {
    if (env.AUTH_ENABLED === '1') {
        // http://www.hl7.org/fhir/smart-app-launch/scopes-and-launch-context/index.html
        if (scope) {
            /**
             * @type {string[]}
             */
            let scopes = parseScopes(scope);
            let {error, success} = scopeChecker(name, action, scopes);

            if (success) {
                return;
            }
            let errorMessage = 'user ' + user + ' with scopes [' + scopes + '] failed access check to [' + name + '.' + action + ']';
            console.info(errorMessage);
            throw new ForbiddenError(error.message + ': ' + errorMessage);
        } else {
            let errorMessage = 'user ' + user + ' with no scopes failed access check to [' + name + '.' + action + ']';
            console.info(errorMessage);
            throw new ForbiddenError(errorMessage);
        }
    }
};

/**
 * Returns all the access codes present in scopes
 * @param {string} action
 * @param {string} user
 * @param {?string} scope
 * @return {string[]}
 */
const getAccessCodesFromScopes = (action, user, scope) => {
    if (env.AUTH_ENABLED === '1') {
        // http://www.hl7.org/fhir/smart-app-launch/scopes-and-launch-context/index.html
        /**
         * @type {string[]}
         */
        let scopes = parseScopes(scope);
        /**
         * @type {string[]}
         */
        const access_codes = [];
        /**
         * @type {string}
         */
        for (const scope1 of scopes) {
            if (scope1.startsWith('access')) {
                // ex: access/medstar.*
                /**
                 * @type {string}
                 */
                const inner_scope = scope1.replace('access/', '');
                /**
                 * @type {[string]}
                 */
                const innerScopes = inner_scope.split('.');
                if (innerScopes && innerScopes.length > 0) {
                    /**
                     * @type {string}
                     */
                    const access_code = innerScopes[0];
                    access_codes.push(access_code);
                }
            }
        }
        return access_codes;
    } else {
        return [];
    }
};

/**
 * Checks whether the resource has any access codes that are in the passed in accessCodes list
 * @param {string[]} accessCodes
 * @param {string} user
 * @param {string} scope
 * @param {Resource} resource
 * @return {boolean}
 */
const doesResourceHaveAnyAccessCodeFromThisList = (accessCodes, user, scope, resource) => {
    if (env.AUTH_ENABLED !== '1') {
        return true;
    }

    // fail if there are no access codes
    if (!accessCodes || accessCodes.length === 0) {
        return false;
    }

    // see if we have the * access code
    if (accessCodes.includes('*')) {
        // no security check since user has full access to everything
        return true;
    }

    if (!resource.meta || !resource.meta.security) {
        // resource has not meta or security tags so don't return it
        return false;
    }
    /**
     * @type {string[]}
     */
    const accessCodesForResource = resource.meta.security
        .filter(s => s.system === 'https://www.icanbwell.com/access')
        .map(s => s.code);
    /**
     * @type {string}
     */
    for (const accessCode of accessCodes) {
        if (accessCodesForResource.includes(accessCode)) {
            return true;
        }
    }
    return false;
};

/**
 * Returns true if resource can be accessed with scope
 * @param {Resource} resource
 * @param {string} user
 * @param {string} scope
 * @return {boolean}
 */
const isAccessToResourceAllowedBySecurityTags = (resource, user, scope) => {
    if (env.AUTH_ENABLED !== '1') {
        return true;
    }
    // add any access codes from scopes
    /**
     * @type {string[]}
     */
    const accessCodes = getAccessCodesFromScopes('read', user, scope);
    if (!accessCodes || accessCodes.length === 0) {
        let errorMessage = 'user ' + user + ' with scopes [' + scope + '] has no access scopes';
        throw new ForbiddenError(errorMessage);
    }
    return doesResourceHaveAnyAccessCodeFromThisList(accessCodes, user, scope, resource);
};

/**
 * Returns whether the resource has an access tag
 * @param {Resource} resource
 * @return {boolean}
 */
const doesResourceHaveAccessTags = (resource) => {
    return (
        resource &&
        resource.meta &&
        resource.meta.security &&
        resource.meta.security.some(s => s.system === 'https://www.icanbwell.com/access')
    );
};

module.exports = {
    isAccessToResourceAllowedBySecurityTags,
    doesResourceHaveAccessTags,
    verifyHasValidScopes,
    getAccessCodesFromScopes,
    doesResourceHaveAnyAccessCodeFromThisList,
    parseScopes
};

