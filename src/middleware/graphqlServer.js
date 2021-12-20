/**
 * This middleware handles graphql requests
 */
const {ApolloServer} = require('apollo-server-express');
const {join} = require('path');
// const {loadSchemaSync, loadTypedefsSync} = require('@graphql-tools/load');
// const {GraphQLFileLoader} = require('@graphql-tools/graphql-file-loader');
// const {addResolversToSchema} = require('@graphql-tools/schema');
const resolvers = require('../graphql/resolvers');
const { loadFilesSync } = require('@graphql-tools/load-files');
const { mergeTypeDefs } = require('@graphql-tools/merge');

const {
    ApolloServerPluginLandingPageGraphQLPlayground,
    // ApolloServerPluginLandingPageDisabled
} = require('apollo-server-core');



const graphql = async () => {
    const typesArray = loadFilesSync(join(__dirname, '../graphql/schemas/'), { recursive: true });
    const typeDefs = mergeTypeDefs(typesArray);
    // const sources = loadTypedefsSync(join(__dirname, '../graphql/schemas/schema.graphql'), {
    //   loaders: [new GraphQLFileLoader()],
    // });
    // const typeDefs2 = sources.map(source => source.document);
    // load all the schema files
    // const schema = loadSchemaSync(join(__dirname, '../graphql/schemas/schema.graphql'), {
    //     loaders: [
    //         new GraphQLFileLoader(),
    //     ],
    //     includeSources: true
    // });
    //
    // // Add all the resolvers to the schema
    // const schemaWithResolvers = addResolversToSchema({
    //     schema,
    //     resolvers,
    // });
    // create the Apollo graphql middleware
    const server = new ApolloServer(
        {
            // schema: schemaWithResolvers,
            typeDefs: typeDefs,
            resolvers: resolvers,
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
