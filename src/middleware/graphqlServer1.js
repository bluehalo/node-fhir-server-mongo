/**
 * This middleware handles graphql requests
 */
const {ApolloServer} = require('apollo-server-express');
const {join} = require('path');
const resolvers = require('../graphql/v1/resolvers');
const {loadFilesSync} = require('@graphql-tools/load-files');
const {mergeTypeDefs} = require('@graphql-tools/merge');
const {FhirDataSource} = require('../graphql/v1/dataSource');

const {
    ApolloServerPluginLandingPageGraphQLPlayground,
    // ApolloServerPluginLandingPageDisabled
} = require('apollo-server-core');
const {getRequestInfo} = require('../graphql/v1/requestInfoHelper');



const graphqlv1 = async () => {
    const typesArray = loadFilesSync(join(__dirname, '../graphql/v1/schemas/'), {recursive: true});
    const typeDefs = mergeTypeDefs(typesArray);
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
                        },
                        cdnUrl: 'https://cdn.jsdelivr.net/npm',
                        faviconUrl: '',
                    }
                ),
                // ApolloServerPluginLandingPageDisabled()
            ],
            context: async ({req, res}) => {
                const requestInfo = {
                    user: (req.authInfo && req.authInfo.context && req.authInfo.context.username)
                        || (req.authInfo && req.authInfo.context && req.authInfo.context.subject)
                        || req.user,
                    scope: req.authInfo && req.authInfo.scope,
                    remoteIpAddress: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
                    protocol: req.protocol,
                    originalUrl: req.originalUrl,
                    path: req.path,
                    host: req.hostname,
                    body: req.body,
                };
                return {
                    req,
                    res,
                    ...requestInfo,
                    dataApi: new FhirDataSource(getRequestInfo(requestInfo))
                };
            }
        });

    // apollo requires us to start the server first
    await server.start();

    return server.getMiddleware({path: '/'});
};

module.exports.graphqlv1 = graphqlv1;
