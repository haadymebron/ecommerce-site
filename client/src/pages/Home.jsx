import React, { useState, useEffect, useContext } from 'react';
import { Search, Loader } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      let url = `${API_URL}/products?`;
      if (search) url += `search=${search}&`;
      if (category) url += `category=${category}`;
      
      const res = await axios.get(url);
      setProducts(res.data);
    } catch (error) {
      console.error("Error fetching products", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Debounce search
    const delayDebounceFn = setTimeout(() => {
      fetchProducts();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [search, category]);

  const categories = ['', 'Textbooks', 'Electronics', 'Stationery', 'Dorm Essentials', 'Snacks', 'Other'];

  return (
    <div className="py-4">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary-700 to-indigo-900 rounded-2xl p-8 md:p-16 mb-12 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4 leading-tight">Your Campus Hub</h1>
          <p className="text-lg md:text-xl text-primary-100 mb-8 opacity-90">Get all your college essentials delivered straight to your classroom or dorm.</p>
          <button className="bg-white text-primary-900 px-8 py-3 rounded-full font-bold hover:bg-primary-100 transition duration-300 shadow-lg">Shop Essentials</button>
        </div>
        <div className="absolute top-0 right-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center opacity-40 mix-blend-overlay"></div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Featured Products</h2>
        
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <input 
              type="text" 
              placeholder="Search products..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 bg-gray-50 transition"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
          </div>
          
          <select 
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full md:w-48 px-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 bg-gray-50 transition appearance-none cursor-pointer"
          >
            <option value="">All Categories</option>
            {categories.filter(c => c).map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader className="w-10 h-10 text-primary-600 animate-spin" />
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <p className="text-xl mb-2">No products found.</p>
          <p>Try adjusting your search or category filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
