// src/components/ProtectedRoute.jsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export const AdminRoute = () => {
  const { isLoggedIn, isAdmin } = useAuth();
  
  if (!isLoggedIn || !isAdmin()) {
    return <Navigate to="/LoginPage" replace />;
  }
  
  return <Outlet />;
};

export const UserRoute = () => {
  const { isLoggedIn, isUser } = useAuth();
  
  if (!isLoggedIn || !isUser()) {
    return <Navigate to="/LoginPage" replace />;
  }
  
  return <Outlet />;
};

export const AuthRoute = () => {
  const { isLoggedIn } = useAuth();
  
  if (isLoggedIn) {
    return <Navigate to="/" replace />;
  }
  
  return <Outlet />;
};

