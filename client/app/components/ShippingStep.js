"use client";
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, ShieldCheck, User, MapPin, Phone, Mail, Home } from 'lucide-react';

const ShippingStep = ({ data, setData, onNext }) => {
  useEffect(() => {
    // Automatically set default shipping state without requiring user selection
    if (!data.deliveryType) {
      setData(prev => ({ 
        ...prev, 
        deliveryType: 'secure_logistics', 
        shippingCost: 0 // Setting to 0 to match the "complimentary" high-end feel
      }));
    }
  }, [data.deliveryType, setData]);

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  // ✅ Comprehensive Validation
  const isFormValid = 
    data.fullName?.trim() && 
    data.email?.trim() && 
    data.address?.trim() && 
    data.city?.trim() && 
    data.postcode?.trim() && 
    data.phone?.trim();

  const handleContinue = (e) => {
    e.preventDefault();
    if (isFormValid) {
      onNext();
    }
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
            Shipping <span className="text-zinc-400 font-light">Information</span>
          </h2>
          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em]">Enter your details for secure delivery</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2 relative">
            <User className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-300" size={18} />
            <input 
              name="fullName" 
              placeholder="FULL NAME" 
              value={data.fullName || ''} 
              onChange={handleChange} 
              className="w-full bg-white border border-zinc-200 rounded-2xl pl-16 pr-6 py-5 outline-none focus:border-black transition-all font-bold text-xs uppercase tracking-widest text-black" 
            />
          </div>

          <div className="md:col-span-2 relative">
            <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-300" size={18} />
            <input 
              name="email" 
              type="email"
              placeholder="EMAIL ADDRESS" 
              value={data.email || ''} 
              onChange={handleChange} 
              className="w-full bg-white border border-zinc-200 rounded-2xl pl-16 pr-6 py-5 outline-none focus:border-black transition-all font-bold text-xs uppercase tracking-widest text-black" 
            />
          </div>
          
          <div className="md:col-span-2 relative">
            <Home className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-300" size={18} />
            <input 
              name="address" 
              placeholder="STREET ADDRESS / HOUSE NUMBER" 
              value={data.address || ''} 
              onChange={handleChange} 
              className="w-full bg-white border border-zinc-200 rounded-2xl pl-16 pr-6 py-5 outline-none focus:border-black transition-all font-bold text-xs uppercase tracking-widest text-black" 
            />
          </div>

          <div className="relative">
            <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-300" size={18} />
            <input 
              name="city" 
              placeholder="CITY" 
              value={data.city || ''} 
              onChange={handleChange} 
              className="w-full bg-white border border-zinc-200 rounded-2xl pl-16 pr-6 py-5 outline-none focus:border-black transition-all font-bold text-xs uppercase tracking-widest text-black" 
            />
          </div>

          <input 
            name="postcode" 
            placeholder="POSTCODE" 
            value={data.postcode || ''} 
            onChange={handleChange} 
            className="w-full bg-white border border-zinc-200 rounded-2xl px-6 py-5 outline-none focus:border-black transition-all font-bold text-xs uppercase tracking-widest text-black" 
          />

          <div className="md:col-span-2 relative">
            <Phone className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-300" size={18} />
            <input 
              name="phone" 
              type="tel"
              placeholder="PHONE NUMBER" 
              value={data.phone || ''} 
              onChange={handleChange} 
              className="w-full bg-white border border-zinc-200 rounded-2xl pl-16 pr-6 py-5 outline-none focus:border-black transition-all font-bold text-xs uppercase tracking-widest text-black" 
            />
          </div>
        </div>
      </div>

      {/* Simplified Logistics Info instead of selection buttons */}
      <div className="bg-zinc-50 p-6 rounded-3xl border border-zinc-100 flex items-center gap-5">
        <div className="bg-black text-white p-4 rounded-2xl">
          <ShieldCheck size={24} />
        </div>
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-black">Global Secure Logistics</p>
          <p className="text-[9px] font-bold text-zinc-400 uppercase leading-tight mt-1">
            Fully insured white-glove delivery • Signature Required
          </p>
        </div>
        <div className="ml-auto">
          <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Included</span>
        </div>
      </div>

      <button 
        type="button"
        onClick={handleContinue}
        disabled={!isFormValid}
        className="w-full bg-black text-white py-6 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-3 hover:bg-zinc-800 transition-all disabled:bg-zinc-100 disabled:text-zinc-400 disabled:cursor-not-allowed group"
      >
        {isFormValid ? (
          <>Continue to Payment <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" /></>
        ) : (
          "Complete Shipping Info"
        )}
      </button>
    </motion.div>
  );
};

export default ShippingStep;