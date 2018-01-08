const asyncHandler = require('../src/lib/async-handler');
const { mongoConfig } = require('../src/config');
const mongo = require('../src/lib/mongo');
const path = require('path');
const glob = require('glob');

const {
	PatientSchema,
	ObservationSchema
} = require('fhir-schemas');

const SCHEMA_MAP = {
	'Patient': PatientSchema,
	'Observation': ObservationSchema
};

const VALID_PROFILE_NAMES = Object.keys(SCHEMA_MAP);

/**
 * @function loadProfiles
 * @summary Load the profiles into Mongo and log status as we go
 */
let loadProfiles = async profiles => {
	// Connect to Mongo
	let [ err, client ] = await asyncHandler(mongo(mongoConfig.connection, mongoConfig.options));

	// Fail if ther is an error
	if (err) {
		console.error(err);
		process.exit(err);
	}

	// Connect to our Database
	let db = client.db(mongoConfig.db_name);

	// Iterate over our profiles and insert  all of our documents
	let profile_names = Object.keys(profiles);
	for (let name of profile_names) {
		let documents = profiles[name];

		// Add a validator for the schemas
		let [ schemaErr, collection ] = await asyncHandler(db.createCollection(name, {
			validator: { $jsonSchema: SCHEMA_MAP[name] }
		}));

		// Skip this iteration if there was an error creating the schema
		if (schemaErr) {
			console.warn(`Unable to create collection for ${name} profile. Skipping.`);
			console.error(schemaErr);
			return;
		}

		// Insert all of our documents
		console.log(`Inserting documents for the ${name} profile.`);
		let [insertErr, results] = await asyncHandler(collection.insertMany(documents));

		if (insertErr) {
			console.warn(`Unable to insert documents for ${name} profile.`);
			console.error(insertErr);
		}
		else {
			console.log(`Successfully inserted ${documents.length} documents into the ${name} profile.`);
			console.log(results);
		}
	}

	// Close our connection
	client.close();
};

/**
 * @function findProfiles
 * @summary Search the fixtures directory and find matching files
 */
let findProfiles = profile_name => {
	// Get a list of json files in fixtures
	let basePath = path.join(__dirname, '../fixtures');
	let profiles = glob.sync(path.join(basePath, '**/*.json'));
	let modules = profiles
		.map(profile_path => require(profile_path))
		.filter(module => module.resourceType === profile_name);

	return modules;
};

/**
 * @function parseArgs
 * @summary Parse profiles from commmand line that we want to seed mongo with
 * @TODO: We should use something like commander later to make this cleaner
 * and force only profiles that we know are valid
 */
let parseArgs = () => {
	let args = process.argv.slice(2)
		.filter(arg => VALID_PROFILE_NAMES.indexOf(arg) > -1);

	if (args.length === 0) {
		console.log('[-] Please provide valid profile names for your arguments.');
		console.log('[-] Ex. node populate.js Patient Observation <other_profile>');
		console.log(`[-] Valid profile names include ${VALID_PROFILE_NAMES.join(',')}`);
		process.exit();
	}

	return args;
};

let main = () => {
	// Validate and Parse Arguments
	let args = parseArgs();
	// Generate a dictionary of profiles to seed
	let profiles = args.reduce((all_profiles, arg) => {
		all_profiles[arg] = findProfiles(arg);
		return all_profiles;
	}, {});
	// Load all of our profiles into mongo
	loadProfiles(profiles);
};

main();
