/**
 * This function removes any null, undefined, empty objects and empty arrays
 * @param {Object} obj
 * @return {Object}
 */
const removeNull = (obj) => {
    Object.keys(obj).forEach(key => {
            // Get this value and its type
            const value = obj[`${key}`];
            if (value === null) {
                delete obj[`${key}`];
                return;
            }
            const type = typeof value;
            // Date is also of type Object but has no properties
            if (type === 'object' && !(value instanceof Date)) {
                // Recurse...
                removeNull(value);
                if (!Object.keys(value).length) {
                    delete obj[`${key}`];
                }
                if (Array.isArray(value)) {
                    if (value.length === 0) {
                        delete obj[`${key}`];
                    }
                    for (const arrayItem of value) {
                        removeNull(arrayItem);
                    }
                }
            } else if (type === 'undefined') {
                delete obj[`${key}`];
            }
        }
    );
    return obj;
};

module.exports = {
    removeNull: removeNull
};
