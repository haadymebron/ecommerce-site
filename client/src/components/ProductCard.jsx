import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { CartContext } from '../context/CartContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useContext(CartContext);

  return (
    <div className="card group flex flex-col h-full">
      <div className="relative overflow-hidden aspect-square flex items-center justify-center bg-gray-100 object-cover">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
          onError={(e) => { e.target.src = 'https://via.placeholder.com/400x400?text=No+Image'; }}
        />
        <div className="absolute top-2 right-2 bg-white/90 px-2 py-1 rounded text-xs font-bold text-gray-700 shadow-sm backdrop-blur-sm">
          {product.category}
        </div>
      </div>
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <Link to={`/product/${product.id}`} className="text-lg font-bold text-gray-900 group-hover:text-primary-600 transition line-clamp-1">
            {product.name}
          </Link>
          <span className="text-lg font-extrabold text-primary-600 bg-primary-50 px-2 py-1 rounded-md ml-2 flex-shrink-0">
            ${Number(product.price).toFixed(2)}
          </span>
        </div>
        {product.seller_name && (
          <p className="text-xs font-medium text-pink-600 mb-2 bg-pink-50 px-2 py-0.5 rounded inline-block w-fit">
            Sold by {product.seller_name}
          </p>
        )}
        <p className="text-gray-500 text-sm mb-4 line-clamp-2 flex-grow">{product.description}</p>
        
        <button 
          onClick={() => addToCart(product.id, 1)}
          disabled={product.stock === 0}
          className="w-full mt-auto bg-gray-900 text-white flex items-center justify-center gap-2 py-2.5 rounded-lg hover:bg-primary-600 transition duration-300 font-medium disabled:opacity-50 disabled:hover:bg-gray-900"
        >
          <ShoppingCart className="w-4 h-4" />
          {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
