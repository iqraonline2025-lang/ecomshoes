"use client";
import React from 'react';
import { motion } from 'framer-motion';

const Hero = () => {
  // Animation for the text reveal
  const reveal = {
    initial: { y: "110%", opacity: 0 },
    animate: { 
      y: 0, 
      opacity: 1, 
      transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } 
    }
  };

  return (
    <section className="relative w-full h-screen bg-white flex items-center justify-center overflow-hidden">
      {/* 1. Background Video - Subtle & Integrated */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover grayscale opacity-40 mix-blend-multiply"
        >
          <source src="/images/h1.mp4" type="video/mp4" />
        </video>
      </div>

      {/* 2. Main Content */}
      <div className="relative z-10 w-full max-w-7xl px-6">
        <div className="flex flex-col items-center text-center">
          
          {/* Headline with Masking Effect */}
          <div className="overflow-hidden mb-4">
            <motion.h1 
              initial="initial"
              animate="animate"
              variants={reveal}
              className="text-[12vw] md:text-[8vw] font-light leading-[0.9] tracking-tighter text-black uppercase"
            >
              The New <span className="font-black italic text-zinc-800">Standard</span>
            </motion.h1>
          </div>

          {/* Description - Minimalist & Wide Spacing */}
          <div className="overflow-hidden mb-12">
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 1 }}
              className="text-sm md:text-lg text-zinc-500 uppercase tracking-[0.3em] font-medium"
            >
              Curated Essentials — Spring / Summer 2026
            </motion.p>
          </div>

          {/* Buttons - Sharp & Rectangular */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 1 }}
            className="flex flex-col sm:flex-row gap-6 items-center"
          >
            <button className="relative px-12 py-4 bg-black text-white text-xs font-bold uppercase tracking-widest transition-all hover:bg-zinc-800 hover:scale-105 active:scale-95">
              Shop the Collection
            </button>
            
            <button className="group relative px-12 py-4 border border-zinc-200 text-black text-xs font-bold uppercase tracking-widest overflow-hidden">
              <span className="relative z-10 transition-colors group-hover:text-white">Featured Categories</span>
              <div className="absolute inset-0 bg-black translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </button>
          </motion.div>
        </div>
      </div>

      {/* 3. Decorative Side Elements (The "Nice" Details) */}
      <div className="absolute left-10 bottom-10 hidden lg:block">
        <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-[0.5em] [writing-mode:vertical-lr]">
          Scroll to explore
        </p>
      </div>

      <div className="absolute right-10 bottom-10 hidden lg:block">
        <div className="flex gap-4">
          <span className="text-[10px] text-zinc-900 font-black">01 // HOME</span>
          <span className="text-[10px] text-zinc-300 font-black tracking-widest">— 04</span>
        </div>
      </div>
    </section>
  );
};

export default Hero;