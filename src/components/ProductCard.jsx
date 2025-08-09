import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

const ProductCard = ({ product }) => {
  const [imageError, setImageError] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const { user, isLoggedIn, isAdmin } = useAuth();
  const { addToCart } = useCart();

  const { _id, name, price, photoUrl, varieties } = product;

  const getImageUrl = (photoUrl) => {
    if (!photoUrl) return '/images/photo1.jpg';
    if (photoUrl.startsWith('http')) return photoUrl;
    return `${import.meta.env.VITE_APP_BASE_URL}${photoUrl}`;
  };

  const handleImageError = () => setImageError(true);

  const handleAddToCart = () => {
    if (!isLoggedIn || !user?._id) return;
    setIsAdding(true);
    addToCart(user._id, product);
    setTimeout(() => setIsAdding(false), 1500);
  };

  const renderActionButton = () => {
    if (!isLoggedIn) {
      return <span className="text-sm text-gray-500">Login Now</span>;
    }
    if (isAdmin()) {
      return <span className="text-sm text-gray-500">Admin</span>;
    }
    return (
      <button
        onClick={handleAddToCart}
        disabled={isAdding}
        className={`inline-flex items-center justify-center px-4 py-2 text-white text-sm font-medium rounded-md transition-all duration-300 min-w-[110px] ${
          isAdding ? 'bg-blue-600' : 'bg-black hover:bg-blue-600'
        } hover:scale-105 active:scale-95 shadow`}
      >
        {isAdding ? '✅ Added!' : 'Add to Cart'}
      </button>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-xl hover:-translate-y-1 w-full h-full flex flex-col">
      {/* Product Image */}
      <div className="relative h-44 sm:h-56 bg-gray-100 flex-shrink-0 overflow-hidden group">
        <img
          src={imageError ? '/images/photo1.jpg' : getImageUrl(photoUrl)}
          alt={name}
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
          onError={handleImageError}
        />
        <div className="absolute top-2 right-2 bg-gradient-to-r from-blue-500 to-blue-700 text-white px-3 py-1 rounded-full text-sm font-bold shadow-md">
          ₹{price?.toLocaleString()}
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4 flex-grow flex flex-col">
        <h3
          className="text-lg sm:text-xl font-semibold text-gray-800 mb-2 line-clamp-2"
          title={name}
        >
          {name}
        </h3>

        <p className="text-sm text-gray-600 mb-3">
          <span className="font-medium">Storage:</span> {varieties || 'N/A'}
        </p>

        {/* Price & Button */}
        <div className="flex items-center justify-between mt-auto">
          <p className="text-lg sm:text-xl font-bold text-blue-700">
            ₹{price?.toLocaleString()}
          </p>
          <div className="min-w-[110px] text-center">
            {renderActionButton()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
