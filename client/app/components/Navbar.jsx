"use client";
import React, { useState, useEffect } from 'react';
import { Search, ShoppingCart, User, LogOut, Menu, X } from 'lucide-react';
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
    <header className="w-full bg-white sticky top-0 z-[999] shadow-md font-sans">
      
      {/* Top Banner */}
      <div className="bg-zinc-900 py-2 text-center text-[10px] font-bold tracking-[0.2em] text-white uppercase">
        Free shipping over $150 • ROADKICKS Limited Drop
      </div>

      <div className="border-b border-gray-100 bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-8">

          {/* Mobile Controls */}
          <div className="flex md:hidden items-center gap-5">
            <button onClick={() => setIsMenuOpen(true)}><Menu size={26} /></button>
            <button onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}><Search size={22} /></button>
          </div>

          {/* Logo */}
          <div className="flex flex-1 justify-center md:justify-start">
            <Link href="/" className="text-2xl font-black italic">
              ROAD<span className="text-blue-600">KICKS</span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/category">Footwear</Link>
            <Link href="/sale" className="text-red-600">Sale</Link>

            <div className="relative min-w-[200px]">
              <input
                type="text"
                placeholder="SEARCH..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && executeSearch()}
                className="w-full border-b py-1 pr-8 text-sm"
              />
              <Search className="absolute right-0 top-1 h-4 w-4" />
            </div>
          </nav>

          {/* Right Icons */}
          <div className="flex flex-1 justify-end items-center space-x-5">
            {userData ? (
              <Link href="/AccountPage" className="h-8 w-8 bg-black text-white flex items-center justify-center rounded-full">
                {getInitial()}
              </Link>
            ) : (
              <Link href="/auth"><User size={22} /></Link>
            )}

            <Link href="/cart" className="relative">
              <ShoppingCart size={22} />
              {cartCount > 0 && (
                <span className="absolute -right-2 -top-2 bg-blue-600 text-white text-xs rounded-full px-1">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Search */}
      <div className={`md:hidden bg-zinc-900 ${isMobileSearchOpen ? "max-h-[80px]" : "max-h-0"} overflow-hidden`}>
        <div className="p-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && executeSearch()}
            className="w-full bg-zinc-800 text-white p-2 rounded"
          />
        </div>
      </div>

      {/* Sidebar */}
      <div className={`fixed inset-0 bg-black/70 ${isMenuOpen ? "block" : "hidden"}`} onClick={() => setIsMenuOpen(false)} />

      <div className={`fixed top-0 left-0 h-full w-[300px] bg-zinc-900 text-white p-6 ${isMenuOpen ? "translate-x-0" : "-translate-x-full"} transition`}>
        
        <button onClick={() => setIsMenuOpen(false)}><X /></button>

        <nav className="flex flex-col gap-6 mt-10">
          <Link href="/">Home</Link>
          <Link href="/category">Footwear</Link>

          {userData && (
            <Link href="/AccountPage">My Account</Link>
          )}

          <Link href="/sale" className="text-red-500">Sale</Link>
        </nav>

        <div className="mt-auto pt-10">
          {userData ? (
            <button onClick={handleLogout} className="flex gap-2">
              <LogOut /> Logout
            </button>
          ) : (
            <Link href="/auth">Sign In</Link>
          )}
        </div>
      </div>

    </header>
  );
};

export default Navbar;