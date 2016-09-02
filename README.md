# voicebase-s3-export-node
Node.js proof-of-concept for VoiceBase S3 export

## Introduction
This proof-of-concept helps demonstrate how customers can use `PUT callbacks` in VoiceBase to export their results to S3.

At a high-level, the process is:
(a) use your S3-enabled AWS keys to generate a pre-signed url
(b) use the pre-signed url as part of your `configuration` attachment on `/media` `POST`
(c) repeat for each media file

## Prerequisites

This tool is designed to work with AWS keys (access key id and secret key) and `s3cmd` for configuring S3 access and verifying results. First, configure `s3cmd` with the AWS keys you plan to use. The key needs to have `s3:PutObject` permissions on the bucket you plan to use. The `s3:GetObject`, `s3:DeleteObject`, and `s3:ListBucket` permissions are also recommended for verification using s3cmd but not required.

```bash
s3cmd --configure --config=~/.s3cfg-export
```

## Example output

```bash
VoiceBase S3 export proof-of-concept app

  Demonstrates S3 export using PUT callbacks. 

Options

  --config file     An s3cmd-compatible configuration file.                    
  --bucket bucket   The S3 bucket where to put results.                        
  --region region   The S3 region where the bucket resides.                    
  --verbose         Print detailed diagnostic information.                     
  --simulate        Simulate the behavior of PUT callbacks instead of running.
  --file file       File to upload for processing (may be repeated).           
  -h, --help        Print this usage guide.                                    

Example

  node index.js \
  --config ~/.s3cfg-export \
  --bucket my-bucket \
  --region us-east-1 \       
  --verbose \ 
  --simulate \                                                        
  alpha.mp3 bravo.mp3 charlie.mp3 
```

After the tool completes its simulation, you can view the results by running:
```bash
s3cmd ls s3://my-bucket
```

Which should list (for this example):
```text
alpha.mp3.json
bravo.mp3.json
charlie.mp3.json
```
