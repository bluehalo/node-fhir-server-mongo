const supertest = require('supertest');

const {app} = require('../../../app');
// test file
const valueset1Resource = require('./fixtures/ValueSet/valueset1.json');
const valueset2Resource = require('./fixtures/ValueSet/valueset2.json');
const valueset3Resource = require('./fixtures/ValueSet/valueset3.json');
const valueset4Resource = require('./fixtures/ValueSet/valueset4.json');

// expected
const expectedValueSetResources = require('./fixtures/expected/expected_ValueSet.json');

const request = supertest(app);
const {commonBeforeEach, commonAfterEach, getHeaders} = require('../../common');
const {assertMergeIsSuccessful} = require('../../fhirAsserts');

describe('ValueSet Tests', () => {
    beforeEach(async () => {
        await commonBeforeEach();
    });

    afterEach(async () => {
        await commonAfterEach();
    });

    describe('ValueSet expand_valueset.test.js Tests', () => {
        test('expand_valueset.test.js works', async () => {
            // ARRANGE
            // add the resources to FHIR server
            let resp = await request
                .post('/4_0_0/ValueSet/1/$merge?validate=true')
                .send(valueset1Resource)
                .set(getHeaders())
                .expect(200);
            assertMergeIsSuccessful(resp.body);

            resp = await request
                .post('/4_0_0/ValueSet/1/$merge?validate=true')
                .send(valueset2Resource)
                .set(getHeaders())
                .expect(200);
            assertMergeIsSuccessful(resp.body);

            resp = await request
                .post('/4_0_0/ValueSet/1/$merge?validate=true')
                .send(valueset3Resource)
                .set(getHeaders())
                .expect(200);
            assertMergeIsSuccessful(resp.body);

            resp = await request
                .post('/4_0_0/ValueSet/1/$merge?validate=true')
                .send(valueset4Resource)
                .set(getHeaders())
                .expect(200);
            assertMergeIsSuccessful(resp.body);

            // ACT & ASSERT
            // search by token system and code and make sure we get the right ValueSet back
            resp = await request
                .get('/4_0_0/ValueSet/2.16.840.1.113762.1.4.1106.45/$expand?_bundle=1')
                .set(getHeaders())
                .expect(200);

            const body = resp.body;
            delete body['meta']['lastUpdated'];
            delete expectedValueSetResources['meta']['lastUpdated'];
            expect(resp.body).toStrictEqual(expectedValueSetResources);
        });
    });
});
