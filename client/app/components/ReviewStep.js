"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ShoppingBag, MapPin, CreditCard, Loader2 } from 'lucide-react';

const ReviewStep = ({ data, cartItems, subtotal, tax, onBack, onPlaceOrder, loading }) => {
  // 1. Precise Math Handling
  const safeSubtotal = Number(subtotal) || 0;
  const safeTax = Number(tax) || 0;
  const safeShipping = Number(data.shippingCost) || 0;
  const total = safeSubtotal + safeTax + safeShipping;

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }} 
      animate={{ opacity: 1, x: 0 }} 
      exit={{ opacity: 0, x: -20 }}
      className="space-y-10"
    >
      <div className="space-y-2">
        <h2 className="text-3xl font-black uppercase tracking-tighter italic">
          Review <span className="text-zinc-400 font-light">Order</span>
        </h2>
        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em]">Final check before we process your bag</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* 1. SHIPPING & PAYMENT SUMMARY */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-zinc-100 space-y-4">
            <div className="flex items-center gap-3 text-black">
              <MapPin size={16} />
              <p className="text-[10px] font-black uppercase tracking-widest">Shipping To</p>
            </div>
            <div className="text-[11px] font-bold text-zinc-500 uppercase leading-relaxed">
              <p className="text-black font-black">{data.fullName || "Name not provided"}</p>
              <p>{data.address}</p>
              <p>{data.city}, {data.postcode}</p>
              <p className="mt-1 text-[9px] text-zinc-400 italic">PH: {data.phone}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-zinc-100 space-y-4">
            <div className="flex items-center gap-3 text-black">
              <CreditCard size={16} />
              <p className="text-[10px] font-black uppercase tracking-widest">Payment Method</p>
            </div>
            <div className="flex items-center gap-2">
               <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
               <p className="text-[11px] font-black text-black uppercase">
                 {data.paymentMethod === 'card' ? 'Stripe Secure Checkout' : data.paymentMethod}
               </p>
            </div>
          </div>
        </div>

        {/* 2. PRODUCT LIST MINI-VIEW */}
        <div className="bg-white p-6 rounded-3xl border border-zinc-100 flex flex-col">
          <div className="flex items-center gap-3 text-black mb-6">
            <ShoppingBag size={16} />
            <p className="text-[10px] font-black uppercase tracking-widest">Bag Items ({cartItems.length})</p>
          </div>
          <div className="space-y-4 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
            {cartItems.map((item, idx) => {
              const itemPrice = parseFloat(item.newPrice ?? item.price ?? 0);
              // Cleanly handle image display
              const itemImage = item.image || (item.images && item.images[0]) || '';
              
              return (
                <div key={idx} className="flex justify-between items-center border-b border-zinc-50 pb-3 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-zinc-100 rounded-lg overflow-hidden flex-shrink-0 border border-zinc-100">
                      {itemImage ? (
                         <img 
                          src={itemImage} 
                          alt={item.name} 
                          className="w-full h-full object-cover" 
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[8px] text-zinc-400 uppercase">No Img</div>
                      )}
                    </div>
                    <div className="text-[10px] font-bold uppercase truncate max-w-[120px]">
                      <p className="truncate text-black">{item.name}</p>
                      <span className="block text-zinc-400">Size: {item.selectedSize || 'OS'} × {item.quantity || 1}</span>
                    </div>
                  </div>
                  <p className="text-[10px] font-black text-black">
                    ${(itemPrice * (item.quantity || 1)).toFixed(2)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* FINAL CALCULATION */}
      <div className="bg-black text-white p-8 rounded-[40px] space-y-4 shadow-2xl shadow-black/20">
        <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-zinc-500">
          <span>Subtotal</span>
          <span className="text-white">${safeSubtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-zinc-500">
          <span>Shipping Fee ({data.deliveryType})</span>
          <span className="text-white">${safeShipping.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-zinc-500">
          <span>Tax (8%)</span>
          <span className="text-white">${safeTax.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-3xl font-black uppercase tracking-tighter pt-4 border-t border-white/10">
          <span>Total</span>
          <span className="italic text-white font-black">${total.toFixed(2)}</span>
        </div>
      </div>

      {/* BUTTONS */}
      <div className="flex flex-col md:flex-row gap-4 pt-4">
        <button 
          type="button"
          onClick={onBack}
          disabled={loading}
          className="flex-1 border-2 border-zinc-100 py-6 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-3 hover:bg-zinc-50 transition-all disabled:opacity-50"
        >
          <ChevronLeft size={18} /> Back
        </button>
        <button 
          type="button"
          onClick={(e) => {
            e.preventDefault();
            onPlaceOrder();
          }}
          disabled={loading || cartItems.length === 0}
          className="flex-[2] bg-black text-white py-6 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-3 hover:bg-zinc-800 transition-all group shadow-xl shadow-black/10 disabled:bg-zinc-800 disabled:opacity-70"
        >
          {loading ? (
            <>
              <Loader2 size={18} className="animate-spin" /> Finalizing...
            </>
          ) : (
            'Authorize & Pay'
          )}
        </button>
      </div>
    </motion.div>
  );
};

export default ReviewStep;