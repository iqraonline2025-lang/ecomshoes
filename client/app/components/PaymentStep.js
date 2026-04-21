"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, ChevronLeft, CreditCard, Wallet } from 'lucide-react';

const PaymentStep = ({ data, setData, onNext, onBack }) => {
  const selectPayment = (method) => {
    setData({ ...data, paymentMethod: method });
  };

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
            Payment <span className="text-zinc-400 font-light">Method</span>
          </h2>
          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em]">Select how you would like to pay</p>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {/* Card Payment Option */}
          <button 
            type="button"
            onClick={() => selectPayment('card')}
            className={`flex items-center justify-between p-8 rounded-3xl border-2 transition-all ${
              data.paymentMethod === 'card' ? 'border-black bg-white shadow-xl shadow-black/5' : 'border-zinc-100 opacity-40 hover:opacity-100'
            }`}
          >
            <div className="flex items-center gap-6">
              <div className={`p-4 rounded-2xl ${data.paymentMethod === 'card' ? 'bg-black text-white' : 'bg-zinc-100 text-zinc-400'}`}>
                <CreditCard size={24}/>
              </div>
              <div className="text-left">
                <p className="text-xs font-black uppercase tracking-widest text-black">Credit / Debit Card</p>
                <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-tight">Secure payment via Stripe</p>
              </div>
            </div>
            {data.paymentMethod === 'card' && <div className="w-3 h-3 bg-blue-600 rounded-full animate-pulse" />}
          </button>

          {/* Digital Wallet Option (e.g., Apple/Google Pay) */}
          <button 
            type="button"
            onClick={() => selectPayment('wallet')}
            className={`flex items-center justify-between p-8 rounded-3xl border-2 transition-all ${
              data.paymentMethod === 'wallet' ? 'border-black bg-white shadow-xl shadow-black/5' : 'border-zinc-100 opacity-40 hover:opacity-100'
            }`}
          >
            <div className="flex items-center gap-6">
              <div className={`p-4 rounded-2xl ${data.paymentMethod === 'wallet' ? 'bg-black text-white' : 'bg-zinc-100 text-zinc-400'}`}>
                <Wallet size={24}/>
              </div>
              <div className="text-left">
                <p className="text-xs font-black uppercase tracking-widest text-black">Digital Wallet</p>
                <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-tight">Apple Pay / Google Pay</p>
              </div>
            </div>
            {data.paymentMethod === 'wallet' && <div className="w-3 h-3 bg-blue-600 rounded-full animate-pulse" />}
          </button>
        </div>

        <div className="p-6 bg-zinc-100 rounded-2xl border border-zinc-200">
          <p className="text-[9px] font-bold text-zinc-500 uppercase leading-relaxed text-center tracking-widest">
            By proceeding, you agree to our <span className="text-black underline">Terms of Service</span>. Your transaction is encrypted and secured.
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <button 
          type="button"
          onClick={onBack}
          className="flex-1 border-2 border-zinc-200 text-black py-6 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-3 hover:bg-zinc-50 transition-all"
        >
          <ChevronLeft size={18} /> Back
        </button>
        <button 
          type="button"
          onClick={onNext}
          className="flex-[2] bg-black text-white py-6 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-3 hover:bg-zinc-800 transition-all group"
        >
          Review Order <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </motion.div>
  );
};

export default PaymentStep;