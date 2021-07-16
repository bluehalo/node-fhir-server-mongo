const jwt = require('jsonwebtoken');
const env = require('var');

/**
 * Creates and signs a token
 * @param {string} key
 * @param {string} kid
 * @param {{noTimestamp: boolean, algorithm: string, header: { alg: string, kid: string}}} payload
 * @return {string}
 */
function createToken(key, kid, payload) {
    return jwt.sign(payload, key, {
        noTimestamp: true,
        algorithm: 'RS256',
        issuer: env.AUTH_ISSUER,
        header: {alg: 'RS256', kid}
    });
}

/**
 * Creates and signs a symmetric token
 * @param {string} key
 * @param {{noTimestamp: boolean, algorithm: string, header: { alg: string, kid: string}}} payload
 * @return {string}
 */
function createSymmetricToken(key, payload) {
    return jwt.sign(payload, key, {
        noTimestamp: true,
        algorithm: 'HS256',
        issuer: env.AUTH_ISSUER,
        header: {alg: 'HS256'}
    });
}

module.exports = {
    createToken,
    createSymmetricToken
};
