"use client";
import { useState, useEffect } from "react";
import { GoogleLogin, googleLogout } from "@react-oauth/google";

export default function AuthButton() {
  const [user, setUser] = useState(null);

  // ✅ Step 1: Use Environment Variable for the API URL
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  useEffect(() => {
    const savedUser = localStorage.getItem("shoeStoreUser");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    // ✅ Step 2: Sync across tabs/components
    const syncAuth = () => {
      const updatedUser = localStorage.getItem("shoeStoreUser");
      setUser(updatedUser ? JSON.parse(updatedUser) : null);
    };

    window.addEventListener("storage", syncAuth);
    return () => window.removeEventListener("storage", syncAuth);
  }, []);

  const handleLoginSuccess = async (credentialResponse) => {
    try {
      // ✅ Step 3: Use Dynamic Endpoint
      const res = await fetch(`${API_URL}/api/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: credentialResponse.credential }),
      });

      const data = await res.json();

      if (data.token) {
        localStorage.setItem("shoeStoreToken", data.token);
        localStorage.setItem("shoeStoreUser", JSON.stringify(data.user));
        
        setUser(data.user);
        
        // Trigger sync for other components
        window.dispatchEvent(new Event("storage"));
        console.log("🔥 Login Successful!");
      }
    } catch (error) {
      console.error("❌ Backend connection failed:", error);
    }
  };

  const handleLogout = () => {
    googleLogout();
    localStorage.removeItem("shoeStoreToken");
    localStorage.removeItem("shoeStoreUser");
    setUser(null);
    
    // Trigger sync for other components
    window.dispatchEvent(new Event("storage"));
  };

  // Logged In State UI
  if (user) {
    return (
      <div className="flex items-center gap-4 bg-zinc-50 p-1.5 pr-4 rounded-full border border-zinc-100 transition-all hover:bg-zinc-100">
        <div className="relative">
          <img 
            src={user.picture} 
            alt={user.name} 
            className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
          />
          <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></div>
        </div>
        
        <div className="flex flex-col">
          <span className="font-black uppercase italic text-[10px] leading-tight tracking-tighter">
            {user.name.split(' ')[0]}
          </span>
          <button 
            onClick={handleLogout}
            className="text-[8px] font-bold uppercase tracking-[0.2em] text-zinc-400 hover:text-red-500 transition-colors text-left"
          >
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  // Logged Out State UI
  return (
    <div className="flex justify-center scale-90 md:scale-100">
      <GoogleLogin
        onSuccess={handleLoginSuccess}
        onError={() => console.log("Login Failed")}
        theme="filled_black" 
        shape="pill"
        text="signin_with" // More concise for clean headers
      />
    </div>
  );
}