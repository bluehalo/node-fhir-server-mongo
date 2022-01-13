const input = require('./fixtures/input.json');
const {removeNull} = require('../../../utils/nullRemover');

describe('nullRemover Tests', () => {
    describe('nullRemover Tests', () => {
        test('nullRemover works', async () => {
            const result = removeNull(input);
            expect(result).toStrictEqual(input);
        });
    });
});
