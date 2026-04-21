"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Minus, Plus, X, ArrowRight, ShoppingBag, ChevronLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const CartPage = () => {
  const router = useRouter();
  const [cartItems, setCartItems] = useState([]);
  const [discount, setDiscount] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  useEffect(() => {
    setMounted(true);
    const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCartItems(savedCart);
  }, []);

  const updateStorage = (newCart) => {
    setCartItems(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
    window.dispatchEvent(new Event("storage")); 
  };

  const updateQuantity = (id, delta) => {
    const newCart = cartItems.map(item => {
      const itemId = item._id || item.id;
      if (itemId === id) {
        const newQty = Math.max(1, (item.quantity || 1) + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    });
    updateStorage(newCart);
  };

  const removeItem = (id) => {
    const newCart = cartItems.filter(item => (item._id || item.id) !== id);
    updateStorage(newCart);
  };

  const subtotal = cartItems.reduce((acc, item) => {
    let rawPrice = item.newPrice ?? item.price ?? 0;
    // Updated logic: Handles '£' and string/number types correctly
    const price = typeof rawPrice === 'string' 
      ? parseFloat(rawPrice.replace(/[£,]/g, '')) 
      : parseFloat(rawPrice);
    return acc + (isNaN(price) ? 0 : price) * (item.quantity || 1);
  }, 0);

  const tax = subtotal * 0.08; 
  const shipping = subtotal > 150 || subtotal === 0 ? 0 : 15;
  const total = subtotal + tax + shipping - discount;

  const handleCheckout = () => {
    if (cartItems.length === 0) return;
    setIsRedirecting(true);
    // This moves the user to your multi-step checkout
    router.push('/checkout'); 
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-white pt-32 pb-20 px-6 font-sans text-black">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col mb-12">
          <Link href="/" className="flex items-center gap-2 text-zinc-400 hover:text-black transition-colors mb-4 text-[10px] font-black uppercase tracking-[0.2em] group">
            <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> 
            Back to Collection
          </Link>
          <h1 className="text-6xl md:text-8xl font-black text-black uppercase tracking-tighter leading-none">
            Your <span className="font-light italic text-zinc-300">Bag</span>
          </h1>
        </div>

        {cartItems.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            <div className="lg:col-span-8">
              <div className="border-t-4 border-black">
                <AnimatePresence mode="popLayout">
                  {cartItems.map((item) => {
                    const itemId = item._id || item.id;
                    const displayPrice = item.newPrice || item.price || 0;
                    return (
                      <motion.div key={itemId} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col md:flex-row items-center py-10 border-b border-zinc-100 gap-8">
                        <div className="w-40 h-40 bg-zinc-50 overflow-hidden flex-shrink-0 rounded-3xl border border-zinc-100">
                          <img src={item.image || item.images?.[0]} alt={item.name} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" />
                        </div>
                        <div className="flex-grow text-center md:text-left">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="text-2xl font-black uppercase tracking-tighter text-black leading-none">{item.name}</h3>
                            <button onClick={() => removeItem(itemId)} className="hidden md:block text-zinc-200 hover:text-red-500 transition-colors">
                              <X size={24} />
                            </button>
                          </div>
                          <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-4">Size: <span className="text-black">{item.selectedSize || 'OS'}</span></p>
                          <p className="text-xl font-black italic text-blue-600">£{displayPrice}</p>
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="flex items-center border-2 border-zinc-900 rounded-full px-5 py-2">
                            <button onClick={() => updateQuantity(itemId, -1)}><Minus size={16} strokeWidth={3} /></button>
                            <span className="w-12 text-center font-black text-lg">{item.quantity || 1}</span>
                            <button onClick={() => updateQuantity(itemId, 1)}><Plus size={16} strokeWidth={3} /></button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </div>

            <div className="lg:col-span-4">
              <div className="sticky top-32 space-y-6">
                <div className="bg-black text-white p-10 rounded-[50px] shadow-3xl">
                  <h2 className="text-3xl font-black uppercase italic tracking-tighter mb-10 border-b border-white/10 pb-6">Summary</h2>
                  <div className="space-y-5 mb-10">
                    <div className="flex justify-between text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-500">
                      <span>Subtotal</span><span className="text-white">£{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-500">
                      <span>Shipping</span><span className="text-white">{shipping === 0 ? "FREE" : `£${shipping.toFixed(2)}`}</span>
                    </div>
                    <div className="flex justify-between text-4xl font-black uppercase tracking-tighter pt-4 border-t border-white/10">
                      <span>Total</span><span>£{total.toFixed(2)}</span>
                    </div>
                  </div>
                  <button onClick={handleCheckout} className="w-full bg-blue-600 text-white py-6 rounded-3xl text-[11px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-3 hover:bg-blue-700 transition-all">
                    {isRedirecting ? <Loader2 size={20} className="animate-spin" /> : <>Secure Checkout <ArrowRight size={20} /></>}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="py-32 text-center border-4 border-dashed border-zinc-50 rounded-[80px]">
            <ShoppingBag size={80} className="mx-auto mb-8 text-zinc-100" />
            <p className="text-zinc-300 uppercase tracking-[0.5em] mb-12 font-black italic text-xl">Bag is empty</p>
            <Link href="/" className="inline-block px-16 py-6 bg-black text-white text-[11px] font-black uppercase tracking-[0.3em] hover:bg-blue-600 transition-all">Start Shopping</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;