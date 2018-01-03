@asymmetrik/fhir-server-mongo
=============================

## Intro

## Dependencies
> This project requires nodejs and mongo to be installed on your system.

1. Install the latest LTS for [Node.js](https://nodejs.org/en/).
2. Install the latest MongoDB Community Edition [https://www.mongodb.com/download-center?jmp=nav#community](https://www.mongodb.com/download-center?jmp=nav#community).

## Getting Started

There are some temporary steps to do before developing until this is published on Github and npm. You must currently clone https://bitbucket.org/asymmetrik/asy-fhir-server and run `npm link` inside that directory. Once you do, return to this directory, and link-install it with `npm link @asymmetrik/fhir-server-core`.

1. Run `npm install`.  If you prefer yarn, you can also run `yarn`.
2. Start your mongo server.
3. Start the application with `yarn start` or `npm start`.

## Usage
Coming soon...

## Deployment
This package uses an env.json to define some values for local development and they should be used for local development only. You need to make sure these are overridden before deploying `@asymmetrik/fhir-server-mongo`. The following environment variables must be set before deploying:

```shell
MONGO_HOSTNAME
MONGO_DB_NAME
```

## Having trouble with something?
If you have questions specific to Node or Mongo, please consider asking on Stack Overflow, they already have a lot of support on these topics. If your questions is related to the FHIR specification, please review that documentation at [https://www.hl7.org/fhir/](https://www.hl7.org/fhir/). Any questions related to this specific package, please ask in the issues section. Also, if you think you are experiencing a bug or see something incorrect with the spec, please file an issue so we can help you as soon as we can.

## Want to Contribute?
Please see the [CONTRIBUTING.md](./.github/CONTRIBUTING.md) for contributing guidelines.

## License
@asymmetrik/fhir-server-mongo is [MIT licensed](./LICENSE).
