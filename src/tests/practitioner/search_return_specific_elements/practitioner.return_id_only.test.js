/* eslint-disable no-unused-vars */
const supertest = require('supertest');

const {app} = require('../../../app');
// provider file
const practitionerResource = require('./fixtures/practitioner/practitioner.json');

// expected
const expectedPractitionerResource = require('./fixtures/expected/expected_practitioner.json');
const expectedPractitionerResourceBundle = require('./fixtures/expected/expected_practitioner_bundle.json');
const expectedPractitionerNoUserScopesBundle = require('./fixtures/expected/expected_practitioner_no_user_scopes.json');

const request = supertest(app);
const {commonBeforeEach, commonAfterEach, getHeaders} = require('../../common');

describe('PractitionerReturnIdTests', () => {
    beforeEach(async () => {
        await commonBeforeEach();
    });

    afterEach(async () => {
        await commonAfterEach();
    });

    describe('PractitionerReturnId Tests', () => {
        test('Id works properly', async () => {
            let resp = await request
                .get('/4_0_0/Practitioner')
                .set(getHeaders())
                .expect(200);
            expect(resp.body.length).toBe(0);
            console.log('------- response 1 ------------');
            console.log(JSON.stringify(resp.body, null, 2));
            console.log('------- end response 1 ------------');

            resp = await request
                .post('/4_0_0/Practitioner/1679033641/$merge')
                .send(practitionerResource)
                .set(getHeaders())
                .expect(200);

            console.log('------- response practitionerResource ------------');
            console.log(JSON.stringify(resp.body, null, 2));
            console.log('------- end response  ------------');
            expect(resp.body['created']).toBe(true);

            resp = await request
                .get('/4_0_0/Practitioner?_elements=id')
                .set(getHeaders())
                .expect(200);

            console.log('------- response Practitioner ------------');
            console.log(JSON.stringify(resp.body, null, 2));
            console.log('------- end response  ------------');
            // clear out the lastUpdated column since that changes
            let body = resp.body;
            expect(body.length).toBe(1);
            // delete body[0]['meta']['lastUpdated'];
            let expected = expectedPractitionerResource;
            // // delete expected[0]['meta']['lastUpdated'];
            // delete expected[0]['$schema'];
            // expected[0]['meta'] = { 'versionId': '2' };
            expect(body).toStrictEqual(expected);
        });
        test('Id works properly with bundle', async () => {
            let resp = await request
                .get('/4_0_0/Practitioner?_bundle=true')
                .set(getHeaders())
                .expect(200);

            console.log('------- response 1 ------------');
            console.log(JSON.stringify(resp.body, null, 2));
            console.log('------- end response 1 ------------');
            expect(resp.body['entry']).toStrictEqual([]);

            resp = await request
                .post('/4_0_0/Practitioner/1679033641/$merge')
                .send(practitionerResource)
                .set(getHeaders())
                .expect(200);

            console.log('------- response practitionerResource ------------');
            console.log(JSON.stringify(resp.body, null, 2));
            console.log('------- end response  ------------');
            expect(resp.body['created']).toBe(true);

            resp = await request
                .get('/4_0_0/Practitioner?_elements=id&_bundle=true&_total=accurate')
                .set(getHeaders())
                .expect(200);

            console.log('------- response Practitioner ------------');
            console.log(JSON.stringify(resp.body, null, 2));
            console.log('------- end response  ------------');
            // clear out the lastUpdated column since that changes
            let body = resp.body;
            expect(body['entry'].length).toBe(1);
            delete body['timestamp'];
            expect(body).toStrictEqual(expectedPractitionerResourceBundle);
        });
        test('Id works properly with bundle and specific scopes', async () => {
            let resp = await request
                .get('/4_0_0/Practitioner?_bundle=true')
                .set(getHeaders())
                .expect(200);

            console.log('------- response 1 ------------');
            console.log(JSON.stringify(resp.body, null, 2));
            console.log('------- end response 1 ------------');
            expect(resp.body['entry']).toStrictEqual([]);

            resp = await request
                .post('/4_0_0/Practitioner/1679033641/$merge')
                .send(practitionerResource)
                .set(getHeaders())
                .expect(200);

            console.log('------- response practitionerResource ------------');
            console.log(JSON.stringify(resp.body, null, 2));
            console.log('------- end response  ------------');
            expect(resp.body['created']).toBe(true);

            resp = await request
                .get('/4_0_0/Practitioner?_elements=id&_bundle=true&_total=accurate')
                .set(getHeaders('user/Practitioner.read access/medstar.*'))
                .expect(200);

            console.log('------- response Practitioner ------------');
            console.log(JSON.stringify(resp.body, null, 2));
            console.log('------- end response  ------------');
            // clear out the lastUpdated column since that changes
            let body = resp.body;
            expect(body['entry'].length).toBe(1);
            delete body['timestamp'];
            expect(body).toStrictEqual(expectedPractitionerResourceBundle);
        });
        test('Id fails without user scopes', async () => {
            let resp = await request
                .get('/4_0_0/Practitioner?_bundle=true')
                .set(getHeaders())
                .expect(200);

            console.log('------- response 1 ------------');
            console.log(JSON.stringify(resp.body, null, 2));
            console.log('------- end response 1 ------------');
            expect(resp.body['entry']).toStrictEqual([]);

            resp = await request
                .post('/4_0_0/Practitioner/1679033641/$merge')
                .send(practitionerResource)
                .set(getHeaders())
                .expect(200);

            console.log('------- response practitionerResource ------------');
            console.log(JSON.stringify(resp.body, null, 2));
            console.log('------- end response  ------------');
            expect(resp.body['created']).toBe(true);

            resp = await request
                .get('/4_0_0/Practitioner?_elements=id&_bundle=true&_total=accurate')
                .set(getHeaders('user/Patient.read access/medstar.*'));

            console.log('------- response Practitioner ------------');
            console.log(JSON.stringify(resp.body, null, 2));
            console.log('------- end response  ------------');
            // clear out the lastUpdated column since that changes
            let body = resp.body;
            expect(body).toStrictEqual(expectedPractitionerNoUserScopesBundle);
        });
        test('Id fails without access scopes', async () => {
            let resp = await request
                .get('/4_0_0/Practitioner?_bundle=true')
                .set(getHeaders())
                .expect(200);

            console.log('------- response 1 ------------');
            console.log(JSON.stringify(resp.body, null, 2));
            console.log('------- end response 1 ------------');
            expect(resp.body['entry']).toStrictEqual([]);

            resp = await request
                .post('/4_0_0/Practitioner/1679033641/$merge')
                .send(practitionerResource)
                .set(getHeaders())
                .expect(200);

            console.log('------- response practitionerResource ------------');
            console.log(JSON.stringify(resp.body, null, 2));
            console.log('------- end response  ------------');
            expect(resp.body['created']).toBe(true);

            resp = await request
                .get('/4_0_0/Practitioner?_elements=id&_bundle=true&_total=accurate')
                .set(getHeaders('user/Practitioner.read access/fake.*'))
                .expect(200);

            console.log('------- response Practitioner ------------');
            console.log(JSON.stringify(resp.body, null, 2));
            console.log('------- end response  ------------');
            // clear out the lastUpdated column since that changes
            let body = resp.body;
            expect(body.entry.length).toStrictEqual(0);
        });
    });
});
