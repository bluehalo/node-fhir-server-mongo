/**
 * @name stringQueryBuilder
 * @description builds mongo default query for string inputs, no modifiers
 * @param {string} target what we are querying for
 * @return query
 */
let stringQueryBuilder = function (target) {
    return {$regex: new RegExp('^' + target, 'i')};
};

// Previous attempt, handles contains and exact modifiers
// Meant to take in the whole query but I also misinterpreted it
// let stringQueryBuilder = function (input) {
//     // input = target?modifier=str
//     let [ target, modifier ] = input.split(('?'));
//     let str = modifier.split('=')[1];
//
//     if (modifier.includes('contains')) {
//         query[`${target}`] = {$regex: new RegExp(str, 'i')};
//     }
//     else if (modifier.includes('exact')) {
//         query[`${target}`] = str;
//     }
//     // If no modifier was given, does given by default and modifier will hold the string
//     else if (str === undefined) {
//         query[`${target}`] = {$regex: new RegExp('^' + modifier, 'i')};
//     }
//     // if modifier === given
//     else {
//         query[`${target}`] = {$regex: new RegExp('^' + str, 'i')};
//     }
// };

/**
 * @todo figure out how to incorporate modifiers
 */
module.exports = {
    stringQueryBuilder
};
