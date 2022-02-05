/* eslint-disable no-unused-vars */
const supertest = require('supertest');

const {app} = require('../../../app');
// practice
const groupResource = require('./fixtures/practitioner/group.json');
const insurancePlanResource = require('./fixtures/practitioner/insurancePlan.json');
const locationResource = require('./fixtures/practitioner/location.json');
const organizationResource = require('./fixtures/practitioner/organization.json');
const practitionerResource = require('./fixtures/practitioner/practitioner.json');
const practitionerRoleResource = require('./fixtures/practitioner/practitionerRole.json');
const scheduleResource = require('./fixtures/practitioner/schedule.json');
const healthcareServiceResource = require('./fixtures/practitioner/healthcareService.json');

// graph
const graphDefinitionResource = require('./fixtures/graph/my_graph.json');

// expected
const expectedResource = require('./fixtures/expected/expected.json');
const expectedHashReferencesResource = require('./fixtures/expected/expected_hash_references.json');

const request = supertest(app);
const {commonBeforeEach, commonAfterEach, getHeaders} = require('../../common');

describe('Practitioner Graph PSS Contained Tests', () => {
    beforeEach(async () => {
        await commonBeforeEach();
    });

    afterEach(async () => {
        await commonAfterEach();
    });

    describe('Graph Contained PSS Tests', () => {
        test('Graph contained PSS works properly', async () => {
            let resp = await request
                .get('/4_0_0/Practitioner')
                .set(getHeaders())
                .expect(200);
            expect(resp.body.length).toBe(0);
            console.log('------- response 1 ------------');
            console.log(JSON.stringify(resp.body, null, 2));
            console.log('------- end response 1 ------------');

            resp = await request
                .post('/4_0_0/Group/1/$merge')
                .send(groupResource)
                .set(getHeaders())
                .expect(200);
            console.log('------- response groupResource ------------');
            console.log(JSON.stringify(resp.body, null, 2));
            console.log('------- end response  ------------');
            expect(resp.body['created']).toBe(true);

            resp = await request
                .post('/4_0_0/InsurancePlan/1/$merge')
                .send(insurancePlanResource)
                .set(getHeaders())
                .expect(200);
            console.log('------- response insurancePlanResource ------------');
            console.log(JSON.stringify(resp.body, null, 2));
            console.log('------- end response  ------------');
            expect(resp.body[0]['created']).toBe(true);
            expect(resp.body[1]['created']).toBe(true);

            resp = await request
                .post('/4_0_0/Location/1/$merge')
                .send(locationResource)
                .set(getHeaders())
                .expect(200);
            console.log('------- response locationResource ------------');
            console.log(JSON.stringify(resp.body, null, 2));
            console.log('------- end response  ------------');
            expect(resp.body['created']).toBe(true);

            resp = await request
                .post('/4_0_0/Practitioner/1003059437/$merge')
                .send(practitionerResource)
                .set(getHeaders())
                .expect(200);
            console.log('------- response practitionerResource ------------');
            console.log(JSON.stringify(resp.body, null, 2));
            console.log('------- end response  ------------');
            expect(resp.body[0]['created']).toBe(true);
            expect(resp.body[1]['created']).toBe(true);

            resp = await request
                .post('/4_0_0/PractitionerRole/1/$merge')
                .send(practitionerRoleResource)
                .set(getHeaders())
                .expect(200);
            console.log('------- response practitionerResource ------------');
            console.log(JSON.stringify(resp.body, null, 2));
            console.log('------- end response  ------------');
            expect(resp.body[0]['created']).toBe(true);
            expect(resp.body[1]['created']).toBe(true);

            resp = await request
                .post('/4_0_0/Schedule/1/$merge')
                .send(scheduleResource)
                .set(getHeaders())
                .expect(200);
            console.log('------- response scheduleResource ------------');
            console.log(JSON.stringify(resp.body, null, 2));
            console.log('------- end response  ------------');
            expect(resp.body['created']).toBe(true);

            resp = await request
                .post('/4_0_0/Organization/123456/$merge')
                .send(organizationResource)
                .set(getHeaders())
                .expect(200);
            console.log('------- response organizationResource ------------');
            console.log(JSON.stringify(resp.body, null, 2));
            console.log('------- end response  ------------');
            expect(resp.body['created']).toBe(true);
            expect(resp.body['created']).toBe(true);

            resp = await request
                .post('/4_0_0/HealthcareService/123456/$merge')
                .send(healthcareServiceResource)
                .set(getHeaders())
                .expect(200);
            console.log('------- response healthcareServiceResource ------------');
            console.log(JSON.stringify(resp.body, null, 2));
            console.log('------- end response  ------------');
            expect(resp.body[0]['created']).toBe(true);
            expect(resp.body[1]['created']).toBe(true);

            resp = await request
                .post('/4_0_0/Practitioner/$graph?id=1003059437&contained=true')
                .send(graphDefinitionResource)
                .set(getHeaders());
            console.log('------- response Practitioner 1003059437 $graph ------------');
            console.log(JSON.stringify(resp.body, null, 2));
            console.log('------- end response  ------------');
            expect(resp.statusCode).toStrictEqual(200);
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

            resp = await request
                .post('/4_0_0/Practitioner/$graph?id=1003059437&contained=true&_hash_references=true')
                .send(graphDefinitionResource)
                .set(getHeaders())
                .expect(200);

            console.log('------- response Practitioner 1003059437 $graph hashed_references ------------');
            console.log(JSON.stringify(resp.body, null, 2));
            console.log('------- end response  ------------');
            body = resp.body;
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
            expected = expectedHashReferencesResource;
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
        });
    });
});
