# UserPoolIdentityProviderGithub CDK construct

This library bundles the [GitHub OpenID Connect Wrapper for Cognito](https://github.com/TimothyJones/github-cognito-openid-wrapper) as a CDK construct, instead of the original SAM implementation.

The goal behind is to make it as easy to use GitHub as an identity provider as officially supported identity providers. Under the hood, it creates additional resources (a REST API and 5 Lambda functions) to connect Cognito to GitHub.

## Install

### npm

```bash
npm install --save cdk-user-pool-identity-provider-github
```

### Go, Maven, NuGet, PyPI

Other package managers aren't supported yet, but they could be easily. Let us know your needs by [opening an issue](https://github.com/scenario-labs/cdk-user-pool-identity-provider-github/issues/new).

## Usage

This construct works in a similar way than [officially supported identity providers](https://docs.aws.amazon.com/cdk/api/latest/docs/aws-cognito-readme.html#identity-providers).

See [API](./API.md) for a full reference.

### Basic setup

If you already have a user pool with a client and a hosted UI with a custom domain, then you can simply do:

```ts
import { UserPoolIdentityProviderGithub } from 'cdk-user-pool-identity-provider-github';

new UserPoolIdentityProviderGithub(this, 'UserPoolIdentityProviderGithub', {
  userPool: myUserPool,
  clientId: 'myClientId',
  clientSecret: 'myClientSecret',
  cognitoHostedUiDomain: 'https://auth.domain.com',
});
```

### Full setup

The following snippet does the following:
- Create a user pool
- Configure the hosted UI with a custom domain
- Create a Github identity provider for the user pool
- Create a user pool client with Cognito and Github as identity providers

```ts
import { DnsValidatedCertificate } as acm from '@aws-cdk/aws-certificatemanager';
import { UserPool } from '@aws-cdk/aws-cognito';
import { ARecord, RecordTarget } from '@aws-cdk/aws-route53';
import { UserPoolIdentityProviderGithub } from 'cdk-user-pool-identity-provider-github';

// Parameters
const userPoolDomainName = 'https://auth.domain.com';
const callbackUrls = ['https://www.domain.com'];
const logoutUrls = ['https://www.domain.com'];
const githubClientId = 'githubClientId';
const githubClientSecret = 'githubClientSecret';

// User pool
const userPool = new UserPool(stack, 'UserPool');

// Hosted UI with custom domain
const userPoolDomain = userPool.addDomain('UserPoolDomain', {
  customDomain: {
    certificate: new DnsValidatedCertificate(this, 'Certificate', {
      domainName: userPoolDomainName,
      hostedZone: props.hostedZone,
      region: 'us-east-1', // Cloudfront only checks this region for certificates.
    }),
    domainName: userPoolDomainName,
  },
});
new ARecord(this, 'CustomDomainAliasRecord', {
  zone: props.hostedZone,
  recordName: userPoolDomainName,
  target: RecordTarget.fromAlias({
    bind: () => ({
      hostedZoneId: 'Z2FDTNDATAQYW2', // CloudFront Zone ID
      dnsName: userPoolDomain.cloudFrontDomainName,
    }),
  }),
});

// Github identity provider
new UserPoolIdentityProviderGithub(this, 'UserPoolIdentityProviderGithub', {
  userPool,
  clientId: githubClientId,
  clientSecret: githubClientSecret,
  cognitoHostedUiDomain: userPoolDomainName,
});

// User pool client
const userPoolClient = userPool.addClient('UserPoolClient', {
  oAuth: {
    callbackUrls,
    logoutUrls,
  },
  supportedIdentityProviders: [
    cognito.UserPoolClientIdentityProvider.COGNITO,
    cognito.UserPoolClientIdentityProvider.custom('Github'),
  ],
});
userPoolClient.node.addDependency(userPoolIdentityProviderGithub);
```

## Contributing

Feedback and pull requests are more than welcome 🤗

This project uses the [projen](https://github.com/projen/projen) project generator. Learn how to use it for CDK constructs [here](https://github.com/projen/projen/blob/main/docs/awscdk-construct.md).

Please use [conventional commits](https://www.conventionalcommits.org) to ease automated versioning and changelog generation.

Note that the github-cognito-openid-wrapper version is defined [here](./src/Dockerfile). To benefit from newer versions, please update the git tag in the Dockerfile.

## License

This code is distributed under MIT license, that you can read [here](./LICENSE).

It also redistributes code from [GitHub OpenID Connect Wrapper for Cognito](https://github.com/TimothyJones/github-cognito-openid-wrapper), distributed under BSD 3-Clause license, that you can read [here](https://github.com/TimothyJones/github-cognito-openid-wrapper/blob/master/LICENSE).
