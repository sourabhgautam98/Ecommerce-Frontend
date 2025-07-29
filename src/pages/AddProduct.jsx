import React, { useState } from "react";
import axios from "axios";

const AddProduct = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    varieties: "",
    photo: null,
    photoUrl: "", 
  });

  const [previewUrl, setPreviewUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false); 
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type and size
    const validTypes = ["image/jpeg", "image/png", "image/gif"];
    const maxSize = 5 * 1024 * 1024; 

    if (!validTypes.includes(file.type)) {
      setError("Only JPG, PNG, or GIF images are allowed");
      return;
    }

    if (file.size > maxSize) {
      setError("Image size must be less than 5MB");
      return;
    }

    setError(null);
    setIsUploading(true);

    try {
      // Upload image immediately when selected
      const imageFormData = new FormData();
      imageFormData.append("file", file);

      const uploadResponse = await axios.post(
       `${import.meta.env.VITE_APP_BASE_URL}/upload/uploadFile`,
        imageFormData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (!uploadResponse.data.success) {
        throw new Error(
          uploadResponse.data.message || "Failed to upload image"
        );
      }

      const { publicUrl } = uploadResponse.data.data;

      // Update form data with uploaded image URL
      setFormData((prev) => ({ 
        ...prev, 
        photo: file,
        photoUrl: publicUrl 
      }));

      // Set preview URL
      const reader = new FileReader();
      reader.onload = (e) => setPreviewUrl(e.target.result);
      reader.readAsDataURL(file);

    } catch (err) {
      console.error("Failed to upload image:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to upload image. Please try again."
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // Check if image has been uploaded
      if (!formData.photoUrl) {
        throw new Error("Please upload an image first");
      }

      // Create the product with the uploaded image URL
      const productData = {
        name: formData.name,
        description: formData.description,
        price: formData.price,
        varieties: formData.varieties,
        photoUrl: formData.photoUrl, // Use the uploaded image URL
      };

      await axios.post(`${import.meta.env.VITE_APP_BASE_URL}/products`, productData);


      setSuccess(true);
      // Reset form
      setFormData({
        name: "",
        description: "",
        price: "",
        varieties: "",
        photo: null,
        photoUrl: "",
      });
      setPreviewUrl("");

      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error("Failed to save product:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to save product. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg p-6 w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">
          Add Phone Product
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
            Product added successfully!
          </div>
        )}

        <div className="mb-4">
          <label className="block mb-1 font-semibold">Phone Name</label>
          <input
            type="text"
            name="name"
            placeholder="e.g., iPhone 14 Pro"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-semibold">Description</label>
          <textarea
            name="description"
            placeholder="e.g., Apple A16 chip, 48MP camera"
            value={formData.description}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="3"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-semibold">Price (₹)</label>
          <input
            type="number"
            name="price"
            placeholder="e.g., 129999"
            value={formData.price}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            min="0"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-semibold">Varieties</label>
          <input
            type="text"
            name="varieties"
            placeholder="e.g., 128GB, 256GB, 512GB"
            value={formData.varieties}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            disabled={isUploading}
          />
          <p className="text-sm text-gray-500 mt-1">
            Accepted formats: JPG, PNG, GIF (Max: 5MB)
          </p>
          {isUploading && (
            <p className="text-sm text-blue-600 mt-1">Uploading image...</p>
          )}
          {formData.photoUrl && (
            <p className="text-sm text-green-600 mt-1">✓ Image uploaded successfully</p>
          )}
        </div>

        {previewUrl && (
          <div className="mb-4">
            <label className="block mb-1 font-semibold">Preview</label>
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full max-h-64 object-cover rounded shadow"
            />
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading || isUploading || !formData.photoUrl}
          className={`w-full ${
            isLoading || isUploading || !formData.photoUrl 
              ? "bg-blue-400" 
              : "bg-blue-600"
          } text-white font-semibold py-2 px-4 rounded hover:bg-blue-700 transition duration-200 flex justify-center items-center`}
        >
          {isLoading ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Processing...
            </>
          ) : isUploading ? (
            "Uploading Image..."
          ) : (
            "Submit"
          )}
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
