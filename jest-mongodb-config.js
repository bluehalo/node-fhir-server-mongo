/**
 * Config used when running unit tests
 */
module.exports = {
    mongodbMemoryServerOptions: {
        binary: {
            version: '4.0.3',
            skipMD5: true,
        },
        instance: {
            dbName: 'jest',
        },
        autoStart: false
    }
};
