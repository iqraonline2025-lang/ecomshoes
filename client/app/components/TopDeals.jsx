'use client';

import React, { useEffect, useState } from 'react';
import ProductCard from './ProductCard';
import { Flame, Loader2, ShoppingBag } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

const TopDeals = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // ✅ Step 1: Dynamic API URL
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchDeals = async () => {
      setLoading(true);
      try {
        // ✅ STRATEGY: Fetch only 8 items that are specifically marked as 'onSale'
        // This makes the page load significantly faster than filtering on the frontend.
        const response = await fetch(`${API_URL}/api/products?onSale=true&limit=8&_t=${Date.now()}`);
        const result = await response.json();

        if (result.success) {
          // Mapping to the 'products' key returned by your backend logic
          setProducts(result.products || []);
        }
      } catch (err) {
        console.error("TopDeals Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDeals();
  }, [API_URL]);

  // ✅ Step 2: Auth Guard for Protected Actions (Add to Cart/Wishlist)
  const handleProtectedAction = (actionCallback) => {
    const token = localStorage.getItem('shoeStoreToken');
    if (!token) {
      router.push('/auth');
      return;
    }
    actionCallback();
  };

  // If loading is finished and there are no deals, we hide the entire section
  if (!loading && products.length === 0) return null;

  return (
    <section id="top-deals" className="py-24 bg-white border-b border-zinc-50 overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        
        {/* --- Header Section --- */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-2"
          >
            <div className="flex items-center gap-3 text-orange-600 mb-2">
              <Flame size={24} fill="currentColor" className="animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em]">Active Flash Sales</span>
            </div>
            <h2 className="text-6xl md:text-8xl font-black uppercase italic tracking-tighter leading-[0.85]">
              Top <span className="text-zinc-100 drop-shadow-sm">Deals</span>
            </h2>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col items-start md:items-end gap-4"
          >
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 max-w-[200px] md:text-right">
              Prices as marked. Limited quantities available.
            </p>
            <button 
              onClick={() => router.push('/category?onSale=true')}
              className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-widest border-b-2 border-black pb-1 hover:text-orange-600 hover:border-orange-600 transition-all"
            >
              View All Clearance <ShoppingBag size={14} className="group-hover:rotate-12 transition-transform" />
            </button>
          </motion.div>
        </div>

        {/* --- Content Grid --- */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <Loader2 className="animate-spin text-zinc-900" size={40} />
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Scanning the vault...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
            {products.map((p, index) => (
              <motion.div
                key={p._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <ProductCard 
                  product={p} 
                  onProtectedAction={handleProtectedAction} 
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default TopDeals;