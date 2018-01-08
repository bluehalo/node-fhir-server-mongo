const asyncHandler = require('./async-handler');

describe('Async Handler Test', () => {

	test('should return no error and valid data for an async function call', async () => {

		let returnAPromise = () => new Promise((resolve, _) => {
			resolve(12);
		});

		let [ err, data ] = await asyncHandler(returnAPromise());

		expect(err).toBeUndefined();
		expect(data).toEqual(12);

	});

	test('should return an error for an async function call', async () => {

		let error = new Error('Oops');

		let returnAPromise = () => new Promise((_, reject) => {
			reject(error);
		});

		let [ err, data ] = await asyncHandler(returnAPromise());

		expect(data).toBeUndefined();
		expect(err.message).toEqual(error.message);

	});

});
