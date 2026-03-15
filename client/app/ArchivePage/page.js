"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, ShoppingCart, Info, ChevronLeft } from 'lucide-react';

const ARCHIVE_ITEMS = [
  { 
    id: "01", 
    year: "2024", 
    name: "PHANTOM G7", 
    color: "ECLIPSE", 
    price: "$220",
    resellUrl: "https://stockx.com", 
    specsUrl: "/ShopPage" 
  },
  { 
    id: "02", 
    year: "2024", 
    name: "AERO-LUSH", 
    color: "DESERT", 
    price: "$190",
    resellUrl: "https://goat.com", 
    specsUrl: "/ShopPage" 
  },
  { 
    id: "03", 
    year: "2023", 
    name: "CARBON FLOW", 
    color: "RAW GREY", 
    price: "$250",
    resellUrl: "https://ebay.com", 
    specsUrl: "/ShopPage" 
  },
];

export default function ArchivePage() {
  const [activeTab, setActiveTab] = useState("2024");

  return (
    <div className="min-h-screen bg-zinc-50 text-black font-sans">
      {/* Top Utility Bar */}
      <div className="flex justify-between items-center px-6 py-4 bg-white border-b border-zinc-200 sticky top-0 z-50">
        <Link href="/" className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
          <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> 
          Back to Store
        </Link>
        <div className="flex gap-4">
          {["2024", "2023", "2022"].map((year) => (
            <button 
              key={year}
              onClick={() => setActiveTab(year)}
              className={`text-[10px] font-black uppercase tracking-tighter pb-1 border-b-2 transition-all ${
                activeTab === year ? "border-black text-black" : "border-transparent text-zinc-300 hover:text-zinc-500"
              }`}
            >
              Series_{year}
            </button>
          ))}
        </div>
      </div>

      <main className="max-w-[1400px] mx-auto px-6 py-12">
        <div className="mb-20">
          <h1 className="text-[12vw] font-black tracking-tighter leading-[0.8] uppercase italic drop-shadow-sm">
            The<br />Vault<span className="text-zinc-200">.</span>
          </h1>
        </div>

        {/* Dynamic Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1">
          {ARCHIVE_ITEMS.filter(item => item.year === activeTab).map((item) => (
            <div key={item.id} className="group relative bg-white border border-zinc-200 p-8 hover:shadow-2xl transition-all duration-500 flex flex-col justify-between h-[500px]">
              
              {/* Item Header */}
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Release {item.id}</span>
                  <h3 className="text-3xl font-black italic tracking-tighter mt-1">{item.name}</h3>
                  <p className="text-xs font-bold text-zinc-500 uppercase">{item.color}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-black italic">MSRP</p>
                  <p className="text-lg font-black tracking-tighter">{item.price}</p>
                </div>
              </div>

              {/* Visual Placeholder (This is where the shoe image goes) */}
              <div className="flex-1 flex items-center justify-center">
                 <div className="w-full h-32 bg-zinc-50 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                 <span className="absolute text-[120px] font-black text-zinc-100/50 select-none pointer-events-none group-hover:text-zinc-200 transition-colors">
                    {item.name.split(' ')[0]}
                 </span>
              </div>

              {/* ACTION AREA - These are the functional links */}
              <div className="grid grid-cols-2 gap-2 mt-auto translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                
                {/* External Resell Link */}
                <a 
                  href={item.resellUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-black text-white text-[10px] font-black uppercase tracking-widest py-4 hover:bg-zinc-800 transition-colors"
                >
                  <ShoppingCart size={14} /> Buy Resell
                </a>

                {/* Internal Specs Link */}
                <Link 
                  href={item.specsUrl}
                  className="flex items-center justify-center gap-2 border border-zinc-200 text-black text-[10px] font-black uppercase tracking-widest py-4 hover:border-black transition-colors"
                >
                  <Info size={14} /> Details
                </Link>
                
              </div>
            </div>
          ))}
        </div>

        {/* Big CTA Link */}
        <div className="mt-32 border-t border-zinc-200 pt-12 flex flex-col md:flex-row justify-between items-center gap-8">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-zinc-400">Can't find your size?</p>
            <Link href="/DropsPage" className="group flex items-center gap-4 text-2xl font-black italic uppercase tracking-tighter">
                Check Latest Arrivals <ArrowUpRight className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </Link>
        </div>
      </main>
    </div>
  );
}