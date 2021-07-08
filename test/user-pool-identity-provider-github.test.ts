import { anything, SynthUtils } from '@aws-cdk/assert';
import '@aws-cdk/assert/jest';
import { UserPool } from '@aws-cdk/aws-cognito';
import { Stack } from '@aws-cdk/core';
import { UserPoolIdentityProviderGithub } from '../src';

const clientId = 'myClientId';
const clientSecret = 'myClientSecret';
const cognitoHostedUiDomain = 'https://cognito.domain';

expect.addSnapshotSerializer({
  test: val => typeof val === 'string',
  print: val => {
    const newVal = (val as string).replace(/AssetParameters([A-Fa-f0-9]{64})(\w+)/, '[HASH REMOVED]');
    const newVal2 = newVal.replace(/(\w+) (\w+) for asset\s?(version)?\s?"([A-Fa-f0-9]{64})"/, '[HASH REMOVED]');
    return `"${newVal2}"`;
  },
});

test('snapshot', () => {
  const stack = new Stack();
  new UserPoolIdentityProviderGithub(stack, 'UserPoolIdentityProviderGithub', {
    clientId,
    clientSecret,
    userPool: new UserPool(stack, 'UserPool'),
    cognitoHostedUiDomain,
  });
  expect(SynthUtils.toCloudFormation(stack)).toMatchSnapshot();
});

function checkFunction(stack: Stack, functionName: string) {
  expect(stack).toHaveResource('AWS::Lambda::Function', {
    Handler: `${functionName}.handler`,
    Environment: {
      Variables: {
        COGNITO_REDIRECT_URI: `${cognitoHostedUiDomain}/oauth2/idpresponse`,
        GITHUB_API_URL: 'https://api.github.com',
        GITHUB_CLIENT_ID: clientId,
        GITHUB_CLIENT_SECRET: clientSecret,
        GITHUB_LOGIN_URL: 'https://github.com',
      },
    },
    Runtime: 'nodejs14.x',
    Timeout: 900,
  });
}

test('resources', () => {
  const stack = new Stack();
  new UserPoolIdentityProviderGithub(stack, 'UserPoolIdentityProviderGithub', {
    clientId,
    clientSecret,
    userPool: new UserPool(stack, 'UserPool'),
    cognitoHostedUiDomain,
  });

  expect(stack).toHaveResource('AWS::ApiGateway::RestApi');

  checkFunction(stack, 'openIdConfiguration');
  checkFunction(stack, 'authorize');
  checkFunction(stack, 'token');
  checkFunction(stack, 'userinfo');
  checkFunction(stack, 'jwks');

  expect(stack).toHaveResource('AWS::Cognito::UserPoolIdentityProvider', {
    AttributeMapping: {
      email: 'email',
      email_verified: 'email_verified',
      name: 'name',
      picture: 'picture',
      preferred_username: 'preferred_username',
      profile: 'profile',
      updated_at: 'updated_at',
      username: 'sub',
      website: 'website',
    },
    ProviderDetails: {
      attributes_request_method: 'GET',
      attributes_url: anything(),
      authorize_scopes: 'openid read:user user:email',
      authorize_url: anything(),
      client_id: 'myClientId',
      client_secret: 'myClientSecret',
      jwks_uri: anything(),
      oidc_issuer: anything(),
      token_url: anything(),
    },
    ProviderName: 'Github',
    ProviderType: 'OIDC',
  });
});
