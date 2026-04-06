'use client';

import { useState, Suspense } from 'react'; // Added Suspense
import { useSearchParams } from 'next/navigation';
import CategoryHero from "../components/CategoryHero";
import FiltersSidebar from "../components/FiltersSidebar";
import Navbar from "../components/Navbar";
import SortDropdown from "../components/SortDropDown";
import ProductGrid from "../components/ProductGrid";
import Footer from '../components/Footer';

// ✅ Internal component to handle the search logic
function CategoryContent() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('search') || "";

  const [filters, setFilters] = useState({
    brand: [],
    maxPrice: 5000,
    sort: 'popularity',
    category: ''   
  });

  const updateFilters = (key, value) => {
    setFilters(prev => ({ 
      ...prev, 
      [key]: value 
    }));
  };

  return (
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
            {searchQuery ? `Results for: "${searchQuery}"` : "Explore Collection"}
          </h2>
          <SortDropdown
            currentSort={filters.sort}
            onSortChange={(val) => updateFilters('sort', val)}
          />
        </div>

        {/* ✅ Pass everything to the grid */}
        <ProductGrid activeFilters={{ ...filters, search: searchQuery }} />
      </main>
    </div>
  );
}

// ✅ Main Export wrapped in Suspense (Required by Next.js for useSearchParams)
export default function Category() {
  return (
    <div className="bg-white min-h-screen">
      <Navbar />
      <CategoryHero />
      
      <Suspense fallback={
        <div className="flex justify-center py-20 text-zinc-400 font-black uppercase tracking-widest text-xs">
          Loading Vault...
        </div>
      }>
        <CategoryContent />
      </Suspense>

      <Footer />
    </div>
  );
}