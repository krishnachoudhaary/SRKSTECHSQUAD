import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import EventPlanner from './pages/EventPlanner';
import BudgetPlanner from './pages/BudgetPlanner';
import VendorListing from './pages/VendorListing';
import VendorDetails from './pages/VendorDetails';
import CompareVendors from './pages/CompareVendors';
import BookingSummary from './pages/BookingSummary';
import DemoPayment from './pages/DemoPayment';
import BookingConfirmation from './pages/BookingConfirmation';
import MyEvent from './pages/MyEvent';
import CustomerDashboard from './pages/CustomerDashboard';
import VendorDashboard from './pages/VendorDashboard';
import Login from './pages/Login';
import Register from './pages/Register';

export default function App() {
  return (
    <div className="app-container">
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/plan" element={<EventPlanner />} />
          <Route path="/budget-calculator" element={<BudgetPlanner />} />
          <Route path="/vendors" element={<VendorListing />} />
          <Route path="/vendors/:id" element={<VendorDetails />} />
          <Route path="/compare" element={<CompareVendors />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected Routes */}
          <Route path="/book/:vendorId" element={<ProtectedRoute><BookingSummary /></ProtectedRoute>} />
          <Route path="/payment/:bookingId" element={<ProtectedRoute><DemoPayment /></ProtectedRoute>} />
          <Route path="/confirmation/:bookingId" element={<ProtectedRoute><BookingConfirmation /></ProtectedRoute>} />
          <Route path="/my-event/:eventId" element={<ProtectedRoute><MyEvent /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><CustomerDashboard /></ProtectedRoute>} />
          <Route path="/vendor-dashboard" element={<ProtectedRoute role="VENDOR"><VendorDashboard /></ProtectedRoute>} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}