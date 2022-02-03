const {processGraph} = require('../../../src/operations/graph/graphHelpers');
const {commonBeforeEach, commonAfterEach} = require('../common');
const globals = require('../../globals');
const {CLIENT_DB} = require('../../constants');
const graphSimpleReverseDefinition = require('./fixtures/graphSimpleReverse.json');
const graphSimpleForwardDefinition = require('./fixtures/graphSimpleForward.json');
const graphDefinition = require('./fixtures/graph.json');
const graphWithExtensionDefinition = require('./fixtures/graphWithExtension.json');
const graphSimpleWithExtensionDefinition = require('./fixtures/graphSimpleWithExtension.json');
const {RequestInfo} = require('../../utils/requestInfo');

describe('graphHelper Tests', () => {
    const base_version = '4_0_0';
    beforeEach(async () => {
        await commonBeforeEach();
        let db = globals.get(CLIENT_DB);
        let collection_name = 'Practitioner';
        let collection = db.collection(`${collection_name}_${base_version}`);

        await collection.insertOne({_id: '1', id: '1', resourceType: 'Practitioner'});
        // const doc = await collection.findOne({id: '1'});
    });

    afterEach(async () => {
        await commonAfterEach();
    });

    const requestInfo = new RequestInfo(
        'user',
        'user/*.read access/*.*',
        null,
        'https',
        null,
        null,
        'host',
        null
    );

    describe('graphHelper Tests', () => {
        test('graphHelper single Practitioner works', async () => {
            let db = globals.get(CLIENT_DB);
            let collection_name = 'Practitioner';
            const result = await processGraph(
                requestInfo,
                db,
                collection_name,
                base_version,
                collection_name,
                ['1'],
                graphSimpleReverseDefinition,
                false,
                false
            );
            expect(result).not.toBeNull();
            delete result['timestamp'];
            expect(result).toStrictEqual({
                'entry': [
                    {
                        'fullUrl': 'https://host/4_0_0/Practitioner/1',
                        'resource': {
                            'id': '1',
                            'resourceType': 'Practitioner'
                        }
                    }
                ],
                'id': 'bundle-example',
                'resourceType': 'Bundle',
                'type': 'collection'
            });
        });
        test('graphHelper multiple Practitioners works', async () => {
            let db = globals.get(CLIENT_DB);
            let collection_name = 'Practitioner';
            let collection = db.collection(`${collection_name}_${base_version}`);

            await collection.insertOne({_id: '2', id: '2', resourceType: 'Practitioner'});
            const result = await processGraph(
                requestInfo,
                db,
                collection_name,
                base_version,
                collection_name,
                ['1', '2'],
                graphSimpleReverseDefinition,
                false,
                false
            );
            expect(result).not.toBeNull();
            delete result['timestamp'];
            expect(result).toStrictEqual({
                'entry': [
                    {
                        'fullUrl': 'https://host/4_0_0/Practitioner/1',
                        'resource': {
                            'id': '1',
                            'resourceType': 'Practitioner'
                        }
                    },
                    {
                        'fullUrl': 'https://host/4_0_0/Practitioner/2',
                        'resource': {
                            'id': '2',
                            'resourceType': 'Practitioner'
                        }
                    }
                ],
                'id': 'bundle-example',
                'resourceType': 'Bundle',
                'type': 'collection'
            });
        });
        test('graphHelper simple single Practitioner with 1 level reverse nesting works', async () => {
            let db = globals.get(CLIENT_DB);
            let resourceType = 'PractitionerRole';
            let collection = db.collection(`${resourceType}_${base_version}`);
            await collection.insertOne(
                {_id: '10', id: '10', resourceType: resourceType, practitioner: {reference: 'Practitioner/1'}}
            );

            let collection_name = 'Practitioner';
            const result = await processGraph(
                requestInfo,
                db,
                collection_name,
                base_version,
                collection_name,
                ['1'],
                graphSimpleReverseDefinition,
                false,
                false
            );
            expect(result).not.toBeNull();
            delete result['timestamp'];
            expect(result).toStrictEqual({
                'entry': [
                    {
                        'fullUrl': 'https://host/4_0_0/Practitioner/1',
                        'resource': {
                            'id': '1',
                            'resourceType': 'Practitioner'
                        }
                    },
                    {
                        'fullUrl': 'https://host/4_0_0/PractitionerRole/10',
                        'resource': {
                            'id': '10',
                            'practitioner': {
                                'reference': 'Practitioner/1'
                            },
                            'resourceType': 'PractitionerRole'
                        }
                    }
                ],
                'id': 'bundle-example',
                'resourceType': 'Bundle',
                'type': 'collection'
            });
        });
        test('graphHelper single Practitioner with 1 level reverse nesting works', async () => {
            let db = globals.get(CLIENT_DB);
            let resourceType = 'PractitionerRole';
            let collection = db.collection(`${resourceType}_${base_version}`);
            await collection.insertOne(
                {_id: '10', id: '10', resourceType: resourceType, practitioner: {reference: 'Practitioner/1'}}
            );

            let collection_name = 'Practitioner';
            const result = await processGraph(
                requestInfo,
                db,
                collection_name,
                base_version,
                collection_name,
                ['1'],
                graphDefinition,
                false,
                false
            );
            expect(result).not.toBeNull();
            delete result['timestamp'];
            expect(result).toStrictEqual({
                'entry': [
                    {
                        'fullUrl': 'https://host/4_0_0/Practitioner/1',
                        'resource': {
                            'id': '1',
                            'resourceType': 'Practitioner'
                        }
                    },
                    {
                        'fullUrl': 'https://host/4_0_0/PractitionerRole/10',
                        'resource': {
                            'id': '10',
                            'practitioner': {
                                'reference': 'Practitioner/1'
                            },
                            'resourceType': 'PractitionerRole'
                        }
                    }
                ],
                'id': 'bundle-example',
                'resourceType': 'Bundle',
                'type': 'collection'
            });
        });
        test('graphHelper simple single Practitioner with 1 level nesting and contained works', async () => {
            let db = globals.get(CLIENT_DB);
            let resourceType = 'PractitionerRole';
            let collection = db.collection(`${resourceType}_${base_version}`);
            await collection.insertOne(
                {_id: '10', id: '10', resourceType: resourceType, practitioner: {reference: 'Practitioner/1'}}
            );

            let collection_name = 'Practitioner';
            const result = await processGraph(
                requestInfo,
                db,
                collection_name,
                base_version,
                collection_name,
                ['1'],
                graphSimpleReverseDefinition,
                true,
                false
            );
            expect(result).not.toBeNull();
            delete result['timestamp'];
            expect(result).toStrictEqual({
                'entry': [
                    {
                        'fullUrl': 'https://host/4_0_0/Practitioner/1',
                        'resource': {
                            'contained': [
                                {
                                    'id': '10',
                                    'practitioner': {
                                        'reference': 'Practitioner/1'
                                    },
                                    'resourceType': 'PractitionerRole'
                                }
                            ],
                            'id': '1',
                            'resourceType': 'Practitioner'
                        }
                    }
                ],
                'id': 'bundle-example',
                'resourceType': 'Bundle',
                'type': 'collection'
            });
        });
        test('graphHelper single Practitioner with 1 level nesting and contained works', async () => {
            let db = globals.get(CLIENT_DB);
            let resourceType = 'PractitionerRole';
            let collection = db.collection(`${resourceType}_${base_version}`);
            await collection.insertOne(
                {_id: '10', id: '10', resourceType: resourceType, practitioner: {reference: 'Practitioner/1'}}
            );

            let collection_name = 'Practitioner';
            const result = await processGraph(
                requestInfo,
                db,
                collection_name,
                base_version,
                collection_name,
                ['1'],
                graphDefinition,
                true,
                false
            );
            expect(result).not.toBeNull();
            delete result['timestamp'];
            expect(result).toStrictEqual({
                'entry': [
                    {
                        'fullUrl': 'https://host/4_0_0/Practitioner/1',
                        'resource': {
                            'contained': [
                                {
                                    'id': '10',
                                    'practitioner': {
                                        'reference': 'Practitioner/1'
                                    },
                                    'resourceType': 'PractitionerRole'
                                }
                            ],
                            'id': '1',
                            'resourceType': 'Practitioner'
                        }
                    }
                ],
                'id': 'bundle-example',
                'resourceType': 'Bundle',
                'type': 'collection'
            });
        });
        test('graphHelper simple single Practitioner with 1 level forward nesting works', async () => {
            let db = globals.get(CLIENT_DB);
            // add a PractitionerRole
            let resourceType = 'PractitionerRole';
            let collection = db.collection(`${resourceType}_${base_version}`);
            await collection.insertOne(
                {
                    _id: '10',
                    id: '10',
                    resourceType: resourceType,
                    practitioner: {
                        reference: 'Practitioner/1'
                    },
                    organization: {
                        reference: 'Organization/100'
                    }
                }
            );
            // add an Organization
            resourceType = 'Organization';
            collection = db.collection(`${resourceType}_${base_version}`);
            await collection.insertOne(
                {_id: '100', id: '100', resourceType: resourceType}
            );

            let collection_name = 'PractitionerRole';
            const result = await processGraph(
                requestInfo,
                db,
                collection_name,
                base_version,
                collection_name,
                ['10'],
                graphSimpleForwardDefinition,
                false,
                false
            );
            expect(result).not.toBeNull();
            delete result['timestamp'];
            expect(result).toStrictEqual({
                'entry': [
                    {
                        'fullUrl': 'https://host/4_0_0/PractitionerRole/10',
                        'resource': {
                            'id': '10',
                            'organization': {
                                'reference': 'Organization/100'
                            },
                            'practitioner': {
                                'reference': 'Practitioner/1'
                            },
                            'resourceType': 'PractitionerRole'
                        }
                    },
                    {
                        'fullUrl': 'https://host/4_0_0/Organization/100',
                        'resource': {
                            'id': '100',
                            'resourceType': 'Organization'
                        }
                    }
                ],
                'id': 'bundle-example',
                'resourceType': 'Bundle',
                'type': 'collection'
            });
        });
        test('graphHelper single Practitioner with 1 level nesting and contained and hash_references works', async () => {
            let db = globals.get(CLIENT_DB);
            let resourceType = 'PractitionerRole';
            let collection = db.collection(`${resourceType}_${base_version}`);
            await collection.insertOne(
                {_id: '10', id: '10', resourceType: resourceType, practitioner: {reference: 'Practitioner/1'}}
            );

            let collection_name = 'Practitioner';
            const result = await processGraph(
                requestInfo,
                db,
                collection_name,
                base_version,
                collection_name,
                ['1'],
                graphSimpleReverseDefinition,
                true,
                true
            );
            expect(result).not.toBeNull();
            delete result['timestamp'];
            expect(result).toStrictEqual({
                'entry': [
                    {
                        'fullUrl': 'https://host/4_0_0/Practitioner/1',
                        'resource': {
                            'contained': [
                                {
                                    'id': '10',
                                    'practitioner': {
                                        'reference': 'Practitioner/1'
                                    },
                                    'resourceType': 'PractitionerRole'
                                }
                            ],
                            'id': '1',
                            'resourceType': 'Practitioner'
                        }
                    }
                ],
                'id': 'bundle-example',
                'resourceType': 'Bundle',
                'type': 'collection'
            });
        });
        test('graphHelper single Practitioner with 2 level nesting works', async () => {
            let db = globals.get(CLIENT_DB);
            // add a PractitionerRole
            let resourceType = 'PractitionerRole';
            let collection = db.collection(`${resourceType}_${base_version}`);
            await collection.insertOne(
                {
                    _id: '10',
                    id: '10',
                    resourceType: resourceType,
                    practitioner: {
                        reference: 'Practitioner/1'
                    },
                    organization: {
                        reference: 'Organization/100'
                    }
                }
            );
            // add an Organization
            resourceType = 'Organization';
            collection = db.collection(`${resourceType}_${base_version}`);
            await collection.insertOne(
                {_id: '100', id: '100', resourceType: resourceType}
            );

            let collection_name = 'Practitioner';
            const result = await processGraph(
                requestInfo,
                db,
                collection_name,
                base_version,
                collection_name,
                ['1'],
                graphDefinition,
                false,
                false
            );
            expect(result).not.toBeNull();
            delete result['timestamp'];
            expect(result).toStrictEqual({
                'entry': [
                    {
                        'fullUrl': 'https://host/4_0_0/Practitioner/1',
                        'resource': {
                            'id': '1',
                            'resourceType': 'Practitioner'
                        }
                    },
                    {
                        'fullUrl': 'https://host/4_0_0/PractitionerRole/10',
                        'resource': {
                            'id': '10',
                            'organization': {
                                'reference': 'Organization/100'
                            },
                            'practitioner': {
                                'reference': 'Practitioner/1'
                            },
                            'resourceType': 'PractitionerRole'
                        }
                    },
                    {
                        'fullUrl': 'https://host/4_0_0/Organization/100',
                        'resource': {
                            'id': '100',
                            'resourceType': 'Organization'
                        }
                    }
                ],
                'id': 'bundle-example',
                'resourceType': 'Bundle',
                'type': 'collection'
            });
        });
        test('graphHelper multiple Practitioners with 2 level nesting works', async () => {
            let db = globals.get(CLIENT_DB);
            let resourceType = 'Practitioner';
            let collection = db.collection(`${resourceType}_${base_version}`);
            await collection.insertOne({_id: '2', id: '2', resourceType: 'Practitioner'});

            // add a PractitionerRole
            resourceType = 'PractitionerRole';
            collection = db.collection(`${resourceType}_${base_version}`);
            await collection.insertOne(
                {
                    _id: '10',
                    id: '10',
                    resourceType: resourceType,
                    practitioner: {
                        reference: 'Practitioner/1'
                    },
                    organization: {
                        reference: 'Organization/100'
                    }
                }
            );
            await collection.insertOne(
                {
                    _id: '20',
                    id: '20',
                    resourceType: resourceType,
                    practitioner: {
                        reference: 'Practitioner/2'
                    },
                    organization: {
                        reference: 'Organization/200'
                    }
                }
            );
            // add an Organization
            resourceType = 'Organization';
            collection = db.collection(`${resourceType}_${base_version}`);
            await collection.insertOne(
                {_id: '100', id: '100', resourceType: resourceType}
            );
            await collection.insertOne(
                {_id: '200', id: '200', resourceType: resourceType}
            );

            let collection_name = 'Practitioner';
            const result = await processGraph(
                requestInfo,
                db,
                collection_name,
                base_version,
                collection_name,
                ['1', '2'],
                graphDefinition,
                false,
                false
            );
            expect(result).not.toBeNull();
            delete result['timestamp'];
            expect(result).toStrictEqual({
                'entry': [
                    {
                        'fullUrl': 'https://host/4_0_0/Practitioner/1',
                        'resource': {
                            'id': '1',
                            'resourceType': 'Practitioner'
                        }
                    },
                    {
                        'fullUrl': 'https://host/4_0_0/Practitioner/2',
                        'resource': {
                            'id': '2',
                            'resourceType': 'Practitioner'
                        }
                    },
                    {
                        'fullUrl': 'https://host/4_0_0/PractitionerRole/10',
                        'resource': {
                            'id': '10',
                            'organization': {
                                'reference': 'Organization/100'
                            },
                            'practitioner': {
                                'reference': 'Practitioner/1'
                            },
                            'resourceType': 'PractitionerRole'
                        }
                    },
                    {
                        'fullUrl': 'https://host/4_0_0/Organization/100',
                        'resource': {
                            'id': '100',
                            'resourceType': 'Organization'
                        }
                    },
                    {
                        'fullUrl': 'https://host/4_0_0/PractitionerRole/20',
                        'resource': {
                            'id': '20',
                            'organization': {
                                'reference': 'Organization/200'
                            },
                            'practitioner': {
                                'reference': 'Practitioner/2'
                            },
                            'resourceType': 'PractitionerRole'
                        }
                    },
                    {
                        'fullUrl': 'https://host/4_0_0/Organization/200',
                        'resource': {
                            'id': '200',
                            'resourceType': 'Organization'
                        }
                    }
                ],
                'id': 'bundle-example',
                'resourceType': 'Bundle',
                'type': 'collection'
            });
        });
        test('graphHelper multiple Practitioners with 2 level nesting and contained works', async () => {
            let db = globals.get(CLIENT_DB);
            let resourceType = 'Practitioner';
            let collection = db.collection(`${resourceType}_${base_version}`);
            await collection.insertOne({_id: '2', id: '2', resourceType: 'Practitioner'});

            // add a PractitionerRole
            resourceType = 'PractitionerRole';
            collection = db.collection(`${resourceType}_${base_version}`);
            await collection.insertOne(
                {
                    _id: '10',
                    id: '10',
                    resourceType: resourceType,
                    practitioner: {
                        reference: 'Practitioner/1'
                    },
                    organization: {
                        reference: 'Organization/100'
                    }
                }
            );
            await collection.insertOne(
                {
                    _id: '20',
                    id: '20',
                    resourceType: resourceType,
                    practitioner: {
                        reference: 'Practitioner/2'
                    },
                    organization: {
                        reference: 'Organization/200'
                    }
                }
            );
            // add an Organization
            resourceType = 'Organization';
            collection = db.collection(`${resourceType}_${base_version}`);
            await collection.insertOne(
                {_id: '100', id: '100', resourceType: resourceType}
            );
            await collection.insertOne(
                {_id: '200', id: '200', resourceType: resourceType}
            );

            let collection_name = 'Practitioner';
            const result = await processGraph(
                requestInfo,
                db,
                collection_name,
                base_version,
                collection_name,
                ['1', '2'],
                graphDefinition,
                true,
                false
            );
            expect(result).not.toBeNull();
            delete result['timestamp'];
            expect(result).toStrictEqual({
                'entry': [
                    {
                        'fullUrl': 'https://host/4_0_0/Practitioner/1',
                        'resource': {
                            'contained': [
                                {
                                    'id': '10',
                                    'organization': {
                                        'reference': 'Organization/100'
                                    },
                                    'practitioner': {
                                        'reference': 'Practitioner/1'
                                    },
                                    'resourceType': 'PractitionerRole'
                                },
                                {
                                    'id': '100',
                                    'resourceType': 'Organization'
                                }
                            ],
                            'id': '1',
                            'resourceType': 'Practitioner'
                        }
                    },
                    {
                        'fullUrl': 'https://host/4_0_0/Practitioner/2',
                        'resource': {
                            'contained': [
                                {
                                    'id': '20',
                                    'organization': {
                                        'reference': 'Organization/200'
                                    },
                                    'practitioner': {
                                        'reference': 'Practitioner/2'
                                    },
                                    'resourceType': 'PractitionerRole'
                                },
                                {
                                    'id': '200',
                                    'resourceType': 'Organization'
                                }
                            ],
                            'id': '2',
                            'resourceType': 'Practitioner'
                        }
                    }
                ],
                'id': 'bundle-example',
                'resourceType': 'Bundle',
                'type': 'collection'
            });
        });
        test('graphHelper simple single Practitioner with 1 level nesting and extension works', async () => {
            let db = globals.get(CLIENT_DB);
            // add a PractitionerRole
            let resourceType = 'PractitionerRole';
            let collection = db.collection(`${resourceType}_${base_version}`);
            await collection.insertOne(
                {
                    _id: '10',
                    id: '10',
                    resourceType: resourceType,
                    practitioner: {
                        reference: 'Practitioner/1'
                    },
                    organization: {
                        reference: 'Organization/100'
                    },
                    extension: [
                        {
                            'id': 'IDHP',
                            'extension': [
                                {
                                    'url': 'for_system',
                                    'valueUri': 'http://medstarhealth.org/IDHP'
                                },
                                {
                                    'url': 'availability_score',
                                    'valueDecimal': 0.1234567890123
                                }
                            ],
                            'url': 'https://raw.githubusercontent.com/imranq2/SparkAutoMapper.FHIR/main/StructureDefinition/provider_search'
                        },
                        {
                            'extension': [
                                {
                                    'url': 'plan',
                                    'valueReference': {
                                        'reference': 'InsurancePlan/AETNA-Aetna-Elect-Choice--EPO--Aetna-Health-Fund--Innovation-He'
                                    }
                                }
                            ],
                            'url': 'https://raw.githubusercontent.com/imranq2/SparkAutoMapper.FHIR/main/StructureDefinition/insurance_plan'
                        }
                    ]
                }
            );
            // add an InsurancePlan
            resourceType = 'InsurancePlan';
            collection = db.collection(`${resourceType}_${base_version}`);
            await collection.insertOne(
                {
                    _id: 'AETNA-Aetna-Elect-Choice--EPO--Aetna-Health-Fund--Innovation-He',
                    id: 'AETNA-Aetna-Elect-Choice--EPO--Aetna-Health-Fund--Innovation-He',
                    resourceType: resourceType
                }
            );

            let collection_name = 'PractitionerRole';
            const result = await processGraph(
                requestInfo,
                db,
                collection_name,
                base_version,
                collection_name,
                ['10'],
                graphSimpleWithExtensionDefinition,
                false,
                false
            );
            expect(result).not.toBeNull();
            delete result['timestamp'];
            expect(result).toStrictEqual({
                'entry': [
                    {
                        'fullUrl': 'https://host/4_0_0/PractitionerRole/10',
                        'resource': {
                            'extension': [
                                {
                                    'extension': [
                                        {
                                            'url': 'for_system',
                                            'valueUri': 'http://medstarhealth.org/IDHP'
                                        },
                                        {
                                            'url': 'availability_score',
                                            'valueDecimal': 0.1234567890123
                                        }
                                    ],
                                    'id': 'IDHP',
                                    'url': 'https://raw.githubusercontent.com/imranq2/SparkAutoMapper.FHIR/main/StructureDefinition/provider_search'
                                },
                                {
                                    'extension': [
                                        {
                                            'url': 'plan',
                                            'valueReference': {
                                                'reference': 'InsurancePlan/AETNA-Aetna-Elect-Choice--EPO--Aetna-Health-Fund--Innovation-He'
                                            }
                                        }
                                    ],
                                    'url': 'https://raw.githubusercontent.com/imranq2/SparkAutoMapper.FHIR/main/StructureDefinition/insurance_plan'
                                }
                            ],
                            'id': '10',
                            'organization': {
                                'reference': 'Organization/100'
                            },
                            'practitioner': {
                                'reference': 'Practitioner/1'
                            },
                            'resourceType': 'PractitionerRole'
                        }
                    },
                    {
                        'fullUrl': 'https://host/4_0_0/InsurancePlan/AETNA-Aetna-Elect-Choice--EPO--Aetna-Health-Fund--Innovation-He',
                        'resource': {
                            'id': 'AETNA-Aetna-Elect-Choice--EPO--Aetna-Health-Fund--Innovation-He',
                            'resourceType': 'InsurancePlan'
                        }
                    }
                ],
                'id': 'bundle-example',
                'resourceType': 'Bundle',
                'type': 'collection'
            });
        });
        test('graphHelper multiple Practitioners with 2 level nesting and extension works', async () => {
            let db = globals.get(CLIENT_DB);
            let resourceType = 'Practitioner';
            let collection = db.collection(`${resourceType}_${base_version}`);
            await collection.insertOne({
                _id: '2', id: '2', resourceType: 'Practitioner', extension: [
                    {
                        extension: {
                            url: 'plan',
                            valueReference: {
                                reference: 'InsurancePlan/2000'
                            }
                        }
                    }
                ]
            });

            // add a PractitionerRole
            resourceType = 'PractitionerRole';
            collection = db.collection(`${resourceType}_${base_version}`);
            await collection.insertOne(
                {
                    _id: '10',
                    id: '10',
                    resourceType: resourceType,
                    practitioner: {
                        reference: 'Practitioner/1'
                    },
                    organization: {
                        reference: 'Organization/100'
                    },
                    extension: [
                        {
                            'id': 'IDHP',
                            'extension': [
                                {
                                    'url': 'for_system',
                                    'valueUri': 'http://medstarhealth.org/IDHP'
                                },
                                {
                                    'url': 'availability_score',
                                    'valueDecimal': 0.1234567890123
                                }
                            ],
                            'url': 'https://raw.githubusercontent.com/imranq2/SparkAutoMapper.FHIR/main/StructureDefinition/provider_search'
                        },
                        {
                            'extension': [
                                {
                                    'url': 'plan',
                                    'valueReference': {
                                        'reference': 'InsurancePlan/AETNA-Aetna-Elect-Choice--EPO--Aetna-Health-Fund--Innovation-He'
                                    }
                                }
                            ],
                            'url': 'https://raw.githubusercontent.com/imranq2/SparkAutoMapper.FHIR/main/StructureDefinition/insurance_plan'
                        }
                    ]
                }
            );
            await collection.insertOne(
                {
                    _id: '20',
                    id: '20',
                    resourceType: resourceType,
                    practitioner: {
                        reference: 'Practitioner/2'
                    },
                    organization: {
                        reference: 'Organization/200'
                    }
                }
            );
            // add an Organization
            resourceType = 'Organization';
            collection = db.collection(`${resourceType}_${base_version}`);
            await collection.insertOne(
                {_id: '100', id: '100', resourceType: resourceType}
            );
            await collection.insertOne(
                {_id: '200', id: '200', resourceType: resourceType}
            );

            // add an InsurancePlan
            resourceType = 'InsurancePlan';
            collection = db.collection(`${resourceType}_${base_version}`);
            await collection.insertOne(
                {
                    _id: 'AETNA-Aetna-Elect-Choice--EPO--Aetna-Health-Fund--Innovation-He',
                    id: 'AETNA-Aetna-Elect-Choice--EPO--Aetna-Health-Fund--Innovation-He',
                    resourceType: resourceType
                }
            );

            let collection_name = 'Practitioner';
            const result = await processGraph(
                requestInfo,
                db,
                collection_name,
                base_version,
                collection_name,
                ['1', '2'],
                graphWithExtensionDefinition,
                false,
                false
            );
            expect(result).not.toBeNull();
            delete result['timestamp'];
            expect(result).toStrictEqual({
                'entry': [
                    {
                        'fullUrl': 'https://host/4_0_0/Practitioner/1',
                        'resource': {
                            'id': '1',
                            'resourceType': 'Practitioner'
                        }
                    },
                    {
                        'fullUrl': 'https://host/4_0_0/Practitioner/2',
                        'resource': {
                            'extension': [
                                {
                                    'extension': [
                                        {
                                            'url': 'plan',
                                            'valueReference': {
                                                'reference': 'InsurancePlan/2000'
                                            }
                                        }
                                    ]
                                }
                            ],
                            'id': '2',
                            'resourceType': 'Practitioner'
                        }
                    },
                    {
                        'fullUrl': 'https://host/4_0_0/PractitionerRole/10',
                        'resource': {
                            'extension': [
                                {
                                    'extension': [
                                        {
                                            'url': 'for_system',
                                            'valueUri': 'http://medstarhealth.org/IDHP'
                                        },
                                        {
                                            'url': 'availability_score',
                                            'valueDecimal': 0.1234567890123
                                        }
                                    ],
                                    'id': 'IDHP',
                                    'url': 'https://raw.githubusercontent.com/imranq2/SparkAutoMapper.FHIR/main/StructureDefinition/provider_search'
                                },
                                {
                                    'extension': [
                                        {
                                            'url': 'plan',
                                            'valueReference': {
                                                'reference': 'InsurancePlan/AETNA-Aetna-Elect-Choice--EPO--Aetna-Health-Fund--Innovation-He'
                                            }
                                        }
                                    ],
                                    'url': 'https://raw.githubusercontent.com/imranq2/SparkAutoMapper.FHIR/main/StructureDefinition/insurance_plan'
                                }
                            ],
                            'id': '10',
                            'organization': {
                                'reference': 'Organization/100'
                            },
                            'practitioner': {
                                'reference': 'Practitioner/1'
                            },
                            'resourceType': 'PractitionerRole'
                        }
                    },
                    {
                        'fullUrl': 'https://host/4_0_0/Organization/100',
                        'resource': {
                            'id': '100',
                            'resourceType': 'Organization'
                        }
                    },
                    {
                        'fullUrl': 'https://host/4_0_0/InsurancePlan/AETNA-Aetna-Elect-Choice--EPO--Aetna-Health-Fund--Innovation-He',
                        'resource': {
                            'id': 'AETNA-Aetna-Elect-Choice--EPO--Aetna-Health-Fund--Innovation-He',
                            'resourceType': 'InsurancePlan'
                        }
                    },
                    {
                        'fullUrl': 'https://host/4_0_0/PractitionerRole/20',
                        'resource': {
                            'id': '20',
                            'organization': {
                                'reference': 'Organization/200'
                            },
                            'practitioner': {
                                'reference': 'Practitioner/2'
                            },
                            'resourceType': 'PractitionerRole'
                        }
                    },
                    {
                        'fullUrl': 'https://host/4_0_0/Organization/200',
                        'resource': {
                            'id': '200',
                            'resourceType': 'Organization'
                        }
                    }
                ],
                'id': 'bundle-example',
                'resourceType': 'Bundle',
                'type': 'collection'
            });
        });
        test('graphHelper multiple Practitioners with 2 level nesting and extension and contained works', async () => {
            let db = globals.get(CLIENT_DB);
            let resourceType = 'Practitioner';
            let collection = db.collection(`${resourceType}_${base_version}`);
            await collection.insertOne({
                _id: '2', id: '2', resourceType: 'Practitioner', extension: [
                    {
                        extension: {
                            url: 'plan',
                            valueReference: {
                                reference: 'InsurancePlan/2000'
                            }
                        }
                    }
                ]
            });

            // add a PractitionerRole
            resourceType = 'PractitionerRole';
            collection = db.collection(`${resourceType}_${base_version}`);
            await collection.insertOne(
                {
                    _id: '10',
                    id: '10',
                    resourceType: resourceType,
                    practitioner: {
                        reference: 'Practitioner/1'
                    },
                    organization: {
                        reference: 'Organization/100'
                    },
                    'extension': [
                        {
                            'id': 'IDHP',
                            'extension': [
                                {
                                    'url': 'for_system',
                                    'valueUri': 'http://medstarhealth.org/IDHP'
                                },
                                {
                                    'url': 'availability_score',
                                    'valueDecimal': 0.1234567890123
                                }
                            ],
                            'url': 'https://raw.githubusercontent.com/imranq2/SparkAutoMapper.FHIR/main/StructureDefinition/provider_search'
                        },
                        {
                            'extension': [
                                {
                                    'url': 'plan',
                                    'valueReference': {
                                        'reference': 'InsurancePlan/AETNA-Aetna-Elect-Choice--EPO--Aetna-Health-Fund--Innovation-He'
                                    }
                                }
                            ],
                            'url': 'https://raw.githubusercontent.com/imranq2/SparkAutoMapper.FHIR/main/StructureDefinition/insurance_plan'
                        }
                    ]
                }
            );
            await collection.insertOne(
                {
                    _id: '20',
                    id: '20',
                    resourceType: resourceType,
                    practitioner: {
                        reference: 'Practitioner/2'
                    },
                    organization: {
                        reference: 'Organization/200'
                    }
                }
            );
            // add an Organization
            resourceType = 'Organization';
            collection = db.collection(`${resourceType}_${base_version}`);
            await collection.insertOne(
                {_id: '100', id: '100', resourceType: resourceType}
            );
            await collection.insertOne(
                {_id: '200', id: '200', resourceType: resourceType}
            );

            // add an InsurancePlan
            resourceType = 'InsurancePlan';
            collection = db.collection(`${resourceType}_${base_version}`);
            await collection.insertOne(
                {
                    _id: 'AETNA-Aetna-Elect-Choice--EPO--Aetna-Health-Fund--Innovation-He',
                    id: 'AETNA-Aetna-Elect-Choice--EPO--Aetna-Health-Fund--Innovation-He',
                    resourceType: resourceType
                }
            );
            let collection_name = 'Practitioner';
            const result = await processGraph(
                requestInfo,
                db,
                collection_name,
                base_version,
                collection_name,
                ['1', '2'],
                graphWithExtensionDefinition,
                true,
                false
            );
            expect(result).not.toBeNull();
            delete result['timestamp'];
            expect(result).toStrictEqual({
                'entry': [
                    {
                        'fullUrl': 'https://host/4_0_0/Practitioner/1',
                        'resource': {
                            'contained': [
                                {
                                    'extension': [
                                        {
                                            'extension': [
                                                {
                                                    'url': 'for_system',
                                                    'valueUri': 'http://medstarhealth.org/IDHP'
                                                },
                                                {
                                                    'url': 'availability_score',
                                                    'valueDecimal': 0.1234567890123
                                                }
                                            ],
                                            'id': 'IDHP',
                                            'url': 'https://raw.githubusercontent.com/imranq2/SparkAutoMapper.FHIR/main/StructureDefinition/provider_search'
                                        },
                                        {
                                            'extension': [
                                                {
                                                    'url': 'plan',
                                                    'valueReference': {
                                                        'reference': 'InsurancePlan/AETNA-Aetna-Elect-Choice--EPO--Aetna-Health-Fund--Innovation-He'
                                                    }
                                                }
                                            ],
                                            'url': 'https://raw.githubusercontent.com/imranq2/SparkAutoMapper.FHIR/main/StructureDefinition/insurance_plan'
                                        }
                                    ],
                                    'id': '10',
                                    'organization': {
                                        'reference': 'Organization/100'
                                    },
                                    'practitioner': {
                                        'reference': 'Practitioner/1'
                                    },
                                    'resourceType': 'PractitionerRole'
                                },
                                {
                                    'id': '100',
                                    'resourceType': 'Organization'
                                },
                                {
                                    'id': 'AETNA-Aetna-Elect-Choice--EPO--Aetna-Health-Fund--Innovation-He',
                                    'resourceType': 'InsurancePlan'
                                }
                            ],
                            'id': '1',
                            'resourceType': 'Practitioner'
                        }
                    },
                    {
                        'fullUrl': 'https://host/4_0_0/Practitioner/2',
                        'resource': {
                            'contained': [
                                {
                                    'id': '20',
                                    'organization': {
                                        'reference': 'Organization/200'
                                    },
                                    'practitioner': {
                                        'reference': 'Practitioner/2'
                                    },
                                    'resourceType': 'PractitionerRole'
                                },
                                {
                                    'id': '200',
                                    'resourceType': 'Organization'
                                }
                            ],
                            'extension': [
                                {
                                    'extension': [
                                        {
                                            'url': 'plan',
                                            'valueReference': {
                                                'reference': 'InsurancePlan/2000'
                                            }
                                        }
                                    ]
                                }
                            ],
                            'id': '2',
                            'resourceType': 'Practitioner'
                        }
                    }
                ],
                'id': 'bundle-example',
                'resourceType': 'Bundle',
                'type': 'collection'
            });
        });
    });
});
