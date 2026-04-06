'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, Star, X } from 'lucide-react';

const FiltersSidebar = ({ onFilterChange, currentFilters = { brand: [], size: [], color: [] } }) => {
  const [price, setPrice] = useState(currentFilters.maxPrice || 1000);
  
  const BRANDS = ["Nike", "Adidas", "Puma", "New Balance", "Converse"];
  const SIZES = [7, 8, 9, 10, 11, 12];
  const COLORS = [
    { name: "Black", hex: "#000" },
    { name: "White", hex: "#fff" },
    { name: "Red", hex: "#ef4444" },
    { name: "Blue", hex: "#3b82f6" }
  ];

  const handleToggleFilter = (key, value) => {
    const currentValues = currentFilters[key] || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];
    
    onFilterChange(key, newValues);
  };

  // ✅ NEW: Reset function to clear sidebar selections
  const resetFilters = () => {
    onFilterChange('brand', []);
    onFilterChange('size', []);
    onFilterChange('color', []);
    onFilterChange('rating', null);
    onFilterChange('maxPrice', 1000);
    setPrice(1000);
  };

  return (
    <aside className="w-full lg:w-64 space-y-8 pl-6 pr-2 mr-auto border-r border-gray-50">
      
      {/* Header with Clear Button */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-4">
        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Filters</span>
        <button 
          onClick={resetFilters}
          className="text-[9px] font-bold uppercase text-zinc-400 hover:text-red-600 transition-colors flex items-center gap-1"
        >
          <X size={10} /> Clear All
        </button>
      </div>

      {/* 1. Availability */}
      <div className="flex items-center justify-between py-2">
        <span className="text-xs font-black uppercase tracking-widest">In Stock Only</span>
        <input 
          type="checkbox" 
          className="w-4 h-4 accent-black cursor-pointer" 
          checked={currentFilters.available === true}
          onChange={(e) => onFilterChange('available', e.target.checked)} 
        />
      </div>

      {/* 2. Brand Filter */}
      <FilterGroup title="Brand">
        <div className="space-y-2 mt-3">
          {BRANDS.map(brand => (
            <label key={brand} className="flex items-center gap-3 text-xs font-medium text-gray-500 cursor-pointer hover:text-black">
              <input 
                type="checkbox" 
                className="accent-black" 
                checked={currentFilters.brand?.includes(brand)}
                onChange={() => handleToggleFilter('brand', brand)} 
              />
              {brand}
            </label>
          ))}
        </div>
      </FilterGroup>

      {/* 3. Price Range */}
      <FilterGroup title="Price Range">
        <div className="mt-4">
          <input 
            type="range" min="0" max="1000" step="10" value={price}
            onChange={(e) => { 
              const val = e.target.value;
              setPrice(val); 
              onFilterChange('maxPrice', val); 
            }}
            className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black"
          />
          <div className="flex justify-between mt-2 text-[10px] font-bold text-gray-400">
            <span>$0</span>
            <span>Up to ${price}</span>
          </div>
        </div>
      </FilterGroup>

      {/* 4. Shoe Size */}
      <FilterGroup title="Size">
        <div className="grid grid-cols-3 gap-2 mt-3">
          {SIZES.map(size => {
            const isActive = currentFilters.size?.includes(size);
            return (
              <button 
                key={size}
                type="button"
                onClick={() => handleToggleFilter('size', size)}
                className={`border py-2 text-[10px] font-bold transition-all rounded-md ${
                  isActive ? 'bg-black text-white border-black' : 'border-gray-100 hover:bg-gray-50'
                }`}
              >
                {size}
              </button>
            );
          })}
        </div>
      </FilterGroup>

      {/* 5. Color Filter */}
      <FilterGroup title="Color">
        <div className="flex flex-wrap gap-3 mt-3">
          {COLORS.map(color => {
            const isActive = currentFilters.color?.includes(color.name);
            return (
              <button 
                key={color.name}
                type="button"
                onClick={() => handleToggleFilter('color', color.name)}
                className={`w-6 h-6 rounded-full border transition-transform hover:scale-110 ${
                  isActive ? 'ring-2 ring-black ring-offset-2 border-transparent' : 'border-gray-200'
                }`}
                style={{ backgroundColor: color.hex }}
                title={color.name}
              />
            );
          })}
        </div>
      </FilterGroup>

      {/* 6. Rating */}
      <FilterGroup title="Rating">
        <div className="space-y-2 mt-3">
          {[4, 3, 2].map(num => (
            <button 
              key={num} 
              type="button"
              onClick={() => onFilterChange('rating', num)} 
              className={`flex items-center gap-1 transition-colors ${
                currentFilters.rating === num ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-500'
              }`}
            >
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={12} fill={i < num ? "currentColor" : "none"} />
              ))}
              <span className="text-[10px] font-bold ml-1">& Up</span>
            </button>
          ))}
        </div>
      </FilterGroup>
    </aside>
  );
};

const FilterGroup = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div className="border-b border-gray-100 pb-6">
      <button onClick={() => setIsOpen(!isOpen)} className="w-full flex justify-between items-center group py-2">
        <span className="text-xs font-black uppercase tracking-widest group-hover:text-blue-600 transition-colors">{title}</span>
        <ChevronDown size={14} className={`transition-transform duration-300 ${isOpen ? '' : '-rotate-90'}`} />
      </button>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }} 
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="overflow-hidden"
        >
          {children}
        </motion.div>
      )}
    </div>
  );
};

export default FiltersSidebar;