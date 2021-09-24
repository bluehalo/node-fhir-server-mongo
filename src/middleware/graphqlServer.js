const {ApolloServer} = require('apollo-server-express');
const {join} = require('path');
const { loadSchemaSync} = require('@graphql-tools/load');
const {GraphQLFileLoader} = require('@graphql-tools/graphql-file-loader');
const {addResolversToSchema} = require('@graphql-tools/schema');
const resolvers = require('../graphql/resolvers');

// import loginWithToken from "../users/token";
// import {configuration as corsConfiguration} from "../../middleware/cors";

const {
    ApolloServerPluginLandingPageGraphQLPlayground,
    // ApolloServerPluginLandingPageDisabled
} = require('apollo-server-core');

const graphql = async () => {
    const schema = loadSchemaSync(join(__dirname, '../graphql/schemas/schema.graphql'), {
        loaders: [
            new GraphQLFileLoader(),
        ]
    });

    // Add resolvers to the schema
    const schemaWithResolvers = addResolversToSchema({
        schema,
        resolvers,
    });
    const server = new ApolloServer(
        {
            schema: schemaWithResolvers,
            plugins: [
                // eslint-disable-next-line new-cap
                ApolloServerPluginLandingPageGraphQLPlayground(),
                // ApolloServerPluginLandingPageDisabled()
            ],
            context: async ({req, res}) => {
                // const token = req?.cookies["app_login_token"];

                const context = {
                    req,
                    res,
                    user: {},
                };

                // const user = token ? await loginWithToken({token}) : null;
                // const user = null;
                //
                // if (!user?.error) {
                //     context.user = user;
                // }

                return context;
            },
        });

    await server.start();

    const router = await server.getMiddleware();
    return router;
};

// const getGraphQLMiddleware = () => {
//     const router = (async () => {
//         await graphql();
//     })();
//
//     return router;
// };

module.exports.graphql = graphql;
// module.exports.getGraphQLMiddleware = getGraphQLMiddleware;
