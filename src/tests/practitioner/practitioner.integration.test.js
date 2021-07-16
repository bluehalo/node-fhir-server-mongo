/* eslint-disable no-unused-vars */
const supertest = require('supertest');

const {app} = require('../../app');
const globals = require('../../globals');
const practitionerResource = require('./fixtures/providers/practitioner.json');
const locationResource = require('./fixtures/providers/location.json');
const practitionerRoleResource = require('./fixtures/providers/practitioner_role.json');
const expectedPractitionerResource = require('./fixtures/providers/expected_practitioner.json');
const async = require('async');

const request = supertest(app);
const {commonBeforeEach, commonAfterEach, getHeaders} = require('../common');

describe('Practitioner Integration Tests', () => {
    beforeEach(async () => {
        await commonBeforeEach();
    });

    afterEach(async () => {
        await commonAfterEach();
    });

    describe('Practitioner Integration Tests', () => {
        test('Provider Files Loads', (done) => {
            async.waterfall([
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
                            .put('/4_0_0/Practitioner/4657')
                            .send(practitionerResource)
                            .set(getHeaders())
                            .expect(201, (err, resp) => {
                                console.log('------- response 2 ------------');
                                console.log(JSON.stringify(resp.body, null, 2));
                                console.log('------- end response 2  ------------');
                                return cb(err, resp);
                            }),
                    (results, cb) =>
                        request
                            .post('/4_0_0/PractitionerRole')
                            .send(practitionerRoleResource)
                            .set(getHeaders())
                            .expect(201, (err, resp) => {
                                console.log('------- response 3 ------------');
                                console.log(JSON.stringify(resp.body, null, 2));
                                console.log('------- end response 3  ------------');
                                return cb(err, resp);
                            }),
                    (results, cb) => request
                        .post('/4_0_0/Location')
                        .send(locationResource)
                        .set(getHeaders())
                        .expect(201, (err, resp) => {
                            console.log('------- response 4 ------------');
                            console.log(JSON.stringify(resp.body, null, 2));
                            console.log('------- end response 4  ------------');
                            return cb(err, resp);
                        }),
                    (results, cb) => request
                        .get('/4_0_0/Practitioner')
                        .set(getHeaders())
                        .expect(200, cb)
                        .expect((resp) => {
                            // clear out the lastUpdated column since that changes
                            let body = resp.body;
                            expect(body.length).toBe(1);
                            delete body[0]['meta']['lastUpdated'];
                            let expected = expectedPractitionerResource;
                            delete expected[0]['meta']['lastUpdated'];
                            expect(body).toStrictEqual(expected);
                            console.log('------- response 5 ------------');
                            console.log(JSON.stringify(resp.body, null, 2));
                            console.log('------- end response 5  ------------');
                        }, cb),
                ],
                (err, results) => {
                    console.log('done');
                    if (err) {
                        console.error(err);
                        done.fail(err);
                    }
                    done();
                });
        });
    });
});
