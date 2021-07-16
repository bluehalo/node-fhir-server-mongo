/* eslint-disable no-unused-vars */
const supertest = require('supertest');

const {app} = require('../../../app');
const explanationOfBenefitBundleResource1 = require('./fixtures/explanation_of_benefits1.json');
const explanationOfBenefitBundleResource2 = require('./fixtures/explanation_of_benefits2.json');
const explanationOfBenefitBundleResource3 = require('./fixtures/explanation_of_benefits3.json');
const expectedExplanationOfBenefitBundleResource = require('./fixtures/expected_explanation_of_benefits.json');
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

    describe('Claim Merge with overlapping items', () => {
        test('Claims with same claim number in different bundles and similar items merge properly', async (done) => {
            // noinspection JSUnusedLocalSymbols
            await async.waterfall([
                    (cb) => // first confirm there are no records
                        request
                            .get('/4_0_0/ExplanationOfBenefit')
                            .set(getHeaders())
                            .expect(200, (err, resp) => {
                                expect(resp.body.length).toBe(0);
                                console.log('------- response 1 ------------');
                                console.log(JSON.stringify(resp.body, null, 2));
                                console.log('------- end response 1 ------------');
                                return cb(err, resp);
                            }),
                    (results, cb) =>
                        request
                            .post('/4_0_0/ExplanationOfBenefit/1/$merge')
                            .send(explanationOfBenefitBundleResource1)
                            .set(getHeaders())
                            .expect(200, (err, resp) => {
                                console.log('------- response 2 ------------');
                                console.log(JSON.stringify(resp.body, null, 2));
                                console.log('------- end response 2  ------------');
                                return cb(err, resp);
                            }),
                    (results, cb) =>
                        request
                            .post('/4_0_0/ExplanationOfBenefit/1/$merge')
                            .send(explanationOfBenefitBundleResource2)
                            .set(getHeaders())
                            .expect(200, (err, resp) => {
                                console.log('------- response 3 ------------');
                                console.log(JSON.stringify(resp.body, null, 2));
                                console.log('------- end response 3  ------------');
                                return cb(err, resp);
                            }),
                    (results, cb) =>
                        request
                            .post('/4_0_0/ExplanationOfBenefit/1/$merge')
                            .send(explanationOfBenefitBundleResource3)
                            .set(getHeaders())
                            .expect(200, (err, resp) => {
                                console.log('------- response 4 ------------');
                                console.log(JSON.stringify(resp.body, null, 2));
                                console.log('------- end response 4  ------------');
                                return cb(err, resp);
                            }),

                    (results, cb) => request
                        .get('/4_0_0/ExplanationOfBenefit')
                        .set(getHeaders())
                        .expect(200, cb)
                        .expect((resp) => {
                            // clear out the lastUpdated column since that changes
                            let body = resp.body;
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
                        }, cb),
                ],
                (err, results) => {
                    if (!err) {
                        console.log('done');
                    }

                    if (err) {
                        console.error(err);
                        done.fail(err);
                    }
                    done();
                });
        });
    });
});
