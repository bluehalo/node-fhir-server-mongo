// const {
//     ApolloServerPlugin,
// } = 'apollo-server-plugin-base';

class MyApolloServerPlugin {
    constructor() {
    }

    // noinspection JSUnusedLocalSymbols
    // eslint-disable-next-line no-unused-vars
    async requestDidStart(requestContext1) {
        // const start = Date.now();
        // let op;

        // noinspection JSUnusedGlobalSymbols
        return {
            // didResolveOperation(context) {
            //     op = context.operationName;
            // },
            willSendResponse(requestContext) {
                const context = requestContext.context;
                const response = requestContext.response;
                if (!response) { return;}
                /**
                 * @type {Object}
                 */
                const data = response.data;
                if (!data) {return;}
                /**
                 * @type {FhirDataSource}
                 */
                const dataSource = context.dataApi;
                if (!dataSource) {
                    return;
                }
                for (const [, bundle] of Object.entries(data)) {
                    bundle.meta = dataSource.getBundleMeta();
                }
                // const stop = Date.now();
                // const elapsed = stop - start;
                // const size = JSON.stringify(context.response).length * 2;
                // console.log(
                //     `Operation ${op} completed in ${elapsed} ms and returned ${size} bytes`
                // );
            }
        };
    }
}

const getMyApolloServerPlugin = () => {
    return new MyApolloServerPlugin();
};

module.exports = {
    MyApolloServerPlugin: MyApolloServerPlugin,
    getMyApolloServerPlugin: getMyApolloServerPlugin
};


