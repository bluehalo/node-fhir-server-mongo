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

//for modular arithmetic because % is just for remainder -> JS is a cruel joke
function mod(n, m) {
  return ((n % m) + m) % m;
}

//gives the number of days from year 0, used for adding or subtracting days from a date
let getDayNum = function (y, m, d) {
m = mod((m + 9), 12);
y = y - Math.floor(m / 10);
return (365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) + Math.floor((m * 306 + 5) / 10) + ( d - 1 ));
};

//returns a date given the number of days from year 0;
let getDateFromNum = function (g) {
  let y = Math.floor((10000 * g + 14780) / 3652425);
  let ddd = g - (365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400));
  if (ddd < 0) {
   y = y - 1;
   ddd = g - (365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400));
 }
  let mi = Math.floor((100 * ddd + 52) / 3060);
  let mm = mod((mi + 2), 12) + 1;
  y = y + Math.floor((mi + 2) / 12);
  let dd = ddd - Math.floor((mi * 306 + 5) / 10) + 1;
  return y.toString() + '-' + ('0' + mm).slice(-2) + '-' + ('0' + dd).slice(-2);
};

//deals with date, dateTime, instant, period, and timing
//use like this: query['whatever'] = dateQueryBuilder(whatever, 'dateTime'), but it's different for period and timing
//the condition service has some examples you might want to look at.
//can't handle prefixes yet!  Also doesn't work foe when things are stored in different time zones in the .json files (with the + or -)
let dateQueryBuilder = function (date, type, path) {
  let regex = /^(\D{2})?(\d{4})(-\d{2})?(-\d{2})?(?:(T\d{2}:\d{2})(:\d{2})?)?(Z|(\+|-)(\d{2}):(\d{2}))?$/;
  let match = date.match(regex);
  let str = '';
  let toRet = [];
  let pArr = []; //will have other possibilities such as just year, just year and month, etc
  let prefix = '$eq';
  if (match && match.length >= 1 ) {
    if (match[1]) {
			// replace prefix with mongo specific comparators
			prefix = '$' + match[1].replace('ge', 'gte').replace('le', 'lte');
		}
    if (type === 'date') { //if its just a date, we don't have to worry about time components
      if (prefix === '$eq') {
        //add parts of date that are available
        for (let i = 2; i < 5; i++) { //add up the date parts in a string
          if (match[i]) {
            str = str + match[i];
            pArr[i - 2] = str + '$';
          }
        }
        //below we have to check if the search gave more information than what is actually stored
        return {$regex: new RegExp('^' + '(?:' + str + ')|(?:' + pArr[0] + ')|(?:' + pArr[1] + ')|(?:' + pArr[2] + ')', 'i')};
      }
    }

    if (type === 'dateTime' || type === 'instant' || type === 'period' || type === 'timing') { //now we have to worry about hours, minutes, seconds, and TIMEZONES
      if (prefix === '$eq') {
        if (match[5]) { //to see if time is included
          for (let i = 2; i < 6; i++) {
            str = str + match[i];
            if (i === 5) {
              pArr[i - 2] = str + 'Z?$';
            } else {
              pArr[i - 2] = str + '$';
            }
          }
          if (type === 'instant'){
            if (match[6]) { //to check if seconds were included or not
              str = str + match[6];
            }
          }
          if (match[9]) { // we know there is a +|-hh:mm at the end
            let mins = 0;
            let hrs = 0;
            if (match[8] === '+') { //time is ahead of UTC so we must subtract
              let hM = match[5].split(':');
              hM[0] = hM[0].replace('T', '');
              mins = Number(hM[1]) - Number(match[10]);
              hrs = Number(hM[0]) - Number(match[9]);
              if (mins < 0) { //when we subtract the minutes and go below zero, we need to remove an hour
                mins = mod(mins, 60);
                hrs = hrs - 1;
              }
              if (hrs < 0) { //when hours goes below zero, we have to adjust the date
                hrs = mod(hrs, 24);
                str = getDateFromNum(getDayNum(Number(match[2]), Number(match[3].replace('-', '')), Number(match[4].replace('-', ''))) - 1);
              } else {
                str = getDateFromNum(getDayNum(Number(match[2]), Number(match[3].replace('-', '')), Number(match[4].replace('-', ''))));
              }
            } else { //time is behind UTC so we add
              let hM = match[5].split(':');
              hM[0] = hM[0].replace('T', '');
              mins = Number(hM[1]) + Number(match[10]);
              hrs = Number(hM[0]) + Number(match[9]);
              if (mins > 59) { //if we go above 59, we need to increase hours
                mins = mod(mins, 60);
                hrs = hrs + 1;
              }
              if (hrs > 23) { //if we go above 23 hours, new day
                hrs = mod(hrs, 24);
                str = getDateFromNum(getDayNum(Number(match[2]), Number(match[3].replace('-', '')), Number(match[4].replace('-', ''))) + 1);
              } else {
                str = getDateFromNum(getDayNum(Number(match[2]), Number(match[3].replace('-', '')), Number(match[4].replace('-', ''))));
              }
            }
            pArr[5] = str + '$';
            str = str + 'T' + ('0' + hrs).slice(-2) + ':' + ('0' + mins).slice(-2);
            let match2 = str.match(/^(\d{4})(-\d{2})?(-\d{2})(?:(T\d{2}:\d{2})(:\d{2})?)?/);
            if (match2 && match2.length >= 1) {
              pArr[0] = match2[1] + '$';
              pArr[1] = match2[1] + match2[2] + '$';
              pArr[2] = match2[1] + match2[2] + match2[3] + '$';
              pArr[3] = match2[1] + match2[2] + match2[3] + 'T' + ('0' + hrs).slice(-2) + ':' + ('0' + mins).slice(-2) + 'Z?$';
            }
            if (match[6]) { //to check if seconds were included or not
              pArr[4] = str + ':' + ('0' + match[6]).slice(-2) + 'Z?$';
              str = str + match[6];
            }
            if (!pArr[4]) {
              pArr[4] = '^$';
            }
          }
        } else {
          for (let i = 2; i < 5; i++) { //add up the date parts in a string
            if (match[i]) {
              str = str + match[i];
              pArr[i - 2] = str + '$';
            }
          }
          //below we have to check if the search gave more information than what is actually stored
          // return {$regex: new RegExp('^' + '(?:' + str + ')|(?:' + pArr[0] + ')|(?:' + pArr[1] + ')|(?:' + pArr[2] + ')', 'i')};
        }
        let regPoss = {$regex: new RegExp('^' + '(?:' + pArr[0] + ')|(?:' + pArr[1] + ')|(?:' + pArr[2] + ')|(?:' + pArr[3] + ')|(?:' + pArr[4] + ')')};
        if (type === 'period'){ //doesn't work as well for when timing is involved with the upper bound (.end)
          str = str + 'Z';
          let pS = path + '.start';
          let pE = path + '.end';
          toRet = [{$and: [{[pS]: {$lte: str}}, {$or: [{[pE]: {$gte: str}}, {[pE]: regPoss}]}]}, {$and: [{[pS]: {$lte: str}}, {[pE]: undefined}]},
        {$and: [{$or: [{[pE]: {$gte: str}}, {[pE]: regPoss}]}, {[pS]: undefined}]}];
          return toRet;
        }
        let tempFill = pArr.toString().replace(/,/g, ')|(?:') + ')';
        if (type === 'timing') { //doesn't work as well for when timing (T00:00 kinda thing) is involved with the upper bound
          let pDT = path + '.event';
          let pBPS = path + '.repeat.boundsPeriod.start';
          let pBPE = path + '.repeat.boundsPeriod.end';
          toRet = [{[pDT]: {$regex: new RegExp('^' + '(?:' + str + ')|(?:' + match[0].replace('+', '\\+') + ')|(?:' + tempFill, 'i')}},
        {$and: [{[pBPS]: {$lte: str}}, {$or: [{[pBPE]: {$gte: str}}, {[pBPE]: regPoss}]}]}, {$and: [{[pBPS]: {$lte: str}}, {[pBPE]: undefined}]},
      {$and: [{$or: [{[pBPE]: {$gte: str}}, {[pBPE]: regPoss}]}, {[pBPS]: undefined}]}];
      return toRet;
        }
        return {$regex: new RegExp('^' + '(?:' + str + ')|(?:' + match[0].replace('+', '\\+') + ')|(?:' + tempFill, 'i')};
      }
    }

  }
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
            composite.push({$or: [{$and: [tokenQueryBuilder(target1, 'code', path1, '')]},
          {$and: [tokenQueryBuilder(target1, 'value', path1, '')]}]});
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
        case 'date':
            composite.push({$or: [{[path1]: dateQueryBuilder(target1, 'date', '')},
            {[path1]: dateQueryBuilder(target1, 'dateTime', '')}, {[path1]: dateQueryBuilder(target1, 'instant', '')},
            {$or: dateQueryBuilder(target1, 'period', path1)}, {$or: dateQueryBuilder(target1, 'timing', path1)}]});
            break;
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
            composite.push({$or: [{$and: [tokenQueryBuilder(target2, 'code', path2, '')]},
            {$and: [tokenQueryBuilder(target2, 'value', path2, '')]}]});
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
        case 'date':
            composite.push({$or: [{[path2]: dateQueryBuilder(target2, 'date', '')},
            {[path2]: dateQueryBuilder(target2, 'dateTime', '')}, {[path2]: dateQueryBuilder(target2, 'instant', '')},
            {$or: dateQueryBuilder(target2, 'period', path2)}, {$or: dateQueryBuilder(target2, 'timing', path2)}]});
            break;
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
    compositeQueryBuilder,
    dateQueryBuilder
};
