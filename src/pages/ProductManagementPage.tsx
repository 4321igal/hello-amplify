import React, { useState } from 'react';
import { Search, Plus, Edit2, Trash2, Check, X, RefreshCw, Eye, Package, Tag, TrendingUp, AlertCircle, Upload, Image, Link2 } from 'lucide-react';

// Mock data
const initialProducts = [
  {
    id: 1,
    rawName: 'נעלי ספורט Nike Air Max',
    rawDescription: 'נעליים נוחות לריצה',
    barcode: '1234567890123',
    status: 'ready',
    category: 'נעליים',
    image: 'https://via.placeholder.com/300x300/667eea/ffffff?text=Nike+Shoes',
    aiDescription: 'נעלי ספורט Nike Air Max המשלבות נוחות מקסימלית עם עיצוב מודרני. מושלמות לריצה, אימונים ולבוש יומיומי. טכנולוגיית Air המפורסמת מספקת ספיגת זעזועים מעולה.',
    aiTags: ['נעליים', 'ספורט', 'Nike', 'ריצה', 'אימונים'],
    aiSEO: 'נעלי ספורט Nike Air Max | נוחות מקסימלית לריצה ואימונים',
    confidence: 0.95,
    targetAudience: 'ספורטאים, מתאמנים בני 18-45',
    createdAt: '2024-01-15',
    isOverridden: false
  },
  {
    id: 2,
    rawName: 'טלפון Samsung Galaxy',
    rawDescription: 'טלפון חכם',
    barcode: null,
    status: 'pending',
    category: 'אלקטרוניקה',
    image: 'https://via.placeholder.com/300x300/764ba2/ffffff?text=Samsung',
    aiDescription: '',
    aiTags: [],
    aiSEO: '',
    confidence: 0,
    targetAudience: '',
    createdAt: '2024-01-16',
    isOverridden: false
  },
  {
    id: 3,
    rawName: 'תיק גב מקצועי',
    rawDescription: 'תיק למחשב נייד',
    barcode: '9876543210987',
    status: 'ready',
    category: 'תיקים ומזוודות',
    image: 'https://via.placeholder.com/300x300/43e97b/ffffff?text=Backpack',
    aiDescription: 'תיק גב מקצועי ואיכותי המיועד למחשבים ניידים עד 15.6 אינץ. כולל תאים מרופדים, כיסים מרובים לארגון מושלם ורצועות נוחות. עמיד במים ובנוי לשנים.',
    aiTags: ['תיק', 'מחשב נייד', 'עבודה', 'לימודים', 'תיק גב'],
    aiSEO: 'תיק גב למחשב נייד | עמיד במים ונוח לעבודה ולימודים',
    confidence: 0.88,
    targetAudience: 'סטודנטים, עובדי היי-טק בני 20-40',
    createdAt: '2024-01-14',
    isOverridden: true
  }
];

const categories = [
  'נעליים',
  'אלקטרוניקה',
  'תיקים ומזוודות',
  'ביגוד',
  'אביזרים',
  'ספורט ופנאי',
  'בית וגן',
  'יופי ובריאות'
];

export default function ProductManagement() {
  const [products, setProducts] = useState(initialProducts);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [aiRunning, setAiRunning] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [imageUploadType, setImageUploadType] = useState('upload'); // upload or url
  const [imagePreview, setImagePreview] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [csvFile, setCsvFile] = useState(null);
  const [importPreview, setImportPreview] = useState([]);

  // Stats
  const stats = {
    total: products.length,
    ready: products.filter(p => p.status === 'ready').length,
    pending: products.filter(p => p.status === 'pending').length,
    avgConfidence: (products.reduce((acc, p) => acc + p.confidence, 0) / products.length * 100).toFixed(0)
  };

  // Filter products
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.rawName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         p.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || p.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Run AI Analysis
  const runAI = async (productId) => {
    setAiRunning(true);
    // Simulate AI processing
    setTimeout(() => {
      setProducts(products.map(p => {
        if (p.id === productId) {
          return {
            ...p,
            status: 'ready',
            aiDescription: `תיאור שיווקי מקצועי שנוצר ע"י AI עבור ${p.rawName}. המוצר מציע ערך מעולה ואיכות גבוהה. מושלם עבור לקוחות המחפשים פתרון איכותי ואמין.`,
            aiTags: ['איכות', 'מומלץ', p.category, 'חדש'],
            aiSEO: `${p.rawName} | קנה עכשיו במחיר מבצע`,
            confidence: 0.85 + Math.random() * 0.15,
            targetAudience: 'קהל רחב בני 18-65'
          };
        }
        return p;
      }));
      setAiRunning(false);
    }, 2000);
  };

  // Delete product
  const deleteProduct = (id) => {
    if (confirm('האם אתה בטוח שברצונך למחוק מוצר זה?')) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle CSV upload
  const handleCSVUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCsvFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target.result;
        const lines = text.split('\n');
        const headers = lines[0].split(',').map(h => h.trim());
        
        const preview = lines.slice(1, 6).map((line, idx) => {
          const values = line.split(',').map(v => v.trim());
          const product = {};
          headers.forEach((header, i) => {
            product[header] = values[i] || '';
          });
          return { ...product, id: Date.now() + idx };
        }).filter(p => p.rawName || p.name);
        
        setImportPreview(preview);
      };
      reader.readAsText(file);
    }
  };

  // Import CSV products
  const importCSVProducts = () => {
    const newProducts = importPreview.map(p => ({
      id: Date.now() + Math.random(),
      rawName: p.rawName || p.name || p.productName,
      rawDescription: p.rawDescription || p.description || '',
      barcode: p.barcode || null,
      category: p.category || 'כללי',
      image: p.image || p.imageUrl || 'https://via.placeholder.com/300x300/cccccc/ffffff?text=No+Image',
      status: 'pending',
      aiDescription: '',
      aiTags: [],
      aiSEO: '',
      confidence: 0,
      targetAudience: '',
      createdAt: new Date().toISOString().split('T')[0],
      isOverridden: false
    }));
    
    setProducts([...products, ...newProducts]);
    setShowImportModal(false);
    setCsvFile(null);
    setImportPreview([]);
    alert(`${newProducts.length} מוצרים יובאו בהצלחה!`);
  };

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
                onClick={() => setShowAddModal(true)}
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
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">סך הכל מוצרים</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <Package className="text-purple-600" size={32} />
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">מוכנים לפרסום</p>
                <p className="text-2xl font-bold text-green-600">{stats.ready}</p>
              </div>
              <Check className="text-green-600" size={32} />
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-yellow-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">ממתינים לניתוח</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <AlertCircle className="text-yellow-600" size={32} />
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">ביטחון ממוצע</p>
                <p className="text-2xl font-bold text-blue-600">{stats.avgConfidence}%</p>
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
                {/* Product Image */}
                <div className="relative h-48 bg-gray-100 rounded-t-lg overflow-hidden">
                  <img 
                    src={product.image} 
                    alt={product.rawName}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/300x300/cccccc/ffffff?text=No+Image';
                    }}
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

                  {product.barcode && (
                    <p className="text-xs text-gray-500 mb-2">ברקוד: {product.barcode}</p>
                  )}

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
                        onClick={() => runAI(product.id)}
                        disabled={aiRunning}
                        className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-3 py-2 rounded-lg text-sm hover:shadow-lg transition-all disabled:opacity-50"
                      >
                        <RefreshCw size={16} className={aiRunning ? 'animate-spin' : ''} />
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
                      onClick={() => deleteProduct(product.id)}
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
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/48x48/cccccc/ffffff?text=?';
                          }}
                        />
                        <div>
                          <div className="font-medium text-gray-900">{product.rawName}</div>
                          {product.barcode && (
                            <div className="text-xs text-gray-500">{product.barcode}</div>
                          )}
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
                      {product.createdAt}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        {product.status === 'pending' && (
                          <button
                            onClick={() => runAI(product.id)}
                            disabled={aiRunning}
                            className="p-2 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100"
                          >
                            <RefreshCw size={16} className={aiRunning ? 'animate-spin' : ''} />
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
                          onClick={() => deleteProduct(product.id)}
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
                  {/* Raw Data */}
                  <div className="space-y-4">
                    <h3 className="font-bold text-lg border-b pb-2">נתונים גולמיים</h3>
                    
                    {/* Image Display */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">תמונת מוצר</label>
                      <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
                        <img 
                          src={selectedProduct.image} 
                          alt={selectedProduct.rawName}
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/300x300/cccccc/ffffff?text=No+Image';
                          }}
                        />
                      </div>
                      <button className="mt-2 text-sm text-purple-600 hover:text-purple-700 flex items-center gap-1">
                        <Image size={16} />
                        שנה תמונה
                      </button>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">שם מוצר</label>
                      <input
                        type="text"
                        value={selectedProduct.rawName}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        readOnly
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">תיאור גולמי</label>
                      <textarea
                        value={selectedProduct.rawDescription}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        rows="3"
                        readOnly
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">ברקוד</label>
                      <input
                        type="text"
                        value={selectedProduct.barcode || 'לא קיים'}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        readOnly
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">קטגוריה</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                        {categories.map(cat => (
                          <option key={cat} selected={cat === selectedProduct.category}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* AI Data */}
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
                          onClick={() => runAI(selectedProduct.id)}
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
                            className="w-full px-3 py-2 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                            rows="4"
                          />
                          <p className="text-xs text-gray-500 mt-1">ניתן לערוך ידנית</p>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">תגיות</label>
                          <div className="flex flex-wrap gap-2">
                            {selectedProduct.aiTags.map((tag, idx) => (
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
                            className="w-full px-3 py-2 border border-purple-300 rounded-lg"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">קהל יעד</label>
                          <input
                            type="text"
                            value={selectedProduct.targetAudience}
                            className="w-full px-3 py-2 border border-purple-300 rounded-lg"
                          />
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex gap-3 pt-6 border-t sticky bottom-0 bg-white pb-6">
                  <button 
                    onClick={() => {
                      alert('שינויים נשמרו בהצלחה!');
                      setShowEditModal(false);
                      setSelectedProduct(null);
                    }}
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
                      placeholder="לדוגמה: נעלי ספורט Nike"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">תיאור</label>
                    <textarea
                      placeholder="תיאור קצר של המוצר"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      rows="3"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">ברקוד (אופציונלי)</label>
                    <input
                      type="text"
                      placeholder="1234567890123"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">קטגוריה *</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500">
                      <option value="">בחר קטגוריה</option>
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  {/* Image Upload Section */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">תמונת מוצר</label>
                    
                    {/* Toggle between upload and URL */}
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
                          onChange={handleImageUpload}
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
                        {imageUrl && (
                          <div className="mt-3 p-2 border rounded-lg">
                            <img 
                              src={imageUrl} 
                              alt="Preview" 
                              className="w-full h-32 object-contain"
                              onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/300x100/cccccc/666666?text=Invalid+URL';
                              }}
                            />
                          </div>
                        )}
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
                    onClick={() => {
                      alert('מוצר נוסף בהצלחה!');
                      setShowAddModal(false);
                      setImagePreview(null);
                      setImageUrl('');
                    }}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all"
                  >
                    הוסף מוצר
                  </button>
                  <button
                    onClick={() => {
                      setShowAddModal(false);
                      setImagePreview(null);
                      setImageUrl('');
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
                    setCsvFile(null);
                    setImportPreview([]);
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
                      <p className="text-xs text-blue-700 mt-2">
                        * rawName הוא שדה חובה. שאר השדות אופציונליים.
                      </p>
                    </div>

                    <input
                      type="file"
                      accept=".csv"
                      onChange={handleCSVUpload}
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

                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-medium mb-2">💡 טיפים:</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• ודא שהקובץ מקודד ב-UTF-8 לתמיכה בעברית</li>
                        <li>• השתמש בפסיקים להפרדת ערכים</li>
                        <li>• ניתן להוסיף קישורים לתמונות בעמודה 'image'</li>
                        <li>• המערכת תריץ AI אוטומטית על כל המוצרים המיובאים</li>
                      </ul>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
                      <Check className="text-green-600 flex-shrink-0" size={24} />
                      <div>
                        <h3 className="font-medium text-green-900">קובץ הועלה בהצלחה!</h3>
                        <p className="text-sm text-green-800 mt-1">
                          נמצאו {importPreview.length} מוצרים (מציג 5 ראשונים)
                        </p>
                      </div>
                    </div>

                    {importPreview.length > 0 && (
                      <div className="border rounded-lg overflow-hidden">
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead className="bg-gray-50 border-b">
                              <tr>
                                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">תמונה</th>
                                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">שם מוצר</th>
                                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">תיאור</th>
                                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">קטגוריה</th>
                                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">ברקוד</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y">
                              {importPreview.map((item, idx) => (
                                <tr key={idx} className="hover:bg-gray-50">
                                  <td className="px-4 py-2">
                                    <img 
                                      src={item.image || item.imageUrl || 'https://via.placeholder.com/40x40/cccccc/ffffff?text=?'} 
                                      alt=""
                                      className="w-10 h-10 rounded object-cover"
                                      onError={(e) => {
                                        e.target.src = 'https://via.placeholder.com/40x40/cccccc/ffffff?text=?';
                                      }}
                                    />
                                  </td>
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
                        onClick={importCSVProducts}
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