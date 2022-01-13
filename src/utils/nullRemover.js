const removeNull = (obj) => {
    Object.keys(obj).forEach(key => {
            // Get this value and its type
            const value = obj[key];
            const type = typeof value;
            if (type === 'object') {
                if (value === null) {
                    delete obj[key];
                } else {
                    // Recurse...
                    removeNull(value);
                    // if (!Object.keys(value).length) {
                    //     delete obj[key];
                    // }
                    if (Array.isArray(value)) {
                        for (const arrayItem of value) {
                            removeNull(arrayItem);
                        }
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
