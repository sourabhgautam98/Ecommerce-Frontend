// src/App.jsx
import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AddProduct from "./pages/AddProduct";
import HomePage from "./pages/HomePage";
import NotFoundPage from "./pages/NotFoundPage";
import Navbar from "./components/navbar";
import AdminRegister from "./pages/AdminRegister";
import ManageProduct from "./pages/ManageProduct";
import UserOrder from "./pages/UserOrder";
import AdminOrder from "./pages/AdminOrder";
import CartPage from "./pages/CartPage";
import EditProductPage from "./pages/EditProductPage";
import { AdminRoute, UserRoute, AuthRoute } from "./routes/ProtectedRoute";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<HomePage />} />
        {/* Auth routes (only accessible when not logged in) */}
        <Route element={<AuthRoute />}>
          <Route path="/LoginPage" element={<LoginPage />} />
          <Route path="/RegisterPage" element={<RegisterPage />} />
          <Route path="/AdminRegister" element={<AdminRegister />} />
        </Route>

        {/* User-only routes */}
        <Route element={<UserRoute />}>
          <Route path="/CartPage" element={<CartPage />} />
          <Route path="/UserOrder" element={<UserOrder />} />
        </Route>

        {/* Admin-only routes */}
        <Route element={<AdminRoute />}>
          <Route path="/ManageProduct" element={<ManageProduct />} />
          <Route path="/AddProduct" element={<AddProduct />} />
          <Route path="/edit/:id" element={<EditProductPage />} />
          <Route path="/AdminOrder" element={<AdminOrder />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}

export default App;
