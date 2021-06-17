// https://github.com/projen/projen/blob/main/docs/awscdk-construct.md
const { AwsCdkConstructLibrary, ProjectType } = require('projen');

const project = new AwsCdkConstructLibrary({
  // ProjectOptions
  name: 'cdk-user-pool-identity-provider-github',
  projectType: ProjectType.LIB,

  // NodeProjectOptions
  defaultReleaseBranch: 'main',

  // TypeScriptProjectOptions
  // docgen: true,

  // JsiiProjectOptions
  repositoryUrl: 'https://github.com/scenario-labs/cdk-user-pool-identity-provider-github.git',
  // dotnet: {
  //   dotNetNamespace: 'Acme.HelloNamespace',
  //   packageId: 'Acme.HelloPackage',
  // },
  // java: {
  //   javaPackage: 'com.acme.hello',
  //   mavenArtifactId: 'hello-jsii',
  //   mavenGroupId: 'com.acme.hello',
  //   serverId: 'github',
  //   repositoryUrl: 'https://maven.pkg.github.com/example/hello-jsii',
  // },
  // python: {
  //   distName: 'acme.hello-jsii',
  //   module: 'acme.hello_jsii'
  // },

  // ConstructLibraryOptions
  catalog: {
    announce: true,
  },

  // AwsCdkConstructLibraryOptions
  cdkVersion: '1.95.2',
  cdkAssert: true,
  cdkDependencies: ['@aws-cdk/core', '@aws-cdk/aws-apigateway', '@aws-cdk/aws-cognito', '@aws-cdk/aws-lambda'],

  // NodePackageOptions
  description: 'A CDK construct that adds GitHub as an identity provider to a Cognito user pool',
  authorName: 'Scenario',
  authorEmail: 'cloud@scenario3d.com',
  authorOrganization: true,
  authorUrl: 'https://www.scenario3d.com',
  license: 'MIT',
  licensed: 'true',
  copyrightOwner: 'Scenario',
  copyrightPeriod: '2021',
  repository: 'https://github.com/scenario-labs/cdk-user-pool-identity-provider-github.git',
  keywords: ['Cognito user pool', 'Github', 'CDK construct'],
});
project.synth();
