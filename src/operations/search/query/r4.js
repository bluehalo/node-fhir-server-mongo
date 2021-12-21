const {
    dateQueryBuilder,
    referenceQueryBuilder,
    // nameQueryBuilder,
    // stringQueryBuilder,
    // addressQueryBuilder,
    tokenQueryBuilder
} = require('../../../utils/querybuilder.util');
const {isTrue} = require('../../../utils/isTrue');

const {fhirFilterTypes} = require('./customQueries');
const {searchParameterQueries} = require('../../../searchParameters/searchParameters');

// /**
//  * @type {import('winston').logger}
//  */
// const logger = require('@asymmetrik/node-fhir-server-core').loggers.get();

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
     * these are combined together to create the query
     * @type {Object[]}
     */
    let and_segments = [];

    // add FHIR queries
    for (const [resourceType, resourceObj] of Object.entries(searchParameterQueries)) {
        if (resourceType === resourceName || resourceType === 'Resource') {
            for (const [queryParameter, propertyObj] of Object.entries(resourceObj)) {
                if (args[`${queryParameter}`]) {
                    // handle id differently since it is a token, but we want to do exact match
                    if (queryParameter === '_id') {
                        if (Array.isArray(args[`${queryParameter}`])) { // if array is passed then check in array
                            and_segments.push({
                                [`${propertyObj.field}`]: {
                                    $in: args[`${queryParameter}`]
                                }
                            });
                        } else if (args[`${queryParameter}`].includes(',')) { // see if this is a comma separated list
                            const value_list = args[`${queryParameter}`].split(',');
                            and_segments.push({
                                [`${propertyObj.field}`]: {
                                    $in: value_list
                                }
                            });
                        } else { // single value is passed
                            and_segments.push({
                                [`${propertyObj.field}`]: args[`${queryParameter}`]
                            });
                        }
                        columns.add(`${propertyObj.field}`);
                        continue; // skip processing rest of this loop
                    }
                    switch (propertyObj.type) {
                        case fhirFilterTypes.string:
                            if (Array.isArray(args[`${queryParameter}`])) { // if array is passed then check in array
                                and_segments.push({
                                    [`${propertyObj.field}`]: {
                                        $in: args[`${queryParameter}`]
                                    }
                                });
                            } else if (args[`${queryParameter}`].includes(',')) { // see if this is a comma separated list
                                const value_list = args[`${queryParameter}`].split(',');
                                and_segments.push({
                                    [`${propertyObj.field}`]: {
                                        $in: value_list
                                    }
                                });
                            } else { // single value is passed
                                and_segments.push({
                                    [`${propertyObj.field}`]: args[`${queryParameter}`]
                                });
                            }
                            columns.add(`${propertyObj.field}`);
                            break;
                        case fhirFilterTypes.uri:
                            and_segments.push({[`${propertyObj.field}`]: args[`${queryParameter}`]});
                            columns.add(`${propertyObj.field}`);
                            break;
                        case fhirFilterTypes.dateTime:
                        case fhirFilterTypes.date:
                        case fhirFilterTypes.period:
                        case fhirFilterTypes.instant:
                            if (Array.isArray(args[`${queryParameter}`])) { // if array is passed
                                for (const dateQueryItem of args[`${queryParameter}`]) {
                                    and_segments.push({[`${propertyObj.field}`]: dateQueryBuilder(dateQueryItem, propertyObj.type, '')});
                                }
                            } else { // single value is passed
                                and_segments.push({[`${propertyObj.field}`]: dateQueryBuilder(args[`${queryParameter}`], propertyObj.type, '')});
                            }
                            columns.add(`${propertyObj.field}`);
                            break;
                        case fhirFilterTypes.token:
                            if (propertyObj.fieldFilter === '[system/@value=\'email\']') {
                                and_segments.push(tokenQueryBuilder(args[`${queryParameter}`], 'value', `${propertyObj.field}`, 'email'));
                                columns.add(`${propertyObj.field}.system`);
                                columns.add(`${propertyObj.field}.value`);
                            } else if (propertyObj.fieldFilter === '[system/@value=\'phone\']') {
                                and_segments.push(tokenQueryBuilder(args[`${queryParameter}`], 'value', `${propertyObj.field}`, 'phone'));
                                columns.add(`${propertyObj.field}.system`);
                                columns.add(`${propertyObj.field}.value`);
                            } else if (propertyObj.field === 'identifier') { // http://www.hl7.org/fhir/search.html#token
                                and_segments.push(tokenQueryBuilder(args[`${queryParameter}`], 'value', `${propertyObj.field}`, ''));
                                columns.add(`${propertyObj.field}.system`);
                                columns.add(`${propertyObj.field}.value`);
                            } else if (propertyObj.field === 'meta.security' || propertyObj.field === 'meta.tag') { // http://www.hl7.org/fhir/search.html#token
                                and_segments.push(tokenQueryBuilder(args[`${queryParameter}`], 'code', `${propertyObj.field}`, ''));
                                columns.add(`${propertyObj.field}.system`);
                                columns.add(`${propertyObj.field}.code`);
                            } else {
                                and_segments.push(
                                    {
                                        $or: [
                                            tokenQueryBuilder(args[`${queryParameter}`], 'code', `${propertyObj.field}`, ''),
                                            tokenQueryBuilder(args[`${queryParameter}`], 'code', `${propertyObj.field}.coding`, ''),
                                        ]
                                    }
                                );
                                columns.add(`${propertyObj.field}.coding.system`);
                                columns.add(`${propertyObj.field}.coding.code`);
                            }

                            break;
                        case fhirFilterTypes.reference:
                            if (propertyObj.target.length === 1) { // handle simple case without an OR to keep it simple
                                const target = propertyObj.target[0];
                                and_segments.push(
                                    referenceQueryBuilder(
                                        `${target}/` + args[`${queryParameter}`],
                                        `${propertyObj.field}.reference`,
                                        null
                                    )
                                );
                            } else { // handle multiple targets
                                and_segments.push(
                                    {
                                        $or: propertyObj.target.map(
                                            target => referenceQueryBuilder(
                                                `${target}/` + args[`${queryParameter}`],
                                                `${propertyObj.field}.reference`,
                                                null
                                            )
                                        )
                                    }
                                );
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
        query.$and = and_segments;
    }

    return {
        query: query,
        columns: columns
    };
};
