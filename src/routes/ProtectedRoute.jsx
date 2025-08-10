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
  const { isLoggedIn, isUser, isAdmin } = useAuth();
  
  if (isLoggedIn && isAdmin()) {
    return <Navigate to="/ManageProduct" replace />; 
  }
  
  if (!isLoggedIn || !isUser()) {
    return <Navigate to="/LoginPage" replace />; 
  }
  
  return <Outlet />;
};

export const AuthRoute = () => {
  const { isLoggedIn, isAdmin } = useAuth();

  if (isLoggedIn) {
    return <Navigate to={isAdmin() ? "/ManageProduct" : "/"} replace />;
  }
  return <Outlet />;
};

