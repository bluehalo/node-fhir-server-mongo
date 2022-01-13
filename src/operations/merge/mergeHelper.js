const deepcopy = require('deepcopy');
const deepEqual = require('fast-deep-equal');
const deepmerge = require('deepmerge');

/**
 * @type {{customMerge: (function(*): *)}}
 */
    // noinspection JSUnusedGlobalSymbols,JSUnusedLocalSymbols
const options = {
        // eslint-disable-next-line no-unused-vars
        customMerge: (/*key*/) => {
            // eslint-disable-next-line no-use-before-define
            return mergeObjectOrArray;
        }
    };

/**
 * @param {?Object | Object[]} oldItem
 * @param {?Object | Object[]} newItem
 * @return {?Object | Object[]}
 */
const mergeObjectOrArray = (oldItem, newItem) => {
    if (deepEqual(oldItem, newItem)) {
        return oldItem;
    }
    if (Array.isArray(oldItem)) {
        /**
         * @type {? Object[]}
         */
        let result_array = null;
        // iterate through all the new array and find any items that are not present in old array
        for (let i = 0; i < newItem.length; i++) {
            /**
             * @type {Object}
             */
            let my_item = newItem[`${i}`];

            if (my_item === null) {
                continue;
            }

            // if newItem[i] does not match any item in oldItem then insert
            if (oldItem.every(a => deepEqual(a, my_item) === false)) {
                if (typeof my_item === 'object' && 'id' in my_item) {
                    // find item in oldItem array that matches this one by id
                    /**
                     * @type {number}
                     */
                    const matchingOldItemIndex = oldItem.findIndex(x => x['id'] === my_item['id']);
                    if (matchingOldItemIndex > -1) {
                        // check if id column exists and is the same
                        //  then recurse down and merge that item
                        if (result_array === null) {
                            result_array = deepcopy(oldItem); // deep copy so we don't change the original object
                        }
                        result_array[`${matchingOldItemIndex}`] = deepmerge(oldItem[`${matchingOldItemIndex}`], my_item, options);
                        continue;
                    }
                }
                // insert based on sequence if present
                if (typeof my_item === 'object' && 'sequence' in my_item) {
                    /**
                     * @type {Object[]}
                     */
                    result_array = [];
                    // go through the list until you find a sequence number that is greater than the new
                    // item and then insert before it
                    /**
                     * @type {number}
                     */
                    let index = 0;
                    /**
                     * @type {boolean}
                     */
                    let insertedItem = false;
                    while (index < oldItem.length) {
                        /**
                         * @type {Object}
                         */
                        const element = oldItem[`${index}`];
                        // if item has not already been inserted then insert before the next sequence
                        if (!insertedItem && (element['sequence'] > my_item['sequence'])) {
                            result_array.push(my_item); // add the new item before
                            result_array.push(element); // then add the old item
                            insertedItem = true;
                        } else {
                            result_array.push(element); // just add the old item
                        }
                        index += 1;
                    }
                    if (!insertedItem) {
                        // if no sequence number greater than this was found then add at the end
                        result_array.push(my_item);
                    }
                } else {
                    // no sequence property is set on this item so just insert at the end
                    if (result_array === null) {
                        result_array = deepcopy(oldItem); // deep copy so we don't change the original object
                    }
                    result_array.push(my_item);
                }
            }
        }
        if (result_array !== null) {
            return result_array;
        } else {
            return oldItem;
        }
    }
    return deepmerge(oldItem, newItem, options);
};

const mergeObject = (currentResource, newResource) => {
    return deepmerge(currentResource, newResource, options);
};

module.exports = {
    mergeObject: mergeObject
};

