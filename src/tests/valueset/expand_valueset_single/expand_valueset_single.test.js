const supertest = require('supertest');

const {app} = require('../../../app');
// test file
const valueset1Resource = require('./fixtures/ValueSet/valueset1.json');

// expected
const expectedValueSetResources = require('./fixtures/expected/expected_ValueSet.json');
const expectedValueSetExpandResources = require('./fixtures/expected/expected_ValueSet_expand.json');

const request = supertest(app);
const {commonBeforeEach, commonAfterEach, getHeaders, wrapResourceInBundle} = require('../../common');
const {assertCompareBundles, assertMergeIsSuccessful} = require('../../fhirAsserts');

describe('ValueSet Tests', () => {
    beforeEach(async () => {
        await commonBeforeEach();
    });

    afterEach(async () => {
        await commonAfterEach();
    });

    describe('ValueSet expand_valueset_single Tests', () => {
        test('expand_valueset_single works', async () => {
            // ARRANGE
            // add the resources to FHIR server
            let resp = await request
                .post('/4_0_0/ValueSet/1/$merge?validate=true')
                .send(valueset1Resource)
                .set(getHeaders())
                .expect(200);
            assertMergeIsSuccessful(resp.body);

            // ACT & ASSERT
            resp = await request
                .get('/4_0_0/ValueSet/2.16.840.1.113762.1.4.1235.31')
                .set(getHeaders())
                .expect(200);

            console.log('------- response Practitioner sorted ------------');
            console.log(JSON.stringify(resp.body, null, 2));
            console.log('------- end response sort ------------');
            assertCompareBundles(wrapResourceInBundle(resp.body), expectedValueSetResources);

            // ACT & ASSERT
            resp = await request
                .get('/4_0_0/ValueSet/2.16.840.1.113762.1.4.1235.31/$expand')
                .set(getHeaders())
                .expect(200);

            console.log('------- response Practitioner sorted ------------');
            console.log(JSON.stringify(resp.body, null, 2));
            console.log('------- end response sort ------------');
            // clear out the lastUpdated column since that changes
            assertCompareBundles(wrapResourceInBundle(resp.body), expectedValueSetExpandResources);
        });
    });
});
