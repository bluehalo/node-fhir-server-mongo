const {GraphQLScalarType, Kind} = require('graphql');

const simpleQuantityScalar = new GraphQLScalarType({
    name: 'SimpleQuantity',
    description: 'code custom scalar type',
    serialize(value) {
        return value;
    },
    parseValue(value) {
        return value;
    },
    parseLiteral(ast) {
        if (ast.kind === Kind.INT) {
            return ast.value;
        }
        return null;
    },
});

module.exports = {
    SimpleQuantity: simpleQuantityScalar,
};
