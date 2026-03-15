"use client";
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Truck, Zap, User, MapPin, Phone } from 'lucide-react';

const ShippingStep = ({ data, setData, onNext }) => {
  // Ensure a default is selected if none exists
  useEffect(() => {
    if (!data.deliveryType) {
      setData(prev => ({ ...prev, deliveryType: 'standard', shippingCost: 15 }));
    }
  }, [data.deliveryType, setData]);

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const selectDelivery = (type, cost) => {
    setData({ ...data, deliveryType: type, shippingCost: cost });
  };

  // Validation logic
  const isFormValid = 
    data.fullName?.trim() && 
    data.address?.trim() && 
    data.city?.trim() && 
    data.postcode?.trim() && 
    data.phone?.trim();

  const handleContinue = (e) => {
    e.preventDefault(); // Safety first
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
          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em]">Where should we send your heat?</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2 relative">
            <User className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-300" size={18} />
            <input 
              name="fullName" 
              placeholder="FULL NAME" 
              value={data.fullName || ''} 
              onChange={handleChange} 
              className="w-full bg-white border border-zinc-200 rounded-2xl pl-16 pr-6 py-5 outline-none focus:border-black transition-all font-bold text-xs uppercase tracking-widest" 
            />
          </div>
          
          <div className="md:col-span-2 relative">
            <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-300" size={18} />
            <input 
              name="address" 
              placeholder="STREET ADDRESS" 
              value={data.address || ''} 
              onChange={handleChange} 
              className="w-full bg-white border border-zinc-200 rounded-2xl pl-16 pr-6 py-5 outline-none focus:border-black transition-all font-bold text-xs uppercase tracking-widest" 
            />
          </div>

          <input 
            name="city" 
            placeholder="CITY" 
            value={data.city || ''} 
            onChange={handleChange} 
            className="w-full bg-white border border-zinc-200 rounded-2xl px-6 py-5 outline-none focus:border-black transition-all font-bold text-xs uppercase tracking-widest" 
          />

          <input 
            name="postcode" 
            placeholder="POSTCODE" 
            value={data.postcode || ''} 
            onChange={handleChange} 
            className="w-full bg-white border border-zinc-200 rounded-2xl px-6 py-5 outline-none focus:border-black transition-all font-bold text-xs uppercase tracking-widest" 
          />

          <div className="md:col-span-2 relative">
            <Phone className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-300" size={18} />
            <input 
              name="phone" 
              type="tel"
              placeholder="PHONE NUMBER" 
              value={data.phone || ''} 
              onChange={handleChange} 
              className="w-full bg-white border border-zinc-200 rounded-2xl pl-16 pr-6 py-5 outline-none focus:border-black transition-all font-bold text-xs uppercase tracking-widest" 
            />
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">Delivery Options</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button 
            type="button"
            onClick={() => selectDelivery('standard', 15)}
            className={`flex items-center justify-between p-6 rounded-3xl border-2 transition-all ${
              data.deliveryType === 'standard' ? 'border-black bg-white shadow-xl shadow-black/5' : 'border-zinc-100 opacity-40 hover:opacity-100'
            }`}
          >
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl ${data.deliveryType === 'standard' ? 'bg-black text-white' : 'bg-zinc-100 text-zinc-400'}`}>
                <Truck size={20}/>
              </div>
              <div className="text-left">
                <p className="text-[10px] font-black uppercase tracking-widest">Standard</p>
                <p className="text-[9px] font-bold text-zinc-400 uppercase">3-5 Business Days</p>
              </div>
            </div>
            <span className="font-black text-xs">$15.00</span>
          </button>

          <button 
            type="button"
            onClick={() => selectDelivery('express', 35)}
            className={`flex items-center justify-between p-6 rounded-3xl border-2 transition-all ${
              data.deliveryType === 'express' ? 'border-black bg-white shadow-xl shadow-black/5' : 'border-zinc-100 opacity-40 hover:opacity-100'
            }`}
          >
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl ${data.deliveryType === 'express' ? 'bg-black text-white' : 'bg-zinc-100 text-zinc-400'}`}>
                <Zap size={20}/>
              </div>
              <div className="text-left">
                <p className="text-[10px] font-black uppercase tracking-widest">Express</p>
                <p className="text-[9px] font-bold text-zinc-400 uppercase">1-2 Business Days</p>
              </div>
            </div>
            <span className="font-black text-xs">$35.00</span>
          </button>
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
          "Complete All Fields"
        )}
      </button>
    </motion.div>
  );
};

export default ShippingStep;