const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const jwksRsa = require('jwks-rsa');
const env = require('var');

/**
 * returns whether the parameter is false or a string "false"
 * @param {string | boolean | null} s
 * @returns {boolean}
 */
const isTrue = function (s) {
    return String(s).toLowerCase() === 'true' || String(s).toLowerCase() === '1';
};

/**
 * extracts the client_id and scope from the decoded token
 * @param jwt_payload
 * @param done
 * @return {*}
 */
const verify = (jwt_payload, done) => {
    // console.log('Verify user:', jwt_payload);

    if (jwt_payload) {
        /**
         * @type {string}
         */
        const client_id = jwt_payload.client_id;
        /**
         * @type {string}
         */
        const scope = jwt_payload.scope;
        // console.info('Verified client_id: ' + client_id + 'scope: ' + scope);
        const context = null;
        return done(null, client_id, {scope, context});
    }

    return done(null, false);
};


/* we use this to override the JwtStrategy and redirect to login
    instead of just failing and returning a 401
 */
class MyJwtStrategy extends JwtStrategy {
    constructor(options, verifyFn) {
        super(options, verifyFn);
    }

    authenticate(req, options) {
        const self = this;

        const token = self._jwtFromRequest(req);

        // console.log('No token found in request: ');
        // console.log(req);
        // console.log('Accepts text/html: ' + req.accepts('text/html'));

        if (!token && req.accepts('text/html') && req.useragent && req.useragent.isDesktop && isTrue(env.REDIRECT_TO_LOGIN)) {
            const resourceUrl = req.url;
            const redirectUrl = `${env.AUTH_CODE_FLOW_URL}/login?response_type=code&client_id=${env.AUTH_CODE_FLOW_CLIENT_ID}&redirect_uri=${env.HOST_SERVER}/authcallback&state=${resourceUrl}`;
            return self.redirect(redirectUrl);
        }

        return super.authenticate(req, options);
    }
}

/* This function is called to extract the token from the jwt cookie
*/
const cookieExtractor = function (req) {
    let token = null;
    // console.log('Cookie req: ');
    // console.log(req);
    if (req && req.accepts('text/html') && req.cookies) {
        token = req.cookies['jwt'];
        // console.log('Found cookie jwt with value: ' + token);
    } else {
        // console.log('No cookies found');
    }
    return token;
};

/**
 * Bearer Strategy
 *
 * This strategy will handle requests with BearerTokens.  This is only a template and should be configured to
 * your AuthZ server specifications.
 *
 * Requires ENV variables for introspecting the token
 */
module.exports.strategy = new MyJwtStrategy({
        // Dynamically provide a signing key based on the kid in the header and the signing keys provided by the JWKS endpoint.
        secretOrKeyProvider: jwksRsa.passportJwtSecret({
            cache: true,
            rateLimit: true,
            jwksRequestsPerMinute: 5,
            jwksUri: env.AUTH_JWKS_URL
        }),
        /* specify a list of extractors and it will use the first one that returns the token */
        jwtFromRequest: ExtractJwt.fromExtractors([
            ExtractJwt.fromAuthHeaderAsBearerToken(),
            cookieExtractor,
            ExtractJwt.fromUrlQueryParameter('token')
        ]),

        // Validate the audience and the issuer.
        // audience: 'urn:my-resource-server',
        issuer: env.AUTH_ISSUER,
        algorithms: ['RS256']
    },
    verify);
