/**
 * This middleware detects if the request is from a web browser user-agent and returns HTML rendered views
 */
const {resourceDefinitions} = require('../utils/resourceDefinitions');
const {
    searchFormData,
    advSearchFormData,
    lastUpdateStart,
    lastUpdateEnd,
    hasNext,
    hasPrev,
    pageIndex,
    limit,
} = require('../utils/searchForm.util');

const htmlRenderer = (req, res, next) => {
    const parts = req.url.split(/[/?,&]+/);
    if (parts && parts.length > 2 && !parts.includes('raw=1') && parts[1] === '4_0_0') {
        const resourceName = parts[2];
        // If the request is from a browser for HTML then return HTML page instead of json
        if (
            (req.accepts('text/html') && !req.headers.accept.includes('application/fhir+json')) // if the request is for HTML
            && (req.method === 'GET' || req.method === 'POST') // and this is a GET or a POST
            && (req.useragent && req.useragent.isDesktop) // Postman sends */* so we need this to avoid sending html to Postman
        ) {
            // override the json function, so we can intercept the data being sent the client
            let oldJson = res.json;
            res.json = (data) => {
                let parsedData = JSON.parse(JSON.stringify(data));
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
                res.set('Content-Type', 'text/html');
                res.set('Cache-Control', 'no-cache, no-store, must-revalidate'); // HTTP 1.1.
                res.set('Pragma', 'no-cache'); // HTTP 1.0.
                res.set('Expires', '0');
                const env = require('var');

                const resourceDefinition = resourceDefinitions.find((r) => r.name === resourceName);

                const options = {
                    meta: meta,
                    resources: parsedData,
                    url: req.url,
                    idpUrl: env.AUTH_CODE_FLOW_URL,
                    clientId: env.AUTH_CODE_FLOW_CLIENT_ID,
                    total: total,
                    resourceDefinition: resourceDefinition,
                    environment: env.ENV || 'local',
                    formData: searchFormData(req, resourceName),
                    advSearchFormData: advSearchFormData(req, resourceName),
                    resourceName: resourceName,
                    currentYear: new Date().getFullYear(),
                    lastUpdateStart: lastUpdateStart(req, 'above'),
                    lastUpdateEnd: lastUpdateEnd(req, 'below'),
                    hasNext: hasNext(req, total),
                    hasPrev: hasPrev(req),
                    pageIndex: pageIndex(req),
                    limit: limit,
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
