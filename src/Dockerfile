FROM node:14-slim

RUN apt-get -qq update
RUN apt-get -qq install -y --no-install-recommends \
  git \
  ca-certificates \
  openssh-client \
  python \
  build-essential
RUN git clone --depth 1 --branch v1.2.0 https://github.com/TimothyJones/github-cognito-openid-wrapper
WORKDIR /github-cognito-openid-wrapper
RUN npm ci
RUN npm run build
RUN mv dist-lambda /asset
