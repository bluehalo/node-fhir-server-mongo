const supertest = require('supertest');

const {app} = require('../../app');
// provider file
const auditEventResource = require('./fixtures/auditEvents.json');

// expected
const expectedAuditEventResource = require('./fixtures/expectedAuditEvents.json');

const request = supertest(app);
const {commonBeforeEach, commonAfterEach, getHeaders} = require('../common');

describe('AuditEventReturnIdTests', () => {
    beforeEach(async () => {
        await commonBeforeEach();
    });

    afterEach(async () => {
        await commonAfterEach();
    });

    describe('AuditEvent Search By Id Tests', () => {
        test('search by single id works', async () => {
            // first confirm there are no AuditEvent
            let resp = await request
                .get('/4_0_0/AuditEvent')
                .set(getHeaders())
                .expect(200);
            expect(resp.body.length).toBe(0);
            console.log('------- response 1 ------------');
            console.log(JSON.stringify(resp.body, null, 2));
            console.log('------- end response 1 ------------');

            // now add a record
            resp = await request
                .post('/4_0_0/AuditEvent/1/$merge?validate=true')
                .send(auditEventResource)
                .set(getHeaders())
                .expect(200);
            console.log('------- response AuditEvent ------------');
            console.log(JSON.stringify(resp.body, null, 2));
            console.log('------- end response  ------------');

            // now check that we get the right record back
            resp = await request
                .get('/4_0_0/AuditEvent/?_security=https://www.icanbwell.com/access|fake&_lastUpdated=gt2021-06-01&_lastUpdated=lt2031-10-26&_count=10&_getpagesoffset=0&_setIndexHint=1&_debug=1&_bundle=1')
                .set(getHeaders())
                .expect(200);
            console.log('------- response AuditEvent sorted ------------');
            console.log(JSON.stringify(resp.body, null, 2));
            console.log('------- end response sort ------------');
            // clear out the lastUpdated column since that changes
            let body = resp.body;
            expect(body['entry'].length).toBe(2);
            delete body['timestamp'];
            body.entry.forEach(element => {
                delete element['resource']['meta']['lastUpdated'];
            });
            let expected = expectedAuditEventResource;
            expected.entry.forEach(element => {
                delete element['resource']['meta']['lastUpdated'];
                delete element['resource']['$schema'];
            });
            expect(body).toStrictEqual(expected);
        });
    });
});
