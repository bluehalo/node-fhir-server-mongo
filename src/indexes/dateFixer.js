const asyncHandler = require('../lib/async-handler');
const mongoClient = require('../lib/mongo');
const {mongoConfig} = require('../config');
const async = require('async');
const {logMessageToSlack} = require('../utils/slack.logger');
const globals = require('../globals');
const {CLIENT_DB} = require('../constants');
const moment = require('moment-timezone');
// const {Db} = require('mongodb');


/**
 * converts the type of field in collection to Date
 * @param {string} collection_name
 * @param {string} field
 * @param {import('mongodb').Db} db
 * @return {Promise<void>}
 */
const convertFieldToDate = async (collection_name, field, db) => {
    let message = `Fixing ${field} in ${collection_name}`;
    console.log(message);
    await logMessageToSlack(message);

    const collection = db.collection(collection_name);
    const failedIds = [];
    const failedDates = [];
    let convertedIds = 0;
    let operations = [];
    let cursor = await collection.find();
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
            item[`${propertyName}`] = moment(item[`${propertyName}`]).toDate();
            operations.push({updateOne: {filter: {_id: element._id}, update: {$set: element}, upsert: true}});
            convertedIds = convertedIds + 1;
            if (convertedIds % 100 === 0) { // write every 100 items
                await collection.bulkWrite(operations);
                operations = [];
            }
            if (convertedIds % 1000 === 0) { // show progress every 1000 items
                message = `Progress: Converted ${convertedIds} of ${field} in ${collection_name} to Date type`;
                console.log(message);
                await logMessageToSlack(message);
            }
        }
    }
    if (operations.length > 0) { // if any items left to write
        await collection.bulkWrite(operations);
    }

    if (failedIds.length > 0) {
        message = `ERROR converting ${field} in ${collection_name} to Date type for ids: [ ${failedIds.toString()} ] and values: [${failedDates.toString()}]`;
        console.log(message);
        await logMessageToSlack(message);
    } else {
        message = `Finished converting ${field} in ${collection_name} to Date type.  Converted ${convertedIds} resources`;
        console.log(message);
        await logMessageToSlack(message);
    }
};

/**
 * Changes the type of meta.lastUpdated to Date
 * @param {string} collection_name
 * @param {import('mongodb').Db} db
 * @return {Promise<void>}
 */
const fixLastUpdatedDates = async (collection_name, db) => {
    return await convertFieldToDate(collection_name, 'meta.lastUpdated', db);
};

/**
 * Converts lastUpdated date to Date in all collections
 * @return {Promise<void>}
 */
const fixLastUpdatedDatesInAllCollections = async () => {
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

    // now add indices on id column for every collection
    await async.mapSeries(
        collection_names,
        async collection_name => await fixLastUpdatedDates(collection_name, db)
    );

    await client.close();
};

module.exports = {
    fixLastUpdatedDatesInAllCollections: fixLastUpdatedDatesInAllCollections,
    fixLastUpdatedDates: fixLastUpdatedDates
};
