'use client';

import React, { useState, useEffect } from 'react';
import { Upload, X, CheckCircle2, Loader2 } from 'lucide-react';

const AdminProductForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    newPrice: '',
    oldPrice: '',
    category: 'sneakers',
    sizes: '40, 41, 42, 43, 44',
    isFlashSale: false,
    stockLeft: 10,
    totalStock: 50
  });
  
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // ✅ Step 1: Dynamic API URL for production
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  // Manage memory for image previews
  useEffect(() => {
    return () => previews.forEach(url => URL.revokeObjectURL(url));
  }, [previews]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
    
    // Create preview URLs
    const newPreviews = selectedFiles.map(file => URL.createObjectURL(file));
    setPreviews(newPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    
    const data = new FormData();
    
    // Clean and Format Data
    const sizeArray = formData.sizes.split(',').map(s => s.trim());

    // Append standard fields
    data.append('name', formData.name);
    data.append('brand', formData.brand);
    data.append('newPrice', Number(formData.newPrice));
    data.append('oldPrice', formData.oldPrice ? Number(formData.oldPrice) : 0);
    data.append('category', formData.category);
    data.append('isFlashSale', formData.isFlashSale);
    data.append('stockLeft', Number(formData.stockLeft));
    data.append('totalStock', Number(formData.totalStock));
    data.append('sizes', JSON.stringify(sizeArray));

    // Append files
    files.forEach(file => data.append('files', file));

    try {
      // ✅ Step 2: Use Dynamic Endpoint
      const response = await fetch(`${API_URL}/api/products/upload`, {
        method: 'POST',
        body: data,
        // Don't set Content-Type header manually when sending FormData
      });

      const result = await response.json();
      if (result.success) {
        setMessage('Product uploaded successfully!');
        setFormData({ name: '', brand: '', newPrice: '', oldPrice: '', category: 'sneakers', sizes: '40, 41, 42, 43, 44', isFlashSale: false, stockLeft: 10, totalStock: 50 });
        setFiles([]);
        setPreviews([]);
      } else {
        setMessage(result.error || 'Upload failed.');
      }
    } catch (error) {
      console.error("Upload error:", error);
      setMessage('Network error. Check backend connectivity.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white rounded-[40px] shadow-sm border border-gray-100 my-12">
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-black uppercase italic tracking-tighter">Inventory Control</h2>
        <p className="text-gray-400 text-sm font-bold uppercase tracking-widest mt-2">Add New Exclusive Drop</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Image Upload Area */}
        <div className="group relative border-2 border-dashed border-gray-200 rounded-3xl p-12 text-center transition-all hover:border-black bg-gray-50/30">
          <input 
            type="file" 
            multiple 
            onChange={handleFileChange} 
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
            accept="image/*"
          />
          <div className="space-y-4">
            {previews.length > 0 ? (
              <div className="flex flex-wrap justify-center gap-4">
                {previews.map((url, i) => (
                  <img key={i} src={url} alt="Preview" className="w-20 h-20 object-cover rounded-xl border border-gray-200" />
                ))}
              </div>
            ) : (
              <Upload className="mx-auto text-gray-300 group-hover:text-black transition-colors" size={40} />
            )}
            <p className="text-xs font-black uppercase tracking-widest">
              {files.length > 0 ? `${files.length} Files Selected` : 'Drag & Drop Shoe Images'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Product Name</label>
            <input name="name" placeholder="Dunk Low 'Panda'" value={formData.name} onChange={handleInputChange} className="admin-input" required />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Brand</label>
            <input name="brand" placeholder="Nike" value={formData.brand} onChange={handleInputChange} className="admin-input" required />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Sale Price ($)</label>
            <input name="newPrice" type="number" placeholder="120" value={formData.newPrice} onChange={handleInputChange} className="admin-input" required />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Original Price ($)</label>
            <input name="oldPrice" type="number" placeholder="160" value={formData.oldPrice} onChange={handleInputChange} className="admin-input" />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Sizes (Comma Separated)</label>
            <input name="sizes" placeholder="7, 8, 9, 10" value={formData.sizes} onChange={handleInputChange} className="admin-input" />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Category</label>
            <select name="category" value={formData.category} onChange={handleInputChange} className="admin-input">
              <option value="sneakers">Sneakers</option>
              <option value="running">Running</option>
              <option value="limited">Limited Edition</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-6 p-6 bg-gray-50 rounded-2xl">
          <label className="flex items-center gap-3 cursor-pointer">
            <input 
              type="checkbox" 
              name="isFlashSale" 
              checked={formData.isFlashSale} 
              onChange={handleInputChange}
              className="w-5 h-5 accent-black"
            />
            <span className="text-xs font-black uppercase tracking-widest">Mark as Flash Sale</span>
          </label>
        </div>

        <button 
          disabled={loading}
          className="w-full py-5 bg-black text-white font-black uppercase tracking-[0.2em] text-xs rounded-2xl hover:bg-zinc-800 transition-all disabled:bg-gray-400 flex items-center justify-center gap-2"
        >
          {loading ? (
            <><Loader2 className="animate-spin" size={16} /> Encrypting to Vault...</>
          ) : 'Publish Product'}
        </button>
      </form>

      {message && (
        <div className={`mt-6 p-4 rounded-xl flex items-center gap-3 font-bold text-sm ${message.includes('success') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {message.includes('success') ? <CheckCircle2 size={18} /> : <X size={18} />} {message}
        </div>
      )}

      <style jsx>{`
        .admin-input {
          width: 100%;
          padding: 1rem;
          background-color: #f9fafb;
          border: 1px solid transparent;
          border-radius: 0.75rem;
          outline: none;
          transition: all 0.2s;
          font-weight: 500;
          font-size: 0.875rem;
        }
        .admin-input:focus {
          background-color: white;
          border-color: black;
        }
      `}</style>
    </div>
  );
};

export default AdminProductForm;