
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { useEffect, useState } from 'react';

import { supabase } from './lib/supabaseClient';

import Navbar from './components/Navbar';
import Home from './pages/Home';
import Services from './pages/Services';
import ProfessionalDetails from './pages/ProfessionalDetails';
import Booking from './pages/Booking';
import BookingConfirmation from './pages/BookingConfirmation';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ProfessionalDashboard from './pages/ProfessionalDashboard';
import CustomerDashboard from './pages/CustomerDashboard';

import './App.css';

// Protect pages according to the signed-in user's role.
function ProtectedRoute({ allowedRole, children }) {
  const [status, setStatus] = useState('loading');
  const [role, setRole] = useState(null);

  useEffect(() => {
    let active = true;

    async function checkUser() {
      const { data, error } = await supabase.auth.getUser();

      if (!active) return;

      if (error || !data.user) {
        setStatus('unauthenticated');
        return;
      }

      setRole(data.user.user_metadata?.role ?? null);
      setStatus('authenticated');
    }

    checkUser();

    return () => {
      active = false;
    };
  }, []);

  if (status === 'loading') {
    return (
      <main className="page-loading">
        Loading your account...
      </main>
    );
  }

  if (status === 'unauthenticated') {
    return <Navigate to="/login" replace />;
  }

  if (role !== allowedRole) {
    if (role === 'customer') {
      return <Navigate to="/customer/dashboard" replace />;
    }

    if (role === 'professional') {
      return <Navigate to="/professional/dashboard" replace />;
    }

    return <Navigate to="/login" replace />;
  }

  return children;
}

function AppLayout() {
  return (
    <div className="website">
      <Navbar />

      <Routes>
        {/* Public pages */}
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Services />} />

        <Route
          path="/professionals/:id"
          element={<ProfessionalDetails />}
        />

        {/* Customer-only booking pages */}
        <Route
          path="/professionals/:id/book"
          element={
            <ProtectedRoute allowedRole="customer">
              <Booking />
            </ProtectedRoute>
          }
        />

        <Route
          path="/booking-confirmation"
          element={
            <ProtectedRoute allowedRole="customer">
              <BookingConfirmation />
            </ProtectedRoute>
          }
        />

        {/* Professional account */}
        <Route
          path="/professional/dashboard"
          element={
            <ProtectedRoute allowedRole="professional">
              <ProfessionalDashboard />
            </ProtectedRoute>
          }
        />

        {/* Customer profile and bookings share one dashboard */}
        <Route
          path="/customer/dashboard"
          element={
            <ProtectedRoute allowedRole="customer">
              <CustomerDashboard />
            </ProtectedRoute>
          }
        />

        {/* Authentication */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Old customer profile URL redirects to the dashboard */}
        <Route
          path="/customer/profile"
          element={<Navigate to="/customer/dashboard" replace />}
        />

        {/* Unknown URLs */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}

export default App;
