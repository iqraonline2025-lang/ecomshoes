"use client";
import React, { useState, useEffect } from 'react';
import { Search, ShoppingCart, User, Heart, Menu, LogOut } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { googleLogout } from '@react-oauth/google';

const Navbar = () => {
  const router = useRouter();
  const [wishlistCount, setWishlistCount] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const updateCounts = () => {
      if (typeof window !== 'undefined') {
        const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        const savedUser = JSON.parse(localStorage.getItem('shoeStoreUser') || 'null');
        
        setWishlistCount(wishlist.length);
        const totalItems = cart.reduce((acc, item) => acc + (item.quantity || 1), 0);
        setCartCount(totalItems);
        setUserData(savedUser);
      }
    };

    updateCounts();
    window.addEventListener('storage', updateCounts);
    window.addEventListener('local-storage-update', updateCounts);

    return () => {
      window.removeEventListener('storage', updateCounts);
      window.removeEventListener('local-storage-update', updateCounts);
    };
  }, []);

  const handleLogout = () => {
    googleLogout();
    localStorage.removeItem("shoeStoreToken");
    localStorage.removeItem("shoeStoreUser");
    setUserData(null);
    window.dispatchEvent(new Event('local-storage-update'));
    router.push('/'); 
  };

  // Helper to get the first letter of the name
  const getInitial = () => {
    if (!userData?.name) return 'U';
    return userData.name.charAt(0).toUpperCase();
  };

  return (
    <header className="w-full bg-white sticky top-0 z-[100] shadow-sm font-sans">
      <div className="bg-black py-2.5 text-center text-[11px] font-bold tracking-widest text-white uppercase">
        Free shipping on all orders over $150 • Limited time sale
      </div>

      <div className="border-b border-gray-100">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          
          <div className="flex md:hidden">
            <button className="text-gray-600">
              <Menu size={24} />
            </button>
          </div>

          <div className="flex flex-1 justify-center md:justify-start">
            <Link href="/" className="text-2xl font-black tracking-tighter text-black uppercase italic">
              ROAD<span className="text-blue-600">KICKS</span>
            </Link>
          </div>

          <nav className="hidden md:flex md:space-x-10">
            <Link href="/category" className="text-[11px] font-black text-black hover:text-blue-600 transition-colors uppercase tracking-[0.2em]">
              Footwear
            </Link>
            <Link href="/sale" className="text-[11px] font-black text-red-600 hover:text-red-700 transition-colors uppercase tracking-[0.2em]">
              Sale
            </Link>
          </nav>

          <div className="flex flex-1 items-center justify-end space-x-4 sm:space-x-6">
            <div className="relative hidden max-w-[180px] xl:block">
              <input
                type="text"
                placeholder="SEARCH..."
                className="w-full rounded-none border-b border-zinc-200 bg-transparent py-1 pl-2 pr-8 text-[10px] font-bold tracking-widest focus:border-black focus:outline-none transition-all"
              />
              <Search className="absolute right-0 top-1 h-4 w-4 text-gray-400" />
            </div>

            <div className="flex items-center">
              {userData ? (
                <div className="flex items-center space-x-4">
                  <Link href="/account" className="flex items-center gap-2 group">
                    {/* AVATAR LOGIC */}
                    <div className="h-8 w-8 rounded-full overflow-hidden border-2 border-zinc-100 group-hover:border-blue-600 transition-all flex items-center justify-center bg-zinc-900 shadow-inner">
                      {userData.picture && !userData.picture.includes('flaticon') ? (
                        <img 
                          src={userData.picture} 
                          alt="profile" 
                          className="h-full w-full object-cover"
                          onError={(e) => { e.target.style.display = 'none'; }} // Fallback if image fails
                        />
                      ) : (
                        <span className="text-white text-[12px] font-black tracking-tighter">
                          {getInitial()}
                        </span>
                      )}
                    </div>
                    <span className="hidden lg:block text-[10px] font-black uppercase tracking-widest text-black">
                      Hi, {userData.name.split(' ')[0]}
                    </span>
                  </Link>
                  
                  <button onClick={handleLogout} className="text-zinc-400 hover:text-red-600 transition-colors">
                    <LogOut size={16} />
                  </button>
                </div>
              ) : (
                <Link href="/auth" className="text-gray-700 hover:text-black transition-all flex items-center gap-2">
                  <User size={20} strokeWidth={2.5} />
                  <span className="hidden lg:block text-[10px] font-black uppercase tracking-widest">Login</span>
                </Link>
              )}
            </div>
            
            {/* Wishlist and Cart Icons remain similar but styled cleaner */}
            <Link href="/wishlist" className="relative text-gray-700 hover:text-black">
              <Heart size={20} strokeWidth={2.5} />
              {wishlistCount > 0 && (
                <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-black text-[8px] font-black text-white">
                  {wishlistCount}
                </span>
              )}
            </Link>

            <Link href="/cart" className="relative text-gray-700 hover:text-black">
              <ShoppingCart size={20} strokeWidth={2.5} />
              {cartCount > 0 && (
                <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-[8px] font-black text-white">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;