import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminLayout from "./admin/AdminLayout";
import AdminDashboard from "./admin/AdminDashboard";
import Users from "./admin/Users";
import Products from "./admin/Products";
import Orders from "./admin/Orders";

import Login from './Login';
import Dashboard from './Dashboard';
import AddProduct from './components/AddProduct';
import ProductList from './components/ProductList';
import OrderPage from './components/OrderPage';
import PaymentPage from './components/PaymentPage';
import ProfilePage from './components/ProfilePage';
import MyOrdersPage from './components/MyOrdersPage';
import ProductCard from './components/ProductCard';
import { AuthProvider } from './context/AuthContext';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* 👤 USER ROUTES */}
          <Route path='/' element={<Login />} />
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/add-product' element={<AddProduct />} />
          <Route path='/products' element={<ProductList />} />
          <Route path='/my-orders' element={<MyOrdersPage />} />
          <Route path='/order/:id' element={<OrderPage />} />
          <Route path='/product/:id' element={<OrderPage />} />
          <Route path='/payment' element={<PaymentPage />} />
          <Route path='/profile' element={<ProfilePage />} />

          {/* 🔐 ADMIN ROUTES */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<Users />} />
            <Route path="products" element={<Products />} />
            <Route path="orders" element={<Orders />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App;