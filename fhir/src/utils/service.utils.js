/**
 * @name stringQueryBuilder
 * @description builds mongo default query for string inputs, no modifiers
 * @param {string} target what we are querying for
 * @return a mongo regex query
 */
let stringQueryBuilder = function (target) {
  let t2 = target.replace(/[\\(\\)\\-\\_\\+\\=\\/\\.]/g, '\\$&');
    return {$regex: new RegExp('^' + t2, 'i')};
};

// Previous attempt for strings, handles contains and exact modifiers
// let stringQueryBuilder = function (input) {
//     // Extract variables from input
//     // input = field:modifier=target
//     let [ temp, target ] = input.split('=')[1];
//     let [ field, modifier ] = temp.split(':');
//
//     if (modifier) {
//         if (modifier === 'contains') {
//             query[`${field}`] = {$regex: new RegExp(target, 'i')};
//         }
//         else if (modifier === 'exact') {
//             query[`${field}`] = target;
//         }
//     }
//     else {
//         query[`${field}`] = {$regex: new RegExp('^' + target, 'i')};
//     }
// };

/**
 * @name tokenQueryBuilder
 * @param {string} target what we are searching for
 * @param {string} type codeable concepts use a code field and identifiers use a value
 * @param {string} field path to system and value from field
 * @return {JSON} ret
 * Using to assign a single variable:
 *      let queryBuilder = tokenQueryBuilder(identifier, 'value', 'identifier');
        for (let i in queryBuilder) {
            query[i] = queryBuilder[i];
        }
 * Use in an or query
 *      query.$or = [tokenQueryBuilder(identifier, 'value', 'identifier'), tokenQueryBuilder(type, 'code', 'type.coding')];
 */
let tokenQueryBuilder = function (target, type, field) {
    let queryBuilder = {};
    if (target.includes('|')) {
        let [ system, value ] = target.split('|');
        if (system) {
            queryBuilder[`${field}.system`] = system;
        }
        if (value) {
            queryBuilder[`${field}.${type}`] = value;
        }
    }
    else {
        queryBuilder[`${field}.${type}`] = target;
    }

    return queryBuilder;
};

//If we are just making the default case and not worrying about any other options,
//then this method will simply do nothing.  However, I've placed this here for future
//changes to references.
let referenceBuilder = function (target) {
  return target;
};

/**
 * @todo figure out how to incorporate modifiers
 */
module.exports = {
    stringQueryBuilder,
    tokenQueryBuilder,
    referenceBuilder
};
