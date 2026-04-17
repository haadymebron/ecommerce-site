import React, { createContext, useState, useEffect, useContext } from 'react';
import { AuthContext } from './AuthContext';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const { user, api } = useContext(AuthContext);

  const fetchCart = async () => {
    if (!user) {
      setCartItems([]);
      return;
    }
    try {
      const res = await api.get('/cart');
      setCartItems(res.data);
    } catch (error) {
      console.error("Error fetching cart", error);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [user]);

  const addToCart = async (productId, quantity = 1) => {
    if (!user) return alert("Please log in to add items to cart.");
    try {
      await api.post('/cart', { productId, quantity });
      fetchCart();
    } catch (error) {
      console.error("Error adding to cart", error);
    }
  };

  const updateQuantity = async (id, quantity) => {
    try {
      await api.put(`/cart/${id}`, { quantity });
      fetchCart();
    } catch (error) {
      console.error("Error updating cart", error);
    }
  };

  const removeFromCart = async (id) => {
    try {
      await api.delete(`/cart/${id}`);
      fetchCart();
    } catch (error) {
      console.error("Error removing from cart", error);
    }
  };

  const clearCartState = () => setCartItems([]);

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  return (
    <CartContext.Provider value={{ cartItems, fetchCart, addToCart, updateQuantity, removeFromCart, getCartTotal, clearCartState }}>
      {children}
    </CartContext.Provider>
  );
};
