import React, { useState, useRef, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Navbar = () => {
  const { 
    isLoggedIn, 
    user, 
    isAdmin,
    isUser,
    loading: authLoading,
    error: authError,
    logout
  } = useAuth();
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [logoutPopup, setLogoutPopup] = useState(false); // for logout popup
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Close menu/dropdown when auth state changes
  useEffect(() => {
    setIsMenuOpen(false);
    setIsDropdownOpen(false);
  }, [isLoggedIn]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const handleLogout = () => {
    logout();
    setLogoutPopup(true);
    setTimeout(() => setLogoutPopup(false), 2000); // Hide after 2 seconds
    navigate('/LoginPage');
    closeMenu();
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Loading state
  if (authLoading) {
    return (
      <nav className="bg-white shadow-lg fixed top-0 left-0 w-full z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            <div className="text-xl font-bold text-blue-600">PhoneMart</div>
            <div className="hidden md:flex space-x-4">
              <div className="h-8 w-20 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-8 w-20 bg-gray-200 rounded animate-pulse"></div>
            </div>
            <div className="md:hidden h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      </nav>
    );
  }

  // Error state
  if (authError) {
    return (
      <div className="bg-white shadow-lg py-4 text-red-500 text-center fixed top-0 left-0 w-full z-50">
        Authentication Error: {authError}
      </div>
    );
  }

  // Active link styling
  const navLinkClass = ({ isActive }) => 
    `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      isActive ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-blue-100 hover:text-blue-600"
    }`;

  const mobileNavLinkClass = ({ isActive }) => 
    `block px-3 py-2 rounded-md text-base font-medium transition-colors ${
      isActive ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-blue-100 hover:text-blue-600"
    }`;

  return (
    <>
      {/* Logout Popup */}
      {logoutPopup && (
        <div className="fixed top-16 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded shadow-lg z-[60]">
          Logged out successfully
        </div>
      )}

      <nav className="bg-white shadow-lg fixed top-0 left-0 w-full z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            {/* Logo/Brand */}
            <div className="text-xl font-bold text-blue-600">
              <NavLink to="/" onClick={closeMenu}>PhoneMart</NavLink>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-4 items-center">
              {isLoggedIn && isAdmin() && (
                <>
                  <NavLink to="/ManageProduct" className={navLinkClass}>Manage Products</NavLink>
                  <NavLink to="/AddProduct" className={navLinkClass}>Add Product</NavLink>
                  <NavLink to="/AdminOrder" className={navLinkClass}>All Orders</NavLink>
                </>
              )}

              {isLoggedIn && isUser() && !isAdmin() && (
                <>
                  <NavLink to="/" className={navLinkClass}>Home</NavLink>
                  <NavLink to="/CartPage" className={navLinkClass}>Cart</NavLink>
                  <NavLink to="/UserOrder" className={navLinkClass}>My Orders</NavLink>
                </>
              )}

              {!isLoggedIn ? (
                <> 
                  <NavLink to="/LoginPage" className={navLinkClass}>Login</NavLink>
                  <NavLink to="/RegisterPage" className={navLinkClass}>Register</NavLink>
                </>
              ) : (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={toggleDropdown}
                    className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-blue-100 hover:text-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    <span>Welcome, {user?.name }</span>
                    <svg
                      className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                      <div className="py-1">
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                        >
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Hamburger */}
            <div className="md:hidden">
              <button
                onClick={toggleMenu}
                className="text-gray-700 hover:text-blue-600 focus:outline-none focus:text-blue-600 transition-colors"
                aria-label="Toggle menu"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  {isMenuOpen ? (
                    <path d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden border-t border-gray-200">
              <div className="px-2 pt-2 pb-3 space-y-1">
                <NavLink to="/" onClick={closeMenu} className={mobileNavLinkClass}>Home</NavLink>

                {isLoggedIn && isAdmin() && (
                  <>
                    <NavLink to="/ManageProduct" onClick={closeMenu} className={mobileNavLinkClass}>Manage Products</NavLink>
                    <NavLink to="/AddProduct" onClick={closeMenu} className={mobileNavLinkClass}>Add Product</NavLink>
                    <NavLink to="/AdminOrder" onClick={closeMenu} className={mobileNavLinkClass}>Orders</NavLink>
                  </>
                )}

                {isLoggedIn && isUser() && !isAdmin() && (
                  <>
                    <NavLink to="/CartPage" onClick={closeMenu} className={mobileNavLinkClass}>Cart</NavLink>
                    <NavLink to="/UserOrder" onClick={closeMenu} className={mobileNavLinkClass}>My Orders</NavLink>
                  </>
                )}

                {!isLoggedIn ? (
                  <>
                    <NavLink to="/LoginPage" onClick={closeMenu} className={mobileNavLinkClass}>Login</NavLink>
                    <NavLink to="/RegisterPage" onClick={closeMenu} className={mobileNavLinkClass}>Register</NavLink>
                  </>
                ) : (
                  <div className="px-3 py-2 space-y-2">
                    <div className="text-sm text-gray-600 border-b border-gray-200 pb-2">
                      <div className="font-medium">{user?.name }</div>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-3 py-2 rounded-md text-base font-medium bg-gray-600 text-white hover:bg-gray-700 transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;
