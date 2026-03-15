'use client';
import React from 'react';
import { ChevronDown } from 'lucide-react';

const SortDropdown = ({ onSortChange, currentSort }) => {
  const options = [
    { label: 'Popularity', value: 'popularity' },
    { label: 'Newest', value: 'newest' },
    { label: 'Price: Low to High', value: 'price_asc' },
    { label: 'Price: High to Low', value: 'price_desc' },
    { label: 'Best Rated', value: 'rating' },
  ];

  return (
    <div className="relative inline-block text-left group">
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
          Sort By
        </span>
        <select
          value={currentSort}
          onChange={(e) => onSortChange(e.target.value)}
          className="appearance-none bg-transparent pr-8 py-1 text-xs font-bold uppercase tracking-tighter border-none focus:ring-0 cursor-pointer outline-none"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value} className="text-black">
              {option.label}
            </option>
          ))}
        </select>
        {/* Decorative arrow since we disabled appearance */}
        <div className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2">
          <ChevronDown size={12} className="text-gray-400" />
        </div>
      </div>
    </div>
  );
};

export default SortDropdown;