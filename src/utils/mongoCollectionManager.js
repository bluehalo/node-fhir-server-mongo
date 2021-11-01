const Mutex = require('async-mutex').Mutex;
const mutex = new Mutex();

const {indexCollection} = require('./index.util');
const {isTrue} = require('./isTrue');
const env = require('var');

/**
 * Gets or creates a collection
 * @param {import('mongodb').Db} db
 * @param {string} collection_name
 * @return {Promise<import('mongodb').Collection>}
 */
async function getOrCreateCollection(db, collection_name) {
    if (isTrue(env.CREATE_INDEX_ON_COLLECTION_CREATION)) {
        // use mutex to prevent parallel async calls from trying to create the collection at the same time
        await mutex.runExclusive(async () => {
            const collectionExists = await db.listCollections({name: collection_name}, {nameOnly: true}).hasNext();
            if (!collectionExists) {
                await db.createCollection(collection_name);
                // force creation of collection if not exists (in case some other machine created it in the middle)
                // await db.collection(collection_name).findOne({});
                await indexCollection(collection_name, db);
            }
        });
    }
    return db.collection(collection_name);
}

module.exports = {
    getOrCreateCollection
};
