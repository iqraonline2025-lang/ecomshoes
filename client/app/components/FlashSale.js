'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';

const SHOE_DATA = [
  {
    id: 1,
    name: "Air Max Speedster",
    oldPrice: 160,
    newPrice: 99,
    image: "/images/shoe1.jpeg",
    stockLeft: 5,
    totalStock: 20,
    expiry: new Date().getTime() + 1000 * 60 * 60 * 24,
  },
  {
    id: 2,
    name: "Ultra Boost Phantom",
    oldPrice: 190,
    newPrice: 125,
    image: "/images/shoe5.jpeg",
    stockLeft: 2,
    totalStock: 15,
    expiry: new Date().getTime() + 1000 * 60 * 60 * 5,
  }
];

const FlashSale = () => {
  return (
    <section className="py-16 px-4 md:px-8 bg-white">
      <div className="max-w-[1000px] mx-auto"> 
        <div className="mb-10 text-left border-b border-gray-100 pb-4">
          <h2 className="text-4xl font-black italic uppercase tracking-tighter">
            Flash <span className="text-red-600 font-bold">Sale</span>
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
          {SHOE_DATA.map((shoe) => (
            <ShoeCard key={shoe.id} shoe={shoe} />
          ))}
        </div>
      </div>
    </section>
  );
};

const ShoeCard = ({ shoe }) => {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date().getTime();
      const distance = shoe.expiry - now;
      
      if (distance < 0) {
        setTimeLeft("00:00:00");
        return;
      }

      const h = Math.floor(distance / (1000 * 60 * 60));
      const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((distance % (1000 * 60)) / 1000);
      
      // Padding with zeros for a cleaner digital clock look
      const format = (num) => String(num).padStart(2, '0');
      setTimeLeft(`${format(h)}h ${format(m)}m ${format(s)}s`);
    };

    calculateTime(); // Run immediately on mount
    const timer = setInterval(calculateTime, 1000);
    
    return () => clearInterval(timer);
  }, [shoe.expiry]);

  const stockPercent = (shoe.stockLeft / shoe.totalStock) * 100;

  return (
    <div className="w-full">
      <div className="relative aspect-[4/5] w-full bg-[#f3f3f3] rounded-2xl overflow-hidden flex items-center justify-center group">
        
        {/* Timer Badge */}
        <div className="absolute top-4 left-4 z-10 bg-black text-white text-[10px] font-bold px-3 py-1 rounded">
          ENDS: {timeLeft}
        </div>

        {/* Shoe Image */}
        <div className="relative w-[85%] h-[85%] transition-transform duration-300 group-hover:scale-105">
          <Image 
            src={shoe.image} 
            alt={shoe.name}
            fill
            className="object-contain"
            priority
          />
        </div>
      </div>

      {/* Info Section */}
      <div className="mt-5">
        <div className="flex justify-between items-baseline">
          <h3 className="text-lg font-bold uppercase">{shoe.name}</h3>
          <div className="flex gap-2 items-center">
            {/* Currency updated to £ */}
            <span className="text-xs text-gray-400 line-through">£{shoe.oldPrice}</span>
            <span className="text-xl font-black text-red-600">£{shoe.newPrice}</span>
          </div>
        </div>

        {/* Stock Bar */}
        <div className="mt-4 bg-gray-50 p-3 rounded-lg border border-gray-100">
          <div className="flex justify-between text-[10px] font-black uppercase mb-2">
            <span className="text-gray-500">Inventory Status</span>
            <span className={shoe.stockLeft < 5 ? "text-red-600" : "text-black"}>
              {shoe.stockLeft} PAIRS LEFT
            </span>
          </div>
          <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-1000 ${stockPercent < 30 ? 'bg-red-600' : 'bg-black'}`}
              style={{ width: `${stockPercent}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlashSale;