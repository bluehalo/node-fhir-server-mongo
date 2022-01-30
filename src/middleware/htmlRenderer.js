/**
 * This middleware detects if the request is from a web browser user-agent and returns HTML rendered views
 */
const {resourceDefinitions} = require('../utils/resourceDefinitions');

const htmlRenderer = (req, res, next) => {
    // console.log('--- user agent ----');
    // console.log(req.useragent);
    const parts = req.url.split(/[/?,&]+/);
    // console.log('----- parts -----');
    // console.log(parts);
    // console.log(parts.length);
    if (parts && parts.length > 2 && !parts.includes('raw=1') && parts[1] === '4_0_0') {
        const resourceName = parts[2];
        if (req.accepts('text/html') && req.method === 'GET' && req.useragent && req.useragent.isDesktop) {
            // override the json function, so we can intercept the data being sent the client
            let oldJson = res.json;
            res.json = (data) => {
                // const myReq = req;
                // const myReq = req;
                let parsedData = JSON.parse(JSON.stringify(data));
                // console.log(parsedData); // do something with the data
                let total = 0;
                if (parsedData.total) {
                    total = parsedData.total;
                }
                let meta = null;
                if (parsedData.meta) {
                    meta = parsedData.meta;
                }
                if (parsedData.entry) {
                    parsedData = parsedData.entry.map((entry) => entry.resource);
                } else if (!Array.isArray(parsedData)) {
                    parsedData = [parsedData];
                }

                res.json = oldJson; // set function back to avoid the 'double-send'
                // return res.json(data); // just call as normal with data
                res.set('Content-Type', 'text/html');
                // This is so we can include the bootstrap css from CDN
                // res.set('Content-Security-Policy', "style-src 'self' stackpath.bootstrapcdn.com;");
                res.set('Cache-Control', 'no-cache, no-store, must-revalidate'); // HTTP 1.1.
                res.set('Pragma', 'no-cache'); // HTTP 1.0.
                res.set('Expires', '0'); // Proxies.
                // console.log('resource: ' + resourceName);
                const env = require('var');

                const resourceDefinition = resourceDefinitions.find(r => r.name === resourceName);

                const options = {
                    meta: meta,
                    resources: parsedData,
                    url: req.url,
                    idpUrl: env.AUTH_CODE_FLOW_URL,
                    clientId: env.AUTH_CODE_FLOW_CLIENT_ID,
                    total: total,
                    resourceDefinition: resourceDefinition,
                    environment: env.ENV || 'local'
                };

                if (resourceDefinition) {
                    return res.render(__dirname + '/../views/pages/' + resourceName, options);
                } else {
                    return res.render(__dirname + '/../views/pages/index', options);
                }
            };
        }
    }
    next();
};

module.exports.htmlRenderer = htmlRenderer;
