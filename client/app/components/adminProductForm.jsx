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

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

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
    const newPreviews = selectedFiles.map(file => URL.createObjectURL(file));
    setPreviews(newPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (files.length === 0) {
      setMessage('Please select at least one image.');
      return;
    }

    setLoading(true);
    setMessage('');
    
    const data = new FormData();
    
    // ✅ FIX 1: Append standard fields correctly
    data.append('name', formData.name);
    data.append('brand', formData.brand);
    data.append('newPrice', formData.newPrice);
    data.append('oldPrice', formData.oldPrice || 0);
    data.append('category', formData.category);
    data.append('isFlashSale', formData.isFlashSale);
    data.append('stockLeft', formData.stockLeft);
    data.append('totalStock', formData.totalStock);
    
    // ✅ FIX 2: Send sizes as a plain comma-separated string.
    // Your backend's parseArrayInput helper handles the split(',') automatically.
    data.append('sizes', formData.sizes);

    // ✅ FIX 3: Ensure the key is exactly 'files' to match backend .array('files', 10)
    files.forEach(file => {
      data.append('files', file); 
    });

    try {
      const response = await fetch(`${API_URL}/api/products/upload`, {
        method: 'POST',
        body: data,
        // IMPORTANT: No 'Content-Type' header here!
      });

      const result = await response.json();
      
      if (response.ok && result.success) {
        setMessage('Product uploaded successfully!');
        // Reset Form
        setFormData({ 
          name: '', brand: '', newPrice: '', oldPrice: '', 
          category: 'sneakers', sizes: '40, 41, 42, 43, 44', 
          isFlashSale: false, stockLeft: 10, totalStock: 50 
        });
        setFiles([]);
        setPreviews([]);
      } else {
        // If backend returns a 500, this will show the specific error message
        setMessage(result.error || 'Upload failed. Check server logs.');
      }
    } catch (error) {
      console.error("Upload error:", error);
      setMessage('Network error. Is the server running?');
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
                  <img key={i} src={url} alt="Preview" className="w-20 h-20 object-cover rounded-xl border border-gray-200 shadow-sm" />
                ))}
              </div>
            ) : (
              <Upload className="mx-auto text-gray-300 group-hover:text-black transition-colors" size={40} />
            )}
            <p className="text-xs font-black uppercase tracking-widest text-gray-500">
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
            <input name="sizes" placeholder="40, 41, 42" value={formData.sizes} onChange={handleInputChange} className="admin-input" />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Category</label>
            <select name="category" value={formData.category} onChange={handleInputChange} className="admin-input cursor-pointer">
              <option value="sneakers">Sneakers</option>
              <option value="running">Running</option>
              <option value="limited">Limited Edition</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-6 p-6 bg-gray-50 rounded-2xl border border-gray-100">
          <label className="flex items-center gap-3 cursor-pointer">
            <input 
              type="checkbox" 
              name="isFlashSale" 
              checked={formData.isFlashSale} 
              onChange={handleInputChange}
              className="w-5 h-5 accent-black rounded"
            />
            <span className="text-xs font-black uppercase tracking-widest">Mark as Flash Sale</span>
          </label>
        </div>

        <button 
          type="submit"
          disabled={loading}
          className="w-full py-5 bg-black text-white font-black uppercase tracking-[0.2em] text-xs rounded-2xl hover:bg-zinc-800 transition-all disabled:bg-gray-400 flex items-center justify-center gap-2 shadow-xl shadow-black/10"
        >
          {loading ? (
            <><Loader2 className="animate-spin" size={16} /> Uploading to Cloudinary...</>
          ) : 'Publish Product'}
        </button>
      </form>

      {message && (
        <div className={`mt-6 p-4 rounded-xl flex items-center gap-3 font-bold text-sm animate-in fade-in slide-in-from-top-2 ${message.includes('successfully') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {message.includes('successfully') ? <CheckCircle2 size={18} /> : <X size={18} />} {message}
        </div>
      )}

      <style jsx>{`
        .admin-input {
          width: 100%;
          padding: 1rem;
          background-color: #f9fafb;
          border: 1px solid #f3f4f6;
          border-radius: 0.75rem;
          outline: none;
          transition: all 0.2s;
          font-weight: 500;
          font-size: 0.875rem;
        }
        .admin-input:focus {
          background-color: white;
          border-color: black;
          box-shadow: 0 0 0 4px rgba(0,0,0,0.02);
        }
      `}</style>
    </div>
  );
};

export default AdminProductForm;