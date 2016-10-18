'use strict'

const AWS = require('aws-sdk');

module.exports = class S3UrlPreSigner {
  constructor(bucket, region, accessKeyId, secretAccessKey) {
    if (! ( bucket && region && accessKeyId && secretAccessKey)) {
      throw new Error(
        'bucket, region, accessKeyId, and secretAccessKey are required.'
      );
    }

    AWS.config.update({ accessKeyId, secretAccessKey, region });
    this.s3 = new AWS.S3();
    
    this.bucket = bucket;
  }

  signForPut(key, ttlInSeconds, contentType) {
    const params = { 
      Bucket: this.bucket, 
      Key: key, 
      ContentType: contentType,
      Expires: ttlInSeconds
    };
    return this.s3.getSignedUrl('putObject', params);
  }
}