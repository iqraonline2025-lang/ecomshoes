'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { Instagram, Twitter, Youtube, ArrowUpRight, Check } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'success'

  // Social Media Configuration
  const SOCIAL_LINKS = [
    { 
      name: 'Instagram', 
      icon: <Instagram size={20} />, 
      href: 'https://instagram.com/roadkicks' 
    },
    { 
      name: 'Twitter', 
      icon: <Twitter size={20} />, 
      href: 'https://twitter.com/roadkicks' 
    },
    { 
      name: 'Youtube', 
      icon: <Youtube size={20} />, 
      href: 'https://youtube.com/roadkicks' 
    },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');
    
    try {
      // Replace with your actual Newsletter API endpoint
      // const response = await fetch('/api/newsletter', {
      //   method: 'POST',
      //   body: JSON.stringify({ email }),
      // });
      
      // Simulating API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setStatus('success');
      setEmail('');
      
      // Reset status after 5 seconds so they can subscribe again if needed
      setTimeout(() => setStatus('idle'), 5000);
    } catch (error) {
      console.error("Newsletter error:", error);
      setStatus('idle');
    }
  };

  return (
    <footer className="relative bg-black text-white py-12 md:py-24 px-6 md:px-12 overflow-hidden border-t border-zinc-900">
      <div className="max-w-[1400px] mx-auto relative z-10">
        
        {/* Top Section: Branding & Newsletter */}
        <div className="flex flex-col lg:flex-row justify-between items-start border-b border-zinc-900 pb-16 md:pb-24 gap-12">
          <div className="max-w-2xl">
            <h2 className="text-[clamp(2.5rem,10vw,7rem)] font-black leading-[0.85] tracking-tighter uppercase italic">
              ROAD<br />
              <span className="text-zinc-800">KICKS.</span>
            </h2>
          </div>
          
          <div className="w-full md:w-80 h-24">
            <p className="text-zinc-500 text-[10px] font-bold tracking-[0.3em] uppercase mb-6">Newsletter</p>
            
            {status === 'success' ? (
              <div className="flex items-center gap-3 text-white animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className="bg-white text-black p-1 rounded-full">
                  <Check size={14} strokeWidth={3} />
                </div>
                <span className="text-xs font-bold uppercase tracking-[0.2em]">Subscription Confirmed</span>
              </div>
            ) : (
              <form className="relative group" onSubmit={handleSubmit}>
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={status === 'loading' ? "PROCESSING..." : "ENTER EMAIL"} 
                  disabled={status === 'loading'}
                  className="bg-transparent border-b border-zinc-800 w-full py-3 text-sm outline-none focus:border-white transition-all duration-500 uppercase tracking-widest placeholder:text-zinc-800 disabled:opacity-50"
                />
                <button 
                  type="submit"
                  disabled={status === 'loading'}
                  className="absolute right-0 bottom-3 text-zinc-500 group-hover:text-white group-hover:-translate-y-1 group-hover:translate-x-1 transition-all duration-300"
                >
                  <ArrowUpRight size={22} />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Middle Section: Navigation & Socials */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-16 gap-x-8 py-16 md:py-24">
          <div className="space-y-8">
            <p className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.4em]">Navigation</p>
            <ul className="space-y-4 text-xs font-bold uppercase tracking-widest">
              <li><Link href="/ShopPage" className="hover:text-zinc-400 transition-colors">Shop All</Link></li>
              <li><Link href="/DropsPage" className="hover:text-zinc-400 transition-colors">New Drops</Link></li>
              <li><Link href="/ArchivePage" className="hover:text-zinc-400 transition-colors">Archive</Link></li>
            </ul>
          </div>

          <div className="space-y-8">
            <p className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.4em]">Assistance</p>
            <ul className="space-y-4 text-xs font-bold uppercase tracking-widest">
              <li><Link href="/ShippingPage" className="hover:text-zinc-400 transition-colors">Shipping</Link></li>
              <li><Link href="/ReturnsPage" className="hover:text-zinc-400 transition-colors">Returns</Link></li>
              <li><Link href="/ContactPage" className="hover:text-zinc-400 transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div className="space-y-8">
            <p className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.4em]">Social</p>
            <div className="flex gap-8 items-center">
              {SOCIAL_LINKS.map((social) => (
                <a 
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                  className="hover:scale-110 hover:text-zinc-400 transition-all cursor-pointer text-white"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Section: Legal */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-8 border-t border-zinc-900 text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-600">
          <p>© {currentYear} STUDIO LABS — ALL RIGHTS RESERVED</p>
          <div className="flex gap-10">
            <Link href="/PrivacyPage" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="/TermsPage" className="hover:text-white transition-colors">Terms</Link>
          </div>
        </div>
      </div>

      {/* Decorative Background Text */}
      <div className="absolute -bottom-6 -right-4 leading-none select-none pointer-events-none z-0">
        <span className="text-[20vw] font-black text-white/[0.02] tracking-tighter uppercase">
          SHOE
        </span>
      </div>
    </footer>
  );
};

export default Footer;