import React, { useState } from 'react';
import { RefreshCw, AlertCircle } from 'lucide-react';
import { Product, Stats } from '../types/product';
import { useProducts, useProductForm, useCSVImport } from '../hooks';
import { SearchBar, ProductGrid, ProductTable, AddProductModal, EditProductModal, ImportCSVModal, ProductHeader, StatsSection, ErrorBoundary } from '../components';

export default function ProductManagement() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  const { products, stats, selectedProduct, searchTerm, filterStatus, loading, error, setSelectedProduct, setSearchTerm, setFilterStatus, loadProducts, addProduct, updateProduct, deleteProduct, runAIAnalysis, importProducts } = useProducts();
  const { formData, imagePreview, imageUrl, imageUploadType, setFormData, setImagePreview, setImageUrl, setImageUploadType, handleImageUpload, resetForm, getSubmitData } = useProductForm();
  const { csvFile, importPreview, setCsvFile, setImportPreview, handleCSVUpload, resetImport } = useCSVImport();

  const handleAddProduct = async () => {
    if (!formData.rawName.trim()) {
      alert('שם המוצר חובה');
      return;
    }
    if (!formData.category) {
      alert('בחר קטגוריה');
      return;
    }

    try {
      const submitData = getSubmitData();
      await addProduct(submitData);
      alert('מוצר נוסף בהצלחה!');
      setShowAddModal(false);
      resetForm();
    } catch (err) {
      alert('שגיאה: ' + (err instanceof Error ? err.message : 'Unknown error'));
    }
  };

  const handleUpdateProduct = async () => {
    if (!selectedProduct) return;

    try {
      await updateProduct(selectedProduct.id, selectedProduct);
      alert('מוצר עודכן בהצלחה!');
      setShowEditModal(false);
      setSelectedProduct(null);
    } catch (err) {
      alert('שגיאה: ' + (err instanceof Error ? err.message : 'Unknown error'));
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('האם אתה בטוח שברצונך למחוק מוצר זה?')) return;

    try {
      await deleteProduct(id);
      alert('מוצר נמחק בהצלחה!');
    } catch (err) {
      alert('שגיאה: ' + (err instanceof Error ? err.message : 'Unknown error'));
    }
  };

  const handleRunAI = async (productId: string) => {
    try {
      await runAIAnalysis(productId);
      alert('ניתוח AI הסתיים בהצלחה!');
    } catch (err) {
      alert('שגיאה: ' + (err instanceof Error ? err.message : 'Unknown error'));
    }
  };

  const handleImageUploadChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const handleCSVUploadChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleCSVUpload(file);
    }
  };

  const handleImportCSV = async () => {
    try {
      if (!csvFile) {
        alert('בחר קובץ CSV');
        return;
      }

      const count = await importProducts(csvFile);
      alert(`${count} מוצרים יובאו בהצלחה!`);
      setShowImportModal(false);
      resetImport();
    } catch (err) {
      alert('שגיאה: ' + (err instanceof Error ? err.message : 'Unknown error'));
    }
  };

  const filteredProducts = products;

  if (loading && products.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <RefreshCw className="animate-spin mx-auto text-purple-600 mb-4" size={48} />
          <p className="text-gray-600">טוען מוצרים...</p>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50" dir="rtl">
        <ProductHeader 
          onAddProduct={() => {
            resetForm();
            setShowAddModal(true);
          }}
          onImportCSV={() => setShowImportModal(true)}
        />

        <div className="max-w-7xl mx-auto px-4 py-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex gap-3">
              <AlertCircle className="text-red-600 flex-shrink-0" size={20} />
              <div>
                <p className="font-medium text-red-900">שגיאה בטעינת נתונים</p>
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          )}

          <StatsSection stats={stats} />

          <SearchBar 
            searchTerm={searchTerm}
            filterStatus={filterStatus}
            onSearchChange={setSearchTerm}
            onStatusChange={setFilterStatus}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />

        {/* Products View */}
        {viewMode === 'grid' ? (
          <ProductGrid 
            products={filteredProducts}
            onRunAI={handleRunAI}
            onEdit={(product) => {
              setSelectedProduct(product);
              setShowEditModal(true);
            }}
            onDelete={handleDeleteProduct}
          />
        ) : (
          <ProductTable 
            products={filteredProducts}
            onRunAI={handleRunAI}
            onEdit={(product) => {
              setSelectedProduct(product);
              setShowEditModal(true);
            }}
            onDelete={handleDeleteProduct}
          />
        )}

          {/* Modals */}
          <AddProductModal
            isOpen={showAddModal}
            formData={formData}
            imagePreview={imagePreview}
            imageUrl={imageUrl}
            imageUploadType={imageUploadType}
            onFormDataChange={setFormData}
            onImagePreviewChange={setImagePreview}
            onImageUrlChange={setImageUrl}
            onImageUploadTypeChange={setImageUploadType}
            onImageUpload={handleImageUpload}
            onAdd={handleAddProduct}
            onClose={() => {
              setShowAddModal(false);
              resetForm();
            }}
          />

          <EditProductModal
            isOpen={showEditModal}
            product={selectedProduct}
            onProductChange={setSelectedProduct}
            onUpdate={handleUpdateProduct}
            onClose={() => {
              setShowEditModal(false);
              setSelectedProduct(null);
            }}
            onRunAI={handleRunAI}
          />

          <ImportCSVModal
            isOpen={showImportModal}
            csvFile={csvFile}
            importPreview={importPreview}
            onCSVUpload={handleCSVUpload}
            onImport={handleImportCSV}
            onClose={() => {
              setShowImportModal(false);
              resetImport();
            }}
            onSelectNew={() => {
              setCsvFile(null);
              setImportPreview([]);
            }}
          />
        </div>
      </div>
    </ErrorBoundary>
  );
}