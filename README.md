## Intro
This project is a FHIR facade server built on `@asymmetrik/node-fhir-server-core`.  The facade server is meant to be used with your existing (or new) patient database.  All you need to do is set up the database connection and fill in the queries and you will have a FHIR server!

## Getting Started with Docker
1. Install the latest [Docker Community Edition](https://www.docker.com/community-edition) for your OS if you do not already have it installed.
2. Run `docker-compose up`.
3. Visit `localhost:3000/3_0_1/metadata` to view the conformance statement.

## Getting Started with Node
1. Install the latest LTS for [Node.js](https://nodejs.org/en/) if you do not already have it installed.
2. Make sure the default values defined in `env.json` are valid.
3. Run `yarn` or `npm install`.
4. Run `yarn start` or `npm run start`.
5. Visit `localhost:3000/3_0_1/metadata` to view the conformance statement.

## Next steps
At this point you can now start testing the endpoints. Depending what profiles you opt into, certain routes will be available. You can view the routes enabled based on which service methods you provide over at [`@asymmetrik/node-fhir-server-core`](https://github.com/Asymmetrik/node-fhir-server-core#profiles). 

1. Setup the database connection (Mongo/Sequelize) in `./src/index.js`.
2. Look through `./src/config.js` to set up the server and decide which profile you want to support.  Comment out ones you don't want to support.
3. Look at the corresponding service templates for the resources you want to enable.  You can remove any interaction you don't want to support.  For instance, if you don't want write capability for the Patient resource, you would delete the create and update functions in `./src/services/patient/patient.service.js`.  This will disable their routes.
4.  Write your queries and test!

## Authorization
The facade server uses [passortjs](http://www.passportjs.org/) for authentication.  This server comes with a bearer strategy template.  You can implement your own passport strategy and reference it in `./src/config.js` to conforms to your AuthZ server.  For more information on authorization please visit [http://docs.smarthealthit.org/authorization/](http://docs.smarthealthit.org/authorization/).

## Having trouble with something?
If you have questions specific to Docker or Node, please consider asking on Stack Overflow.  They already have a lot of support on these topics. If your questions is related to the FHIR specification, please review that documentation at [https://www.hl7.org/fhir/](https://www.hl7.org/fhir/). Any questions related to this specific package, please ask in the issues section. Also, if you think you are experiencing a bug or see something incorrect with the spec, please file an issue so we can help you as soon as we can.

## License
This project is [MIT licensed](./LICENSE).
