import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminOrder = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { isLoggedIn, isAdmin, getToken } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn || !isAdmin()) {
      navigate('/LoginPage');
      return;
    }

    const fetchAllOrders = async () => {
      try {
        const token = getToken();
        const response = await fetch(`${import.meta.env.VITE_APP_BASE_URL}/products/admin/all-orders`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Failed to fetch orders');
        setOrders(data.orders);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAllOrders();
  }, [isLoggedIn, isAdmin, navigate, getToken]);

  const filteredOrders = orders.filter(order => {
    const searchLower = searchTerm.toLowerCase();
    return (
      order.userId?.name?.toLowerCase().includes(searchLower) ||
      order.userId?.email?.toLowerCase().includes(searchLower) ||
      order.productId?.name?.toLowerCase().includes(searchLower) ||
      order._id.toLowerCase().includes(searchLower)
    );
  });

  const totalProducts = filteredOrders.reduce((sum, order) => sum + order.quantity, 0);
  const totalRevenue = filteredOrders.reduce(
    (sum, order) => sum + (order.quantity * (order.productId?.price || 0)),
    0
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-14 w-14 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50 text-center px-4">
        <h2 className="text-xl font-semibold text-red-600 mb-2">Error loading orders</h2>
        <p className="text-gray-500 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="bg-blue-600 text-white px-5 py-2 rounded-lg shadow hover:bg-blue-700 transition"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
<div className="bg-gray-50 min-h-screen py-8 px-4 pt-24">
  <div className="max-w-7xl mx-auto">
    {/* Header */}
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800">📦 Order Management</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full md:w-auto">
        <StatCard title="Total Orders" value={filteredOrders.length} color="blue" />
        <StatCard title="Total Products" value={totalProducts} color="green" />
        <StatCard title="Total Revenue" value={`₹${totalRevenue.toLocaleString()}`} color="purple" />
      </div>
    </div>

        {/* Search */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Search Orders</label>
          <div className="relative">
            <input
              type="text"
              placeholder="Search by customer, product, or order ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-2 text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Orders Table / Cards */}
        {filteredOrders.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow text-center">
            <p className="text-5xl mb-3">📭</p>
            <h2 className="text-lg font-semibold">{searchTerm ? 'No matching orders found' : 'No orders yet'}</h2>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    {['Order ID', 'Customer', 'Product', 'Qty', 'Total', 'Date'].map((h) => (
                      <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredOrders.map((order) => (
                    <tr key={order._id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 text-sm text-gray-500">{order._id.slice(0, 8)}...</td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium">{order.userId?.name || 'Unknown'}</p>
                        <p className="text-xs text-gray-500">{order.userId?.email || ''}</p>
                      </td>
                      <td className="px-6 py-4 flex items-center gap-3">
                        <img
                          className="h-10 w-10 rounded object-cover border"
                          src={order.productId?.photoUrl || '/images/default-product.png'}
                          alt={order.productId?.name}
                          onError={(e) => (e.target.src = '/images/default-product.png')}
                        />
                        <div>
                          <p className="text-sm font-medium">{order.productId?.name || 'N/A'}</p>
                          <p className="text-xs text-gray-500">₹{order.productId?.price?.toLocaleString() || 'N/A'}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm">{order.quantity}</td>
                      <td className="px-6 py-4 text-sm font-semibold">
                        ₹{(order.quantity * (order.productId?.price || 0)).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-xs text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString()}<br />
                        {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden p-4 space-y-4">
              {filteredOrders.map((order) => (
                <div key={order._id} className="border rounded-lg p-4 shadow-sm hover:shadow transition">
                  <div className="flex justify-between text-xs text-gray-500 mb-2">
                    <span>ID: {order._id.slice(0, 8)}...</span>
                    <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex gap-4">
                    <img
                      className="h-16 w-16 rounded object-cover border"
                      src={order.productId?.photoUrl || '/images/default-product.png'}
                      alt={order.productId?.name}
                      onError={(e) => (e.target.src = '/images/default-product.png')}
                    />
                    <div className="flex-1">
                      <p className="font-semibold">{order.productId?.name}</p>
                      <p className="text-sm text-gray-500">{order.userId?.name}</p>
                      <p className="mt-1 text-sm">Qty: {order.quantity} • ₹{(order.quantity * (order.productId?.price || 0)).toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

const StatCard = ({ title, value, color }) => {
  const colorClasses = {
    blue: 'text-blue-600',
    green: 'text-green-600',
    purple: 'text-purple-600'
  };
  return (
    <div className="bg-white p-3 rounded-lg shadow text-center">
      <p className="text-sm text-gray-500">{title}</p>
      <p className={`text-xl font-bold ${colorClasses[color]}`}>{value}</p>
    </div>
  );
};

export default AdminOrder;
