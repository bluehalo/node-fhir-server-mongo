/**
 * This route handler implements the /version endpoint which returns the current version of the code
 */

const env = require('var');
module.exports.handleVersion = (req, res) => {
    const image = env.DOCKER_IMAGE || '';
    if (image) {
        return res.json({version: image.slice(image.lastIndexOf(':') + 1), image: image});
    } else {
        return res.json({version: 'unknown', image: 'unknown'});
    }
};
