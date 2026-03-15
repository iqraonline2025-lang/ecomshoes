'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Loader2 } from 'lucide-react';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });

  // ✅ Step 1: Dynamic API URL for production deployment
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  const handleSubscribe = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      // ✅ Step 2: Use Dynamic URL
      const res = await fetch(`${API_URL}/api/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      
      const data = await res.json();

      if (res.ok) {
        setStatus({ type: 'success', message: data.message || "Welcome to the squad!" });
        setEmail('');
      } else {
        setStatus({ type: 'error', message: data.message || "Something went wrong." });
      }
    } catch (err) {
      setStatus({ type: 'error', message: "Connection failed. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-20 px-6 bg-black text-white overflow-hidden">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-[1000px] mx-auto bg-[#111] p-10 md:p-16 rounded-[3rem] border border-white/5 relative"
      >
        <div className="flex flex-col md:flex-row items-center justify-between gap-10">
          
          {/* Text Content */}
          <div className="max-w-md text-center md:text-left">
            <h2 className="text-4xl font-black italic uppercase tracking-tighter mb-4">
              Join the <span className="text-red-600 underline decoration-2 underline-offset-8">Squad</span>
            </h2>
            <p className="text-gray-400 font-medium">
              Sign up for our newsletter and get <span className="text-white font-bold">15% OFF</span> your first order.
            </p>
          </div>

          {/* Form */}
          <div className="w-full max-w-sm">
            <form onSubmit={handleSubscribe} className="relative group">
              <input 
                type="email" 
                placeholder="Enter your email"
                required
                disabled={loading}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/10 py-5 px-6 rounded-2xl outline-none focus:border-red-600 transition-all text-white placeholder:text-gray-600 disabled:opacity-50"
              />
              <button 
                type="submit"
                disabled={loading}
                className="absolute right-2 top-2 bottom-2 bg-red-600 hover:bg-red-700 disabled:bg-zinc-800 text-white px-6 rounded-xl transition-all active:scale-95 flex items-center justify-center min-w-[60px]"
              >
                {loading ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Send size={18} />
                )}
              </button>
            </form>

            {/* Status Messages */}
            <AnimatePresence mode="wait">
              {status.message && (
                <motion.p 
                  key={status.type}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className={`mt-4 text-[10px] font-black uppercase tracking-[0.2em] ${
                    status.type === 'success' ? 'text-green-500' : 'text-red-500'
                  }`}
                >
                  {status.message}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Decorative Background Element */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-red-600/10 blur-[80px] rounded-full pointer-events-none" />
      </motion.div>
    </section>
  );
};

export default Newsletter;