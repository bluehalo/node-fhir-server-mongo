# GraphQL Support in FHIR Server

This FHIR server implements support for querying FHIR data using GraphQL(https://graphql.org/).

### Playground
You can access the GraphQL playground by going to the /graphql url in your browser e.g., http://fhir.dev.bwell.zone/graphql.  This will redirect you to the OAuth provider to login and then will store your JWT token in a cookie so you can use the Playground.

### Making GraphQL calls to the server
You can use the standard GraphQL client libraries or Postman and access the /graphql url.  You will need to pass the OAuth token as a Bearer token to authenticate.  See https://github.com/icanbwell/fhir-server/blob/master/security.md for details.

### Documentation
All the GraphQL entities and properties have inline documentation from FHIR specifications

### GraphQL Server Implementation
We use the apollo-server-express framework to implement the GraphQL middleware.  This is implemented in 
https://github.com/icanbwell/fhir-server/blob/master/src/middleware/graphqlServer.js

We use the graphql-tools framework, so we can store the schema and resolver for each FHIR entity in a separate file and then merge them together to create the full schema.

### Security
For security, we use the same mechanism for both REST and GraphQL.  There are two pieces to this:
1. The middleware to read auth tokens, decrypt them and add `request.user` and `request.scope`: https://github.com/icanbwell/fhir-server/blob/master/src/strategies/jwt.bearer.strategy.js
2. code to check these permissions when needed.  This code is stored in the https://github.com/icanbwell/fhir-server/tree/master/src/operations

### Code Generation
We use a code generator to read the FHIR schema and generate the GraphQL schema and resolvers.  This code generator is in https://github.com/icanbwell/fhir-server/blob/master/src/graphql/generator/generate_classes.py and can be run by typing the command `make graphql`.

In the https://github.com/icanbwell/fhir-server/tree/master/src/graphql/schemas folder each FHIR entity has its own GraphQL schema file.  The schema.graphql file is the top level schema element.
In the https://github.com/icanbwell/fhir-server/tree/master/src/graphql/resolvers folder each FHIR resource has its own GraphQL resolver file.  The resolvers.js merges all the resolvers together.

### FHIR References
This FHIR server automatically turns each reference into a nested access to the referenced resource.

### Adding reverse links
To add a reverse link:
1. Add a custom schema file (e.g., https://github.com/icanbwell/fhir-server/blob/master/src/graphql/schemas/custom/patient.graphql)
2. Add a custom resolver file (e.g., https://github.com/icanbwell/fhir-server/blob/master/src/graphql/resolvers/custom/patient.js)

The FHIR server will automatically load these the next time it runs.

### Adding Enrichment Providers
Sometimes you want to add enrichment to the underlying FHIR data (e.g., calculating totals, adding additional properties etc).  To enable this we have a concept of pluggable enrichment providers.

To add a new enrichment provider:
1. Add a new provider class here: https://github.com/icanbwell/fhir-server/tree/master/src/enrich/providers.  You can see examples in here.  Implement the interface.
2. Register your new provider in https://github.com/icanbwell/fhir-server/blob/98599cba3e10790e03e9e4f07e45b1c8f72818c1/src/enrich/enrich.js#L7
Now this enrichment provider will be run for every resource and can add additional properties.  These properties are available both when accessing the server via REST or GraphQL.



