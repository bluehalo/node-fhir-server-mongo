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
 * @name addressQueryBuilder
 * @description brute force method of matching addresses. Splits the input and checks to see if every piece matches to
 * at least 1 part of the address field using regexs. Ignores case. When using in a service, assign to the ors array rather
 * then pushing.
 * @param {string} target
 * @return {array} ors
 */
let addressQueryBuilder = function (target) {
    // console.log(target);
    // Tokenize the input as mush as possible
    let totalSplit = target.split(/[\s,]+/);
    let ors = [];
    // console.log(totalSplit);

    for (let index in totalSplit) {
        ors.push({$or: [
            {'address.line': {$regex: new RegExp(`${totalSplit[index]}`, 'i')}},
            {'address.city': {$regex: new RegExp(`${totalSplit[index]}`, 'i')}},
            {'address.district': {$regex: new RegExp(`${totalSplit[index]}`, 'i')}},
            {'address.state': {$regex: new RegExp(`${totalSplit[index]}`, 'i')}},
            {'address.postalCode': {$regex: new RegExp(`${totalSplit[index]}`, 'i')}},
            {'address.country': {$regex: new RegExp(`${totalSplit[index]}`, 'i')}}
        ]});
    }

    // console.log(ors);
    return ors;
};

let nameQueryBuilder = function (target) {
  let split = target.split(/[\s.,]+/);
  let ors = [];

  for (let i in split) {
    ors.push( {$or: [
      {'name.text': {$regex: new RegExp(`${split[i]}`, 'i')}},
      {'name.family': {$regex: new RegExp(`${split[i]}`, 'i')}},
      {'name.given': {$regex: new RegExp(`${split[i]}`, 'i')}},
      {'name.suffix': {$regex: new RegExp(`${split[i]}`, 'i')}},
      {'name.prefix': {$regex: new RegExp(`${split[i]}`, 'i')}}
    ]});
  }
  return ors;
};

/**
 * @name tokenQueryBuilder
 * @param {string} target what we are searching for
 * @param {string} type codeable concepts use a code field and identifiers use a value
 * @param {string} field path to system and value from field
 * @return {JSON} queryBuilder
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

/**
 * @name referenceQueryBuilder
 * @param {string} target
 * @param {string} field
 * @return {JSON} queryBuilder
 */
let referenceQueryBuilder = function (target, field) {
    const regex = /http(.*)?\/(\w+\/.+)$/;
    const match = target.match(regex);
    let queryBuilder = {};

    // Check if target is a url
    if (match) {
        queryBuilder[field] = match[2];
    }
    // target = type/id
    else if (target.includes('/')) {
        let [type, id] = target.split('/');
        queryBuilder[field] = `${type}/${id}`;
    }
    // target = id The type may be there so we need to check the end of the field for the id
    else {
        queryBuilder[field] = {$regex: new RegExp(`${target}$`)};
    }

    return queryBuilder;
};

// This function can take in a number or a number with a prefix
// (ex gt43.44 -> greater than 43.44).  If they just enter a number, then numbers
// within a certain range are allowed.  Ex: 100.00 -> 99.995 to 100.0049999...
let numberQueryBuilder = function (target) {
  let reg1 = /^(\w{2})(-?\d+(\.\d+)?)$/;
  let reg2 = /^(-?\d+(\.\d+)?)$/;
  let match1 = target.match(reg1);
  let match2 = target.match(reg2);
  if (match1 && match1.length > 0) {
    if (match1[1] === 'lt') {
      return { $lt: Number(match1[2]) };
    }
    if (match1[1] === 'le') {
      return { $lte: Number(match1[2]) };
    }
    if (match1[1] === 'gt') {
      return { $gt: Number(match1[2]) };
    }
    if (match1[1] === 'ge') {
      return { $gte: Number(match1[2]) };
    }
    if (match1[1] === 'ne') {
      return { $ne: Number(match1[2]) };
    }
  }
  // because floating points aren't stored precisely, this may not round correctly
  // for certain numbers ending in 5.  For example, sometimes 24.45 may not round to 24.5
  if (match2 && match2.length > 0) {
    let num = match2[1];
    if ( num.includes('.') ) {
      let numDecimals = num.length - num.indexOf('.') - 1;
      let temp = Number(num).toFixed(numDecimals);
      return Number(temp);
    } else {
      let temp = Number(num).toFixed(0);
      return Number(temp);
    }
  }
};

/**
 * @todo figure out how to incorporate modifiers
 */
module.exports = {
    stringQueryBuilder,
    tokenQueryBuilder,
    referenceQueryBuilder,
    addressQueryBuilder,
    nameQueryBuilder,
    numberQueryBuilder
};
