# UserPoolIdentityProviderGithub CDK construct

This library bundles the [GitHub OpenID Connect Wrapper for Cognito](https://github.com/TimothyJones/github-cognito-openid-wrapper) as a CDK construct, instead of the original SAM implementation.

## Usage

```ts
import { UserPool } from 'aws-cdk/aws-cognito';
import { UserPoolIdentityProviderGithub } from 'user-pool-identity-provider-github';

const userPool = new UserPool(stack, 'UserPool');
new UserPoolIdentityProviderGithub(this, 'UserPoolIdentityProviderGithub', {
  userPool,
  clientId: 'myClientId',
  clientSeret: 'myClientSecret',
  cognitoHostedUiDomain: 'https://auth.domain.com',
});
```

## Documentation

See [API](./API.md).

## Contributing

Feedback and pull requests are more than welcome 🤗

This project uses the [projen](https://github.com/projen/projen) project generator. Learn how to use it for CDK constructs [here](https://github.com/projen/projen/blob/main/docs/awscdk-construct.md).

Note that the github-cognito-openid-wrapper code is vendored [here](./vendor/github-cognito-openid-vendor). To benefit from newer versions, run the following command:

```bash
./scripts/bump-github-cognito-openid-wrapper.sh
```
