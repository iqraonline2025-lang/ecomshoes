"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Truck, 
  Globe, 
  RefreshCcw, 
  ShieldCheck, 
  ChevronRight, 
  ArrowLeft 
} from 'lucide-react';

const SHIPPING_DATA = [
  {
    id: 'domestic',
    title: 'Domestic Shipping',
    icon: <Truck size={20} />,
    content: "All domestic orders include complimentary white-glove delivery. Every parcel is fully insured and dispatched via our secure carrier network. For security purposes, a physical signature is strictly required upon arrival."
  },
  {
    id: 'international',
    title: 'International Delivery',
    icon: <Globe size={20} />,
    content: "We provide global distribution to over 50 countries. To ensure a seamless experience, all international orders are shipped DDP (Delivered Duty Paid), meaning all customs, duties, and taxes are settled at the point of purchase."
  },
  {
    id: 'returns',
    title: 'Return Policy',
    icon: <RefreshCcw size={20} />,
    content: "We accept returns on items in original, unworn condition with all security seals intact. Our team provides a pre-paid concierge return service for all domestic exchanges within the eligible window."
  },
  {
    id: 'authentication',
    title: 'Safe Passage',
    icon: <ShieldCheck size={20} />,
    content: "Every item undergoes a final inspection before being vacuum-sealed with a tamper-proof holographic strip. Our 'Safe Passage' guarantee ensures your goods arrive in perfect condition or a full recovery is issued."
  }
];

export default function ShippingPage() {
  const [activeSection, setActiveSection] = useState('domestic');

  return (
    <div className="min-h-screen bg-white text-black font-sans">
      
      {/* 1. MINIMAL NAV */}
      <nav className="p-6 border-b border-zinc-100 flex justify-between items-center sticky top-0 bg-white/80 backdrop-blur-md z-50">
        <Link href="/" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest hover:text-zinc-500 transition">
          <ArrowLeft size={14} /> Back
        </Link>
        <div className="text-[10px] font-black uppercase tracking-[0.4em] italic">
          Logistics // Support
        </div>
        <div className="w-10" />
      </nav>

      <main className="max-w-[1400px] mx-auto px-6 py-12 md:py-24">
        
        {/* 2. HEADER */}
        <div className="mb-20">
          <h1 className="text-[12vw] font-black tracking-tighter leading-[0.8] uppercase italic mb-8">
            Shipping<br />& Care.
          </h1>
          <p className="max-w-xl text-sm font-bold text-zinc-400 uppercase tracking-widest leading-relaxed">
            Our global distribution network ensures your order reaches you with uncompromising speed and total security.
          </p>
        </div>

        {/* 3. INTERACTIVE LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 border-t border-zinc-100 pt-12">
          
          <aside className="lg:col-span-4 space-y-2">
            {SHIPPING_DATA.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center justify-between p-6 transition-all duration-300 group ${
                  activeSection === item.id 
                  ? "bg-black text-white" 
                  : "bg-zinc-50 text-zinc-400 hover:bg-zinc-100"
                }`}
              >
                <div className="flex items-center gap-4">
                  {item.icon}
                  <span className="text-[10px] font-black uppercase tracking-widest">{item.title}</span>
                </div>
                <ChevronRight size={16} className={`transition-transform ${activeSection === item.id ? "translate-x-0" : "-translate-x-2 opacity-0 group-hover:opacity-100"}`} />
              </button>
            ))}
          </aside>

          <div className="lg:col-span-8 bg-zinc-50 p-10 md:p-20 flex flex-col justify-center">
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <h2 className="text-4xl font-black uppercase italic tracking-tighter mb-6">
                {SHIPPING_DATA.find(s => s.id === activeSection).title}
              </h2>
              <p className="text-xl font-medium leading-relaxed text-zinc-700 mb-10">
                {SHIPPING_DATA.find(s => s.id === activeSection).content}
              </p>
              
              <div className="flex gap-4">
                <button className="bg-black text-white px-8 py-4 text-[10px] font-black uppercase tracking-widest hover:bg-zinc-800 transition">
                  Track Order
                </button>
                <Link href="/ShopPage" className="border border-zinc-200 px-8 py-4 text-[10px] font-black uppercase tracking-widest hover:border-black transition flex items-center">
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* 4. HELP BANNER */}
        <div className="mt-32 p-12 bg-black text-white flex flex-col md:flex-row justify-between items-center gap-8">
           <div className="text-center md:text-left">
             <h3 className="text-2xl font-black uppercase italic tracking-tighter">Need live assistance?</h3>
             <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-2">Our support team is available 24/7.</p>
           </div>
           <button className="bg-white text-black px-10 py-5 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-zinc-200 transition-all">
             Open Support Ticket
           </button>
        </div>
      </main>

      <footer className="py-12 text-center text-[10px] font-black text-zinc-200 uppercase tracking-[1em]">
        ROADKICKS_Global_Logistics_2026
      </footer>
    </div>
  );
}