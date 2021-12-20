const {customIndexes} = require('./customIndexes');

/**
 * returns whether two sets are the same (regardless of sorting)
 * @param {Set} as
 * @param {Set} bs
 * @return {boolean}
 */
function eqSet(as, bs) {
    if (as.size !== bs.size) {
        return false;
    }
    for (const a of as) {
        if (!bs.has(a)) {
            return false;
        }
    }
    for (const b of bs) {
        if (!as.has(b)) {
            return false;
        }
    }
    return true;
}

/**
 * find index for given collection and fields
 * @param {string} collection_name
 * @param {string[]} fields
 * @return {string|null}
 */
function findIndexForFields(collection_name, fields) {
    if (!fields || fields.length === 0) {
        return null;
    }

    const fieldsSet = new Set(fields);
    for (const [collection, indexesArray] of Object.entries(customIndexes)) {
        if (collection === '*' || collection === collection_name) {
            for (const indexDefinition of indexesArray) {
                // noinspection JSCheckFunctionSignatures
                for (const [indexName, indexColumns] of Object.entries(indexDefinition)) {
                    if (eqSet(new Set(indexColumns), fieldsSet)) {
                        return indexName;
                    }
                }
            }
        }
    }
    return null;
}

module.exports = {
    findIndexForFields
};
