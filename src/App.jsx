
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import Home from './pages/Home';
import Services from './pages/Services';
import ProfessionalDetails from './pages/ProfessionalDetails';
import Booking from './pages/Booking';
import BookingConfirmation from './pages/BookingConfirmation';

import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="website">
        <Navbar />

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
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
