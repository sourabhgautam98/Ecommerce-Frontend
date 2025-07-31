import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";

const CartPage = () => {
  const navigate = useNavigate();
  const { user, isLoggedIn, isUser, getToken } = useAuth();
  const { getCurrentUserCart, removeFromCart, updateQuantity, clearCart } =
    useCart();

  const cartItems = isLoggedIn ? getCurrentUserCart(user._id) : [];

  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const shipping = subtotal > 0 ? 0 : 0;
  const total = subtotal + shipping;

  const handleCheckout = async () => {
    try {
      const token = getToken();
      if (!token) {
        alert("Please log in first!");
        navigate("/LoginPage");
        return;
      }

      const requests = cartItems.map((item) =>
        fetch(`${import.meta.env.VITE_APP_BASE_URL}/products/productPlaced`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            productId: item._id,
            quantity: item.quantity,
          }),
        })
      );

      const responses = await Promise.all(requests);

      // Check if all responses are OK
      const allSuccess = responses.every((res) => res.ok);
      if (!allSuccess) {
        throw new Error("Some orders failed to process");
      }

      clearCart(user._id);
      navigate("/UserOrder");
    } catch (error) {
      console.error("Checkout failed:", error);
      alert("Checkout failed. Please try again.");
    }
  };
  if (!isLoggedIn || !isUser()) {
    return (
      <div className="bg-gray-100 min-h-screen py-12">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="bg-white p-8 rounded-lg shadow-md">
            <div className="text-6xl mb-4">🛒</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Please login to view your cart
            </h2>
            <button
              onClick={() => navigate("/login")}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Login Now
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Your Shopping Cart
          </h1>
          {cartItems.length > 0 && (
            <button
              onClick={() => clearCart(user._id)}
              className="text-red-600 hover:text-red-800 font-medium"
            >
              Clear Cart
            </button>
          )}
        </div>

        {cartItems.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <div className="text-6xl mb-4">🛒</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Your cart is empty
            </h2>
            <button
              onClick={() => navigate("/")}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-2/3">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                {cartItems.map((item) => (
                  <div
                    key={item._id}
                    className="p-4 border-b flex items-center"
                  >
                    <div className="w-24 h-24 bg-gray-200 rounded-lg mr-4 overflow-hidden">
                      <img
                        src={item.photoUrl || "/images/photo1.jpg"}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-grow">
                      <h3 className="text-lg font-semibold">{item.name}</h3>
                      <p className="text-gray-600">
                        ₹{item.price.toLocaleString()}
                      </p>
                      <div className="flex items-center mt-2">
                        <button
                          onClick={() =>
                            updateQuantity(
                              user._id,
                              item._id,
                              item.quantity - 1
                            )
                          }
                          className="w-8 h-8 bg-gray-200 rounded"
                        >
                          -
                        </button>
                        <span className="mx-2">{item.quantity}</span>
                        <button
                          onClick={() =>
                            updateQuantity(
                              user._id,
                              item._id,
                              item.quantity + 1
                            )
                          }
                          className="w-8 h-8 bg-gray-200 rounded"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFromCart(user._id, item._id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="md:w-1/3">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
                <h2 className="text-xl font-bold mb-6">Order Summary</h2>
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>₹{shipping.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between border-t border-gray-200 pt-4">
                    <span className="font-bold">Total</span>
                    <span className="font-bold">₹{total.toLocaleString()}</span>
                  </div>
                </div>
                <button
                  onClick={handleCheckout}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700"
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
