# GraphQL Support in FHIR Server

This FHIR server implements support for querying FHIR data using GraphQL.

### GraphQL Server Implementation
We use the apollo-server-express framework to implement the GraphQL middleware.  This is implemented in 
`src/middleware/graphqlServer.js`

We use the graphql-tools framework, so we can store the  schema and resolver for each FHIR entity in a separate file and then merge them together to create the full schema.

### Security
For security, we use the same mechanism for both REST and GraphQL.  There are two pieces to this:
1. The middleware to read auth tokens, decrypt them and add `request.user` and `request.scope`: `src/strategies/jwt.bearer.strategy.js`
2. code to check these permissions when needed.  This code is stored in the `src/operations`

### Code Generation
We use a code generator to read the FHIR schema and generate the GraphQL schema and resolvers.  This code generator is in `src/graphql/generator/generate_classes.py` and can be run by typing the command `make graphql`.

In the `src/graphql/schemas` folder each FHIR entity has its own GraphQL schema file.  The query.graphql file is the top level schema element.
In the `src/graphql/resolvers` folder each FHIR resource has its own GraphQL resolver file.  The resolvers.js merges all the resolvers together.

