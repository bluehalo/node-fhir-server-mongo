/* eslint-disable no-unused-vars */
const supertest = require('supertest');

const {app} = require('../../../app');
const explanationOfBenefitBundleResource = require('./fixtures/explanation_of_benefits/explanation_of_benefits.json');
const expectedExplanationOfBenefitBundleResource = require('./fixtures/expected/expected_explanation_of_benefits.json');
const expectedMergeResponse = require('./fixtures/expected/expected_merge_response.json');
const async = require('async');

const request = supertest(app);
const {commonBeforeEach, commonAfterEach, getHeaders} = require('../../common');

describe('Claim Merge Tests', () => {
    beforeEach(async () => {
        await commonBeforeEach();
    });

    afterEach(async () => {
        await commonAfterEach();
    });

    describe('Claim Merge Bundles', () => {
        test('Claims with one bad record merge properly', async () => {
            let resp = await request
                .get('/4_0_0/ExplanationOfBenefit')
                .set(getHeaders())
                .expect(200);
            expect(resp.body.length).toBe(0);
            console.log('------- response 1 ------------');
            console.log(JSON.stringify(resp.body, null, 2));
            console.log('------- end response 1 ------------');

            resp = await request
                .post('/4_0_0/ExplanationOfBenefit/1/$merge')
                .send(explanationOfBenefitBundleResource)
                .set(getHeaders())
                .expect(200);
            let body = resp.body;
            console.log('------- response 2 ------------');
            console.log(JSON.stringify(resp.body, null, 2));
            console.log('------- end response 2  ------------');
            expect(body).toStrictEqual(expectedMergeResponse);

            resp = await request
                .get('/4_0_0/ExplanationOfBenefit')
                .set(getHeaders())
                .expect(200);
            // clear out the lastUpdated column since that changes
            body = resp.body;
            console.log('------- response 5 ------------');
            console.log(JSON.stringify(resp.body, null, 2));
            console.log('------- end response 5  ------------');
            expect(body.length).toBe(1);
            body.forEach(element => {
                delete element['meta']['lastUpdated'];
            });
            let expected = expectedExplanationOfBenefitBundleResource;
            expected.forEach(element => {
                if ('meta' in element) {
                    delete element['meta']['lastUpdated'];
                }
                // element['meta'] = {'versionId': '1'};
                if ('$schema' in element) {
                    delete element['$schema'];
                }
            });
            expect(body).toStrictEqual(expected);
        });
    });
});
