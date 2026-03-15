'use client';

import React, { useState, useEffect, useCallback } from 'react';
import ProductCard from './ProductCard';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProductGrid({ activeFilters = {} }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // ✅ Step 1: Dynamic API URL
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      // ✅ Step 2: Build search query from active filters
      const query = new URLSearchParams({
        category: activeFilters.category || '',
        brand: activeFilters.brand?.join(',') || '',
        maxPrice: activeFilters.maxPrice || '',
        _t: Date.now() // Prevent aggressive browser caching
      }).toString();

      const res = await fetch(`${API_URL}/api/products?${query}`);
      const result = await res.json();

      if (result.success) {
        // Handle variations in backend response naming (products vs data)
        const rawItems = result.products || result.data || [];

        // ✅ Step 3: Global Filter - Exclude Flash Sales from the main grid
        const regularItems = rawItems.filter(p => {
          const isFlash = p.isFlashSale === true || p.isFlashSale === 'true';
          return !isFlash;
        });

        setProducts(regularItems);
      }
    } catch (error) {
      console.error("ProductGrid Error:", error);
    } finally {
      setLoading(false);
    }
  }, [activeFilters, API_URL]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // ✅ Step 4: Guard for Cart/Wishlist actions
  const handleProtectedAction = (actionCallback) => {
    const token = localStorage.getItem('shoeStoreToken');
    if (!token) {
      // Redirect to login if user isn't authenticated
      router.push('/auth');
      return;
    }
    actionCallback();
  };

  return (
    <div className="w-full py-12">
      {/* Container for smooth grid transitions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 min-h-[400px]">
        <AnimatePresence mode="popLayout">
          {products.length > 0 ? (
            products.map((p, index) => (
              <motion.div
                key={p._id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <ProductCard 
                  product={p} 
                  onProtectedAction={handleProtectedAction} 
                />
              </motion.div>
            ))
          ) : (
            !loading && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full flex flex-col items-center justify-center py-20 text-zinc-400"
              >
                <p className="text-[10px] font-black uppercase tracking-[0.3em]">
                  No matches in current inventory.
                </p>
              </motion.div>
            )
          )}
        </AnimatePresence>
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center mt-10 gap-3">
          <Loader2 className="animate-spin text-zinc-900" size={32} />
          <span className="text-[8px] font-black uppercase tracking-widest text-zinc-400">
            Refreshing Vault...
          </span>
        </div>
      )}
    </div>
  );
}