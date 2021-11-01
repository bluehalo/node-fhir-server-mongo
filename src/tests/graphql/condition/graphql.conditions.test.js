/* eslint-disable no-unused-vars */
const supertest = require('supertest');

const {app} = require('../../../app');
const conditionBundleResource = require('./fixtures/conditions.json');
const expectedConditionBundleResource = require('./fixtures/expected_conditions.json');

const patientBundleResource = require('./fixtures/patients.json');

const fs = require('fs');
const path = require('path');

// eslint-disable-next-line security/detect-non-literal-fs-filename
const conditionQuery = fs.readFileSync(path.resolve(__dirname, './fixtures/query.graphql'), 'utf8');

const async = require('async');

const request = supertest(app);
const {
    commonBeforeEach,
    commonAfterEach,
    getHeaders,
    getUnAuthenticatedHeaders,
    getGraphQLHeaders
} = require('../../common');

describe('GraphQL Condition Tests', () => {
    beforeEach(async () => {
        await commonBeforeEach();
    });

    afterEach(async () => {
        await commonAfterEach();
    });

    describe('GraphQL Condition', () => {
        test('GraphQL Condition properly', async () => {
            // noinspection JSUnusedLocalSymbols
            const graphqlQueryText = conditionQuery.replace(/\\n/g, '');
            await async.waterfall([
                (cb) => // first confirm there are no records
                    request
                        .get('/4_0_0/Condition')
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
                        .post('/4_0_0/Condition/1/$merge')
                        .send(conditionBundleResource)
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
                        .get('/4_0_0/Condition/')
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
                        expect(body.data.condition.length).toBe(10);
                        let expected = expectedConditionBundleResource;
                        expected.forEach(element => {
                            if ('meta' in element) {
                                delete element['meta']['lastUpdated'];
                            }
                            // element['meta'] = {'versionId': '1'};
                            if ('$schema' in element) {
                                delete element['$schema'];
                            }
                        });
                        expect(body.data.condition).toStrictEqual(expected);
                    }, cb),
            ]);
        });
    });
});
