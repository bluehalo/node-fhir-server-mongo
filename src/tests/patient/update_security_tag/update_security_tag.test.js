const supertest = require('supertest');

const {app} = require('../../../app');
// provider file
const patientWithoutSecurityTagResource = require('./fixtures/patient/patient_without_security_tag.json');
const patientWithSecurityTagResource = require('./fixtures/patient/patient_with_security_tag.json');

// expected
const expectedSinglePatientResource = require('./fixtures/expected/expected_single_patient.json');

const async = require('async');

const request = supertest(app);
const {commonBeforeEach, commonAfterEach, getHeaders} = require('../../common');
const env = require('var');

describe('PractitionerUpdateSecurityTagTests', () => {
    beforeEach(async () => {
        await commonBeforeEach();
    });

    afterEach(async () => {
        await commonAfterEach();
    });

    describe('Patient UpdateSecurityTag Tests', () => {
        test('UpdateSecurityTag works', (done) => {
            const oldValue = env['CHECK_ACCESS_TAG_ON_SAVE'];
            env['CHECK_ACCESS_TAG_ON_SAVE'] = 0;
            async.waterfall([
                    (cb) => // first confirm there are no practitioners
                        request
                            .get('/4_0_0/Patient')
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
                            .post('/4_0_0/Patient/1679033641/$merge?validate=true')
                            .send(patientWithoutSecurityTagResource)
                            .set(getHeaders())
                            .expect(200, (err, resp) => {
                                console.log('------- response patient1Resource ------------');
                                console.log(JSON.stringify(resp.body, null, 2));
                                console.log('------- end response  ------------');
                                expect(resp.body['created']).toBe(true);
                                return cb(err, resp);
                            }),
                    (results, cb) =>
                        request
                            .post('/4_0_0/Patient/00100000000/$merge?validate=true')
                            .send(patientWithSecurityTagResource)
                            .set(getHeaders())
                            .expect(200, (err, resp) => {
                                console.log('------- response patient1Resource ------------');
                                console.log(JSON.stringify(resp.body, null, 2));
                                console.log('------- end response  ------------');
                                expect(resp.body['created']).toBe(false);
                                expect(resp.body['updated']).toBe(true);
                                return cb(err, resp);
                            }),
                    (results, cb) => request
                        .get('/4_0_0/Patient/00100000000')
                        .set(getHeaders())
                        .expect(200, cb)
                        .expect((resp) => {
                            console.log('------- response Patient sorted ------------');
                            console.log(JSON.stringify(resp.body, null, 2));
                            console.log('------- end response sort ------------');
                            // clear out the lastUpdated column since that changes
                            let body = resp.body;
                            delete body['meta']['lastUpdated'];

                            let expected = expectedSinglePatientResource[0];
                            delete expected['meta']['lastUpdated'];
                            delete expected['$schema'];

                            expect(body).toStrictEqual(expected);
                        }, cb),
                ],
                (err) => {
                    env['CHECK_ACCESS_TAG_ON_SAVE'] = oldValue;
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
