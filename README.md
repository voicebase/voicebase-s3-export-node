# voicebase-s3-export-node
Node.js proof-of-concept for VoiceBase S3 export

## Introduction
This proof-of-concept helps demonstrate how customers can use the `PUT callbacks` in VoiceBase so export their results to S3.

At a high-level, the process is:
(a) use your S3-enabled AWS keys to generate a pre-signed url
(b) use the pre-signed url as part of your `configuration` attachment on `/media` `POST`
(c) repeat for each media file

## Example output

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

  node index.js --config ~/.s3cfg --bucket my-bucket --region us-east-1 \       
  --verbose --simulate \                                                        
  alpha.mp3 bravo.mp3 charlie.mp3 
