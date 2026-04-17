import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Package, Calendar, DollarSign } from 'lucide-react';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { api } = useContext(AuthContext);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get('/orders');
        setOrders(res.data);
      } catch (error) {
        console.error("Failed to fetch orders", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return <div>Loading orders...</div>;

  return (
    <div className="py-8 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
        <Package className="text-primary-600 w-8 h-8" /> Order History
      </h1>

      {orders.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-2xl border border-gray-100 shadow-sm">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 p-2">No orders found</h2>
          <p className="text-gray-500">You haven't placed any orders yet.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-6 text-sm">
                  <div>
                    <p className="text-gray-500 font-medium">ORDER PLACED</p>
                    <p className="text-gray-900 font-bold flex items-center gap-1">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      {new Date(order.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 font-medium">TOTAL</p>
                    <p className="text-gray-900 font-bold flex items-center gap-1">
                      <DollarSign className="w-4 h-4 text-gray-400" />
                      {Number(order.total_amount).toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 font-medium">ORDER #</p>
                    <p className="text-gray-900 font-bold text-primary-600">{order.id}</p>
                  </div>
                </div>
                
                <div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                    order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                    order.status === 'processing' ? 'bg-blue-100 text-blue-700' :
                    order.status === 'completed' ? 'bg-green-100 text-green-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="font-bold text-gray-900 mb-4">Items in Order</h3>
                <div className="space-y-4">
                  {order.items?.map((item, index) => (
                    <div key={index} className="flex items-center gap-4 border-b border-gray-50 pb-4 last:border-0 last:pb-0">
                      <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded bg-gray-50 border border-gray-100" />
                      <div className="flex-grow">
                        <Link to={`/product/${item.product_id}`} className="font-bold text-gray-900 hover:text-primary-600 transition">
                          {item.name}
                        </Link>
                        <p className="text-sm text-gray-500 mt-1">Price: ${Number(item.price).toFixed(2)}</p>
                        <p className="text-sm text-gray-500 font-medium">Qty: {item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
