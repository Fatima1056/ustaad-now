
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';

import ProfessionalDashboard from './pages/ProfessionalDashboard';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Services from './pages/Services';
import ProfessionalDetails from './pages/ProfessionalDetails';
import Booking from './pages/Booking';
import BookingConfirmation from './pages/BookingConfirmation';

import './App.css';

function AppLayout() {
  const location = useLocation();

  const isDashboard = location.pathname === '/professional/dashboard';

  return (
    <div className="website">
      {!isDashboard && <Navbar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Services />} />

        <Route
          path="/professionals/:id"
          element={<ProfessionalDetails />}
        />

        <Route
          path="/professionals/:id/book"
          element={<Booking />}
        />

        <Route
          path="/booking-confirmation"
          element={<BookingConfirmation />}
        />

        <Route
          path="/professional/dashboard"
          element={<ProfessionalDashboard />}
        />
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
