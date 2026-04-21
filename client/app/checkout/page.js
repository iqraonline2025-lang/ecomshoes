"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  ShoppingCart,
  MapPin,
  CreditCard,
  ClipboardCheck,
  Loader2
} from "lucide-react";

import ShippingStep from "../components/ShippingStep";
import PaymentStep from "../components/PaymentStep";
import ReviewStep from "../components/ReviewStep";

const CheckoutPage = () => {
  const router = useRouter();
  
  // Logic: Start at Step 2 (Shipping)
  const [currentStep, setCurrentStep] = useState(2);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  const [checkoutData, setCheckoutData] = useState({
    fullName: "",
    email: "", 
    address: "",
    city: "",
    postcode: "",
    phone: "",
    deliveryType: "standard",
    shippingCost: 15,
    paymentMethod: "card"
  });

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    if (savedCart.length === 0) {
      router.push("/cart");
    }
    setCartItems(savedCart);

    const savedUser = JSON.parse(localStorage.getItem("shoeStoreUser") || "null");
    const token = localStorage.getItem("shoeStoreToken"); // Match your cart's token key

    if (!token) {
      alert("Please login to proceed with checkout");
      router.push("/auth");
      return;
    }

    setUser(savedUser);

    if (savedUser) {
      setCheckoutData(prev => ({
        ...prev,
        fullName: prev.fullName || savedUser.name,
        email: prev.email || savedUser.email 
      }));
    }
  }, [router]);

  // --- Calculations (Strictly £) ---
  const subtotal = cartItems.reduce((acc, item) => {
    let rawPrice = item.newPrice ?? item.price ?? 0;
    const price = typeof rawPrice === 'string' 
      ? parseFloat(rawPrice.replace(/[£,]/g, '')) 
      : parseFloat(rawPrice);
    return acc + (isNaN(price) ? 0 : price) * (item.quantity || 1);
  }, 0);

  const tax = subtotal * 0.08; 
  const total = subtotal + tax + checkoutData.shippingCost;

  // --- Navigation ---
  const steps = [
    { id: 1, name: "Cart", icon: <ShoppingCart size={14} /> },
    { id: 2, name: "Shipping", icon: <MapPin size={14} /> },
    { id: 3, name: "Payment", icon: <CreditCard size={14} /> },
    { id: 4, name: "Review", icon: <ClipboardCheck size={14} /> }
  ];

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 4));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const handlePlaceOrder = async () => {
    setLoading(true);
    const token = localStorage.getItem("shoeStoreToken");

    try {
      const response = await fetch(`${API_URL}/api/orders/checkout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`, 
        },
        body: JSON.stringify({ 
          cartItems, 
          checkoutData: {
            ...checkoutData,
            subtotal,
            tax,
            total,
            currency: 'GBP'
          } 
        }),
      });

      const result = await response.json();

      if (!response.ok) throw new Error(result.error || "Checkout failed");

      localStorage.removeItem("cart");
      window.dispatchEvent(new Event("storage"));

      if (result.url) {
        window.location.href = result.url; // Stripe Redirect
      } else {
        router.push("/success");
      }

    } catch (error) {
      console.error("Checkout Error:", error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white pt-32 pb-20 px-6 text-black">
      <div className="max-w-5xl mx-auto">
        
        {/* Step Indicator */}
        <div className="flex justify-between items-center mb-20 relative max-w-2xl mx-auto">
          <div className="absolute top-1/2 left-0 w-full h-[1px] bg-zinc-100 -z-10" />
          {steps.map((s) => (
            <div key={s.id} className="flex flex-col items-center gap-3 bg-white px-2">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
                  currentStep >= s.id
                    ? "bg-black border-black text-white shadow-xl shadow-black/20"
                    : "bg-white border-zinc-100 text-zinc-300"
                }`}
              >
                {currentStep > s.id ? <Check size={18} /> : s.icon}
              </div>
              <span className={`text-[9px] font-black uppercase tracking-[0.2em] ${currentStep >= s.id ? "text-black" : "text-zinc-300"}`}>
                {s.name}
              </span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-8 bg-zinc-50 rounded-[40px] p-8 md:p-12 border border-zinc-100">
            <AnimatePresence mode="wait">
              {currentStep === 2 && (
                <ShippingStep key="ship" data={checkoutData} setData={setCheckoutData} onNext={nextStep} />
              )}
              {currentStep === 3 && (
                <PaymentStep key="pay" data={checkoutData} setData={setCheckoutData} onNext={nextStep} onBack={prevStep} />
              )}
              {currentStep === 4 && (
                <ReviewStep 
                  key="rev" 
                  data={checkoutData} 
                  cartItems={cartItems} 
                  subtotal={subtotal} 
                  tax={tax} 
                  onBack={prevStep} 
                  onPlaceOrder={handlePlaceOrder} 
                  loading={loading} 
                />
              )}
            </AnimatePresence>
          </div>

          {/* Sidebar Summary */}
          <div className="lg:col-span-4">
            <div className="sticky top-32 bg-black text-white p-8 rounded-[40px]">
              <h3 className="text-xl font-black uppercase italic tracking-tighter mb-6">Summary</h3>
              <div className="space-y-2 mb-6 border-b border-zinc-800 pb-6">
                <div className="flex justify-between text-[10px] uppercase text-zinc-400">
                  <span>Subtotal</span><span>£{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[10px] uppercase text-zinc-400">
                  <span>Shipping</span><span>£{checkoutData.shippingCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[10px] uppercase text-zinc-400">
                  <span>Tax (8%)</span><span>£{tax.toFixed(2)}</span>
                </div>
              </div>
              <div className="flex justify-between items-end mb-6">
                <span className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Total</span>
                <span className="text-2xl font-black italic">£{total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;