"use client";
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Package, 
  Truck, 
  CheckCircle, 
  ExternalLink, 
  RefreshCw, 
  Search,
  MoreHorizontal
} from 'lucide-react';
import Link from 'next/link';

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  // ✅ Step 1: Define Dynamic API URL
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  const fetchOrders = async () => {
    setLoading(true);
    const token = localStorage.getItem('shoeStoreToken'); // Get admin token

    try {
      // ✅ Step 2: Use Dynamic URL and Auth Headers
      const res = await fetch(`${API_URL}/api/admin/orders`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const result = await res.json();
      if (result.success) setOrders(result.data);
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, newStatus) => {
    const token = localStorage.getItem('shoeStoreToken');
    try {
      // ✅ Step 3: Use Dynamic URL for Status Update
      const res = await fetch(`${API_URL}/api/admin/orders/${id}/status`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) fetchOrders();
    } catch (err) {
      console.error("Update failed");
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  const filteredOrders = filter === 'all' 
    ? orders 
    : orders.filter(o => o.status === filter);

  return (
    <div className="min-h-screen bg-white pt-32 pb-20 px-6 md:px-12">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="space-y-2">
            <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter italic leading-[0.8]">
              ORDER <br /> <span className="text-zinc-200">LOGISTICS</span>
            </h1>
            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-400">Studio Management Interface</p>
          </div>
          
          <div className="flex items-center gap-4">
            <select 
              onChange={(e) => setFilter(e.target.value)}
              className="bg-zinc-100 border-none text-[10px] font-black uppercase tracking-widest px-6 py-4 rounded-xl focus:ring-2 focus:ring-black transition-all"
            >
              <option value="all">All Orders</option>
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="shipped">Shipped</option>
            </select>
            <button onClick={fetchOrders} className="p-4 bg-black text-white rounded-xl hover:bg-zinc-800 transition-colors">
              <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
            </button>
          </div>
        </div>

        {/* ORDERS TABLE */}
        <div className="bg-white border border-zinc-100 rounded-[32px] overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-100 text-[9px] font-black uppercase tracking-[0.2em] text-zinc-400">
                  <th className="py-6 px-8">Reference / Date</th>
                  <th className="py-6 px-8">Customer</th>
                  <th className="py-6 px-8">Items</th>
                  <th className="py-6 px-8">Total</th>
                  <th className="py-6 px-8">Status</th>
                  <th className="py-6 px-8 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-50 text-[11px] font-bold uppercase tracking-tight">
                {filteredOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-zinc-50/50 transition-colors">
                    <td className="py-6 px-8">
                      <div className="font-black text-zinc-900 italic">#{order._id.slice(-8).toUpperCase()}</div>
                      <div className="text-[9px] text-zinc-400 mt-1">{new Date(order.createdAt).toLocaleDateString()}</div>
                    </td>
                    <td className="py-6 px-8">
                      <div>{order.shippingDetails?.fullName || "Guest"}</div>
                      <div className="text-[9px] text-zinc-400 font-medium normal-case">{order.shippingDetails?.city || "N/A"}</div>
                    </td>
                    <td className="py-6 px-8 text-zinc-500">
                      {order.items?.length || 0} {order.items?.length === 1 ? 'Item' : 'Items'}
                    </td>
                    <td className="py-6 px-8 font-black">${order.total?.toFixed(2)}</td>
                    <td className="py-6 px-8">
                      <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-tighter ${
                        order.status === 'paid' ? 'bg-green-100 text-green-600' : 
                        order.status === 'shipped' ? 'bg-zinc-900 text-white' : 'bg-zinc-100 text-zinc-500'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-6 px-8 text-right">
                      <div className="flex justify-end gap-2">
                        {order.status === 'paid' && (
                          <button 
                            onClick={() => updateStatus(order._id, 'shipped')}
                            className="bg-black text-white px-4 py-2 rounded-lg text-[9px] font-black uppercase hover:bg-zinc-800 transition-colors"
                          >
                            Ship
                          </button>
                        )}
                        <Link 
                          href={`/orders/${order.stripeSessionId}`} 
                          target="_blank"
                          className="p-2 border border-zinc-200 rounded-lg hover:bg-zinc-100 transition-colors text-zinc-400 hover:text-black"
                        >
                          <ExternalLink size={14} />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filteredOrders.length === 0 && !loading && (
          <div className="text-center py-20 border-2 border-dashed border-zinc-100 rounded-[40px]">
            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-300">No Orders Found In Database</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrdersPage;