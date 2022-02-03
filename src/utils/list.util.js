/**
 * @callback FnKeyCallback
 * @param {Object} x
 * @return {string}
 */

/**
 * @param {Object[]} listToCheck
 * @param {FnKeyCallback} fnKey
 * @returns {Object[]}
 */
const findDuplicates = (listToCheck, fnKey) => {
    // https://stackoverflow.com/questions/53212020/get-list-of-duplicate-objects-in-an-array-of-objects
    /**
     * @type {Object}
     */
    const lookup_by_id = listToCheck.reduce((a, e) => {
        a[fnKey(e)] = ++a[fnKey(e)] || 0;
        return a;
    }, {});
    return listToCheck.filter(e => lookup_by_id[fnKey(e)]);
};

/**
 * @param {Object[]} listToCheck
 * @param {FnKeyCallback} fnKey
 * @returns {Object[]}
 */
const findUniques = (listToCheck, fnKey) => {
    // https://stackoverflow.com/questions/53212020/get-list-of-duplicate-objects-in-an-array-of-objects
    /**
     * @type {Object}
     */
    const lookup_by_id = listToCheck.reduce((a, e) => {
        a[fnKey(e)] = ++a[fnKey(e)] || 0;
        return a;
    }, {});
    return listToCheck.filter(e => !lookup_by_id[fnKey(e)]);
};

/**
 * @param {Object[]} listToCheck
 * @returns {Object[]}
 */
const findDuplicateResources = (listToCheck) => {
    return findDuplicates(listToCheck, r => `${r.resourceType}/${r.id}`);
};

/**
 * @param {Object[]} listToCheck
 * @returns {Object[]}
 */
const findUniqueResources = (listToCheck) => {
    return findUniques(listToCheck, r => `${r.resourceType}/${r.id}`);
};

module.exports = {
    findDuplicates: findDuplicates,
    findDuplicateResources: findDuplicateResources,
    findUniques: findUniques,
    findUniqueResources: findUniqueResources
};
