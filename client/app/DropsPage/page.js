"use client";

import React from 'react';
import Link from 'next/link';
import { 
  Search, 
  ShoppingBag, 
  Clock, 
  Zap, 
  Bell, 
  ChevronRight,
  Star 
} from 'lucide-react';

export default function NewDropsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white font-sans text-black">
      
      {/* 1. NAVIGATION */}
      <nav className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur-sm">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between px-6 py-4">
          <Link href="/" className="text-2xl font-black tracking-tighter uppercase cursor-pointer italic">
            ROADKICKS
          </Link>
          
          <div className="hidden md:flex space-x-8 font-bold text-xs uppercase tracking-widest text-gray-400">
            {/* FIXED: Path updated to match your folder name */}
            <Link href="/ShopPage" className="hover:text-black transition">The Collection</Link>
            
            {/* ACTIVE LINK: Points to itself */}
            <Link href="/NewDropsPage" className="text-black transition underline underline-offset-8 decoration-2">
              New Drops
            </Link>
            
            <Link href="#" className="hover:text-black transition">Sustainability</Link>
            <Link href="#" className="hover:text-black transition">Our Story</Link>
          </div>

          <div className="flex items-center space-x-5">
            <Search size={20} className="cursor-pointer hover:text-gray-500 transition" />
            <ShoppingBag size={20} className="cursor-pointer hover:text-gray-500 transition" />
          </div>
        </div>
      </nav>

      <main className="flex-1">
        {/* 2. HYPE HERO SECTION */}
        <section className="max-w-[1440px] mx-auto px-6 py-20 lg:py-32 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 text-red-600 text-[10px] font-black uppercase tracking-widest mb-6">
            <Zap size={12} fill="currentColor" /> Live Now: Spring '26
          </div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase italic leading-[0.85] mb-8">
            The Next <br /> Generation <br /> 
            <span className="text-gray-200">of Speed.</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-500 leading-relaxed max-w-xl mb-10">
            Limited quantities. Infinite impact. Our newest arrivals feature the 
            breakthrough Carbon-Flow™ sole technology. 
          </p>
          <div className="flex gap-4">
            <button className="bg-black text-white px-8 py-4 text-xs font-black uppercase tracking-widest hover:bg-zinc-800 transition shadow-lg">
              Explore Drops
            </button>
            <button className="flex items-center gap-2 px-8 py-4 text-xs font-black uppercase tracking-widest border border-zinc-200 hover:border-black transition">
              <Bell size={14} /> Notify Me
            </button>
          </div>
        </section>

        {/* 3. RELEASE CALENDAR */}
        <section className="bg-zinc-50 py-24 border-y border-zinc-100">
          <div className="max-w-[1440px] mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
              <div className="max-w-xl">
                <h2 className="text-3xl font-black uppercase italic tracking-tighter mb-4">Release Calendar</h2>
                <p className="text-gray-500 text-sm leading-relaxed">
                  We drop new silhouettes every Tuesday at 10:00 AM EST. Stay ahead of the 
                  curve with our upcoming launch schedule.
                </p>
              </div>
              <button className="text-xs font-bold uppercase border-b-2 border-black pb-1 flex items-center gap-1 hover:text-zinc-600 hover:border-zinc-600 transition">
                View Full Calendar <ChevronRight size={14} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="group border-l-4 border-black pl-8 py-4 bg-white shadow-sm hover:shadow-md transition-shadow">
                <span className="text-xs font-black text-zinc-400 uppercase tracking-[0.3em]">Coming March 18</span>
                <h4 className="text-2xl font-bold italic mt-2">Phantom G7 "Eclipse"</h4>
                <p className="text-gray-500 text-sm mt-3 leading-relaxed">
                  Our darkest colorway yet. Featuring matte-finish synthetic overlays 
                  and a light-reactive heel tab. Strictly limited to 500 pairs.
                </p>
              </div>
              
              <div className="group border-l-4 border-zinc-200 pl-8 py-4 bg-white shadow-sm hover:shadow-md transition-shadow">
                <span className="text-xs font-black text-zinc-400 uppercase tracking-[0.3em]">Coming March 25</span>
                <h4 className="text-2xl font-bold italic mt-2">Aero-Lush 2.0 "Desert"</h4>
                <p className="text-gray-500 text-sm mt-3 leading-relaxed">
                  Inspired by high-altitude landscapes. A neutral palette met with 
                  aggressive trail-ready traction.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 4. EXCLUSIVE FEATURES */}
        <section className="max-w-[1440px] mx-auto px-6 py-24">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="flex flex-col gap-4">
              <div className="w-12 h-12 flex items-center justify-center bg-black text-white rounded-xl">
                <Clock size={20} />
              </div>
              <h5 className="font-bold uppercase text-xs tracking-widest italic">Early Access</h5>
              <p className="text-gray-500 text-xs leading-relaxed">
                Members get 24-hour early access to all New Drops. Sign up for our 
                newsletter to receive your invitation.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <div className="w-12 h-12 flex items-center justify-center bg-black text-white rounded-xl">
                <Zap size={20} />
              </div>
              <h5 className="font-bold uppercase text-xs tracking-widest italic">Instant Comfort</h5>
              <p className="text-gray-500 text-xs leading-relaxed">
                Zero break-in time. Our New Drops use pre-flexed materials that mold 
                to your foot shape the moment you step in.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <div className="w-12 h-12 flex items-center justify-center bg-black text-white rounded-xl">
                <Star size={20} />
              </div>
              <h5 className="font-bold uppercase text-xs tracking-widest italic">Certified Authentic</h5>
              <p className="text-gray-500 text-xs leading-relaxed">
                Every drop comes with a digital certificate of authenticity and 
                a unique production number stamped on the tongue.
              </p>
            </div>
          </div>
        </section>

        {/* 5. REDIRECT CTA */}
        <section className="py-32 flex flex-col items-center justify-center text-center px-6 bg-white">
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter italic uppercase mb-10 max-w-3xl leading-[0.9]">
            Don't miss the next <br /> big arrival.
          </h2>
          
          <Link href="/">
            <button className="bg-black text-white px-12 py-6 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-zinc-800 transition-all shadow-xl active:scale-95">
              Return to Storefront
            </button>
          </Link>
        </section>
      </main>
    </div>
  );
}