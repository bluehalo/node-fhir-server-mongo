const htmlRenderer = (req, res, next) => {
    // console.log('--- user agent ----');
    // console.log(req.useragent);
    const parts = req.url.split(/[/?,&]+/);
    // console.log('----- parts -----');
    // console.log(parts);
    // console.log(parts.length);
    if (parts && parts.length > 2 && !parts.includes('raw=1') && parts[1] === '4_0_0') {
        const resourceName = parts[2].toLowerCase();
        if (req.accepts('text/html') && req.method === 'GET' && req.useragent && req.useragent.isDesktop) {
            // override the json function so we can intercept the data being sent the client
            let oldJson = res.json;
            res.json = (data) => {
                // const myReq = req;
                // const myReq = req;
                let parsedData = JSON.parse(JSON.stringify(data));
                // console.log(parsedData); // do something with the data
                if (parsedData.entry) {
                    parsedData = parsedData.entry.map((entry) => entry.resource);
                } else if (!Array.isArray(parsedData)) {
                    parsedData = [parsedData];
                }
                res.json = oldJson; // set function back to avoid the 'double-send'
                // return res.json(data); // just call as normal with data
                res.set('Content-Type', 'text/html');
                // This is so we can include the bootstrap css from CDN
                res.set('Content-Security-Policy', "style-src 'self' stackpath.bootstrapcdn.com;");
                // console.log('resource: ' + resourceName);
                const customViews = ['patient', 'practitioner', 'practitionerrole', 'location', 'organization', 'explanationofbenefit'];
                const options = {resources: parsedData, url: req.url};
                if (customViews.includes(resourceName)) {
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
