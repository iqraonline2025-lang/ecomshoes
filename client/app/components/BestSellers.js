"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Heart, Star, Check, Plus } from 'lucide-react';

const products = [
  { id: 1, name: "Apex Runner v2", price: "$145.00", rating: 4.9, image: "/images/shoe1.jpeg", tag: "Best Seller" },
  { id: 2, name: "Cloud Walker Sneakers", price: "$120.00", rating: 4.8, image: "/images/casual.jpeg", tag: "Trending" },
  { id: 3, name: "Executive Oxford", price: "$210.00", rating: 5.0, image: "/images/shoe3.jpeg", tag: "New Arrival" },
  { id: 4, name: "Tempo Training Pro", price: "$130.00", rating: 4.7, image: "/images/shoe4.jpeg", tag: "Best Seller" }
];

const BestSellers = () => {
  const [wishlist, setWishlist] = useState([]);
  const [addingId, setAddingId] = useState(null);

  useEffect(() => {
    const savedWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    setWishlist(savedWishlist.map(item => item.id));
  }, []);

  const handleWishlist = (e, product) => {
    e.stopPropagation();
    let currentWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    const isAlreadyInWishlist = wishlist.includes(product.id);

    if (isAlreadyInWishlist) {
      currentWishlist = currentWishlist.filter(item => item.id !== product.id);
      setWishlist(wishlist.filter(id => id !== product.id));
    } else {
      currentWishlist.push(product);
      setWishlist([...wishlist, product.id]);
    }
    
    localStorage.setItem('wishlist', JSON.stringify(currentWishlist));
    // Trigger Navbar update
    window.dispatchEvent(new Event("storage"));
  };

  const handleAddToCart = (product) => {
    const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
    const itemIndex = existingCart.findIndex(item => item.id === product.id);
    
    if (itemIndex > -1) {
      existingCart[itemIndex].quantity = (existingCart[itemIndex].quantity || 1) + 1;
    } else {
      existingCart.push({ ...product, quantity: 1 });
    }
    
    localStorage.setItem('cart', JSON.stringify(existingCart));
    
    // UI Feedback
    setAddingId(product.id);
    setTimeout(() => setAddingId(null), 2000);

    // Trigger Navbar update
    window.dispatchEvent(new Event("storage"));
  };

  return (
    <section className="py-24 bg-white px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-4">
          <div className="max-w-xl">
            <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="text-xs font-bold tracking-[0.5em] text-blue-600 uppercase mb-4">
              Curated Selection
            </motion.p>
            <h2 className="text-5xl md:text-7xl font-black text-black uppercase tracking-tighter leading-none">
              Best <span className="font-thin italic text-zinc-300 underline decoration-1 underline-offset-8">Sellers</span>
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {products.map((product, index) => {
            const isLiked = wishlist.includes(product.id);
            const isAdding = addingId === product.id;

            return (
              <motion.div key={product.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} viewport={{ once: true }} className="group relative">
                <div className="relative aspect-[3/4] overflow-hidden bg-zinc-50 rounded-2xl mb-6">
                  <motion.img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                  
                  <div className="absolute top-4 right-4 flex flex-col gap-2 translate-x-12 group-hover:translate-x-0 transition-transform duration-500">
                    <button onClick={(e) => handleWishlist(e, product)} className="p-3 bg-white rounded-full shadow-lg hover:bg-black hover:text-white transition-all">
                      <Heart size={18} className={isLiked ? "fill-red-500 text-red-500" : ""} />
                    </button>
                    <button onClick={() => handleAddToCart(product)} className="p-3 bg-white rounded-full shadow-lg hover:bg-blue-600 hover:text-white transition-all">
                      {isAdding ? <Check size={18} /> : <Plus size={18} />}
                    </button>
                  </div>
                </div>

                <div className="px-2">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-black uppercase tracking-tighter leading-tight">{product.name}</h3>
                    <div className="flex items-center bg-zinc-100 px-2 py-1 rounded">
                      <Star size={10} className="fill-black mr-1" />
                      <span className="text-[10px] font-bold">{product.rating}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xl font-light text-zinc-400 italic">{product.price}</span>
                    <div className="h-[1px] flex-grow bg-zinc-100 group-hover:bg-black transition-colors duration-500" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default BestSellers;