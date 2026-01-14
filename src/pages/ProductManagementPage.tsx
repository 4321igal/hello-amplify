import React, { useState } from 'react';
import { Search, Plus, Edit2, Trash2, Check, X, RefreshCw, Eye, Package, Tag, TrendingUp, AlertCircle, Upload, Image, Link2 } from 'lucide-react';
import { apiService } from '../services/api';
import { PRODUCT_CATEGORIES } from '../constants/categories';
import { Product, Stats } from '../types/product';
import { useProducts, useProductForm, useCSVImport } from '../hooks';

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
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">ניהול מוצרים</h1>
              <p className="text-sm text-gray-500 mt-1">נהל את קטלוג המוצרים שלך עם AI</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  resetForm();
                  setShowAddModal(true);
                }}
                className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all"
              >
                <Plus size={20} />
                הוסף מוצר
              </button>
              <button
                onClick={() => setShowImportModal(true)}
                className="flex items-center gap-2 bg-white border-2 border-purple-600 text-purple-600 px-4 py-2 rounded-lg hover:bg-purple-50 transition-all"
              >
                <Upload size={20} />
                יבוא CSV
              </button>
            </div>
          </div>
        </div>
      </header>

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

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">סך הכל מוצרים</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total || 0}</p>
              </div>
              <Package className="text-purple-600" size={32} />
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">מוכנים לפרסום</p>
                <p className="text-2xl font-bold text-green-600">{stats.ready || 0}</p>
              </div>
              <Check className="text-green-600" size={32} />
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-yellow-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">ממתינים לניתוח</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pending || 0}</p>
              </div>
              <AlertCircle className="text-yellow-600" size={32} />
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">ביטחון ממוצע</p>
                <p className="text-2xl font-bold text-blue-600">{stats.avgConfidence || 0}%</p>
              </div>
              <TrendingUp className="text-blue-600" size={32} />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow-sm border mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute right-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="חפש מוצר, קטגוריה..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">כל הסטטוסים</option>
              <option value="ready">מוכן לפרסום</option>
              <option value="pending">ממתין לניתוח</option>
            </select>

            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-4 py-2 rounded-lg ${viewMode === 'grid' ? 'bg-purple-100 text-purple-600' : 'bg-gray-100'}`}
              >
                רשת
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`px-4 py-2 rounded-lg ${viewMode === 'table' ? 'bg-purple-100 text-purple-600' : 'bg-gray-100'}`}
              >
                טבלה
              </button>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map(product => (
              <div key={product.id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                <div className="relative h-48 bg-gray-100 rounded-t-lg overflow-hidden">
                  <img 
                    src={product.image} 
                    alt={product.rawName}
                    className="w-full h-full object-cover"
                    onError={(e) => (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x300/cccccc/ffffff?text=No+Image'}
                  />
                  {product.isOverridden && (
                    <div className="absolute top-2 left-2 bg-blue-500 text-white px-2 py-1 rounded-full text-xs">
                      נערך
                    </div>
                  )}
                </div>
                
                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 mb-1">{product.rawName}</h3>
                      <span className="inline-block px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-600">
                        {product.category}
                      </span>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                      product.status === 'ready' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {product.status === 'ready' ? 'מוכן' : 'ממתין'}
                    </div>
                  </div>

                  {product.confidence > 0 && (
                    <div className="mb-3">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-gray-600">רמת ביטחון AI</span>
                        <span className="font-medium">{(product.confidence * 100).toFixed(0)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-purple-600 to-indigo-600 h-2 rounded-full"
                          style={{ width: `${product.confidence * 100}%` }}
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2 mt-4">
                    {product.status === 'pending' ? (
                      <button
                        onClick={() => handleRunAI(product.id)}
                        className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-3 py-2 rounded-lg text-sm hover:shadow-lg transition-all"
                      >
                        <RefreshCw size={16} />
                        הרץ AI
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setSelectedProduct(product);
                          setShowEditModal(true);
                        }}
                        className="flex-1 flex items-center justify-center gap-2 bg-gray-100 text-gray-700 px-3 py-2 rounded-lg text-sm hover:bg-gray-200"
                      >
                        <Eye size={16} />
                        צפה
                      </button>
                    )}
                    
                    <button
                      onClick={() => {
                        setSelectedProduct(product);
                        setShowEditModal(true);
                      }}
                      className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                    >
                      <Edit2 size={16} />
                    </button>
                    
                    <button
                      onClick={() => handleDeleteProduct(product.id)}
                      className="px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Table View */
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">מוצר</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">קטגוריה</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">סטטוס</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">ביטחון</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">תאריך</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">פעולות</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredProducts.map(product => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img 
                          src={product.image} 
                          alt={product.rawName}
                          className="w-12 h-12 rounded-lg object-cover"
                          onError={(e) => (e.target as HTMLImageElement).src = 'https://via.placeholder.com/48x48/cccccc/ffffff?text=?'}
                        />
                        <div>
                          <div className="font-medium text-gray-900">{product.rawName}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-block px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-600">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                        product.status === 'ready' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {product.status === 'ready' ? 'מוכן' : 'ממתין'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {product.confidence > 0 ? (
                        <span className="text-sm font-medium">{(product.confidence * 100).toFixed(0)}%</span>
                      ) : (
                        <span className="text-sm text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(product.createdAt).toLocaleDateString('he-IL')}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        {product.status === 'pending' && (
                          <button
                            onClick={() => handleRunAI(product.id)}
                            className="p-2 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100"
                          >
                            <RefreshCw size={16} />
                          </button>
                        )}
                        <button
                          onClick={() => {
                            setSelectedProduct(product);
                            setShowEditModal(true);
                          }}
                          className="p-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Edit Modal */}
        {showEditModal && selectedProduct && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto" onClick={() => setShowEditModal(false)}>
            <div className="bg-white rounded-lg max-w-4xl w-full my-8" onClick={(e) => e.stopPropagation()}>
              <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between z-10 rounded-t-lg">
                <h2 className="text-xl font-bold">עריכת מוצר: {selectedProduct.rawName}</h2>
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedProduct(null);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 max-h-[calc(90vh-120px)] overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-bold text-lg border-b pb-2">נתונים בולמיים</h3>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">תמונת מוצר</label>
                      <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
                        <img 
                          src={selectedProduct.image} 
                          alt={selectedProduct.rawName}
                          className="w-full h-full object-contain"
                          onError={(e) => (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x300/cccccc/ffffff?text=No+Image'}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">שם מוצר</label>
                      <input
                        type="text"
                        value={selectedProduct.rawName}
                        onChange={(e) => setSelectedProduct({...selectedProduct, rawName: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">תיאור בולמי</label>
                      <textarea
                        value={selectedProduct.rawDescription}
                        onChange={(e) => setSelectedProduct({...selectedProduct, rawDescription: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        rows={3}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">קטגוריה</label>
                      <select 
                        value={selectedProduct.category}
                        onChange={(e) => setSelectedProduct({...selectedProduct, category: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                        {PRODUCT_CATEGORIES.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b pb-2">
                      <h3 className="font-bold text-lg">תוצרי AI</h3>
                      {selectedProduct.confidence > 0 && (
                        <span className="text-sm text-gray-600">
                          ביטחון: {(selectedProduct.confidence * 100).toFixed(0)}%
                        </span>
                      )}
                    </div>

                    {selectedProduct.status === 'pending' ? (
                      <div className="text-center py-8">
                        <AlertCircle className="mx-auto text-yellow-500 mb-3" size={48} />
                        <p className="text-gray-600 mb-4">המוצר טרם נותח</p>
                        <button
                          onClick={() => handleRunAI(selectedProduct.id)}
                          className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-2 rounded-lg"
                        >
                          הרץ ניתוח AI
                        </button>
                      </div>
                    ) : (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">תיאור שיווקי</label>
                          <textarea
                            value={selectedProduct.aiDescription}
                            onChange={(e) => setSelectedProduct({...selectedProduct, aiDescription: e.target.value})}
                            className="w-full px-3 py-2 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                            rows={4}
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">תגיות</label>
                          <div className="flex flex-wrap gap-2">
                            {selectedProduct.aiTags?.map((tag, idx) => (
                              <span key={idx} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">SEO</label>
                          <input
                            type="text"
                            value={selectedProduct.aiSEO}
                            onChange={(e) => setSelectedProduct({...selectedProduct, aiSEO: e.target.value})}
                            className="w-full px-3 py-2 border border-purple-300 rounded-lg"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">קהל יעד</label>
                          <input
                            type="text"
                            value={selectedProduct.targetAudience}
                            onChange={(e) => setSelectedProduct({...selectedProduct, targetAudience: e.target.value})}
                            className="w-full px-3 py-2 border border-purple-300 rounded-lg"
                          />
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex gap-3 pt-6 border-t sticky bottom-0 bg-white pb-6">
                  <button 
                    onClick={handleUpdateProduct}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all"
                  >
                    שמור שינויים
                  </button>
                  <button
                    onClick={() => {
                      setShowEditModal(false);
                      setSelectedProduct(null);
                    }}
                    className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    ביטול
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Add Product Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={() => setShowAddModal(false)}>
            <div className="bg-white rounded-lg max-w-2xl w-full" onClick={(e) => e.stopPropagation()}>
              <div className="px-6 py-4 border-b flex items-center justify-between">
                <h2 className="text-xl font-bold">הוסף מוצר חדש</h2>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setImagePreview(null);
                    setImageUrl('');
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">שם מוצר *</label>
                    <input
                      type="text"
                      value={formData.rawName}
                      onChange={(e) => setFormData({...formData, rawName: e.target.value})}
                      placeholder="לדוגמה: נעלי ספורט Nike"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">תיאור</label>
                    <textarea
                      value={formData.rawDescription}
                      onChange={(e) => setFormData({...formData, rawDescription: e.target.value})}
                      placeholder="תיאור קצר של המוצר"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      rows={3}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">קטגוריה *</label>
                    <select 
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500">
                      <option value="">בחר קטגוריה</option>
                      {PRODUCT_CATEGORIES.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">תמונת מוצר</label>
                    <div className="flex gap-2 mb-3">
                      <button
                        type="button"
                        onClick={() => setImageUploadType('upload')}
                        className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                          imageUploadType === 'upload'
                            ? 'bg-purple-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        <Image size={16} className="inline ml-2" />
                        העלה תמונה
                      </button>
                      <button
                        type="button"
                        onClick={() => setImageUploadType('url')}
                        className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                          imageUploadType === 'url'
                            ? 'bg-purple-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        <Link2 size={16} className="inline ml-2" />
                        קישור לתמונה
                      </button>
                    </div>

                    {imageUploadType === 'upload' ? (
                      <div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUploadChange}
                          className="hidden"
                          id="imageUpload"
                        />
                        <label
                          htmlFor="imageUpload"
                          className="block w-full p-6 border-2 border-dashed border-gray-300 rounded-lg text-center cursor-pointer hover:border-purple-400 hover:bg-purple-50 transition-all"
                        >
                          {imagePreview ? (
                            <div className="space-y-2">
                              <img src={imagePreview} alt="Preview" className="mx-auto h-32 object-contain" />
                              <p className="text-sm text-gray-600">לחץ להחלפת תמונה</p>
                            </div>
                          ) : (
                            <div className="space-y-2">
                              <Upload className="mx-auto text-gray-400" size={32} />
                              <p className="text-sm text-gray-600">לחץ או גרור תמונה לכאן</p>
                              <p className="text-xs text-gray-400">PNG, JPG, WEBP עד 5MB</p>
                            </div>
                          )}
                        </label>
                      </div>
                    ) : (
                      <div>
                        <input
                          type="url"
                          value={imageUrl}
                          onChange={(e) => setImageUrl(e.target.value)}
                          placeholder="https://example.com/image.jpg"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                    )}
                  </div>

                  <div className="bg-purple-50 p-4 rounded-lg">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="text-purple-600 flex-shrink-0" size={20} />
                      <div className="text-sm text-purple-900">
                        <p className="font-medium mb-1">ניתוח AI אוטומטי</p>
                        <p className="text-purple-700">לאחר השמירה, המערכת תנתח אוטומטית את המוצר ותיצור תוכן שיווקי, תגיות ו-SEO.</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button 
                    onClick={handleAddProduct}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all"
                  >
                    הוסף מוצר
                  </button>
                  <button
                    onClick={() => {
                      setShowAddModal(false);
                      resetForm();
                    }}
                    className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    ביטול
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CSV Import Modal */}
        {showImportModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={() => setShowImportModal(false)}>
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between z-10">
                <h2 className="text-xl font-bold">יבוא מוצרים מקובץ CSV</h2>
                <button
                  onClick={() => {
                    setShowImportModal(false);
                    resetImport();
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-6">
                {!csvFile ? (
                  <div className="space-y-4">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h3 className="font-medium text-blue-900 mb-2">📋 פורמט הקובץ הנדרש</h3>
                      <p className="text-sm text-blue-800 mb-3">
                        הקובץ צריך לכלול את העמודות הבאות (ניתן להוסיף עמודות נוספות):
                      </p>
                      <div className="bg-white rounded p-3 text-sm font-mono">
                        rawName,rawDescription,barcode,category,image
                      </div>
                    </div>

                    <input
                      type="file"
                      accept=".csv"
                      onChange={handleCSVUploadChange}
                      className="hidden"
                      id="csvUpload"
                    />
                    <label
                      htmlFor="csvUpload"
                      className="block w-full p-12 border-2 border-dashed border-gray-300 rounded-lg text-center cursor-pointer hover:border-purple-400 hover:bg-purple-50 transition-all"
                    >
                      <Upload className="mx-auto text-gray-400 mb-3" size={48} />
                      <p className="text-lg font-medium text-gray-700 mb-1">
                        לחץ או גרור קובץ CSV לכאן
                      </p>
                      <p className="text-sm text-gray-500">
                        קובץ CSV עד 10MB
                      </p>
                    </label>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
                      <Check className="text-green-600 flex-shrink-0" size={24} />
                      <div>
                        <h3 className="font-medium text-green-900">קובץ הועלה בהצלחה!</h3>
                        <p className="text-sm text-green-800 mt-1">
                          נמצאו {importPreview.length} מוצרים
                        </p>
                      </div>
                    </div>

                    {importPreview.length > 0 && (
                      <div className="border rounded-lg overflow-hidden">
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead className="bg-gray-50 border-b">
                              <tr>
                                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">שם מוצר</th>
                                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">תיאור</th>
                                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">קטגוריה</th>
                                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">ברקוד</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y">
                              {importPreview.map((item, idx) => (
                                <tr key={idx} className="hover:bg-gray-50">
                                  <td className="px-4 py-2 text-sm font-medium">{item.rawName || item.name}</td>
                                  <td className="px-4 py-2 text-sm text-gray-600 truncate max-w-xs">
                                    {item.rawDescription || item.description || '-'}
                                  </td>
                                  <td className="px-4 py-2 text-sm">{item.category || 'כללי'}</td>
                                  <td className="px-4 py-2 text-sm text-gray-500">{item.barcode || '-'}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    <div className="flex gap-3">
                      <button
                        onClick={handleImportCSV}
                        className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all"
                      >
                        יבא {importPreview.length} מוצרים
                      </button>
                      <button
                        onClick={() => {
                          setCsvFile(null);
                          setImportPreview([]);
                        }}
                        className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
                      >
                        בחר קובץ אחר
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}