import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Landing from './pages/Landing';
import ItemListing from './pages/ItemListing';
import Dashboard from './pages/Dashboard';
import ProductDetail from './pages/ProductDetail';
import AdminPanel from './pages/AdminPanel';

export default function AppRouter() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/item/:id" element={<ItemListing />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/admin" element={<AdminPanel />} />
            </Routes>
        </Router>
    );
}
