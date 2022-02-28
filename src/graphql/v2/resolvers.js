/**
 * Merges all the resolvers in the resolvers folder
 */

const path = require('path');
const { mergeResolvers } = require('@graphql-tools/merge');
const { loadFilesSync } = require('@graphql-tools/load-files');

// https://www.graphql-tools.com/docs/schema-merging#merging-resolvers
const resolversArray = loadFilesSync(path.join(__dirname, './resolvers'));

module.exports = mergeResolvers(resolversArray);
