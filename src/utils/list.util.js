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

/**
 * https://stackoverflow.com/questions/14446511/most-efficient-method-to-groupby-on-an-array-of-objects
 * @param {*[]} sourceArray
 * @param {string} key
 * @return {*}
 */
const groupBy = function (sourceArray, key) { // `sourceArray` is an array of objects, `key` is the key (or property accessor) to group by
    // reduce runs this anonymous function on each element of `sourceArray` (the `item` parameter,
    // returning the `storage` parameter at the end
    return sourceArray.reduce(function (storage, item) {
        // get the first instance of the key by which we're grouping
        const group = item[`${key}`];

        // set `storage` for this instance of group to the outer scope (if not empty) or initialize it
        storage[`${group}`] = storage[`${group}`] || [];

        // add this item to its group within `storage`
        storage[`${group}`].push(item);

        // return the updated storage to the reduce function, which will then loop through the next
        return storage;
    }, {}); // {} is the initial value of the storage
};

/**
 * @callback FnGroupCallback
 * @param {*} x
 * @return {string}
 */

/**
 * https://stackoverflow.com/questions/14446511/most-efficient-method-to-groupby-on-an-array-of-objects
 * @param {Object[]} sourceArray
 * @param {FnGroupCallback} fnKey
 * @return {*}
 */
const groupByLambda = function (sourceArray, fnKey) { // `sourceArray` is an array of objects, `key` is the key (or property accessor) to group by
    // reduce runs this anonymous function on each element of `sourceArray` (the `item` parameter,
    // returning the `storage` parameter at the end
    return sourceArray.reduce(function (storage, item) {
        // get the first instance of the key by which we're grouping
        const group = fnKey(item);

        // set `storage` for this instance of group to the outer scope (if not empty) or initialize it
        storage[`${group}`] = storage[`${group}`] || [];

        // add this item to its group within `storage`
        storage[`${group}`].push(item);

        // return the updated storage to the reduce function, which will then loop through the next
        return storage;
    }, {}); // {} is the initial value of the storage
};

module.exports = {
    findDuplicates: findDuplicates,
    findDuplicateResources: findDuplicateResources,
    findUniques: findUniques,
    findUniqueResources: findUniqueResources,
    groupBy: groupBy,
    groupByLambda: groupByLambda
};
