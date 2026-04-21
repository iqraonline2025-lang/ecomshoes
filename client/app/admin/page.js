"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  PlusCircle, 
  Package, 
  LogOut, 
  ShoppingBag,
  SlidersHorizontal 
} from 'lucide-react';

import AdminProductForm from "../components/adminProductForm";
import AdminGeneralForm from "../components/adminForm";        
import AdminProductList from "../components/AdminProductList";
import AdminOrdersList from "../components/AdminOrdersList";

export default function AdminPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('inventory'); 
  const [editingProduct, setEditingProduct] = useState(null);

  // Security Check: Redirect if not logged in as admin
  useEffect(() => {
    const userData = localStorage.getItem('shoeStoreUser');
    const user = userData ? JSON.parse(userData) : null;
    
    if (!user || user.role !== 'admin') {
      router.push('/auth');
    }
  }, [router]);

  const handleEditInit = (product) => {
    setEditingProduct(product); 
    setActiveTab('add-product'); 
  };

  const handleTabChange = (tabName) => {
    if (tabName !== 'add-product') {
      setEditingProduct(null); 
    }
    setActiveTab(tabName);
  };

  const handleLogout = () => {
    localStorage.removeItem('shoeStoreToken');
    localStorage.removeItem('shoeStoreUser');
    window.dispatchEvent(new Event('local-storage-update'));
    router.push('/auth');
  };

  return (
    <div className="flex min-h-screen bg-[#fcfcfc] text-black">
      
      {/* --- SIDEBAR --- */}
      <aside className="w-64 bg-black p-6 flex flex-col fixed h-full z-50">
        <div className="mb-10 px-2">
          <h1 className="text-white text-2xl font-black uppercase italic tracking-tighter">
            Road<span className="text-blue-600 underline decoration-2 underline-offset-4">Kicks</span>
          </h1>
          <p className="text-[8px] text-zinc-500 font-black uppercase tracking-[0.3em] mt-1">Control Panel</p>
        </div>

        <nav className="flex-1 space-y-2">
          <button
            onClick={() => handleTabChange('orders')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-xs uppercase tracking-widest ${
              activeTab === 'orders' ? 'bg-white text-black' : 'text-gray-400 hover:text-white hover:bg-white/10'
            }`}
          >
            <ShoppingBag size={18} />
            Orders
          </button>

          <button
            onClick={() => handleTabChange('inventory')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-xs uppercase tracking-widest ${
              activeTab === 'inventory' ? 'bg-white text-black' : 'text-gray-400 hover:text-white hover:bg-white/10'
            }`}
          >
            <Package size={18} />
            Inventory
          </button>

          <button
            onClick={() => handleTabChange('add-product')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-xs uppercase tracking-widest ${
              activeTab === 'add-product' ? 'bg-white text-black' : 'text-gray-400 hover:text-white hover:bg-white/10'
            }`}
          >
            <PlusCircle size={18} />
            {editingProduct ? 'Edit Product' : 'Add Listing'}
          </button>

          <button
            onClick={() => handleTabChange('general-settings')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-xs uppercase tracking-widest ${
              activeTab === 'general-settings' ? 'bg-white text-black' : 'text-gray-400 hover:text-white hover:bg-white/10'
            }`}
          >
            <SlidersHorizontal size={18} />
            General Info
          </button>
        </nav>

        <div className="pt-10 border-t border-white/10">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-500/10 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
          >
            <LogOut size={16} />
            Logout System
          </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <main className="ml-64 flex-1 p-12">
        <div className="max-w-6xl mx-auto">
          
          <header className="mb-12 border-b border-zinc-100 pb-8">
            <h2 className="text-5xl font-black uppercase italic tracking-tighter">
              {activeTab === 'inventory' && 'Live Inventory'}
              {activeTab === 'add-product' && (editingProduct ? 'Update Product' : 'New Listing')}
              {activeTab === 'general-settings' && 'System Config'}
              {activeTab === 'orders' && 'Logistics'}
            </h2>
            <p className="text-zinc-400 text-xs font-bold uppercase tracking-widest mt-2">Manage your global store operations</p>
          </header>

          <div className="transition-all duration-300">
            {activeTab === 'orders' && (
              <div className="animate-in fade-in slide-in-from-bottom-4">
                <AdminOrdersList />
              </div>
            )}
            
            {activeTab === 'inventory' && (
              <div className="animate-in fade-in slide-in-from-bottom-4">
                <AdminProductList onEdit={handleEditInit} />
              </div>
            )}

            {activeTab === 'add-product' && (
              <div className="animate-in fade-in slide-in-from-bottom-4">
                <AdminProductForm 
                  existingData={editingProduct} 
                  onSuccess={() => {
                    setEditingProduct(null);
                    setActiveTab('inventory');
                  }} 
                />
              </div>
            )}

            {activeTab === 'general-settings' && (
              <div className="animate-in fade-in slide-in-from-bottom-4">
                <AdminGeneralForm />
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}