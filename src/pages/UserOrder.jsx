import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const UserOrder = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isLoggedIn, isUser, getToken } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn || !isUser()) {
      navigate("/LoginPage");
      return;
    }

    const fetchOrders = async () => {
      try {
        const token = getToken();
        const response = await fetch(`${import.meta.env.VITE_APP_BASE_URL}/products/my-orders`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("Failed to fetch orders");

        const data = await response.json();
        setOrders(data.orders);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [isLoggedIn, isUser, navigate, getToken]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen pt-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-100 min-h-screen pt-20 flex justify-center items-center">
        <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md w-full">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Error loading orders</h2>
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen pt-24 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 flex-wrap gap-3">
          <h1 className="text-3xl font-bold text-gray-800">Your Orders</h1>
          <p className="text-gray-500">{orders.length} orders found</p>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <div className="text-6xl mb-4">📦</div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              You haven't placed any orders yet
            </h2>
            <button
              onClick={() => navigate("/")}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-lg shadow-md p-4 md:p-6 hover:shadow-lg transition"
              >
                <div className="flex flex-col md:flex-row gap-6">
                  {order.product && (
                    <div className="md:w-1/4 w-full">
                      <div className="w-full h-48 bg-gray-200 rounded-lg overflow-hidden">
                        <img
                          src={order.product.photoUrl || "/images/default-product.png"}
                          alt={order.product.name}
                          className="w-full h-full object-cover"
                          onError={(e) => (e.target.src = "/images/default-product.png")}
                        />
                      </div>
                    </div>
                  )}

                  {/* Order Details */}
                  <div className="flex-1">
                    <div className="flex flex-col md:flex-row justify-between md:items-center gap-3">
                      <div>
                        <h3 className="text-lg md:text-xl font-semibold text-gray-800">
                          {order.product?.name || "Product not available"}
                        </h3>
                        <p className="text-gray-600 text-sm md:text-base">
                          ₹{order.product?.price?.toLocaleString() || "N/A"}
                        </p>
                      </div>
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm self-start md:self-auto">
                        Ordered on {new Date(order.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="mt-4 space-y-2 text-sm md:text-base">
                      <p>
                        <span className="font-medium">Quantity:</span> {order.quantity}
                      </p>
                      <p>
                        <span className="font-medium">Total:</span> ₹
                        {(order.quantity * (order.product?.price || 0)).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserOrder;
