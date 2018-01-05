/**
 * Collection Mock for mocking simple mongo queries
 * We are not trying to mock an entire collection object, just the methods
 * we need to be available to fully test our services
 */

class Collection {

	constructor (name) {
		this._name = name;
	}

	find () {
		let args = Array.prototype.slice.call(arguments);
		let callbackMaybe = args[args.length - 1];
		if (typeof callbackMaybe === 'function') {
			if (this._error) { return callbackMaybe(this._error); }
			if (this._results) { return callbackMaybe(null, this._results); }
			return callbackMaybe(new Error('Mock not set. You need to set error or data on Collection.'));
		}
		return this;
	}

	findOne () {
		let args = Array.prototype.slice.call(arguments);
		let callbackMaybe = args[args.length - 1];
		if (typeof callbackMaybe === 'function') {
			if (this._error) { return callbackMaybe(this._error); }
			if (this._results) { return callbackMaybe(null, this._results); }
			return callbackMaybe(new Error('Mock not set. You need to set error or data on Collection.'));
		}
		return this;
	}

	count () {
		let args = Array.prototype.slice.call(arguments);
		let callbackMaybe = args[args.length - 1];
		if (typeof callbackMaybe === 'function') {
			if (this._error) { return callbackMaybe(this._error); }
			if (this._results) { return callbackMaybe(null, this._results); }
			return callbackMaybe(new Error('Mock not set. You need to set error or data on Collection.'));
		}
		return this;
	}

	set error (message) {
		this._error = new Error(message);
		this._results = undefined;
	}

	set results (doc) {
		this._results = doc;
		this._error = undefined;
	}

}

module.exports = () => {
	let err, results;

	return {
		collection: name => {
			let instance = new Collection(name);
			if (err) { instance.error = err; }
			if (results) { instance.results = results; }
			return instance;
		},
		setError: message => {
			err = message;
		},
		setResults: docs => {
			results = docs;
		}
	};
};
