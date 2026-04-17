import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { ShoppingCart, ArrowLeft, Loader, CheckCircle } from 'lucide-react';
import { CartContext } from '../context/CartContext';

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        const res = await axios.get(`${API_URL}/products/${id}`);
        setProduct(res.data);
      } catch (err) {
        setError('Product not found');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    addToCart(product.id, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) return <div className="flex justify-center items-center h-[50vh]"><Loader className="w-12 h-12 text-primary-600 animate-spin" /></div>;
  if (error) return <div className="text-center text-red-500 font-bold text-xl h-[50vh] flex justify-center items-center">{error}</div>;
  if (!product) return null;

  return (
    <div className="py-8">
      <Link to="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-primary-600 mb-8 font-medium transition">
        <ArrowLeft className="w-4 h-4" /> Back to Products
      </Link>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {/* Product Image */}
          <div className="w-full md:w-1/2 bg-gray-50 p-8 flex items-center justify-center">
            <img 
              src={product.image} 
              alt={product.name} 
              className="max-w-full h-auto object-contain max-h-[500px] hover:scale-105 transition duration-500" 
              onError={(e) => { e.target.src = 'https://via.placeholder.com/500x500?text=No+Image'; }}
            />
          </div>

          {/* Product Info */}
          <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
            <div className="mb-2">
              <span className="text-primary-600 font-bold tracking-wider uppercase text-sm bg-primary-50 px-3 py-1 rounded-full">{product.category}</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-4">{product.name}</h1>
            <p className="text-4xl font-black text-gray-900 mb-6">${Number(product.price).toFixed(2)}</p>
            
            <p className="text-gray-600 text-lg mb-8 leading-relaxed">
              {product.description}
            </p>

            <div className="mb-8">
              <p className="font-medium text-gray-700 mb-2">Status:</p>
              {product.stock > 0 ? (
                <span className="inline-flex items-center gap-1.5 text-green-600 font-bold bg-green-50 px-3 py-1 rounded-full text-sm">
                   <div className="w-2 h-2 rounded-full bg-green-500"></div> In Stock ({product.stock} available)
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-red-600 font-bold bg-red-50 px-3 py-1 rounded-full text-sm">
                   <div className="w-2 h-2 rounded-full bg-red-500"></div> Out of Stock
                </span>
              )}
            </div>

            {product.stock > 0 && (
              <div className="flex flex-col sm:flex-row gap-4 items-center mt-auto">
                <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden h-12">
                  <button 
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    className="px-4 py-2 bg-gray-50 hover:bg-gray-100 font-bold text-gray-600 transition"
                  >-</button>
                  <input 
                    type="number" 
                    value={qty} 
                    readOnly 
                    className="w-16 text-center font-bold focus:outline-none bg-white py-2"
                  />
                  <button 
                    onClick={() => setQty(Math.min(product.stock, qty + 1))}
                    className="px-4 py-2 bg-gray-50 hover:bg-gray-100 font-bold text-gray-600 transition"
                  >+</button>
                </div>

                <button 
                  onClick={handleAddToCart}
                  className={`flex-1 h-12 flex items-center justify-center gap-2 rounded-lg font-bold text-lg transition duration-300 ${
                    added ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-primary-600 hover:bg-primary-700 text-white'
                  }`}
                >
                  {added ? (
                    <><CheckCircle className="w-5 h-5" /> Added to Cart</>
                  ) : (
                    <><ShoppingCart className="w-5 h-5" /> Add to Cart</>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
