import { Handler } from 'aws-lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, UpdateCommand } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({ region: 'us-east-1' });
const docClient = DynamoDBDocumentClient.from(client);

const TABLE_NAME = process.env.PRODUCTS_TABLE || 'Product';

export const handler: Handler = async (event) => {
  console.log('Updating product:', event.arguments);

  try {
    const { id, ...updates } = event.arguments;
    updates.updatedAt = new Date().toISOString();

    // Build update expression
    const updateExpression = `SET ${Object.keys(updates)
      .map((key) => `${key} = :${key}`)
      .join(', ')}`;

    const expressionAttributeValues: any = {};
    Object.entries(updates).forEach(([key, value]) => {
      expressionAttributeValues[`:${key}`] = value;
    });

    const command = new UpdateCommand({
      TableName: TABLE_NAME,
      Key: { id },
      UpdateExpression: updateExpression,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: 'ALL_NEW',
    });

    const result = await docClient.send(command);
    return result.Attributes;
  } catch (error) {
    console.error('Error updating product:', error);
    throw new Error('Failed to update product');
  }
};
