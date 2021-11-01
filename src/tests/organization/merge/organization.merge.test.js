const supertest = require('supertest');

const {app} = require('../../../app');
const organizationBundleResourceInit = require('./fixtures/organization_init.json');
const organizationBundleResourceUpdate = require('./fixtures/organization_update.json');
const expectedOrganizationBundleResource = require('./fixtures/expected_organization.json');

const request = supertest(app);
const {commonBeforeEach, commonAfterEach, getHeaders} = require('../../common');

describe('Organization Merge Tests', () => {
    beforeEach(async () => {
        await commonBeforeEach();
    });

    afterEach(async () => {
        await commonAfterEach();
    });

    describe('Organization Merge Bundles', () => {
        test('Organization name merges properly', async () => {
            let resp = await request
                .get('/4_0_0/Organization')
                .set(getHeaders())
                .expect(200);
            expect(resp.body.length).toBe(0);
            console.log('------- response 1 ------------');
            console.log(JSON.stringify(resp.body, null, 2));
            console.log('------- end response 1 ------------');

            resp = await request
                .post('/4_0_0/Organization/1/$merge')
                .send(organizationBundleResourceInit)
                .set(getHeaders())
                .expect(200);
            console.log('------- response 2 ------------');
            console.log(JSON.stringify(resp.body, null, 2));
            console.log('------- end response 2  ------------');

            resp = await request
                .post('/4_0_0/Organization/1/$merge')
                .send(organizationBundleResourceUpdate)
                .set(getHeaders())
                .expect(200);

            console.log('------- response 3 ------------');
            console.log(JSON.stringify(resp.body, null, 2));
            console.log('------- end response 3  ------------');

            resp = await request
                .get('/4_0_0/Organization')
                .set(getHeaders())
                .expect(200);

            let body = resp.body;
            console.log('------- response 4 ------------');
            console.log(JSON.stringify(resp.body, null, 2));
            console.log('------- end response 4  ------------');
            expect(body.length).toBe(2);
            body.forEach(element => {
                delete element['meta']['lastUpdated'];
            });
            let expected = expectedOrganizationBundleResource;
            expected.forEach(element => {
                if ('meta' in element) {
                    delete element['meta']['lastUpdated'];
                }
                // element['meta'] = {'versionId': '1'};
                if ('$schema' in element) {
                    delete element['$schema'];
                }
            });
            expect(body).toStrictEqual(expected);
        });
    });
});
