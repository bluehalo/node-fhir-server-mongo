/**
 * @name stringQueryBuilder
 * @description builds mongo default query for string inputs, no modifiers
 * @param {string} target what we are querying for
 * @return a mongo regex query
 */
let stringQueryBuilder = function (target) {
    return {$regex: new RegExp('^' + target, 'i')};
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
 */
let tokenQueryBuilder = function (target, type, field) {
    let ret = {};
    if (target.includes('|')) {
        let [ system, value ] = target.split('|');
        if (system) {
            ret[`${field}.system`] = system;
        }
        if (value) {
            ret[`${field}.${type}`] = value;
        }
    }
    else {
        ret[`${field}.${type}`] = target;
    }

    return ret;
};

/**
 * @todo figure out how to incorporate modifiers
 */
module.exports = {
    stringQueryBuilder,
    tokenQueryBuilder
};
