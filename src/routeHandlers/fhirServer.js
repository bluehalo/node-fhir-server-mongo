const FHIRServer = require('@asymmetrik/node-fhir-server-core');
const compression = require('compression');
const bodyParser = require('body-parser');
const env = require('var');
const {htmlRenderer} = require('../middleware/htmlRenderer');
const {slackErrorHandler} = require('../middleware/slackErrorHandler');
const {isTrue} = require('../utils/isTrue');

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

module.exports = {
    MyFHIRServer: MyFHIRServer
};
