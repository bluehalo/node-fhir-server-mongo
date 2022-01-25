/* eslint-disable no-unused-vars */
const supertest = require('supertest');

const {app} = require('../../../app');
const explanationOfBenefitBundleResource = require('./fixtures/explanation_of_benefits.json');
const allergyIntoleranceBundleResource = require('./fixtures/allergy_intolerances.json');
const expectedGraphQlResponse = require('./fixtures/expected_graphql_response.json');
const expectedUpdateGraphQlResponse = require('./fixtures/expected_update_graphql_response.json');

const patientBundleResource = require('./fixtures/patients.json');
const organizationBundleResource = require('./fixtures/organizations.json');
const practitionerBundleResource = require('./fixtures/practitioners.json');

const fs = require('fs');
const path = require('path');

// eslint-disable-next-line security/detect-non-literal-fs-filename
const explanationOfBenefitQuery = fs.readFileSync(path.resolve(__dirname, './fixtures/query.graphql'), 'utf8');
// eslint-disable-next-line security/detect-non-literal-fs-filename
const updatePractitionerQuery = fs.readFileSync(path.resolve(__dirname, './fixtures/updatePractitioner.graphql'), 'utf8');

const request = supertest(app);
const {
    commonBeforeEach,
    commonAfterEach,
    getHeaders,
    getGraphQLHeaders
} = require('../../common');

describe('GraphQL Patient Tests', () => {
    beforeEach(async () => {
        await commonBeforeEach();
    });

    afterEach(async () => {
        await commonAfterEach();
    });

    describe('GraphQL Patient', () => {
        test('GraphQL Patient properly', async () => {
            jest.useFakeTimers('legacy');
            // noinspection JSUnusedLocalSymbols
            const graphqlQueryText = explanationOfBenefitQuery.replace(/\\n/g, '');

            let resp = await request
                .get('/4_0_0/ExplanationOfBenefit')
                .set(getHeaders())
                .expect(200);
            expect(resp.body.length).toBe(0);
            console.log('------- response 1 ------------');
            console.log(JSON.stringify(resp.body, null, 2));
            console.log('------- end response 1 ------------');

            resp = await request
                .get('/4_0_0/AllergyIntolerance')
                .set(getHeaders())
                .expect(200);
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
                .post('/4_0_0/Organization/1/$merge')
                .send(organizationBundleResource)
                .set(getHeaders())
                .expect(200);

            console.log('------- response 2 ------------');
            console.log(JSON.stringify(resp.body, null, 2));
            console.log('------- end response 2  ------------');

            resp = await request
                .post('/4_0_0/ExplanationOfBenefit/1/$merge')
                .send(explanationOfBenefitBundleResource)
                .set(getHeaders())
                .expect(200);
            console.log('------- response 2 ------------');
            console.log(JSON.stringify(resp.body, null, 2));
            console.log('------- end response 2  ------------');

            resp = await request
                .post('/4_0_0/AllergyIntolerance/1/$merge')
                .send(allergyIntoleranceBundleResource)
                .set(getHeaders())
                .expect(200);

            console.log('------- response 2 ------------');
            console.log(JSON.stringify(resp.body, null, 2));
            console.log('------- end response 2  ------------');

            resp = await request
                .get('/4_0_0/Patient/')
                .set(getHeaders())
                .expect(200);

            console.log('------- response patient ------------');
            console.log(JSON.stringify(resp.body, null, 2));
            console.log('------- end response patient  ------------');

            resp = await request
                .get('/4_0_0/ExplanationOfBenefit/')
                .set(getHeaders())
                .expect(200);

            console.log('------- response 2 ------------');
            console.log(JSON.stringify(resp.body, null, 2));
            console.log('------- end response 2  ------------');

            resp = await request
                // .get('/graphql/?query=' + graphqlQueryText)
                // .set(getHeaders())
                .post('/graphql')
                .send({
                    'operationName': null,
                    'variables': {},
                    'query': graphqlQueryText
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
            expect(body.data.patient.length).toBe(2);
            let expected = expectedGraphQlResponse;
            expected.forEach(element => {
                if ('meta' in element) {
                    delete element['meta']['lastUpdated'];
                }
                // element['meta'] = {'versionId': '1'};
                if ('$schema' in element) {
                    delete element['$schema'];
                }
            });
            expect(body.data.patient).toStrictEqual(expected);
        });
    });
    describe('GraphQL Update General Practitioner', () => {
        test.skip('GraphQL Update General Practitioner for Patient', async () => {
            jest.useFakeTimers('legacy');
            // noinspection JSUnusedLocalSymbols
            const graphqlQueryText = updatePractitionerQuery.replace(/\\n/g, '');

            let resp = await request
                .get('/4_0_0/Patient')
                .set(getHeaders())
                .expect(200);
            expect(resp.body.length).toBe(0);
            console.log('------- response 1 ------------');
            console.log(JSON.stringify(resp.body, null, 2));
            console.log('------- end response 1 ------------');

            resp = await request
                .get('/4_0_0/Practitioner')
                .set(getHeaders())
                .expect(200);
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

            resp = await request
                .get('/4_0_0/Patient/')
                .set(getHeaders())
                .expect(200);
            expect(resp.body.length).toBe(2);
            console.log('------- response patient ------------');
            console.log(JSON.stringify(resp.body, null, 2));
            console.log('------- end response patient  ------------');

            resp = await request
                .get('/4_0_0/Practitioner/')
                .set(getHeaders())
                .expect(200);
            expect(resp.body.length).toBe(2);
            console.log('------- response practitioner ------------');
            console.log(JSON.stringify(resp.body, null, 2));
            console.log('------- end response practitioner  ------------');

            resp = await request
                .post('/graphql')
                .send({
                    'operationName': null,
                    'variables': {},
                    'query': graphqlQueryText
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
            let expected = expectedUpdateGraphQlResponse;
            expect(body).toStrictEqual(expected);
        });
    });
});
