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
    // Common search params
    let id = args['id'] || args['_id'];

    if (args['source'] && !args['_source']) {
        args['_source'] = args['source'];
    }
    let query = {};

    /**
     * list of columns
     * @type {Set}
     */
    let columns = new Set();
    /**
     * and segments
     * @type {Object[]}
     */
    let and_segments = [];

    if (id) {
        if (Array.isArray(id)) {
            query.id = {
                $in: id
            };
        } else if (id.includes(',')) { // see if this is a comma separated list
            const id_list = id.split(',');
            query.id = {
                $in: id_list
            };
        } else {
            query.id = id;
        }
        columns.add('id');
    }
    if (args['id:above']) {
        query.id = {
            $gt: args['id:above']
        };
        columns.add('id');
    }

    if (args['id:below']) {
        query.id = {
            $lt: args['id:below']
        };
        columns.add('id');
    }

    // add FHIR queries
    for (const [resourceType, resourceObj] of Object.entries(searchParameterQueries)) {
        if (resourceType === resourceName || resourceType === 'Resource') {
            for (const [queryParameter, propertyObj] of Object.entries(resourceObj)) {
                if (args[`${queryParameter}`]) {
                    switch (propertyObj.type) {
                        case fhirFilterTypes.string:
                            if (Array.isArray(args[`${queryParameter}`])) {
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
                            } else {
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
                            if (Array.isArray(args[`${queryParameter}`])) {
                                for (const dateQueryItem of args[`${queryParameter}`]) {
                                    and_segments.push({[`${propertyObj.field}`]: dateQueryBuilder(dateQueryItem, propertyObj.type, '')});
                                }
                            } else {
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
                            } else {
                                and_segments.push(
                                    {
                                        $or: [
                                            tokenQueryBuilder(args[`${queryParameter}`], 'code', `${propertyObj.field}`, ''),
                                            tokenQueryBuilder(args[`${queryParameter}`], 'code', `${propertyObj.field}.coding`, ''),
                                        ]
                                    }
                                );
                                // HACK ALERT: token can be for either CodeableConcept or Coding.  Currently, we can't figure out in advance
                                //  Ideally we would set the former when we have a Coding and the latter when we have a CodeableConcept
                                //  but this would require us parsing the FHIR resource schemas to know that
                                if (propertyObj.field === 'meta.security' || propertyObj.field === 'meta.tag') {
                                    columns.add(`${propertyObj.field}.system`);
                                    columns.add(`${propertyObj.field}.code`);
                                } else {
                                    columns.add(`${propertyObj.field}.coding.system`);
                                    columns.add(`${propertyObj.field}.coding.code`);
                                }
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
                            } else {
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
                } else if (args[`${queryParameter}:missing`]) {
                    const exists_flag = !isTrue(args[`${queryParameter}:missing`]);
                    and_segments.push({
                        [`${propertyObj.field}`]: {$exists: exists_flag}
                    });
                    columns.add(`${propertyObj.field}`);
                }
            }
        }
    }


    if (and_segments.length !== 0) {
        query.$and = and_segments;
    }

    return {
        query: query,
        columns: columns
    };
}
;
