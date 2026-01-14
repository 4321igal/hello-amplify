import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { storage } from './storage/resource';
import { runAIAnalysis } from './functions/runAIAnalysis/resource';
import { importCSV } from './functions/importCSV/resource';
import { getProduct } from './functions/getProduct/resource';
import { listProducts } from './functions/listProducts/resource';
import { createProduct } from './functions/createProduct/resource';
import { updateProduct } from './functions/updateProduct/resource';
import { deleteProduct } from './functions/deleteProduct/resource';
import { getStats } from './functions/getStats/resource';

/**
 * Amplify Backend Configuration
 * - Auth: Cognito for authentication
 * - Data: GraphQL API with DynamoDB
 * - Storage: S3 for file uploads (images)
 * - Functions: Lambda for business logic
 */
defineBackend({
  auth,
  data,
  storage,
  runAIAnalysis,
  importCSV,
  getProduct,
  listProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getStats,
});
