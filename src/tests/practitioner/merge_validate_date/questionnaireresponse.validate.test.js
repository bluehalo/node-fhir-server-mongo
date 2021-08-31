/* eslint-disable no-unused-vars */
const supertest = require('supertest');

const {app} = require('../../../app');

const validResource = require('./fixtures/questionnaireresponse.json');

const async = require('async');

const request = supertest(app);
const {commonBeforeEach, commonAfterEach, getHeaders} = require('../../common');

describe('Practitioner Update Tests', () => {
    beforeEach(async () => {
        await commonBeforeEach();
    });

    afterEach(async () => {
        await commonAfterEach();
    });

    describe('Practitioner Validate', () => {
        test('POST Valid resource', async () => {
            // noinspection UnnecessaryLocalVariableJS
            await async.waterfall([
                    (cb) => // first confirm there are no practitioners
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
                            .post('/4_0_0/QuestionnaireResponse')
                            .send(validResource)
                                .set(getHeaders())
                            .expect(201, (err, resp) => {
                                let body = resp.body;
                                console.log('------- response 1 ------------');
                                console.log(JSON.stringify(body, null, 2));
                                console.log('------- end response 1 ------------');
                                return cb(err, resp);
                            }),
                ]);
        });
    });
});
