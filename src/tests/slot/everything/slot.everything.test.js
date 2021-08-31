/* eslint-disable no-unused-vars */
const supertest = require('supertest');

const {app} = require('../../../app');
// practice
const slotResource = require('./fixtures/slot/slot.json');
const slotScheduleResource = require('./fixtures/slot/schedule.json');
const slotPractitionerRoleResource = require('./fixtures/slot/practitionerRole.json');
const slotPractitionerResource = require('./fixtures/slot/practitioner.json');

// expected
const expectedEverythingResource = require('./fixtures/expected/expected_everything.json');

const async = require('async');

const request = supertest(app);
const {commonBeforeEach, commonAfterEach, getHeaders} = require('../../common');

describe('Slot Everything Tests', () => {
    beforeEach(async () => {
        await commonBeforeEach();
    });

    afterEach(async () => {
        await commonAfterEach();
    });

    describe('Everything Tests', () => {
        test('Everything works properly', async () => {
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
                            .post('/4_0_0/Slot/1/$merge')
                            .send(slotResource)
                                .set(getHeaders())
                            .expect(200, (err, resp) => {
                                if (err) {
                                    console.log(err);
                                }
                                console.log('------- response slot ------------');
                                console.log(JSON.stringify(resp.body, null, 2));
                                console.log('------- end response  ------------');
                                expect(resp.body['created']).toBe(true);
                                return cb(err, resp);
                            }),
                    (results, cb) =>
                        request
                            .post('/4_0_0/Schedule/1/$merge')
                            .send(slotScheduleResource)
                                .set(getHeaders())
                            .expect(200, (err, resp) => {
                                if (err) {
                                    console.log(err);
                                }
                                console.log('------- response slotScheduleResource ------------');
                                console.log(JSON.stringify(resp.body, null, 2));
                                console.log('------- end response  ------------');
                                expect(resp.body['created']).toBe(true);
                                return cb(err, resp);
                            }),
                    (results, cb) =>
                        request
                            .post('/4_0_0/PractitionerRole/1/$merge')
                            .send(slotPractitionerRoleResource)
                                .set(getHeaders())
                            .expect(200, (err, resp) => {
                                if (err) {
                                    console.log(err);
                                }
                                console.log('------- response slotPractitionerRoleResource ------------');
                                console.log(JSON.stringify(resp.body, null, 2));
                                console.log('------- end response  ------------');
                                expect(resp.body['created']).toBe(true);
                                return cb(err, resp);
                            }),
                    (results, cb) =>
                        request
                            .post('/4_0_0/Practitioner/$merge')
                            .send(slotPractitionerResource)
                                .set(getHeaders())
                            .expect(200, (err, resp) => {
                                if (err) {
                                    console.log(err);
                                }
                                console.log('------- response slotPractitionerResource ------------');
                                console.log(JSON.stringify(resp.body, null, 2));
                                console.log('------- end response  ------------');
                                expect(resp.body['created']).toBe(true);
                                return cb(err, resp);
                            }),
                    (results, cb) => request
                        .get('/4_0_0/Slot/1275501447-UHG-MMMA-existing/$everything')
                                .set(getHeaders())
                        .expect(200, cb)
                        .expect((resp) => {
                            console.log('------- response Slot 1275501447-UHG-MMMA-existing $everything ------------');
                            console.log(JSON.stringify(resp.body, null, 2));
                            console.log('------- end response  ------------');
                            let body = resp.body;
                            delete body['timestamp'];
                            body.entry.forEach(element => {
                                delete element['fullUrl'];
                                delete element['resource']['meta']['lastUpdated'];
                            });
                            let expected = expectedEverythingResource;
                            delete expected['timestamp'];
                            expected.entry.forEach(element => {
                                delete element['fullUrl'];
                                if ('meta' in element['resource']) {
                                    delete element['resource']['meta']['lastUpdated'];
                                }
                                if ('$schema' in element) {
                                    delete element['$schema'];
                                }
                            });
                            expect(body).toStrictEqual(expected);
                        }, cb)
                ]);
        });
    });
});
