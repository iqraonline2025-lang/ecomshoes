'use client';
import React, { useState, useEffect } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';

export default function AdminAddProduct() {
  const [images, setImages] = useState([]); 
  const [previews, setPreviews] = useState([]); 
  const [loading, setLoading] = useState(false); // Added loading state
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    price: '',
    category: '', 
    sizes: '7, 8, 9, 10, 11, 12',
    colors: 'Black, White, Red',
    isFlashSale: false,
    stockLeft: 50,
    totalStock: 100
  });

  // ✅ Step 1: Define the Dynamic URL
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  useEffect(() => {
    return () => previews.forEach((url) => URL.revokeObjectURL(url));
  }, [previews]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setImages((prev) => [...prev, ...files]);
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setPreviews((prev) => [...prev, ...newPreviews]);
  };

  const removeImage = (index) => {
    URL.revokeObjectURL(previews[index]);
    setImages(images.filter((_, i) => i !== index));
    setPreviews(previews.filter((_, i) => i !== index));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (images.length === 0) return alert("Please upload at least one image");

    setLoading(true); // Start loading
    const data = new FormData();
    
    // 1. Clean Sizes
    const sizeArray = formData.sizes
      .split(',')
      .map(s => Number(s.trim()))
      .filter(n => !isNaN(n));

    // 2. Clean Colors
    const colorArray = formData.colors
      .split(',')
      .map(c => c.trim())
      .filter(c => c !== "");

    // Append standard fields
    data.append('name', formData.name);
    data.append('brand', formData.brand);
    data.append('category', formData.category);
    data.append('newPrice', Number(formData.price));
    data.append('oldPrice', Number(formData.price) + 20); 
    data.append('isFlashSale', formData.isFlashSale);
    data.append('stockLeft', formData.stockLeft);
    data.append('totalStock', formData.totalStock);
    
    data.append('sizes', JSON.stringify(sizeArray));
    data.append('colors', JSON.stringify(colorArray));

    // Append images
    images.forEach((file) => {
      data.append('files', file); 
    });

    try {
      // ✅ Step 2: Use Dynamic API_URL
      const res = await fetch(`${API_URL}/api/products/upload`, {
        method: 'POST',
        body: data, 
      });

      const result = await res.json();

      if (result.success) {
        alert("🚀 Success! Product is live.");
        setImages([]);
        setPreviews([]);
        setFormData({
            name: '', brand: '', price: '', category: '', 
            sizes: '7, 8, 9, 10, 11, 12', colors: 'Black, White, Red', 
            isFlashSale: false, stockLeft: 50, totalStock: 100
        });
      } else {
        alert("❌ Error: " + (result.error || "Upload failed"));
      }
    } catch (err) {
      console.error("Upload failed", err);
      alert("Check backend console connection.");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfcfc] p-4 md:p-12">
      <div className="max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="bg-white border border-gray-100 rounded-[40px] p-8 md:p-12 shadow-sm space-y-10">
          <header className="space-y-2">
            <h1 className="text-3xl font-black uppercase italic tracking-tighter">Inventory Control</h1>
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Add new stock to the database</p>
          </header>

          <section className="space-y-6">
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-red-500">01. Media Assets</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <label className="aspect-square border-2 border-dashed border-gray-200 rounded-3xl flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-black transition-all group">
                <Upload size={20} className="group-hover:-translate-y-1 transition-transform" />
                <span className="text-[9px] font-black uppercase text-center px-2">Add Media</span>
                <input type="file" multiple onChange={handleFileChange} className="hidden" accept="image/*" />
              </label>

              {previews.map((url, i) => (
                <div key={url} className="relative aspect-square rounded-3xl overflow-hidden bg-gray-100 group">
                  <img src={url} alt="preview" className="w-full h-full object-cover" />
                  <button type="button" onClick={() => removeImage(i)} className="absolute top-2 right-2 bg-black text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-red-500">02. Product Info</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="Shoe Name" name="name" value={formData.name} onChange={handleChange} placeholder="Dunk Low Panda" />
              <Input label="Brand" name="brand" value={formData.brand} onChange={handleChange} placeholder="Nike" />
              <Input label="Price ($)" name="price" type="number" value={formData.price} onChange={handleChange} placeholder="120" />
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Category</label>
                <select name="category" value={formData.category} onChange={handleChange} required className="bg-gray-50 rounded-2xl p-4 text-sm font-bold outline-none">
                  <option value="">Select Category</option>
                  <option value="sneakers">Sneakers</option>
                  <option value="running">Running</option>
                </select>
              </div>
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-red-500">03. Variants</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="Sizes (Comma separated)" name="sizes" value={formData.sizes} onChange={handleChange} />
              <Input label="Colors (Comma separated)" name="colors" value={formData.colors} onChange={handleChange} />
            </div>
          </section>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-black text-white py-6 rounded-3xl font-black uppercase tracking-[0.3em] text-xs hover:bg-zinc-800 transition-all shadow-xl flex items-center justify-center gap-3 disabled:bg-zinc-400"
          >
            {loading ? (
              <><Loader2 className="animate-spin" size={18} /> Processing...</>
            ) : (
              "Push to Database"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

const Input = ({ label, ...props }) => (
  <div className="flex flex-col gap-2">
    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">{label}</label>
    <input {...props} required className="bg-gray-50 border-2 border-transparent focus:border-black focus:bg-white rounded-2xl p-4 text-sm font-bold transition-all outline-none" />
  </div>
);