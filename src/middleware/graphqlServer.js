const {ApolloServer} = require('apollo-server-express');
const {join} = require('path');
const {loadSchemaSync} = require('@graphql-tools/load');
const {GraphQLFileLoader} = require('@graphql-tools/graphql-file-loader');
const {addResolversToSchema} = require('@graphql-tools/schema');
const resolvers = require('../graphql/resolvers');

const {
    ApolloServerPluginLandingPageGraphQLPlayground,
    // ApolloServerPluginLandingPageDisabled
} = require('apollo-server-core');

const graphql = async () => {
    // load all the schema files
    const schema = loadSchemaSync(join(__dirname, '../graphql/schemas/**/*.graphql'), {
        loaders: [
            new GraphQLFileLoader(),
        ]
    });

    // Add all the resolvers to the schema
    const schemaWithResolvers = addResolversToSchema({
        schema,
        resolvers,
    });
    // create the Apollo graphql middleware
    const server = new ApolloServer(
        {
            schema: schemaWithResolvers,
            introspection: true,
            plugins: [
                // request.credentials is set so we receive cookies
                // https://github.com/graphql/graphql-playground#settings
                // eslint-disable-next-line new-cap
                ApolloServerPluginLandingPageGraphQLPlayground(
                    {
                        settings: {
                            'request.credentials': 'same-origin',
                            'schema.polling.enable': false, // enables automatic schema polling
                        }
                    }
                ),
                // ApolloServerPluginLandingPageDisabled()
            ],
            context: async ({req, res}) => {
                return {
                    req,
                    res,
                    user: req.user,
                    scope: req.authInfo && req.authInfo.scope
                };
            }
        });

    // apollo requires us to start the sever first
    await server.start();

    return server.getMiddleware({path: '/'});
};

module.exports.graphql = graphql;
