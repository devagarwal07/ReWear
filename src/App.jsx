import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import ItemListing from './pages/ItemListing';
import Dashboard from './pages/Dashboard';
import ProductDetail from './pages/ProductDetail';
import AdminPanel from './pages/AdminPanel';

function App() {
  return (
    <Router>
      <div style={{ 
        margin: 0, 
        padding: 0, 
        width: '100%', 
        minHeight: '100vh',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        background: 'linear-gradient(135deg, #F5F5DC 0%, #FFF8DC 50%, #FFFFFF 100%)',
        color: '#1F2937'
      }}>
        <Navbar />
        <main style={{ width: '100%', margin: 0, padding: 0 }}>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/item-listing" element={<ItemListing />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/product-detail" element={<ProductDetail />} />
            <Route path="/admin" element={<AdminPanel />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
