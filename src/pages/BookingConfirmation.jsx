
import { Link, useLocation } from 'react-router-dom';
import { CheckCircle2, CalendarDays, MapPin } from 'lucide-react';
import '../Services.css';

function BookingConfirmation() {
  const location = useLocation();
  const booking = location.state?.booking;

  if (!booking) {
    return (
      <main className="booking-page">
        <section className="booking-confirmation">
          <h1>No booking details found</h1>
          <p>Please select a professional to start a booking request.</p>
          <Link to="/services" className="confirmation-button">
            Browse services
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="booking-page">
      <section className="booking-confirmation">
        <CheckCircle2 className="confirmation-icon" size={58} />

        <p className="eyebrow">USTAADNOW</p>
        <h1>Request saved successfully!</h1>

        <p>
          Your demo booking request for {booking.service} has been
          saved in this browser.
        </p>

        <div className="confirmation-details">
          <p><strong>Reference:</strong> {booking.id}</p>
          <p><strong>Professional:</strong> {booking.professionalName}</p>
          <p><strong>Service:</strong> {booking.service}</p>
          <p>
            <strong>Date:</strong>{' '}
            {new Date(`${booking.date}T00:00:00`).toLocaleDateString()}
          </p>
          <p>
            <strong>Time:</strong>{' '}
            {new Date(`2000-01-01T${booking.time}:00`).toLocaleTimeString(
              [],
              { hour: 'numeric', minute: '2-digit' }
            )}
          </p>

          <p>
            <MapPin size={15} />
            {booking.city}, Pakistan
          </p>

          <p>
            <CalendarDays size={15} />
            Status: {booking.status}
          </p>
        </div>

        <p className="booking-disclaimer">
          This is a frontend demonstration. No real appointment has
          been confirmed and no professional has been contacted.
        </p>

        <Link to="/services" className="confirmation-button">
          Explore more services
        </Link>
      </section>
    </main>
  );
}

export default BookingConfirmation;
