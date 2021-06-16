# API Reference

**Classes**

Name|Description
----|-----------
[UserPoolIdentityProviderGithub](#user-pool-identity-provider-github-userpoolidentityprovidergithub)|GitHub OpenID Connect Wrapper for Cognito.


**Interfaces**

Name|Description
----|-----------
[IUserPoolIdentityProviderGithubProps](#user-pool-identity-provider-github-iuserpoolidentityprovidergithubprops)|*No description*



## class UserPoolIdentityProviderGithub  <a id="user-pool-identity-provider-github-userpoolidentityprovidergithub"></a>

GitHub OpenID Connect Wrapper for Cognito.

__Implements__: [IConstruct](#constructs-iconstruct), [IConstruct](#aws-cdk-core-iconstruct), [IConstruct](#constructs-iconstruct), [IDependable](#aws-cdk-core-idependable)
__Extends__: [Construct](#aws-cdk-core-construct)

### Initializer




```ts
new UserPoolIdentityProviderGithub(scope: Construct, id: string, props: IUserPoolIdentityProviderGithubProps)
```

* **scope** (<code>[Construct](#aws-cdk-core-construct)</code>)  *No description*
* **id** (<code>string</code>)  *No description*
* **props** (<code>[IUserPoolIdentityProviderGithubProps](#user-pool-identity-provider-github-iuserpoolidentityprovidergithubprops)</code>)  *No description*



### Properties


Name | Type | Description 
-----|------|-------------
**userPoolIdentityProvider** | <code>[CfnUserPoolIdentityProvider](#aws-cdk-aws-cognito-cfnuserpoolidentityprovider)</code> | <span></span>



## interface IUserPoolIdentityProviderGithubProps  <a id="user-pool-identity-provider-github-iuserpoolidentityprovidergithubprops"></a>




### Properties


Name | Type | Description 
-----|------|-------------
**clientId** | <code>string</code> | The client id recognized by Github APIs.
**clientSecret** | <code>string</code> | The client secret to be accompanied with clientId for Github APIs to authenticate the client.
**cognitoHostedUiDomain** | <code>string</code> | The Cognito hosted UI domain.
**userPool** | <code>[UserPool](#aws-cdk-aws-cognito-userpool)</code> | The user pool.



