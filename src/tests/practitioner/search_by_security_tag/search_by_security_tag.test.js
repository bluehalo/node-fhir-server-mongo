/* eslint-disable no-unused-vars */
const supertest = require('supertest');

const {app} = require('../../../app');
// provider file
const practitionerResource = require('./fixtures/practitioner/practitioner.json');
const practitionerResource2 = require('./fixtures/practitioner/practitioner2.json');
const practitionerResource3 = require('./fixtures/practitioner/practitioner3.json');

// expected
const expectedPractitionerResource = require('./fixtures/expected/expected_practitioner.json');

const async = require('async');

const request = supertest(app);
const {commonBeforeEach, commonAfterEach, getHeaders} = require('../../common');

describe('search_by_security_tag', () => {
    beforeEach(async () => {
        await commonBeforeEach();
    });

    afterEach(async () => {
        await commonAfterEach();
    });


    describe('Practitioner Search By Security Tests', () => {
        test('search by security tag works', async () => {
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
                            .post('/4_0_0/Practitioner/1679033641/$merge?validate=true')
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
                            .post('/4_0_0/Practitioner/0/$merge')
                            .send(practitionerResource3)
                                .set(getHeaders())
                            .expect(200, (err, resp) => {
                                console.log('------- response practitionerResource3 ------------');
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
                        .get('/4_0_0/Practitioner?_security=https://www.icanbwell.com/access|medstar')
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
