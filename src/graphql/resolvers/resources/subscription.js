
const {search} = require('../../../operations/search/search');
const {unBundle} = require('../../common');

module.exports = {
    Query: {
        // noinspection JSUnusedLocalSymbols
        // eslint-disable-next-line no-unused-vars
        subscription: async (parent, args, context, info) => {
            return unBundle(
                await (
                    search(
                        {
                            base_version: '4_0_0',
                            _bundle: '1',
                            ...args
                        },
                        context.user,
                        context.scope,
                        'Subscription',
                        'Subscription'
                    )
                )
            );
        }
    }
};

