'use client';
import { useState, useEffect } from 'react';
import { Trash2, Edit, Package, RefreshCcw, AlertCircle } from 'lucide-react';

// ✅ Added 'onEdit' to the props
export default function AdminProductList({ onEdit }) {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

    const fetchItems = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/api/products?limit=100`);
            const data = await res.json();
            if (data.success) setProducts(data.products);
        } catch (err) {
            console.error("Error fetching admin products", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchItems(); }, []);

    const handleDelete = async (id) => {
        if (!confirm("Permanently delete this product from the database?")) return;
        const token = localStorage.getItem('shoeStoreToken');
        
        try {
            const res = await fetch(`${API_URL}/api/products/${id}`, { 
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (res.ok) {
                setProducts(products.filter(p => p._id !== id));
            } else {
                const errorData = await res.json();
                alert(`Delete failed: ${errorData.message || 'Unauthorized'}`);
            }
        } catch (err) {
            console.error("Delete error:", err);
            alert("Connection error. Check backend.");
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center p-20 space-y-4">
            <RefreshCcw className="animate-spin text-zinc-300" size={32} />
            <div className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">Syncing Warehouse...</div>
        </div>
    );

    return (
        <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50/50 border-b border-gray-100">
                        <tr>
                            <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Product</th>
                            <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Category</th>
                            <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Price</th>
                            <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Stock Status</th>
                            <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {products.length > 0 ? products.map((product) => (
                            <tr key={product._id} className="hover:bg-gray-50/30 transition-colors group">
                                <td className="p-6">
                                    <div className="flex items-center gap-4">
                                        <div className="relative w-14 h-14 bg-gray-100 rounded-2xl overflow-hidden border border-gray-100">
                                            {product.images && product.images[0] ? (
                                                <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-300"><Package size={20} /></div>
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-black text-xs uppercase tracking-tight">{product.name}</p>
                                            <p className="text-[9px] text-gray-400 uppercase font-black tracking-widest">{product.brand}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-6">
                                    <span className="text-[9px] font-black uppercase px-2.5 py-1 bg-zinc-100 text-zinc-500 rounded-lg">{product.category}</span>
                                </td>
                                <td className="p-6 font-black italic text-sm text-zinc-900">${product.newPrice}</td>
                                <td className="p-6">
                                    <div className="flex flex-col gap-1">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-1.5 h-1.5 rounded-full ${product.stockLeft < 10 ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`} />
                                            <span className={`text-[10px] font-black uppercase ${product.stockLeft < 10 ? 'text-red-500' : 'text-zinc-600'}`}>
                                                {product.stockLeft} Units Left
                                            </span>
                                        </div>
                                        <div className="w-24 h-1 bg-gray-100 rounded-full overflow-hidden">
                                            <div 
                                                className={`h-full transition-all duration-1000 ${product.stockLeft < 10 ? 'bg-red-500' : 'bg-black'}`} 
                                                style={{ width: `${Math.min((product.stockLeft / (product.totalStock || 100)) * 100, 100)}%` }}
                                            />
                                        </div>
                                    </div>
                                </td>
                                <td className="p-6 text-right">
                                    <div className="flex justify-end gap-1">
                                        {/* ✅ CHANGED: Now calls onEdit(product) instead of router.push */}
                                        <button 
                                            onClick={() => onEdit(product)}
                                            className="p-2.5 text-zinc-400 hover:text-black hover:bg-zinc-100 rounded-xl transition-all"
                                        >
                                            <Edit size={16} />
                                        </button>

                                        <button 
                                            onClick={() => handleDelete(product._id)}
                                            className="p-2.5 text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="5" className="p-20 text-center">
                                    <div className="flex flex-col items-center gap-2 text-zinc-300">
                                        <AlertCircle size={40} strokeWidth={1} />
                                        <p className="text-[10px] font-black uppercase tracking-widest">No Inventory Records Found</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            
            <button 
                onClick={fetchItems}
                disabled={loading}
                className="w-full p-5 bg-zinc-50 text-[9px] font-black uppercase tracking-[0.4em] text-zinc-400 hover:text-black hover:bg-zinc-100 transition-all flex items-center justify-center gap-3 border-t border-gray-100 disabled:opacity-50"
            >
                <RefreshCcw size={12} className={loading ? "animate-spin" : ""} /> 
                {loading ? "Re-Indexing..." : "Force Refresh Inventory"}
            </button>
        </div>
    );
}