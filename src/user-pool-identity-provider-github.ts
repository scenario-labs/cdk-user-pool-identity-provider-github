import * as path from 'path';
import { LambdaIntegration, RestApi } from '@aws-cdk/aws-apigateway';
import { CfnUserPoolIdentityProvider, UserPool } from '@aws-cdk/aws-cognito';
import { Code, Function, Runtime } from '@aws-cdk/aws-lambda';
import { Construct, Duration } from '@aws-cdk/core';

export interface IUserPoolIdentityProviderGithubProps {
  /**
   * The user pool.
   */
  userPool: UserPool;
  /**
   * The client id recognized by Github APIs.
   */
  clientId: string;
  /**
   * The client secret to be accompanied with clientId for Github APIs to authenticate the client.
   */
  clientSecret: string;
  /**
   * The Cognito hosted UI domain.
   */
  cognitoHostedUiDomain: string;
}

/**
 * GitHub OpenID Connect Wrapper for Cognito
 *
 * @example
 *
 * new UserPoolIdentityProviderGithub(this, 'UserPoolIdentityProviderGithub', {
 *   userPool: new UserPool(stack, 'UserPool'),
 *   clientId: 'myClientId',
 *   clientSeret: 'myClientSecret',
 *   cognitoHostedUiDomain: 'https://auth.domain.com',
 * });
 */
export class UserPoolIdentityProviderGithub extends Construct {
  public userPoolIdentityProvider: CfnUserPoolIdentityProvider;

  constructor(
    scope: Construct,
    id: string,
    props: IUserPoolIdentityProviderGithubProps,
  ) {
    super(scope, id);

    const api = new RestApi(this, 'RestApi');

    const wellKnownResource = api.root.addResource('.well-known');

    const commonFunctionProps = {
      code: Code.fromAsset(
        path.join(__dirname, '../vendor/github-cognito-openid-wrapper'),
      ),
      environment: {
        GITHUB_CLIENT_ID: props.clientId,
        GITHUB_CLIENT_SECRET: props.clientSecret,
        COGNITO_REDIRECT_URI: `${props.cognitoHostedUiDomain}/oauth2/idpresponse`,
        GITHUB_API_URL: 'https://api.github.com',
        GITHUB_LOGIN_URL: 'https://github.com',
      },
      runtime: Runtime.NODEJS_14_X,
      timeout: Duration.minutes(15),
    };
    const openIdDiscoveryFunction = new Function(
      this,
      'OpenIdDiscoveryFunction',
      {
        ...commonFunctionProps,
        handler: 'openIdConfiguration.handler',
      },
    );
    const openIdConfigurationResource = wellKnownResource.addResource(
      'openid-configuration',
    );
    openIdConfigurationResource.addMethod(
      'GET',
      new LambdaIntegration(openIdDiscoveryFunction),
    );

    const authorizeFunction = new Function(this, 'AuthorizeFunction', {
      ...commonFunctionProps,
      handler: 'authorize.handler',
    });
    const authorizeResource = api.root.addResource('authorize');
    authorizeResource.addMethod(
      'GET',
      new LambdaIntegration(authorizeFunction),
    );

    const tokenFunction = new Function(this, 'TokenFunction', {
      ...commonFunctionProps,
      handler: 'token.handler',
    });
    const tokenResource = api.root.addResource('token');
    tokenResource.addMethod(
      'GET',
      new LambdaIntegration(tokenFunction),
    );
    tokenResource.addMethod(
      'POST',
      new LambdaIntegration(tokenFunction),
    );

    const userInfoFunction = new Function(this, 'UserInfoFunction', {
      ...commonFunctionProps,
      handler: 'userinfo.handler',
    });
    const userInfoResource = api.root.addResource('userinfo');
    userInfoResource.addMethod(
      'GET',
      new LambdaIntegration(userInfoFunction),
    );
    userInfoResource.addMethod(
      'POST',
      new LambdaIntegration(userInfoFunction),
    );

    const jwksFunction = new Function(this, 'JwksFunction', {
      ...commonFunctionProps,
      handler: 'jwks.handler',
    });
    const jwksJsonResource = wellKnownResource.addResource('jwks.json');
    jwksJsonResource.addMethod(
      'GET',
      new LambdaIntegration(jwksFunction),
    );

    this.userPoolIdentityProvider = new CfnUserPoolIdentityProvider(
      this,
      'UserPoolIdentityProviderGithub',
      {
        providerName: 'Github',
        providerDetails: {
          client_id: props.clientId,
          client_secret: props.clientSecret,
          attributes_request_method: 'GET',
          oidc_issuer: api.url,
          authorize_scopes: 'openid read:user user:email',
          // For some reason, Cognito is unable to do OpenID Discovery.
          authorize_url: `${api.url}/authorize`,
          token_url: `${api.url}/token`,
          attributes_url: `${api.url}/userinfo`,
          jwks_uri: `${api.url}/.well-known/jwks.json`,
        },
        providerType: 'OIDC',
        attributeMapping: {
          username: 'sub',
          email: 'email',
          email_verified: 'email_verified',
          name: 'name',
          picture: 'picture',
          preferred_username: 'preferred_username',
          profile: 'profile',
          updated_at: 'updated_at',
          website: 'website',
        },
        userPoolId: props.userPool.userPoolId,
      },
    );
  }
}
