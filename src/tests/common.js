const {MongoClient} = require('mongodb');

const globals = require('../globals');
const {CLIENT, CLIENT_DB} = require('../constants');

const env = require('var');

// const {getToken} = require('../../token');
const {jwksEndpoint} = require('./mocks/jwks');
const {publicKey, privateKey} = require('./mocks/keys');
const {createToken} = require('./mocks/tokens');

let connection;
let db;

/**
 * sets up the mongo db and token endpoint
 * @return {Promise<void>}
 */
module.exports.commonBeforeEach = async () => {
    connection = await MongoClient.connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        auto_reconnect: true
    });
    db = connection.db();

    globals.set(CLIENT, connection);
    globals.set(CLIENT_DB, db);
    jest.setTimeout(30000);
    env['VALIDATE_SCHEMA'] = true;
    process.env.AUTH_ENABLED = '1';
    const urlObject = new URL(env.AUTH_JWKS_URL);
    jwksEndpoint(urlObject.protocol + '//' + urlObject.host, [{pub: publicKey, kid: '123'}]);
};

/**
 * cleans up the mongo db
 * @return {Promise<void>}
 */
module.exports.commonAfterEach = async () => {
    await db.dropDatabase();
    await connection.close();
};


/**
 * @param {string} scope
 * @return {string}
 */
const getToken = module.exports.getToken = (scope) => {
    return createToken(privateKey, '123', {
        sub: 'john',
        client_id: 'my_client_id',
        scope: scope
    });
};

const getFullAccessToken = module.exports.getFullAccessToken = () => {
    return getToken(
        'user/*.read user/*.write access/*.*'
    );
};

module.exports.getHeaders = (scope) => {
    return {
        'Content-Type': 'application/fhir+json',
        'Accept': 'application/fhir+json',
        'Authorization': `Bearer ${scope ? getToken(scope) : getFullAccessToken()}`
    };
};

