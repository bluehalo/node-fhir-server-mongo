const {MongoClient} = require('mongodb');
const {MongoMemoryServer} = require('mongodb-memory-server');

const globals = require('../globals');
const {CLIENT, CLIENT_DB} = require('../constants');

const env = require('var');

// const {getToken} = require('../../token');
const {jwksEndpoint} = require('./mocks/jwks');
const {publicKey, privateKey} = require('./mocks/keys');
const {createToken} = require('./mocks/tokens');
const nock = require('nock');
// const {app} = require('../app');

let connection;
let db;
let mongo;

/**
 * sets up the mongo db and token endpoint
 * @return {Promise<void>}
 */
module.exports.commonBeforeEach = async () => {
    // https://levelup.gitconnected.com/testing-your-node-js-application-with-an-in-memory-mongodb-976c1da1288f
    /**
     * 1.1
     * Start in-memory MongoDB
     */
    mongo = await MongoMemoryServer.create();
    /**
     * 1.2
     * Set the MongoDB host and DB name as environment variables,
     * because the application expect it as ENV vars.
     * The values are being created by the in-memory MongoDB
     */
    process.env.MONGO_HOST = mongo.getUri();
    // process.env.MONGO_DB = mongo.getdb.getDbName();

    connection = await MongoClient.connect(process.env.MONGO_HOST, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    db = connection.db();

    globals.set(CLIENT, connection);
    globals.set(CLIENT_DB, db);
    jest.setTimeout(30000);
    env['VALIDATE_SCHEMA'] = true;
    process.env.AUTH_ENABLED = '1';
    const urlObject = new URL(env.AUTH_JWKS_URL);
    jwksEndpoint(urlObject.protocol + '//' + urlObject.host, urlObject.pathname, [{pub: publicKey, kid: '123'}]);
    /**
     * @type {string[]}
     */
    const extJwksUrls = env.EXTERNAL_AUTH_JWKS_URLS.split(',');
    extJwksUrls.forEach(
        extJwksUrl => {
            if (extJwksUrl) {
                const urlObject1 = new URL(extJwksUrl.trim());
                jwksEndpoint(urlObject1.protocol + '//' + urlObject1.host, urlObject1.pathname, [{
                    pub: publicKey,
                    kid: '123'
                }]);
            }
        }
    );
};

/**
 * cleans up the mongo db
 * @return {Promise<void>}
 */
module.exports.commonAfterEach = async () => {
    globals.delete(CLIENT);
    globals.delete(CLIENT_DB);
    nock.cleanAll();
    nock.restore();
    await db.dropDatabase();
    await connection.close();
    await mongo.stop();
    // global.gc();
    // await app.close();
};


/**
 * @param {string} scope
 * @return {string}
 */
const getToken = module.exports.getToken = (scope) => {
    return createToken(privateKey, '123', {
        sub: 'john',
        username: 'imran',
        client_id: 'my_client_id',
        scope: scope
    });
};

const getFullAccessToken = module.exports.getFullAccessToken = () => {
    return getToken(
        'user/*.read user/*.write access/*.*'
    );
};

const getTokenWithCustomClaims = module.exports.getTokenWithCustomClaims = (scope) => {
    return createToken(privateKey, '123', {
        sub: 'john',
        custom_client_id: 'my_custom_client_id',
        customscope: scope,
        groups: ['access/*.*']
    });
};

const getFullAccessTokenWithCustomClaims = module.exports.getFullAccessTokenWithCustomClaims = () => {
    return getTokenWithCustomClaims(
        'user/*.read user/*.write'
    );
};

module.exports.getHeaders = (scope) => {
    return {
        'Content-Type': 'application/fhir+json',
        'Accept': 'application/fhir+json',
        'Authorization': `Bearer ${scope ? getToken(scope) : getFullAccessToken()}`
    };
};

module.exports.getGraphQLHeaders = (scope) => {
    return {
        'Content-Type': 'application/json; charset=utf-8',
        'accept': '*/*',
        'Authorization': `Bearer ${scope ? getToken(scope) : getFullAccessToken()}`
    };
};

module.exports.getUnAuthenticatedGraphQLHeaders = () => {
    return {
        'Content-Type': 'application/json; charset=utf-8',
        'accept': '*/*',
    };
};

module.exports.getUnAuthenticatedHeaders = () => {
    return {
        'Content-Type': 'application/fhir+json',
        'Accept': 'application/fhir+json'
    };
};

module.exports.getHeadersWithCustomToken = (scope) => {
    return {
        'Content-Type': 'application/fhir+json',
        'Accept': 'application/fhir+json',
        'Authorization': `Bearer ${scope ? getTokenWithCustomClaims(scope) : getFullAccessTokenWithCustomClaims()}`
    };
};

