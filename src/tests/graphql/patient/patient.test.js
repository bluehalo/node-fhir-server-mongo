/* eslint-disable no-unused-vars */
const supertest = require('supertest');

const {app} = require('../../../app');
const explanationOfBenefitBundleResource = require('./fixtures/explanation_of_benefits.json');
const expectedGraphQlResponse = require('./fixtures/expected_graphql_response.json');

const patientBundleResource = require('./fixtures/patients.json');
const organizationBundleResource = require('./fixtures/organizations.json');

const fs = require('fs');
const path = require('path');

// eslint-disable-next-line security/detect-non-literal-fs-filename
const explanationOfBenefitQuery = fs.readFileSync(path.resolve(__dirname, './fixtures/query.graphql'), 'utf8');

const async = require('async');

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
            await async.waterfall([
                (cb) => // first confirm there are no records
                    request
                        .get('/4_0_0/ExplanationOfBenefit')
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
                        .post('/4_0_0/Patient/1/$merge')
                        .send(patientBundleResource)
                        .set(getHeaders())
                        .expect(200, (err, resp) => {
                            console.log('------- response 2 ------------');
                            console.log(JSON.stringify(resp.body, null, 2));
                            console.log('------- end response 2  ------------');
                            return cb(err, resp);
                        }),
                (results, cb) =>
                    request
                        .post('/4_0_0/Organization/1/$merge')
                        .send(organizationBundleResource)
                        .set(getHeaders())
                        .expect(200, (err, resp) => {
                            console.log('------- response 2 ------------');
                            console.log(JSON.stringify(resp.body, null, 2));
                            console.log('------- end response 2  ------------');
                            return cb(err, resp);
                        }),
                (results, cb) =>
                    request
                        .post('/4_0_0/ExplanationOfBenefit/1/$merge')
                        .send(explanationOfBenefitBundleResource)
                        .set(getHeaders())
                        .expect(200, (err, resp) => {
                            console.log('------- response 2 ------------');
                            console.log(JSON.stringify(resp.body, null, 2));
                            console.log('------- end response 2  ------------');
                            return cb(err, resp);
                        }),
                (results, cb) =>
                    request
                        .get('/4_0_0/Patient/')
                        .set(getHeaders())
                        .expect(200, (err, resp) => {
                            console.log('------- response patient ------------');
                            console.log(JSON.stringify(resp.body, null, 2));
                            console.log('------- end response patient  ------------');
                            return cb(err, resp);
                        }),
                (results, cb) =>
                    request
                        .get('/4_0_0/ExplanationOfBenefit/')
                        .set(getHeaders())
                        .expect(200, (err, resp) => {
                            console.log('------- response 2 ------------');
                            console.log(JSON.stringify(resp.body, null, 2));
                            console.log('------- end response 2  ------------');
                            return cb(err, resp);
                        }),
                (results, cb) => request
                    // .get('/graphql/?query=' + graphqlQueryText)
                    // .set(getHeaders())
                    .post('/graphql')
                    .send({
                        'operationName': null,
                        'variables': {},
                        'query': graphqlQueryText
                    })
                    .set(getGraphQLHeaders())
                    .expect(200, cb)
                    .expect((resp) => {
                        // clear out the lastUpdated column since that changes
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
                    }, cb),
            ]);
        });
    });
});
