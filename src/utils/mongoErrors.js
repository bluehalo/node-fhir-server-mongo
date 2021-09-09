class MongoError extends Error {
    /**
     * Creates an error for mongo
     * @param {string} message
     * @param {Error} error
     * @param {string} collection
     * @param {*} query
     * @param {*} options
     */
    constructor(message, error, collection, query, options = {}) {
        super(message + ': ' + collection + ': ' + JSON.stringify(query) + ' | ' + JSON.stringify(options));
        this.collection = collection;
        this.query = query;
        for (const [key, value] of Object.entries(options)) {
            this[`${key}`] = value;
        }
        if (!error) {
            throw new Error('MongoError requires a message and error');
        }
        // noinspection JSUnusedGlobalSymbols
        this.original_error = error;
        // noinspection JSUnusedGlobalSymbols
        this.stack_before_rethrow = this.stack;
        const message_lines = (message.match(/\n/g) || []).length + 1;
        this.stack = this.stack.split('\n').slice(0, message_lines + 1).join('\n') + '\n' +
            error.stack;
    }
}

module.exports = {
    MongoError
};
