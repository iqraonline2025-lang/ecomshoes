"use client";
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

const newShoes = [
  { id: 101, name: "Neon Flux Runner", price: "$180.00", image: "/images/shoe5.jpeg", tag: "Limited" },
  { id: 102, name: "Shadow Walk Mid", price: "$220.00", image: "/images/shoe6.jpeg", tag: "New" },
  { id: 103, name: "Gravity Zero Pro", price: "$250.00", image: "/images/shoe7.jpeg", tag: "Elite" },
  { id: 104, name: "Arctic Drift V3", price: "$165.00", image: "/images/shoe8.jpeg", tag: "Fresh" },
  { id: 105, name: "Vulcan Core High", price: "$195.00", image: "/images/shoe1.jpeg", tag: "Hot" },
  { id: 106, name: "Zenith Air Max", price: "$210.00", image: "/images/shoe3.jpeg", tag: "New" },
];

const NewArrivals = () => {
  const scrollRef = useRef(null);

  // Function to handle manual button navigation
  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      // Calculate how far to move (one card width + gap)
      const scrollTo = direction === 'left' 
        ? scrollLeft - (clientWidth / 2) 
        : scrollLeft + (clientWidth / 2);
      
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-24 bg-black text-white overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-6 mb-12 flex justify-between items-end">
        <div>
          <span className="text-blue-500 font-bold uppercase tracking-[0.4em] text-[10px]">
            Just Dropped
          </span>
          <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mt-2 leading-none">
            New <span className="text-zinc-800 italic font-thin">Arrivals</span>
          </h2>
        </div>

        {/* --- Navigation Buttons --- */}
        <div className="flex gap-4">
          <button 
            onClick={() => scroll('left')}
            className="p-4 border border-zinc-800 rounded-full hover:bg-white hover:text-black transition-all active:scale-90"
          >
            <ChevronLeft size={24} />
          </button>
          <button 
            onClick={() => scroll('right')}
            className="p-4 border border-zinc-800 rounded-full hover:bg-white hover:text-black transition-all active:scale-90"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>

      {/* --- Scrollable Area --- */}
      <div 
        ref={scrollRef}
        className="flex gap-8 overflow-x-auto scrollbar-hide snap-x snap-mandatory px-6 md:px-[calc((100vw-1280px)/2+24px)] pb-10"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {newShoes.map((shoe) => (
          <div 
            key={shoe.id} 
            className="w-[300px] md:w-[450px] flex-shrink-0 snap-center group"
          >
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-zinc-900 border border-zinc-800/50 transition-all duration-500 group-hover:border-blue-500/30">
              <img 
                src={shoe.image} 
                alt={shoe.name} 
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105" 
              />
              
              <div className="absolute top-8 left-8">
                <span className="bg-white/10 backdrop-blur-md text-white text-[9px] font-black px-4 py-2 rounded-full border border-white/10 uppercase tracking-tighter">
                  {shoe.tag}
                </span>
              </div>

              {/* Add to Bag Hover */}
              <div className="absolute inset-0 flex items-end p-8 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <button className="w-full bg-white text-black py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all">
                  <ShoppingBag size={18} className="inline mr-2" /> Quick Drop
                </button>
              </div>
            </div>

            <div className="mt-8 flex justify-between items-start px-2">
              <div>
                <h4 className="text-2xl font-black uppercase tracking-tighter group-hover:text-blue-500 transition-colors">{shoe.name}</h4>
                <p className="text-zinc-500 font-medium mt-1">{shoe.price}</p>
              </div>
              <button className="mt-1 p-4 border border-zinc-800 rounded-full group-hover:bg-white group-hover:text-black transition-all">
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Background Graphic */}
      <div className="absolute -bottom-10 left-0 w-full overflow-hidden pointer-events-none opacity-[0.02] select-none z-0">
        <h2 className="text-[15vw] font-black uppercase whitespace-nowrap">
          LATEST DROP LATEST DROP
        </h2>
      </div>
    </section>
  );
};

export default NewArrivals;