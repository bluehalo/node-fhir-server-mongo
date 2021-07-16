const nock = require('nock');
const jose = require('jose');

/**
 * creates a mock endpoint for /.well-known/jwks.json
 * @param {string} host
 * @param {[{pub: string, kid: string}]} certs
 * @return {Scope}
 */
function jwksEndpoint(host, certs) {
    return nock(host)
        .persist()
        .get('/.well-known/jwks.json')
        .reply(200, {
            keys: certs.map(cert => {
                const parsed = jose.JWK.asKey(cert.pub).toJWK();
                return {
                    alg: 'RS256',
                    e: parsed.e,
                    n: parsed.n,
                    kty: parsed.kty,
                    use: 'sig',
                    kid: cert.kid
                };
            })
        });
}

module.exports = {
    jwksEndpoint
};
