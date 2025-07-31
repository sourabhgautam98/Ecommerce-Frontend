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

  const handleImageError = () => {
    setImageError(true);
  };

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
    
    // Only regular users will see this button
    return (
      <button
        onClick={handleAddToCart}
        disabled={isAdding}
        className={`inline-flex items-center justify-center px-4 py-2 text-white text-sm font-medium rounded-md transition-all duration-300 min-w-[100px] ${
          isAdding ? 'bg-green-600' : 'bg-blue-600 hover:bg-blue-700'
        } hover:scale-105`}
      >
        {isAdding ? 'Added!' : 'Add to Cart'}
      </button>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-xl hover:-translate-y-1">
      <div className="relative h-48 bg-gray-200">
        <img
          src={imageError ? '/images/photo1.jpg' : getImageUrl(photoUrl)}
          alt={name}
          className="w-full h-full object-cover"
          onError={handleImageError}
        />
        <div className="absolute top-2 right-2 bg-blue-600 text-white px-2 py-1 rounded-full text-sm font-bold shadow-md">
          ₹{price?.toLocaleString()}
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-xl font-semibold text-gray-800 mb-2 line-clamp-1" title={name}>
          {name}
        </h3>
       
        <div className="mb-3">
          <p className="text-sm text-gray-500">
            <span className="font-medium">Storage:</span> {varieties}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-lg font-bold text-blue-600">
              ₹{price?.toLocaleString()}
            </p>
          </div>
          
          <div className="min-w-[100px] text-center">
            {renderActionButton()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;