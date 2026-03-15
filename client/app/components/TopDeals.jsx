'use client';

import React, { useEffect, useState } from 'react';
import ProductCard from './ProductCard';
import { Flame, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

const TopDeals = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // ✅ Step 1: Dynamic API URL
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        const response = await fetch(`${API_URL}/api/products`);
        const result = await response.json();

        if (result.success) {
          const rawItems = result.data || result.products || [];

          // ✅ Step 2: Strict Filtering for Flash Sales
          const dealItems = rawItems.filter(p => 
            p.isFlashSale === true || p.isFlashSale === 'true'
          );

          setProducts(dealItems.slice(0, 8)); // Showing up to 8 for a fuller grid
        }
      } catch (err) {
        console.error("TopDeals Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDeals();
  }, [API_URL]);

  // ✅ Step 3: Auth Guard for Deal Actions
  const handleProtectedAction = (actionCallback) => {
    const token = localStorage.getItem('shoeStoreToken');
    if (!token) {
      router.push('/auth');
      return;
    }
    actionCallback();
  };

  // Don't render the section at all if there are no active deals
  if (!loading && products.length === 0) return null;

  return (
    <section className="py-24 bg-white border-b border-gray-100 overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <h2 className="text-6xl md:text-8xl font-black uppercase italic tracking-tighter leading-none flex items-center gap-4">
            <Flame className="text-orange-600 animate-pulse" size={64} fill="currentColor" />
            Top <span className="text-neutral-200">Deals</span>
          </h2>
          <p className="text-xs font-black uppercase tracking-[0.3em] text-zinc-400 mb-2">
            Limited Quantities / Final Drops
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-zinc-200" size={40} />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((p) => (
              <ProductCard 
                key={p._id} 
                product={p} 
                onProtectedAction={handleProtectedAction} 
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default TopDeals;