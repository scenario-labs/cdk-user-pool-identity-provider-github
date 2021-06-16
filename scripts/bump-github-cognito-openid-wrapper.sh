#!/bin/bash

ORIGINAL_DIR=`pwd`
cd /tmp
rm -rf github-cognito-openid-wrapper
git clone https://github.com/TimothyJones/github-cognito-openid-wrapper.git
cd github-cognito-openid-wrapper
npm ci
npm run build
rm -rf $ORIGINAL_DIR/vendor/github-cognito-openid-wrapper
mv dist-lambda $ORIGINAL_DIR/vendor/github-cognito-openid-wrapper
mv LICENSE $ORIGINAL_DIR/vendor/github-cognito-openid-wrapper
cd ..
rm -rf github-cognito-openid-wrapper
