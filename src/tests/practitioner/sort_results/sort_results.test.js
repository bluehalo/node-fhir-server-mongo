/* eslint-disable no-unused-vars */
const supertest = require('supertest');

const {app} = require('../../../app');
// provider file
const practitionerResource = require('./fixtures/practitioner/practitioner.json');
const practitionerResource2 = require('./fixtures/practitioner/practitioner2.json');

// expected
const expectedPractitionerResource = require('./fixtures/expected/expected_practitioner.json');

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

    function sleep(milliseconds) {
        const date = Date.now();
        let currentDate = null;
        do {
            currentDate = Date.now();
        } while (currentDate - date < milliseconds);
    }

    describe('Practitioner Sort Tests', () => {
        test('sort equals', async () => {
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
                            .post('/4_0_0/Practitioner/1679033641/$merge')
                            .send(practitionerResource)
                                .set(getHeaders())
                            .expect(200, (err, resp) => {
                                console.log('------- response practitionerResource ------------');
                                console.log(JSON.stringify(resp.body, null, 2));
                                console.log('------- end response  ------------');
                                expect(resp.body['created']).toBe(true);
                                return cb(err, resp);
                            }),
                    (results, cb) =>
                        request
                            .post('/4_0_0/Practitioner/0/$merge')
                            .send(practitionerResource2)
                                .set(getHeaders())
                            .expect(200, (err, resp) => {
                                console.log('------- response practitionerResource ------------');
                                console.log(JSON.stringify(resp.body, null, 2));
                                console.log('------- end response  ------------');
                                expect(resp.body['created']).toBe(true);
                                return cb(err, resp);
                            }),
                    (results, cb) =>
                        request
                            .get('/4_0_0/Practitioner')
                                .set(getHeaders())
                            .expect(200, (err, resp) => {
                                console.log('------- response 3 ------------');
                                console.log(JSON.stringify(resp.body, null, 2));
                                console.log('------- end response 3 ------------');
                                return cb(err, resp);
                            }),
                    (results, cb) => request
                        .get('/4_0_0/Practitioner?_sort=id')
                                .set(getHeaders())
                        .expect(200, cb)
                        .expect((resp) => {
                            console.log('------- response Practitioner sorted ------------');
                            console.log(JSON.stringify(resp.body, null, 2));
                            console.log('------- end response sort ------------');
                            // clear out the lastUpdated column since that changes
                            let body = resp.body;
                            expect(body.length).toBe(2);
                            body.forEach(element => {
                                delete element['meta']['lastUpdated'];
                            });
                            let expected = expectedPractitionerResource;
                            expected.forEach(element => {
                                delete element['meta']['lastUpdated'];
                                delete element['$schema'];
                            });
                            // expected[0]['meta'] = { 'versionId': '2' };
                            expect(body).toStrictEqual(expected);
                        }, cb),
                ]);
        });
        test('sort equals nested descending', async () => {
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
                            .post('/4_0_0/Practitioner/1679033641/$merge')
                            .send(practitionerResource)
                                .set(getHeaders())
                            .expect(200, (err, resp) => {
                                console.log('------- response practitionerResource ------------');
                                console.log(JSON.stringify(resp.body, null, 2));
                                console.log('------- end response  ------------');
                                expect(resp.body['created']).toBe(true);
                                sleep(3000); // sleep so the lastUpdated data is different for next one
                                return cb(err, resp);
                            }),
                    (results, cb) =>
                        request
                            .post('/4_0_0/Practitioner/0/$merge')
                            .send(practitionerResource2)
                                .set(getHeaders())
                            .expect(200, (err, resp) => {
                                console.log('------- response practitionerResource ------------');
                                console.log(JSON.stringify(resp.body, null, 2));
                                console.log('------- end response  ------------');
                                expect(resp.body['created']).toBe(true);
                                return cb(err, resp);
                            }),
                    (results, cb) =>
                        request
                            .get('/4_0_0/Practitioner')
                                .set(getHeaders())
                            .expect(200, (err, resp) => {
                                console.log('------- response 3 ------------');
                                console.log(JSON.stringify(resp.body, null, 2));
                                console.log('------- end response 3 ------------');
                                return cb(err, resp);
                            }),
                    (results, cb) => request
                        .get('/4_0_0/Practitioner?_sort=-meta.lastUpdated')
                                .set(getHeaders())
                        .expect(200, cb)
                        .expect((resp) => {
                            console.log('------- response Practitioner sorted ------------');
                            console.log(JSON.stringify(resp.body, null, 2));
                            console.log('------- end response sort ------------');
                            // clear out the lastUpdated column since that changes
                            let body = resp.body;
                            expect(body.length).toBe(2);
                            body.forEach(element => {
                                delete element['meta']['lastUpdated'];
                            });
                            let expected = expectedPractitionerResource;
                            expected.forEach(element => {
                                delete element['meta']['lastUpdated'];
                                delete element['$schema'];
                            });
                            // expected[0]['meta'] = { 'versionId': '2' };
                            expect(body).toStrictEqual(expected);
                        }, cb),
                ]);
        });
    });
});
