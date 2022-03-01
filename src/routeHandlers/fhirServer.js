/**
 * This route handler implement the fhir server route.  It inherits from the base FHIR Server and makes some changes
 */

const FHIRServer = require('@asymmetrik/node-fhir-server-core');
const compression = require('compression');
const bodyParser = require('body-parser');
const env = require('var');
const {htmlRenderer} = require('../middleware/htmlRenderer');
const {slackErrorHandler} = require('../middleware/slackErrorHandler');
const {isTrue} = require('../utils/isTrue');
const loggers = require('@asymmetrik/node-fhir-server-core/dist/server/winston');
const {resolveSchema, isValidVersion} = require('@asymmetrik/node-fhir-server-core/dist/server/utils/schema.utils');
const {VERSIONS} = require('@asymmetrik/node-fhir-server-core/dist/constants');
const ServerError = require('@asymmetrik/node-fhir-server-core/dist/server/utils/server.error');

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

    setErrorRoutes() {
        let logger = loggers.get('default');
        //Enable error tracking error handler if supplied in config
        if (this.config.errorTracking && this.config.errorTracking.errorHandler) {
            this.app.use(this.config.errorTracking.errorHandler());
        }

        // Generic catch all error handler
        // Errors should be thrown with next and passed through
        this.app.use((err, req, res, next) => {
            // get base from URL instead of params since it might not be forwarded
            const base = req.url.split('/')[1];

            // Get an operation outcome for this instance
            const OperationOutcome = resolveSchema(
                isValidVersion(base) ? base : VERSIONS['4_0_1'],
                'operationoutcome'
            );

            // If there is an error and it is an OperationOutcome
            if (err && err.resourceType === OperationOutcome.resourceType) {
                const status = err.statusCode || 500;
                res.status(status).json(err);
            } else if (err instanceof ServerError) {
                const status = err.statusCode || 500;
                res.status(status).json(new OperationOutcome(err));
            } else if (err) {
                const error = new OperationOutcome({
                    statusCode: 500,
                    issue: [
                        {
                            severity: 'error',
                            code: 'internal',
                            details: {
                                text: `Unexpected: ${err.message}`,
                            },
                            diagnostics: env.IS_PRODUCTION ? err.message : err.stack,
                        },
                    ],
                });

                logger.error(error);
                res.status(error.statusCode).json(error);
            } else {
                next();
            }
        });

        // Nothing has responded by now, respond with 404
        this.app.use((req, res) => {
            // get base from URL instead of params since it might not be forwarded
            const base = req.url.split('/')[1] || VERSIONS['4_0_1'];

            let OperationOutcome;
            if (Object.keys(VERSIONS).includes(base)) {
                OperationOutcome = resolveSchema(base, 'operationoutcome');
            } else {
                // if it's a misplaced URL, just return an R4 OperationOutcome
                OperationOutcome = resolveSchema('4_0_1', 'operationoutcome');
            }

            // Get an operation outcome for this instance
            const error = new OperationOutcome({
                statusCode: 404,
                issue: [
                    {
                        severity: 'error',
                        code: 'not-found',
                        details: {
                            text: `Invalid url: ${req.path}`,
                        },
                    },
                ],
            });

            logger.error(error);
            res.status(error.statusCode).json(error);
        });

        // return self for chaining
        return this;
    }
}

module.exports = {
    MyFHIRServer: MyFHIRServer
};
