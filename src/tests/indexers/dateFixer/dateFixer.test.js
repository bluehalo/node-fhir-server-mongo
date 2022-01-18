const input = require('./fixtures/input.json');
const {commonBeforeEach, commonAfterEach} = require('../../common');
const globals = require('../../../globals');
const {CLIENT_DB} = require('../../../constants');
const {getOrCreateCollection} = require('../../../utils/mongoCollectionManager');
const {getSchemaOfMongoDocument} = require('../../../utils/mongoSchemaHelper');
const {fixLastUpdatedDatesInAllCollections} = require('../../../indexes/dateFixer');

describe('dateFixer Tests', () => {
    beforeEach(async () => {
        await commonBeforeEach();
    });

    afterEach(async () => {
        await commonAfterEach();
    });

    describe('dateFixer Tests', () => {
        test('dateFixer works', async () => {
            // Grab an instance of our DB and collection
            let db = globals.get(CLIENT_DB);
            const collection_name = 'Organization';
            const base_version = '4_0_0';
            const collectionName = `${collection_name}_${base_version}`;
            /**
             * @type {import('mongodb').Collection}
             */
            let collection = await getOrCreateCollection(db, collectionName);
            Object.assign(input, {id: input.id});
            await collection.insertOne(input);
            let element = await collection.findOne({});
            let result = getSchemaOfMongoDocument(null, element, 0);
            expect(result['meta.lastUpdated']).toStrictEqual('string');
            await fixLastUpdatedDatesInAllCollections();
            element = await collection.findOne({});
            // make sure other elements are not changed
            expect(element['meta']['versionId']).toStrictEqual('26');
            result = getSchemaOfMongoDocument(null, element, 0);
            // confirm that the type has been changed to Date
            expect(result['meta.lastUpdated']).toStrictEqual('Date');
            // now try to run it again to make sure it remains a Date
            await fixLastUpdatedDatesInAllCollections();
            element = await collection.findOne({});
            result = getSchemaOfMongoDocument(null, element, 0);
            // confirm that the type has been changed to Date
            expect(result['meta.lastUpdated']).toStrictEqual('Date');
        });
    });
});
