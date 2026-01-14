import { Handler } from 'aws-lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import { v4 as uuidv4 } from 'uuid';

const client = new DynamoDBClient({ region: 'us-east-1' });
const docClient = DynamoDBDocumentClient.from(client);

const TABLE_NAME = process.env.PRODUCTS_TABLE || 'Product';

interface CSVProduct {
  rawName: string;
  rawDescription: string;
  category: string;
  barcode?: string;
  image?: string;
}

export const handler: Handler = async (event) => {
  console.log('Importing CSV');

  try {
    const { csvContent } = event.arguments;

    if (!csvContent) {
      throw new Error('CSV content is required');
    }

    // Parse CSV content
    const lines = csvContent.split('\n').filter((line) => line.trim());
    const headers = lines[0]?.split(',') || [];
    const products: CSVProduct[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i]!.split(',');
      const product: CSVProduct = {
        rawName: values[0] || '',
        rawDescription: values[1] || '',
        category: values[2] || 'General',
        barcode: values[3],
        image: values[4] || 'https://via.placeholder.com/300x300',
      };

      if (product.rawName) {
        products.push(product);
      }
    }

    // Insert products into DynamoDB
    const insertedProducts = [];
    for (const product of products) {
      const dbProduct = {
        id: uuidv4(),
        ...product,
        status: 'PENDING',
        confidence: 0,
        isOverridden: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const command = new PutCommand({
        TableName: TABLE_NAME,
        Item: dbProduct,
      });

      await docClient.send(command);
      insertedProducts.push(dbProduct);
    }

    return {
      count: insertedProducts.length,
      success: true,
      message: `${insertedProducts.length} products imported successfully`,
      products: insertedProducts,
    };
  } catch (error) {
    console.error('Error importing CSV:', error);
    return {
      count: 0,
      success: false,
      message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
};
