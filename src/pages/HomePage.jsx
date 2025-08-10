import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom"; // 👈 Added
import ProductCard from "../components/ProductCard";
import ProductCardSkeleton from "../components/productCardSkeleton";
import Popup from "../components/Popup";

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  const location = useLocation(); 

  useEffect(() => {
    if (location.state?.fromLogout) {
      setShowPopup(true);
      const timer = setTimeout(() => setShowPopup(false), 3000);

      window.history.replaceState({}, document.title);

      return () => clearTimeout(timer);
    }

    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await axios.get(
          `${import.meta.env.VITE_APP_BASE_URL}/products`
        );

        if (res.data.products) {
          setProducts(res.data.products);
        } else {
          setProducts(res.data);
        }
      } catch (err) {
        console.error("❌ Failed to fetch products:", err);
        setError(err.response?.data?.error || "Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [location.state]); 

  const handleRetry = async () => {
    setError("");
    setLoading(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_APP_BASE_URL}/products`
      );

      if (res.data.products) {
        setProducts(res.data.products);
      } else {
        setProducts(res.data);
      }
    } catch (err) {
      console.error("❌ Failed to fetch products:", err);
      setError(err.response?.data?.error || "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      {showPopup && <Popup onClose={() => setShowPopup(false)} />}

      <div className="relative w-full h-64 md:h-80 lg:h-120 overflow-hidden">
        <img
          src="/images/photo1.jpg"
          alt="Mobile Phones Banner"
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.style.display = "none";
            e.target.nextSibling.style.display = "flex";
          }}
        />
        <div className="w-full h-full bg-gradient-to-r from-blue-600 to-blue-800 hidden items-center justify-center">
          <div className="text-center text-white">
            <div className="text-6xl mb-4">📱</div>
            <h2 className="text-3xl font-bold">Mobile Store</h2>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2 text-blue-700">
            All Mobile Phones
          </h2>
          {products.length > 0 && (
            <p className="text-sm text-gray-500">
              Showing {products.length} products
            </p>
          )}
        </div>

        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
            {[...Array(6)].map((_, index) => (
              <ProductCardSkeleton key={index} />
            ))}
          </div>
        )}

        {error && !loading && (
          <div className="text-center py-12">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h3 className="text-xl font-semibold text-red-600 mb-2">
              Oops! Something went wrong
            </h3>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={handleRetry}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-200"
            >
              🔄 Try Again
            </button>
          </div>
        )}

        {!loading && !error && products.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📱</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No Products Available
            </h3>
            <p className="text-gray-500 mb-6">
              Check back later for the latest mobile phones and deals.
            </p>
            <button
              onClick={handleRetry}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-200"
            >
              🔄 Refresh
            </button>
          </div>
        )}
        {!loading && !error && products.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
