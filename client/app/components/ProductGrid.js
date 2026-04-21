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

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      
      // 1. ADD SEARCH
      if (activeFilters.search) queryParams.append('search', activeFilters.search);
      
      // 2. ADD SALE FLAG
      if (activeFilters.onSale) queryParams.append('onSale', 'true');
      
      // 3. ADD CATEGORY
      if (activeFilters.category) queryParams.append('category', activeFilters.category);
      
      // 4. ADD BRAND
      if (activeFilters.brand && activeFilters.brand.length > 0) {
        queryParams.append('brand', activeFilters.brand.join(','));
      }
      
      // 5. ADD PRICE & SORT
      if (activeFilters.maxPrice) queryParams.append('maxPrice', activeFilters.maxPrice);
      if (activeFilters.sort) queryParams.append('sort', activeFilters.sort);
      
      queryParams.append('_t', Date.now().toString());

      const res = await fetch(`${API_URL}/api/products?${queryParams.toString()}`);
      const result = await res.json();

      if (result.success) {
        const rawItems = result.products || result.data || [];

        // Logic check for Flash Sale visibility
        if (activeFilters.onSale) {
            setProducts(rawItems);
        } else {
            const regularItems = rawItems.filter(p => {
                const isFlash = p.isFlashSale === true || p.isFlashSale === 'true';
                return !isFlash;
            });
            setProducts(regularItems);
        }
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

  const handleProtectedAction = (actionCallback) => {
    const token = localStorage.getItem('shoeStoreToken');
    if (!token) {
      router.push('/auth');
      return;
    }
    actionCallback();
  };

  return (
    <div className="w-full py-12">
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
                {/* Ensure your ProductCard component is updated 
                   to render £ instead of $ 
                */}
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
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-center">
                  No matches found in the ROADKICKS vault.
                </p>
                {(activeFilters.search || activeFilters.category) && (
                  <button 
                    onClick={() => router.push('/category')}
                    className="mt-4 text-[9px] underline uppercase tracking-widest text-zinc-600 hover:text-black"
                  >
                    Reset All Filters
                  </button>
                )}
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