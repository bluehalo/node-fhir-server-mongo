/* eslint-disable no-unused-vars */
const supertest = require('supertest');

const {app} = require('../../../app');
// claim
const claimResource = require('./fixtures/claim/explanation_of_benefits.json');
const practitionerResource = require('./fixtures/claim/practitioner.json');
const organizationResource = require('./fixtures/claim/organization.json');

// graph
const graphDefinitionResource = require('./fixtures/graph/my_graph.json');

// expected
const expectedResource = require('./fixtures/expected/expected.json');

const async = require('async');

const request = supertest(app);
const {commonBeforeEach, commonAfterEach, getHeaders} = require('../../common');

describe('Claim Graph Contained Tests', () => {
    beforeEach(async () => {
        await commonBeforeEach();
    });

    afterEach(async () => {
        await commonAfterEach();
    });

    describe('Graph Contained Tests', () => {
        test('Graph contained with multiple targets works properly', async () => {
            await async.waterfall([
                    (cb) => // first confirm there are no claims
                        request
                            .get('/4_0_0/ExplanationOfBenefit')
                            .set(getHeaders())
                            .expect(200, (err, resp) => {
                                expect(resp.body.length).toBe(0);
                                console.log('------- response claimResponse ------------');
                                console.log(JSON.stringify(resp.body, null, 2));
                                console.log('------- end response ------------');
                                return cb(err, resp);
                            }),
                    (results, cb) =>
                        request
                            .post('/4_0_0/Practitioner/1376656959/$merge')
                            .send(practitionerResource)
                            .set(getHeaders())
                            .expect(200, (err, resp) => {
                                if (err) {
                                    console.log(err);
                                }
                                console.log('------- response practitionerResource ------------');
                                console.log(JSON.stringify(resp.body, null, 2));
                                console.log('------- end response  ------------');
                                expect(resp.body['created']).toBe(true);
                                return cb(err, resp);
                            }),
                    (results, cb) =>
                        request
                            .post('/4_0_0/Organization/1407857790/$merge')
                            .send(organizationResource)
                            .set(getHeaders())
                            .expect(200, (err, resp) => {
                                if (err) {
                                    console.log(err);
                                }
                                console.log('------- response organizationResource ------------');
                                console.log(JSON.stringify(resp.body, null, 2));
                                console.log('------- end response  ------------');
                                expect(resp.body['created']).toBe(true);
                                return cb(err, resp);
                            }),
                    (results, cb) =>
                        request
                            .post('/4_0_0/ExplanationOfBenefit/WPS-Claim-230916613369/$merge')
                            .send(claimResource[0])
                            .set(getHeaders())
                            .expect(200, (err, resp) => {
                                if (err) {
                                    console.log(err);
                                }
                                console.log('------- response claimResource 1------------');
                                console.log(JSON.stringify(resp.body, null, 2));
                                console.log('------- end response  1------------');
                                expect(resp.body['created']).toBe(true);
                                return cb(err, resp);
                            }),
                    (results, cb) =>
                        request
                            .post('/4_0_0/ExplanationOfBenefit/WPS-Claim-230916613368/$merge')
                            .send(claimResource[1])
                            .set(getHeaders())
                            .expect(200, (err, resp) => {
                                if (err) {
                                    console.log(err);
                                }
                                console.log('------- response claimResource 2------------');
                                console.log(JSON.stringify(resp.body, null, 2));
                                console.log('------- end response 2 ------------');
                                expect(resp.body['created']).toBe(true);
                                return cb(err, resp);
                            }),
                    (results, cb) => request
                        .post('/4_0_0/ExplanationOfBenefit/$graph?id=WPS-Claim-230916613369,WPS-Claim-230916613368&contained=true')
                        .set(getHeaders())
                        .send(graphDefinitionResource)
                        .expect(200, cb)
                        .expect((resp) => {
                            console.log('------- response ExplanationOfBenefit $graph ------------');
                            console.log(JSON.stringify(resp.body, null, 2));
                            console.log('------- end response  ------------');
                            let body = resp.body;
                            delete body['timestamp'];
                            body.entry.forEach(element => {
                                delete element['fullUrl'];
                                delete element['resource']['meta']['lastUpdated'];
                                if (element['resource']['contained']) {
                                    element['resource']['contained'].forEach(containedElement => {
                                        delete containedElement['meta']['lastUpdated'];
                                    });
                                }
                            });
                            let expected = expectedResource;
                            delete expected['timestamp'];
                            expected.entry.forEach(element => {
                                delete element['fullUrl'];
                                if ('meta' in element['resource']) {
                                    delete element['resource']['meta']['lastUpdated'];
                                }
                                element['resource']['meta']['versionId'] = '1';
                                if ('$schema' in element) {
                                    delete element['$schema'];
                                }
                                if (element['resource']['contained']) {
                                    element['resource']['contained'].forEach(containedElement => {
                                        delete containedElement['meta']['lastUpdated'];
                                    });
                                }
                            });
                            expect(body).toStrictEqual(expected);
                        }, cb)
                ]);
        });
    });
});
