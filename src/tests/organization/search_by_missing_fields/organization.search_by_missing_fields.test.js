/* eslint-disable no-unused-vars */
const supertest = require('supertest');

const {app} = require('../../../app');
const organizationResponseBundle1 = require('./fixtures/organization1.json');
const organizationResponseBundle2 = require('./fixtures/organization2.json');
const organizationResponseBundle3 = require('./fixtures/organization3.json');
const expectedOrganizationResponseBundle = require('./fixtures/expected_organization_responses.json');
const expectedOrganizationResponseBundle2 = require('./fixtures/expected_organization_responses_2.json');
const async = require('async');

const request = supertest(app);
const {commonBeforeEach, commonAfterEach, getHeaders} = require('../../common');

describe('Organization Response Tests', () => {
    beforeEach(async () => {
        await commonBeforeEach();
    });

    afterEach(async () => {
        await commonAfterEach();
    });

    describe('OrganizationResponse Bundles', () => {
        test('OrganizationResponse can search by null', async () => {
            // noinspection JSUnusedLocalSymbols
            await async.waterfall([
                    (cb) => // first confirm there are no records
                        request
                            .get('/4_0_0/Organization')
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
                            .post('/4_0_0/Organization/test1/$merge')
                            .send(organizationResponseBundle1)
                                .set(getHeaders())
                            .expect(200, (err, resp) => {
                                console.log('------- response 2 ------------');
                                console.log(JSON.stringify(resp.body, null, 2));
                                console.log('------- end response 2  ------------');
                                return cb(err, resp);
                            }),
                    (results, cb) =>
                        request
                            .post('/4_0_0/Organization/test2/$merge')
                            .send(organizationResponseBundle2)
                                .set(getHeaders())
                            .expect(200, (err, resp) => {
                                console.log('------- response 3 ------------');
                                console.log(JSON.stringify(resp.body, null, 2));
                                console.log('------- end response 3  ------------');
                                return cb(err, resp);
                            }),
                    (results, cb) =>
                        request
                            .post('/4_0_0/Organization/test3/$merge')
                            .send(organizationResponseBundle3)
                                .set(getHeaders())
                            .expect(200, (err, resp) => {
                                console.log('------- response 4 ------------');
                                console.log(JSON.stringify(resp.body, null, 2));
                                console.log('------- end response 4  ------------');
                                return cb(err, resp);
                            }),
                    (results, cb) => request
                        .get('/4_0_0/Organization?identifier:missing=true')
                                .set(getHeaders())
                        .expect(200, cb)
                        .expect((resp) => {
                            // clear out the lastUpdated column since that changes
                            let body = resp.body;
                            console.log('------- response 5 ------------');
                            console.log(JSON.stringify(resp.body, null, 2));
                            console.log('------- end response 5  ------------');
                            expect(body.length).toBe(2);
                            body.forEach(element => {
                                delete element['meta']['lastUpdated'];
                            });
                            let expected = expectedOrganizationResponseBundle;
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
                    (results, cb) => request
                        .get('/4_0_0/Organization?identifier:missing=false')
                                .set(getHeaders())
                        .expect(200, cb)
                        .expect((resp) => {
                            // clear out the lastUpdated column since that changes
                            let body = resp.body;
                            console.log('------- response 6 ------------');
                            console.log(JSON.stringify(resp.body, null, 2));
                            console.log('------- end response 6  ------------');
                            expect(body.length).toBe(1);
                            body.forEach(element => {
                                delete element['meta']['lastUpdated'];
                            });
                            let expected = expectedOrganizationResponseBundle2;
                            expected.forEach(element => {
                                if ('meta' in element) {
                                    delete element['meta']['lastUpdated'];
                                }
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
