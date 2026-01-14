import { API_BASE_URL } from '../constants/config';
import { Product, Stats, CreateProductDTO } from '../types/product';

export const apiService = {
  async getProducts(): Promise<Product[]> {
    const response = await fetch(`${API_BASE_URL}/api/products`);
    if (!response.ok) throw new Error('Failed to fetch products');
    return response.json();
  },

  async getProductById(id: string): Promise<Product> {
    const response = await fetch(`${API_BASE_URL}/api/products/${id}`);
    if (!response.ok) throw new Error('Failed to fetch product');
    return response.json();
  },

  async createProduct(dto: CreateProductDTO): Promise<Product> {
    const response = await fetch(`${API_BASE_URL}/api/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dto)
    });
    if (!response.ok) throw new Error('Failed to create product');
    return response.json();
  },

  async updateProduct(id: string, dto: Partial<Product>): Promise<Product> {
    const response = await fetch(`${API_BASE_URL}/api/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dto)
    });
    if (!response.ok) throw new Error('Failed to update product');
    return response.json();
  },

  async deleteProduct(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/products/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to delete product');
  },

  async runAIAnalysis(id: string): Promise<Product> {
    const response = await fetch(`${API_BASE_URL}/api/products/${id}/analyze`, {
      method: 'POST'
    });
    if (!response.ok) throw new Error(`Failed to run AI analysis: ${response.status} ${response.statusText}`);
    return response.json();
  },

  async importProducts(file: File): Promise<{ count: number; products: Product[] }> {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch(`${API_BASE_URL}/api/import-csv`, {
      method: 'POST',
      body: formData
    });
    if (!response.ok) throw new Error(`Failed to import products: ${response.status} ${response.statusText}`);
    return response.json();
  },

  async getStats(): Promise<Stats> {
    const response = await fetch(`${API_BASE_URL}/api/products/stats/overview`);
    if (!response.ok) throw new Error('Failed to fetch stats');
    return response.json();
  }
};
