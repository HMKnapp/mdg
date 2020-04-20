#!/bin/bash

aws s3 sync "public/" "s3://${AWS_S3_BUCKET}/mdg-test"
