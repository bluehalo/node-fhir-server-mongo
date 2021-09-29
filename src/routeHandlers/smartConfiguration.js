const env = require('var');
const https = require('https');

module.exports.handleSmartConfiguration = (req, res) => {
    if (env.AUTH_CONFIGURATION_URI) {
        https.get(env.AUTH_CONFIGURATION_URI, (resp) => {
            let data = '';

            // A chunk of data has been received.
            resp.on('data', (chunk) => {
                data += chunk;
            });

            // The whole response has been received. Print out the result.
            resp.on('end', () => {
                res.json(JSON.parse(data));
            });

        }).on('error', (err) => {
            console.log('Error: ' + err.message);
            res.json({'error': err.message});
        });
    } else {
        return res.json();
    }
};
