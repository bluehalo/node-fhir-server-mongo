/* eslint-disable no-unused-vars */
const supertest = require('supertest');

const { app } = require('../../../app');

const expectedGraphQlResponse = require('./fixtures/expected_careteam_graphql_response.json');
const patientBundleResource = require('./fixtures/patients.json');
const practitionerBundleResource = require('./fixtures/practitioners.json');

const fs = require('fs');
const path = require('path');

// eslint-disable-next-line security/detect-non-literal-fs-filename
const query = fs.readFileSync(path.resolve(__dirname, './fixtures/updateCareTeam.graphql'), 'utf8');

const request = supertest(app);
const {
  commonBeforeEach,
  commonAfterEach,
  getHeaders,
  getGraphQLHeaders,
} = require('../../common');

describe('GraphQL Patient Update Care Team Tests', () => {
  beforeEach(async () => {
    await commonBeforeEach();
  });

  afterEach(async () => {
    await commonAfterEach();
  });

  describe('GraphQL Patient Update Care Team', () => {
    test('GraphQL Update General Practitioner for Patient', async () => {
      jest.useFakeTimers('legacy');
      // noinspection JSUnusedLocalSymbols
      const graphqlQueryText = query.replace(/\\n/g, '');

      let resp = await request.get('/4_0_0/Patient').set(getHeaders()).expect(200);
      expect(resp.body.length).toBe(0);
      console.log('------- response 1 ------------');
      console.log(JSON.stringify(resp.body, null, 2));
      console.log('------- end response 1 ------------');

      resp = await request.get('/4_0_0/Practitioner').set(getHeaders()).expect(200);
      expect(resp.body.length).toBe(0);
      console.log('------- response 1 ------------');
      console.log(JSON.stringify(resp.body, null, 2));
      console.log('------- end response 1 ------------');

      resp = await request.get('/4_0_0/CareTeam').set(getHeaders()).expect(200);
      expect(resp.body.length).toBe(0);
      console.log('------- response 1 ------------');
      console.log(JSON.stringify(resp.body, null, 2));
      console.log('------- end response 1 ------------');

      resp = await request
        .post('/4_0_0/Patient/1/$merge')
        .send(patientBundleResource)
        .set(getHeaders())
        .expect(200);

      console.log('------- response 2 ------------');
      console.log(JSON.stringify(resp.body, null, 2));
      console.log('------- end response 2  ------------');

      resp = await request
        .post('/4_0_0/Practitioner/1/$merge')
        .send(practitionerBundleResource)
        .set(getHeaders())
        .expect(200);

      console.log('------- response 2 ------------');
      console.log(JSON.stringify(resp.body, null, 2));
      console.log('------- end response 2  ------------');

      resp = await request.get('/4_0_0/Patient/').set(getHeaders()).expect(200);

      console.log('------- response patient ------------');
      console.log(JSON.stringify(resp.body, null, 2));
      console.log('------- end response patient  ------------');

      resp = await request.get('/4_0_0/Practitioner/').set(getHeaders()).expect(200);

      console.log('------- response practitioner ------------');
      console.log(JSON.stringify(resp.body, null, 2));
      console.log('------- end response practitioner  ------------');

      resp = await request
        .post('/graphql')
        .send({
          operationName: null,
          variables: {},
          query: graphqlQueryText,
        })
        .set(getGraphQLHeaders())
        .expect(200);

      let body = resp.body;
      console.log('------- response graphql ------------');
      console.log(JSON.stringify(resp.body, null, 2));
      console.log('------- end response graphql  ------------');
      if (body.errors) {
        console.log(body.errors);
        expect(body.errors).toBeUndefined();
      }
      expect(body).toStrictEqual(expectedGraphQlResponse);
      resp = await request.get('/4_0_0/CareTeam/').set(getHeaders()).expect(200);

      console.log('------- response careTeam ------------');
      console.log(JSON.stringify(resp.body, null, 2));
      console.log('------- end response careTeam  ------------');
    });
  });
});
