class RequestInfo {
    /**
     * class that holds request info
     * @param {string | null} user
     * @param {string} scope
     * @param {string} protocol
     * @param {string} originalUrl
     * @param {string | null} remoteIpAddress
     * @param {string | null} path
     * @param {string | null} host
     * @param {Object | Object[] | null} body
     */
    constructor(user,
                scope,
                remoteIpAddress,
                protocol,
                originalUrl,
                path,
                host,
                body) {
        /**
         * @type {string|null}
         */
        this.user = user;
        /**
         * @type {string}
         */
        this.scope = scope;
        /**
         * @type {string|null}
         */
        this.remoteIpAddress = remoteIpAddress;
        /**
         * @type {string}
         */
        this.protocol = protocol;
        /**
         * @type {string}
         */
        this.originalUrl = originalUrl;
        /**
         * @type {string|null}
         */
        this.path = path;
        /**
         * @type {string|null}
         */
        this.host = host;
        /**
         * @type {Object|Object[]|null}
         */
        this.body = body;
    }
}

module.exports = {
    RequestInfo: RequestInfo
};
