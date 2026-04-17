import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { LayoutDashboard, Users, Package, ShoppingBag, Plus } from 'lucide-react';

const AdminDashboard = () => {
  const { api } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('products');
  
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  
  // Product Form state
  const [showProductForm, setShowProductForm] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '', price: '', description: '', image: '', category: '', stock: ''
  });

  const fetchData = async () => {
    try {
      const pRes = await api.get('/products'); // Public works
      setProducts(pRes.data);
      const uRes = await api.get('/admin/users');
      setUsers(uRes.data);
      const oRes = await api.get('/admin/orders');
      setOrders(oRes.data);
    } catch (e) { console.error("Error fetching admin data", e); }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      if(!newProduct.image) newProduct.image = 'https://via.placeholder.com/400x400?text=Product';
      await api.post('/admin/products', newProduct);
      setShowProductForm(false);
      setNewProduct({name: '', price: '', description: '', image: '', category: '', stock: ''});
      fetchData();
    } catch (e) {
      alert("Error adding product");
    }
  };

  const handleDeleteProduct = async (id) => {
    if(window.confirm('Are you sure?')) {
      try {
        await api.delete(`/admin/products/${id}`);
        fetchData();
      } catch(e) { alert("Error deleting"); }
    }
  };

  const updateOrderStatus = async (id, status) => {
    try {
      await api.put(`/admin/orders/${id}/status`, { status });
      fetchData();
    } catch(e) { alert("Error updating status"); }
  };

  return (
    <div className="py-4 flex flex-col md:flex-row gap-8">
      {/* Sidebar */}
      <div className="w-full md:w-64 shrink-0">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sticky top-24">
          <h2 className="text-lg font-bold text-gray-900 mb-4 px-2 flex items-center gap-2">
            <LayoutDashboard className="text-primary-600" /> Admin
          </h2>
          <div className="space-y-1">
            <button 
              onClick={() => setActiveTab('products')} 
              className={`w-full text-left px-4 py-3 rounded-lg font-medium flex items-center gap-3 transition ${activeTab === 'products' ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <Package className="w-5 h-5" /> Products ({products.length})
            </button>
            <button 
              onClick={() => setActiveTab('orders')} 
              className={`w-full text-left px-4 py-3 rounded-lg font-medium flex items-center gap-3 transition ${activeTab === 'orders' ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <ShoppingBag className="w-5 h-5" /> Orders ({orders.length})
            </button>
            <button 
              onClick={() => setActiveTab('users')} 
              className={`w-full text-left px-4 py-3 rounded-lg font-medium flex items-center gap-3 transition ${activeTab === 'users' ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <Users className="w-5 h-5" /> Users ({users.length})
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
        
        {/* Products Tab */}
        {activeTab === 'products' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Manage Products</h2>
              <button 
                onClick={() => setShowProductForm(!showProductForm)}
                className="btn-primary flex items-center gap-2 text-sm"
              >
                <Plus className="w-4 h-4"/> Add Product
              </button>
            </div>

            {showProductForm && (
              <form onSubmit={handleAddProduct} className="mb-8 p-6 bg-gray-50 rounded-xl border border-gray-200">
                <h3 className="font-bold mb-4">New Product Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <input type="text" placeholder="Name" required className="input-field" value={newProduct.name} onChange={e=>setNewProduct({...newProduct, name: e.target.value})}/>
                  <input type="number" placeholder="Price" step="0.01" required className="input-field" value={newProduct.price} onChange={e=>setNewProduct({...newProduct, price: e.target.value})}/>
                  <input type="text" placeholder="Category" required className="input-field" value={newProduct.category} onChange={e=>setNewProduct({...newProduct, category: e.target.value})}/>
                  <input type="number" placeholder="Stock" required className="input-field" value={newProduct.stock} onChange={e=>setNewProduct({...newProduct, stock: e.target.value})}/>
                  <input type="text" placeholder="Image URL (optional)" className="input-field md:col-span-2" value={newProduct.image} onChange={e=>setNewProduct({...newProduct, image: e.target.value})}/>
                  <textarea placeholder="Description" required className="input-field md:col-span-2 h-24" value={newProduct.description} onChange={e=>setNewProduct({...newProduct, description: e.target.value})}></textarea>
                </div>
                <div className="flex gap-2 justify-end">
                  <button type="button" onClick={() => setShowProductForm(false)} className="btn-secondary">Cancel</button>
                  <button type="submit" className="btn-primary">Save Product</button>
                </div>
              </form>
            )}

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-gray-500 text-sm">
                  <tr>
                    <th className="p-3 rounded-tl-lg">ID</th>
                    <th className="p-3">Product</th>
                    <th className="p-3">Price</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Stock</th>
                    <th className="p-3 rounded-tr-lg">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(p => (
                    <tr key={p.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50/50">
                      <td className="p-3 text-gray-500">#{p.id}</td>
                      <td className="p-3 font-medium flex items-center gap-3">
                        <img src={p.image} className="w-10 h-10 object-cover rounded bg-gray-100"/>
                        {p.name}
                      </td>
                      <td className="p-3 text-primary-600 font-bold">${Number(p.price).toFixed(2)}</td>
                      <td className="p-3">{p.category}</td>
                      <td className="p-3 font-medium">{p.stock}</td>
                      <td className="p-3">
                        <button onClick={() => handleDeleteProduct(p.id)} className="text-red-500 hover:bg-red-50 px-2 py-1 rounded transition text-sm font-medium">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Manage Orders</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                 <thead className="bg-gray-50 text-gray-500 text-sm">
                  <tr>
                    <th className="p-3 rounded-tl-lg">Order ID</th>
                    <th className="p-3">Customer</th>
                    <th className="p-3">Date</th>
                    <th className="p-3">Amount</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 rounded-tr-lg">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(o => (
                    <tr key={o.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50/50">
                      <td className="p-3 font-bold text-gray-600">#{o.id}</td>
                      <td className="p-3 font-medium">{o.user_name} <br/><span className="text-xs text-gray-400 font-normal">{o.user_email}</span></td>
                      <td className="p-3 text-sm">{new Date(o.created_at).toLocaleDateString()}</td>
                      <td className="p-3 font-bold text-primary-600">${Number(o.total_amount).toFixed(2)}</td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                          o.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                          o.status === 'processing' ? 'bg-blue-100 text-blue-700' :
                          o.status === 'completed' ? 'bg-green-100 text-green-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {o.status}
                        </span>
                      </td>
                      <td className="p-3">
                        <select 
                          value={o.status} 
                          onChange={(e) => updateOrderStatus(o.id, e.target.value)}
                          className="bg-white border border-gray-200 rounded px-2 py-1 text-sm focus:outline-none"
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Registered Users</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                 <thead className="bg-gray-50 text-gray-500 text-sm">
                  <tr>
                    <th className="p-3 rounded-tl-lg">ID</th>
                    <th className="p-3">Name</th>
                    <th className="p-3">Email</th>
                    <th className="p-3">Role</th>
                    <th className="p-3 rounded-tr-lg">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50/50">
                      <td className="p-3 text-gray-500">#{u.id}</td>
                      <td className="p-3 font-bold">{u.name}</td>
                      <td className="p-3 text-gray-600">{u.email}</td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'}`}>{u.role}</span>
                      </td>
                      <td className="p-3 text-gray-500">{new Date(u.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminDashboard;
