import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CompareProvider } from './context/CompareContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './Pages/Home';
import EventPlanner from './Pages/EventPlanner';
import BudgetPlanner from './Pages/BudgetPlanner';
import VendorListing from './Pages/VendorListing';
import VendorDetails from './Pages/VendorDetails';
import CompareVendors from './Pages/CompareVendors';
import BookingSummary from './Pages/BookingSummary';
import DemoPayment from './Pages/DemoPayment';
import BookingConfirmation from './Pages/BookingConfirmation';
import MyEvent from './Pages/MyEvent';
import CustomerDashboard from './Pages/CustomerDashboard';
import VendorDashboard from './Pages/VendorDashboard';
import Login from './Pages/Login';
import Register from './Pages/Register';

export default function App() {
  return (
    <AuthProvider>
      <CompareProvider>
        <BrowserRouter>
          <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-main, #f8fafc)' }}>
            <Navbar />
            <main style={{ flex: 1 }}>
              <Routes>
                {/* Public Discovery & Planning */}
                <Route path="/" element={<Home />} />
                <Route path="/planner" element={<EventPlanner />} />
                <Route path="/plan" element={<EventPlanner />} />
                <Route path="/budget-planner" element={<BudgetPlanner />} />
                <Route path="/budget-calculator" element={<BudgetPlanner />} />
                <Route path="/vendors" element={<VendorListing />} />
                <Route path="/vendors/:id" element={<VendorDetails />} />
                <Route path="/compare" element={<CompareVendors />} />

                {/* Booking & Simulated Payment Workflow */}
                <Route path="/booking/summary" element={<BookingSummary />} />
                <Route path="/book/:vendorId" element={<BookingSummary />} />
                <Route path="/payment/demo" element={<DemoPayment />} />
                <Route path="/payment/:bookingId" element={<DemoPayment />} />
                <Route path="/booking/confirmation" element={<BookingConfirmation />} />
                <Route path="/confirmation/:bookingId" element={<BookingConfirmation />} />

                {/* Authenticated Portals */}
                <Route
                  path="/my-event"
                  element={
                    <ProtectedRoute>
                      <MyEvent />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/my-event/:eventId"
                  element={
                    <ProtectedRoute>
                      <MyEvent />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <CustomerDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/vendor/dashboard"
                  element={
                    <ProtectedRoute role="VENDOR">
                      <VendorDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/vendor-dashboard"
                  element={
                    <ProtectedRoute role="VENDOR">
                      <VendorDashboard />
                    </ProtectedRoute>
                  }
                />

                {/* Auth */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Catch-all */}
                <Route path="*" element={<Home />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </BrowserRouter>
      </CompareProvider>
    </AuthProvider>
  );
}