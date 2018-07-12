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

//deals with quantity data type
//input is [prefix][number]|[system]|[code] where prefix is optional.
//returns an array of objects [{path: value}, etc]
let quantityQueryBuilder = function (target, field) {
  let qB = [];
  let r1 = /^(\w{2})(-?\d+(\.\d+)?)$/; //with prefix
  let r2 = /^(-?\d+(\.\d+)?)$/; //without prefix

  //split by the two pipes
  let [num, system, code] = target.split('|');
  if (system) {
    let t2 = {};
    t2[`${field}.system`] = system;
    qB.push(t2);
  }
  if (code) {
    let t2 = {};
    t2[`${field}.code`] = code;
    qB.push(t2);
  }

  let m1 = num.match(r1);
  let m2 = num.match(r2);
  if (m1) { //with prefixes
    console.log('prefixes not implemented yet');
  }
  if (m2) { //no prefixes
    let t2 = {};
    t2[`${field}.value`] = Number(m2[0]);
    qB.push(t2);
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
//use like this: query['whatever'] = dateQueryBuilder(whatever, 'dateTime')
let dateQueryBuilder = function (date, type) {
  let regex = /^(\D{2})?(\d{4})(-\d{2})?(-\d{2})?(?:(T\d{2}:\d{2})(:\d{2})?)?(Z|(\+|-)(\d{2}):(\d{2}))?$/;
  let match = date.match(regex);
  //let tArr = [];
  let str = '';
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
          }
        }
        return {$regex: new RegExp('^' + str, 'i')};
      }
    }

    if (type === 'dateTime' || type === 'instant' || type === 'period' || type === 'timing') { //now we have to worry about hours, minutes, seconds, and TIMEZONES
      if (prefix === '$eq') {
        if (match[5]) { //to see if time is included
          for (let i = 2; i < 6; i++) {
            str = str + match[i];
          }
          if (match[6]) { //to check if seconds were included or not
            str = str + match[6];
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
            str = str + 'T' + ('0' + hrs).slice(-2) + ':' + ('0' + mins).slice(-2);
            if (match[6]) { //to check if seconds were included or not
              str = str + match[6];
            }
          }
        } else {
          for (let i = 2; i < 5; i++) { //if no time was passed in, treat like a date
            if (match[i]) {
              str = str + match[i];
            }
          }
        }
        return {$regex: new RegExp('^' + str, 'i')};
      }
    }

  }
};

/**
 * @todo build out more functions for each search type
 */
module.exports = {
    stringQueryBuilder,
    tokenQueryBuilder,
    referenceQueryBuilder,
    addressQueryBuilder,
    nameQueryBuilder,
    numberQueryBuilder,
    quantityQueryBuilder,
    dateQueryBuilder
};
