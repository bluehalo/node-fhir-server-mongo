const {
    dateQueryBuilder,
    referenceQueryBuilder,
    // nameQueryBuilder,
    // stringQueryBuilder,
    // addressQueryBuilder,
    tokenQueryBuilder,
    dateQueryBuilderNative
} = require('../../utils/querybuilder.util');
const {isTrue} = require('../../utils/isTrue');

const {fhirFilterTypes} = require('./customQueries');
const {searchParameterQueries} = require('../../searchParameters/searchParameters');

// /**
//  * @type {import('winston').logger}
//  */
// const logger = require('@asymmetrik/node-fhir-server-core').loggers.get();

/**
 * converts graphql parameters to standard FHIR parameters
 * @param queryParameterValue
 * @param args
 * @param queryParameter
 * @return {*[]|string}
 */
function convertGraphQLParameters(queryParameterValue, args, queryParameter) {
    if (queryParameterValue) {
        // un-bundle any objects coming from graphql
        if (typeof queryParameterValue === 'object' && !Array.isArray(queryParameterValue) && queryParameterValue['searchType']) {
            switch (queryParameterValue['searchType']) {
                case 'string':
                    // handle SearchString
                    if (queryParameterValue['value']) {
                        queryParameterValue = queryParameterValue['value'];
                    } else if (queryParameterValue['values']) {
                        queryParameterValue = queryParameterValue['values'];
                    }
                    break;
                case 'token':
                    if (queryParameterValue['value']) {
                        queryParameterValue['values'] = [queryParameterValue['value']];
                    }
                    if (queryParameterValue['values']) {
                        for (const token of queryParameterValue['values']) {
                            queryParameterValue = [];
                            let tokenString = '';
                            if (token['system']) {
                                tokenString = token['system'] + '|';
                            }
                            if (token['code']) {
                                tokenString += token['code'];
                            }
                            if (token['value']) {
                                tokenString += token['value'];
                            }
                            if (tokenString) {
                                queryParameterValue.push(tokenString);
                            }
                        }
                    }
                    break;
                case 'reference':
                    // eslint-disable-next-line no-case-declarations
                    let referenceText = '';
                    if (queryParameterValue['target']) {
                        referenceText = queryParameterValue['target'] + '/';
                    }
                    if (queryParameterValue['value']) {
                        referenceText += queryParameterValue['value'];
                    }
                    queryParameterValue = referenceText;
                    break;
                case 'quantity':
                    // eslint-disable-next-line no-case-declarations
                    let quantityString = '';
                    if (queryParameterValue['prefix']) {
                        quantityString += queryParameterValue['prefix'];
                    }
                    if (queryParameterValue['value']) {
                        quantityString += queryParameterValue['value'];
                    }
                    if (queryParameterValue['system']) {
                        quantityString = '|' + queryParameterValue['system'];
                    }
                    if (queryParameterValue['code']) {
                        quantityString = '|' + queryParameterValue['code'];
                    }
                    queryParameterValue = quantityString;
                    break;
                case 'date':
                case 'dateTime':
                case 'number':
                    if (queryParameterValue['value']) {
                        queryParameterValue['values'] = [queryParameterValue['value']];
                    }
                    if (queryParameterValue['values']) {
                        for (const dateValue of queryParameterValue['values']) {
                            queryParameterValue = [];
                            let dateString = '';
                            if (dateValue['equals']) {
                                dateString = 'eq' + dateValue['equals'];
                            }
                            if (dateValue['notEquals']) {
                                dateString = 'ne' + dateValue['notEquals'];
                            }
                            if (dateValue['greaterThan']) {
                                dateString = 'gt' + dateValue['greaterThan'];
                            }
                            if (dateValue['greaterThanOrEqualTo']) {
                                dateString = 'ge' + dateValue['greaterThanOrEqualTo'];
                            }
                            if (dateValue['lessThan']) {
                                dateString = 'lt' + dateValue['lessThan'];
                            }
                            if (dateValue['lessThanOrEqualTo']) {
                                dateString = 'le' + dateValue['lessThanOrEqualTo'];
                            }
                            if (dateValue['startsAfter']) {
                                dateString = 'sa' + dateValue['startsAfter'];
                            }
                            if (dateValue['endsBefore']) {
                                dateString = 'eb' + dateValue['endsBefore'];
                            }
                            if (dateValue['approximately']) {
                                dateString = 'ap' + dateValue['approximately'];
                            }
                            if (dateString) {
                                queryParameterValue.push(dateString);
                            }
                        }
                    }
                    break;
            }
            if (queryParameterValue['missing'] !== null) {
                args[`${queryParameter}:missing`] = queryParameterValue['missing'];
            }
        }
    }
    return queryParameterValue;
}

/**
 * Builds a mongo query for search parameters
 * @param {string} resourceName
 * @param {Object} args
 * @returns {{query:import('mongodb').Document, columns: Set}} A query object to use with Mongo
 */
module.exports.buildR4SearchQuery = (resourceName, args) => {
    // some of these parameters we used wrong in the past but have to map them to maintain backwards compatibility
    // ---- start of backward compatibility mappings ---
    if (args['source'] && !args['_source']) {
        args['_source'] = args['source'];
    }
    if (args['id'] && !args['_id']) {
        args['_id'] = args['id'];
    }
    if (args['id:above'] && !args['_id:above']) {
        args['_id:above'] = args['id:above'];
    }
    if (args['id:below'] && !args['_id:below']) {
        args['_id:below'] = args['id:below'];
    }
    // ---- end of backward compatibility mappings ---

    /**
     * list of columns used in the query
     * this is used to pick index hints
     * @type {Set}
     */
    let columns = new Set();
    /**
     * and segments
     * these are combined to create the query
     * @type {Object[]}
     */
    let and_segments = [];

    // add FHIR queries
    for (const [resourceType, resourceObj] of Object.entries(searchParameterQueries)) {
        if (resourceType === resourceName || resourceType === 'Resource') {
            for (const [queryParameter, propertyObj] of Object.entries(resourceObj)) {
                let queryParameterValue = args[`${queryParameter}`];
                queryParameterValue = convertGraphQLParameters(queryParameterValue, args, queryParameter);
                // if just a query parameter is passed then check it
                if (queryParameterValue) {
                    // handle id differently since it is a token, but we want to do exact match
                    if (queryParameter === '_id') {
                        if (Array.isArray(queryParameterValue)) { // if array is passed then check in array
                            and_segments.push({
                                [`${propertyObj.field}`]: {
                                    $in: queryParameterValue
                                }
                            });
                        } else if (queryParameterValue.includes(',')) { // see if this is a comma separated list
                            const value_list = queryParameterValue.split(',');
                            and_segments.push({
                                [`${propertyObj.field}`]: {
                                    $in: value_list
                                }
                            });
                        } else { // single value is passed
                            and_segments.push({
                                [`${propertyObj.field}`]: queryParameterValue
                            });
                        }
                        columns.add(`${propertyObj.field}`);
                        continue; // skip processing rest of this loop
                    }
                    switch (propertyObj.type) {
                        case fhirFilterTypes.string:
                            if (Array.isArray(queryParameterValue)) { // if array is passed then check in array
                                and_segments.push({
                                    [`${propertyObj.field}`]: {
                                        $in: queryParameterValue
                                    }
                                });
                            } else if (queryParameterValue.includes(',')) { // see if this is a comma separated list
                                const value_list = queryParameterValue.split(',');
                                and_segments.push({
                                    [`${propertyObj.field}`]: {
                                        $in: value_list
                                    }
                                });
                            } else { // single value is passed
                                and_segments.push({
                                    [`${propertyObj.field}`]: queryParameterValue
                                });
                            }
                            columns.add(`${propertyObj.field}`);
                            break;
                        case fhirFilterTypes.uri:
                            and_segments.push({[`${propertyObj.field}`]: queryParameterValue});
                            columns.add(`${propertyObj.field}`);
                            break;
                        case fhirFilterTypes.dateTime:
                        case fhirFilterTypes.date:
                        case fhirFilterTypes.period:
                        case fhirFilterTypes.instant:
                            if (!Array.isArray(queryParameterValue)) {
                                queryParameterValue = [queryParameterValue];
                            }
                            for (const dateQueryItem of queryParameterValue) {
                                if (propertyObj.fields) {
                                    and_segments.push({
                                        $or: propertyObj.fields.map(f => {
                                            return {
                                                [`${f}`]: dateQueryBuilder(
                                                    dateQueryItem, propertyObj.type, '')
                                            };
                                        })
                                    });
                                } else if (propertyObj.field === 'meta.lastUpdated') {
                                    // this field stores the date as a native date so we can do faster queries
                                    and_segments.push({
                                        [`${propertyObj.field}`]: dateQueryBuilderNative(
                                            dateQueryItem, propertyObj.type, '')
                                    });
                                } else {
                                    and_segments.push({
                                        [`${propertyObj.field}`]: dateQueryBuilder(
                                            dateQueryItem, propertyObj.type, '')
                                    });
                                }
                            }
                            columns.add(`${propertyObj.field}`);
                            break;
                        case fhirFilterTypes.token:
                            if (!Array.isArray(queryParameterValue)) {
                                queryParameterValue = [queryParameterValue];
                            }
                            for (const tokenQueryItem of queryParameterValue) {
                                if (propertyObj.fieldFilter === '[system/@value=\'email\']') {
                                    and_segments.push(tokenQueryBuilder(tokenQueryItem, 'value', `${propertyObj.field}`, 'email'));
                                    columns.add(`${propertyObj.field}.system`);
                                    columns.add(`${propertyObj.field}.value`);
                                } else if (propertyObj.fieldFilter === '[system/@value=\'phone\']') {
                                    and_segments.push(tokenQueryBuilder(tokenQueryItem, 'value', `${propertyObj.field}`, 'phone'));
                                    columns.add(`${propertyObj.field}.system`);
                                    columns.add(`${propertyObj.field}.value`);
                                } else if (propertyObj.field === 'identifier') { // http://www.hl7.org/fhir/search.html#token
                                    and_segments.push(tokenQueryBuilder(tokenQueryItem, 'value', `${propertyObj.field}`, ''));
                                    columns.add(`${propertyObj.field}.system`);
                                    columns.add(`${propertyObj.field}.value`);
                                } else if (propertyObj.field === 'meta.security' || propertyObj.field === 'meta.tag') { // http://www.hl7.org/fhir/search.html#token
                                    and_segments.push(tokenQueryBuilder(tokenQueryItem, 'code', `${propertyObj.field}`, ''));
                                    columns.add(`${propertyObj.field}.system`);
                                    columns.add(`${propertyObj.field}.code`);
                                } else {
                                    and_segments.push(
                                        {
                                            $or: [
                                                tokenQueryBuilder(
                                                    tokenQueryItem,
                                                    'code',
                                                    `${propertyObj.field}`,
                                                    ''
                                                ),
                                                tokenQueryBuilder(
                                                    tokenQueryItem,
                                                    'code',
                                                    `${propertyObj.field}.coding`,
                                                    ''
                                                ),
                                            ]
                                        }
                                    );
                                    columns.add(`${propertyObj.field}.coding.system`);
                                    columns.add(`${propertyObj.field}.coding.code`);
                                }
                            }
                            break;
                        case fhirFilterTypes.reference:
                            if (propertyObj.target.length === 1) { // handle simple case without an OR to keep it simple
                                const target = propertyObj.target[0];
                                if (propertyObj.fields && Array.isArray(propertyObj.fields)) {
                                    and_segments.push({
                                        $or: propertyObj.fields.map(field =>
                                            referenceQueryBuilder(
                                                queryParameterValue.includes('/')
                                                    ? queryParameterValue : (`${target}/` + queryParameterValue),
                                                `${field}.reference`, null))
                                    });
                                } else {
                                    and_segments.push(
                                        referenceQueryBuilder(
                                            queryParameterValue.includes('/')
                                                ? queryParameterValue : (`${target}/` + queryParameterValue),
                                            `${propertyObj.field}.reference`, null)
                                    );
                                }
                            } else { // handle multiple targets
                                // if resourceType is specified then search for only those resources
                                if (queryParameterValue.includes('/')) {
                                    and_segments.push(
                                        referenceQueryBuilder(
                                            queryParameterValue,
                                            `${propertyObj.field}.reference`, null)
                                    );
                                } else { // else search for these ids in all the target resources
                                    and_segments.push({
                                        $or: propertyObj.target.map(
                                            target => referenceQueryBuilder(
                                                queryParameterValue.includes('/')
                                                    ? queryParameterValue : (`${target}/` + queryParameterValue),
                                                `${propertyObj.field}.reference`, null)
                                        )
                                    });
                                }
                            }
                            columns.add(`${propertyObj.field}.reference`);
                            break;
                        default:
                            throw new Error('Unknown type=' + propertyObj.type);
                    }
                } else if (args[`${queryParameter}:missing`]) { // handle check for missing values
                    const exists_flag = !isTrue(args[`${queryParameter}:missing`]);
                    and_segments.push({
                        [`${propertyObj.field}`]: {$exists: exists_flag}
                    });
                    columns.add(`${propertyObj.field}`);
                } else if (args[`${queryParameter}:above`]) { // handle check for above the passed in  value
                    and_segments.push({
                        [`${propertyObj.field}`]: {$gt: args[`${queryParameter}:above`]}
                    });
                    columns.add(`${propertyObj.field}`);
                } else if (args[`${queryParameter}:below`]) { // handle check for below the passed in value
                    and_segments.push({
                        [`${propertyObj.field}`]: {$lt: args[`${queryParameter}:below`]}
                    });
                    columns.add(`${propertyObj.field}`);
                }
            }
        }
    }

    /**
     * query to run on mongo
     * @type {{}}
     */
    let query = {};

    if (and_segments.length !== 0) {
        // noinspection JSUndefinedPropertyAssignment
        query.$and = and_segments;
    }

    return {
        query: query,
        columns: columns
    };
};
