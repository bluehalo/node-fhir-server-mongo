# Contributing

The `@asymmetrik/node-fhir-server-mongo` is designed to be a wrapper around `@asymmetrik/node-fhir-server-core` which provides a mongo based backend to it.

General guidelines for contributing to `@asymmetrik/node-fhir-server-mongo` are listed below.

## Filing Issues

Try to explain the current behavior, expected behavior, provide a reproducible case demonstrating your problem, and your versions of node, `@asymmetrik/node-fhir-server-core`, `@asymmetrik/node-fhir-server-mongo`, and your OS so I and/or others can provide assistance to you as best as possible.

## Submitting pull requests

If you want to submit a pull request, please adhere to the following guidelines.

1. Fork the repo and checkout the `develop` branch. You should create a new branch off of `develop`.
2. If you're adding new code, add tests to cover them or at least demonstrate how to test the new feature.
3. Update documentation if applicable.
4. Ensure your branch passes all the tests, by running `npm test`.
5. Submit your PR back to the `develop` branch.

## Code style

Code style is governed by eslint and our `.editorconfig`. You can view all the rules in our `.eslintrc` or just run `npm run test:lint` to see any issues.

### Development

There is a development script setup with Nodemon to watch for changes. Once you start this script, it will watch files in the src directory and restart the server anytime you make a change.

To start local development, run `npm run nodemon` and open your browser to [localhost:3000](http://localhost:3000).
