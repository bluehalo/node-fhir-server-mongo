const removeNull = (obj) => {
    Object.keys(obj).forEach(key => {
            // Get this value and its type
            const value = obj[key];
            if (value === null) {
                delete obj[key];
                return;
            }
            const type = typeof value;
            if (type === 'object') {
                // Recurse...
                removeNull(value);
                if (!Object.keys(value).length) {
                    delete obj[key];
                }
                if (Array.isArray(value)) {
                    if (value.length === 0) {
                        delete obj[key];
                    }
                    for (const arrayItem of value) {
                        removeNull(arrayItem);
                    }
                }
            } else if (type === 'undefined') {
                // Undefined, remove it
                delete obj[key];
            }
        }
    );
    return obj;
};

module.exports = {
    removeNull: removeNull
};
