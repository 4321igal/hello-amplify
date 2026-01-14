import { generateClient } from 'aws-amplify/api';
import { Product, Stats, CreateProductDTO } from '../types/product';

const client = generateClient();

// GraphQL Queries
const getProductsQuery = `
  query ListProducts {
    listProducts {
      items {
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
  }
`;

const getProductByIdQuery = `
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
`;

const createProductMutation = `
  mutation CreateProduct(
    $rawName: String!
    $rawDescription: String!
    $category: String!
    $barcode: String
    $image: String!
    $status: ProductStatus!
    $confidence: Float!
    $ownerId: String!
  ) {
    createProduct(input: {
      rawName: $rawName
      rawDescription: $rawDescription
      category: $category
      barcode: $barcode
      image: $image
      status: $status
      confidence: $confidence
      ownerId: $ownerId
    }) {
      id
      rawName
      rawDescription
      category
      image
      status
      confidence
    }
  }
`;

const updateProductMutation = `
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
    updateProduct(input: {
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
    }) {
      id
      rawName
      status
      confidence
      aiDescription
      aiTags
    }
  }
`;

const deleteProductMutation = `
  mutation DeleteProduct($id: ID!) {
    deleteProduct(input: { id: $id }) {
      id
    }
  }
`;

const getStatsQuery = `
  query GetStats {
    getProductStats {
      total
      ready
      pending
      avgConfidence
    }
  }
`;

export const apiService = {
  async getProducts(): Promise<Product[]> {
    try {
      const response = await client.graphql({
        query: getProductsQuery
      });
      return (response.data as any).listProducts?.items || [];
    } catch (error) {
      console.error('Failed to fetch products:', error);
      throw new Error('Failed to fetch products');
    }
  },

  async getProductById(id: string): Promise<Product> {
    try {
      const response = await client.graphql({
        query: getProductByIdQuery,
        variables: { id }
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
        query: createProductMutation,
        variables: {
          ...dto,
          ownerId: 'user-id'
        }
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
        query: updateProductMutation,
        variables: { id, ...dto }
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
        query: deleteProductMutation,
        variables: { id }
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
          mutation RunAI($productId: ID!) {
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
        variables: { productId: id }
      });
      return (response.data as any).runAIAnalysis;
    } catch (error) {
      console.error('Failed to run AI analysis:', error);
      throw new Error(`Failed to run AI analysis`);
    }
  },

  async importProducts(file: File): Promise<{ count: number; products: Product[] }> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await client.graphql({
        query: `
          mutation ImportCSV($file: String!) {
            importProductsFromCSV(file: $file) {
              count
              success
              message
            }
          }
        `,
        variables: { file: file.name }
      });

      const result = (response.data as any).importProductsFromCSV;
      return {
        count: result.count,
        products: []
      };
    } catch (error) {
      console.error('Failed to import products:', error);
      throw new Error(`Failed to import products`);
    }
  },

  async getStats(): Promise<Stats> {
    try {
      const response = await client.graphql({
        query: getStatsQuery
      });
      return (response.data as any).getProductStats;
    } catch (error) {
      console.error('Failed to fetch stats:', error);
      throw new Error('Failed to fetch stats');
    }
  }
};
