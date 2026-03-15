"use client";

import React from 'react';
import Link from 'next/link';
import { 
  Search, 
  ShoppingBag, 
  ArrowRight, 
  Star, 
  ShieldCheck, 
  Truck 
} from 'lucide-react';

export default function ShopDescriptionPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white font-sans text-black">
      
      {/* 1. NAVIGATION */}
      <nav className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur-sm">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between px-6 py-4">
          <Link href="/" className="text-2xl font-black tracking-tighter uppercase cursor-pointer italic">
            ROADKICKS
          </Link>
          
          <div className="hidden md:flex space-x-8 font-bold text-xs uppercase tracking-widest text-gray-400">
            <a href="#" className="text-black transition">The Collection</a>
            <a href="#" className="hover:text-black transition">Performance</a>
            <a href="#" className="hover:text-black transition">Sustainability</a>
            <a href="#" className="hover:text-black transition">Our Story</a>
          </div>

          <div className="flex items-center space-x-5">
            <Search size={20} className="cursor-pointer hover:text-gray-500 transition" />
            <ShoppingBag size={20} className="cursor-pointer hover:text-gray-500 transition" />
          </div>
        </div>
      </nav>

      <main className="flex-1">
        {/* 2. HERO DESCRIPTION */}
        <section className="max-w-[1440px] mx-auto px-6 py-20 lg:py-32">
          <div className="max-w-4xl">
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic leading-[0.9] mb-8">
              Engineered for <br /> the modern <br /> 
              <span className="text-gray-300 underline decoration-black decoration-4 italic">movement.</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 leading-relaxed max-w-2xl">
              At EcomShoes, we don't just build footwear; we craft tools for progression. 
              Our collection represents a decade of research into biomechanics, 
              street culture, and sustainable manufacturing.
            </p>
          </div>
        </section>

        {/* 3. CATEGORY BREAKDOWN */}
        <section className="bg-black text-white py-24">
          <div className="max-w-[1440px] mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-16">
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-[0.3em] text-gray-500">01. Performance</h3>
              <h4 className="text-2xl font-bold italic">The Elite Series</h4>
              <p className="text-gray-400 text-sm leading-relaxed">
                Designed for marathon runners and gym enthusiasts alike. Our performance range 
                features high-rebound foams and breathable mesh uppers.
              </p>
              <button className="flex items-center gap-2 text-xs font-bold uppercase border-b border-white pb-1 hover:text-gray-400 transition">
                View Specs <ArrowRight size={14} />
              </button>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-[0.3em] text-gray-500">02. Lifestyle</h3>
              <h4 className="text-2xl font-bold italic">Street Standards</h4>
              <p className="text-gray-400 text-sm leading-relaxed">
                Where culture meets comfort. These are the silhouettes that define the city. 
                Premium leather and all-day wearability for the urban explorer.
              </p>
              <button className="flex items-center gap-2 text-xs font-bold uppercase border-b border-white pb-1 hover:text-gray-400 transition">
                Explore Style <ArrowRight size={14} />
              </button>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-[0.3em] text-gray-500">03. Heritage</h3>
              <h4 className="text-2xl font-bold italic">Archival Icons</h4>
              <p className="text-gray-400 text-sm leading-relaxed">
                Our roots. The designs that started it all, rebuilt with modern materials. 
                Nostalgia-driven aesthetic with the durability of today's tech.
              </p>
              <button className="flex items-center gap-2 text-xs font-bold uppercase border-b border-white pb-1 hover:text-gray-400 transition">
                See History <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </section>

        {/* 4. TRUST & VALUES SECTION */}
        <section className="max-w-[1440px] mx-auto px-6 py-24 border-b border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {[
              { icon: <Truck size={24} />, title: "Priority Shipping", desc: "Delivered in 2-3 business days globally." },
              { icon: <ShieldCheck size={24} />, title: "Secure Checkout", desc: "End-to-end encrypted payment processing." },
              { icon: <Star size={24} />, title: "Premium Quality", desc: "Hand-inspected materials and construction." },
              { icon: <Search size={24} />, title: "Authentic Gear", desc: "100% original designs and brand partners." }
            ].map((item, index) => (
              <div key={index} className="flex flex-col items-center text-center group">
                <div className="p-4 bg-gray-50 rounded-full mb-4 group-hover:bg-black group-hover:text-white transition-all duration-300">
                  {item.icon}
                </div>
                <h5 className="font-bold uppercase text-xs tracking-widest mb-2">{item.title}</h5>
                <p className="text-gray-500 text-xs">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 5. CALL TO ACTION (WITH HOME REDIRECT) */}
        <section className="py-32 flex flex-col items-center justify-center text-center px-6">
          <span className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-400 mb-6">
            Ready to Step Up?
          </span>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tighter italic uppercase mb-10 max-w-2xl leading-none">
            Find the perfect pair for your next adventure.
          </h2>
          
          <Link href="/">
            <button className="bg-black text-white px-10 py-5 text-xs font-black uppercase tracking-widest hover:bg-gray-800 transition shadow-2xl active:scale-95">
              Return to Storefront
            </button>
          </Link>
        </section>
      </main>
    </div>
  );
}