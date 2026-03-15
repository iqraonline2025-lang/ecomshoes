'use client';
import React from 'react';
import { motion } from 'framer-motion'; // You'll need to run: npm install framer-motion
import { Truck, RotateCcw, ShieldCheck, CheckCircle } from 'lucide-react';

const FEATURES = [
  {
    id: 1,
    title: "Free Shipping",
    desc: "On all orders over $150",
    icon: <Truck size={32} strokeWidth={1.5} />,
  },
  {
    id: 2,
    title: "Easy Returns",
    desc: "30-day return policy",
    icon: <RotateCcw size={32} strokeWidth={1.5} />,
  },
  {
    id: 3,
    title: "Secure Payments",
    desc: "100% protected checkout",
    icon: <ShieldCheck size={32} strokeWidth={1.5} />,
  },
  {
    id: 4,
    title: "Quality Guarantee",
    desc: "Certified authentic shoes",
    icon: <CheckCircle size={32} strokeWidth={1.5} />,
  },
];

// Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2, // Items pop in one after another
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { type: 'spring', stiffness: 100 } 
  },
};

const WhyChooseUs = () => {
  return (
    <section className="py-24 px-6 bg-white overflow-hidden">
      <motion.div 
        className="max-w-[1000px] mx-auto"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible" // Starts animation when the user scrolls to it
        viewport={{ once: true, amount: 0.3 }}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          {FEATURES.map((item) => (
            <motion.div 
              key={item.id} 
              variants={itemVariants}
              whileHover={{ y: -10 }} // Lifts the card up on hover
              className="group relative flex flex-col items-center text-center p-8 rounded-3xl transition-colors duration-500 hover:bg-gray-50/80"
            >
              {/* Animated Icon Glow */}
              <div className="relative z-10 text-black mb-6 transition-transform duration-500 group-hover:scale-110">
                <div className="absolute inset-0 bg-red-100 rounded-full scale-0 group-hover:scale-150 transition-transform duration-500 opacity-0 group-hover:opacity-40 blur-xl" />
                <div className="relative">
                    {item.icon}
                </div>
              </div>

              <h3 className="relative z-10 text-sm font-black uppercase tracking-widest mb-3">
                {item.title}
              </h3>
              
              <p className="relative z-10 text-xs text-gray-400 font-medium leading-relaxed group-hover:text-gray-600 transition-colors">
                {item.desc}
              </p>

              {/* Decorative background border that appears on hover */}
              <div className="absolute inset-0 border border-transparent group-hover:border-gray-100 rounded-3xl transition-all duration-500" />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default WhyChooseUs;