/* eslint-disable no-unused-vars */
const {MongoClient} = require('mongodb');
const supertest = require('supertest');

const {app} = require('../../../app');
const globals = require('../../../globals');
const {CLIENT, CLIENT_DB} = require('../../../constants');
// practice
const practiceHealthcareServiceResource = require('./fixtures/practice/healthcare_service.json');
const practiceOrganizationResource = require('./fixtures/practice/practice_organization.json');
const practiceOrganization2Resource = require('./fixtures/practice/practice_organization2.json');
const practiceParentOrganizationResource = require('./fixtures/practice/parent_organization.json');
const practiceLocationResource = require('./fixtures/practice/location.json');
// graph
const graphDefinitionResource = require('./fixtures/graph/my_graph.json');

// expected
const expectedResource = require('./fixtures/expected/expected.json');

const async = require('async');
const env = require('var');

const request = supertest(app);

describe('Organization Graph Contained Tests', () => {
    let connection;
    let db;
    // let resourceId;

    beforeEach(async () => {
        connection = await MongoClient.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            server: {
                auto_reconnect: true,
                socketOptions: {

                    keepAlive: 1,
                    connectTimeoutMS: 60000,
                    socketTimeoutMS: 60000,
                }
            }
        });
        db = connection.db();

        globals.set(CLIENT, connection);
        globals.set(CLIENT_DB, db);
        jest.setTimeout(30000);
        env['VALIDATE_SCHEMA'] = true;
    });

    afterEach(async () => {
        await db.dropDatabase();
        await connection.close();
    });

    describe('Graph Contained Tests', () => {
        test('Graph contained works properly', (done) => {
            async.waterfall([
                    (cb) => // first confirm there are no practitioners
                        request
                            .get('/4_0_0/Practitioner')
                            .set('Content-Type', 'application/fhir+json')
                            .set('Accept', 'application/fhir+json')
                            .expect(200, (err, resp) => {
                                expect(resp.body.length).toBe(0);
                                console.log('------- response 1 ------------');
                                console.log(JSON.stringify(resp.body, null, 2));
                                console.log('------- end response 1 ------------');
                                return cb(err, resp);
                            }),
                    (results, cb) =>
                        request
                            .post('/4_0_0/HealthcareService/MWHC_Department-207RE0101X/$merge')
                            .send(practiceHealthcareServiceResource)
                            .set('Content-Type', 'application/fhir+json')
                            .set('Accept', 'application/fhir+json')
                            .expect(200, (err, resp) => {
                                if (err) {
                                    console.log(err);
                                }
                                console.log('------- response practiceHealthcareServiceResource ------------');
                                console.log(JSON.stringify(resp.body, null, 2));
                                console.log('------- end response  ------------');
                                expect(resp.body['created']).toBe(true);
                                return cb(err, resp);
                            }),
                    (results, cb) =>
                        request
                            .post('/4_0_0/Organization/MWHC/$merge')
                            .send(practiceOrganizationResource)
                            .set('Content-Type', 'application/fhir+json')
                            .set('Accept', 'application/fhir+json')
                            .expect(200, (err, resp) => {
                                if (err) {
                                    console.log(err);
                                }
                                console.log('------- response practiceOrganizationResource ------------');
                                console.log(JSON.stringify(resp.body, null, 2));
                                console.log('------- end response  ------------');
                                expect(resp.body['created']).toBe(true);
                                return cb(err, resp);
                            }),
                    (results, cb) =>
                        request
                            .post('/4_0_0/Organization/1234/$merge')
                            .send(practiceOrganization2Resource)
                            .set('Content-Type', 'application/fhir+json')
                            .set('Accept', 'application/fhir+json')
                            .expect(200, (err, resp) => {
                                if (err) {
                                    console.log(err);
                                }
                                console.log('------- response practiceOrganization2Resource ------------');
                                console.log(JSON.stringify(resp.body, null, 2));
                                console.log('------- end response  ------------');
                                expect(resp.body['created']).toBe(true);
                                return cb(err, resp);
                            }),
                    (results, cb) =>
                        request
                            .post('/4_0_0/Organization/MedStarMedicalGroup/$merge')
                            .send(practiceParentOrganizationResource)
                            .set('Content-Type', 'application/fhir+json')
                            .set('Accept', 'application/fhir+json')
                            .expect(200, (err, resp) => {
                                if (err) {
                                    console.log(err);
                                }
                                console.log('------- response practiceHealthcareServiceResource ------------');
                                console.log(JSON.stringify(resp.body, null, 2));
                                console.log('------- end response  ------------');
                                expect(resp.body['created']).toBe(true);
                                return cb(err, resp);
                            }),
                    (results, cb) =>
                        request
                            .post('/4_0_0/Location/$merge')
                            .send(practiceLocationResource)
                            .set('Content-Type', 'application/fhir+json')
                            .set('Accept', 'application/fhir+json')
                            .expect(200, (err, resp) => {
                                if (err) {
                                    console.log(err);
                                }
                                console.log('------- response practiceLocationResource ------------');
                                console.log(JSON.stringify(resp.body, null, 2));
                                console.log('------- end response  ------------');
                                expect(resp.body['created']).toBe(true);
                                return cb(err, resp);
                            }),
                    (results, cb) => request
                        .post('/4_0_0/Organization/$graph?id=733797173,1234&contained=true')
                        .send(graphDefinitionResource)
                        .set('Content-Type', 'application/fhir+json')
                        .set('Accept', 'application/fhir+json')
                        .expect(200, cb)
                        .expect((resp) => {
                            console.log('------- response Organization 733797173 $graph ------------');
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
                                element['resource']['meta'] = {'versionId': '1'};
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
