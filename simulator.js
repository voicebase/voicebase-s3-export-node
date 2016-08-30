'use strict'

const rp = require('request-promise');

module.exports = class Simulator {
  constructor() { }

  simulate(filename, preSignedUrl, verbose) {
    const body = this.jsonBody(filename);
    const options = {
      method: 'PUT',
      uri: preSignedUrl,
      headers: {
        'Content-Type' : 'application/json'
      },
      body: body,
      json: true,
      resolveWithFullResponse: true
    };

    rp(options).then( 
      (response) => {
        console.log(
          verbose ?
          `Simulated PUT callback for ${filename} to ${preSignedUrl}:
          ${JSON.stringify(body)}
          Response: ${response.statusCode}`
          : `Simulated PUT callback for ${filename}`
        );
      }
    ).catch(
      (err) => {
        console.log(
          `Failed Simulating PUT for ${filename} to ${preSignedUrl}:
          ${JSON.stringify(body)}
          ${err}`
        );
      }
    );
    
  }

  jsonBody(filename) {
    return {
      success: true,
      warnings: [
        { 
          message: `This data for ${filename} is simulated, and not real.` 
        }
      ],
      callback: {
        status: 'simulated'
      },
      media: { }
    }
  }
}
