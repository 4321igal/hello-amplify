import { Handler } from 'aws-lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({ region: 'us-east-1' });
const docClient = DynamoDBDocumentClient.from(client);

const TABLE_NAME = process.env.PRODUCTS_TABLE || 'Product';

export const handler: Handler = async (event) => {
  console.log('Listing all products');

  try {
    const command = new ScanCommand({
      TableName: TABLE_NAME,
    });
    const result = await docClient.send(command);
    const products = result.Items || [];

    // Calculate stats
    const total = products.length;
    const ready = products.filter((p: any) => p.status === 'READY').length;
    const pending = products.filter((p: any) => p.status === 'PENDING').length;
    const avgConfidence = Math.round(
      products.reduce((acc: number, p: any) => acc + (p.confidence || 0), 0) / (total || 1)
    );

    return {
      total,
      ready,
      pending,
      avgConfidence,
      products,
    };
  } catch (error) {
    console.error('Error listing products:', error);
    throw new Error('Failed to list products');
  }
};
