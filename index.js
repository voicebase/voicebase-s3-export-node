'use strict'

const commandLineArgs = require('command-line-args');
const commandLineUsage = require('command-line-usage');
const Configuration = require('./configuration');
const Uploader = require('./uploader');

const options = parseCommandLineOptionsOrExitWithUsage();

const config = new Configuration(options);

new Uploader(config).run();



function parseCommandLineOptionsOrExitWithUsage() {
  const optionDefinitions = defineOptions();
  
  try {
    const options = commandLineArgs(optionDefinitions)

    if (options.help) { showUsageAndExit(optionDefinitions); }

    validateCommandLineOptions(options);

    return options;
  } catch (e) { 
    showUsageAndExit(optionDefinitions, e); 
  }
}

function validateCommandLineOptions(options) {
  for(let parameter of ['config', 'bucket', 'region', 'file']) {
    if (! (parameter in options)) {
      throw new Error(`--${parameter} is a required parameter`);
    }
  }

  if (options.file.length < 1) {
    throw new Error('Must have at least one file to process');
  }

  const isDryRun = 'dry-run' in options;
  const isSimulate = 'simulate' in options;
  if (isDryRun && isSimulate) {
    throw new Error('--dry-run and --simulate are mutually exclusive');
  }

  if ((! isDryRun) && (! isSimulate)) {
    throw new Error('One of --dry-run or --simulate is required');
  }
}

function defineOptions() {
  return [
    { 
      name: 'config', 
      type: String,
      typeLabel: '[underline]{file}',
      description: 'An s3cmd-compatible configuration file.'
    },
    {
      name: 'bucket',
      type: String,
      typeLabel: '[underline]{bucket}',
      description: 'The S3 bucket where to put results.'
    },
    {
      name: 'region',
      type: String,
      typeLabel: '[underline]{region}',
      description: 'The S3 region where the bucket resides.'
    },
    {
      name: 'verbose',
      type: Boolean,
      description: 'Print detailed diagnostic information.'
    },
    {
      name: 'simulate',
      type: Boolean,
      description: 'Simulate the behavior of PUT callbacks instead of running.'
    },
    {
      name: 'dry-run',
      type: Boolean,
      description: 'Print upload commands to the console instead of running them.'
    },
    {
      name: 'attachment',
      type: Boolean,
      description: 'Treat as a redacted media attachment signing request.'
    },
    {
      name: 'ttl-minutes',
      type: Number,
      typeLabel: '[underline]{minutes}',
      description: 'The Time-To-Live of the pre-signed url in minutes.'
    },
    {
      name: 'file',
      type: String,
      typeLabel: '[underline]{file}',
      multiple: true,
      defaultOption: true,
      description: 'File to upload for processing (may be repeated).'
    },
    {
      name: 'help',
      alias: 'h',
      type: Boolean,
      description: 'Print this usage guide.'
    }
  ]
}

function showUsageAndExit(optionDefinitions, e) {
  const usageSections = [
    {
      header: 'VoiceBase S3 export proof-of-concept app',
      content: 'Demonstrates [italic]{S3 export} using [italic]{PUT callbacks}.'
    },
    {
      header: 'Options',
      optionList: optionDefinitions
    },
    {
      header: 'Example',
      content: 
        `node index.js \\
        --config ~/.s3cfg \\
        --bucket my-bucket \\
        --region us-east-1 \\
        --verbose \\
        --dry-run \\
        alpha.mp3 bravo.mp3 charlie.mp3`
    }
  ];

  if (e) {
    usageSections.unshift({
      header: 'Error',
      content: e.message
    });
  }

  const usage = commandLineUsage(usageSections);
  console.log(usage);

  process.exit(1);
}



