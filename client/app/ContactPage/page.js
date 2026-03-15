"use client";

import React from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  MessageCircle, 
  Mail, 
  MapPin, 
  ArrowUpRight,
  Clock
} from 'lucide-react'; // ✅ Correct package // Assuming lucide-react, corrected typo if any

export default function ContactPage() {
  // ✅ Fixed: WhatsApp requires international format without '+' or '00'
  // 07518504583 -> 447518504583
  const whatsappNumber = "447518504583"; 
  const message = encodeURIComponent("Hello RoadKicks! I have a question regarding my order.");
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;

  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-black selection:text-white">
      
      {/* Navigation */}
      <nav className="p-6 border-b border-zinc-100 flex justify-between items-center sticky top-0 bg-white/80 backdrop-blur-md z-50">
        <Link href="/" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest hover:opacity-50 transition">
          <ArrowLeft size={14} /> Home
        </Link>
        <div className="text-[10px] font-black uppercase tracking-[0.4em] italic text-zinc-400">
          Connect // RoadKicks
        </div>
        <div className="w-10" />
      </nav>

      <main className="max-w-[1400px] mx-auto px-6 py-12 md:py-24">
        
        {/* Header Section */}
        <div className="mb-20">
          <h1 className="text-[12vw] md:text-[10vw] font-black tracking-tighter leading-[0.8] uppercase italic mb-8">
            Get In<br />Touch.
          </h1>
          <p className="max-w-md text-[10px] md:text-sm font-bold text-zinc-400 uppercase tracking-widest leading-relaxed">
            Skip the email chain. Connect directly with our concierge team for immediate assistance with sizing, shipping, or drops.
          </p>
        </div>

        {/* The Grid - Fixed to be more responsive */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-1 bg-zinc-100 border border-zinc-100 shadow-2xl shadow-black/5">
          
          {/* LEFT COLUMN: PRIMARY ACTION (WHATSAPP) */}
          <div className="bg-white p-8 md:p-16 flex flex-col justify-between min-h-[450px] lg:h-[600px]">
            <div>
              <div className="w-14 h-14 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mb-8 rotate-3">
                <MessageCircle size={28} fill="currentColor" />
              </div>
              <h2 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter mb-4 leading-none">Priority<br/>WhatsApp</h2>
              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] leading-loose max-w-xs mt-6">
                Average response time: {"<"} 15 minutes during operating hours.
              </p>
            </div>

            <a 
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between bg-black text-white p-6 text-[11px] font-black uppercase tracking-[0.3em] hover:bg-zinc-800 transition-all active:scale-[0.98]"
            >
              Start Chat Now
              <ArrowUpRight size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </a>
          </div>

          {/* RIGHT COLUMN: SECONDARY INFO */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-1 bg-zinc-100">
            <div className="bg-white p-8 md:p-12 flex flex-col justify-between min-h-[200px]">
              <div>
                <Mail size={20} className="mb-6 text-zinc-300" />
                <h3 className="text-[10px] font-black uppercase tracking-widest mb-3 text-zinc-400">Email Inquiries</h3>
                <p className="text-xs font-bold hover:underline cursor-pointer">road.kicks.uk@gmail.com</p>
              </div>
            </div>

            <div className="bg-white p-8 md:p-12 flex flex-col justify-between min-h-[200px]">
              <div>
                <Clock size={20} className="mb-6 text-zinc-300" />
                <h3 className="text-[10px] font-black uppercase tracking-widest mb-3 text-zinc-400">Service Hours</h3>
                <p className="text-xs font-bold uppercase tracking-tighter">Mon—Fri: 09:00 - 18:00 GMT</p>
              </div>
            </div>

            <div className="bg-white p-8 md:p-12 md:col-span-2 flex flex-col justify-between h-full min-h-[250px]">
              <div>
                <MapPin size={20} className="mb-6 text-zinc-300" />
                <h3 className="text-[10px] font-black uppercase tracking-widest mb-3 text-zinc-400">Dispatch Hub</h3>
                <p className="text-xs font-bold uppercase tracking-widest leading-relaxed max-w-xs">
                  Road Kicks HQ<br />
                  248 Industrial Way<br />
                  Lower Manhattan, NY 10013
                </p>
              </div>
              <div className="mt-8 text-[9px] font-black text-zinc-200 uppercase tracking-[0.5em]">
                Global Shipping Enabled
              </div>
            </div>
          </div>
        </div>

        {/* Brand Decoration Footer */}
        <div className="mt-32 pt-12 border-t border-zinc-100 flex justify-between items-center opacity-20 select-none">
          <span className="text-[5vw] font-black italic tracking-tighter uppercase">Road Kicks</span>
          <span className="text-[5vw] font-black italic tracking-tighter uppercase text-zinc-200">2026</span>
        </div>
      </main>
    </div>
  );
}