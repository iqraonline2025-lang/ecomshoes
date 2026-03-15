'use client';

import { useState } from 'react';
import { 
  PlusCircle, 
  Package, 
  Settings, 
  LogOut, 
  ShoppingBag,
  SlidersHorizontal // Icon for the general admin form
} from 'lucide-react';

// --- SEPARATE IMPORTS ---
import AdminProductForm from "../components/adminProductForm"; // The Shoe Upload Form
import AdminGeneralForm from "../components/adminForm";        // The General Admin Form
import AdminProductList from "../components/AdminProductList";
import AdminOrdersList from "../components/AdminOrdersList";

export default function AdminPage() {
  // Tabs: 'inventory', 'add-product', 'general-settings', or 'orders'
  const [activeTab, setActiveTab] = useState('inventory'); 

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
            onClick={() => setActiveTab('orders')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-xs uppercase tracking-widest ${
              activeTab === 'orders' ? 'bg-white text-black' : 'text-gray-400 hover:text-white hover:bg-white/10'
            }`}
          >
            <ShoppingBag size={18} />
            Orders
          </button>

          <button
            onClick={() => setActiveTab('inventory')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-xs uppercase tracking-widest ${
              activeTab === 'inventory' ? 'bg-white text-black' : 'text-gray-400 hover:text-white hover:bg-white/10'
            }`}
          >
            <Package size={18} />
            footwear stock
          </button>

          {/* Tab for AdminProductForm.jsx */}
          <button
            onClick={() => setActiveTab('add-product')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-xs uppercase tracking-widest ${
              activeTab === 'add-product' ? 'bg-white text-black' : 'text-gray-400 hover:text-white hover:bg-white/10'
            }`}
          >
            <PlusCircle size={18} />
            Top Deals form
          </button>

          {/* Tab for adminForm.jsx (General Admin) */}
          <button
            onClick={() => setActiveTab('general-settings')}
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
              {activeTab === 'add-product' && 'New Shoe Listing'}
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
                <AdminProductList />
              </div>
            )}

            {/* Renders AdminProductForm.jsx */}
            {activeTab === 'add-product' && (
              <div className="animate-in fade-in slide-in-from-bottom-4">
                <AdminProductForm />
              </div>
            )}

            {/* Renders adminForm.jsx */}
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