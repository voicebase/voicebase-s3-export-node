'use strict'

const S3CmdConfiguration = require('./s3cmd-configuration');

module.exports = class Configuration {
  constructor(options) {

    const s3CmdConfig = new S3CmdConfiguration(options.config);

    this.accessKey = s3CmdConfig.accessKey;
    this.secretKey = s3CmdConfig.secretKey;

    this.bucket = options.bucket;
    this.region = options.region;

    this.files = options.file;
    this.verbose = options.verbose;
    this.simulate = options.simulate;
    this.dryRun = options['dry-run'];
    this.ttlMinutes = options['ttl-minutes'] || 60;
    this.contentType = options['content-type'] || "application/octet-stream";
    this.attachment = options.attachment;
  }
}
