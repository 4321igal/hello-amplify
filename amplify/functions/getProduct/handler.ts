import { Handler } from 'aws-lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({ region: 'us-east-1' });
const docClient = DynamoDBDocumentClient.from(client);

const TABLE_NAME = process.env.PRODUCTS_TABLE || 'Product';

export const handler: Handler = async (event) => {
  console.log('Getting product:', event.arguments?.id);

  try {
    if (event.arguments?.id) {
      // Get single product
      const command = new GetCommand({
        TableName: TABLE_NAME,
        Key: { id: event.arguments.id },
      });
      const result = await docClient.send(command);
      return result.Item;
    } else {
      // List all products
      const command = new ScanCommand({
        TableName: TABLE_NAME,
      });
      const result = await docClient.send(command);
      return result.Items || [];
    }
  } catch (error) {
    console.error('Error getting product:', error);
    throw new Error('Failed to get product');
  }
};
