![Node.js CI](https://github.com/imranq2/node-fhir-server-mongo/workflows/Node.js%20CI/badge.svg)

![publish_docker](https://github.com/imranq2/node-fhir-server-mongo/workflows/publish_docker/badge.svg)

## Intro

This projects implements the Helix FHIR Server.  It was initially forked from https://github.com/Asymmetrik/node-fhir-server-mongo and then most of the internals were re-written to support the missing FHIR functionality.

For example:
1. Added support for every FHIR resource
2. Added support for merging data via $merge
3. Added support for $graph endpoint
4. Added support for authentication
5. Added support for checking user/x.x and access/x.x scopes
6. Provides a WebUI to explore the FHIR data using the web browser
7. Support GraphQL access to FHIR resources

## Cheat sheet
[Cheatsheet](cheatsheet.md)

## Security
[Security](security.md)

## FHIR GraphDefinition Support (We recommend using graphql below whenever possible instead)
[Graph](graph.md)

## GraphQL Support
[GraphQL](graphql.md)

## Merge functionality
[Merge](merge.md)

## Contributing
You will need:
1. Docker Desktop
2. Node.js 16.13


Run `make lint` to do lint checking

Run `make tests` to run all the tests locally

To add a new package or update version of a package, edit package.json and then run `make update` to regenerate `yarn.lock` file.

Run `make up` to bring up the fhir server in docker on your local machine.

## Continous Integration
This project has continuous integration set up so GitHub will automatically run tests on your Pull Requests.

## Building Docker image and pushing to DockerHub
To deploy this code:
1. Create a new release in GitHub and choose the next available version number as the release name.  This builds the docker image and pushes it to two locations: DockerHub (public) and AWS ECR(private for b.well).  https://hub.docker.com/repository/docker/imranq2/node-fhir-server-mongo
2. Once step 1 finishes, you can pull this docker image to wherever you're running the fhir server. 

## Deploying inside b.well
b.well has automated deployment set up.  After the docker image is built and pushed:
1. Update the version number in https://github.com/icanbwell/helm.helix-service/blob/main/configs/fhir-server.common.yaml and commit to master branch
2. Run the GitHub Action for the appropriate environment: https://github.com/icanbwell/helm.helix-service/actions

## Checking version of deployed fhir server
Go to `/version` to see what version you're running.

## Health check
Use `/health` as the url for health check in Kubernetes or other systems


## OAuth
The FHIR server implements OAuth.  You can set these environment variables:
1. AUTH_JWKS_URL: Where to get the public keys of the OAuth provider (e.g., https://cognito-idp.us-east-1.amazonaws.com/us-east-1_yV7wvD4xD/.well-known/jwks.json)
2. AUTH_CODE_FLOW_URL: 
3. AUTH_CODE_FLOW_CLIENT_ID: 
4. REDIRECT_TO_LOGIN: whether to redirect a GET call from a web browser to the OAuth Provider login page


