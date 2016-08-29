'use strict'

const path = require('path');
const S3UrlPreSigner = require('./s3-url-pre-signer');

module.exports = class Uploader {
  constructor(configuration) {
    this.configuration = configuration;
  }

  run() {
    this.signer = new S3UrlPreSigner(
      this.configuration.bucket,
      this.configuration.region,
      this.configuration.accessKey,
      this.configuration.secretKey
    );

    for (let file of this.configuration.files) {

      let basename = path.basename(file);
      let key = `${basename}.json`;
      let url = this.signer.signForPut(key);

      if (this.configuration.verbose) {
        console.log('******************');
        console.log('Source File:', file);
        console.log('Target Key:', key);
        console.log('Pre-Signed Url:', url);
        console.log();
      }
    }
  }

  simulate(url, basename) {
    
  }
}