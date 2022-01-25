const {search} = require('../../operations/search/search');
const {searchById} = require('../../operations/searchById/searchById');
const {expand} = require('../../operations/expand/expand');
const {create} = require('../../operations/create/create');
const {update} = require('../../operations/update/update');
const {merge} = require('../../operations/merge/merge');
const {everything} = require('../../operations/everything/everything');
const {remove} = require('../../operations/remove/remove');
const {searchByVersionId} = require('../../operations/searchByVersionId/searchByVersionId');
const {history} = require('../../operations/history/history');
const {historyById} = require('../../operations/historyById/historyById');
const {patch} = require('../../operations/patch/patch');
const {validate} = require('../../operations/validate/validate');
const {graph} = require('../../operations/graph/graph');
const {get_all_args} = require('../../operations/common/get_all_args');


// This is needed for JSON.stringify() can handle regex
// https://stackoverflow.com/questions/12075927/serialization-of-regexp
// eslint-disable-next-line no-extend-native
Object.defineProperty(RegExp.prototype, 'toJSON', {
    value: RegExp.prototype.toString
});

/**
 * does a FHIR Search
 * @param {string[]} args
 * @param {IncomingMessage} req
 * @param {string} resource_name
 * @param {string} collection_name
 * @return {Resource[] | Resource} array of resources
 */
module.exports.search = async (args, {req}, resource_name, collection_name) => {
    /**
     * combined args
     * @type {string[]}
     */
    const combined_args = get_all_args(req, args);
    /**
     * @type {string}
     */
    const user = req.user;
    /**
     * @type {string}
     */
    const scope = req.authInfo && req.authInfo.scope;
    return search(combined_args, user, scope, resource_name, collection_name, req.protocol, req.originalUrl);
};

/**
 * does a FHIR Search By Id
 * @param {string[]} args
 * @param {IncomingMessage} req
 * @param {string} resource_name
 * @param {string} collection_name
 */
// eslint-disable-next-line no-unused-vars
module.exports.searchById = async (args, {req}, resource_name, collection_name) => {
    /**
     * @type {string}
     */
    const user = req.user;
    /**
     * @type {string}
     */
    const scope = req.authInfo && req.authInfo.scope;
    return searchById(args, user, scope, resource_name, collection_name);
};

/**
 * does a FHIR Create (POST)
 * @param {string[]} args
 * @param {IncomingMessage} req
 * @param {string} resource_name
 * @param {string} collection_name
 */
module.exports.create = async (args, {req}, resource_name, collection_name) => {
    /**
     * combined args
     * @type {string[]}
     */
    const combined_args = get_all_args(req, args);
    /**
     * @type {string}
     */
    const user = req.user;
    /**
     * @type {string}
     */
    const scope = req.authInfo && req.authInfo.scope;
    const body = req.body;
    /**
     * @type {string}
     */
    const path = req.path;

    return create(combined_args, user, scope, body, path, resource_name, collection_name);
};

/**
 * does a FHIR Update (PUT)
 * @param {string[]} args
 * @param {IncomingMessage} req
 * @param {string} resource_name
 * @param {string} collection_name
 */
module.exports.update = async (args, {req}, resource_name, collection_name) => {
    /**
     * combined args
     * @type {string[]}
     */
    const combined_args = get_all_args(req, args);
    /**
     * @type {string}
     */
    const user = req.user;
    /**
     * @type {string}
     */
    const scope = req.authInfo && req.authInfo.scope;
    const body = req.body;
    /**
     * @type {string}
     */
    const path = req.path;
    return update(combined_args, user, scope, body, path, resource_name, collection_name);
};

/**
 * does a FHIR Merge
 * @param {string[]} args
 * @param {IncomingMessage} req
 * @param {string} resource_name
 * @param {string} collection_name
 * @return {Resource | Resource[]}
 */
module.exports.merge = async (args, {req}, resource_name, collection_name) => {
    /**
     * combined args
     * @type {string[]}
     */
    const combined_args = get_all_args(req, args);
    /**
     * @type {string}
     */
    const user = req.user;
    /**
     * @type {string}
     */
    const scope = req.authInfo && req.authInfo.scope;
    const body = req.body;
    /**
     * @type {string}
     */
    const path = req.path;
    return merge(combined_args, user, scope, body, path, resource_name, collection_name);
};

/**
 * does a FHIR $everything
 * @param {string[]} args
 * @param {IncomingMessage} req
 * @param {string} resource_name
 * @param {string} collection_name
 */
module.exports.everything = async (args, {req}, resource_name, collection_name) => {
    /**
     * combined args
     * @type {string[]}
     */
    const combined_args = get_all_args(req, args);
    /**
     * @type {string}
     */
    const user = req.user;
    /**
     * @type {string}
     */
    const scope = req.authInfo && req.authInfo.scope;
    /**
     * @type {string}
     */
    const path = req.path;
    /**
     * @type {string}
     */
    const host = req.headers.host;
    return everything(combined_args, user, scope, path, req.protocol, host, resource_name, collection_name);
};

/**
 * does a FHIR Remove (DELETE)
 * @param {string[]} args
 * @param {IncomingMessage} req
 * @param {string} resource_name
 * @param {string} collection_name
 */
// eslint-disable-next-line no-unused-vars
module.exports.remove = async (args, {req}, resource_name, collection_name) => {
    /**
     * combined args
     * @type {string[]}
     */
    const combined_args = get_all_args(req, args);
    /**
     * @type {string}
     */
    const user = req.user;
    /**
     * @type {string}
     */
    const scope = req.authInfo && req.authInfo.scope;
    return remove(combined_args, user, scope, resource_name, collection_name);
};

/**
 * does a FHIR Search By Version
 * @param {string[]} args
 * @param {IncomingMessage} req
 * @param {string} resource_name
 * @param {string} collection_name
 */
// eslint-disable-next-line no-unused-vars
module.exports.searchByVersionId = async (args, {req}, resource_name, collection_name) => {
    /**
     * @type {string}
     */
    const user = req.user;
    /**
     * @type {string}
     */
    const scope = req.authInfo && req.authInfo.scope;
    return searchByVersionId(args, user, scope, resource_name, collection_name);
};

/**
 * does a FHIR History
 * @param {string[]} args
 * @param {IncomingMessage} req
 * @param {string} resource_name
 * @param {string} collection_name
 */
// eslint-disable-next-line no-unused-vars
module.exports.history = async (args, {req}, resource_name, collection_name) => {
    /**
     * @type {string}
     */
    const user = req.user;
    /**
     * @type {string}
     */
    const scope = req.authInfo && req.authInfo.scope;
    return history(args, user, scope, resource_name, collection_name);
};

/**
 * does a FHIR History By Id
 * @param {string[]} args
 * @param {IncomingMessage} req
 * @param {string} resource_name
 * @param {string} collection_name
 */
// eslint-disable-next-line no-unused-vars
module.exports.historyById = async (args, {req}, resource_name, collection_name) => {
    /**
     * @type {string}
     */
    const user = req.user;
    /**
     * @type {string}
     */
    const scope = req.authInfo && req.authInfo.scope;
    return historyById(args, user, scope, resource_name, collection_name);
};

/**
 * does a FHIR Patch
 * @param {string[]} args
 * @param {IncomingMessage} req
 * @param {string} resource_name
 * @param {string} collection_name
 */
// eslint-disable-next-line no-unused-vars
module.exports.patch = async (args, {req}, resource_name, collection_name) => {
    /**
     * @type {string}
     */
    const user = req.user;
    /**
     * @type {string}
     */
    const scope = req.authInfo && req.authInfo.scope;
    return patch(args, user, scope, resource_name, collection_name);
};

/**
 * does a FHIR Validate
 * @param {string[]} args
 * @param {IncomingMessage} req
 * @param {string} resource_name
 */
module.exports.validate = async (args, {req}, resource_name) => {
    /**
     * @type {string}
     */
    const user = req.user;
    /**
     * @type {string}
     */
    const scope = req.authInfo && req.authInfo.scope;
    const body = req.body;
    /**
     * @type {string}
     */
    const path = req.path;
    return validate(args, user, scope, body, path, resource_name);
};

/**
 * Supports $graph
 * @param {string[]} args
 * @param {IncomingMessage} req
 * @param {string} resource_name
 * @param {string} collection_name
 * @return {Promise<{entry: {resource: Resource, fullUrl: string}[], id: string, resourceType: string}|{entry: *[], id: string, resourceType: string}>}
 */
module.exports.graph = async (args, {req}, resource_name, collection_name) => {
    /**
     * combined args
     * @type {string[]}
     */
    const combined_args = get_all_args(req, args);
    /**
     * @type {string}
     */
    const user = req.user;
    /**
     * @type {string}
     */
    const scope = req.authInfo && req.authInfo.scope;
    const body = req.body;
    /**
     * @type {string}
     */
    const path = req.path;
    /**
     * @type {string}
     */
    const host = req.headers.host;

    return graph(combined_args, user, scope, body, path, req.protocol, host, resource_name, collection_name);
};

/**
 * does a FHIR Search By Id
 * @param {string[]} args
 * @param {IncomingMessage} req
 * @param {string} resource_name
 * @param {string} collection_name
 */
// eslint-disable-next-line no-unused-vars
module.exports.expand = async (args, {req}, resource_name, collection_name) => {
    /**
     * @type {string}
     */
    const user = req.user;
    /**
     * @type {string}
     */
    const scope = req.authInfo && req.authInfo.scope;
    return expand(args, user, scope, resource_name, collection_name);
};
