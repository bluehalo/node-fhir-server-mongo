/* eslint-disable no-unused-vars */
const supertest = require('supertest');

const {app} = require('../../../app');
// practice
const practitionerResource = require('./fixtures/practitioner/practitioner.json');
const practitionerRoleResource = require('./fixtures/practitioner/practitionerRole.json');
const practitionerRoleDifferentSecurityTagResource = require('./fixtures/practitioner/practitionerRoleDifferentSecurityTag.json');
const organizationResource = require('./fixtures/practitioner/organization.json');

// graph
const graphDefinitionResource = require('./fixtures/graph/my_graph.json');

// expected
const expectedResource = require('./fixtures/expected/expected.json');
const expectedHashReferencesResource = require('./fixtures/expected/expected_hash_references.json');

const request = supertest(app);
const {commonBeforeEach, commonAfterEach, getHeaders} = require('../../common');

describe('Practitioner Graph Contained Tests', () => {
    beforeEach(async () => {
        await commonBeforeEach();
    });

    afterEach(async () => {
        await commonAfterEach();
    });

    describe('Graph Contained Tests', () => {
        test('Graph contained works properly', async () => {
            let resp = await request
                .get('/4_0_0/Practitioner')
                .set(getHeaders())
                .expect(200);
            expect(resp.body.length).toBe(0);
            console.log('------- response 1 ------------');
            console.log(JSON.stringify(resp.body, null, 2));
            console.log('------- end response 1 ------------');

            resp = await request
                .post('/4_0_0/Practitioner/1679033641/$merge')
                .send(practitionerResource)
                .set(getHeaders())
                .expect(200);
            console.log('------- response practitionerResource ------------');
            console.log(JSON.stringify(resp.body, null, 2));
            console.log('------- end response  ------------');
            expect(resp.body['created']).toBe(true);

            resp = await request
                .post('/4_0_0/PractitionerRole/1/$merge')
                .send(practitionerRoleResource)
                .set(getHeaders())
                .expect(200);
            console.log('------- response practitionerResource ------------');
            console.log(JSON.stringify(resp.body, null, 2));
            console.log('------- end response  ------------');
            expect(resp.body['created']).toBe(true);

            resp = await request
                .post('/4_0_0/PractitionerRole/1/$merge')
                .send(practitionerRoleDifferentSecurityTagResource)
                .set(getHeaders())
                .expect(200);
            console.log('------- response practitionerResource ------------');
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

            resp = await request
                .post('/4_0_0/Practitioner/$graph?id=1679033641&contained=true')
                .send(graphDefinitionResource)
                .set(getHeaders())
                .expect(200);

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

            resp = await request
                .post('/4_0_0/Practitioner/$graph?id=1679033641&contained=true&_hash_references=true')
                .send(graphDefinitionResource)
                .set(getHeaders())
                .expect(200);

            console.log('------- response Practitioner 1679033641 $graph ------------');
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
