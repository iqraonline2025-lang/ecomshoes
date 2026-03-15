"use client";

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Shield, Eye, Lock, Globe } from 'lucide-react';

const PRIVACY_SECTIONS = [
  {
    title: "Data Collection",
    summary: "We only collect what we need to ship your shoes and improve your experience.",
    detail: "This includes your name, shipping address, email, and IP address. We do not store full credit card numbers—all payments are processed through encrypted, Tier-1 providers like Stripe or PayPal."
  },
  {
    title: "Third Party Sharing",
    summary: "We never sell your data. Period.",
    detail: "Your information is only shared with essential logistics partners (DHL, FedEx) to ensure delivery, and analytics tools to help us understand site performance. We do not provide data to third-party advertisers."
  },
  {
    title: "Cookies & Tracking",
    summary: "We use cookies to remember your cart and keep you logged in.",
    detail: "Our site uses essential cookies for functionality. We also use anonymized tracking to see which drops are the most popular, helping us plan future inventory levels."
  },
  {
    title: "Your Rights",
    summary: "You have total control over your digital footprint.",
    detail: "At any time, you can request a full export of your data or ask for your account and order history to be permanently deleted from our servers. Contact our Data Officer via the Contact Page to initiate."
  }
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white text-black font-sans">
      
      {/* Navigation */}
      <nav className="p-6 border-b border-zinc-100 flex justify-between items-center sticky top-0 bg-white/80 backdrop-blur-md z-50">
        <Link href="/" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest hover:text-zinc-500 transition">
          <ArrowLeft size={14} /> Return
        </Link>
        <div className="text-[10px] font-black uppercase tracking-[0.4em] italic text-zinc-400">
          Legal // Privacy_Protocol
        </div>
        <div className="w-10" />
      </nav>

      <main className="max-w-[1400px] mx-auto px-6 py-12 md:py-24">
        
        {/* Header */}
        <div className="mb-32">
          <h1 className="text-[12vw] font-black tracking-tighter leading-[0.8] uppercase italic mb-8">
            Digital<br />Security.
          </h1>
          <div className="flex flex-col md:flex-row justify-between items-end gap-8 border-t border-zinc-100 pt-8">
            <p className="max-w-md text-sm font-bold text-zinc-400 uppercase tracking-widest leading-relaxed">
              Last Updated: March 2026. We value your trust more than your data. Our protocols are designed to keep your identity as secure as our shipments.
            </p>
            <div className="flex gap-4 text-zinc-300">
              <Shield size={40} strokeWidth={1} />
              <Eye size={40} strokeWidth={1} />
              <Lock size={40} strokeWidth={1} />
            </div>
          </div>
        </div>

        {/* Policy Grid */}
        <div className="space-y-24">
          {PRIVACY_SECTIONS.map((section, index) => (
            <div key={index} className="grid grid-cols-1 lg:grid-cols-12 gap-8 border-b border-zinc-50 pb-24">
              <div className="lg:col-span-4">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-300 mb-4 block">
                  Clause_{index + 1}
                </span>
                <h2 className="text-3xl font-black uppercase italic tracking-tighter mb-4">
                  {section.title}
                </h2>
                <p className="text-sm font-bold leading-relaxed">
                  {section.summary}
                </p>
              </div>
              <div className="lg:col-span-1 hidden lg:block" />
              <div className="lg:col-span-7 bg-zinc-50 p-8 md:p-12">
                <p className="text-xs font-medium text-zinc-500 uppercase tracking-widest leading-loose">
                  {section.detail}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Global Compliance Note */}
        <div className="mt-32 p-12 border border-zinc-100 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
           <div className="flex items-center gap-6">
             <Globe size={32} className="text-zinc-200" />
             <div>
               <h4 className="text-sm font-black uppercase italic tracking-widest">Global Compliance</h4>
               <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-1">GDPR / CCPA / APPI compliant architecture.</p>
             </div>
           </div>
           <Link href="/ContactPage">
             <button className="bg-black text-white px-8 py-4 text-[10px] font-black uppercase tracking-widest hover:bg-zinc-800 transition-all">
               Request Data Export
             </button>
           </Link>
        </div>

      </main>

      {/* Footer Decoration */}
      <footer className="py-24 text-center">
        <div className="text-[15vw] font-black text-zinc-50 select-none leading-none tracking-tighter italic">
          TRUSTED
        </div>
      </footer>
    </div>
  );
}