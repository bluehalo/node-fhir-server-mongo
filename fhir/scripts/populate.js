const asyncHandler = require('../src/lib/async-handler');
const { COLLECTION } = require('../src/constants');
const { mongoConfig } = require('../src/config');
const package = require('../package.json');
const mongo = require('../src/lib/mongo');
const program = require('commander');
const path = require('path');
const glob = require('glob');

// const {
// 	PatientSchema,
// 	ObservationSchema
// } = require('fhir-schemas');

// const SCHEMA_MAP = {
// 	'Patient': PatientSchema,
// 	'Observation': ObservationSchema
// };

const VALID_PROFILE_NAMES = Object.values(COLLECTION);

/**
 * @function loadProfiles
 * @summary Load the profiles into Mongo and log status as we go
 */
let loadProfiles = async args => {
	let { profiles, reset } = args;
	// Connect to Mongo
	let [ err, client ] = await asyncHandler(mongo(mongoConfig.connection, mongoConfig.options));

	// Fail if there is an error
	if (err) {
		throw err;
	}

	// Connect to our Database
	let db = client.db(mongoConfig.db_name);
	let collectionList = await db.listCollections().toArray();
	let currentCollections = collectionList.map(coll => coll.name);

	// Iterate over our profiles and insert  all of our documents
	let profile_names = Object.keys(profiles);
	for (let name of profile_names) {

    let entries = profiles[name];//*****
    //	console.log(entries)
		//	let documents = profiles[name];//*****
		//  console.log(documents)
		
    for (var i = 0; i < entries.entry.length; i++) {
      var documents = entries.entry[i];
      console.log(documents)
  
  
      // Add a validator for the schemas
      // let [ schemaErr, collection ] = await asyncHandler(db.createCollection(name, {
      // 	validator: { $jsonSchema: SCHEMA_MAP[name] }
      // }));
      //
      // // Skip this iteration if there was an error creating the schema
      // if (schemaErr) {
      // 	console.warn(`Unable to create collection for ${name} profile. Skipping.`);
      // 	console.error(schemaErr);
      // 	return;
      // }
      let collection = db.collection(name);
  
      if (reset && currentCollections.indexOf(name) > -1) {
        await asyncHandler(collection.drop());
      }
  
      // Insert all of our documents
      console.log(`\nInserting documents for the ${name} profile.`);
      let [insertErr, results] = await asyncHandler(collection.insertMany(documents));
  
      if (insertErr) {
        console.warn(`Unable to insert documents for ${name} profile.`);
        throw insertErr;
      }
      else {
        console.log(`Success. Inserted ${results.result.n} documents in ${name} profile.`);
      }
  
    }
		
	}

	// Close our connection
	console.log('\nClosing connection\n');
	client.close();
};

/**
 * @function loadDocumentsForProfile
 * @summary Search the fixtures directory and find matching files
 */
let loadDocumentsForProfile = profile_name => {
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
 */
let parseArgs = () => {
	let { version } = package.version;

	// Setup the CLI and parse arguments
	program
		.version(version)
		.option('-p, --profiles [profile]', `Comma separated list of profiles. Valid ones are ${VALID_PROFILE_NAMES.join(',')}`)
		.option('-a, --all', 'Insert all profiles')
		.option('-r, --reset', 'Reset the collection you are insertng documents into.');

	program.on('--help', () => {
		console.log();
		console.log('  Examples:\n');
		console.log('    $ docker-compose exec fhir yarn populate -p Patient,Observation -r');
		console.log('    $ node scripts/populate -p Patient,Observation -r');
		console.log('    $ node scripts/populate -a -r');
		console.log();
	});

	program.parse(process.argv);

	if (!process.argv.slice(2).length) {
		program.outputHelp();
		process.exit(0);
	}

	return {
		profileKeys: program.profiles ? program.profiles.split(',') : [],
		reset: program.reset,
		all: program.all
	};
};

let main = async () => {
	// Validate and Parse Arguments
	let args = parseArgs();
	let keys = args.all ? VALID_PROFILE_NAMES : args.profileKeys;
	// Generate a dictionary of profiles to seed
	args.profiles = keys.reduce((all_profiles, key) => {
		all_profiles[key] = loadDocumentsForProfile(key);
		return all_profiles;
	}, {});
	// Load all of our profiles into mongo
	let [ err ] = await asyncHandler(loadProfiles(args));

	if (err) {
		console.error(err);
	}
	else {
		console.log(`Finished populating ${mongoConfig.db_name}`);
	}
};

main();
