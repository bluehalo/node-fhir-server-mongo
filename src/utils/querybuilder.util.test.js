const moment = require('moment-timezone');
const { dateQueryBuilder } = require('./querybuilder.util');


describe('Query Builder Tests', () => {
    describe('Date Query Builder Tests', () => {
        test('Should return the ISO String if given a moment object', () => {
            const testMoment = moment('2018-10-31T17:49:29.000Z');
            const expectedResult = '2018-10-31T17:49:29.000Z';
            let observedResult = dateQueryBuilder(testMoment);
            expect(observedResult).toEqual(expectedResult);
        });
        describe('No Prefix Tests', () => {
            // TODO - Note that the sanitizer should stop this situation from ever occurring.
            // TODO - as providing milliseconds is not allowed.
            test('Should return the ISO String if the given a full ISO String \'yyyy-mm-ddThh:mm:ss.###Z\'', () => {
                const testString = '2018-10-31T17:49:29.000Z';
                const expectedResult = '2018-10-31T17:49:29.000Z';
                let observedResult = dateQueryBuilder(testString);
                expect(observedResult).toEqual(expectedResult);
            });
            test('Should return the ISO String if given a partial ISO string of format \'yyyy-mm-ddThh:mm:ss\'', () => {
                const testString = '2018-10-31T17:49:29';
                const expectedResult = '2018-10-31T17:49:29.000Z';
                let observedResult = dateQueryBuilder(testString);
                expect(observedResult).toEqual(expectedResult);
            });
            test('Should return a 1 minute range if given a partial ISO string of format \'yyyy-mm-ddThh:mm\'', () => {
                const testString = '2018-10-31T17:49';
                const expectedResult = {'$gte': '2018-10-31T17:49:00.000Z', '$lte': '2018-10-31T17:49:59.999Z'};
                let observedResult = dateQueryBuilder(testString);
                expect(observedResult).toEqual(expectedResult);
            });
            // TODO - Note that the sanitizer should stop this next situation from ever occurring.
            // TODO - as hours without minutes are not allowed
            test('Should return a 1 hour range if given a partial ISO string of format \'yyyy-mm-ddThh\'', () => {
                const testString = '2018-10-31T17';
                const expectedResult = {'$gte': '2018-10-31T17:00:00.000Z', '$lte': '2018-10-31T17:59:59.999Z'};
                let observedResult = dateQueryBuilder(testString);
                expect(observedResult).toEqual(expectedResult);
            });
            test('Should return a 1 day range if given a partial ISO string of format \'yyyy-mm-dd\'', () => {
                const testString = '2018-10-31';
                const expectedResult = {'$gte': '2018-10-31T00:00:00.000Z', '$lte': '2018-10-31T23:59:59.999Z'};
                let observedResult = dateQueryBuilder(testString);
                expect(observedResult).toEqual(expectedResult);
            });
            test('Should return a 1 month range if given a partial ISO string of format \'yyyy-mm\'', () => {
                const testString = '2018-10';
                const expectedResult = {'$gte': '2018-10-01T00:00:00.000Z', '$lte': '2018-10-31T23:59:59.999Z'};
                let observedResult = dateQueryBuilder(testString);
                expect(observedResult).toEqual(expectedResult);
            });
            test('Should return a 1 year range if given a partial ISO string of format \'yyyy\'', () => {
                const testString = '2018';
                const expectedResult = {'$gte': '2018-01-01T00:00:00.000Z', '$lte': '2018-12-31T23:59:59.999Z'};
                let observedResult = dateQueryBuilder(testString);
                expect(observedResult).toEqual(expectedResult);
            });
        });
        describe('eq Prefix Tests', () => {
            // TODO - Note that the sanitizer should stop this situation from ever occurring.
            // TODO - as providing milliseconds is not allowed.
            test('Should return the ISO String if the given a full ISO String \'yyyy-mm-ddThh:mm:ss.###Z\'', () => {
                const testString = 'eq2018-10-31T17:49:29.000Z';
                const expectedResult = '2018-10-31T17:49:29.000Z';
                let observedResult = dateQueryBuilder(testString);
                expect(observedResult).toEqual(expectedResult);
            });
            test('Should return the ISO String if given a partial ISO string of format \'yyyy-mm-ddThh:mm:ss\'', () => {
                const testString = 'eq2018-10-31T17:49:29';
                const expectedResult = '2018-10-31T17:49:29.000Z';
                let observedResult = dateQueryBuilder(testString);
                expect(observedResult).toEqual(expectedResult);
            });
            test('Should return a 1 minute range if given a partial ISO string of format \'yyyy-mm-ddThh:mm\'', () => {
                const testString = 'eq2018-10-31T17:49';
                const expectedResult = {'$gte': '2018-10-31T17:49:00.000Z', '$lte': '2018-10-31T17:49:59.999Z'};
                let observedResult = dateQueryBuilder(testString);
                expect(observedResult).toEqual(expectedResult);
            });
            // TODO - Note that the sanitizer should stop this situation from ever occurring.
            // TODO - as hours without minutes are not allowed.
            test('Should return a 1 hour range if given a partial ISO string of format \'yyyy-mm-ddThh\'', () => {
                const testString = 'eq2018-10-31T17';
                const expectedResult = {'$gte': '2018-10-31T17:00:00.000Z', '$lte': '2018-10-31T17:59:59.999Z'};
                let observedResult = dateQueryBuilder(testString);
                expect(observedResult).toEqual(expectedResult);
            });
            test('Should return a 1 day range if given a partial ISO string of format \'yyyy-mm-dd\'', () => {
                const testString = 'eq2018-10-31';
                const expectedResult = {'$gte': '2018-10-31T00:00:00.000Z', '$lte': '2018-10-31T23:59:59.999Z'};
                let observedResult = dateQueryBuilder(testString);
                expect(observedResult).toEqual(expectedResult);
            });
            test('Should return a 1 month range if given a partial ISO string of format \'yyyy-mm\'', () => {
                const testString = 'eq2018-10';
                const expectedResult = {'$gte': '2018-10-01T00:00:00.000Z', '$lte': '2018-10-31T23:59:59.999Z'};
                let observedResult = dateQueryBuilder(testString);
                expect(observedResult).toEqual(expectedResult);
            });
            test('Should return a 1 year range if given a partial ISO string of format \'yyyy\'', () => {
                const testString = 'eq2018';
                const expectedResult = {'$gte': '2018-01-01T00:00:00.000Z', '$lte': '2018-12-31T23:59:59.999Z'};
                let observedResult = dateQueryBuilder(testString);
                expect(observedResult).toEqual(expectedResult);
            });
        });
        describe('ne Prefix Tests', () => {
            // TODO - Note that the sanitizer should stop this situation from ever occurring.
            // TODO - as providing milliseconds is not allowed.
            test('Should return a regex that fully excludes a given full ISO String \'yyyy-mm-ddThh:mm:ss.###Z\'', () => {
                const testString = 'ne2018-10-31T17:49:29.000Z';
                const expectedResult = {'$regex': '^((?!2018[-:T]?10[-:T]?31[-:T]?17[-:T]?49[-:T]?29[-:T]?).)*$'};
                let observedResult = dateQueryBuilder(testString);
                expect(observedResult).toEqual(expectedResult);
            });
            test('Should return a regex that fully excludes a given partial ISO String of format \'yyyy-mm-ddThh:mm:ss\'', () => {
                const testString = 'ne2018-10-31T17:49:29';
                const expectedResult = {'$regex': '^((?!2018[-:T]?10[-:T]?31[-:T]?17[-:T]?49[-:T]?29[-:T]?).)*$'};
                let observedResult = dateQueryBuilder(testString);
                expect(observedResult).toEqual(expectedResult);
            });
            test('Should return a regex that fully excludes the specified minute in given partial ISO String of format \'yyyy-mm-ddThh:mm\'', () => {
                const testString = 'ne2018-10-31T17:49';
                const expectedResult = {'$regex': '^((?!2018[-:T]?10[-:T]?31[-:T]?17[-:T]?49[-:T]?).)*$'};
                let observedResult = dateQueryBuilder(testString);
                expect(observedResult).toEqual(expectedResult);
            });
            // TODO - Note that the sanitizer should stop this situation from ever occurring.
            // TODO - as hours without minutes are not allowed.
            test('Should return a regex that fully excludes the specified hour in given partial ISO String of format \'yyyy-mm-ddThh\'', () => {
                const testString = 'ne2018-10-31T17';
                const expectedResult = {'$regex': '^((?!2018[-:T]?10[-:T]?31[-:T]?17[-:T]?).)*$'};
                let observedResult = dateQueryBuilder(testString);
                expect(observedResult).toEqual(expectedResult);
            });
            test('Should return a regex that fully excludes the specified day in given partial ISO String of format \'yyyy-mm-dd\'', () => {
                const testString = 'ne2018-10-31';
                const expectedResult = {'$regex': '^((?!2018[-:T]?10[-:T]?31[-:T]?).)*$'};
                let observedResult = dateQueryBuilder(testString);
                expect(observedResult).toEqual(expectedResult);
            });
            test('Should return a regex that fully excludes the specified month in given partial ISO String of format \'yyyy-mm\'', () => {
                const testString = 'ne2018-10';
                const expectedResult = {'$regex': '^((?!2018[-:T]?10[-:T]?).)*$'};
                let observedResult = dateQueryBuilder(testString);
                expect(observedResult).toEqual(expectedResult);
            });
            test('Should return a regex that fully excludes the specified year in given partial ISO String of format \'yyyy\'', () => {
                const testString = 'ne2018';
                const expectedResult = {'$regex': '^((?!2018[-:T]?).)*$'};
                let observedResult = dateQueryBuilder(testString);
                expect(observedResult).toEqual(expectedResult);
            });
        });
        describe('gt Prefix Tests', () => {
            // TODO - Note that the sanitizer should stop this situation from ever occurring.
            // TODO - as providing milliseconds is not allowed.
            test('Should return $gt ISO String if given a full ISO String \'yyyy-mm-ddThh:mm:ss.###Z\'', () => {
                const testString = 'gt2018-10-31T17:49:29.000Z';
                const expectedResult = {'$gt': '2018-10-31T17:49:29.000Z'};
                let observedResult = dateQueryBuilder(testString);
                expect(observedResult).toEqual(expectedResult);
            });
            test('Should return $gt ISO String if given a partial ISO String of format \'yyyy-mm-ddThh:mm:ss\'', () => {
                const testString = 'gt2018-10-31T17:49:29';
                const expectedResult = {'$gt': '2018-10-31T17:49:29.000Z'};
                let observedResult = dateQueryBuilder(testString);
                expect(observedResult).toEqual(expectedResult);
            });
            test('Should return $gt end of minute if given a partial ISO String \'yyyy-mm-ddThh:mm\'', () => {
                const testString = 'gt2018-10-31T17:49';
                const expectedResult = {'$gt': '2018-10-31T17:49:59.999Z'};
                let observedResult = dateQueryBuilder(testString);
                expect(observedResult).toEqual(expectedResult);
            });
            // TODO - Note that the sanitizer should stop this situation from ever occurring.
            // TODO - as hours without minutes are not allowed.
            test('Should return $gt end of hour if given a partial ISO String \'yyyy-mm-ddThh\'', () => {
                const testString = 'gt2018-10-31T17';
                const expectedResult = {'$gt': '2018-10-31T17:59:59.999Z'};
                let observedResult = dateQueryBuilder(testString);
                expect(observedResult).toEqual(expectedResult);
            });
            test('Should return $gt end of day if given a partial ISO String \'yyyy-mm-dd\'', () => {
                const testString = 'gt2018-10-31';
                const expectedResult = {'$gt': '2018-10-31T23:59:59.999Z'};
                let observedResult = dateQueryBuilder(testString);
                expect(observedResult).toEqual(expectedResult);
            });
            test('Should return $gt end of month if given a partial ISO String \'yyyy-mm\'', () => {
                const testString = 'gt2018-10';
                const expectedResult = {'$gt': '2018-10-31T23:59:59.999Z'};
                let observedResult = dateQueryBuilder(testString);
                expect(observedResult).toEqual(expectedResult);
            });
            test('Should return $gt end of year if given a partial ISO String \'yyyy\'', () => {
                const testString = 'gt2018';
                const expectedResult = {'$gt': '2018-12-31T23:59:59.999Z'};
                let observedResult = dateQueryBuilder(testString);
                expect(observedResult).toEqual(expectedResult);
            });
        });
        describe('ge Prefix Tests', () => {
            // TODO - Note that the sanitizer should stop this situation from ever occurring.
            // TODO - as providing milliseconds is not allowed.
            test('Should return $gte ISO String if given a full ISO String \'yyyy-mm-ddThh:mm:ss.###Z\'', () => {
                const testString = 'ge2018-10-31T17:49:29.000Z';
                const expectedResult = {'$gte': '2018-10-31T17:49:29.000Z'};
                let observedResult = dateQueryBuilder(testString);
                expect(observedResult).toEqual(expectedResult);
            });
            test('Should return $gte ISO String if given a partial ISO String of format \'yyyy-mm-ddThh:mm:ss\'', () => {
                const testString = 'ge2018-10-31T17:49:29';
                const expectedResult = {'$gte': '2018-10-31T17:49:29.000Z'};
                let observedResult = dateQueryBuilder(testString);
                expect(observedResult).toEqual(expectedResult);
            });
            test('Should return $gte start of minute if given a partial ISO String \'yyyy-mm-ddThh:mm\'', () => {
                const testString = 'ge2018-10-31T17:49';
                const expectedResult = {'$gte': '2018-10-31T17:49:00.000Z'};
                let observedResult = dateQueryBuilder(testString);
                expect(observedResult).toEqual(expectedResult);
            });
            // TODO - Note that the sanitizer should stop this situation from ever occurring.
            // TODO - as hours without minutes are not allowed.
            test('Should return $gte start of hour if given a partial ISO String \'yyyy-mm-ddThh\'', () => {
                const testString = 'ge2018-10-31T17';
                const expectedResult = {'$gte': '2018-10-31T17:00:00.000Z'};
                let observedResult = dateQueryBuilder(testString);
                expect(observedResult).toEqual(expectedResult);
            });
            test('Should return $gte start of day if given a partial ISO String \'yyyy-mm-dd\'', () => {
                const testString = 'ge2018-10-31';
                const expectedResult = {'$gte': '2018-10-31T00:00:00.000Z'};
                let observedResult = dateQueryBuilder(testString);
                expect(observedResult).toEqual(expectedResult);
            });
            test('Should return $gte start of month if given a partial ISO String \'yyyy-mm\'', () => {
                const testString = 'ge2018-10';
                const expectedResult = {'$gte': '2018-10-01T00:00:00.000Z'};
                let observedResult = dateQueryBuilder(testString);
                expect(observedResult).toEqual(expectedResult);
            });
            test('Should return $gte start of year if given a partial ISO String \'yyyy\'', () => {
                const testString = 'ge2018';
                const expectedResult = {'$gte': '2018-01-01T00:00:00.000Z'};
                let observedResult = dateQueryBuilder(testString);
                expect(observedResult).toEqual(expectedResult);
            });
        });
        describe('lt Prefix Tests', () => {
            // TODO - Note that the sanitizer should stop this situation from ever occurring.
            // TODO - as providing milliseconds is not allowed.
            test('Should return $lt ISO String if given a full ISO String \'yyyy-mm-ddThh:mm:ss.###Z\'', () => {
                const testString = 'lt2018-10-31T17:49:29.000Z';
                const expectedResult = {'$lt': '2018-10-31T17:49:29.000Z'};
                let observedResult = dateQueryBuilder(testString);
                expect(observedResult).toEqual(expectedResult);
            });
            test('Should return $lt ISO String if given a partial ISO String of format \'yyyy-mm-ddThh:mm:ss\'', () => {
                const testString = 'lt2018-10-31T17:49:29';
                const expectedResult = {'$lt': '2018-10-31T17:49:29.000Z'};
                let observedResult = dateQueryBuilder(testString);
                expect(observedResult).toEqual(expectedResult);
            });
            test('Should return $lt start of minute if given a partial ISO String \'yyyy-mm-ddThh:mm\'', () => {
                const testString = 'lt2018-10-31T17:49';
                const expectedResult = {'$lt': '2018-10-31T17:49:00.000Z'};
                let observedResult = dateQueryBuilder(testString);
                expect(observedResult).toEqual(expectedResult);
            });
            // TODO - Note that the sanitizer should stop this situation from ever occurring.
            // TODO - as hours without minutes are not allowed.
            test('Should return $lt start of hour if given a partial ISO String \'yyyy-mm-ddThh\'', () => {
                const testString = 'lt2018-10-31T17';
                const expectedResult = {'$lt': '2018-10-31T17:00:00.000Z'};
                let observedResult = dateQueryBuilder(testString);
                expect(observedResult).toEqual(expectedResult);
            });
            test('Should return $lt start of day if given a partial ISO String \'yyyy-mm-dd\'', () => {
                const testString = 'lt2018-10-31';
                const expectedResult = {'$lt': '2018-10-31T00:00:00.000Z'};
                let observedResult = dateQueryBuilder(testString);
                expect(observedResult).toEqual(expectedResult);
            });
            test('Should return $lt start of month if given a partial ISO String \'yyyy-mm\'', () => {
                const testString = 'lt2018-10';
                const expectedResult = {'$lt': '2018-10-01T00:00:00.000Z'};
                let observedResult = dateQueryBuilder(testString);
                expect(observedResult).toEqual(expectedResult);
            });
            test('Should return $lt start of year if given a partial ISO String \'yyyy\'', () => {
                const testString = 'lt2018';
                const expectedResult = {'$lt': '2018-01-01T00:00:00.000Z'};
                let observedResult = dateQueryBuilder(testString);
                expect(observedResult).toEqual(expectedResult);
            });
        });
        describe('le Prefix Tests', () => {
            // TODO - Note that the sanitizer should stop this situation from ever occurring.
            // TODO - as providing milliseconds is not allowed.
            test('Should return $lte ISO String if given a full ISO String \'yyyy-mm-ddThh:mm:ss.###Z\'', () => {
                const testString = 'le2018-10-31T17:49:29.000Z';
                const expectedResult = {'$lte': '2018-10-31T17:49:29.000Z'};
                let observedResult = dateQueryBuilder(testString);
                expect(observedResult).toEqual(expectedResult);
            });
            test('Should return $lte ISO String if given a partial ISO String of format \'yyyy-mm-ddThh:mm:ss\'', () => {
                const testString = 'le2018-10-31T17:49:29';
                const expectedResult = {'$lte': '2018-10-31T17:49:29.000Z'};
                let observedResult = dateQueryBuilder(testString);
                expect(observedResult).toEqual(expectedResult);
            });
            test('Should return $lte start of minute if given a partial ISO String \'yyyy-mm-ddThh:mm\'', () => {
                const testString = 'le2018-10-31T17:49';
                const expectedResult = {'$lte': '2018-10-31T17:49:00.000Z'};
                let observedResult = dateQueryBuilder(testString);
                expect(observedResult).toEqual(expectedResult);
            });
            // TODO - Note that the sanitizer should stop this situation from ever occurring.
            // TODO - as hours without minutes are not allowed.
            test('Should return $lte start of hour if given a partial ISO String \'yyyy-mm-ddThh\'', () => {
                const testString = 'le2018-10-31T17';
                const expectedResult = {'$lte': '2018-10-31T17:00:00.000Z'};
                let observedResult = dateQueryBuilder(testString);
                expect(observedResult).toEqual(expectedResult);
            });
            test('Should return $lte start of day if given a partial ISO String \'yyyy-mm-dd\'', () => {
                const testString = 'le2018-10-31';
                const expectedResult = {'$lte': '2018-10-31T00:00:00.000Z'};
                let observedResult = dateQueryBuilder(testString);
                expect(observedResult).toEqual(expectedResult);
            });
            test('Should return $lte start of month if given a partial ISO String \'yyyy-mm\'', () => {
                const testString = 'le2018-10';
                const expectedResult = {'$lte': '2018-10-01T00:00:00.000Z'};
                let observedResult = dateQueryBuilder(testString);
                expect(observedResult).toEqual(expectedResult);
            });
            test('Should return $lte start of year if given a partial ISO String \'yyyy\'', () => {
                const testString = 'le2018';
                const expectedResult = {'$lte': '2018-01-01T00:00:00.000Z'};
                let observedResult = dateQueryBuilder(testString);
                expect(observedResult).toEqual(expectedResult);
            });
        });
        describe('sa Prefix Tests', () => {
            // TODO - Note that the sanitizer should stop this situation from ever occurring.
            // TODO - as providing milliseconds is not allowed.
            test('Should return $gt ISO String if given a full ISO String \'yyyy-mm-ddThh:mm:ss.###Z\'', () => {
                const testString = 'sa2018-10-31T17:49:29.000Z';
                const expectedResult = {'$gt': '2018-10-31T17:49:29.000Z'};
                let observedResult = dateQueryBuilder(testString);
                expect(observedResult).toEqual(expectedResult);
            });
            test('Should return $gt ISO String if given a partial ISO String of format \'yyyy-mm-ddThh:mm:ss\'', () => {
                const testString = 'sa2018-10-31T17:49:29';
                const expectedResult = {'$gt': '2018-10-31T17:49:29.000Z'};
                let observedResult = dateQueryBuilder(testString);
                expect(observedResult).toEqual(expectedResult);
            });
            test('Should return $gt end of minute if given a partial ISO String \'yyyy-mm-ddThh:mm\'', () => {
                const testString = 'sa2018-10-31T17:49';
                const expectedResult = {'$gt': '2018-10-31T17:49:59.999Z'};
                let observedResult = dateQueryBuilder(testString);
                expect(observedResult).toEqual(expectedResult);
            });
            // TODO - Note that the sanitizer should stop this situation from ever occurring.
            // TODO - as hours without minutes are not allowed.
            test('Should return $gt end of hour if given a partial ISO String \'yyyy-mm-ddThh\'', () => {
                const testString = 'sa2018-10-31T17';
                const expectedResult = {'$gt': '2018-10-31T17:59:59.999Z'};
                let observedResult = dateQueryBuilder(testString);
                expect(observedResult).toEqual(expectedResult);
            });
            test('Should return $gt end of day if given a partial ISO String \'yyyy-mm-dd\'', () => {
                const testString = 'sa2018-10-31';
                const expectedResult = {'$gt': '2018-10-31T23:59:59.999Z'};
                let observedResult = dateQueryBuilder(testString);
                expect(observedResult).toEqual(expectedResult);
            });
            test('Should return $gt end of month if given a partial ISO String \'yyyy-mm\'', () => {
                const testString = 'sa2018-10';
                const expectedResult = {'$gt': '2018-10-31T23:59:59.999Z'};
                let observedResult = dateQueryBuilder(testString);
                expect(observedResult).toEqual(expectedResult);
            });
            test('Should return $gt end of year if given a partial ISO String \'yyyy\'', () => {
                const testString = 'sa2018';
                const expectedResult = {'$gt': '2018-12-31T23:59:59.999Z'};
                let observedResult = dateQueryBuilder(testString);
                expect(observedResult).toEqual(expectedResult);
            });
        });
        describe('eb Prefix Tests', () => {
            // TODO - Note that the sanitizer should stop this situation from ever occurring.
            // TODO - as providing milliseconds is not allowed.
            test('Should return $lt ISO String if given a full ISO String \'yyyy-mm-ddThh:mm:ss.###Z\'', () => {
                const testString = 'eb2018-10-31T17:49:29.000Z';
                const expectedResult = {'$lt': '2018-10-31T17:49:29.000Z'};
                let observedResult = dateQueryBuilder(testString);
                expect(observedResult).toEqual(expectedResult);
            });
            test('Should return $lt ISO String if given a partial ISO String of format \'yyyy-mm-ddThh:mm:ss\'', () => {
                const testString = 'eb2018-10-31T17:49:29';
                const expectedResult = {'$lt': '2018-10-31T17:49:29.000Z'};
                let observedResult = dateQueryBuilder(testString);
                expect(observedResult).toEqual(expectedResult);
            });
            test('Should return $lt start of minute if given a partial ISO String \'yyyy-mm-ddThh:mm\'', () => {
                const testString = 'eb2018-10-31T17:49';
                const expectedResult = {'$lt': '2018-10-31T17:49:00.000Z'};
                let observedResult = dateQueryBuilder(testString);
                expect(observedResult).toEqual(expectedResult);
            });
            // TODO - Note that the sanitizer should stop this situation from ever occurring.
            // TODO - as hours without minutes are not allowed.
            test('Should return $lt start of hour if given a partial ISO String \'yyyy-mm-ddThh\'', () => {
                const testString = 'eb2018-10-31T17';
                const expectedResult = {'$lt': '2018-10-31T17:00:00.000Z'};
                let observedResult = dateQueryBuilder(testString);
                expect(observedResult).toEqual(expectedResult);
            });
            test('Should return $lt start of day if given a partial ISO String \'yyyy-mm-dd\'', () => {
                const testString = 'eb2018-10-31';
                const expectedResult = {'$lt': '2018-10-31T00:00:00.000Z'};
                let observedResult = dateQueryBuilder(testString);
                expect(observedResult).toEqual(expectedResult);
            });
            test('Should return $lt start of month if given a partial ISO String \'yyyy-mm\'', () => {
                const testString = 'eb2018-10';
                const expectedResult = {'$lt': '2018-10-01T00:00:00.000Z'};
                let observedResult = dateQueryBuilder(testString);
                expect(observedResult).toEqual(expectedResult);
            });
            test('Should return $lt start of year if given a partial ISO String \'yyyy\'', () => {
                const testString = 'eb2018';
                const expectedResult = {'$lt': '2018-01-01T00:00:00.000Z'};
                let observedResult = dateQueryBuilder(testString);
                expect(observedResult).toEqual(expectedResult);
            });
        });
        describe('ap Prefix Tests', () => {
            test('Should return range with upper lower bounds equal to the target date +/- 0.1 * the amount of time ' +
                'between now and the target date if given a full ISO String \'yyyy-mm-ddThh:mm:ss.###Z\'', () => {
                const testString = 'ap2000-10-31T17:49:29.000Z';
                const currentDateTimeOverride = '2018-11-01T16:26:40.730Z';
                const expectedResult = {'$gte': '1999-01-13T05:57:45.827Z', '$lte': '2002-08-20T05:41:12.173Z'};
                let observedResult = dateQueryBuilder(testString, currentDateTimeOverride);
                expect(observedResult).toEqual(expectedResult);
            });
            test('Should return range with upper lower bounds equal to the target date +/- 0.1 * the amount of time ' +
                'between now and the target date if given a partial ISO String of format \'yyyy-mm-ddThh:mm:ss\'', () => {
                const testString = 'ap2000-10-31T17:49:29';
                const currentDateTimeOverride = '2018-11-01T16:26:40.730Z';
                const expectedResult = {'$gte': '1999-01-13T05:57:45.827Z', '$lte': '2002-08-20T05:41:12.173Z'};
                let observedResult = dateQueryBuilder(testString, currentDateTimeOverride);
                expect(observedResult).toEqual(expectedResult);
            });
            test('Should return range with upper lower bounds equal to the target date +/- 0.1 * the amount of time ' +
                'between now and the start of the specified minute if given a partial ISO String of format \'yyyy-mm-ddThh:mm\'', () => {
                const testString = 'ap2000-10-31T17:49';
                const currentDateTimeOverride = '2018-11-01T16:26:40.730Z';
                const expectedResult = {'$gte': '1999-01-13T05:57:13.927Z', '$lte': '2002-08-20T05:40:46.073Z'};
                let observedResult = dateQueryBuilder(testString, currentDateTimeOverride);
                expect(observedResult).toEqual(expectedResult);
            });
            test('Should return range with upper lower bounds equal to the target date +/- 0.1 * the amount of time ' +
                'between now and the start of the specified hour if given a partial ISO String of format \'yyyy-mm-ddThh\'', () => {
                const testString = 'ap2000-10-31T17';
                const currentDateTimeOverride = '2018-11-01T16:26:40.730Z';
                const expectedResult = {'$gte': '1999-01-13T05:03:19.927Z', '$lte': '2002-08-20T04:56:40.073Z'};
                let observedResult = dateQueryBuilder(testString, currentDateTimeOverride);
                expect(observedResult).toEqual(expectedResult);
            });
            test('Should return range with upper lower bounds equal to the target date +/- 0.1 * the amount of time ' +
                'between now and the start of the specified day if given a partial ISO String of format \'yyyy-mm-dd\'', () => {
                const testString = 'ap2000-10-31';
                const currentDateTimeOverride = '2018-11-01T16:26:40.730Z';
                const expectedResult = {'$gte': '1999-01-12T10:21:19.927Z', '$lte': '2002-08-19T13:38:40.073Z'};
                let observedResult = dateQueryBuilder(testString, currentDateTimeOverride);
                expect(observedResult).toEqual(expectedResult);
            });
            test('Should return range with upper lower bounds equal to the target date +/- 0.1 * the amount of time ' +
                'between now and the start of the specified month if given a partial ISO String of format \'yyyy-mm\'', () => {
                const testString = 'ap2000-10';
                const currentDateTimeOverride = '2018-11-01T16:26:40.730Z';
                const expectedResult = {'$gte': '1998-12-10T10:21:19.927Z', '$lte': '2002-07-23T13:38:40.073Z'};
                let observedResult = dateQueryBuilder(testString, currentDateTimeOverride);
                expect(observedResult).toEqual(expectedResult);
            });
            test('Should return range with upper lower bounds equal to the target date +/- 0.1 * the amount of time ' +
                'between now and the start of the specified year if given a partial ISO String of format \'yyyy\'', () => {
                const testString = 'ap2000';
                const currentDateTimeOverride = '2018-11-01T16:26:40.730Z';
                const expectedResult = {'$gte': '1998-02-12T00:45:19.927Z', '$lte': '2001-11-18T23:14:40.073Z'};
                let observedResult = dateQueryBuilder(testString, currentDateTimeOverride);
                expect(observedResult).toEqual(expectedResult);
            });
        });
    });
});
