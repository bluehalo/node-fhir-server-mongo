/* eslint-disable no-unused-vars */
const supertest = require('supertest');

const {app} = require('../../../app');

const validPractitionerResource = require('./fixtures/valid_practitioner.json');
const validPractitionerNoSecurityCodeResource = require('./fixtures/valid_practitioner_no_security_code.json');
const invalidPractitionerResource = require('./fixtures/invalid_practitioner.json');

const expectedValidPractitionerResponse = require('./expected/valid_practitioner_response.json');
const expectedValidPractitionerNoSecurityCodeResponse = require('./expected/valid_practitioner_no_security_code_response.json');
const expectedInvalidPractitionerResponse = require('./expected/invalid_practitioner_response.json');

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
        test('Valid resource', async () => {
            // noinspection UnnecessaryLocalVariableJS
            await async.waterfall([
                    (cb) => // first confirm there are no practitioners
                        request
                            .get('/4_0_0/Practitioner')
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
                            .post('/4_0_0/Practitioner/$validate')
                            .send(validPractitionerResource)
                            .set(getHeaders())
                            .expect(200, (err, resp) => {
                                let body = resp.body;
                                console.log('------- response 1 ------------');
                                console.log(JSON.stringify(body, null, 2));
                                console.log('------- end response 1 ------------');
                                expect(body).toStrictEqual(expectedValidPractitionerResponse);
                                return cb(err, resp);
                            }),
                ]);
        });
        test('Valid resource but no security code', async () => {
            // noinspection UnnecessaryLocalVariableJS
            await async.waterfall([
                    (cb) => // first confirm there are no practitioners
                        request
                            .get('/4_0_0/Practitioner')
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
                            .post('/4_0_0/Practitioner/$validate')
                            .send(validPractitionerNoSecurityCodeResource)
                            .set(getHeaders())
                            .expect(200, (err, resp) => {
                                let body = resp.body;
                                console.log('------- response 1 ------------');
                                console.log(JSON.stringify(body, null, 2));
                                console.log('------- end response 1 ------------');
                                expect(body).toStrictEqual(expectedValidPractitionerNoSecurityCodeResponse);
                                return cb(err, resp);
                            }),
                ]);
        });
        test('Invalid resource', async () => {
            // noinspection UnnecessaryLocalVariableJS
            await async.waterfall([
                    (cb) => // first confirm there are no practitioners
                        request
                            .get('/4_0_0/Practitioner')
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
                            .post('/4_0_0/Practitioner/$validate')
                            .send(invalidPractitionerResource)
                            .set(getHeaders())
                            .expect(200, (err, resp) => {
                                let body = resp.body;
                                console.log('------- response 2 ------------');
                                console.log(JSON.stringify(body, null, 2));
                                console.log('------- end response 2 ------------');
                                expect(body).toStrictEqual(expectedInvalidPractitionerResponse);
                                return cb(err, resp);
                            }),
                ]);
        });
    });
});
