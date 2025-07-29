import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const EditProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    varieties: '',
    photo: null,
  });
  
  const [currentPhotoUrl, setCurrentPhotoUrl] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');
  const [photoChanged, setPhotoChanged] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Function to get full image URL
  const getImageUrl = (photoUrl) => {
    if (!photoUrl) return '';
    if (photoUrl.startsWith('http')) return photoUrl;
    return `http://localhost:3000${photoUrl}`;
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError('');
        const res = await axios.get(`http://localhost:3000/api/products/${id}`);
        
       
        
        // Handle both old and new API response structures
        let productData;
        if (res.data.product) {
          // New API structure
          productData = res.data.product;
        } else {
          // Old API structure or direct product data
          productData = res.data;
        }



        setFormData({
          name: productData.name || '',
          description: productData.description || '',
          price: productData.price || '',
          varieties: productData.varieties || '',
          photo: null,
        });
        
        setCurrentPhotoUrl(productData.photoUrl || '');
        
      } catch (err) {
        console.error("Failed to fetch product", err);
        setError('Failed to load product data');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        photo: file
      }));
      setPhotoChanged(true);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let submitData;
      let config = {};

      if (photoChanged && formData.photo) {
        // If photo was changed, use FormData for file upload
        submitData = new FormData();
        submitData.append('name', formData.name);
        submitData.append('description', formData.description);
        submitData.append('price', formData.price);
        submitData.append('varieties', formData.varieties);
        submitData.append('photo', formData.photo);
        
        config.headers = {
          'Content-Type': 'multipart/form-data',
        };
      } else {
        // If photo wasn't changed, send regular JSON data
        submitData = {
          name: formData.name,
          description: formData.description,
          price: formData.price,
          varieties: formData.varieties,
        };
        
        config.headers = {
          'Content-Type': 'application/json',
        };
      }

      const response = await axios.put(`http://localhost:3000/api/products/${id}`, submitData, config);
      console.log("Update response:", response.data);
      
      alert("✅ Product updated successfully");
      navigate('/ManageProduct');
    } catch (err) {
      console.error("❌ Failed to update product", err);
      const errorMessage = err.response?.data?.error || "Update failed";
      alert(errorMessage);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product...</p>
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
          <h2 className="text-xl font-bold text-red-600 mb-4">Error Loading Product</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => navigate('/ManageProduct')}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <form 
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg p-6 w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-4 text-center text-yellow-600">✏️ Edit Product</h2>

        <div className="mb-4">
          <label className="block mb-1 font-semibold">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-semibold">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
            rows="3"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-semibold">Price (₹)</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-semibold">Varieties</label>
          <input
            type="text"
            name="varieties"
            value={formData.varieties}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-semibold">Photo</label>
          <input
            type="file"
            name="photo"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
          <p className="text-sm text-gray-500 mt-1">
            Leave empty to keep current photo. Accepted: JPG, PNG, GIF (Max: 5MB)
          </p>
        </div>

        {/* Show current photo or new preview */}
        {(previewUrl || currentPhotoUrl) && (
          <div className="mb-4">
            <label className="block mb-1 font-semibold">
              {photoChanged ? 'New Photo Preview' : 'Current Photo'}
            </label>
            <img
              src={previewUrl || getImageUrl(currentPhotoUrl)}
              alt="Preview"
              className="w-full max-h-64 object-cover rounded shadow"
              onError={(e) => {
                e.target.src = '/placeholder-image.jpg';
              }}
            />
            {photoChanged && (
              <p className="text-sm text-green-600 mt-1">
                ✅ New photo selected
              </p>
            )}
          </div>
        )}

        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => navigate('/ManageProduct')}
            className="flex-1 bg-gray-500 text-white font-semibold py-2 px-4 rounded hover:bg-gray-600 transition duration-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 bg-yellow-500 text-white font-semibold py-2 px-4 rounded hover:bg-yellow-600 transition duration-200"
          >
            Update Product
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProductPage;
