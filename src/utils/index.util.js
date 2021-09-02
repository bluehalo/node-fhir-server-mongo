// This file implements code to index the mongo database and to list the current indexes
const asyncHandler = require('../lib/async-handler');
const mongoClient = require('../lib/mongo');
const {mongoConfig} = require('../config');
const async = require('async');
const env = require('var');

const {logMessageToSlack} = require('./slack.logger');

const customIndexes = {
    'PractitionerRole_4_0_0': [
        'practitioner.reference',
        'organization.reference',
        'location.reference'
    ]
};

/**
 * creates an index if it does not exist
 * @param {import('mongodb').Db} db
 * @param {string} property_to_index
 * @param {string} collection_name
 * @return {Promise<boolean>}
 */
async function create_index_if_not_exists(db, property_to_index, collection_name) {
    const index_name = (property_to_index + '_1').slice(0, env.MAX_INDEX_NAME_LENGTH ? parseInt(env.MAX_INDEX_NAME_LENGTH) - 1 : 124); // max index name length is 125 in mongo
    try {
        // https://www.tutorialspoint.com/mongodb/mongodb_indexing_limitations.htm#:~:text=A%20collection%20cannot%20have%20more,have%20maximum%2031%20fields%20indexed.
        if (!await db.collection(collection_name).indexExists(index_name)) {
            console.log('Creating index ' + index_name + ' in ' + collection_name);
            await logMessageToSlack('Creating index ' + index_name + ' in ' + collection_name);
            const my_dict = {};
            my_dict[String(property_to_index)] = 1;
            await db.collection(collection_name).createIndex(my_dict, {name: index_name});
            return true;
        }
    } catch (e) {
        console.log('Error creating index: ' + index_name + ' for collection ' + collection_name + ': ' + JSON.stringify(e));
        await logMessageToSlack('Error creating index: ' + index_name + ' for collection ' + collection_name + ': ' + JSON.stringify(e));
    }
    return false;
}

/**
 * creates an multi key index if it does not exist
 * @param {import('mongodb').Db} db
 * @param {string[]} properties_to_index
 * @param {string} collection_name
 * @return {Promise<boolean>}
 */
async function create_multikey_index_if_not_exists(db, properties_to_index, collection_name) {
    const index_name = (properties_to_index.join('_1_') + '_1').slice(0, env.MAX_INDEX_NAME_LENGTH ? parseInt(env.MAX_INDEX_NAME_LENGTH) - 1 : 124); // max index name length is 125 in mongo
    try {
        if (!await db.collection(collection_name).indexExists(index_name)) {
            console.log('Creating multi key index ' + index_name + ' in ' + collection_name);
            await logMessageToSlack('Creating multi key index ' + index_name + ' in ' + collection_name);
            const my_dict = {};
            for (const property_to_index of properties_to_index) {
                my_dict[String(property_to_index)] = 1;
            }
            await db.collection(collection_name).createIndex(my_dict, {name: index_name});
            return true;
        }
    } catch (e) {
        console.log('Error creating index: ' + index_name + ' for collection ' + collection_name + ': ' + JSON.stringify(e));
        await logMessageToSlack('Error creating index: ' + index_name + ' for collection ' + collection_name + ': ' + JSON.stringify(e));
    }
    return false;
}

/**
 * creates indexes on a collection
 * @param {string} collection_name
 * @param {import('mongodb').Db} db
 * @return {Promise<{indexes: *, createdIndex: boolean, name, count: *}>}
 */
async function indexCollection(collection_name, db) {
    console.log('Processing collection', collection_name);
    // check if index exists
    let createdIndex = await create_index_if_not_exists(db, 'id', collection_name);
    createdIndex = await create_index_if_not_exists(db, 'meta.lastUpdated', collection_name) || createdIndex;
    createdIndex = await create_index_if_not_exists(db, 'meta.source', collection_name) || createdIndex;
    createdIndex = await create_multikey_index_if_not_exists(db, ['meta.security.system', 'meta.security.code'], collection_name) || createdIndex;
    const indexes = await db.collection(collection_name).indexes();
    return {
        name: collection_name,
        createdIndex: createdIndex,
        indexes: indexes
    };
}

/**
 * Indexes all the collections
 * @return {Promise<*>}
 */
// noinspection UnnecessaryLocalVariableJS
async function indexAllCollections() {
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
    const db = client.db(mongoConfig.db_name);
    const collection_names = [];
    // const collections = await db.listCollections().toArray();

    await db.listCollections().forEach(collection => {
        if (collection.name.indexOf('system.') === -1) {
            collection_names.push(collection.name);
        }
    });

    // now add custom indices
    for (const collection of Object.keys(customIndexes)) {
        if (collection_names.includes(collection)) {
            console.log('Creating Custom Indexes: ', collection);
            // eslint-disable-next-line security/detect-object-injection
            for (const index of customIndexes[collection]) {
                await create_index_if_not_exists(db, index, collection);
                // console.log(index);
            }
        }
    }

    // now add indices on id column for every collection
    const collection_stats = await async.map(
        collection_names,
        async collection_name => await indexCollection(collection_name, db)
    );

    await client.close();
    return collection_stats;
}

/**
 * Gets the current indexes on the specified collection
 * @param {string} collection_name
 * @param {import('mongodb').Db} db
 * @return {Promise<{indexes: *, name}>}
 */
async function getIndexesInCollection(collection_name, db) {
    // check if index exists
    const indexes = await db.collection(collection_name).indexes();
    return {
        name: collection_name,
        indexes: indexes
    };
}

/**
 * Gets indexes on all the collections
 * @return {Promise<*>}
 */
async function getIndexesInAllCollections() {
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
     * @type {import('mongodb').Db}
     */
    const db = client.db(mongoConfig.db_name);
    const collection_names = [];
    // const collections = await db.listCollections().toArray();

    await db.listCollections().forEach(collection => {
        if (collection.name.indexOf('system.') === -1) {
            collection_names.push(collection.name);
        }
    });

    // now add indices on id column for every collection
    const collection_stats = await async.map(
        collection_names,
        async collection_name => await getIndexesInCollection(collection_name, db)
    );

    await client.close();
    return collection_stats;
}

module.exports = {
    indexAllCollections,
    getIndexesInAllCollections
};
