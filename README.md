`@asymmetrik/node-fhir-server-mongo` [![Build Status](https://travis-ci.org/Asymmetrik/node-fhir-server-mongo.svg?branch=develop)](https://travis-ci.org/Asymmetrik/node-fhir-server-mongo)
====================================

## Intro
This project is an example project built on `@asymmetrik/node-fhir-server-core` and has a MongoDB back end storing sample data. It's built with the ability to run in docker or node.js. To get started developing in Docker, see [Getting Started with Docker](#getting-started-with-docker). To get started developing with Node.js and Mongo, see [Getting Started with Node](#getting-started-with-node)

## Getting Started with Docker

1. Install the latest [Docker Community Edition](https://www.docker.com/community-edition) for your OS if you do not already have it installed.
2. Run `docker-compose up`.

## Getting Started with Node

1. Install the latest LTS for [Node.js](https://nodejs.org/en/) if you do not already have it installed.
2. Install the latest [Mongo Community Edition](https://docs.mongodb.com/manual/administration/install-community/) if you do not already have it installed.
3. Make sure the default values defined in `fhir/env.json` are valid.
4. `cd` into the `fhir` directory and run `yarn` or `npm install`.
5. Run `yarn start` or `npm run start`.

## Next Steps
Once you have this up and running. You should see the following output:

```shell
... - info: App listening on port: 3000 # or whichever port you used
... - info: FHIR Server successfully started.
```

At this point you can now start testing the endpoints. Depending what profiles you opt into, certain routes will be available. You can view the routes enabled based on which service methods you provide over at [`@asymmetrik/node-fhir-server-core`](https://github.com/Asymmetrik/node-fhir-server-core#profiles). You may also want to populate the database with some sample data. You can use the populate command by running the following:

```shell
# In docker, if docker is not up and running
docker-compose exec fhir yarn populate -a -r
# If you are using docker but it is not running
docker-compose run fhir yarn populate -a -r
# In node, if your running the nodemon script, NODE_ENV is development
# If your running the start script, NODE_ENV is production, in the first step export
# the correct NODE_ENV based on which environment needs data
# example is for nodemon script
export NODE_ENV=development
yarn scripts/populate -a -r
```

The url the server will be running at will partially depend on your configuration. For local development, the default is `http://localhost:3000`. You can of course change the port in the `docker-compose.yml` or the `env.json`. You can also enable https by providing SSL certs. If you want to do this you must first generate them, see [Generate self signed certs](https://github.com/Asymmetrik/node-fhir-server-core/blob/master/.github/CONTRIBUTING.md#generate-self-signed-certs). Then, add the path to them in your config by setting `SSL_KEY` and `SSL_CERT` as ENV variable's, adding them in `docker-compose.yml`, or adding them to `env.json`. This will allow the app to run on `https://localhost:3000`. Note the link is for generating self signed certs, you should not use those for production. You can verify the path is set correctly by logging out the fhirServerConfig in `index.js`.

## Commands
There are several npm scripts setup that may be useful. You can run all of these commands regardless of the environment(docker or node), however, they are invoked slightly differently for each environment. If you are using docker, the syntax should be `docker-compose run <service> yarn <command>` or `docker-compose exec <service> yarn <command>`. Use `docker-compose exec` if you already have the app running in another terminal instance, otherwise use `docker-compose run` to run it once. For node, the syntax for npm is `npm run <commmand>` and the syntax for yarn is `yarn <command>`. The commands are as follows:

* `start` - Run in production mode with NODE_ENV set to `production`. Use this when deploying.
* `nodemon` - Run in development mode with NODE_ENV set to `development`. This uses nodemon to restart the server when any js files in `src` are changed.
* `test` - Runs all of our test commands (via the 'test:ci' command), with NODE_ENV set to `test`. This is used for CI.
* `test:ci` - Convenience command which runs test:prepare-db, test:lint, and test:jest. You should not run this command, run the `test` command instead because it set's NODE_ENV correctly for testing.
* `test:lint` - Runs eslint against `fhir/src` with rules defined in the `.eslintrc`.
* `test:jest` - Runs tests using the [Jest](https://facebook.github.io/jest/) framework. It will run any tests in a `__tests__` directory or with the naming convention `<anything>.test.js`.
* `test:prepare-db` - This will reset and reinsert all the sample data into Mongo. This way you have a decent amount of data to work with when running your tests. When this is run via the `test` command, it will set the NODE_ENV for you. If you are running it independently, set the NODE_ENV before using.
* `populate` - This allows you to populate the database. One thing to keep in mind when using this, if the NODE_ENV is not set, it will default to the production db name. When you invoke this through docker, it will set NODE_ENV to `development` for you except when running tests, it will then use `test`. When running in node, you may need to manually set it to which ever environment you need it to be in. The db names are defined in the `env.json` file. This command also accepts some extra flags.
	* `-h` or `--help` - Prints help to the console.
	* `-p` or `--profiles` - Comma separated list of profiles to insert. For example, `-p Patient,Observation`.
	* `-a` or `-all` - Insert all the sample data that we have.
	* `-r` or `--reset` - Reset each collection before an insert. This will essentially drop the collection before creating it and inserting documents into it.
	
#### Example commands

```shell
# Docker
docker-compose exec fhir yarn test
docker-compose exec fhir yarn populate -r -a
# Node
npm run test:lint
yarn start
# Populating DB in node for development environment
export NODE_ENV=development
yarn populate -r -p Patient,Observation
```

## Deployment
This package uses an env.json to define some values for local development and they should be used for local development only. You need to make sure these are overridden before deploying `@asymmetrik/node-fhir-server-mongo`. The following environment variables must be set before deploying:

```shell
MONGO_HOSTNAME
MONGO_DB_NAME
```

## Having trouble with something?
If you have questions specific to Docker, Node, or Mongo, please consider asking on Stack Overflow.  They already have a lot of support on these topics. If your questions is related to the FHIR specification, please review that documentation at [https://www.hl7.org/fhir/](https://www.hl7.org/fhir/). Any questions related to this specific package, please ask in the issues section. Also, if you think you are experiencing a bug or see something incorrect with the spec, please file an issue so we can help you as soon as we can.

## Want to Contribute?
Please see the [CONTRIBUTING.md](./.github/CONTRIBUTING.md) for contributing guidelines.

## License
`@asymmetrik/fhir-server-mongo` is [MIT licensed](./LICENSE).
