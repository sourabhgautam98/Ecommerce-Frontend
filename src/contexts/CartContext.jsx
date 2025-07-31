// contexts/CartContext.js
import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [userCarts, setUserCarts] = useState(() => {
    // Load from localStorage if available
    if (typeof window !== 'undefined') {
      const savedCarts = localStorage.getItem('userCarts');
      return savedCarts ? JSON.parse(savedCarts) : {};
    }
    return {};
  });

  // Save to localStorage whenever carts change
  useEffect(() => {
    localStorage.setItem('userCarts', JSON.stringify(userCarts));
  }, [userCarts]);

  const getCurrentUserCart = (userId) => {
    return userCarts[userId] || [];
  };

  const addToCart = (userId, product) => {
    setUserCarts((prev) => {
      const userCart = prev[userId] || [];
      const existingItem = userCart.find((item) => item._id === product._id);
      
      const updatedCart = existingItem
        ? userCart.map((item) =>
            item._id === product._id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        : [...userCart, { ...product, quantity: 1 }];
      
      return {
        ...prev,
        [userId]: updatedCart,
      };
    });
  };

  const removeFromCart = (userId, productId) => {
    setUserCarts((prev) => {
      const userCart = prev[userId] || [];
      return {
        ...prev,
        [userId]: userCart.filter((item) => item._id !== productId),
      };
    });
  };

  const updateQuantity = (userId, productId, newQuantity) => {
    if (newQuantity < 1) return;
    setUserCarts((prev) => {
      const userCart = prev[userId] || [];
      return {
        ...prev,
        [userId]: userCart.map((item) =>
          item._id === productId ? { ...item, quantity: newQuantity } : item
        ),
      };
    });
  };

  const clearCart = (userId) => {
    setUserCarts((prev) => {
      const newCarts = { ...prev };
      delete newCarts[userId];
      return newCarts;
    });
  };

  return (
    <CartContext.Provider
      value={{
        userCarts,
        getCurrentUserCart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};