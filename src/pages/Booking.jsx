
import { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  CalendarDays,
  MapPin,
  ClipboardCheck,
} from 'lucide-react';

import professionals from '../data/professionals';
import '../Services.css';

function Booking() {
  const { id } = useParams();
  const navigate = useNavigate();

  const professional = professionals.find(
    (item) => item.id === Number(id)
  );

  const [form, setForm] = useState({
    customerName: '',
    phone: '',
    address: '',
    date: '',
    time: '',
    details: '',
  });

  const [error, setError] = useState('');

  const today = new Date();
  const minDate = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, '0'),
    String(today.getDate()).padStart(2, '0'),
  ].join('-');

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previousForm) => ({
      ...previousForm,
      [name]: value,
    }));

    setError('');
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!professional) {
      setError('We could not find this professional.');
      return;
    }

    if (!professional.available) {
      setError('This professional is currently unavailable.');
      return;
    }

    const booking = {
      id: `UN-${Date.now()}`,
      professionalId: professional.id,
      professionalName: professional.name,
      service: professional.service,
      city: professional.city,
      price: professional.price,
      ...form,
      status: 'Pending',
      createdAt: new Date().toISOString(),
    };

    try {
      const savedBookings = JSON.parse(
        localStorage.getItem('ustaadnow-bookings') || '[]'
      );

      localStorage.setItem(
        'ustaadnow-bookings',
        JSON.stringify([...savedBookings, booking])
      );

      navigate('/booking-confirmation', {
        state: { booking },
      });
    } catch {
      setError(
        'We could not save your request in this browser. Please try again.'
      );
    }
  }

  if (!professional) {
    return (
      <main className="booking-page">
        <div className="booking-card">
          <h1>Professional not found</h1>
          <Link to="/services" className="details-back-link">
            Back to services
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="booking-page">
      <Link
        to={`/professionals/${professional.id}`}
        className="details-back-link"
      >
        <ArrowLeft size={17} />
        Back to professional
      </Link>

      <section className="booking-layout">
        <div className="booking-card">
          <p className="eyebrow">YOUR HOME, IN GOOD HANDS</p>
          <h1>Request a booking</h1>

          <p className="booking-subtitle">
            Tell us a little about the job and when you need help.
          </p>

          <form className="booking-form" onSubmit={handleSubmit}>
            <label htmlFor="customerName">Your full name</label>
            <input
              id="customerName"
              name="customerName"
              value={form.customerName}
              onChange={handleChange}
              placeholder="Enter your full name"
              autoComplete="name"
              required
              maxLength={100}
            />

            <label htmlFor="phone">Phone number</label>
            <input
              id="phone"
              name="phone"
              type="tel"
              value={form.phone}
              onChange={handleChange}
              placeholder="Enter your contact number"
              autoComplete="tel"
              required
              maxLength={25}
            />

            <label htmlFor="address">Service address</label>
            <textarea
              id="address"
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="House number, street and area"
              autoComplete="street-address"
              rows={3}
              required
              maxLength={500}
            />

            <div className="booking-form-row">
              <div>
                <label htmlFor="date">Preferred date</label>
                <input
                  id="date"
                  name="date"
                  type="date"
                  value={form.date}
                  min={minDate}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label htmlFor="time">Preferred time</label>
                <select
                  id="time"
                  name="time"
                  value={form.time}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select time</option>
                  <option value="09:00">9:00 AM</option>
                  <option value="11:00">11:00 AM</option>
                  <option value="13:00">1:00 PM</option>
                  <option value="15:00">3:00 PM</option>
                  <option value="17:00">5:00 PM</option>
                </select>
              </div>
            </div>

            <label htmlFor="details">Describe the job (optional)</label>
            <textarea
              id="details"
              name="details"
              value={form.details}
              onChange={handleChange}
              placeholder="Tell us what needs to be fixed..."
              rows={3}
              maxLength={1000}
            />

            {error && (
              <p className="booking-error" role="alert">
                {error}
              </p>
            )}

            <button className="booking-submit" type="submit">
              <ClipboardCheck size={18} />
              Submit booking request
            </button>

            <p className="booking-disclaimer">
              Demo only: submitting this form does not contact a real
              professional or confirm an appointment.
            </p>
          </form>
        </div>

        <aside className="booking-summary">
          <p className="section-eyebrow">YOUR SELECTED PROFESSIONAL</p>

          <div className="booking-professional-icon">
            {professional.icon}
          </div>

          <h2>{professional.name}</h2>
          <p>{professional.service}</p>

          <div className="booking-summary-row">
            <MapPin size={17} />
            <span>{professional.city}, Pakistan</span>
          </div>

          <div className="booking-summary-row">
            <CalendarDays size={17} />
            <span>Your preferred date and time</span>
          </div>

          <div className="booking-total">
            <span>Starting price</span>
            <strong>
              PKR {professional.price.toLocaleString('en-PK')}
            </strong>
          </div>

          <p className="booking-disclaimer">
            This is an estimated starting price, not a final quote.
          </p>
        </aside>
      </section>
    </main>
  );
}

export default Booking;
