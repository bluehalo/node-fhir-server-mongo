// const {UserFacingError} = require('./baseErrors');
const {ServerError} = require('@asymmetrik/node-fhir-server-core');

class BadRequestError extends ServerError {
    constructor(message, options = {}) {
        super(message, {
            // Set this to make the HTTP status code 409
            statusCode: 400,
            // Add any normal operation outcome stuff here
            issue: [
                {
                    severity: 'error',
                    code: 'internal',
                    details: {text: message},
                },
            ],
        });

        // You can attach relevant information to the error instance
        // (e.g.. the username)

        for (const [key, value] of Object.entries(options)) {
            this[key] = value;
        }
    }

    get statusCode() {
        return 400;
    }
}


class NotFoundError extends ServerError {
    constructor(message, options = {}) {
        super(message, {
            // Set this to make the HTTP status code 409
            statusCode: 404,
            // Add any normal operation outcome stuff here
            issue: [
                {
                    severity: 'error',
                    code: 'internal',
                    details: {text: message},
                },
            ],
        });

        // You can attach relevant information to the error instance
        // (e.g.. the username)

        for (const [key, value] of Object.entries(options)) {
            this[key] = value;
        }
    }

    get statusCode() {
        return 404;
    }
}

class NotAllowedError extends ServerError {
    constructor(message, options = {}) {
        super(message, {
            // Set this to make the HTTP status code 409
            statusCode: 409,
            // Add any normal operation outcome stuff here
            issue: [
                {
                    severity: 'error',
                    code: 'internal',
                    details: {text: message},
                },
            ],
        });

        // You can attach relevant information to the error instance
        // (e.g.. the username)

        for (const [key, value] of Object.entries(options)) {
            this[key] = value;
        }
    }

    get statusCode() {
        return 409;
    }
}

class NotValidatedError extends ServerError {
    constructor(errors, options = {}) {
        super('Validation Failed', {
            // Set this to make the HTTP status code 409
            statusCode: 400,
            // Add any normal operation outcome stuff here
            issue: errors.map(x => {
                return {
                    severity: 'error',
                    code: 'validation',
                    details: {
                        text: x.dataPath + ' ' + x.message
                    },
                    expression: [
                        x.dataPath
                    ],
                    diagnostics: JSON.stringify(x)
                };
            })
        });

        // You can attach relevant information to the error instance
        // (e.g.. the username)

        for (const [key, value] of Object.entries(options)) {
            this[key] = value;
        }
    }

    get statusCode() {
        return 400;
    }
}

module.exports = {
    BadRequestError,
    NotFoundError,
    NotAllowedError,
    NotValidatedError
};
