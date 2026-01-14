// AWS Amplify Configuration
const amplifyConfig = {
  // Development configuration - using local backend
  api: {
    graphql_endpoint: 'http://localhost:3000/graphql', // Your Node.js backend
    region: 'us-east-1',
  },
  // For Amplify AppSync (when deployed to AWS)
  aws_project_region: 'us-east-1',
  aws_appsync_graphqlEndpoint: process.env.REACT_APP_APPSYNC_ENDPOINT,
  aws_appsync_region: process.env.REACT_APP_AWS_REGION || 'us-east-1',
  aws_appsync_authenticationType: 'AWS_IAM',
  // Authentication
  Auth: {
    region: 'us-east-1',
    userPoolId: process.env.REACT_APP_USER_POOL_ID,
    userPoolWebClientId: process.env.REACT_APP_USER_POOL_CLIENT_ID,
    // For local development
    identityPoolId: process.env.REACT_APP_IDENTITY_POOL_ID,
    oauth: {
      domain: process.env.REACT_APP_OAUTH_DOMAIN,
      scope: ['email', 'openid', 'profile'],
      redirectSignIn: 'http://localhost:5173/',
      redirectSignOut: 'http://localhost:5173/',
      responseType: 'code',
    },
  },
  // Storage (S3)
  Storage: {
    bucket: process.env.REACT_APP_STORAGE_BUCKET,
    region: process.env.REACT_APP_AWS_REGION || 'us-east-1',
    identityPoolId: process.env.REACT_APP_IDENTITY_POOL_ID,
  },
};

export default amplifyConfig;
