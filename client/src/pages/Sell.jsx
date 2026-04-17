import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Package } from 'lucide-react';

const Sell = () => {
  const { api } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [product, setProduct] = useState({
    name: '',
    price: '',
    description: '',
    image: '',
    category: '',
    stock: ''
  });

  const categories = ['Textbooks', 'Electronics', 'Stationery', 'Dorm Essentials', 'Snacks', 'Other'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if(!product.image) product.image = 'https://images.unsplash.com/photo-1491841573634-28fb1d3a7200?auto=format&fit=crop&q=80&w=800';
      
      const res = await api.post('/products', product);
      navigate(`/product/${res.data.productId}`);
    } catch (err) {
      setError('Error posting your product. Please check your inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-8 max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <div className="flex items-center gap-3 mb-8 border-b border-gray-100 pb-4">
          <div className="p-3 bg-primary-50 rounded-xl">
            <Package className="w-8 h-8 text-primary-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Sell Campus Items</h1>
            <p className="text-gray-500 text-sm">List your items on the campus marketplace for fellow students</p>
          </div>
        </div>

        {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 border border-red-100 font-medium">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Product Name</label>
              <input 
                type="text" 
                required 
                className="input-field bg-gray-50 text-lg" 
                placeholder="e.g. Physics Textbook 2024"
                value={product.name}
                onChange={e => setProduct({...product, name: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Price ($)</label>
              <input 
                type="number" 
                required 
                step="0.01"
                min="0"
                className="input-field bg-gray-50" 
                placeholder="29.99"
                value={product.price}
                onChange={e => setProduct({...product, price: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Stock Available</label>
              <input 
                type="number" 
                required 
                min="1"
                className="input-field bg-gray-50" 
                placeholder="10"
                value={product.stock}
                onChange={e => setProduct({...product, stock: e.target.value})}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select 
                required 
                className="input-field bg-gray-50 appearance-none cursor-pointer"
                value={product.category}
                onChange={e => setProduct({...product, category: e.target.value})}
              >
                <option value="" disabled>Select a category</option>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
              <input 
                type="url" 
                className="input-field bg-gray-50" 
                placeholder="https://images.unsplash.com/photo-..."
                value={product.image}
                onChange={e => setProduct({...product, image: e.target.value})}
              />
              <p className="text-xs text-gray-400 mt-2">Leave blank to use a default placeholder image.</p>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea 
                required 
                rows="4" 
                className="input-field bg-gray-50 resize-none" 
                placeholder="Describe your item condition, details, and why someone should buy it..."
                value={product.description}
                onChange={e => setProduct({...product, description: e.target.value})}
              ></textarea>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 flex justify-end">
             <button 
                type="submit" 
                disabled={loading}
                className="btn-primary py-3 px-8 text-lg font-bold"
              >
               {loading ? 'Publishing...' : 'List Product'}
             </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Sell;
