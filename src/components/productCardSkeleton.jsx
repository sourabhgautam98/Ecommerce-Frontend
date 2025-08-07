import React from "react";

const ProductCardSkeleton = () => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden w-full h-full flex flex-col animate-pulse">
      {/* Image placeholder */}
      <div className="relative h-48 bg-gray-200 flex-shrink-0"></div>
      
      <div className="p-4 flex-grow flex flex-col">
        {/* Title placeholder */}
        <div className="h-6 bg-gray-200 rounded mb-2 w-3/4"></div>
        
        {/* Varieties placeholder */}
        <div className="mb-3">
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>

        {/* Price and button placeholder */}
        <div className="flex items-center justify-between mt-auto">
          <div className="h-6 bg-gray-200 rounded w-1/4"></div>
          <div className="h-8 bg-gray-200 rounded w-24"></div>
        </div>
      </div>
    </div>
  );
};

export default ProductCardSkeleton;