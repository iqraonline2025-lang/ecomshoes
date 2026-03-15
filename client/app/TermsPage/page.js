"use client";

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Scale, FileText, AlertTriangle, HelpCircle } from 'lucide-react';

const TERMS_SECTIONS = [
  {
    id: "service",
    title: "01. Service Terms",
    content: "By accessing EcomShoes (Studio Labs), you agree to be bound by these Terms of Service. We reserve the right to refuse service, terminate accounts, or cancel orders at our sole discretion, especially in cases of suspected bot activity or resale fraud."
  },
  {
    id: "billing",
    title: "02. Payments & Pricing",
    content: "All prices are subject to change without notice. We reserve the right to modify or discontinue a 'Drop' at any time. In the event of a pricing error, we reserve the right to cancel any orders placed at the incorrect price."
  },
  {
    id: "intellectual",
    title: "03. Intellectual Property",
    content: "All content included on this site, such as text, graphics, logos, and images, is the property of Studio Labs. The 'Carbon-Flow' and 'Phantom' shoe silhouettes are protected by design patents. Unauthorized reproduction is strictly prohibited."
  },
  {
    id: "liability",
    title: "04. Limitation of Liability",
    content: "Studio Labs shall not be liable for any special or consequential damages that result from the use of, or the inability to use, the materials on this site or the performance of the products, even if Studio Labs has been advised of the possibility of such damages."
  }
];

export default function TermsPage() {
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-white text-black font-sans">
      
      {/* Navigation */}
      <nav className="p-6 border-b border-zinc-100 flex justify-between items-center sticky top-0 bg-white/80 backdrop-blur-md z-50">
        <Link href="/" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest hover:text-zinc-500 transition">
          <ArrowLeft size={14} /> Back
        </Link>
        <div className="text-[10px] font-black uppercase tracking-[0.4em] italic text-zinc-400">
          Legal // Terms_Of_Use
        </div>
        <div className="w-10" />
      </nav>

      <main className="max-w-[1400px] mx-auto px-6 py-12 md:py-24">
        
        {/* Header */}
        <div className="mb-24">
          <h1 className="text-[12vw] font-black tracking-tighter leading-[0.8] uppercase italic mb-8">
            The<br />Rules.
          </h1>
          <div className="flex flex-col md:flex-row justify-between items-end gap-8 border-t border-zinc-100 pt-8">
            <p className="max-w-md text-sm font-bold text-zinc-400 uppercase tracking-widest leading-relaxed">
              Effective Date: March 2026. By interacting with this platform, you acknowledge that you have read and understood our operational framework.
            </p>
            <FileText size={40} strokeWidth={1} className="text-zinc-200 hidden md:block" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* STICKY SIDEBAR NAVIGATION */}
          <aside className="lg:col-span-4 hidden lg:block sticky top-32 h-fit">
            <div className="space-y-6">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-300">Table of Contents</p>
              {TERMS_SECTIONS.map((section) => (
                <button 
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className="block text-xs font-black uppercase tracking-widest hover:translate-x-2 transition-transform text-zinc-400 hover:text-black text-left"
                >
                  {section.title}
                </button>
              ))}
            </div>
            
            <div className="mt-12 p-6 bg-zinc-50 border border-zinc-100">
               <HelpCircle size={20} className="mb-4" />
               <p className="text-[10px] font-black uppercase mb-2">Need Clarification?</p>
               <Link href="/ContactPage" className="text-[10px] font-bold text-zinc-500 underline underline-offset-4 hover:text-black">
                 Contact Legal Dept.
               </Link>
            </div>
          </aside>

          {/* TERMS CONTENT */}
          <div className="lg:col-span-8 space-y-32">
            {TERMS_SECTIONS.map((section) => (
              <section key={section.id} id={section.id} className="scroll-mt-32">
                <h2 className="text-4xl font-black uppercase italic tracking-tighter mb-8 flex items-center gap-4">
                  {section.title}
                  <div className="h-px flex-1 bg-zinc-100" />
                </h2>
                <p className="text-lg font-medium leading-loose text-zinc-600">
                  {section.content}
                </p>
                <div className="mt-12 flex gap-4">
                  <span className="px-3 py-1 bg-zinc-100 text-[8px] font-black uppercase tracking-widest">Binding</span>
                  <span className="px-3 py-1 bg-zinc-100 text-[8px] font-black uppercase tracking-widest">Enforceable</span>
                </div>
              </section>
            ))}

            {/* Final Warning */}
            <div className="p-10 bg-black text-white flex items-start gap-6">
              <AlertTriangle size={24} className="text-yellow-500 shrink-0" />
              <div>
                <h4 className="text-sm font-black uppercase italic tracking-widest mb-2 text-yellow-500">Notice to Resellers</h4>
                <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest leading-relaxed">
                  Studio Labs uses advanced fraud detection to identify bulk purchasing. Orders identified as commercial reselling without authorization will be canceled and subject to a 15% restocking fee.
                </p>
              </div>
            </div>
          </div>
        </div>

      </main>

      {/* Footer Decoration */}
      <footer className="py-24 border-t border-zinc-100 flex flex-col items-center">
        <Scale size={32} strokeWidth={1} className="text-zinc-200 mb-6" />
        <p className="text-[10px] font-black text-zinc-300 uppercase tracking-[0.5em]">
          All_Rights_Reserved_2026
        </p>
      </footer>
    </div>
  );
}