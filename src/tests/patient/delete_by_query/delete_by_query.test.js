const supertest = require('supertest');

const {app} = require('../../../app');
// provider file
const patient1Resource = require('./fixtures/patient/patient1.json');
const patient2Resource = require('./fixtures/patient/patient2.json');

// expected
const expectedSinglePatientResource = require('./fixtures/expected/expected_single_patient.json');

const request = supertest(app);
const {commonBeforeEach, commonAfterEach, getHeaders} = require('../../common');

describe('Practitioner Delete Tests', () => {
    beforeEach(async () => {
        await commonBeforeEach();
    });

    afterEach(async () => {
        await commonAfterEach();
    });

    describe('Patient Delete by query Tests', () => {
        test('search by delete by query works', async () => {
            let resp = await request
                .get('/4_0_0/Patient')
                .set(getHeaders())
                .expect(200);

            expect(resp.body.length).toBe(0);
            console.log('------- response 1 ------------');
            console.log(JSON.stringify(resp.body, null, 2));
            console.log('------- end response 1 ------------');

            resp = await request
                .post('/4_0_0/Patient/1679033641/$merge?validate=true')
                .send(patient1Resource)
                .set(getHeaders())
                .expect(200);

            console.log('------- response patient1Resource ------------');
            console.log(JSON.stringify(resp.body, null, 2));
            console.log('------- end response  ------------');
            expect(resp.body['created']).toBe(true);

            resp = await request
                .post('/4_0_0/Patient/2/$merge?validate=true')
                .send(patient2Resource)
                .set(getHeaders())
                .expect(200);

            console.log('------- response patient2Resource ------------');
            console.log(JSON.stringify(resp.body, null, 2));
            console.log('------- end response  ------------');
            expect(resp.body['created']).toBe(true);

            resp = await request
                .get('/4_0_0/Patient')
                .set(getHeaders())
                .expect(200);

            expect(resp.body.length).toBe(2);
            console.log('------- response 3 ------------');
            console.log(JSON.stringify(resp.body, null, 2));
            console.log('------- end response 3 ------------');

            resp = await request
                .delete('/4_0_0/Patient/0/?_security=https://www.icanbwell.com/owner|medstar2')
                .set(getHeaders())
                .expect(204);

            resp = await request
                .get('/4_0_0/Patient')
                .set(getHeaders())
                .expect(200);

            expect(resp.body.length).toBe(1);
            console.log('------- response 3 ------------');
            console.log(JSON.stringify(resp.body, null, 2));
            console.log('------- end response 3 ------------');

            resp = await request
                .get('/4_0_0/Patient/00100000000')
                .set(getHeaders())
                .expect(200);

            console.log('------- response Patient sorted ------------');
            console.log(JSON.stringify(resp.body, null, 2));
            console.log('------- end response sort ------------');
            // clear out the lastUpdated column since that changes
            let body = resp.body;
            delete body['meta']['lastUpdated'];

            let expected = expectedSinglePatientResource[0];
            delete expected['meta']['lastUpdated'];
            delete expected['$schema'];

            expect(body).toStrictEqual(expected);
        });
    });
});
