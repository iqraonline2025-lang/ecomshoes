"use client";
import React, { useState, useEffect } from 'react';
import { Search, ShoppingCart, User, Heart, Menu, LogOut, X } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { googleLogout } from '@react-oauth/google';

const Navbar = () => {
  const router = useRouter();
  const [wishlistCount, setWishlistCount] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  const [userData, setUserData] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  useEffect(() => {
    const updateCounts = () => {
      if (typeof window !== 'undefined') {
        const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        const savedUser = JSON.parse(localStorage.getItem('shoeStoreUser') || 'null');
        setWishlistCount(wishlist.length);
        setCartCount(cart.reduce((acc, item) => acc + (item.quantity || 1), 0));
        setUserData(savedUser);
      }
    };
    updateCounts();
    window.addEventListener('local-storage-update', updateCounts);
    return () => window.removeEventListener('local-storage-update', updateCounts);
  }, []);

  const executeSearch = () => {
    if (searchQuery.trim() !== "") {
      router.push(`/category?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsMenuOpen(false);
      setIsMobileSearchOpen(false);
      setSearchQuery("");
    }
  };

  const getInitial = () => userData?.name?.charAt(0).toUpperCase() || 'U';

  return (
    <header className="w-full bg-white sticky top-0 z-[999] shadow-md font-sans">
      {/* 1. Top Banner */}
      <div className="bg-zinc-900 py-2 text-center text-[10px] font-bold tracking-[0.2em] text-white uppercase">
        Free shipping over $150 • ROADKICKS Limited Drop
      </div>

      <div className="border-b border-gray-100 bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-8">
          
          {/* 2. MOBILE CONTROLS (Visible on small screens) */}
          <div className="flex md:hidden items-center gap-5">
            <button 
              onClick={() => setIsMenuOpen(true)} 
              className="p-2 -ml-2 text-black hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Menu size={26} strokeWidth={2.5} />
            </button>
            <button 
              onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)} 
              className={`p-2 rounded-lg transition-colors ${isMobileSearchOpen ? 'bg-blue-600 text-white' : 'text-black'}`}
            >
              <Search size={22} strokeWidth={2.5} />
            </button>
          </div>

          {/* 3. LOGO */}
          <div className="flex flex-1 justify-center md:justify-start">
            <Link href="/" className="text-2xl font-black tracking-tighter text-black uppercase italic">
              ROAD<span className="text-blue-600">KICKS</span>
            </Link>
          </div>

          {/* 4. DESKTOP NAV */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/category" className="text-[11px] font-black text-black hover:text-blue-600 uppercase tracking-widest">Footwear</Link>
            <Link href="/sale" className="text-[11px] font-black text-red-600 hover:text-red-700 uppercase tracking-widest">Sale</Link>
            
            {/* Desktop Search Input */}
            <div className="relative group min-w-[200px]">
              <input
                type="text"
                placeholder="SEARCH..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && executeSearch()}
                className="w-full border-b-2 border-zinc-200 bg-transparent py-1 pr-8 text-[11px] font-bold focus:border-blue-600 focus:outline-none transition-all"
              />
              <Search className="absolute right-0 top-1 h-4 w-4 text-zinc-400 group-focus-within:text-blue-600" />
            </div>
          </nav>

          {/* 5. RIGHT ICONS */}
          <div className="flex flex-1 items-center justify-end space-x-5">
            {userData ? (
              <Link href="/account" className="h-8 w-8 rounded-full bg-zinc-900 border-2 border-white shadow-md flex items-center justify-center text-white text-xs font-black">
                {getInitial()}
              </Link>
            ) : (
              <Link href="/auth" className="text-black hover:text-blue-600"><User size={22} /></Link>
            )}
            <Link href="/cart" className="relative text-black hover:text-blue-600">
              <ShoppingCart size={22} />
              {cartCount > 0 && (
                <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[10px] font-black text-white ring-2 ring-white">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>

      {/* 6. MOBILE SEARCH BAR (Now with dark background for visibility) */}
      <div className={`md:hidden bg-zinc-900 transition-all duration-300 ease-in-out overflow-hidden ${isMobileSearchOpen ? "max-h-[80px] border-b border-zinc-700" : "max-h-0"}`}>
        <div className="p-4">
          <div className="relative flex items-center bg-zinc-800 rounded-full px-4 py-2 border border-zinc-700">
            <input
              type="text"
              autoFocus
              placeholder="SEARCH KICKS..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && executeSearch()}
              className="w-full bg-transparent text-white text-sm font-bold placeholder-zinc-500 focus:outline-none"
            />
            <button onClick={executeSearch} className="ml-2 text-blue-500">
              <Search size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* 7. HAMBURGER SIDEBAR (Dark Theme & Fixed Z-index) */}
      {/* Overlay */}
      <div 
        className={`fixed inset-0 bg-black/70 backdrop-blur-sm z-[1000] transition-opacity duration-300 md:hidden ${isMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`} 
        onClick={() => setIsMenuOpen(false)} 
      />
      
      {/* Drawer */}
      <div className={`fixed top-0 left-0 h-full w-[85%] max-w-[320px] bg-zinc-900 text-white z-[1001] shadow-2xl transition-transform duration-500 ease-out md:hidden ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="p-8 flex flex-col h-full">
          <div className="flex items-center justify-between mb-12">
            <span className="text-2xl font-black italic tracking-tighter">ROAD<span className="text-blue-500">KICKS</span></span>
            <button onClick={() => setIsMenuOpen(false)} className="p-2 bg-zinc-800 rounded-full text-white">
              <X size={24} />
            </button>
          </div>

          <nav className="flex flex-col space-y-8">
            <Link href="/" onClick={() => setIsMenuOpen(false)} className="text-xl font-black uppercase tracking-tighter border-b border-zinc-800 pb-4 hover:text-blue-500 transition-colors">Home</Link>
            <Link href="/category" onClick={() => setIsMenuOpen(false)} className="text-xl font-black uppercase tracking-tighter border-b border-zinc-800 pb-4 hover:text-blue-500 transition-colors">Footwear</Link>
            <Link href="/sale" onClick={() => setIsMenuOpen(false)} className="text-xl font-black uppercase tracking-tighter border-b border-zinc-800 pb-4 text-red-500">Sale</Link>
            <Link href="/wishlist" onClick={() => setIsMenuOpen(false)} className="text-xl font-black uppercase tracking-tighter border-b border-zinc-800 pb-4">Wishlist</Link>
          </nav>

          <div className="mt-auto pt-10">
            {userData ? (
              <button onClick={() => { googleLogout(); localStorage.clear(); window.location.reload(); }} className="flex items-center gap-3 text-zinc-400 font-bold uppercase tracking-widest text-xs">
                <LogOut size={18} /> Logout
              </button>
            ) : (
              <Link href="/auth" onClick={() => setIsMenuOpen(false)} className="bg-blue-600 w-full py-4 rounded-xl text-center font-black uppercase tracking-widest text-sm">Sign In</Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;