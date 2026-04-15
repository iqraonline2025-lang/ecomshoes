"use client";

import { useState } from 'react';
import { 
  PlusCircle, 
  Package, 
  Settings, 
  LogOut, 
  ShoppingBag,
  SlidersHorizontal 
} from 'lucide-react';

import AdminProductForm from "../components/adminProductForm";
import AdminGeneralForm from "../components/adminForm";        
import AdminProductList from "../components/AdminProductList";
import AdminOrdersList from "../components/AdminOrdersList";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('inventory'); 
  
  // ✅ NEW: State to store the product we want to edit
  const [editingProduct, setEditingProduct] = useState(null);

  // ✅ NEW: Function to handle when someone clicks "Edit" in the list
  const handleEditInit = (product) => {
    setEditingProduct(product); // Put the product data in state
    setActiveTab('add-product'); // Switch to the form tab
  };

  // ✅ NEW: Function to reset the edit state when we switch tabs manually
  const handleTabChange = (tabName) => {
    if (tabName !== 'add-product') {
      setEditingProduct(null); // Clear editing mode if we leave the form
    }
    setActiveTab(tabName);
  };

  return (
    <div className="flex min-h-screen bg-[#fcfcfc] text-black">
      
      {/* --- SIDEBAR --- */}
      <aside className="w-64 bg-black p-6 flex flex-col fixed h-full z-50">
        <div className="mb-10 px-2">
          <h1 className="text-white text-2xl font-black uppercase italic tracking-tighter">
            Store<span className="text-gray-500 underline decoration-1">Admin</span>
          </h1>
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
            footwear stock
          </button>

          <button
            onClick={() => handleTabChange('add-product')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-xs uppercase tracking-widest ${
              activeTab === 'add-product' ? 'bg-white text-black' : 'text-gray-400 hover:text-white hover:bg-white/10'
            }`}
          >
            <PlusCircle size={18} />
            {editingProduct ? 'Edit Product' : 'Top Deals form'}
          </button>

          <button
            onClick={() => handleTabChange('general-settings')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-xs uppercase tracking-widest ${
              activeTab === 'general-settings' ? 'bg-white text-black' : 'text-gray-400 hover:text-white hover:bg-white/10'
            }`}
          >
            <SlidersHorizontal size={18} />
            footwear form
          </button>
        </nav>

        <div className="pt-10 border-t border-white/10 space-y-2">
          <button className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-500/10 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <main className="ml-64 flex-1 p-12">
        <div className="max-w-6xl mx-auto">
          
          <header className="mb-12">
            <h2 className="text-4xl font-black uppercase italic tracking-tighter">
              {activeTab === 'inventory' && 'Live Inventory'}
              {activeTab === 'add-product' && (editingProduct ? 'Update Product' : 'New Shoe Listing')}
              {activeTab === 'general-settings' && 'System Configuration'}
              {activeTab === 'orders' && 'Order Logistics'}
            </h2>
          </header>

          <div className="transition-all duration-300">
            {activeTab === 'orders' && (
              <div className="animate-in fade-in slide-in-from-bottom-4">
                <AdminOrdersList />
              </div>
            )}
            
            {activeTab === 'inventory' && (
              <div className="animate-in fade-in slide-in-from-bottom-4">
                {/* ✅ Pass the Edit handler to the list */}
                <AdminProductList onEdit={handleEditInit} />
              </div>
            )}

            {activeTab === 'add-product' && (
              <div className="animate-in fade-in slide-in-from-bottom-4">
                {/* ✅ Pass editingProduct data and a success callback to the form */}
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