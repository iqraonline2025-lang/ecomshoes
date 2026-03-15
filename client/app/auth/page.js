"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { GoogleLogin } from '@react-oauth/google';
import { Mail, Lock, User, ArrowRight, Loader2 } from 'lucide-react';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const router = useRouter();

  // ✅ Step 1: Define the Dynamic URL
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Step 2: Update the Standard Login/Register Fetch
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
    const payload = isLogin ? { email: formData.email, password: formData.password } : formData;

    try {
      const res = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('shoeStoreToken', data.token);
        localStorage.setItem('shoeStoreUser', JSON.stringify(data.user));
        window.dispatchEvent(new Event('local-storage-update'));
        router.push('/');
      } else {
        alert(data.message || "Authentication failed");
      }
    } catch (err) {
      console.error("Auth Error:", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Step 3: Update Google Success handler to use Dynamic URL
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const res = await fetch(`${API_URL}/api/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: credentialResponse.credential }),
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem('shoeStoreToken', data.token);
        localStorage.setItem('shoeStoreUser', JSON.stringify(data.user));
        window.dispatchEvent(new Event('local-storage-update'));
        router.push('/');
      }
    } catch (err) {
      console.error("Google Auth Error:", err);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row font-sans">
      {/* LEFT SIDE: Brand Image */}
      <div className="hidden lg:flex lg:w-1/2 bg-zinc-900 relative overflow-hidden items-center justify-center p-12">
        <img 
          src="https://images.unsplash.com/photo-1552346154-21d32810aba3?q=80&w=2070&auto=format&fit=crop" 
          alt="Sneaker Culture"
          className="absolute inset-0 w-full h-full object-cover opacity-60 grayscale hover:grayscale-0 transition-all duration-1000"
        />
        <div className="relative z-20 text-white text-center">
          <h2 className="text-8xl font-black italic tracking-tighter uppercase leading-[0.8]">
            STREET <br /> READY.
          </h2>
          <p className="mt-6 text-xs font-bold tracking-[0.4em] uppercase opacity-70">RoadKicks Elite Member Access</p>
        </div>
      </div>

      {/* RIGHT SIDE: Auth Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="mb-10">
            <h1 className="text-4xl font-black uppercase tracking-tighter text-black">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h1>
            <div className="h-1 w-10 bg-blue-600 mt-2" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div className="relative border-b-2 border-zinc-100 focus-within:border-black transition-colors">
                <User className="absolute left-0 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                <input
                  name="name"
                  type="text"
                  placeholder="Full Name"
                  required
                  className="w-full py-4 pl-10 pr-4 bg-transparent text-sm font-medium focus:outline-none placeholder:text-zinc-300"
                  onChange={handleInputChange}
                />
              </div>
            )}

            <div className="relative border-b-2 border-zinc-100 focus-within:border-black transition-colors">
              <Mail className="absolute left-0 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
              <input
                name="email"
                type="email"
                placeholder="Email Address"
                required
                className="w-full py-4 pl-10 pr-4 bg-transparent text-sm font-medium focus:outline-none placeholder:text-zinc-300"
                onChange={handleInputChange}
              />
            </div>

            <div className="relative border-b-2 border-zinc-100 focus-within:border-black transition-colors">
              <Lock className="absolute left-0 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
              <input
                name="password"
                type="password"
                placeholder="Password"
                required
                className="w-full py-4 pl-10 pr-4 bg-transparent text-sm font-medium focus:outline-none placeholder:text-zinc-300"
                onChange={handleInputChange}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-4 flex items-center justify-center gap-3 hover:bg-zinc-800 transition-all active:scale-[0.98] mt-8"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  <span className="text-xs font-black uppercase tracking-[0.2em]">
                    {isLogin ? 'Sign In' : 'Register Now'}
                  </span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* Social Divider */}
          <div className="relative my-10 flex items-center">
            <div className="flex-grow border-t border-zinc-100"></div>
            <span className="flex-shrink mx-4 text-[10px] font-bold text-zinc-300 uppercase tracking-widest">OR</span>
            <div className="flex-grow border-t border-zinc-100"></div>
          </div>

          <div className="flex justify-center mb-10 overflow-hidden">
             <GoogleLogin
               onSuccess={handleGoogleSuccess}
               onError={() => console.log('Login Failed')}
               theme="filled_black"
               shape="square"
               width="384"
             />
          </div>

          <div className="text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-xs font-bold text-zinc-500 hover:text-black transition-colors"
            >
              {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;