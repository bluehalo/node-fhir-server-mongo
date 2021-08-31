const supertest = require('supertest');

const {app} = require('../../../app');
// provider file
const patient1Resource = require('./fixtures/patient/patient1.json');

// expected
const expectedSinglePatientResource = require('./fixtures/expected/expected_single_patient.json');

const async = require('async');

const request = supertest(app);
const {commonBeforeEach, commonAfterEach, getHeaders} = require('../../common');

describe('PractitionerReturnIdTests', () => {
    beforeEach(async () => {
        await commonBeforeEach();
    });

    afterEach(async () => {
        await commonAfterEach();
    });

    describe('Patient Search By Id Tests', () => {
        test('search by single id works', async () => {
            await async.waterfall([
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
                            .send(patient1Resource)
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
                            .get('/4_0_0/Patient')
                            .set(getHeaders())
                            .expect(200, (err, resp) => {
                                console.log('------- response 3 ------------');
                                console.log(JSON.stringify(resp.body, null, 2));
                                console.log('------- end response 3 ------------');
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
                ]);
        });
    });
});
