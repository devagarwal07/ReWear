import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Landing from './pages/Landing';
import ItemListing from './pages/ItemListing';
import Dashboard from './pages/Dashboard';
import ProductDetail from './pages/ProductDetail';
import AdminPanel from './pages/AdminPanel';
import Onboarding from './pages/Onboarding';
import Navbar from './components/Navbar/Navbar';
import AddItem from './components/AddItem';
import {
    SignedIn,
    SignedOut,
    SignInButton,
    SignUpButton,
    UserButton,
} from '@clerk/clerk-react';

export default function AppRouter() {
    return (
        <Router>
            <Navbar />

            <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/item/:id" element={<ItemListing />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/add-item" element={<AddItem />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/admin" element={<AdminPanel />} />
                <Route path="/onboarding" element={<Onboarding />} />
            </Routes>
        </Router>
    );
}
