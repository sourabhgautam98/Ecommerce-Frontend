import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ManageProduct = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await axios.get(`${import.meta.env.VITE_APP_BASE_URL}/products`);

    
      if (res.data.products) {
        setProducts(res.data.products);
      } else {
       
        setProducts(res.data);
      }
   
    } catch (error) {
      console.error("❌ Failed to fetch products", error);
      setError('Failed to load products. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    
    try {
    const res = await axios.delete(`${import.meta.env.VITE_APP_BASE_URL}/products/${id}`);

     
      
   
      setProducts(products.filter(p => p._id !== id));
      
   
      alert(res.data.message || "Product deleted successfully!");
      
    } catch (err) {
      console.error("❌ Failed to delete product:", err);
      
      
      const errorMessage = err.response?.data?.error || "Delete failed. Please try again.";
      alert(errorMessage);
    }
  };

  // Function to get full image URL
  const getImageUrl = (photoUrl) => {
    if (!photoUrl) return '/placeholder-image.jpg';
   
    if (photoUrl.startsWith('http')) {
      return photoUrl;
    }
  
   return `${import.meta.env.VITE_SERVER_BASE_URL}${photoUrl}`;

  };

  useEffect(() => {
    fetchProducts();
  }, []);

  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Products</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={fetchProducts}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-6">
        <h2 className="text-3xl font-bold text-center text-blue-700">
          📦 Manage All Products
        </h2>
      </div>

      {/* Products Grid */}
      {products.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📦</div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No Products Available</h3>
          <p className="text-gray-500 mb-6">Start by adding your first product to the inventory.</p>
          <Link
            to="/add-product"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Add Product
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {products.map(product => (
            <div key={product._id} className="bg-white shadow-lg rounded-lg p-4 hover:shadow-xl transition-shadow duration-300">
              {/* Product Image */}
              <div className="relative mb-4">
                <img
                  src={getImageUrl(product.photoUrl)}
                  alt={product.name}
                  className="w-full h-48 object-cover rounded-lg"
                  onError={(e) => {
                    e.target.src = '/placeholder-image.jpg'; 
                  }}
                />
                {/* Price Badge */}
                <div className="absolute top-2 right-2 bg-blue-600 text-white px-2 py-1 rounded-full text-sm font-bold">
                  ₹{product.price?.toLocaleString()}
                </div>
              </div>

              {/* Product Info */}
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-blue-700 mb-2 line-clamp-1">
                  {product.name}
                </h3>
                <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                  {product.description}
                </p>
                <p className="text-sm text-gray-500 mb-1">
                  <span className="font-medium">Varieties:</span> {product.varieties}
                </p>
                <p className="text-xs text-gray-400">
                  Added: {new Date(product.createdAt).toLocaleDateString()}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between gap-2">
                <Link
                  to={`/edit/${product._id}`}
                  className="flex-1 text-center bg-yellow-500 text-white px-3 py-2 rounded hover:bg-yellow-600 transition duration-200 text-sm font-medium"
                >
                  ✏️ Edit
                </Link>
                <button
                  onClick={() => handleDelete(product._id)}
                  className="flex-1 bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600 transition duration-200 text-sm font-medium"
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageProduct;
