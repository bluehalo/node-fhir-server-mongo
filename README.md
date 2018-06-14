`@asymmetrik/node-fhir-server-mongo` [![Build Status](https://travis-ci.org/Asymmetrik/node-fhir-server-mongo.svg?branch=develop)](https://travis-ci.org/Asymmetrik/node-fhir-server-mongo) [![Known Vulnerabilities](https://snyk.io/test/github/asymmetrik/node-fhir-server-mongo/badge.svg?targetFile=fhir%2Fpackage.json)](https://snyk.io/test/github/asymmetrik/node-fhir-server-mongo?targetFile=fhir%2Fpackage.json)
====================================

## Intro
This project is a MongoDB back end connecting to `@asymmetrik/node-fhir-server-core`. 


## Getting Started

Install with either Docker or Nodejs.

**With Docker**

1. Install the Docker latest version at [Docker Community Edition](https://www.docker.com/community-edition)
2. Create a new file `.local-secrets/auth.secrets`  
  Fill in `AUTH_CLIENT_ID` and `AUTH_CLIENT_SECRET` (Example: `.local-secrets/auth.example`).
3. Run Docker  
Windows: Switch to Linux Containers and enable sharing C drive under Docker Settings  
Mac: No extra setting required
4. Start server:

```shell
docker-compose up
```



**With Node**

1. Install [Nodejs and NPM](https://nodejs.org/en/) latest version.
2. Optional: Install [Yarn](https://yarnpkg.com/lang/en/docs/install) latest version.
3. Install the latest [Mongo Community Edition](https://docs.mongodb.com/manual/administration/install-community/).
4. Go into `/fhir` folder and install initial modules with either NPM or Yarn. Default setting is in `/fhir/env.json`.

```shell
npm install
#OR
yarn install  
```


5. Start server:
```shell
npm run start
#OR
yarn start
```


## Installation Confirmation
The server runs properly with the following output:

```shell
... - info: FHIR server successfully started.
```


## Populate Database

1. In `fhir/fixtures/data` unzip "shr.zip" or "uscore.zip" to its own folder.  
2. Populating data depends on installation mode, Docker or Nodejs.

**With Docker**
```shell
docker-compose exec fhir env NODE_ENV=development yarn populate -a -r
```

**With Nodejs**
```shell
npm run populate -- -a -r
```


## Testing Server Endpoints 

Routes are available depending on enabled profiles. For more details on supported profiles and their configuration, check the [Profile Wiki](https://github.com/Asymmetrik/node-fhir-server-core#profile). 

Default URL: `http://localhost:3000`
Port setting: in `docker-compose.yml` or `env.json`.
 
HTTPS can be enabled with SSL cert, which needs to be generated [(generate self signed certs)](https://github.com/Asymmetrik/node-fhir-server-core/blob/master/.github/CONTRIBUTING.md#generate-self-signed-certs), then added to the configuration files `docker-compose.yml` or `env.json` as `SSL_KEY` and `SSL_CERT` environment variables. Self-signed certificates should not be used for production. 


## Authorization and Token Generation

All resource endpoints are secured. Valid access token with valid scopes is required for viewing access. A sample EHR authorization server is provided to create an access token. Users would need their own EHR authorization in a live environment.

Refer to the [SMART Authorization Guide](http://docs.smarthealthit.org/authorization) for more information.

You will first need to be granted a code.  The EHR decides whether to grant or deny access.  This decision is communicated to the app when the EHR authorization server returns an authorization code.  Authorization codes are short-lived, usually expiring within around one minute.  The code is sent when the EHR authorization server redirects the browser to the app’s redirect_uri, with the following URL parameters:

```
Location: http://ehr/authorize?
response_type=code&
client_id=app-client-id&
redirect_uri=https://app/after-auth&
launch=xyz123&
scope=launch patient/Observation.read patient/Patient.read openid profile&
state=98wrghuwuogerg97&
aud=https://ehr/fhir
```
 

Seek authorization from the server with the following URL:

```
http://localhost:3000/authorize?client_id=xyz123&redirect_uri=http://localhost:3000/&response_type=code&state=43220320&scope=launch patient/*.read openid&aud=http://localhost:3000
```


The browser would redirect back to localhost with a code and state.  Granted access output would be similar to the following:

```
Location: https://app/after-auth?
code=123abc&
state=98wrghuwuogerg97
```

After obtaining an authorization code, the app trades the code for an access token via HTTP POST to the EHR authorization server’s token endpoint URL, using content-type application/x-www-form-urlencoded.

```
POST /token HTTP/1.1
Host: ehr
Content-Type: application/x-www-form-urlencoded

grant_type=authorization_code
code=123abc
redirect_uri=https://app/after-auth
```

Lets give this a try on our server.
Using any request builder (i.e. Postman), create a new POST request with the code you obtained during the previous step.  You have a short time to use that code so if it has expired, you will need to be granted a new one.

```
POST http://localhost:3000

Content-Type: application/x-www-form-urlencoded
grant_type=authorization_code
code=<code you obtained from previous step>
redirect_uri=http://localhost:3000
```

If granted access, you should now have a valid token you can use to view the resources.  Depending on the authorization service you use, the format may differ.  The response should look something like this:
```
{
	"access_token": "i8hweunweunweofiwweoijewiwe",
	"token_type": "bearer",
	"expires_in": 3600,
	"scope": "patient/Observation.read patient/Patient.read",
	"state": "98wrghuwuogerg97"
}
```

Now you should have access to the Patient and Observation resources.  Using your request builder, create a new GET request with the required Authorization header.  For example:

```
GET http://localhost:3000/dstu2/Patient/1
Authorization: Bearer <access_token>
```

You should get back the Patient record.
```
{
  "resourceType": "Patient",
  "birthTime": ...
}
```

For more information regarding Authorization and scopes, please refer to http://docs.smarthealthit.org/.

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
