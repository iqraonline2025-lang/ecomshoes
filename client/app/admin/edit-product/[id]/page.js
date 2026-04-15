"use client";
import React, { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Save, ArrowLeft, Package } from 'lucide-react';

export default function EditProductPage({ params }) {
  // ✅ Correct way to handle async params in newer Next.js versions
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    image: '',
    category: '',
    stock: 0
  });

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`${API_URL}/api/products/${id}`);
        if (!response.ok) throw new Error("Product not found");
        const data = await response.json();
        
        // Match your state to the data coming from your MongoDB
        setFormData({
          name: data.name || '',
          price: data.price || '',
          description: data.description || '',
          image: data.image || '',
          category: data.category || '',
          stock: data.stock || 0
        });
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProduct();
  }, [id, API_URL]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      const token = localStorage.getItem('shoeStoreToken');
      const response = await fetch(`${API_URL}/api/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        router.push('/admin'); // Or wherever your dashboard is
        router.refresh();
      } else {
        alert("Failed to update product");
      }
    } catch (error) {
      console.error("Update failed:", error);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-white">
        <Loader2 className="animate-spin text-blue-600 mb-2" size={32} />
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">Loading Product Data</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        <button 
          onClick={() => router.back()} 
          className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-black mb-12 transition-colors"
        >
          <ArrowLeft size={14} /> Back to Dashboard
        </button>

        <div className="flex items-center gap-4 mb-12">
          <div className="bg-black text-white p-3 rounded-2xl">
            <Package size={24} />
          </div>
          <h1 className="text-4xl font-black uppercase italic tracking-tighter">Edit Product</h1>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-zinc-50 p-10 rounded-[40px] border border-zinc-100">
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Product Name</label>
            <input 
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="p-4 bg-white rounded-2xl border border-zinc-200 focus:outline-none focus:border-black font-bold text-sm"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Price (USD)</label>
            <input 
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({...formData, price: e.target.value})}
              className="p-4 bg-white rounded-2xl border border-zinc-200 focus:outline-none focus:border-black font-bold text-sm"
              required
            />
          </div>

          <div className="flex flex-col gap-2 md:col-span-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Description</label>
            <textarea 
              rows="4"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="p-4 bg-white rounded-2xl border border-zinc-200 focus:outline-none focus:border-black font-bold text-sm"
              required
            />
          </div>

          <div className="md:col-span-2">
            <button 
              type="submit" 
              disabled={updating}
              className="w-full py-5 bg-black text-white rounded-2xl font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-zinc-800 transition-all disabled:opacity-50"
            >
              {updating ? <Loader2 className="animate-spin" /> : <><Save size={18} /> Update Product</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}