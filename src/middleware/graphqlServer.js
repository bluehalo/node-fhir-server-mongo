const {ApolloServer} = require('apollo-server-express');
// import loginWithToken from "../users/token";
// import {configuration as corsConfiguration} from "../../middleware/cors";

const {
    ApolloServerPluginLandingPageGraphQLPlayground,
    // ApolloServerPluginLandingPageDisabled
} = require('apollo-server-core');

const graphql = async () => {
    const typeDefs = `
            type Query {
                totalPosts: Int!
            }
        `;

    //resolvers
    const resolvers = {
        Query: {
            totalPosts: () => 42,
        },
    };
    const server = new ApolloServer(
        {
            typeDefs,
            resolvers,
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
