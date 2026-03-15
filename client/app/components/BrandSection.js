'use client';
import React from 'react';
import Image from 'next/image';

const BRANDS = [
  { id: 1, name: "Nike", logo: "/images/nike.png" },
  { id: 2, name: "Adidas", logo: "/images/adidas.jpg" },
  { id: 3, name: "Puma", logo: "/images/puma.svg" },
  { id: 4, name: "New Balance", logo: "/images/newbalance.png" },
  { id: 5, name: "Converse", logo: "/images/converse.png" },
];

const BrandSection = () => {
  return (
    <section className="py-12 bg-white border-y border-gray-100">
      <div className="max-w-[1000px] mx-auto px-6">
        <p className="text-center text-xs font-bold uppercase tracking-[0.3em] text-gray-400 mb-8">
          Authorized Retailer
        </p>
        
        {/* Responsive Flexbox for Brand Logos */}
        <div className="flex flex-wrap items-center justify-between gap-8 md:gap-12 opacity-50 hover:opacity-100 transition-opacity duration-500">
          {BRANDS.map((brand) => (
            <div 
              key={brand.id} 
              className="relative h-8 w-20 md:h-10 md:w-24 grayscale hover:grayscale-0 transition-all duration-300 cursor-pointer"
            >
              <Image
                src={brand.logo}
                alt={brand.name}
                fill
                className="object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BrandSection;