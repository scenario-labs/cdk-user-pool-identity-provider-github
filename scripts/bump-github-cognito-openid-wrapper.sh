#!/bin/bash -eu
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")"; pwd)"  # Figure out where the script is running

PROJECT_ROOT_DIR="${SCRIPT_DIR}/.."
VENDOR_DIR="${PROJECT_ROOT_DIR}/vendor/github-cognito-openid-wrapper"

(
  cd /tmp
  rm -rf github-cognito-openid-wrapper
  git clone https://github.com/TimothyJones/github-cognito-openid-wrapper.git
  (
    cd github-cognito-openid-wrapper
    npm ci
    npm run build
    rm -rf "$VENDOR_DIR"
    mv dist-lambda "$VENDOR_DIR"
    mv LICENSE "$VENDOR_DIR"
  )
  rm -rf github-cognito-openid-wrapper
)
