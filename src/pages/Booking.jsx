
import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  CalendarDays,
  MapPin,
  ClipboardCheck,
} from 'lucide-react';

import { supabase } from '../lib/supabaseClient';
import professionals from '../data/professionals';
import '../Services.css';

function Booking() {
  const { id } = useParams();
  const navigate = useNavigate();

  const professional = professionals.find(
    (item) => item.id === Number(id)
  );

  const [user, setUser] = useState(null);
  const [checkingUser, setCheckingUser] = useState(true);
  const [submitting, setSubmitting] = useState(false);
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

  useEffect(() => {
    async function loadUser() {
      const { data, error } = await supabase.auth.getUser();

      if (error || !data.user) {
        navigate('/login', {
          replace: true,
          state: { from: `/professionals/${id}/book` },
        });
        return;
      }

      if (data.user.user_metadata?.role !== 'customer') {
        setError('Please sign in with a customer account to book a service.');
        setCheckingUser(false);
        return;
      }

      setUser(data.user);

      setForm((previous) => ({
        ...previous,
        customerName: data.user.user_metadata?.full_name || '',
        phone: data.user.user_metadata?.phone || '',
        address: data.user.user_metadata?.address || '',
      }));

      setCheckingUser(false);
    }

    loadUser();
  }, [id, navigate]);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previousForm) => ({
      ...previousForm,
      [name]: value,
    }));

    setError('');
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');

    if (!user) {
      setError('Please sign in with a customer account first.');
      return;
    }

    if (!professional) {
      setError('We could not find this professional.');
      return;
    }

    if (!professional.available) {
      setError('This professional is currently unavailable.');
      return;
    }

    setSubmitting(true);

    try {
      const bookingData = {
        customer_id: user.id,
        professional_id: String(professional.id),
        professional_name: professional.name,
        service: professional.service,
        city: professional.city || null,
        customer_name: form.customerName.trim(),
        phone: form.phone.trim(),
        address: form.address.trim(),
        booking_date: form.date,
        booking_time: form.time,
        details: form.details.trim() || null,
        price: Number(professional.price) || 0,
      };

      const { data, error: bookingError } = await supabase
        .from('bookings')
        .insert(bookingData)
        .select()
        .single();

      if (bookingError) {
        throw bookingError;
      }

      const booking = {
        id: data.id,
        professionalId: professional.id,
        professionalName: data.professional_name,
        service: data.service,
        city: data.city,
        price: Number(data.price),
        customerName: data.customer_name,
        phone: data.phone,
        address: data.address,
        date: data.booking_date,
        time: data.booking_time,
        details: data.details || '',
        status: data.status,
        createdAt: data.created_at,
      };

      navigate('/booking-confirmation', {
        state: { booking },
      });
    } catch (err) {
      setError(
        err.message ||
          'We could not save your booking. Please try again.'
      );
    } finally {
      setSubmitting(false);
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

  if (checkingUser) {
    return (
      <main className="booking-page">
        <div className="booking-card">
          <p>Checking your account...</p>
        </div>
      </main>
    );
  }

  if (!user || user.user_metadata?.role !== 'customer') {
    return (
      <main className="booking-page">
        <div className="booking-card">
          <h1>Customer sign-in required</h1>
          <p className="booking-subtitle">
            Please sign in with your customer account to book a service.
          </p>
          {error && (
            <p className="booking-error" role="alert">{error}</p>
          )}
          <Link to="/login" className="details-back-link">
            Go to login
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
              maxLength={100}
              required
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
              maxLength={25}
              required
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
              maxLength={500}
              required
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

            <button
              className="booking-submit"
              type="submit"
              disabled={submitting}
            >
              <ClipboardCheck size={18} />
              {submitting ? 'Saving booking...' : 'Submit booking request'}
            </button>

            <p className="booking-disclaimer">
              Your request will be saved to your NextFix account.
              It remains pending until handled by the professional.
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
              PKR {Number(professional.price).toLocaleString('en-PK')}
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
