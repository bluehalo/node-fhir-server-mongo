const dateValidator = require('./date.validator');

describe('Date Validator Test', () => {

    describe('Method: parseDate', () => {

        test('should correctly parse date', async () => {

            const dates = dateValidator.validateDate('eq2013-01-14T00:00:00 00:00');
            expect(dates).toEqual({'$eq': '2013-01-14T00:00:00+00:00'});
        });


    });

});
