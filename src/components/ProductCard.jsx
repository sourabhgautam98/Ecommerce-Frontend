import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext'; // Adjust the path accordingly

const ProductCard = ({ product }) => {
  const [imageError, setImageError] = useState(false);
  
  // Get auth context
  const { isLoggedIn, isAdmin, isUser } = useAuth();

  const { _id, name, price, photoUrl, varieties } = product;

  // Function to get full image URL
  const getImageUrl = (photoUrl) => {
    if (!photoUrl) return '/images/photo1.jpg';
    if (photoUrl.startsWith('http')) return photoUrl;
    return `http://localhost:3000${photoUrl}`;
  };

  const handleImageError = () => {
    setImageError(true);
  };

  // Determine if the add to cart button should be shown
  const showAddToCartButton = isLoggedIn && isUser() && !isAdmin();

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-xl hover:-translate-y-1">
      {/* Image Container */}
      <div className="relative h-48 bg-gray-200">
        <img
          src={imageError ? '/images/photo1.jpg' : getImageUrl(photoUrl)}
          alt={name}
          className="w-full h-full object-cover"
          onError={handleImageError}
        />
        
        {/* Price badge */}
        <div className="absolute top-2 right-2 bg-blue-600 text-white px-2 py-1 rounded-full text-sm font-bold shadow-md">
          ₹{price?.toLocaleString()}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Product Name */}
        <h3 className="text-xl font-semibold text-gray-800 mb-2 line-clamp-1" title={name}>
          {name}
        </h3>
       
        {/* Varieties */}
        <div className="mb-3">
          <p className="text-sm text-gray-500">
            <span className="font-medium">Storage:</span> {varieties}
          </p>
        </div>

        {/* Price and Add to Cart */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-lg font-bold text-blue-600">
              ₹{price?.toLocaleString()}
            </p>
          </div>
          
          {/* Conditionally render Add to Cart button */}
          {showAddToCartButton ? (
            <button
              className="inline-flex items-center justify-center px-4 py-2 text-white text-sm font-medium rounded-md transition-all duration-300 min-w-[100px] bg-blue-600 hover:bg-blue-700 hover:scale-105"
            >
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m1.6 0L7 13m0 0l-2.5 2.5M7 13l2.5 2.5" />
                </svg>
                Add to Cart
              </span>
            </button>
          ) : (
            // Optional: Show a different message for admin or non-logged-in users
            <div className="min-w-[100px] text-center">
              {!isLoggedIn ? (
                <span className="text-sm text-gray-500">Login Now</span>
              ) : isAdmin() ? (
                <span className="text-sm text-gray-500">Admin </span>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
