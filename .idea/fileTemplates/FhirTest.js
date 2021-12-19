#set($ResourceNameLower = $ResourceName.toLowerCase())
#set($dollar = "$")

const supertest = require('supertest');

const {app} = require('../../../app');
// test file
const ${ResourceNameLower}1Resource = require('./fixtures/${ResourceName}/${ResourceNameLower}1.json');

// expected
const expected${ResourceName}Resources = require('./fixtures/expected/expected_${ResourceName}.json');

const request = supertest(app);
const {commonBeforeEach, commonAfterEach, getHeaders} = require('../../common');
const {assertCompareBundles, assertMergeIsSuccessful} = require('../../fhirAsserts');

describe('${ResourceName} Tests', () => {
    beforeEach(async () => {
        await commonBeforeEach();
    });

    afterEach(async () => {
        await commonAfterEach();
    });

    describe('${ResourceName} ${NAME} Tests', () => {
        test('${NAME} works', async () => {
            // ARRANGE
            // add the resources to FHIR server
            let resp = await request
                .post('/4_0_0/${ResourceName}/1/${dollar}merge?validate=true')
                .send(${ResourceNameLower}1Resource)
                .set(getHeaders())
                .expect(200);
            assertMergeIsSuccessful(resp.body);

            // ACT & ASSERT
            // search by token system and code and make sure we get the right ${ResourceName} back
            resp = await request
                .get('/4_0_0/${ResourceName}/?_bundle=1&[write_query_here]')
                .set(getHeaders())
                .expect(200);
            assertCompareBundles(resp.body, expected${ResourceName}Resources);
        });
    });
});
