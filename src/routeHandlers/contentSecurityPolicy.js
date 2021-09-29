const env = require('var');
module.exports.handleSecurityPolicy = function (req, res, next) {
    res.setHeader(
        'Content-Security-Policy',
        "default-src 'self'; object-src data: 'unsafe-eval'; font-src 'self' https://fonts.gstatic.com; img-src 'self' 'unsafe-inline' 'unsafe-hashes' 'unsafe-eval' data: http://cdn.jsdelivr.net; script-src 'self' 'unsafe-inline' https://ajax.googleapis.com/ https://cdnjs.cloudflare.com http://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com/ http://cdn.jsdelivr.net; frame-src 'self'; connect-src 'self' " + env.AUTH_CODE_FLOW_URL + '/oauth2/token;'
    );
    next();
};
