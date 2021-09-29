const express = require('express');
const {fhirServerConfig} = require('./config');
const Prometheus = require('./utils/prometheus.utils');
const env = require('var');
const helmet = require('helmet');
const path = require('path');
const useragent = require('express-useragent');
const {graphql} = require('./middleware/graphqlServer');
const {resourceDefinitions} = require('./utils/resourceDefinitions');

const passport = require('passport');
const {strategy} = require('./strategies/jwt.bearer.strategy');

const {handleAlert} = require('./routeHandlers/alert');
const {MyFHIRServer} = require('./routeHandlers/fhirServer');
const {handleSecurityPolicy} = require('./routeHandlers/contentSecurityPolicy');
const {handleVersion} = require('./routeHandlers/version');
const {handleLogout} = require('./routeHandlers/logout');
const {handleClean} = require('./routeHandlers/clean');
const {handleIndex} = require('./routeHandlers/index');
const {handleStats} = require('./routeHandlers/stats');
const {handleSmartConfiguration} = require('./routeHandlers/smartConfiguration');
const {isTrue} = require('./operations/common/isTrue');

const app = express();

const cookieParser = require('cookie-parser');
app.use(cookieParser());

app.use(useragent.express());

app.use(helmet());
app.use(Prometheus.requestCounters);
// noinspection JSCheckFunctionSignatures
app.use(Prometheus.responseCounters);
Prometheus.injectMetricsRoute(app);
Prometheus.startCollection();

// Set EJS as templating engine
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');

const swaggerUi = require('swagger-ui-express');
// eslint-disable-next-line security/detect-non-literal-require
const swaggerDocument = require(env.SWAGGER_CONFIG_URL);

// const fhirApp = MyFHIRServer.initialize(fhirServerConfig);
const fhirApp = new MyFHIRServer(fhirServerConfig).configureMiddleware().configureSession().configureHelmet().configurePassport().configureHtmlRenderer().setPublicDirectory().setProfileRoutes().configureSlackErrorHandler().setErrorRoutes();

app.use(handleSecurityPolicy);

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

// noinspection JSCheckFunctionSignatures
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
app.get('/version', handleVersion);
app.get('/logout', handleLogout);

app.get('/', (req, res) => {
    const home_options = {
        resources: resourceDefinitions,
    };
    return res.render(__dirname + '/views/pages/home', home_options);
});

app.get('/clean/:collection?', handleClean);

app.get('/stats', handleStats);

app.get('/index/:run?', handleIndex);

app.get('/.well-known/smart-configuration', handleSmartConfiguration);

app.get('/alert', handleAlert);

app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/favicon.ico', express.static(path.join(__dirname, 'images/favicon.ico')));

app.use('/css', express.static(path.join(__dirname, 'dist/css')));
app.use('/js', express.static(path.join(__dirname, 'dist/js')));
app.use('/icons', express.static(path.join(__dirname, 'dist/icons')));

// noinspection JSCheckFunctionSignatures
passport.use('graphqlStrategy', strategy);

// app.use(passport.initialize());

if (isTrue(env.ENABLE_GRAPHQL)) {
    graphql().then(x => {
        // eslint-disable-next-line new-cap
        const router = express.Router();
        router.use(passport.initialize({}));
        router.use(passport.authenticate('graphqlStrategy', {session: false}, null));

        router.use(x);
        // app.use('/graphql', x);
        app.use('/graphql', router);
        app.use(fhirApp.app);
    });
} else {
    app.use(fhirApp.app);
}

module.exports = {app, fhirApp};
