"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ShoppingBag, Truck, CreditCard, ShieldCheck, Loader2 } from 'lucide-react';

const ReviewStep = ({ data, cartItems, subtotal, tax, onBack, onPlaceOrder, loading }) => {
  const total = subtotal + tax + data.shippingCost;

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }} 
      animate={{ opacity: 1, x: 0 }} 
      exit={{ opacity: 0, x: -20 }}
      className="space-y-12"
    >
      <div className="space-y-8">
        <div className="space-y-2">
          <h2 className="text-3xl font-black uppercase tracking-tighter italic">
            Final <span className="text-zinc-400 font-light">Review</span>
          </h2>
          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em]">Verify your details before checkout</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Shipping Summary Card */}
          <div className="p-6 bg-white border border-zinc-100 rounded-3xl space-y-4">
            <div className="flex items-center gap-3 text-zinc-400">
              <Truck size={16} />
              <span className="text-[10px] font-black uppercase tracking-widest">Shipping To</span>
            </div>
            <div>
              <p className="text-xs font-black uppercase text-black">{data.fullName}</p>
              <p className="text-[10px] font-medium text-zinc-500 uppercase leading-relaxed">
                {data.address}<br />
                {data.city}, {data.postcode}<br />
                {data.phone}
              </p>
            </div>
          </div>

          {/* Payment Summary Card */}
          <div className="p-6 bg-white border border-zinc-100 rounded-3xl space-y-4">
            <div className="flex items-center gap-3 text-zinc-400">
              <CreditCard size={16} />
              <span className="text-[10px] font-black uppercase tracking-widest">Method</span>
            </div>
            <div>
              <p className="text-xs font-black uppercase text-black">
                {data.paymentMethod === 'card' ? 'Credit / Debit Card' : 'Digital Wallet'}
              </p>
              <p className="text-[10px] font-medium text-zinc-500 uppercase">
                {data.deliveryType === 'express' ? 'Express Delivery (1-2 Days)' : 'Standard Delivery (3-5 Days)'}
              </p>
            </div>
          </div>
        </div>

        {/* Item Mini-List */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-zinc-400 px-2">
            <ShoppingBag size={16} />
            <span className="text-[10px] font-black uppercase tracking-widest">Order Items</span>
          </div>
          <div className="max-h-48 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
            {cartItems.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 bg-white border border-zinc-50 rounded-2xl">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-zinc-100 rounded-lg overflow-hidden">
                    <img src={item.image || item.images?.[0]} alt="" className="w-full h-full object-cover grayscale" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase text-black">{item.name}</p>
                    <p className="text-[9px] font-bold text-zinc-400 uppercase">QTY: {item.quantity}</p>
                  </div>
                </div>
                <span className="text-[10px] font-black text-black">£{(parseFloat((item.newPrice || item.price).toString().replace(/[£,]/g, '')) * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Security Badge */}
        <div className="flex items-center justify-center gap-2 py-4 border-y border-zinc-100">
          <ShieldCheck size={14} className="text-blue-600" />
          <span className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-400">Encrypted 256-bit SSL Transaction</span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <button 
          type="button"
          onClick={onBack}
          disabled={loading}
          className="flex-1 border-2 border-zinc-200 text-black py-6 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-3 hover:bg-zinc-50 transition-all disabled:opacity-50"
        >
          <ChevronLeft size={18} /> Back
        </button>
        <button 
          type="button"
          onClick={onPlaceOrder}
          disabled={loading}
          className="flex-[2] bg-black text-white py-6 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-3 hover:bg-zinc-800 transition-all shadow-2xl shadow-black/20 disabled:bg-zinc-400"
        >
          {loading ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <>Complete Order — £{total.toFixed(2)}</>
          )}
        </button>
      </div>
    </motion.div>
  );
};

export default ReviewStep;