// noinspection JSCheckFunctionSignatures

const express = require('express');
const compression = require('compression');
const bodyParser = require('body-parser');
const FHIRServer = require('@asymmetrik/node-fhir-server-core');

const asyncHandler = require('./lib/async-handler');
const mongoClient = require('./lib/mongo');
const {fhirServerConfig, mongoConfig} = require('./config');
const Prometheus = require('./utils/prometheus.utils');
const env = require('var');
const helmet = require('helmet');
// noinspection NodeCoreCodingAssistance
const https = require('https');
const async = require('async');
const path = require('path');
const useragent = require('express-useragent');
const {htmlRenderer} = require('./middleware/htmlRenderer');
const {slackErrorHandler} = require('./middleware/slackErrorHandler');

const app = express();

const cookieParser = require('cookie-parser');
app.use(cookieParser());

app.use(useragent.express());

app.use(helmet());
app.use(Prometheus.requestCounters);
app.use(Prometheus.responseCounters);
Prometheus.injectMetricsRoute(app);
Prometheus.startCollection();

// Set EJS as templating engine
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');

/**
 * returns whether the parameter is false or a string "false"
 * @param {string | boolean | null} s
 * @returns {boolean}
 */
const isTrue = function (s) {
    return String(s).toLowerCase() === 'true' || String(s).toLowerCase() === '1';
};

// implement our subclass to set higher request limit
class MyFHIRServer extends FHIRServer.Server {
    configureMiddleware() {
        //Enable error tracking request handler if supplied in config
        if (this.config.errorTracking && this.config.errorTracking.requestHandler) {
            this.app.use(this.config.errorTracking.requestHandler());
        } // Enable stack traces

        this.app.set('showStackError', !this.env.IS_PRODUCTION); // Show stack error

        this.app.use(compression({
            level: 9
        })); // Enable the body parser

        this.app.use(bodyParser.urlencoded({
            extended: true,
            limit: '50mb',
            parameterLimit: 50000
        }));
        this.app.use(bodyParser.json({
            type: ['application/fhir+json', 'application/json+fhir'],
            limit: '50mb'

        }));

        return this;
    }

    configureHtmlRenderer() {
        if (isTrue(env.RENDER_HTML)) {
            this.app.use(htmlRenderer);
        }
        return this;
    }

    configureSlackErrorHandler() {
        if (env.SLACK_TOKEN && env.SLACK_CHANNEL) {
            this.app.use(slackErrorHandler);
        }
        return this;
    }

}

// const fhirApp = MyFHIRServer.initialize(fhirServerConfig);
const fhirApp = new MyFHIRServer(fhirServerConfig).configureMiddleware().configureSession().configureHelmet().configurePassport().configureHtmlRenderer().setPublicDirectory().setProfileRoutes().configureSlackErrorHandler().setErrorRoutes();

app.use(function (req, res, next) {
    res.setHeader(
        'Content-Security-Policy',
        "default-src 'self'; object-src data: 'unsafe-eval'; font-src 'self'; img-src 'self' 'unsafe-inline' 'unsafe-hashes' 'unsafe-eval' data:; script-src 'self' 'unsafe-inline' https://ajax.googleapis.com/ https://cdnjs.cloudflare.com; style-src 'self' 'unsafe-inline'; frame-src 'self'; connect-src 'self' " + env.AUTH_CODE_FLOW_URL + '/oauth2/token;'
    );
    next();
});

const swaggerUi = require('swagger-ui-express');
// eslint-disable-next-line security/detect-non-literal-require
const swaggerDocument = require(env.SWAGGER_CONFIG_URL);

// noinspection SpellCheckingInspection
const options = {
    explorer: true,
    swaggerOptions: {
        oauth2RedirectUrl: env.HOST_SERVER + '/api-docs/oauth2-redirect.html',
        oauth: {
            appName: 'Swagger Doc',
            usePkceWithAuthorizationCodeGrant: true
        }
    }
};

app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocument, options)
);

app.use(express.static(path.join(__dirname, 'oauth')));

app.get('/authcallback', (req, res) => {
    res.redirect(`/callback.html?code=${req.query.code}&resourceUrl=${req.query.state}&clientId=${env.AUTH_CODE_FLOW_CLIENT_ID}&redirectUri=${env.HOST_SERVER}/authcallback&tokenUrl=${env.AUTH_CODE_FLOW_URL}/oauth2/token`);
});

app.get('/fhir', (req, res) => {
    const resourceUrl = req.query.resource;
    const redirectUrl = `${env.AUTH_CODE_FLOW_URL}/login?response_type=code&client_id=${env.AUTH_CODE_FLOW_CLIENT_ID}&redirect_uri=${env.HOST_SERVER}/authcallback&state=${resourceUrl}`;
    res.redirect(redirectUrl);
});

app.get('/health', (req, res) => res.json({status: 'ok'}));
app.get('/version', (req, res) => {
    const image = env.DOCKER_IMAGE || '';
    if (image) {
        return res.json({version: image.slice(image.lastIndexOf(':') + 1), image: image});
    } else {
        return res.json({version: 'unknown', image: 'unknown'});
    }
});
app.get('/logout', (req, res) => {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write('<html><head></head><body>Logout Successful</body></html>');
    res.end();
});

app.get('/', (req, res) => {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write('<html><head></head><body><h2><img src="/helix.png" height="32px" />&nbsp;Helix FHIR Server</h2><div>Documentation:&nbsp;<a href="https://github.com/icanbwell/fhir-server/blob/master/cheatsheet.md">https://github.com/icanbwell/fhir-server/blob/master/cheatsheet.md</a></div><div>&nbsp;</div><div>To access data:&nbsp;<a href="/4_0_0/Patient">/4_0_0/Patient</a>&nbsp;(Requires Authentication) </div></body></html>');
    res.end();
});

app.get('/clean/:collection?', async (req, res) => {
    // const query_args_array = Object.entries(req.query);
    // return res.status(200).json(req.params);
    if (!env.DISABLE_CLEAN_ENDPOINT) {
        console.info('Running clean');

        // Connect to mongo and pass any options here
        let [mongoError, client] = await asyncHandler(
            mongoClient(mongoConfig.connection, mongoConfig.options)
        );
        if (mongoError) {
            console.error(mongoError.message);
            console.error(mongoConfig.connection);
            client.close();
            res.status(500).json({success: false, error: mongoError});
        } else {
            //create client by providing database name
            const db = client.db(mongoConfig.db_name);
            let collection_names = [];
            // const collections = await db.listCollections().toArray();

            const specific_collection = req.params['collection'];
            console.log('specific_collection: ' + specific_collection);
            if (env.IS_PRODUCTION && !specific_collection) {
                return res.status(400).json({message: 'IS_PRODUCTION env var is set so you must pass a specific collection to clean'});
            }

            await db.listCollections().forEach(collection => {
                console.log(collection.name);
                if (collection.name.indexOf('system.') === -1) {
                    if (
                        !specific_collection || (
                            collection.name === (specific_collection + '_4_0_0') || collection.name === (specific_collection + '_4_0_0_History')
                        )
                    ) {
                        collection_names.push(collection.name);
                    }
                }
            });

            console.info('Collection_names:' + collection_names);
            for (const collection_index in collection_names) {
                const collection_name = collection_names[parseInt(collection_index)];
                console.log(collection_name);
                console.log(['Removing: ', await db.collection(collection_name).countDocuments({}), ' documents from ', collection_name].join(''));
                await db.collection(collection_name).deleteMany({});
            }
            await client.close();
            res.status(200).json({success: true, collections: collection_names});
        }
    } else {
        res.status(403).json();
    }
});

app.get('/stats', async (req, res) => {
    console.info('Running stats');

    // Connect to mongo and pass any options here
    let [mongoError, client] = await asyncHandler(
        mongoClient(mongoConfig.connection, mongoConfig.options)
    );

    /**
     * gets stats for a collection
     * @param {string} collection_name
     * @param {Db} db
     * @return {Promise<{name, count: *}>}
     */
    async function getStatsForCollection(collection_name, db) {
        console.log(collection_name);
        const count = await db.collection(collection_name).countDocuments({});
        console.log(['Found: ', count, ' documents in ', collection_name].join(''));
        return {name: collection_name, count: count};
    }

    if (mongoError) {
        console.error(mongoError.message);
        console.error(mongoConfig.connection);
        client.close();
        res.status(500).json({success: false, error: mongoError});
    } else {
        //create client by providing database name
        const db = client.db(mongoConfig.db_name);
        let collection_names = [];
        // const collections = await db.listCollections().toArray();

        await db.listCollections().forEach(collection => {
            console.log(collection.name);
            if (collection.name.indexOf('system.') === -1) {
                collection_names.push(collection.name);
            }
        });

        console.info('Collection_names:' + collection_names);
        const collection_stats = await async.map(
            collection_names,
            async collection_name => await getStatsForCollection(collection_name, db)
        );
        await client.close();
        res.status(200).json({
            success: true,
            image: env.DOCKER_IMAGE || '',
            database: mongoConfig.db_name,
            collections: collection_stats
        });
    }
});

app.get('/index', async (req, res) => {
    console.info('Running index');

    // Connect to mongo and pass any options here
    let [mongoError, client] = await asyncHandler(
        mongoClient(mongoConfig.connection, mongoConfig.options)
    );

    /**
     * creates an index if it does not exist
     * @param {Db} db
     * @param {string} property_to_index
     * @param {string} collection_name
     * @return {Promise<boolean>}
     */
    async function create_index_if_not_exists(db, property_to_index, collection_name) {
        const index_name = property_to_index + '_1';
        if (!await db.collection(collection_name).indexExists(index_name)) {
            console.log('Creating index ' + index_name + ' in ' + collection_name);
            const my_dict = {};
            my_dict[String(property_to_index)] = 1;
            await db.collection(collection_name).createIndex(my_dict);
            return true;
        }
        return false;
    }

    /**
     * creates indexes on a collection
     * @param {string} collection_name
     * @param {Db} db
     * @return {Promise<{indexes: *, createdIndex: boolean, name, count: *}>}
     */
    async function indexCollection(collection_name, db) {
        console.log(collection_name);
        // check if index exists
        let createdIndex = await create_index_if_not_exists(db, 'id', collection_name);
        createdIndex = await create_index_if_not_exists(db, 'meta.lastUpdated', collection_name) || createdIndex;
        const indexes = await db.collection(collection_name).indexes();
        const count = await db.collection(collection_name).countDocuments({});
        console.log(['Found: ', count, ' documents in ', collection_name].join(''));
        return {
            name: collection_name,
            count: count,
            createdIndex: createdIndex,
            indexes: indexes
        };
    }

    if (mongoError) {
        console.error(mongoError.message);
        console.error(mongoConfig.connection);
        client.close();
        res.status(500).json({success: false, error: mongoError});
    } else {
        //create client by providing database name
        const db = client.db(mongoConfig.db_name);
        const collection_names = [];
        // const collections = await db.listCollections().toArray();

        await db.listCollections().forEach(collection => {
            console.log(collection.name);
            if (collection.name.indexOf('system.') === -1) {
                collection_names.push(collection.name);
            }
        });

        // now add custom indices
        const practitionerRoleCollection = 'PractitionerRole_4_0_0';
        if (collection_names.includes(practitionerRoleCollection)) {
            await create_index_if_not_exists(db, 'practitioner.reference', practitionerRoleCollection);
            await create_index_if_not_exists(db, 'organization.reference', practitionerRoleCollection);
            await create_index_if_not_exists(db, 'location.reference', practitionerRoleCollection);
        }

        // now add indices on id column for every collection
        console.info('Collection_names:' + collection_names);
        const collection_stats = await async.map(
            collection_names,
            async collection_name => await indexCollection(collection_name, db)
        );

        await client.close();
        res.status(200).json({success: true, collections: collection_stats});
    }
});

app.get('/.well-known/smart-configuration', (req, res) => {
    if (env.AUTH_CONFIGURATION_URI) {
        https.get(env.AUTH_CONFIGURATION_URI, (resp) => {
            let data = '';

            // A chunk of data has been received.
            resp.on('data', (chunk) => {
                data += chunk;
            });

            // The whole response has been received. Print out the result.
            resp.on('end', () => {
                res.json(JSON.parse(data));
            });

        }).on('error', (err) => {
            console.log('Error: ' + err.message);
            res.json({'error': err.message});
        });
    } else {
        return res.json();
    }
});

app.use('/favicon.ico', express.static('images/favicon.ico'));

app.use('/helix.png', express.static('/images/helix.png'));

app.use(express.static(path.join(__dirname, 'images')));

app.use(fhirApp.app);


module.exports = {app, fhirApp};
