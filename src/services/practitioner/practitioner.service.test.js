const { MongoClient } = require('mongodb');
const supertest = require('supertest');

const { app } = require('../../app');
const globals = require('../../globals');
const { CLIENT, CLIENT_DB } = require('../../constants');
const validResource = require('./fixtures/valid-practitioner.json');
const request = supertest(app);

describe('#Practitioner', () => {
  let connection;
  let db;
  let resourceId;

  beforeAll(async () => {
    connection = await MongoClient.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    db = await connection.db();

    globals.set(CLIENT, connection);
    globals.set(CLIENT_DB, db);
  });

  afterAll(async () => {
    await connection.close();
  });

  describe('POST /4_0_0/Practitioner', () => {
    // test('invalid payloads should return a 400 with OperationOutcome', (done) => {
    //   request
    //     .post('/4_0_0/Practitioner')
    //     .send({ resourceType: 'Practitioner', valid: false })
    //     .set('Content-Type', 'application/fhir+json')
    //     .set('Accept', 'application/fhir+json')
    //     .end((err, resp) => {
    //       expect(err).toBeNull();
    //       expect(resp.status).toBe(400);
    //       expect(resp.body).toMatchObject({
    //         resourceType: 'OperationOutcome',
    //         issue: [
    //           {
    //             severity: 'error',
    //             code: 'invalid',
    //             details: {
    //               text:
    //                 '/4_0_0/Practitioner should NOT have additional properties :{"additionalProperty":"valid"}: at position root',
    //             },
    //           },
    //           {
    //             severity: 'error',
    //             code: 'invalid',
    //             details: {
    //               text:
    //                 '/4_0_0/Practitioner should match exactly one schema in oneOf :{"passingSchemas":null}: at position root',
    //             },
    //           },
    //         ],
    //       });
    //       done();
    //     });
    // });

    test('valid paylaods return 201 with header describing location', (done) => {
      request
        .post('/4_0_0/Practitioner')
        .send(validResource)
        .set('Content-Type', 'application/fhir+json')
        .set('Accept', 'application/fhir+json')
        .end((err, resp) => {
          expect(err).toBeNull();
          expect(resp.status).toBe(201);
          expect(resp.headers.location.includes('4_0_0/Practitioner'));
          resourceId = resp.headers.location.split('/Practitioner/')[1];
          done();
        });
    });
  });

  describe('GET /4_0_0/Practitioner/{id}', () => {
    // test('should return 404 if not found with OperationOutcome', (done) => {
    //   request
    //     .get('/4_0_0/Practitioner/i-am-not-here')
    //     .set('Content-Type', 'application/fhir+json')
    //     .set('Accept', 'application/fhir+json')
    //     .end((err, resp) => {
    //       expect(err).toBeNull();
    //       expect(resp.status).toBe(404);
    //       expect(resp.body).toMatchObject({
    //         resourceType: 'OperationOutcome',
    //         issue: [
    //           {
    //             severity: 'error',
    //             code: 'not-found',
    //             details: {
    //               text: 'Resource not found',
    //             },
    //           },
    //         ],
    //       });
    //       done();
    //     });
    // });

    test('should return resource with status code 200 if found', (done) => {
      request
        .get(`/4_0_0/Practitioner/${resourceId}`)
        .set('Content-Type', 'application/fhir+json')
        .set('Accept', 'application/fhir+json')
        .end((err, resp) => {
          expect(err).toBeNull();
          expect(resp.status).toBe(200);
          expect(resp.body).toMatchObject(validResource);
          done();
        });
    });
  });

  describe('PUT /4_0_0/Practitioner/{id}', () => {
    // test('should return 400 with invalid Payload', (done) => {
    //   request
    //     .put(`/4_0_0/Practitioner/${resourceId}`)
    //     .send({ resourceType: 'Practitioner', valid: false })
    //     .set('Content-Type', 'application/fhir+json')
    //     .set('Accept', 'application/fhir+json')
    //     .end((err, resp) => {
    //       expect(err).toBeNull();
    //       expect(resp.status).toBe(400);
    //       done();
    //     });
    // });

    // test('should return 404 when not found', (done) => {
    //   request
    //     .put('/4_0_0/Practitioner/not-existy')
    //     .send({ resourceType: 'Practitioner' })
    //     .set('Content-Type', 'application/fhir+json')
    //     .set('Accept', 'application/fhir+json')
    //     .end((err, resp) => {
    //       expect(err).toBeNull();
    //       expect(resp.status).toBe(404);
    //       done();
    //     });
    // });

    // test('should return 200 when valid', (done) => {
    //   validResource.address[0].city = 'THIS IS NEW CITY';
    //   request
    //     .put(`/4_0_0/Practitioner/${resourceId}`)
    //     .send(validResource)
    //     .set('Content-Type', 'application/fhir+json')
    //     .set('Accept', 'application/fhir+json')
    //     .end((err, resp) => {
    //       expect(err).toBeNull();
    //       expect(resp.status).toBe(200);
    //       expect(parseInt(resp.headers.etag, 10)).toBe(2);
    //       done();
    //     });
    // });
  });

  describe('DELETE /4_0_0/Practitioner/{id}', () => {
    // test('should return 404 if ID not found to delete', (done) => {
    //   request
    //     .delete('/4_0_0/Practitioner/i-am-not-here')
    //     .set('Content-Type', 'application/fhir+json')
    //     .set('Accept', 'application/fhir+json')
    //     .end((err, resp) => {
    //       expect(err).toBeNull();
    //       expect(resp.status).toBe(404);
    //       expect(resp.body).toMatchObject({
    //         resourceType: 'OperationOutcome',
    //         issue: [
    //           {
    //             severity: 'error',
    //             code: 'not-found',
    //             details: {
    //               text: 'Resource not found',
    //             },
    //           },
    //         ],
    //       });
    //       done();
    //     });
    // });
    test('should return 204 if ID found and deleted', (done) => {
      request
        .delete(`/4_0_0/Practitioner/${resourceId}`)
        .set('Content-Type', 'application/fhir+json')
        .set('Accept', 'application/fhir+json')
        .end((err, resp) => {
          expect(err).toBeNull();
          expect(resp.status).toBe(204);
          done();
        });
    });
  });
});
