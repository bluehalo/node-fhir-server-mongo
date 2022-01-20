const asyncHandler = require('../lib/async-handler');
const mongoClient = require('../lib/mongo');
const {mongoConfig} = require('../config');
const async = require('async');
const {logMessageToSlack} = require('../utils/slack.logger');
const globals = require('../globals');
const {CLIENT_DB} = require('../constants');
const moment = require('moment-timezone');
// const {Db} = require('mongodb');
const env = require('var');
const {isTrue} = require('../utils/isTrue');

/**
 * converts the type of field in collection to Date
 * @param {string} collection_name
 * @param {string} field
 * @param {import('mongodb').Db} db
 * @param {int} batchSize
 * @return {Promise<void>}
 */
const convertFieldToDate = async (collection_name, field, db, batchSize) => {
    let message = `Fixing ${field} in ${collection_name}`;
    console.log(message);
    await logMessageToSlack(message);

    const collection = db.collection(collection_name);
    let convertedIds = 0;
    const progressBatchSize = env.FIXDATE_PROGRESS_BATCH_SIZE || 1000;

    let operations = [];
    // get only the needed field from mongo
    const projection = {};
    projection[`${field}`] = 1;
    const options = {};
    options['projection'] = projection;
    const query = {};
    if (!(env.FIXDATE_FILTER_TO_STRINGS) || isTrue(env.FIXDATE_FILTER_TO_STRINGS)) {
        query[`${field}`] = {$type: 'string'}; // only rows that are string
    }
    let cursor = await collection.find(query, options);
    while (await cursor.hasNext()) {
        /**
         * element
         * @type {Object}
         */
        const element = await cursor.next();
        let item = element;
        const paths = field.split('.');
        for (const path of paths.slice(0, -1)) {
            item = item[`${path}`];
        }
        const propertyName = paths[paths.length - 1];
        if (item[`${propertyName}`] && !(item[`${propertyName}`] instanceof Date)) {
            // update only the necessary field in the document
            const setCommand = {};
            setCommand[`${field}`] = moment(item[`${propertyName}`]).toDate();
            // batch up the calls to update
            operations.push({updateOne: {filter: {_id: element._id}, update: {$set: setCommand}}});
            convertedIds = convertedIds + 1;
            if (convertedIds % batchSize === 0) { // write every 100 items
                await collection.bulkWrite(operations);
                operations = [];
            }
            if (convertedIds % progressBatchSize === 0) { // show progress every 1000 items
                message = `Progress: Converted ${convertedIds} of ${field} in ${collection_name} to Date type`;
                console.log(message);
                await logMessageToSlack(message);
            }
        }
    }
    if (operations.length > 0) { // if any items left to write
        await collection.bulkWrite(operations);
    }

    message = `Finished converting ${field} in ${collection_name} to Date type.  Converted ${convertedIds} resources`;
    console.log(message);
    await logMessageToSlack(message);
};

/**
 * Changes the type of meta.lastUpdated to Date
 * @param {string} collection_name
 * @param {import('mongodb').Db} db
 * @param {int} batchSize
 * @return {Promise<void>}
 */
const fixLastUpdatedDates = async (collection_name, db, batchSize) => {
    return await convertFieldToDate(collection_name, 'meta.lastUpdated', db, batchSize);
};

/**
 * Converts lastUpdated date to Date in all collections
 * @param {string[]} collectionNamesToInclude
 * @param {int} batchSize
 * @return {Promise<void>}
 */
const fixLastUpdatedDatesInAllCollections = async (collectionNamesToInclude, batchSize) => {
    // eslint-disable-next-line no-unused-vars
    let [mongoError, client] = await asyncHandler(
        mongoClient(mongoConfig.connection, mongoConfig.options)
    );

    if (mongoError) {
        console.error(mongoError.message);
        console.error(mongoConfig.connection);
        await client.close();
        throw new Error(mongoError.message);
    }
    //create client by providing database name
    /**
     * mongo db connection
     * @type {import('mongodb').Db}
     */
    const db = globals.get(CLIENT_DB) || client.db(mongoConfig.db_name);
    const collection_names = [];

    await db.listCollections().forEach(collection => {
        if (collection.name.indexOf('system.') === -1) {
            collection_names.push(collection.name);
        }
    });

    const collectionNamesToSkip = env.FIXDATE_COLLECTIONS_TO_SKIP ? env.FIXDATE_COLLECTIONS_TO_SKIP.split(',') : [];

    if (collectionNamesToInclude && collectionNamesToInclude.length > 0) {
        await async.mapSeries(
            collection_names.filter(a => collectionNamesToInclude.includes(a)),
            async collection_name => await fixLastUpdatedDates(collection_name, db, batchSize)
        );
    } else {
        await async.mapSeries(
            collection_names.filter(a => !collectionNamesToSkip.includes(a)),
            async collection_name => await fixLastUpdatedDates(collection_name, db, batchSize)
        );
    }

    await client.close();
};

module.exports = {
    fixLastUpdatedDatesInAllCollections: fixLastUpdatedDatesInAllCollections,
    fixLastUpdatedDates: fixLastUpdatedDates
};
