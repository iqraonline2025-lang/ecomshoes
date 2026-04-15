"use client";
import React, { useState, useEffect } from 'react';
import { Search, ShoppingCart, User, LogOut, Menu, X, Heart } from 'lucide-react';
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
    window.addEventListener('storage', updateCounts);
    return () => {
      window.removeEventListener('local-storage-update', updateCounts);
      window.removeEventListener('storage', updateCounts);
    };
  }, []);

  const handleLogout = () => {
    googleLogout();
    localStorage.removeItem('shoeStoreToken');
    localStorage.removeItem('shoeStoreUser');
    setUserData(null);
    setIsMenuOpen(false);
    router.push('/');
    window.dispatchEvent(new Event('local-storage-update'));
  };

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
    <header className="w-full bg-white sticky top-0 z-[999] shadow-sm font-sans">
      
      {/* Top Banner - High Contrast */}
      <div className="bg-black py-2.5 text-center text-[10px] font-black tracking-[0.25em] text-white uppercase">
        Free shipping over $150 • ROADKICKS Limited Drop
      </div>

      <div className="border-b border-gray-100 bg-white">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 sm:px-8">

          {/* Mobile Controls */}
          <div className="flex md:hidden items-center gap-5 text-zinc-900">
            <button onClick={() => setIsMenuOpen(true)} className="hover:text-blue-600 transition-colors">
              <Menu size={26} />
            </button>
            <button onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)} className="hover:text-blue-600 transition-colors">
              <Search size={22} />
            </button>
          </div>

          {/* Logo */}
          <div className="flex flex-1 justify-center md:justify-start">
            <Link href="/" className="text-2xl font-black italic tracking-tighter text-zinc-900">
              ROAD<span className="text-blue-600">KICKS</span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-10">
            <Link href="/category" className="text-[13px] font-bold uppercase tracking-widest text-zinc-900 hover:text-blue-600 transition-colors">Footwear</Link>
            <Link href="/sale" className="text-[13px] font-bold uppercase tracking-widest text-red-600 hover:text-red-700 transition-colors">Sale</Link>

            {/* Desktop Search Bar - Clearer UI */}
            <div className="relative min-w-[240px] group">
              <input
                type="text"
                placeholder="SEARCH DROPS..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && executeSearch()}
                className="w-full bg-zinc-100 border-none rounded-full py-2.5 pl-4 pr-10 text-[11px] font-bold tracking-wider focus:ring-2 focus:ring-blue-600/20 focus:bg-white transition-all outline-none text-zinc-900 placeholder:text-zinc-400"
              />
              <Search className="absolute right-3 top-2.5 h-4 w-4 text-zinc-400 group-focus-within:text-blue-600 transition-colors" />
            </div>
          </nav>

          {/* Right Icons */}
          <div className="flex flex-1 justify-end items-center space-x-6 text-zinc-900">
            {userData ? (
              <Link href="/AccountPage" className="h-9 w-9 bg-zinc-900 text-white flex items-center justify-center rounded-full font-black text-xs hover:bg-blue-600 transition-all shadow-md">
                {getInitial()}
              </Link>
            ) : (
              <Link href="/auth" className="hover:text-blue-600 transition-colors">
                <User size={22} />
              </Link>
            )}

            <Link href="/wishlist" className="relative hover:text-red-500 transition-colors hidden sm:block">
              <Heart size={22} />
              {wishlistCount > 0 && (
                <span className="absolute -right-2 -top-2 bg-red-500 text-white text-[10px] font-black rounded-full h-4 w-4 flex items-center justify-center border-2 border-white">
                  {wishlistCount}
                </span>
              )}
            </Link>

            <Link href="/cart" className="relative hover:text-blue-600 transition-colors">
              <ShoppingCart size={22} />
              {cartCount > 0 && (
                <span className="absolute -right-2 -top-2 bg-blue-600 text-white text-[10px] font-black rounded-full h-4 w-4 flex items-center justify-center border-2 border-white">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Search - High Visibility */}
      <div className={`md:hidden bg-white border-b border-zinc-100 transition-all duration-300 ease-in-out ${isMobileSearchOpen ? "max-h-[80px] opacity-100" : "max-h-0 opacity-0"} overflow-hidden`}>
        <div className="p-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && executeSearch()}
              className="w-full bg-zinc-100 text-zinc-900 p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-600 font-bold text-sm"
            />
            <Search className="absolute right-3 top-3.5 h-4 w-4 text-zinc-400" />
          </div>
        </div>
      </div>

      {/* Sidebar Overlay */}
      <div className={`fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity z-[1000] ${isMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"}`} onClick={() => setIsMenuOpen(false)} />

      {/* Sidebar - Switched to White/Black Scheme */}
      <div className={`fixed top-0 left-0 h-full w-[320px] bg-white text-zinc-900 z-[1001] shadow-2xl transition-transform duration-500 ease-in-out ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
        
        <div className="p-6 border-b border-zinc-100 flex justify-between items-center">
            <span className="font-black italic text-xl tracking-tighter">MENU</span>
            <button onClick={() => setIsMenuOpen(false)} className="p-2 hover:bg-zinc-100 rounded-full transition-colors">
                <X size={24} />
            </button>
        </div>

        <nav className="flex flex-col p-8 gap-8">
          <Link href="/" onClick={() => setIsMenuOpen(false)} className="text-2xl font-black uppercase tracking-tighter hover:text-blue-600 transition-colors">Home</Link>
          <Link href="/category" onClick={() => setIsMenuOpen(false)} className="text-2xl font-black uppercase tracking-tighter hover:text-blue-600 transition-colors">Footwear</Link>
          
          {userData && (
            <Link href="/AccountPage" onClick={() => setIsMenuOpen(false)} className="text-2xl font-black uppercase tracking-tighter hover:text-blue-600 transition-colors">My Account</Link>
          )}

          <Link href="/sale" onClick={() => setIsMenuOpen(false)} className="text-2xl font-black uppercase tracking-tighter text-red-600 hover:text-red-700 transition-colors">Sale</Link>
        </nav>

        <div className="absolute bottom-0 left-0 w-full p-8 border-t border-zinc-100 bg-zinc-50">
          {userData ? (
            <button onClick={handleLogout} className="flex items-center gap-3 font-black uppercase tracking-widest text-xs text-zinc-900 hover:text-red-600 transition-colors">
              <LogOut size={18}/> Logout
            </button>
          ) : (
            <Link href="/auth" onClick={() => setIsMenuOpen(false)} className="font-black uppercase tracking-widest text-xs text-zinc-900 hover:text-blue-600 transition-colors">
              Sign In / Register
            </Link>
          )}
        </div>
      </div>

    </header>
  );
};

export default Navbar;
