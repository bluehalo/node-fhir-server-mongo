const supertest = require('supertest');

const {app} = require('../../../app');
// test file
const practitioner1Resource = require('./fixtures/Practitioner/practitioner1.json');

// expected
const expectedPractitionerResources = require('./fixtures/expected/expected_Practitioner.json');

const request = supertest(app);
const {commonBeforeEach, commonAfterEach, getHeaders} = require('../../common');
const {assertCompareBundles, assertMergeIsSuccessful} = require('../../fhirAsserts');

describe('Practitioner Tests', () => {
    beforeEach(async () => {
        await commonBeforeEach();
    });

    afterEach(async () => {
        await commonAfterEach();
    });

    describe('Practitioner search_by_identifier.test.js Tests', () => {
        test('search_by_identifier.test.js works', async () => {
            // ARRANGE
            // add the resources to FHIR server
            let resp = await request
                .post('/4_0_0/Practitioner/1/$merge?validate=true')
                .send(practitioner1Resource)
                .set(getHeaders())
                .expect(200);
            assertMergeIsSuccessful(resp.body);

            // ACT & ASSERT
            // search by token system and code and make sure we get the right Practitioner back
            resp = await request
                .get('/4_0_0/Practitioner/?_bundle=1&identifier=http://medstarhealth.org|4657')
                .set(getHeaders())
                .expect(200);
            assertCompareBundles(resp.body, expectedPractitionerResources);
        });
    });
});
