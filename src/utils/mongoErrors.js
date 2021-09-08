class MongoError extends Error {
    constructor(message, query, options = {}) {
        super(message + ': ' + JSON.stringify(query));
        this['query'] = query;
        for (const [key, value] of Object.entries(options)) {
            this[`${key}`] = value;
        }
    }
}

module.exports = {
    MongoError
};
