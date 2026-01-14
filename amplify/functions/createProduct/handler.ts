import { Handler } from 'aws-lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import { v4 as uuidv4 } from 'uuid';

const client = new DynamoDBClient({ region: 'us-east-1' });
const docClient = DynamoDBDocumentClient.from(client);

const TABLE_NAME = process.env.PRODUCTS_TABLE || 'Product';

export const handler: Handler = async (event) => {
  console.log('Creating product:', event.arguments);

  try {
    const { rawName, rawDescription, category, barcode, image } = event.arguments;

    const product = {
      id: uuidv4(),
      rawName,
      rawDescription,
      category,
      barcode: barcode || null,
      image,
      status: 'PENDING',
      confidence: 0,
      isOverridden: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const command = new PutCommand({
      TableName: TABLE_NAME,
      Item: product,
    });

    await docClient.send(command);
    return product;
  } catch (error) {
    console.error('Error creating product:', error);
    throw new Error('Failed to create product');
  }
};
