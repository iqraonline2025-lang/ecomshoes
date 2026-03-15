'use client';
import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

const CategoryHero = () => {
  return (
    <section className="py-12 px-6 bg-white">
      <div className="max-w-[1000px] mx-auto">
        {/* Main Grid Wrapper */}
        <div className="flex flex-col md:flex-row gap-10 items-center">
          
          {/* 1. TEXT CONTENT - Clean & Left Aligned */}
          <div className="w-full md:w-1/2 order-2 md:order-1">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <div className="flex items-center gap-2 mb-4">
                <span className="h-[2px] w-8 bg-red-600"></span>
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">
                  Collection 2026
                </span>
              </div>
              
              <h1 className="text-6xl md:text-7xl font-black italic uppercase tracking-tighter leading-[0.9] mb-6">
                Next <br /> 
                <span className="text-red-600">Level</span>
              </h1>
              
              <p className="max-w-xs text-gray-500 text-sm font-medium leading-relaxed mb-8">
                The intersection of high-performance tech and street-ready aesthetics. 
                Our most breathable silhouette yet.
              </p>

              <button className="border-b-2 border-black pb-1 text-xs font-black uppercase tracking-widest hover:text-red-600 hover:border-red-600 transition-all">
                Discover the Tech
              </button>
            </motion.div>
          </div>

          {/* 2. IMAGE SECTION - Sharp & Bold */}
          <div className="w-full md:w-1/2 order-1 md:order-2">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
              className="relative aspect-[4/5] w-full bg-[#f3f3f3] overflow-hidden group"
            >
              <Image 
                src="/images/h2.jpg" 
                alt="New Arrivals"
                fill
                className="object-cover transition-transform duration-1000 group-hover:scale-110"
                priority
              />
              
              {/* Minimalist Border Overlay */}
              <div className="absolute inset-4 border border-white/20 pointer-events-none" />
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default CategoryHero;