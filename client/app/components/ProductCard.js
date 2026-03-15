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
  const [selectedSize, setSelectedSize] = useState(null);

  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-md animate-in fade-in duration-300" 
        onClick={onClose} 
      />
      
      <div className="relative bg-white w-full max-w-5xl rounded-[40px] overflow-hidden flex flex-col md:flex-row shadow-2xl animate-in zoom-in duration-300 max-h-[90vh] overflow-y-auto md:overflow-hidden">
        
        <button 
          onClick={onClose} 
          className="absolute top-6 right-6 z-50 p-2 bg-white/80 backdrop-blur-md rounded-full hover:bg-black hover:text-white transition-all"
        >
          <X size={20} />
        </button>

        <div className="w-full md:w-1/2 bg-[#F6F6F6] p-6 md:p-10 flex flex-col justify-center">
          <div className="relative aspect-square rounded-3xl overflow-hidden mb-4 bg-white shadow-inner">
            <img 
              src={product.images[activeImg]} 
              className="w-full h-full object-contain p-4" 
              alt={product.name} 
            />
            {product.images.length > 1 && (
              <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none">
                <button 
                  onClick={(e) => { e.stopPropagation(); setActiveImg(prev => prev > 0 ? prev - 1 : product.images.length - 1)}} 
                  className="p-3 bg-white/90 rounded-full shadow-xl pointer-events-auto hover:scale-110 active:scale-90 transition-all"
                >
                  <ChevronLeft size={20} />
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); setActiveImg(prev => prev < product.images.length - 1 ? prev + 1 : 0)}} 
                  className="p-3 bg-white/90 rounded-full shadow-xl pointer-events-auto hover:scale-110 active:scale-90 transition-all"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 mb-2">{product.brand}</p>
          <h2 className="text-4xl font-black uppercase italic tracking-tighter leading-[0.9] mb-4">{product.name}</h2>
          
          <div className="flex items-center gap-4 mb-8">
            <span className="text-3xl font-black italic">${product.newPrice}</span>
            {product.oldPrice > product.newPrice && (
              <span className="text-xl font-medium text-gray-300 line-through">${product.oldPrice}</span>
            )}
          </div>

          <div className="flex gap-4">
            <button 
              onClick={(e) => onAddToCart(e, product)}
              className="flex-1 bg-black text-white py-5 rounded-[24px] font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:bg-zinc-800 transition-all active:scale-[0.98] shadow-xl shadow-black/10"
            >
              <ShoppingBag size={18} /> Add to Cart
            </button>
            <button 
              onClick={(e) => onAddToWishlist(e, product)}
              className="w-16 h-16 rounded-[24px] border-2 border-gray-100 flex items-center justify-center hover:bg-red-50 hover:border-red-100 hover:text-red-500 transition-all active:scale-95"
            >
              <Heart size={20} />
            </button>
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

  // 🛡️ PROTECTED LOGIC: Check if user is logged in
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
    
    // Check Auth First
    if (!checkAuth()) return;

    const currentCart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    // Check if item already exists to increment quantity
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
    
    // 📢 Sync Navbar!
    window.dispatchEvent(new Event('local-storage-update'));
    
    setIsModalOpen(false);
    // Optional: Redirect to cart or stay on page
    // router.push('/cart'); 
  };

  const handleAddToWishlist = (e, prod = product) => {
    if (e && e.stopPropagation) e.stopPropagation();
    
    // Check Auth First
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
        <div className="relative aspect-[4/5] overflow-hidden rounded-[32px] bg-[#F3F3F3]">
          <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
             {product.isFlashSale && (
               <span className="bg-red-600 text-white text-[9px] font-black px-3 py-1.5 rounded-full uppercase tracking-tighter shadow-sm">Flash Sale</span>
             )}
             {discount > 0 && (
               <span className="bg-black text-white text-[9px] font-black px-3 py-1.5 rounded-full uppercase tracking-tighter shadow-sm">-{discount}%</span>
             )}
          </div>

          <img 
            src={mainImage} 
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${isHovered ? 'opacity-0' : 'opacity-100'}`} 
            alt={product.name} 
          />
          <img 
            src={hoverImage} 
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${isHovered ? 'opacity-100' : 'opacity-0'}`} 
            alt="hover view" 
          />

          <div className={`absolute inset-x-4 bottom-4 transition-all duration-300 transform ${isHovered ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
            <button className="w-full bg-white/90 backdrop-blur-md py-4 rounded-[20px] flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all shadow-xl">
              <Eye size={14} /> Quick View
            </button>
          </div>

          <button 
            onClick={(e) => handleAddToWishlist(e)} 
            className="absolute top-4 right-4 p-3 bg-white/80 backdrop-blur-sm rounded-full shadow-sm hover:text-red-500 hover:bg-white transition-all z-20 active:scale-90"
          >
            <Heart size={16} />
          </button>
        </div>

        <div className="mt-5 px-1 pb-2">
          <div className="flex justify-between items-start mb-2">
            <div className="flex-1">
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">{product.brand}</p>
              <h3 className="text-[13px] font-bold uppercase leading-tight group-hover:underline decoration-1 underline-offset-4 tracking-tight">{product.name}</h3>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-sm font-black italic tracking-tighter">${product.newPrice}</span>
              {product.oldPrice > product.newPrice && (
                <span className="text-[10px] font-bold text-gray-300 line-through tracking-tighter">${product.oldPrice}</span>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-lg">
              <Star size={10} className="fill-yellow-400 text-yellow-400" />
              <span className="text-[10px] font-black">{product.rating || 5.0}</span>
            </div>
            
            <button 
              onClick={(e) => handleAddToCart(e)}
              className="p-3 bg-zinc-100 text-black rounded-2xl hover:bg-black hover:text-white transition-all active:scale-90 shadow-sm"
            >
              <ShoppingCart size={16} />
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