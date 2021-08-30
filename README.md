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

## Cheat sheet
[Cheatsheet](cheatsheet.md)

