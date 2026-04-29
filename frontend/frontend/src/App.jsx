import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminLayout from "./admin/AdminLayout";
import AdminDashboard from "./admin/AdminDashboard";
import Users from "./admin/Users";
import Products from "./admin/Products";
import Orders from "./admin/Orders";
import Feedbacks from "./admin/Feedbacks";

import Login from './Login';
import Dashboard from './Dashboard';
import AddProduct from './components/AddProduct';
import ProductList from './components/ProductList';
import OrderPage from './components/OrderPage';
import PaymentPage from './components/PaymentPage';
import ProfilePage from './components/ProfilePage';
import MyOrdersPage from './components/MyOrdersPage';
import ProductCard from './components/ProductCard';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* 🌐 PUBLIC ROUTES */}
          <Route path='/' element={<Login />} />
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/products' element={<ProductList />} />

          {/* 🔒 PROTECTED USER ROUTES */}
          <Route path='/add-product' element={<ProtectedRoute><AddProduct /></ProtectedRoute>} />
          <Route path='/my-orders' element={<ProtectedRoute><MyOrdersPage /></ProtectedRoute>} />
          <Route path='/order/:id' element={<ProtectedRoute><OrderPage /></ProtectedRoute>} />
          <Route path='/product/:id' element={<ProtectedRoute><OrderPage /></ProtectedRoute>} />
          <Route path='/payment' element={<ProtectedRoute><PaymentPage /></ProtectedRoute>} />
          <Route path='/profile' element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />

          {/* 🔐 ADMIN ROUTES */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<Users />} />
            <Route path="products" element={<Products />} />
            <Route path="orders" element={<Orders />} />
            <Route path="feedbacks" element={<Feedbacks />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App;