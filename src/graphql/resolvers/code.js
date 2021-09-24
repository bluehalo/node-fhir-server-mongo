const {GraphQLScalarType, Kind} = require('graphql');

const codeScalar = new GraphQLScalarType({
    name: 'code',
    description: 'code custom scalar type',
    serialize(value) {
        return value;
    },
    parseValue(value) {
        return value;
    },
    parseLiteral(ast) {
        if (ast.kind === Kind.STRING) {
            return ast.value;
        }
        return null;
    },
});

module.exports = {
    code: codeScalar,
};
