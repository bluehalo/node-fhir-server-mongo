/* eslint-disable no-unused-vars */
const supertest = require('supertest');

const {app} = require('../../../app');
const questionnaireResponseBundle = require('./fixtures/questionnaire_responses.json');
const expectedQuestionnaireResponseBundle = require('./fixtures/expected_questionnaire_responses.json');
const async = require('async');

const request = supertest(app);
const {commonBeforeEach, commonAfterEach, getHeaders} = require('../../common');

describe('Questionnaire Response Tests', () => {
    beforeEach(async () => {
        await commonBeforeEach();
    });

    afterEach(async () => {
        await commonAfterEach();
    });

    describe('QuestionnaireResponse Bundles', () => {
        test('QuestionnaireResponse can search by patient', async () => {
            // noinspection JSUnusedLocalSymbols
            await async.waterfall([
                    (cb) => // first confirm there are no records
                        request
                            .get('/4_0_0/QuestionnaireResponse')
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
                            .post('/4_0_0/QuestionnaireResponse/1/$merge')
                            .send(questionnaireResponseBundle)
                                .set(getHeaders())
                            .expect(200, (err, resp) => {
                                console.log('------- response 2 ------------');
                                console.log(JSON.stringify(resp.body, null, 2));
                                console.log('------- end response 2  ------------');
                                return cb(err, resp);
                            }),
                    (results, cb) => request
                        .get('/4_0_0/QuestionnaireResponse?patient=029260322')
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
                            let expected = expectedQuestionnaireResponseBundle;
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
                ]);
        });
    });
});
