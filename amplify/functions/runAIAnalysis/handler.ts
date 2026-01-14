import { Handler } from 'aws-lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({ region: 'us-east-1' });
const docClient = DynamoDBDocumentClient.from(client);

const TABLE_NAME = process.env.PRODUCTS_TABLE || 'Product';
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || '';

interface Product {
  id: string;
  rawName: string;
  rawDescription: string;
  category: string;
}

async function callOpenAI(product: Product): Promise<any> {
  // Fallback: Generate dummy AI content
  return {
    aiDescription: `AI-powered marketing description for ${product.rawName}. ${product.rawDescription}`,
    aiTags: ['recommended', 'best-seller', product.category.toLowerCase()],
    aiSEO: `${product.rawName} | High Quality Product`,
    targetAudience: 'General audience',
    confidence: 0.85,
  };
}

export const handler: Handler = async (event) => {
  console.log('Running AI Analysis for:', event.arguments?.productId);

  try {
    const { productId } = event.arguments;

    // Get product
    const getCommand = new GetCommand({
      TableName: TABLE_NAME,
      Key: { id: productId },
    });
    const getResult = await docClient.send(getCommand);
    const product = getResult.Item as Product;

    if (!product) {
      throw new Error('Product not found');
    }

    // Call AI analysis
    const aiContent = await callOpenAI(product);

    // Update product with AI results
    const updateCommand = new UpdateCommand({
      TableName: TABLE_NAME,
      Key: { id: productId },
      UpdateExpression: `SET #status = :status, #confidence = :confidence, #aiDesc = :aiDesc, #aiTags = :aiTags, #aiSEO = :aiSEO, #targetAudience = :targetAudience, #updatedAt = :updatedAt`,
      ExpressionAttributeNames: {
        '#status': 'status',
        '#confidence': 'confidence',
        '#aiDesc': 'aiDescription',
        '#aiTags': 'aiTags',
        '#aiSEO': 'aiSEO',
        '#targetAudience': 'targetAudience',
        '#updatedAt': 'updatedAt',
      },
      ExpressionAttributeValues: {
        ':status': 'READY',
        ':confidence': aiContent.confidence || 0.8,
        ':aiDesc': aiContent.aiDescription,
        ':aiTags': aiContent.aiTags || [],
        ':aiSEO': aiContent.aiSEO,
        ':targetAudience': aiContent.targetAudience,
        ':updatedAt': new Date().toISOString(),
      },
      ReturnValues: 'ALL_NEW',
    });

    const updateResult = await docClient.send(updateCommand);
    return updateResult.Attributes;
  } catch (error) {
    console.error('Error running AI analysis:', error);
    throw new Error('Failed to run AI analysis');
  }
};
