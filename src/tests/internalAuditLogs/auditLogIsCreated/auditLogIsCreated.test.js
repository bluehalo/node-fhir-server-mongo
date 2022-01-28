const supertest = require('supertest');

const {app} = require('../../../app');
// provider file
const practitionerResource = require('./fixtures/practitioner/practitioner.json');
const practitionerResource2 = require('./fixtures/practitioner/practitioner2.json');

// expected
const expectedSinglePractitionerResource = require('./fixtures/expected/expected_single_practitioner.json');
const expectedAuditEvents1 = require('./fixtures/expected/expected_audit_events_1.json');
const expectedAuditEvents2 = require('./fixtures/expected/expected_audit_events_2.json');
const expectedAuditEvents3 = require('./fixtures/expected/expected_audit_events_3.json');

const request = supertest(app);
const {commonBeforeEach, commonAfterEach, getHeaders} = require('../../common');
const globals = require('../../../globals');
const {CLIENT_DB} = require('../../../constants');
const env = require('var');

describe('InternalAuditLog Tests', () => {
    beforeEach(async () => {
        await commonBeforeEach();
    });

    afterEach(async () => {
        await commonAfterEach();
    });

    describe('InternalAuditLog Tests', () => {
        test('InternalAuditLog works', async () => {
            // first confirm there are no practitioners
            let resp = await request
                .get('/4_0_0/Practitioner')
                .set(getHeaders())
                .expect(200);
            expect(resp.body.length).toBe(0);
            console.log('------- response 1 ------------');
            console.log(JSON.stringify(resp.body, null, 2));
            console.log('------- end response 1 ------------');

            // check that InternalAuditLog is created
            /**
             * mongo db connection
             * @type {import('mongodb').Db}
             */
            let db = globals.get(CLIENT_DB);
            const base_version = '4_0_0';
            const collection_name = env.INTERNAL_AUDIT_TABLE || 'AuditEvent';
            /**
             * @type {string}
             */
            const mongoCollectionName = `${collection_name}_${base_version}`;
            /**
             * mongo collection
             * @type {import('mongodb').Collection}
             */
            let internalAuditEventCollection = db.collection(mongoCollectionName);
            // no audit logs should be created since there were no resources returned
            expect(await internalAuditEventCollection.find({}).count()).toStrictEqual(0);

            // now add a record
            resp = await request
                .post('/4_0_0/Practitioner/1679033641/$merge?validate=true')
                .send(practitionerResource)
                .set(getHeaders())
                .expect(200);
            console.log('------- response practitionerResource ------------');
            console.log(JSON.stringify(resp.body, null, 2));
            console.log('------- end response  ------------');
            expect(resp.body['created']).toBe(true);
            let logs = await internalAuditEventCollection.find({}).toArray();
            expect(logs.length).toStrictEqual(1);
            logs.forEach(log => {
                delete log['meta']['lastUpdated'];
                delete log['_id'];
                delete log['id'];
                delete log['recorded'];
            });
            expectedAuditEvents1.forEach(log => {
                delete log['meta']['lastUpdated'];
                delete log['_id'];
                delete log['id'];
                delete log['recorded'];
            });
            expect(logs).toStrictEqual(expectedAuditEvents1);

            // now add another record
            resp = await request
                .post('/4_0_0/Practitioner/0/$merge')
                .send(practitionerResource2)
                .set(getHeaders())
                .expect(200);
            console.log('------- response practitionerResource ------------');
            console.log(JSON.stringify(resp.body, null, 2));
            console.log('------- end response  ------------');
            expect(resp.body['created']).toBe(true);
            logs = await internalAuditEventCollection.find({}).toArray();
            expect(logs.length).toStrictEqual(2);
            logs.forEach(log => {
                delete log['meta']['lastUpdated'];
                delete log['_id'];
                delete log['id'];
                delete log['recorded'];
            });
            expectedAuditEvents2.forEach(log => {
                delete log['meta']['lastUpdated'];
                delete log['_id'];
                delete log['id'];
                delete log['recorded'];
            });
            expect(logs).toStrictEqual(expectedAuditEvents2);

            // try to merge the same item again. No audit event shuld be created
            resp = await request
                .post('/4_0_0/Practitioner/0/$merge')
                .send(practitionerResource2)
                .set(getHeaders())
                .expect(200);
            console.log('------- response practitionerResource ------------');
            console.log(JSON.stringify(resp.body, null, 2));
            console.log('------- end response  ------------');
            expect(resp.body['created']).toBe(false);
            expect(resp.body['updated']).toBe(false);
            logs = await internalAuditEventCollection.find({}).toArray();
            expect(logs.length).toStrictEqual(2);
            logs.forEach(log => {
                delete log['meta']['lastUpdated'];
                delete log['_id'];
                delete log['id'];
                delete log['recorded'];
            });
            expectedAuditEvents2.forEach(log => {
                delete log['meta']['lastUpdated'];
                delete log['_id'];
                delete log['id'];
                delete log['recorded'];
            });
            expect(logs).toStrictEqual(expectedAuditEvents2);

            // now check that we get the right record back
            resp = await request
                .get('/4_0_0/Practitioner/0')
                .set(getHeaders())
                .expect(200);
            console.log('------- response Practitioner sorted ------------');
            console.log(JSON.stringify(resp.body, null, 2));
            console.log('------- end response sort ------------');
            // clear out the lastUpdated column since that changes
            let body = resp.body;
            delete body['meta']['lastUpdated'];
            // one audit log should be created
            logs = await internalAuditEventCollection.find({}).toArray();
            expect(logs.length).toStrictEqual(3);
            logs.forEach(log => {
                delete log['meta']['lastUpdated'];
                delete log['_id'];
                delete log['id'];
                delete log['recorded'];
            });
            expectedAuditEvents3.forEach(log => {
                delete log['meta']['lastUpdated'];
                delete log['_id'];
                delete log['id'];
                delete log['recorded'];
            });
            expect(logs).toStrictEqual(expectedAuditEvents3);

            let expected = expectedSinglePractitionerResource[0];
            delete expected['meta']['lastUpdated'];
            delete expected['$schema'];

            expect(body).toStrictEqual(expected);
        });
    });
});
