const {getAccessCodesFromScopes} = require('../security/scopes');
const env = require('var');
const {ForbiddenError} = require('../../utils/httpErrors');

/**
 * returns security tags to filter by based on the scope
 * @param {string} user
 * @param {string} scope
 * @return {string[]}
 */
const getSecurityTagsFromScope = (user, scope) => {
    /**
     * @type {string[]}
     */
    let securityTags = [];
    // add any access codes from scopes
    const accessCodes = getAccessCodesFromScopes('read', user, scope);
    if (env.AUTH_ENABLED === '1') {
        // fail if there are no access codes
        if (accessCodes.length === 0) {
            let errorMessage = 'user ' + user + ' with scopes [' + scope + '] has no access scopes';
            throw new ForbiddenError(errorMessage);
        }
        // see if we have the * access code
        else if (accessCodes.includes('*')) {
            // no security check since user has full access to everything
        } else {
            securityTags = accessCodes;
        }
    }
    return securityTags;
};

/**
 * returns the passed query by adding a check for security tgs
 * @param {string[]} securityTags
 * @param {Object} query
 * @return {Object}
 */
const getQueryWithSecurityTags = (securityTags, query) => {
    if (securityTags && securityTags.length > 0) {
        const securityTagQuery = {
            'meta.security': {
                '$elemMatch': {
                    'system': 'https://www.icanbwell.com/access',
                    'code': {
                        '$in': securityTags
                    }
                }
            }
        };
        // if there is already an $and statement then just add to it
        if (query.$and) {
            query.$and.push(
                securityTagQuery
            );
            return query;
        } else {
            return {
                $and: [
                    query,
                    securityTagQuery
                ]
            };
        }
    }
    return query;
};

module.exports = {
    getSecurityTagsFromScope: getSecurityTagsFromScope,
    getQueryWithSecurityTags: getQueryWithSecurityTags
};
