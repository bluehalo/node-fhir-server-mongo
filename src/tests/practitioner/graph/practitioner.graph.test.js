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
const {findDuplicateResources} = require('../../../utils/list.util');
const {assertCompareBundles} = require('../../fhirAsserts');

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
            let expected = expectedResource;
            assertCompareBundles(body, expected);

            resp = await request
                .post('/4_0_0/Practitioner/$graph?id=1679033641&contained=true&_hash_references=true')
                .send(graphDefinitionResource)
                .set(getHeaders())
                .expect(200);

            console.log('------- response Practitioner 1679033641 $graph ------------');
            console.log(JSON.stringify(resp.body, null, 2));
            console.log('------- end response  ------------');
            body = resp.body;
            expected = expectedHashReferencesResource;
            console.log('----- Received resources ----');
            console.log(`${body.entry.map(e => e.resource).map(a => `${a.resourceType}/${a.id}`)}`);
            console.log('----- End of Received resources ----');
            // verify there are no duplicate ids
            const duplicates = findDuplicateResources(
                body.entry.map(e => e.resource)
            );
            expect(duplicates.map(a => `${a.resourceType}/${a.id}`)).toStrictEqual([]);

            assertCompareBundles(body, expected);
        });
    });
});
