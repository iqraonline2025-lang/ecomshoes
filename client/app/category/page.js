'use client';

import { useState } from 'react';
import CategoryHero from "../components/CategoryHero";
import FiltersSidebar from "../components/FiltersSidebar";
import Navbar from "../components/Navbar";
import SortDropdown from "../components/SortDropDown";
import ProductGrid from "../components/ProductGrid";
import Footer from '../components/Footer';

export default function Category() {
  const [filters, setFilters] = useState({
    brand: [],
    maxPrice: 5000, // Bumped this up so new expensive items show
    sort: 'popularity',
    category: ''   // Added this to sync with your Admin category dropdown
  });

  const updateFilters = (key, value) => {
    setFilters(prev => ({ 
      ...prev, 
      [key]: value 
    }));
  };

  return (
    <div className="bg-white min-h-screen">
      <Navbar />
      <CategoryHero />
      
      <div className="max-w-7xl mx-auto px-4 flex flex-col lg:flex-row gap-8 mt-10 pb-20">
        <aside className="w-full lg:w-64">
          <FiltersSidebar 
            currentFilters={filters} 
            onFilterChange={updateFilters} 
          />
        </aside>

        <main className="flex-1">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-bold uppercase italic tracking-tighter text-black">
              Explore Collection
            </h2>
            <SortDropdown
              currentSort={filters.sort}
              onSortChange={(val) => updateFilters('sort', val)}
            />
          </div>

          {/* Check: Does your ProductGrid use the prop 'activeFilters' 
             or 'filters'? Ensure they match! 
          */}
          <ProductGrid activeFilters={filters} />
          <Footer />
          
        </main>
      </div>
    </div>
  );
}