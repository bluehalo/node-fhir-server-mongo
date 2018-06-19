/**
 * @name stringQueryBuilder
 * @description builds mongo query for string inputs
 * @param {string} input
 * @param {JSON} query
 * @return NONE
 */
let stringQueryBuilder = function (input, query) {
    // input = [base]/target?modifier=str
    // let [ version, tail ] = name.split('/');
    // let [ target, modifier ] = tail.split(('?'));
    // let str = modifier.split('=')[1];

    // input = target?modifier=str
    let [ target, modifier ] = input.split(('?'));
    let str = modifier.split('=')[1];

    if (modifier.includes('contains')) {
        query[`${target}`] = {$regex: new RegExp(str, 'i')};
    }
    else if (modifier.includes('exact')) {
        query[`${target}`] = str;
    }
    // If no modifier was given, does given by default and modifier will hold the string
    else if (str === undefined) {
        query[`${target}`] = {$regex: new RegExp('^' + modifier, 'i')};
    }
    // if modifier === given
    else {
        query[`${target}`] = {$regex: new RegExp('^' + str, 'i')};
    }
};

module.exports = {
    stringQueryBuilder
};
