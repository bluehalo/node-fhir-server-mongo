`@asymmetrik/node-fhir-server-mongo`
====================================

## Intro

## Dependencies
> This project requires docker for local development. You can deploy it with or without docker. To deploy it separately, you need a server with the latest LTS for [Node.js](https://nodejs.org/en/) installed and a mongo database that can be reached by the node server.

1. Install the latest [Docker Community Edition](https://www.docker.com/community-edition) for your OS.

## Getting Started
1. Run `docker-compose up`.

## Usage
There are several other commands that may be useful. You can run all of them through `docker-compose run <service>` or `docker-compose exec <service>`. Use `docker-compose exec` if you already have the app running, otherwise use `docker-compose run` to run it once. The available scripts are:

* `docker-compose exec fhir test` - lint the src directory and use jest to run all of our tests
* `docker-compose exec fhir test:lint` - only lint your src directory
* `docker-compose exec fhir test:jest` - only use jest to run all the tests

The two other npm scripts available are `start` and `nodemon`. `nodemon` is used when you run `docker-compose up` and if you ever deploy, you should use the `start` command.

## Deployment
This package uses an env.json to define some values for local development and they should be used for local development only. You need to make sure these are overridden before deploying `@asymmetrik/fhir-server-mongo`. The following environment variables must be set before deploying:

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
