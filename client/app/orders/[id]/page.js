"use client";
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Package, 
  Truck, 
  CheckCircle, 
  Clock, 
  ChevronLeft, 
  AlertCircle 
} from 'lucide-react';
import Link from 'next/link';

const OrderTrackingPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ Step 1: Dynamic API URL
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  // ✅ Step 2: Status Mapping
  // This converts backend strings into the progress bar index
  const getStepIndex = (status) => {
    const map = { 'pending': 0, 'paid': 1, 'shipped': 2, 'delivered': 3 };
    return map[status?.toLowerCase()] ?? 0;
  };

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await fetch(`${API_URL}/api/orders/track/${id}`);
        const result = await res.json();
        
        if (result.success) {
          setOrder(result.data);
        } else {
          setError(result.message || "Order not found");
        }
      } catch (err) {
        setError("Network error. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchOrder();
  }, [id, API_URL]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-1 bg-zinc-100 overflow-hidden relative">
            <motion.div 
              initial={{ left: "-100%" }}
              animate={{ left: "100%" }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
              className="absolute top-0 w-full h-full bg-black"
            />
          </div>
          <div className="text-[10px] font-black uppercase tracking-[0.5em]">
            Syncing Manifest...
          </div>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white p-6 text-center">
        <AlertCircle size={40} className="mb-4 text-zinc-100" />
        <h2 className="text-xl font-black uppercase tracking-tighter italic">Tracking Error</h2>
        <p className="text-[10px] text-zinc-400 uppercase tracking-widest mt-2">{error}</p>
        <Link href="/" className="mt-8 text-[10px] font-black uppercase border-b-2 border-black pb-1 hover:text-zinc-500 hover:border-zinc-500 transition-all">
          Back to Terminal
        </Link>
      </div>
    );
  }

  const steps = [
    { label: 'Pending', icon: Clock },
    { label: 'Paid', icon: CheckCircle },
    { label: 'Shipped', icon: Truck },
    { label: 'Delivered', icon: Package },
  ];

  const currentStepIndex = getStepIndex(order.status);

  return (
    <div className="min-h-screen bg-white pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto space-y-16">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-black transition-colors">
              <ChevronLeft size={14} /> Return
            </Link>
            <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter italic leading-[0.8]">
              STATUS <br /> <span className="text-zinc-100">REPORT</span>
            </h1>
          </div>
          <div className="bg-zinc-50 border border-zinc-100 px-6 py-4 rounded-2xl">
            <p className="text-[9px] font-black uppercase tracking-widest text-zinc-300">Tracking Reference</p>
            <p className="font-black text-sm uppercase">#{order._id?.slice(-10).toUpperCase() || id.toUpperCase()}</p>
          </div>
        </div>

        {/* TRACKING VISUALIZER */}
        <div className="relative py-12">
          {/* Progress Line */}
          <div className="absolute top-[50px] left-0 w-full h-[1px] bg-zinc-100" />
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
            className="absolute top-[50px] left-0 h-[1px] bg-black z-10"
            transition={{ duration: 1.5, ease: "circOut", delay: 0.5 }}
          />

          <div className="relative z-20 flex justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isPast = index <= currentStepIndex;
              const isCurrent = index === currentStepIndex;

              return (
                <div key={step.label} className="flex flex-col items-center gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-700 ${
                    isPast ? 'bg-black text-white scale-110 shadow-xl shadow-black/10' : 'bg-white border border-zinc-100 text-zinc-200'
                  }`}>
                    <Icon size={18} strokeWidth={isCurrent ? 2.5 : 1.5} />
                  </div>
                  <span className={`text-[9px] font-black uppercase tracking-widest ${isPast ? 'text-black' : 'text-zinc-300'}`}>
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* CONTENT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 pt-8">
          
          {/* ITEMS */}
          <div className="lg:col-span-2 space-y-8">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-300 border-b border-zinc-50 pb-4">Consignment Details</h3>
            <div className="space-y-6">
              {order.products?.map((item, idx) => (
                <div key={idx} className="flex gap-6 items-center group">
                  <div className="w-20 h-24 bg-zinc-50 overflow-hidden grayscale group-hover:grayscale-0 transition-all">
                    <img src={item.image || item.productId?.images[0]} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-black uppercase text-sm leading-none mb-2">{item.name || item.productId?.name}</h4>
                    <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">
                      Size: {item.size || 'Standard'} / Qty: {item.quantity || 1}
                    </p>
                  </div>
                  <div className="font-black text-sm italic">${(item.price * (item.quantity || 1)).toFixed(2)}</div>
                </div>
              ))}
            </div>
          </div>

          {/* SHIPPING & SUMMARY */}
          <div className="space-y-12">
            <div className="space-y-4">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-300">Destination</h3>
              <div className="text-[11px] font-bold uppercase leading-relaxed tracking-tight text-zinc-600">
                {order.shippingDetails?.fullName}<br />
                {order.shippingDetails?.address}<br />
                {order.shippingDetails?.city}, {order.shippingDetails?.postcode}<br />
                <span className="text-zinc-300 font-medium">Contact: {order.shippingDetails?.phone}</span>
              </div>
            </div>

            <div className="bg-zinc-900 text-white p-8 rounded-[32px] space-y-4 shadow-2xl shadow-black/20">
              <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest opacity-60">
                <span>Subtotal</span>
                <span>${(order.totalAmount - (order.shippingCost || 0)).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest opacity-60 pb-4 border-b border-white/10">
                <span>Logistic Fee</span>
                <span>${(order.shippingCost || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-2xl font-black uppercase italic pt-2">
                <span>Total</span>
                <span>${order.totalAmount?.toFixed(2)}</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default OrderTrackingPage;