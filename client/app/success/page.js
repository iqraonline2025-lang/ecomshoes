"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { CheckCircle, Package, ArrowRight, ShoppingBag } from 'lucide-react';

const SuccessPage = () => {
  const [orderId, setOrderId] = useState(null);
  const [fullSessionId, setFullSessionId] = useState("");

  useEffect(() => {
    // 1. Clear the local cart immediately
    localStorage.removeItem('cart');
    
    // 2. Grab the session ID from the URL
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get('session_id');
    
    if (sessionId) {
      setFullSessionId(sessionId);
      // Extract last 8 chars for a "Reference Number" look
      setOrderId(sessionId.slice(-8).toUpperCase());
    }
  }, []);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6 pt-20">
      <div className="max-w-2xl w-full text-center space-y-8">
        
        {/* SUCCESS ANIMATION */}
        <motion.div 
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="flex justify-center"
        >
          <div className="w-24 h-24 bg-black rounded-full flex items-center justify-center text-white shadow-2xl shadow-black/20">
            <CheckCircle size={48} strokeWidth={1.5} />
          </div>
        </motion.div>

        {/* ORDER CONFIRMATION TEXT */}
        <div className="space-y-4">
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter italic leading-none">
            PAYMENT <br /> <span className="text-zinc-300">RECEIVED</span>
          </h1>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400">
            Your order is being processed by our studio
          </p>
        </div>

        {/* ORDER DETAILS CARD */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-zinc-50 rounded-[40px] p-8 border border-zinc-100 grid grid-cols-1 md:grid-cols-2 gap-6 text-left"
        >
          <div className="space-y-1">
            <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2">
              <Package size={12} /> Order Reference
            </p>
            <p className="font-black text-sm uppercase">
              {orderId ? `#${orderId}` : 'GENERATING...'}
            </p>
          </div>
          <div className="space-y-1 text-right md:text-left">
            <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2 md:justify-start justify-end">
              <ShoppingBag size={12} /> Status
            </p>
            <p className="font-black text-sm uppercase text-green-600 italic">Confirmed</p>
          </div>
        </motion.div>

        {/* ACTION BUTTONS */}
        <div className="flex flex-col md:flex-row gap-4 pt-6">
          <Link 
            href="/category" 
            className="flex-1 bg-black text-white py-6 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-3 hover:bg-zinc-800 transition-all group"
          >
            Continue Shopping <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>

          {/* FIXED: Links directly to the unique tracking URL */}
          <Link 
            href={fullSessionId ? `/orders/${fullSessionId}` : '/orders'} 
            className="flex-1 border-2 border-zinc-100 py-6 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-3 hover:bg-zinc-50 transition-all"
          >
            Track Order
          </Link>
        </div>

        <p className="text-[9px] text-zinc-400 font-bold uppercase leading-relaxed tracking-widest">
          A confirmation email has been sent to your inbox. <br />
          Thank you for supporting the studio.
        </p>

      </div>
    </div>
  );
};

export default SuccessPage;