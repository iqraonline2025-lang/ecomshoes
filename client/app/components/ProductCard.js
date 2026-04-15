'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Heart, 
  Eye, 
  ShoppingCart, 
  Star, 
  X, 
  ShoppingBag, 
  ChevronLeft, 
  ChevronRight 
} from 'lucide-react';

// --- QUICK VIEW MODAL COMPONENT ---
const QuickViewModal = ({ product, isOpen, onClose, onAddToCart, onAddToWishlist }) => {
  const [activeImg, setActiveImg] = useState(0);

  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-md animate-in fade-in duration-300" 
        onClick={onClose} 
      />
      
      <div className="relative bg-white w-full max-w-5xl rounded-[40px] overflow-hidden flex flex-col md:row shadow-2xl animate-in zoom-in duration-300 max-h-[90vh] overflow-y-auto md:overflow-hidden">
        
        <button 
          onClick={onClose} 
          className="absolute top-6 right-6 z-50 p-3 bg-white border border-gray-100 rounded-full hover:bg-black hover:text-white transition-all shadow-lg"
        >
          <X size={20} />
        </button>

        <div className="flex flex-col md:flex-row w-full">
            {/* Image Section */}
            <div className="w-full md:w-1/2 bg-[#F9F9F9] p-6 md:p-12 flex flex-col justify-center items-center">
              <div className="relative w-full aspect-square rounded-3xl overflow-hidden bg-white shadow-sm flex items-center justify-center">
                <img 
                  src={product.images[activeImg]} 
                  className="w-full h-full object-contain p-8" 
                  alt={product.name} 
                />
                
                {product.images.length > 1 && (
                  <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none">
                    <button 
                      onClick={(e) => { e.stopPropagation(); setActiveImg(prev => prev > 0 ? prev - 1 : product.images.length - 1)}} 
                      className="p-3 bg-white/90 rounded-full shadow-xl pointer-events-auto hover:bg-black hover:text-white transition-all"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); setActiveImg(prev => prev < product.images.length - 1 ? prev + 1 : 0)}} 
                      className="p-3 bg-white/90 rounded-full shadow-xl pointer-events-auto hover:bg-black hover:text-white transition-all"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </div>
                )}
              </div>
              
              {/* Thumbnails */}
              <div className="flex gap-3 mt-6">
                {product.images.map((img, idx) => (
                    <button 
                        key={idx}
                        onClick={() => setActiveImg(idx)}
                        className={`w-16 h-16 rounded-xl border-2 overflow-hidden transition-all ${activeImg === idx ? 'border-black scale-105' : 'border-transparent opacity-50'}`}
                    >
                        <img src={img} className="w-full h-full object-cover" />
                    </button>
                ))}
              </div>
            </div>

            {/* Content Section */}
            <div className="w-full md:w-1/2 p-8 md:p-16 flex flex-col justify-center bg-white">
              <div className="space-y-1 mb-6">
                <p className="text-[11px] font-black uppercase tracking-[0.4em] text-zinc-400">{product.brand}</p>
                <h2 className="text-5xl font-black uppercase italic tracking-tighter leading-[0.85] text-zinc-900">{product.name}</h2>
              </div>
              
              <div className="flex items-baseline gap-4 mb-8">
                <span className="text-4xl font-black italic text-zinc-900">${product.newPrice}</span>
                {product.oldPrice > product.newPrice && (
                  <span className="text-2xl font-bold text-zinc-300 line-through">${product.oldPrice}</span>
                )}
              </div>

              <div className="space-y-6 mb-10">
                <p className="text-zinc-500 text-sm leading-relaxed font-medium">
                   Premium build featuring high-grade materials and signature {product.brand} engineering. A staple for any modern rotation.
                </p>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Verified Authentic & In Stock</span>
                </div>
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={(e) => onAddToCart(e, product)}
                  className="flex-1 bg-black text-white py-6 rounded-[24px] font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:bg-zinc-800 transition-all active:scale-[0.98] shadow-2xl shadow-black/20"
                >
                  <ShoppingBag size={18} /> Add to Cart
                </button>
                <button 
                  onClick={(e) => onAddToWishlist(e, product)}
                  className="w-20 h-20 rounded-[24px] border-2 border-zinc-100 flex items-center justify-center hover:bg-red-50 hover:border-red-100 hover:text-red-500 transition-all"
                >
                  <Heart size={24} />
                </button>
              </div>
            </div>
        </div>
      </div>
    </div>
  );
};

// --- MAIN PRODUCT CARD COMPONENT ---
const ProductCard = ({ product }) => {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const checkAuth = () => {
    const token = localStorage.getItem('shoeStoreToken');
    if (!token) {
      router.push('/auth');
      return false;
    }
    return true;
  };

  const handleAddToCart = (e, prod = product) => {
    if (e && e.stopPropagation) e.stopPropagation(); 
    if (!checkAuth()) return;

    const currentCart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = currentCart.find(item => item._id === prod._id);
    let updatedCart;
    
    if (existingItem) {
      updatedCart = currentCart.map(item => 
        item._id === prod._id ? { ...item, quantity: (item.quantity || 1) + 1 } : item
      );
    } else {
      updatedCart = [...currentCart, { ...prod, quantity: 1 }];
    }

    localStorage.setItem('cart', JSON.stringify(updatedCart));
    window.dispatchEvent(new Event('local-storage-update'));
    setIsModalOpen(false);
  };

  const handleAddToWishlist = (e, prod = product) => {
    if (e && e.stopPropagation) e.stopPropagation();
    if (!checkAuth()) return;
    
    const currentWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    if (!currentWishlist.find(item => item._id === prod._id)) {
      const updatedWishlist = [...currentWishlist, prod];
      localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
      window.dispatchEvent(new Event('local-storage-update'));
    }
    setIsModalOpen(false);
  };

  const mainImage = product.images?.[0] || '/placeholder.jpg';
  const hoverImage = product.images?.[1] || mainImage;
  const discount = product.oldPrice > product.newPrice ? Math.round(((product.oldPrice - product.newPrice) / product.oldPrice) * 100) : 0;

  return (
    <>
      <div 
        className="group relative bg-white flex flex-col h-full cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => setIsModalOpen(true)}
      >
        {/* Image Container */}
        <div className="relative aspect-[4/5] overflow-hidden rounded-[32px] bg-[#f6f6f6]">
          {/* Badge overlays */}
          <div className="absolute top-5 left-5 z-20 flex flex-col gap-2">
             {product.isFlashSale && (
               <span className="bg-red-600 text-white text-[9px] font-black px-4 py-2 rounded-full uppercase tracking-widest shadow-lg">Flash Sale</span>
             )}
             {discount > 0 && (
               <span className="bg-black text-white text-[9px] font-black px-4 py-2 rounded-full uppercase tracking-widest shadow-lg">-{discount}% OFF</span>
             )}
          </div>

          <img 
            src={mainImage} 
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ease-out scale-105 ${isHovered ? 'opacity-0 scale-110' : 'opacity-100'}`} 
            alt={product.name} 
          />
          <img 
            src={hoverImage} 
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ease-out scale-110 ${isHovered ? 'opacity-100 scale-100' : 'opacity-0'}`} 
            alt="hover view" 
          />

          {/* Quick View Button - High Contrast Fix */}
          <div className={`absolute inset-x-6 bottom-6 transition-all duration-500 transform ${isHovered ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            <button className="w-full bg-white text-black py-4 rounded-2xl flex items-center justify-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] hover:bg-black hover:text-white transition-all shadow-2xl">
              <Eye size={16} /> Quick View
            </button>
          </div>

          <button 
            onClick={(e) => handleAddToWishlist(e)} 
            className="absolute top-5 right-5 p-3.5 bg-white/90 backdrop-blur-sm rounded-2xl shadow-sm hover:text-red-500 hover:bg-white transition-all z-20 active:scale-90"
          >
            <Heart size={18} />
          </button>
        </div>

        {/* Info Container */}
        <div className="mt-6 px-1">
          <div className="flex justify-between items-start">
            <div className="flex-1 space-y-1">
              <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">{product.brand}</p>
              <h3 className="text-sm font-black uppercase leading-tight tracking-tight text-zinc-900 group-hover:text-zinc-600 transition-colors">{product.name}</h3>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-lg font-black italic tracking-tighter text-zinc-900">${product.newPrice}</span>
              {product.oldPrice > product.newPrice && (
                <span className="text-[11px] font-bold text-zinc-300 line-through tracking-tighter">${product.oldPrice}</span>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between mt-5 pt-4 border-t border-zinc-50">
            <div className="flex items-center gap-1.5 bg-zinc-50 px-3 py-1.5 rounded-full">
              <Star size={12} className="fill-yellow-400 text-yellow-400" />
              <span className="text-[11px] font-black text-zinc-800">{product.rating || 5.0}</span>
            </div>
            
            <button 
              onClick={(e) => handleAddToCart(e)}
              className="p-4 bg-zinc-900 text-white rounded-2xl hover:bg-black transition-all active:scale-90 shadow-lg shadow-zinc-200"
            >
              <ShoppingCart size={18} />
            </button>
          </div>
        </div>
      </div>

      <QuickViewModal 
        product={product} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onAddToCart={handleAddToCart}
        onAddToWishlist={handleAddToWishlist}
      />
    </>
  );
};

export default ProductCard;