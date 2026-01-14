import { generateClient } from 'aws-amplify/api';
import { Product, Stats, CreateProductDTO } from '../types/product';

const client = generateClient();

export const apiService = {
  async getProducts(): Promise<Product[]> {
    try {
      const response = await client.graphql({
        query: `
          query ListAllProducts {
            listAllProducts {
              id
              rawName
              rawDescription
              category
              barcode
              image
              status
              confidence
              aiDescription
              aiTags
              aiSEO
              targetAudience
              createdAt
              updatedAt
            }
          }
        `,
      });
      return (response.data as any).listAllProducts || [];
    } catch (error) {
      console.error('Failed to fetch products:', error);
      throw new Error('Failed to fetch products');
    }
  },

  async getProductById(id: string): Promise<Product> {
    try {
      const response = await client.graphql({
        query: `
          query GetProduct($id: ID!) {
            getProduct(id: $id) {
              id
              rawName
              rawDescription
              category
              barcode
              image
              isOverridden
              status
              confidence
              aiDescription
              aiTags
              aiSEO
              targetAudience
              createdAt
              updatedAt
            }
          }
        `,
        variables: { id },
      });
      return (response.data as any).getProduct;
    } catch (error) {
      console.error('Failed to fetch product:', error);
      throw new Error('Failed to fetch product');
    }
  },

  async createProduct(dto: CreateProductDTO): Promise<Product> {
    try {
      const response = await client.graphql({
        query: `
          mutation CreateProduct(
            $rawName: String!
            $rawDescription: String!
            $category: String!
            $barcode: String
            $image: String!
          ) {
            createProduct(
              rawName: $rawName
              rawDescription: $rawDescription
              category: $category
              barcode: $barcode
              image: $image
            ) {
              id
              rawName
              rawDescription
              category
              image
              status
              confidence
            }
          }
        `,
        variables: dto,
      });
      return (response.data as any).createProduct;
    } catch (error) {
      console.error('Failed to create product:', error);
      throw new Error('Failed to create product');
    }
  },

  async updateProduct(id: string, dto: Partial<Product>): Promise<Product> {
    try {
      const response = await client.graphql({
        query: `
          mutation UpdateProduct(
            $id: ID!
            $rawName: String
            $rawDescription: String
            $category: String
            $image: String
            $status: ProductStatus
            $confidence: Float
            $aiDescription: String
            $aiTags: [String!]
            $aiSEO: String
            $targetAudience: String
          ) {
            updateProduct(
              id: $id
              rawName: $rawName
              rawDescription: $rawDescription
              category: $category
              image: $image
              status: $status
              confidence: $confidence
              aiDescription: $aiDescription
              aiTags: $aiTags
              aiSEO: $aiSEO
              targetAudience: $targetAudience
            ) {
              id
              rawName
              status
              confidence
              aiDescription
              aiTags
            }
          }
        `,
        variables: { id, ...dto },
      });
      return (response.data as any).updateProduct;
    } catch (error) {
      console.error('Failed to update product:', error);
      throw new Error('Failed to update product');
    }
  },

  async deleteProduct(id: string): Promise<void> {
    try {
      await client.graphql({
        query: `
          mutation DeleteProduct($id: ID!) {
            deleteProduct(id: $id)
          }
        `,
        variables: { id },
      });
    } catch (error) {
      console.error('Failed to delete product:', error);
      throw new Error('Failed to delete product');
    }
  },

  async runAIAnalysis(id: string): Promise<Product> {
    try {
      const response = await client.graphql({
        query: `
          mutation RunAIAnalysis($productId: ID!) {
            runAIAnalysis(productId: $productId) {
              id
              status
              confidence
              aiDescription
              aiTags
              aiSEO
              targetAudience
            }
          }
        `,
        variables: { productId: id },
      });
      return (response.data as any).runAIAnalysis;
    } catch (error) {
      console.error('Failed to run AI analysis:', error);
      throw new Error(`Failed to run AI analysis`);
    }
  },

  async importProducts(file: File): Promise<{ count: number; products: Product[] }> {
    try {
      const csvContent = await file.text();

      const response = await client.graphql({
        query: `
          mutation ImportCSV($csvContent: String!) {
            importProductsFromCSV(csvContent: $csvContent) {
              count
              success
              message
              products {
                id
                rawName
                rawDescription
                category
                image
              }
            }
          }
        `,
        variables: { csvContent },
      });

      const result = (response.data as any).importProductsFromCSV;
      return {
        count: result.count,
        products: result.products || [],
      };
    } catch (error) {
      console.error('Failed to import products:', error);
      throw new Error(`Failed to import products`);
    }
  },

  async getStats(): Promise<Stats> {
    try {
      const response = await client.graphql({
        query: `
          query GetStats {
            getProductStats {
              total
              ready
              pending
              avgConfidence
            }
          }
        `,
      });
      return (response.data as any).getProductStats;
    } catch (error) {
      console.error('Failed to fetch stats:', error);
      throw new Error('Failed to fetch stats');
    }
  },
};
