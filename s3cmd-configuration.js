'use strict'

const ini = require('node-ini');

module.exports = class S3CmdConfiguration {
  constructor(path) {
    const s3cfg = ini.parseSync(path);

    if (! s3cfg) {
      throw new Error(`Could not find or parse file ${path}`);
    }

    const defaultSection = s3cfg['default'];
    if (! defaultSection) {
      throw new Error(`Could not find default section in ${path}`);
    }

    this.accessKey = defaultSection['access_key'];
    if (! this.accessKey) {
      throw new Error(`Could not find access_key in ${path}`);
    }

    this.secretKey = defaultSection['secret_key'];
    if (! this.secretKey) {
      throw new Error(`Could not find secret_key in ${path}`);
    }
  }
}