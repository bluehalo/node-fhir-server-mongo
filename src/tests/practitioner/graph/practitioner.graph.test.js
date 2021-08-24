/* eslint-disable no-unused-vars */
const {MongoClient} = require('mongodb');
const supertest = require('supertest');

const {app} = require('../../../app');
const globals = require('../../../globals');
const {CLIENT, CLIENT_DB} = require('../../../constants');
// practice
const practitionerResource = require('./fixtures/practitioner/practitioner.json');
const organizationResource = require('./fixtures/practitioner/organization.json');

// graph
const graphDefinitionResource = require('./fixtures/graph/my_graph.json');

// expected
const expectedResource = require('./fixtures/expected/expected.json');
const expectedHashReferencesResource = require('./fixtures/expected/expected_hash_references.json');

const async = require('async');
const env = require('var');

const request = supertest(app);
const {commonBeforeEach, commonAfterEach, getHeaders} = require('../../common');

describe('Organization Graph Contained Tests', () => {
    beforeEach(async () => {
        await commonBeforeEach();
    });

    afterEach(async () => {
        await commonAfterEach();
    });

    describe('Graph Contained Tests', () => {
        test('Graph contained works properly', (done) => {
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
                            .post('/4_0_0/Practitioner/1679033641/$merge')
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
                            .post('/4_0_0/Organization/123456/$merge')
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
                    (results, cb) => request
                        .post('/4_0_0/Practitioner/$graph?id=1679033641&contained=true')
                        .send(graphDefinitionResource)
                        .set(getHeaders())
                        .expect(200, cb)
                        .expect((resp) => {
                            console.log('------- response Practitioner 1679033641 $graph ------------');
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
                        }),
                        (results, cb) => request
                        .post('/4_0_0/Practitioner/$graph?id=1679033641&contained=true&_hash_references=true')
                        .send(graphDefinitionResource)
                        .set(getHeaders())
                        .expect(200, cb)
                        .expect((resp) => {
                            console.log('------- response Practitioner 1679033641 $graph ------------');
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
                            let expected = expectedHashReferencesResource;
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
                ],
                (err) => {
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
