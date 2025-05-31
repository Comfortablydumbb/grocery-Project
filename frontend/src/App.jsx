import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import Shop from "./pages/Shop";
import UserLayout from "./layouts/UserLayout";
import { Toaster } from "react-hot-toast";
import VerifyOTP from "./pages/VerifyOtp";
import PersistLogin from "./hooks/presistLogin";
import AdminDashboard from "./layouts/AdminLayout";
import DashboardHome from "./pages/admin/DashboardHome";
import CategoriesPage from "./pages/admin/CategoriesPage.jsx";
import CreateCategory from "./pages/admin/CreateCategory.jsx";
import UpdateCategory from "./pages/admin/UpdateCategory.jsx";
import ProductsPage from "./pages/admin/ProductsPage.jsx";
import CreateProduct from "./pages/admin/CreateProduct.jsx";
import UpdateProduct from "./pages/admin/UpdateProduct.jsx";
import UsersPage from "./pages/admin/UsersPage.jsx";
import RequireAuth from "./hooks/requireAuth.jsx";
import CustomerDashboard from "./layouts/CustomerLayout.jsx";
import CustomerDashboardHome from "./pages/customer/Dashboard.jsx";
import MyOrders from "./pages/customer/MyOrders.jsx";
import AdminAllOrders from "./pages/admin/AdminAllOrders.jsx";
import CustomerSettings from "./pages/customer/Settings.jsx";
import AdminSettings from "./pages/admin/Settings.jsx";
import ProductDetails from "./pages/ProductDetails";

const App = () => {
  return (
    <>
     
    <Routes>
      <Route element={<PersistLogin />}>
        <Route path="/" element={<UserLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/about" element={<About />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify/:email" element={<VerifyOTP />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/orders" element={<Orders />} />
        </Route>
        <Route element={<RequireAuth allowedRoles={["Admin"]} />}>
          <Route path="/admin" element={<AdminDashboard />}>
            <Route path="dashboard" element={<DashboardHome />} />
            <Route path="categories" element={<CategoriesPage />} />
            <Route path="categories/create" element={<CreateCategory />} />
            <Route path="categories/update/:id" element={<UpdateCategory />} />
            <Route path="products" element={<ProductsPage />} />
            <Route path="products/create" element={<CreateProduct />} />
            <Route path="products/update/:id" element={<UpdateProduct />} />
            <Route path="users" element={<UsersPage />} />
            <Route path="allorders" element={<AdminAllOrders />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
        </Route>
        <Route element={<RequireAuth allowedRoles={["Customer"]} />}>
          <Route path="/customer" element={<CustomerDashboard />}>
            <Route path="dashboard" element={<CustomerDashboardHome />} />
            <Route path="myorders" element={<MyOrders />} />
            <Route path="settings" element={<CustomerSettings />} />
          </Route>
        </Route>
      </Route>
    </Routes>
    </>
  );
};

export default App;
