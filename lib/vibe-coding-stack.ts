import * as cdk from 'aws-cdk-lib';
import * as cognito from 'aws-cdk-lib/aws-cognito';
import * as appsync from 'aws-cdk-lib/aws-appsync';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as amplify from 'aws-cdk-lib/aws-amplify';
import { Construct } from 'constructs';

export class VibeCodingStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Cognito User Pool
    const userPool = new cognito.UserPool(this, 'VibeCodingUserPool', {
      selfSignUpEnabled: true,
      signInAliases: { email: true },
      autoVerify: { email: true },
      passwordPolicy: {
        minLength: 8,
        requireLowercase: true,
        requireUppercase: true,
        requireDigits: true,
      },
    });

    const userPoolClient = new cognito.UserPoolClient(this, 'VibeCodingUserPoolClient', {
      userPool,
      generateSecret: false,
    });

    // DynamoDB Tables
    const postsTable = new dynamodb.Table(this, 'PostsTable', {
      partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    const usersTable = new dynamodb.Table(this, 'UsersTable', {
      partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    // AppSync API
    const api = new appsync.GraphqlApi(this, 'VibeCodingApi', {
      name: 'vibe-coding-api',
      schema: appsync.SchemaFile.fromAsset('schema.graphql'),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: appsync.AuthorizationType.USER_POOL,
          userPoolConfig: { userPool },
        },
      },
    });

    // Lambda Resolvers
    const postResolver = new lambda.Function(this, 'PostResolver', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'index.handler',
      code: lambda.Code.fromInline(`
        exports.handler = async (event) => {
          console.log('Event:', JSON.stringify(event, null, 2));
          return { statusCode: 200, body: 'Hello from Lambda!' };
        };
      `),
      environment: {
        POSTS_TABLE: postsTable.tableName,
        USERS_TABLE: usersTable.tableName,
      },
    });

    postsTable.grantReadWriteData(postResolver);
    usersTable.grantReadWriteData(postResolver);

    // AppSync Data Sources
    const lambdaDataSource = api.addLambdaDataSource('PostLambdaDataSource', postResolver);

    // Amplify App
    const amplifyApp = new amplify.CfnApp(this, 'VibeCodingApp', {
      name: 'vibe-coding-app',
    });

    const amplifyBranch = new amplify.CfnBranch(this, 'VibeCodingAppBranch', {
      appId: amplifyApp.attrAppId,
      branchName: 'main',
    });

    // Outputs
    new cdk.CfnOutput(this, 'UserPoolId', {
      value: userPool.userPoolId,
    });

    new cdk.CfnOutput(this, 'UserPoolClientId', {
      value: userPoolClient.userPoolClientId,
    });

    new cdk.CfnOutput(this, 'GraphQLApiUrl', {
      value: api.graphqlUrl,
    });

    new cdk.CfnOutput(this, 'GraphQLApiKey', {
      value: api.apiKey || '',
    });
  }
}