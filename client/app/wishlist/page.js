"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, ShoppingBag, ArrowLeft, XCircle } from 'lucide-react';
import Link from 'next/link';

const WishlistPage = () => {
  const [wishlistItems, setWishlistItems] = useState([]);

  // Load wishlist from localStorage on mount
  useEffect(() => {
    const savedWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    setWishlistItems(savedWishlist);
  }, []);

  // 1. REMOVE SINGLE ITEM logic
  const removeItem = (id) => {
    const updated = wishlistItems.filter(item => (item._id || item.id) !== id);
    setWishlistItems(updated);
    localStorage.setItem('wishlist', JSON.stringify(updated));
  };

  // 2. CLEAR ALL logic
  const clearWishlist = () => {
    if (window.confirm("Are you sure you want to clear your entire wishlist?")) {
      setWishlistItems([]);
      localStorage.setItem('wishlist', JSON.stringify([]));
    }
  };

  const moveToCart = (product) => {
    const currentCart = JSON.parse(localStorage.getItem('cart') || '[]');
    const productId = product._id || product.id;
    const itemExists = currentCart.find(item => (item._id || item.id) === productId);
    
    if (!itemExists) {
      localStorage.setItem('cart', JSON.stringify([...currentCart, { ...product, quantity: 1 }]));
    }
    removeItem(productId);
  };

  return (
    <div className="min-h-screen bg-white pt-24 pb-12 px-6">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-zinc-100 pb-8 gap-6">
          <div>
            <Link href="/" className="flex items-center gap-2 text-zinc-400 hover:text-black transition-colors mb-4 text-xs font-bold uppercase tracking-widest">
              <ArrowLeft size={14} /> Back to Shop
            </Link>
            <h1 className="text-5xl md:text-7xl font-black text-black uppercase tracking-tighter">
              Your <span className="font-light italic text-zinc-500">Wishlist</span>
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <p className="text-sm font-bold text-zinc-400 uppercase tracking-widest">
              {wishlistItems.length} Items
            </p>
            {/* NEW: CLEAR ALL BUTTON */}
            {wishlistItems.length > 0 && (
              <button 
                onClick={clearWishlist}
                className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-50 px-4 py-2 rounded-full border border-red-100 transition-all"
              >
                <XCircle size={14} /> Clear Wishlist
              </button>
            )}
          </div>
        </div>

        {wishlistItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode='popLayout'>
              {wishlistItems.map((item) => {
                const itemId = item._id || item.id;

                return (
                  <motion.div
                    key={itemId}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                    className="group border border-zinc-100 p-4 relative bg-white hover:shadow-xl transition-shadow duration-500"
                  >
                    {/* Delete Button (Corner Position) */}
                    <button 
                      onClick={() => removeItem(itemId)}
                      className="absolute top-6 right-6 z-10 p-3 bg-white/90 backdrop-blur-sm text-zinc-400 hover:text-red-500 rounded-full shadow-md hover:scale-110 transition-all active:scale-95"
                      aria-label="Delete item"
                    >
                      <Trash2 size={18} />
                    </button>

                    <div className="aspect-square overflow-hidden bg-zinc-50 mb-6">
                      <img 
                        src={item.images ? item.images[0] : item.image} 
                        alt={item.name} 
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                      />
                    </div>

                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <h3 className="font-bold text-black uppercase tracking-tight text-sm leading-tight">
                          {item.name}
                        </h3>
                        <p className="text-sm font-black italic mt-1 text-zinc-900">
                          ${item.newPrice || item.price}
                        </p>
                      </div>
                    </div>

                    <button 
                      onClick={() => moveToCart(item)}
                      className="w-full bg-black text-white py-4 text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-zinc-800 transition-colors shadow-lg shadow-black/10"
                    >
                      <ShoppingBag size={16} /> Move to Cart
                    </button>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        ) : (
          <div className="py-24 text-center border-2 border-dashed border-zinc-100 rounded-[40px]">
            <p className="text-zinc-400 uppercase tracking-[0.3em] mb-8 font-medium italic">Your wishlist is empty.</p>
            <Link href="/" className="px-12 py-5 bg-black text-white font-black uppercase tracking-widest text-[10px] hover:bg-zinc-800 transition-all shadow-xl shadow-black/20">
              Discover Products
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;