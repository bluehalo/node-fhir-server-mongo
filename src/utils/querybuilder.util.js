const moment = require('moment-timezone');
const xRegExp = require('xregexp');

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

/**
 * @name addressQueryBuilder
 * @description brute force method of matching addresses. Splits the input and checks to see if every piece matches to
 * at least 1 part of the address field using regexs. Ignores case
 * @param {string} target
 * @return {array} ors
 */
let addressQueryBuilder = function (target) {
    // Tokenize the input as mush as possible
    let totalSplit = target.split(/[\s,]+/);
    let ors = [];
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
 * Parses out the attributes of the supplied date and builds a mongo query based on what was supplied.
 * Currently assumes that all supplied dates are in UTC.
 * Dates in the mongo db must be stored as strings in ISO Date format.
 *
 * @param date - Can be a moment object or an ISO Date string (yyyy-mm-ddThh:mm:ss[Z|(+|-)hh:mm]).
 *               A partial date string can be provided to search a less specific time period so long as at least the
 *               year is provided.
 *
 *               If a moment object is supplied, the query will be for finding an exact match.
 *
 *               If a date string is provided, the specificity of the query will be determined by the level of
 *               granularity provided in the string. For example, just providing 1980 will query for all documents with
 *               datetime values in the year 1980, while providing 1980-12-20 will query for all documents with date
 *               times on the day 1980-12-20.
 *
 *               In addition, date strings can be prefixed with the following modifiers for different behavior:
 *               eq - Equal. Default behavior, same having as no prefix.
 *               ne - Not Equal. Queries for all documents not equal to the datetime specified. Opposite behavior as eq.
 *               gt - Greater Than. Queries for all documents greater than the datetime specified.
 *               lt - Less Than. Queries for all documents less than the datetime specified
 *               gte - Greater Than or Equal To. Queries for all documents greater than or equal to the datetime specified
 *               lte - Less Than or Equal To. Queries for all documents less than or equal to the datetime specified
 *               sa - Starts After. Same behavior as gt.
 *               eb - Ends Before. Same behavior as lt.
 *               ap - Approximately. Queries for all documents in a range centered on the supplied date, with an upper
 *                    and lower bound of the supplied date +/- 0.1 * the difference from the current datetime to the
 *                    supplied datetime.
 *
 * @param currentDateTimeOverride - This argument is exclusively for testing the function in relation to the
 *									'ap' (approximately) query prefix.
 *
 * @returns {*} - query to be run against the mongo db.
 *
 * TODO - Check that upstream sanitization guarantees a valid ISO date string as well as a valid query prefix.
 * TODO - Also need to make sure the timezone information is UTC.
 */
let dateQueryBuilder = function (target, currentDateTimeOverride) {
    // If the date is a moment object, turn it into an ISO Date String and return it as the query
    if (moment.isMoment(target)) {
		return target.toISOString();
    }

    // Use a regular expression to parse out the attributes of the incoming query.
    const dateRegex = xRegExp(`
        (?<prefix>  [A-Za-z]{2} )?     # prefix
        (?<year>    [0-9]{4} )    -?   # year (required)
        (?<month>   [0-9]{2} )?   -?   # month
        (?<day>     [0-9]{2} )?   T?   # day
        (?<hour>    [0-9]{2} )?   :?   # hour
        (?<minute>  [0-9]{2} )?   :?   # minute
        (?<second>  [0-9]{2} )?        # second
        (?<timezone>   .*)?            # timezone
        `, 'x');
    let parsedDatetime = xRegExp.exec(target, dateRegex);

    // Map of the date attributes and their properties in order of decreasing granularity
    // Default values are provided here and used if values aren't provided in the query
    // Interval Scale is used to determine the range of 'equals' queries based on the
    // level of datetime granularity provided in the query.
    const dateAttributes = new Map([
        ['second', {value: '00', intervalScale: 'minute'}],
        ['minute', {value: '00', intervalScale: 'hour'}],
        ['hour', {value: '00', intervalScale: 'day'}],
        ['day', {value: '01', intervalScale: 'month'}],
        ['month', {value: '01', intervalScale: 'year'}],
        ['year', {value: null, intervalScale: null}]
    ]);

    // Iterate through each of date attributes in order of decreasing granularity
    // For each date attribute...
    let suppliedDateAttributes = [];
    let intervalScale = null;
    for (let [attribute, properties] of dateAttributes.entries()){
        // If we were able to parse the attribute out of the supplied date...
        if (parsedDatetime[attribute]) {
            // Overwrite the attribute's default value
            properties.value = parsedDatetime[attribute];
            // Push it into the supplied attributes array to record that this attribute was supplied
            suppliedDateAttributes.push(properties.value);
        } else {
            // Else, overwrite the current intervalScale with this attribute's interval scale. Because the loop
            // is in order of decreasing granularity, the final interval scale will be the least granular one.
            intervalScale = properties.intervalScale;
        }
    }
    // Reverse the order of the supplied date attributes so that they're in the order a date is normally written.
    suppliedDateAttributes.reverse();

    // Create a moment object of the target date (the date supplied as input) using the date attribute values
    let targetDate = moment.tz(
        [dateAttributes.get('year').value, dateAttributes.get('month').value, dateAttributes.get('day').value].join('-')
        + 'T'
        + [dateAttributes.get('hour').value, dateAttributes.get('minute').value, dateAttributes.get('second').value].join(':'),
		'UTC' // assuming UTC.
    );

    // An object mapping the possible query prefixes to the modifiers used to build an appropriate mongo query
    const queryModifiers = {
        'eq': '',			// equal
        undefined: '',		// equal (implied)
        null: '',			// equal (implied)
        'ne': 'ne',			// not equal
        'gt': '$gt',		// greater than
        'ge': '$gte',		// greater than or equal to
        'lt': '$lt',		// less than
        'le': '$lte',		// less than or equal to
        'sa': '$gt',		// starts after (equivalent to 'greater than' for dates)
        'eb': '$lt',		// ends before (equivalent to 'less than' for dates)
        'ap': 'ap'			// approximately
    };

    // Retrieve the appropriate query modifier for the supplied prefix
    let queryModifier = queryModifiers[parsedDatetime.prefix];

    // Construct mongo queries based on the query modifier
    let dateQuery;
    if (queryModifier === '') {
        // Construct a query for 'equal' if the 'eq' prefix was provided or if no prefix was provided
        // If we have an interval scale, query the appropriate range
        if (intervalScale) {
            let endDate = moment(targetDate).endOf(intervalScale);
            dateQuery = {$gte: targetDate.toISOString(), $lte: endDate.toISOString()};
        } else {
            // Else, we have an exact datetime, so query it directly
            dateQuery = targetDate.toISOString();
        }

    } else if (queryModifier === 'ne') {
        // Construct a query for 'not equal' if the 'ne' prefix was provided

        // Construct a regex that matches ISO date strings that don't match the pattern to whatever level of
        // granularity is appropriate based on the supplied date. For example, ne2000-01 will match all dates
        // that aren't in January of 2000.
        let mongoRegex = '^((?!';
        for (let i in suppliedDateAttributes) {
            mongoRegex += suppliedDateAttributes[i] + '[-:T]?';
        }
        mongoRegex += ').)*$';
        dateQuery = {$regex: mongoRegex};

    } else if (['$gt', '$gte', '$lt', '$lte'].includes(queryModifier)) {
        // Construct a query for the relevant comparison operator (>, >=, <, <=)

		// If the modifier is for 'greater than' and we have an interval scale, change the target date to be the end
		// of the relevant interval scale.
        if (queryModifier === '$gt' && intervalScale) {
            targetDate.endOf(intervalScale);
        }

        dateQuery = {[queryModifier]: targetDate.toISOString()};

    } else if (queryModifier === 'ap') {
        // Construct a query for 'approximately' if the 'ap' prefix was provided. This will query a date range
        // +/- rangePadding * the difference between the target datetime and the current datetime
        const rangePadding = 0.1;
        // If an override was provided, create a moment using that. Else, get a moment of the current date and time.
        let currentDateTime = (currentDateTimeOverride ? moment(currentDateTimeOverride) : moment());
        let difference = moment.duration(currentDateTime.diff(targetDate)).asSeconds() * rangePadding;
        let lowerBound = moment(targetDate).subtract(difference, 'seconds');
        let upperBound = moment(targetDate).add(difference, 'seconds');
        dateQuery = {$gte: lowerBound.toISOString(), $lte: upperBound.toISOString()};
    }
    return dateQuery;
};


/**
 * @name compositeQueryBuilder
 * @description from looking at where composites are used, the fields seem to be implicit
 * @param target What we're querying for
 * @param field1 contains the path and search type
 * @param field2 contains the path and search type
 */
let compositeQueryBuilder = function(target, field1, field2) {
    let composite = [];
    let temp = {};
    let [ target1, target2 ] = target.split(/[$,]/);
    let [ path1, type1 ] = field1.split('|');
    let [ path2, type2 ] = field2.split('|');

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
