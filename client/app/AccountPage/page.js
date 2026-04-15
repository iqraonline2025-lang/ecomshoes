"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronRight, Loader2, ShoppingBag, LogOut, CreditCard } from 'lucide-react';

const AccountPage = () => {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const token = localStorage.getItem('shoeStoreToken');

    if (!token) {
      router.push('/'); 
      return;
    }

    // ✅ FIXED: Fetch fresh user data + orders simultaneously
    const initPage = async () => {
      try {
        // 1. Fetch User Profile
        const userRes = await fetch(`${API_URL}/api/users/profile`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const userData = await userRes.json();

        if (userData.success) {
          setUser(userData.user);
        } else {
          // If token is invalid/expired
          handleLogout();
          return;
        }

        // 2. Fetch Orders
        const orderRes = await fetch(`${API_URL}/api/orders/myorders`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        const orderData = await orderRes.json();
        setOrders(Array.isArray(orderData) ? orderData : []);

      } catch (error) {
        console.error("Initialization Error:", error);
      } finally {
        setLoading(false);
      }
    };

    initPage();
  }, [router, API_URL]);

  const handleLogout = () => {
    localStorage.removeItem('shoeStoreToken');
    localStorage.removeItem('shoeStoreUser');
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-black" size={40} />
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">Loading your profile</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-32 pb-20 px-6">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-center gap-8 mb-16 pb-12 border-b border-zinc-100">
          <div className="relative">
            <img 
              src={user?.picture || 'https://via.placeholder.com/150'} 
              alt="Profile" 
              className="w-32 h-32 rounded-[40px] border-4 border-zinc-50 shadow-xl object-cover"
            />
            <div className="absolute -bottom-2 -right-2 bg-black text-white p-2 rounded-2xl border-4 border-white">
              <CreditCard size={14} />
            </div>
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-4xl font-black uppercase tracking-tighter text-black">
              Hey, <span className="italic font-light text-zinc-400">{user?.name?.split(' ')[0]}</span>
            </h1>
            <p className="text-zinc-500 font-medium lowercase">{user?.email}</p>
            <div className="flex gap-4 mt-4 justify-center md:justify-start">
              <span className="px-4 py-1 bg-zinc-100 rounded-full text-[10px] font-black uppercase tracking-widest">
                Member Status: Active
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Order History */}
          <div className="lg:col-span-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-black uppercase tracking-tight italic">Order History</h2>
              <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">{orders.length} Total Orders</span>
            </div>

            {orders.length > 0 ? (
              <div className="space-y-6">
                {orders.map((order) => (
                  <div key={order._id} className="group bg-zinc-50 rounded-[32px] p-6 border border-zinc-100 hover:border-black transition-all duration-300">
                    <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
                      <div>
                        <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-1">Reference</p>
                        <p className="text-sm font-bold text-black uppercase">#{order._id.slice(-8)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-1">Status</p>
                        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                          order.status === 'paid' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'
                        }`}>
                          {order.status || 'Pending'}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                      {(order.items || []).map((item, idx) => (
                        <div key={idx} className="flex-shrink-0 w-20 h-20 bg-white rounded-2xl border border-zinc-100 overflow-hidden">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" title={item.name} />
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 flex justify-between items-center pt-6 border-t border-zinc-200/50">
                      <div>
                        <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Amount Paid</p>
                        <p className="text-lg font-black italic text-black">${(order.total || 0).toFixed(2)}</p>
                      </div>
                      <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-400 group-hover:text-black transition-colors">
                        Track Order <ChevronRight size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-20 bg-zinc-50 rounded-[40px] text-center border-2 border-dashed border-zinc-100">
                <ShoppingBag size={48} className="mx-auto mb-4 text-zinc-200" />
                <p className="text-zinc-400 font-bold uppercase tracking-widest">No history yet</p>
              </div>
            )}
          </div>

          {/* Account Summary */}
          <div className="lg:col-span-4">
            <div className="bg-black text-white p-8 rounded-[40px] sticky top-32 shadow-2xl shadow-black/10">
              <h3 className="text-xl font-black uppercase italic tracking-tighter mb-8">Summary</h3>
              <div className="space-y-6 mb-8">
                <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                  <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Total Lifetime Spend</p>
                  <p className="text-2xl font-black italic">
                    ${orders.reduce((acc, curr) => acc + (curr.total || 0), 0).toFixed(2)}
                  </p>
                </div>
              </div>
              <div className="space-y-3">
                <button 
                  onClick={() => router.push('/category')}
                  className="w-full py-4 bg-white text-black rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-zinc-200 transition-all"
                >
                  Continue Shopping
                </button>
                <button 
                  onClick={handleLogout}
                  className="w-full py-4 bg-zinc-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-red-900/20 hover:text-red-500 transition-all flex items-center justify-center gap-2"
                >
                  <LogOut size={14} /> Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;