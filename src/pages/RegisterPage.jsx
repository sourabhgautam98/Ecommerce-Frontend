import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiMail, FiLock, FiUser } from "react-icons/fi";
import axios from "axios";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      // Make the request directly with axios
      const response = await axios.post(
        `${import.meta.env.VITE_APP_BASE_URL}/users/register`,
        {
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }
      );

      if (response.data.token) {
        // Redirect to login page
        navigate("/LoginPage");
      } else {
        setError("Registration failed. Please try again.");
      }
    } catch (err) {
      console.error("Registration error:", err);

      // Log the full error for debugging
      console.error("Full error object:", err);

      if (
        err.code === "ECONNREFUSED" ||
        err.message.includes("Network Error")
      ) {
        setError(
          "Could not connect to the server. Please make sure the backend server is running."
        );
      } else if (err.response) {
        // Server responded with an error
        console.error("Server error response:", err.response.data);
        setError(
          err.response.data?.message || "Registration failed. Server error."
        );
      } else if (err.request) {
        // No response received
        console.error("No response from server:", err.request);
        setError("Server not responding. Please try again.");
      } else {
        console.error("Error:", err.message);
        setError("An error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-purple-100 px-4 py-12">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-2xl">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">
            Create Your Account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              to="/LoginPage"
              className="text-blue-600 hover:underline font-medium"
            >
              Sign in
            </Link>
          </p>
        </div>

        {error && (
          <div className="flex items-center justify-between bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4 text-sm">
            <span>{error}</span>
            <button
              onClick={() => setError("")}
              className="text-xl font-bold leading-none focus:outline-none"
            >
              &times;
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <FiUser className="absolute left-3 top-3 text-gray-400" />
            <input
              id="name"
              name="name"
              type="text"
              required
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div className="relative">
            <FiMail className="absolute left-3 top-3 text-gray-400" />
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="relative">
            <FiLock className="absolute left-3 top-3 text-gray-400" />
            <input
              id="password"
              name="password"
              type="password"
              required
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <div className="relative">
            <FiLock className="absolute left-3 top-3 text-gray-400" />
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center items-center py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400"
          >
            {isLoading ? "Registering..." : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
