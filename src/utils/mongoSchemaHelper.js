const getSchemaOfMongoDocument = (prefix, obj, indent) => {
    let result = {};
    for (const key in obj) {
        if (typeof obj[`${key}`] !== 'function') { //we don't want to print functions
            const specificDataTypes = [Date, Array]; //specify the specific data types you want to check
            let type = null;
            for (const specificDataType of specificDataTypes) { // looping over [Date,Array]
                if (obj[`${key}`] instanceof specificDataType) { //if the current property is instance of the DataType
                    type = specificDataType.name; //get its name
                    break;
                }
            }
            const keyName = prefix ? `${prefix}.${key}` : key;
            const keyType = type || typeof obj[`${key}`];
            console.log(indent, keyName, keyType);
            const query = {};
            query[`${keyName}`] = keyType;
            result = Object.assign(result, query);
            if (typeof obj[`${key}`] === 'object') { //if current property is of object type, print its sub properties too
                const child = getSchemaOfMongoDocument(keyName, obj[`${key}`], indent + '\t');
                result = Object.assign(result, child);
            }
        }
    }
    return result;
};

module.exports = {
    getSchemaOfMongoDocument: getSchemaOfMongoDocument
};
