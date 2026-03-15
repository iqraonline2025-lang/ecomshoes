'use client';
import React, { useState } from 'react';
import { X, Heart, ShoppingBag, Star, ChevronLeft, ChevronRight } from 'lucide-react';

const QuickViewModal = ({ product, isOpen, onClose }) => {
  const [activeImg, setActiveImg] = useState(0);
  const [selectedSize, setSelectedSize] = useState(null);

  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      {/* Modal Container */}
      <div className="relative bg-white w-full max-w-5xl rounded-[40px] overflow-hidden flex flex-col md:flex-row shadow-2xl animate-in zoom-in duration-300">
        
        {/* Close Button */}
        <button onClick={onClose} className="absolute top-6 right-6 z-50 p-2 bg-white/80 backdrop-blur-md rounded-full hover:bg-black hover:text-white transition-all">
          <X size={20} />
        </button>

        {/* Left: Gallery Section */}
        <div className="w-full md:w-1/2 bg-[#F6F6F6] p-8 flex flex-col justify-center">
          <div className="relative aspect-square rounded-3xl overflow-hidden mb-4">
            <img 
              src={product.images[activeImg]} 
              className="w-full h-full object-cover transition-all duration-500" 
              alt={product.name} 
            />
            {product.images.length > 1 && (
              <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none">
                <button 
                  onClick={() => setActiveImg(prev => prev > 0 ? prev - 1 : product.images.length - 1)}
                  className="p-2 bg-white/90 rounded-full shadow-lg pointer-events-auto hover:scale-110"
                >
                  <ChevronLeft size={20} />
                </button>
                <button 
                  onClick={() => setActiveImg(prev => prev < product.images.length - 1 ? prev + 1 : 0)}
                  className="p-2 bg-white/90 rounded-full shadow-lg pointer-events-auto hover:scale-110"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </div>
          
          {/* Thumbnails */}
          <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
            {product.images.map((img, idx) => (
              <button 
                key={idx} 
                onClick={() => setActiveImg(idx)}
                className={`w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all shrink-0 ${activeImg === idx ? 'border-black scale-95' : 'border-transparent opacity-60'}`}
              >
                <img src={img} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Right: Info Section */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
          <div className="mb-6">
            <p className="text-xs font-black uppercase tracking-[0.3em] text-gray-400 mb-2">{product.brand}</p>
            <h2 className="text-3xl font-black uppercase italic tracking-tighter leading-none mb-4">{product.name}</h2>
            <div className="flex items-center gap-4">
              <span className="text-2xl font-black italic">${product.newPrice}</span>
              {product.oldPrice > product.newPrice && (
                <span className="text-lg font-medium text-gray-300 line-through">${product.oldPrice}</span>
              )}
              <div className="flex items-center gap-1 bg-yellow-400/10 px-2 py-1 rounded-lg">
                <Star size={14} className="fill-yellow-400 text-yellow-400" />
                <span className="text-xs font-black">{product.rating}</span>
              </div>
            </div>
          </div>

          {/* Sizes Selection */}
          <div className="mb-8">
            <p className="text-[10px] font-black uppercase tracking-widest mb-4">Select Size (EU)</p>
            <div className="flex flex-wrap gap-2">
              {product.sizes?.map(size => (
                <button 
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`w-12 h-12 rounded-xl flex items-center justify-center text-sm font-bold border-2 transition-all
                    ${selectedSize === size ? 'bg-black text-white border-black' : 'bg-white border-gray-100 hover:border-black'}`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button className="flex-1 bg-black text-white py-5 rounded-[20px] font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:bg-gray-800 transition-all active:scale-95">
              <ShoppingBag size={18} /> Add to Cart
            </button>
            <button className="w-16 h-16 rounded-[20px] border-2 border-gray-100 flex items-center justify-center hover:bg-red-50 hover:border-red-100 hover:text-red-500 transition-all active:scale-95">
              <Heart size={20} />
            </button>
          </div>
          
          <p className="mt-8 text-[10px] text-gray-400 font-medium leading-relaxed uppercase">
            Free shipping on orders over $150. Easy 30-day returns. 
            All products are 100% authentic guaranteed.
          </p>
        </div>
      </div>
    </div>
  );
};

export default QuickViewModal;