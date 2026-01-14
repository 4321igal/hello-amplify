import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { storage } from './storage/resource';

/**
 * Amplify Backend Configuration
 * - Auth: Cognito for authentication
 * - Data: GraphQL API with DynamoDB
 * - Storage: S3 for file uploads (images)
 */
defineBackend({
  auth,
  data,
  storage,
});
