const {GraphQLScalarType, Kind} = require('graphql');

const decimalScalar = new GraphQLScalarType({
    name: 'decimal',
    description: 'decimal custom scalar type',
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
    decimal: decimalScalar,
};
