const supertest = require('supertest');

const {app} = require('../../../app');
// provider file
const observation1Resource = require('./fixtures/observation/observation1.json');
const observation2Resource = require('./fixtures/observation/observation2.json');

// expected
const expectedObservationResources = require('./fixtures/expected/expected_observation.json');

const request = supertest(app);
const {commonBeforeEach, commonAfterEach, getHeaders} = require('../../common');
const {assertCompareBundles, assertMergeIsSuccessful} = require('../../fhirAsserts');

describe('ObservationReturnIdTests', () => {
    beforeEach(async () => {
        await commonBeforeEach();
    });

    afterEach(async () => {
        await commonAfterEach();
    });

    describe('Observation Search By token Tests', () => {
        test('search by single token works', async () => {
            // ARRANGE
            // add the resources to FHIR server
            let resp = await request
                .post('/4_0_0/Observation/1/$merge?validate=true')
                .send(observation1Resource)
                .set(getHeaders())
                .expect(200);
            assertMergeIsSuccessful(resp.body);

            resp = await request
                .post('/4_0_0/Observation/1/$merge?validate=true')
                .send(observation2Resource)
                .set(getHeaders())
                .expect(200);
            assertMergeIsSuccessful(resp.body);

            // ACT & ASSERT
            // search by token system and code and make sure we get the right observation back
            resp = await request
                .get('/4_0_0/Observation/?code=http://www.icanbwell.com/cql/library|BMI001&_setIndexHint=1&_debug=1&_bundle=1')
                .set(getHeaders())
                .expect(200);
            assertCompareBundles(resp.body, expectedObservationResources);

            // search by just token code and make sure we get the right observation back
            resp = await request
                .get('/4_0_0/Observation/?code=BMI001&_setIndexHint=1&_debug=1&_bundle=1')
                .set(getHeaders())
                .expect(200);
            assertCompareBundles(resp.body, expectedObservationResources);

            // search by just token system and make sure we get the right observation back
            resp = await request
                .get('/4_0_0/Observation/?code=http://www.icanbwell.com/cql/libraryVersion|&_setIndexHint=1&_debug=1&_bundle=1')
                .set(getHeaders())
                .expect(200);
            assertCompareBundles(resp.body, expectedObservationResources);
        });
    });
});
