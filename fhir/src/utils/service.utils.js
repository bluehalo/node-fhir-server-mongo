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
 * at least 1 part of the address field using regexs. Ignores case
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

/**
 * @name nameQueryBuilder
 * @description brute force method of matching human names. Splits the input and checks to see if every piece matches to
 * at least 1 part of the name field using regexs. Ignores case
 * @param {string} target
 * @return {array} ors
 */
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
 * @param {string} required the required system if specified
 * @return {JSON} queryBuilder
 * Using to assign a single variable:
 *      let queryBuilder = tokenQueryBuilder(identifier, 'value', 'identifier');
        for (let i in queryBuilder) {
            query[i] = queryBuilder[i];
        }
 * Use in an or query
 *      query.$or = [tokenQueryBuilder(identifier, 'value', 'identifier'), tokenQueryBuilder(type, 'code', 'type.coding')];
 */
let tokenQueryBuilder = function (target, type, field, required) {
    let queryBuilder = {};
    let system = '';
    let value = '';

    if (target.includes('|')) {
        [ system, value ] = target.split('|');

        if (required) {
            system = required;
        }
    }
    else {
        value = target;
    }

    if (system) {
        queryBuilder[`${field}.system`] = system;
    }
    if (value) {
        queryBuilder[`${field}.${type}`] = value;
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

/**
 * @name numberQueryBuilder
 * @description takes in number query and returns a mongo query. The target parameter can have a 2 letter prefix to
 *              specify a specific kind of query. Else, an approximation query will be returned.
 * @param target
 * @returns {JSON} a mongo query
 */
let numberQueryBuilder = function (target) {
    let prefix = '';
    let number = '';
    let sigfigs = '';

    // Check if there is a prefix
    if (isNaN(target)) {
        prefix = target.substring(0, 2);
        number = parseFloat(target.substring(2));
        sigfigs = target.substring(2);
    }
    else {
        number = parseFloat(target);
        sigfigs = target;
    }

    // Check for prefix and return the appropriate query
    // Missing eq(default), sa, eb, and ap prefixes
    switch (prefix) {
        case 'lt':
            return {$lt: number};
        case 'le' :
            return {$lte: number};
        case 'gt':
            return {$gt: number};
        case 'ge':
            return {$gte: number};
        case 'ne':
            return {$ne: number};
    }

    // Return an approximation query
    let decimals = sigfigs.split('.')[1];
    if (decimals) {
        decimals = decimals.length + 1;
    }
    else {
        decimals = 1;
    }
    let aprox = (1 / 10 ** decimals) * 5;

    return {$gte: number - aprox, $lt: number + aprox};

};

/**
 * @name quantityQueryBuilder
 * @description builds quantity data types
 * @param target [prefix][number]|[system]|[code]
 * @param field path to specific field in the resource
 */
let quantityQueryBuilder = function (target, field) {
  let qB = {};
  //split by the two pipes
  let [num, system, code] = target.split('|');

  if (system) {
    qB[`${field}.system`] = system;
  }
  if (code) {
    qB[`${field}.code`] = code;
  }

  if (isNaN(num)) { //with prefixes
      let prefix = num.substring(0, 2);
      num = Number(num.substring(2));

      // Missing eq(default), sa, eb, and ap prefixes
      switch (prefix) {
          case 'lt':
              qB[`${field}.value`] = {$lt: num};
              break;
          case 'le' :
              qB[`${field}.value`] = {$lte: num};
              break;
          case 'gt':
              qB[`${field}.value`] = {$gt: num};
              break;
          case 'ge':
              qB[`${field}.value`] = {$gte: num};
              break;
          case 'ne':
              qB[`${field}.value`] = {$ne: num};
              break;
      }
  }
  else { //no prefixes
    qB[`${field}.value`] = Number(num);
  }

  return qB;
};

/**
 * @name compositeQueryBuilder
 * @description from looking at where composites are used, the fields seem to be implicit
 * @param target What we're querying for
 * @param field1 contains the path and search type
 * @param field2 contains the path and search type
 */
let compositeQueryBuilder = function(target, field1, field2) {
    // console.log(`${target}, ${field1}, ${field2}`);

    let composite = [];
    let temp = {};
    let [ target1, target2 ] = target.split(/[$,]/);
    let [ path1, type1 ] = field1.split('|');
    let [ path2, type2 ] = field2.split('|');

    // console.log(`${target1}, ${path1}, ${type1}`);
    // console.log(`${target2}, ${path2}, ${type2}`);
    // console.log(args);

    // Call the right queryBuilder based on type
    switch (type1) {
        case 'string':
            temp = {};
            temp[`${path1}`] = stringQueryBuilder(target1);
            composite.push(temp);
            break;
        case 'token':
            composite.push(tokenQueryBuilder(target1, 'code', path1, ''));
            break;
        case 'reference':
            composite.push(referenceQueryBuilder(target1, path1));
            break;
        case 'quantity':
            composite.push(quantityQueryBuilder(target1, path1));
            break;
        case 'number':
            temp = {};
            temp[`${path1}`] = numberQueryBuilder(target1);
            composite.push(temp);
            break;
        // case 'date':
        //     break;
        default:
            temp = {};
            temp[`${path1}`] = target1;
            composite.push(temp);
    }
    switch (type2) {
        case 'string':
            temp = {};
            temp[`${path2}`] = stringQueryBuilder(target2);
            composite.push(temp);
            break;
        case 'token':
            composite.push(tokenQueryBuilder(target2, 'code', path2, ''));
            break;
        case 'reference':
            composite.push(referenceQueryBuilder(target2, path2));
            break;
        case 'quantity':
            composite.push(quantityQueryBuilder(target2, path2));
            break;
        case 'number':
            temp = {};
            temp[`${path2}`] = composite.push(numberQueryBuilder(target2));
            composite.push(temp);
            break;
        // case 'date':
        //     break;
        default:
            temp = {};
            temp[`${path2}`] = target2;
            composite.push(temp);
    }

    // console.log(composite);

    if (target.includes('$')) {
        return {$and: composite};
    }
    else {
        return {$or: composite};
    }

};

/**
 * @todo build out all prefix functionality for number and quantity and add date queries
 */
module.exports = {
    stringQueryBuilder,
    tokenQueryBuilder,
    referenceQueryBuilder,
    addressQueryBuilder,
    nameQueryBuilder,
    numberQueryBuilder,
    quantityQueryBuilder,
    compositeQueryBuilder
};
