FROM node:14-slim
ARG GIT_URL

RUN apt-get -qq update
RUN apt-get -qq install -y --no-install-recommends \
  git \
  ca-certificates \
  openssh-client \
  python \
  build-essential
RUN git clone --depth 1 --branch v1.2.0 ${GIT_URL}
WORKDIR /github-cognito-openid-wrapper
RUN npm ci
RUN npm run build
RUN mv dist-lambda /asset
