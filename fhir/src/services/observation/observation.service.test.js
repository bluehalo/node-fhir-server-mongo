/* eslint-disable */
const ObservationFixture = require('../../../fixtures/data/patient01/smokingstatus01.json');
const { CLIENT, CLIENT_DB } = require('../../constants');
const observationService = require('./observation.service');
const asyncHandler = require('../../lib/async-handler');
const logger = require('../../testutils/logger.mock');
const { mongoConfig } = require('../../config');
const mongoClient = require('../../lib/mongo');
let globals = require('../../globals');

describe('Observation Service Test', () => {

	beforeAll(async () => {
		let [ err, client ] = await asyncHandler(
			mongoClient(mongoConfig.connection, mongoConfig.options)
		);

		// We should fail these tests if we can't connect,
		// they won't work without the connection
		if (err) { throw err; }

		globals.set(CLIENT, client);
		globals.set(CLIENT_DB, client.db(mongoConfig.db_name));

	});

	afterAll(() => {
		let client = globals.get(CLIENT);
		client.close();
	});

	describe('Method: count', () => {

		test('should correctly pass back the count', async () => {
			let [ err, results ] = await asyncHandler(
				observationService.count(null, logger)
			);

			expect(err).toBeUndefined();
			expect(results).toEqual(61);
		});

	});

	describe('Method: search', () => {

		test('should correctly return all laboratory documents for this patient', async () => {
			let args = { patient: '1', category: 'laboratory' };
            let contexts = {};
			let [ err, docs ] = await asyncHandler(
				observationService.search(args, contexts, logger)
			);

			expect(err).toBeUndefined();
			expect(docs.length).toEqual(4);

			docs.forEach(doc => {
			 expect(doc.subject.reference).toEqual(`Patient/${args.patient}`);
			 expect(doc.category.coding[0].code).toEqual(args.category);
			});

		});

        test('should correctly return a specific observation using all non-logic search parameters', async () => {
            let args = { _id: '0', basedOn: 'example', category: 'http://hl7.org/fhir/observation-category|', code: 'http://snomed.info/sct|27113001',
                componentCode: 'http://loinc.org|', componentDataAbsentReason: '|not-performed', componentValueCodeableConcept: 'http://loinc.org|8462-4',
                componentValueQuantity: '60|http://unitsofmeasure.org|mm[Hg]', context: 'Encounter/example', dataAbsentReason: 'not-performed',
				date: '2016-03-28', device: 'DeviceMetric/example', encounter: 'Encounter/example', identifier: 'urn:ietf:rfc:3986|',
                method: 'http://snomed.info/sct|', patient: 'Patient/example', performer: 'Practitioner/f201', relatedTarget: '#verbal',
                relatedType: 'derived-from', specimen: 'Specimen/genetics-example1-somatic', status: 'final', subject: 'Patient/example',
                valueCodeableConcept: '4', valueQuantity: '185|http://unitsofmeasure.org|[lb_av]', valueString: 'Exon 21', valueDate:'2016-03-28'};
            let contexts = {};
            let [ err, docs ] = await asyncHandler(
                observationService.search(args, contexts, logger)
            );

            // console.log(JSON.stringify(docs));

            expect(err).toBeUndefined();
            expect(docs.length).toEqual(1);

            docs.forEach(doc => {
                expect(doc.id).toEqual(args._id);
                expect(doc.basedOn[0].reference).toEqual('CarePlan/example');
                expect(doc.category[0].coding[0].system).toEqual('http://hl7.org/fhir/observation-category');
                expect(doc.category[0].coding[0].code).toEqual('vital-signs');
                expect(doc.code.coding[2].system).toEqual('http://snomed.info/sct');
                expect(doc.code.coding[2].code).toEqual('27113001');
                expect(doc.component[0].code.coding[0].system).toEqual('http://loinc.org');
                expect(doc.component[0].code.coding[0].code).toEqual('8480-6');
                expect(doc.component[1].dataAbsentReason.coding[0].system).toEqual('http://hl7.org/fhir/data-absent-reason');
                expect(doc.component[1].dataAbsentReason.coding[0].code).toEqual('not-performed');
                expect(doc.component[1].valueCodeableConcept.coding[0].system).toEqual('http://loinc.org');
                expect(doc.component[1].valueCodeableConcept.coding[0].code).toEqual('8462-4');
                expect(doc.component[1].valueQuantity.value).toEqual(60);
                expect(doc.component[1].valueQuantity.system).toEqual('http://unitsofmeasure.org');
                expect(doc.component[1].valueQuantity.unit).toEqual('mmHg');
                expect(doc.context.reference).toEqual('Encounter/example');
                expect(doc.dataAbsentReason.coding[0].system).toEqual('http://hl7.org/fhir/data-absent-reason');
                expect(doc.dataAbsentReason.coding[0].code).toEqual('not-performed');
                expect(doc.effectiveDateTime).toEqual(args.date);
                expect(doc.device.reference).toEqual(args.device);
                expect(doc.context.reference).toEqual(args.encounter);
                expect(doc.identifier[0].system).toEqual('urn:ietf:rfc:3986');
                expect(doc.identifier[0].value).toEqual('urn:uuid:187e0c12-8dd2-67e2-99b2-bf273c878281');
                expect(doc.method.coding[0].system).toEqual('http://snomed.info/sct');
                expect(doc.method.coding[0].code).toEqual('89003005');
                expect(doc.subject.reference).toEqual(args.patient);
                expect(doc.performer[0].reference).toEqual('Practitioner/f201');
                expect(doc.related[1].target.reference).toEqual('#verbal');
                expect(doc.related[0].type).toEqual('derived-from');
                expect(doc.specimen.reference).toEqual(args.specimen);
                expect(doc.status).toEqual(args.status);
                expect(doc.subject.reference).toEqual('Patient/example');
                expect(doc.valueCodeableConcept.coding[0].system).toEqual('http:/acme.ec/gcseye');
                expect(doc.valueCodeableConcept.coding[0].code).toEqual('4');
                expect(doc.valueQuantity.value).toEqual(185);
                expect(doc.valueQuantity.system).toEqual('http://unitsofmeasure.org');
                expect(doc.valueQuantity.unit).toEqual('lbs');
                expect(doc.valueString).toEqual(args.valueString);
            })

        });

        test('should correctly return an observation using or searches', async () => {
            let args = { comboCode: 'http://loinc.org|29463-7', comboDataAbsentReason: 'http://hl7.org/fhir/data-absent-reason|not-performed',
				comboValueConcept: 'http:/acme.ec/gcseye|4', comboValueQuantity: '60|http://unitsofmeasure.org|mm[Hg]' };
            let contexts = {};
            let [ err, docs ] = await asyncHandler(
                observationService.search(args, contexts, logger)
            );

            expect(err).toBeUndefined();
            expect(docs.length).toEqual(1);

            docs.forEach(doc => {
                expect(doc.code.coding[0].system).toEqual('http://loinc.org');
                expect(doc.code.coding[0].code).toEqual('29463-7');
                expect(doc.component[1].dataAbsentReason.coding[0].system).toEqual('http://hl7.org/fhir/data-absent-reason');
                expect(doc.component[1].dataAbsentReason.coding[0].code).toEqual('not-performed');
                expect(doc.dataAbsentReason.coding[0].system).toEqual('http://hl7.org/fhir/data-absent-reason');
                expect(doc.dataAbsentReason.coding[0].code).toEqual('not-performed');
                expect(doc.valueCodeableConcept.coding[0].system).toEqual('http:/acme.ec/gcseye');
                expect(doc.valueCodeableConcept.coding[0].code).toEqual('4');
                expect(doc.component[1].valueQuantity.value).toEqual(60);
                expect(doc.component[1].valueQuantity.system).toEqual('http://unitsofmeasure.org');
                expect(doc.component[1].valueQuantity.unit).toEqual('mmHg');
            });

        });

        test('should correctly return an observation using composite searches', async () => {
            let args = { codeValueConcept: 'http://loinc.org|3141-9$http:/acme.ec/gcseye|4', codeValueDate: 'http://loinc.org|3141-9$2016-03-28',
				codeValueQuantity: 'http://loinc.org|3141-9$185', codeValueString: 'http://loinc.org|3141-9$Exon 21',
				comboCodeValueConcept: 'http://loinc.org|3141-9$http:/acme.ec/gcseye|4', comboCodeValueQuantity: 'http://loinc.org|$60||mm[Hg]',
				componentCodeValueConcept: 'http://loinc.org|8480-6$http://loinc.org|8462-4', componentCodeValueQuantity: '8480-6$60',
				related: 'derived-from$#verbal' };
            let contexts = {};
            let [ err, docs ] = await asyncHandler(
                observationService.search(args, contexts, logger)
            );

            expect(err).toBeUndefined();
            expect(docs.length).toEqual(1);

            docs.forEach(doc => {
                // expect(doc.code.coding[0].system).toEqual('http://loinc.org');
                // expect(doc.code.coding[0].code).toEqual('29463-7');
            });

        });

	});

	describe('Method: searchById', () => {

		test('should correctly return a document', async () => {
			let args = { id: '8' };
            let contexts = {};
			let [ err, doc ] = await asyncHandler(
				observationService.searchById(args, contexts, logger)
			);

			expect(err).toBeUndefined();
			expect(doc.id).toEqual(args.id);
		});

	});

	describe('Method: remove', () => {

		// For these tests, let's do it in 3 steps
		// 1. Check the observation exists
		// 2. Delete an observation and make sure it does not throw
		// 3. Check the observation does not exist

		test('should successfully delete a document', async () => {

			// Look for this particular fixture
			let args = { id: '1' };
            let contexts = {};
			let [ err, doc ] = await asyncHandler(
				observationService.searchById(args, contexts, logger)
			);

			expect(err).toBeUndefined();
			expect(doc.id).toEqual(args.id);

			// Now delete this fixture
			let [ delete_err, _ ] = await asyncHandler(
				observationService.remove(args, logger)
			);

			// There is no response resolved from this promise, so just check for an error
			expect(delete_err).toBeUndefined();

			// Now query for the fixture again, there should be no documents
			let [ query_err, missing_doc ] = await asyncHandler(
				observationService.searchById(args, contexts, logger)
			);

			expect(query_err).toBeUndefined();
			expect(missing_doc).toBeNull();

		});

	});

	describe('Method: create', () => {

		// This Fixture was previously deleted, we are going to ensure before creating it
		// 1. Delete fixture
		// 2. Create fixture
		// 3. Query for fixture

		test('should successfully create a document', async () => {

			// Look for this particular fixture
			let args = {
				resource: {
					toJSON: () => ObservationFixture
				},
				id: '1'
			};
            let contexts = {};

			// Delete the fixture incase it exists,
			// mongo won't throw if we delete something not there
			let [ delete_err, _ ] = await asyncHandler(
				observationService.remove(args, logger)
			);

			expect(delete_err).toBeUndefined();

			// Create the fixture, it expects two very specific args
			// The resource arg must be a class/object with a toJSON method
			let [ create_err, create_results ] = await asyncHandler(
				observationService.create(args, logger)
			);

			expect(create_err).toBeUndefined();
			// Response should contain an id so core can set appropriate location headers
			expect(create_results.id).toEqual(args.id);


			// Verify the new fixture exists
			let [ query_err, doc ] = await asyncHandler(
				observationService.searchById(args, contexts, logger)
			);

			expect(query_err).toBeUndefined();
			expect(doc.id).toEqual(args.id);

		});

	});

	describe('Method: update', () => {

		// Let's check for the fixture's status and then try to change it
		// 1. Query fixture for status
		// 2. Update status
		// 3. Query fixture for updated status

		test('should successfully update a document', async () => {
			// Update the status
			ObservationFixture.status = 'preliminary';

			let args = {
				resource: {
					toJSON: () => ObservationFixture
				},
				id: '1'
			};
            let contexts = {};

			// Query for the original doc, this will ignore the resource arg
			let [ query_err, doc ] = await asyncHandler(
				observationService.searchById(args, contexts, logger)
			);

			expect(query_err).toBeUndefined();
			expect(doc.status).toEqual('final');

			// Update the original doc
			let [ update_err, update_results ] = await asyncHandler(
				observationService.update(args, logger)
			);

			expect(update_err).toBeUndefined();
			expect(update_results.id).toEqual(args.id);

			// Query the newly updated doc and make sure the status is correct
			let [ updated_err, updated_doc ] = await asyncHandler(
				observationService.searchById(args, contexts, logger)
			);

			expect(updated_err).toBeUndefined();
			expect(updated_doc.status).toEqual('preliminary');

		});

	});

});
