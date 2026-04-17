import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { CreditCard, CheckCircle } from 'lucide-react';

const Checkout = () => {
  const { cartItems, getCartTotal, clearCartState } = useContext(CartContext);
  const { api } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [orderId, setOrderId] = useState(null);

  const shipping = 10;
  const tax = getCartTotal() * 0.08;
  const total = getCartTotal() + shipping + tax;

  const handleCheckout = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const items = cartItems.map(i => ({ 
        product_id: i.product_id, 
        quantity: i.quantity, 
        price: i.price 
      }));
      
      const res = await api.post('/orders', {
        items,
        totalAmount: total
      });
      
      setSuccess(true);
      setOrderId(res.data.orderId);
      clearCartState();
    } catch (error) {
      console.error(error);
      alert('Checkout failed');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-8 bg-white rounded-2xl shadow-sm border border-gray-100 max-w-2xl mx-auto my-12">
        <CheckCircle className="w-24 h-24 text-green-500 mb-6" />
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Payment Successful!</h2>
        <p className="text-gray-600 mb-2">Thank you for your purchase.</p>
        <p className="text-gray-600 mb-8">Your order ID is <strong>#{orderId}</strong></p>
        <div className="flex gap-4">
          <button onClick={() => navigate('/orders')} className="btn-secondary">View Orders</button>
          <button onClick={() => navigate('/')} className="btn-primary">Continue Shopping</button>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="py-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <form className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
            <h2 className="text-xl font-bold mb-4">Shipping Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-700 mb-1">First Name</label>
                <input type="text" className="input-field" required />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Last Name</label>
                <input type="text" className="input-field" required />
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">Address</label>
              <input type="text" className="input-field" required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-700 mb-1">City</label>
                <input type="text" className="input-field" required />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Zip Code</label>
                <input type="text" className="input-field" required />
              </div>
            </div>
            
            <h2 className="text-xl font-bold mt-8 mb-4">Payment Details</h2>
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg text-gray-500 mb-4 flex items-center gap-3">
              <CreditCard className="w-5 h-5 text-gray-400" />
              <span className="text-sm">This is a demo. No real card required.</span>
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">Card Number (Dummy)</label>
              <input type="text" placeholder="XXXX-XXXX-XXXX-XXXX" className="input-field" required />
            </div>
          </form>
        </div>
        
        <div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2">
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border border-gray-100">
                  <div className="flex items-center gap-3">
                    <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded" />
                    <div>
                      <p className="font-medium text-sm text-gray-900">{item.name}</p>
                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <p className="font-bold text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
            
            <div className="border-t border-gray-100 pt-4 space-y-2 mb-6">
               <div className="flex justify-between text-gray-600 text-sm">
                <span>Subtotal</span>
                <span>${getCartTotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600 text-sm">
                <span>Shipping Estimate</span>
                <span>${shipping.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600 text-sm">
                <span>Tax Estimate (8%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="border-t border-gray-100 pt-3 flex justify-between items-center">
                <span className="text-lg font-bold text-gray-900">Total</span>
                <span className="text-2xl font-black text-primary-600">${total.toFixed(2)}</span>
              </div>
            </div>
            
            <button 
              onClick={handleCheckout}
              disabled={loading}
              className="w-full btn-primary py-4 text-lg"
            >
               {loading ? 'Processing...' : `Pay $${total.toFixed(2)}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
