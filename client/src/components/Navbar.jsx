import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, LogOut, GraduationCap } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { cartItems } = useContext(CartContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b border-gray-100 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-indigo-500 bg-clip-text text-transparent flex items-center gap-2">
          <GraduationCap className="text-primary-600" /> CampusMarket
        </Link>
        
        <div className="flex items-center gap-6">
          <Link to="/" className="text-gray-600 hover:text-primary-600 font-medium transition">Shop</Link>
          
          {user ? (
            <>
              {user.role === 'admin' && (
                <Link to="/admin" className="text-gray-600 hover:text-primary-600 font-medium transition">Admin</Link>
              )}
              <Link to="/sell" className="text-gray-600 hover:text-primary-600 font-medium transition">Sell</Link>
              <Link to="/orders" className="text-gray-600 hover:text-primary-600 font-medium transition">Orders</Link>
              <Link to="/cart" className="relative text-gray-600 hover:text-primary-600 transition">
                <ShoppingCart className="w-6 h-6" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-bold">
                    {cartCount}
                  </span>
                )}
              </Link>
              <div className="flex items-center gap-4 pl-4 border-l border-gray-200">
                <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <User className="w-4 h-4" /> {user.name}
                </span>
                <button onClick={handleLogout} className="text-gray-500 hover:text-red-500 transition">
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-4">
              <Link to="/login" className="text-gray-600 hover:text-primary-600 font-medium transition">Log In</Link>
              <Link to="/register" className="btn-primary">Sign Up</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
