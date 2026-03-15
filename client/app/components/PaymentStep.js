"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, ChevronLeft, CreditCard, Smartphone } from 'lucide-react';

const PaymentStep = ({ data, setData, onNext, onBack }) => {
  const paymentMethods = [
    { 
      id: 'card', 
      name: 'Credit / Debit Card', 
      icon: <CreditCard size={20} />, 
      sub: 'Visa, Mastercard, Amex, Discover' 
    },
    { 
      id: 'apple', 
      name: 'Apple Pay', 
      icon: <Smartphone size={20} />, 
      sub: 'One-tap secure checkout' 
    },
    { 
      id: 'google', 
      name: 'Google Pay', 
      icon: <Smartphone size={20} />, 
      sub: 'Fast checkout with Google' 
    }
  ];

  const selectMethod = (id) => {
    setData({ ...data, paymentMethod: id });
  };

  const handleNext = (e) => {
    e.preventDefault();
    // Safety check: ensure a method is selected
    if (!data.paymentMethod) return alert("Please select a payment method");
    onNext();
  };

  const handleBack = (e) => {
    e.preventDefault();
    onBack();
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }} 
      animate={{ opacity: 1, x: 0 }} 
      exit={{ opacity: 0, x: -20 }}
      className="space-y-10"
    >
      <div className="space-y-2">
        <h2 className="text-3xl font-black uppercase tracking-tighter italic">
          Payment <span className="text-zinc-400 font-light">Method</span>
        </h2>
        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em]">
          Select your preferred gateway
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {paymentMethods.map((method) => (
          <button
            key={method.id}
            type="button" 
            onClick={() => selectMethod(method.id)}
            className={`flex items-center justify-between p-6 rounded-3xl border-2 transition-all group ${
              data.paymentMethod === method.id 
              ? 'border-black bg-white shadow-xl shadow-black/5' 
              : 'border-zinc-100 bg-transparent hover:border-zinc-200'
            }`}
          >
            <div className="flex items-center gap-5">
              <div className={`p-4 rounded-2xl transition-colors ${
                data.paymentMethod === method.id 
                ? 'bg-black text-white' 
                : 'bg-zinc-100 text-zinc-500 group-hover:bg-zinc-200'
              }`}>
                {method.icon}
              </div>
              <div className="text-left">
                <p className="text-[11px] font-black uppercase tracking-widest">{method.name}</p>
                <p className="text-[10px] font-bold text-zinc-400 uppercase">{method.sub}</p>
              </div>
            </div>
            
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
              data.paymentMethod === method.id ? 'border-black' : 'border-zinc-200'
            }`}>
              {data.paymentMethod === method.id && (
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-2.5 h-2.5 bg-black rounded-full" 
                />
              )}
            </div>
          </button>
        ))}
      </div>

      <div className="flex flex-col md:flex-row gap-4 pt-4">
        <button 
          type="button" 
          onClick={handleBack}
          className="flex-1 border-2 border-zinc-100 py-6 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-3 hover:bg-zinc-50 transition-all"
        >
          <ChevronLeft size={18} /> Back
        </button>
        <button 
          type="button" 
          onClick={handleNext}
          className="flex-[2] bg-black text-white py-6 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-3 hover:bg-zinc-800 transition-all group shadow-xl shadow-black/10"
        >
          Review Order <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      <div className="flex items-center justify-center gap-4 opacity-50 grayscale">
         {/* Trust Badges placeholder */}
         <div className="w-8 h-5 bg-zinc-200 rounded" />
         <div className="w-8 h-5 bg-zinc-200 rounded" />
         <div className="w-8 h-5 bg-zinc-200 rounded" />
      </div>
    </motion.div>
  );
};

export default PaymentStep;