const AWS = require('aws-sdk');
const logger = require('@asymmetrik/node-fhir-server-core').loggers.get();
const Sentry = require('./sentry');

const ACCESS_KEY = process.env.AWS_ACCESS_KEY_ID;
const ACCESS_SECRET =
    process.env.AWS_SECRET;
const AWS_BUCKET = process.env.AWS_BUCKET || 'fhir-server';
const REGION = process.env.AWS_REGION || 'us-east-1';
const AWS_FOLDER = process.env.AWS_FOLDER;

const s3 = new AWS.S3({
    accessKeyId: ACCESS_KEY,
    secretAccessKey: ACCESS_SECRET,
    region: REGION,
});

/**
 * @function sendToS3
 * @description In case of FHIR Server failure, dump form body to S3
 * @param resourceType
 * @param {*} resource - parsed form body
 * @param currentDate
 * @param {*} id - first name for key
 * @return {Promise<data|err>}
 */
module.exports = function sendToS3(resourceType, resource, currentDate, id) {
    if (!ACCESS_KEY){
        return Promise.resolve(null);
    }
    return new Promise((resolve, reject) => {
        const key = `${AWS_FOLDER}/${resourceType}/${currentDate}/${id}.json`;
        const params = {
            Body: JSON.stringify(resource),
            Bucket: AWS_BUCKET,
            Key: key,
            ContentType: 'application/json',
            ServerSideEncryption: 'AES256',
        };
        s3.putObject(params, function (err, data) {
            if (err) {
                logger.error('[AWS-S3] Failed to put object' + key + ' in bucket: ');
                logger.error(
                    '[AWS-S3] Object: ',
                    JSON.stringify(resource)
                );
                logger.error('[AWS-S3] Error: ' + key + ':', err);
                Sentry.captureException(err);
                return reject(err);
            } else {
                logger.info('[AWS-S3] Successfully placed object in bucket');
                return resolve(data);
            }
        });
    });
};
