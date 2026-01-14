import { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { Product, Stats, CreateProductDTO } from '../types/product';

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [stats, setStats] = useState<Stats>({ total: 0, ready: 0, pending: 0, avgConfidence: 0 });
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [aiRunning, setAiRunning] = useState(false);

  // Load products and stats on mount and when filters change
  useEffect(() => {
    loadProducts();
  }, [searchTerm, filterStatus]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getProducts();
      setProducts(data);
      
      // Load stats
      const statsData = await apiService.getStats();
      setStats(statsData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addProduct = async (dto: CreateProductDTO): Promise<void> => {
    try {
      await apiService.createProduct(dto);
      await loadProducts();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add product';
      throw new Error(errorMessage);
    }
  };

  const updateProduct = async (id: string, updates: Partial<Product>): Promise<void> => {
    try {
      await apiService.updateProduct(id, updates);
      await loadProducts();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update product';
      throw new Error(errorMessage);
    }
  };

  const deleteProduct = async (id: string): Promise<void> => {
    try {
      await apiService.deleteProduct(id);
      await loadProducts();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete product';
      throw new Error(errorMessage);
    }
  };

  const runAIAnalysis = async (productId: string): Promise<Product> => {
    try {
      setAiRunning(true);
      const result = await apiService.runAIAnalysis(productId);
      await loadProducts();
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to run AI analysis';
      throw new Error(errorMessage);
    } finally {
      setAiRunning(false);
    }
  };

  const importProducts = async (file: File): Promise<number> => {
    try {
      const result = await apiService.importProducts(file);
      await loadProducts();
      return result.count;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to import products';
      throw new Error(errorMessage);
    }
  };

  return {
    // State
    products,
    stats,
    selectedProduct,
    searchTerm,
    filterStatus,
    loading,
    error,
    aiRunning,
    
    // Setters
    setSelectedProduct,
    setSearchTerm,
    setFilterStatus,
    setError,
    
    // Actions
    loadProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    runAIAnalysis,
    importProducts
  };
}
