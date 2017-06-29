'use strict'

const path = require('path');
const S3UrlPreSigner = require('./s3-url-pre-signer');
const Simulator = require('./simulator');

module.exports = class Uploader {
  constructor(configuration) {
    this.configuration = configuration;
    if (this.configuration.simulate) {
      this.simulator = new Simulator();
    }
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
      let key = this.configuration.attachment
        ? basename : `${basename}.json`;
      let ttlSeconds = this.configuration.ttlMinutes * 60;
      let contentType = this.configuration.attachment
        ? this.configuration.contentType : 'application/json';
      let url = this.signer.signForPut(key, ttlSeconds, contentType);

      if (this.configuration.verbose) {
        console.log('******************');
        console.log('Source File:', file);
        console.log('Target Key:', key);
        console.log('Pre-Signed Url:', url);
        console.log();
      }

      if (this.configuration.simulate) {
        this.simulator.simulate(basename, url, this.configuration.verbose);
      } else if (this.configuration.dryRun) {
        this.dryRun(basename, url)
      }
    }
  }

  dryRun(basename, url) {
    const configuration = JSON.stringify({
      "configuration" : {
        "executor" : "v2",
        "publish" : {
          "callbacks" : [
            {
              "method" : "PUT",
              "url" : url,
              "include" : [
                  "transcripts",
                  "keywords",
                  "topics",
                  "metadata"
              ]
            }
          ]
        }
      }
    });

    const curl =
    `curl --header 'Authorization: Bearer \$token' \\
    https://apis.voicebase.com/v2-beta/media \\
    --form media=@${basename} \\
    --form 'configuration=${configuration}'`;

    console.log(curl);
  }
}
