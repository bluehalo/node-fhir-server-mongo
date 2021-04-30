/* eslint-disable no-unused-vars */
const {MongoClient} = require('mongodb');
const supertest = require('supertest');

const {app} = require('../../../app');
const globals = require('../../../globals');
const {CLIENT, CLIENT_DB} = require('../../../constants');
// practice
const slotResource = require('./fixtures/slot/slot.json');
const slotScheduleResource = require('./fixtures/slot/schedule.json');
const slotPractitionerRoleResource = require('./fixtures/slot/practitionerRole.json');
const slotPractitionerResource = require('./fixtures/slot/practitioner.json');

// expected
const expectedEverythingResource = require('./fixtures/expected/expected_everything.json');

const async = require('async');
const env = require('var');

const request = supertest(app);

describe('Slot Everything Tests', () => {
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

    describe('Everything Tests', () => {
        test('Everything works properly', (done) => {
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
                            .post('/4_0_0/Slot/1/$merge')
                            .send(slotResource)
                            .set('Content-Type', 'application/fhir+json')
                            .set('Accept', 'application/fhir+json')
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
                            .set('Content-Type', 'application/fhir+json')
                            .set('Accept', 'application/fhir+json')
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
                            .set('Content-Type', 'application/fhir+json')
                            .set('Accept', 'application/fhir+json')
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
                            .set('Content-Type', 'application/fhir+json')
                            .set('Accept', 'application/fhir+json')
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
                        .set('Content-Type', 'application/fhir+json')
                        .set('Accept', 'application/fhir+json')
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
