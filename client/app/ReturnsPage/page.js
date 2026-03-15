"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Package, 
  ClipboardCheck, 
  Truck, 
  CreditCard,
  ChevronRight,
  AlertCircle
} from 'lucide-react';

const RETURN_STEPS = [
  {
    number: "01",
    title: "Initiate Request",
    description: "Enter your order number and email to generate a pre-paid return authorization.",
    icon: <ClipboardCheck size={20} />
  },
  {
    number: "02",
    title: "Pack Items",
    description: "Place items in original packaging with all security tags attached.",
    icon: <Package size={20} />
  },
  {
    number: "03",
    title: "Drop Off",
    description: "Leave your parcel at any authorized DHL or FedEx location.",
    icon: <Truck size={20} />
  },
  {
    number: "04",
    title: "Refund Processed",
    description: "Once inspected, funds are returned to your original payment method within 5 days.",
    icon: <CreditCard size={20} />
  }
];

export default function ReturnsPage() {
  const [orderNum, setOrderNum] = useState("");

  return (
    <div className="min-h-screen bg-white text-black font-sans">
      
      {/* Navigation */}
      <nav className="p-6 border-b border-zinc-100 flex justify-between items-center sticky top-0 bg-white/80 backdrop-blur-md z-50">
        <Link href="/" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest hover:text-zinc-500 transition">
          <ArrowLeft size={14} /> Back to Store
        </Link>
        <div className="text-[10px] font-black uppercase tracking-[0.4em] italic text-zinc-400">
          Support // Returns_Portal
        </div>
        <div className="w-10" />
      </nav>

      <main className="max-w-[1400px] mx-auto px-6 py-12 md:py-24">
        
        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-end mb-32">
          <div>
            <h1 className="text-[12vw] font-black tracking-tighter leading-[0.8] uppercase italic mb-8">
              Seamless<br />Returns.
            </h1>
            <p className="max-w-md text-sm font-bold text-zinc-400 uppercase tracking-widest leading-relaxed">
              Not the right fit? Our return process is designed to be as effortless as your purchase. 14-day window guaranteed.
            </p>
          </div>

          {/* Functional Form */}
          <div className="bg-zinc-50 p-8 md:p-12 border border-zinc-100">
            <h3 className="text-xs font-black uppercase tracking-[0.3em] mb-8">Start a Return</h3>
            <div className="space-y-6">
              <div>
                <label className="text-[10px] font-black uppercase text-zinc-400 block mb-2">Order Number</label>
                <input 
                  type="text" 
                  placeholder="#ES-00000"
                  className="w-full bg-transparent border-b border-zinc-300 py-3 text-sm outline-none focus:border-black transition-all uppercase tracking-widest"
                  value={orderNum}
                  onChange={(e) => setOrderNum(e.target.value)}
                />
              </div>
              <button className="w-full bg-black text-white py-5 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-zinc-800 transition-all flex items-center justify-center gap-2">
                Find My Order <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* Step-by-Step Guide */}
        <div className="mb-32">
          <h2 className="text-xs font-black uppercase tracking-[0.5em] text-zinc-300 mb-12 text-center">The Process</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {RETURN_STEPS.map((step) => (
              <div key={step.number} className="group p-8 border border-zinc-100 hover:border-black transition-all duration-500">
                <div className="flex justify-between items-start mb-12">
                  <span className="text-4xl font-black italic text-zinc-100 group-hover:text-black transition-colors">{step.number}</span>
                  <div className="p-3 bg-zinc-50 text-zinc-400 group-hover:bg-black group-hover:text-white transition-all">
                    {step.icon}
                  </div>
                </div>
                <h4 className="text-sm font-black uppercase tracking-widest mb-4 italic">{step.title}</h4>
                <p className="text-xs font-medium text-zinc-500 leading-relaxed uppercase tracking-wider">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Policy Notice */}
        <div className="bg-zinc-950 text-white p-12 flex flex-col md:flex-row items-center gap-12">
          <div className="bg-white/10 p-4 rounded-full">
            <AlertCircle size={32} className="text-white" />
          </div>
          <div>
            <h5 className="text-xl font-black uppercase italic tracking-tighter mb-2">Important Eligibility Note</h5>
            <p className="max-w-2xl text-[10px] font-bold text-zinc-500 uppercase tracking-widest leading-loose">
              To be eligible for a refund, shoes must be returned in their original box with the protective film on the soles intact. "Archive" and "Limited Drop" items are eligible for store credit only.
            </p>
          </div>
        </div>

      </main>

      {/* Footer Support Link */}
      <footer className="py-24 border-t border-zinc-100 text-center">
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-300 mb-6">Still have questions?</p>
        <Link href="/ShippingPage" className="text-xs font-black uppercase tracking-widest border-b-2 border-black pb-1 hover:text-zinc-500 hover:border-zinc-500 transition-all">
          View Full Policy Details
        </Link>
      </footer>
    </div>
  );
}