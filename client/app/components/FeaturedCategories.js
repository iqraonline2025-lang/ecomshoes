"use client";
import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link'; // Import Link

const categories = [
  // Added 'slug' to each category to match your backend/filter logic
  { name: "Running Shoes", slug: "running", image: "/images/running.jpeg", count: "12 Items", size: "lg" },
  { name: "Sneakers", slug: "sneakers", image: "/images/sneakers.jpeg", count: "24 Items", size: "lg" },
  { name: "Casual Shoes", slug: "casual", image: "/images/casual.jpeg", count: "18 Items", size: "sm" },
  { name: "Formal Shoes", slug: "formal", image: "/images/formal.jpeg", count: "08 Items", size: "sm" },
  { name: "Training Shoes", slug: "training", image: "/images/training.jpeg", count: "15 Items", size: "sm" },
];

const FeaturedCategories = () => {
  return (
    <section className="py-24 bg-white px-6">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 border-b border-black pb-8">
          <div>
            <h2 className="text-sm uppercase tracking-[0.4em] text-zinc-400 mb-2 font-bold">
              Collections
            </h2>
            <h3 className="text-4xl md:text-6xl font-black text-black uppercase tracking-tighter">
              Featured <span className="font-light italic text-zinc-500">Categories</span>
            </h3>
          </div>
          <Link 
            href="/category" 
            className="hidden md:block text-xs font-bold uppercase tracking-widest border-b-2 border-black pb-1 hover:opacity-50 transition-all"
          >
            View All Series
          </Link>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-2 auto-rows-[300px] md:auto-rows-[400px]">
          {categories.map((cat, index) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className={`group relative overflow-hidden bg-zinc-100 cursor-pointer ${
                cat.size === 'lg' ? 'md:col-span-3' : 'md:col-span-2'
              }`}
            >
              {/* Wrap the content in a Link */}
              <Link href={`/category?category=${cat.slug}`}>
                <div className="absolute inset-0 z-0">
                  {/* Image Container */}
                  <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-105">
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                    />
                  </div>

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />

                  {/* Text Content */}
                  <div className="absolute inset-0 p-8 flex flex-col justify-end text-white z-10">
                    <p className="text-[10px] uppercase tracking-[0.3em] mb-2 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                      {cat.count}
                    </p>
                    <h4 className="text-2xl md:text-3xl font-extrabold uppercase tracking-tighter">
                      {cat.name}
                    </h4>
                    
                    <div className="w-0 group-hover:w-full h-[1px] bg-white/50 mt-4 transition-all duration-700" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCategories;