import React from 'react';
import { Trash2, Minus, Plus } from 'lucide-react';

const CartItem = ({ item, updateQuantity, removeFromCart }) => {
  return (
    <div className="flex items-center gap-4 p-4 bg-white border border-gray-100 rounded-xl shadow-sm mb-4">
      <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-lg bg-gray-50" />
      
      <div className="flex-grow">
        <h3 className="font-bold text-lg text-gray-900">{item.name}</h3>
        <p className="text-primary-600 font-bold">${Number(item.price).toFixed(2)}</p>
      </div>
      
      <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-1">
        <button 
          onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
          className="w-8 h-8 flex items-center justify-center bg-white rounded shadow-sm text-gray-600 hover:text-primary-600 hover:bg-primary-50 transition"
        >
          <Minus className="w-4 h-4" />
        </button>
        <span className="w-8 text-center font-medium">{item.quantity}</span>
        <button 
          onClick={() => updateQuantity(item.id, item.quantity + 1)}
          className="w-8 h-8 flex items-center justify-center bg-white rounded shadow-sm text-gray-600 hover:text-primary-600 hover:bg-primary-50 transition"
          disabled={item.quantity >= item.stock}
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
      
      <div className="text-right w-24">
        <p className="font-bold text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
      </div>
      
      <button 
        onClick={() => removeFromCart(item.id)}
        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition ml-2"
        title="Remove"
      >
        <Trash2 className="w-5 h-5" />
      </button>
    </div>
  );
};

export default CartItem;
