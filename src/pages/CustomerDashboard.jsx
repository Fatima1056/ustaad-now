
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  CalendarDays,
  Search,
  UserRound,
  LogOut,
  LayoutDashboard,
} from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

function CustomerDashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let active = true;

    async function loadDashboard() {
      try {
        const { data, error } = await supabase.auth.getUser();

        if (error || !data.user) {
          navigate('/login', { replace: true });
          return;
        }

        const currentUser = data.user;
        const role = currentUser.user_metadata?.role;

        if (role === 'professional') {
          navigate('/professional/dashboard', { replace: true });
          return;
        }

        if (role !== 'customer') {
          navigate('/login', { replace: true });
          return;
        }

        if (!active) return;
        setUser(currentUser);

        const { data: bookingData, error: bookingError } =
          await supabase
            .from('bookings')
            .select('*')
            .eq('customer_id', currentUser.id)
            .order('created_at', { ascending: false });

        if (bookingError) {
          setErrorMessage(
            'Your account loaded, but bookings could not be retrieved.'
          );
        } else if (active) {
          setBookings(bookingData ?? []);
        }
      } catch {
        if (active) {
          setErrorMessage('Unable to load your dashboard. Please try again.');
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadDashboard();

    return () => {
      active = false;
    };
  }, [navigate]);

  async function handleLogout() {
    const { error } = await supabase.auth.signOut();

    if (error) {
      setErrorMessage('Unable to log out. Please try again.');
      return;
    }

    navigate('/', { replace: true });
  }

  if (loading) {
    return <main className="dashboard-page">Loading your dashboard...</main>;
  }

  const name = user?.user_metadata?.full_name || 'Customer';
  const pendingCount = bookings.filter(
    (booking) => booking.status === 'Pending'
  ).length;
  const completedCount = bookings.filter(
    (booking) => booking.status === 'Completed'
  ).length;

  return (
    <main className="dashboard-page">
      <aside className="dashboard-sidebar">
        <Link to="/" className="dashboard-brand">
          Next<span>Fix</span>.
        </Link>

        <nav className="dashboard-nav">
          <Link to="/customer/dashboard" className="dashboard-nav-link active">
            <LayoutDashboard size={18} />
            Overview
          </Link>

          <Link to="/services" className="dashboard-nav-link">
            <Search size={18} />
            Explore Services
          </Link>

          <Link to="/customer/profile" className="dashboard-nav-link">
            <UserRound size={18} />
            My Profile
          </Link>
        </nav>

        <button
          type="button"
          className="dashboard-logout"
          onClick={handleLogout}
        >
          <LogOut size={18} />
          Log Out
        </button>
      </aside>

      <section className="dashboard-content">
        <header className="dashboard-header">
          <div>
            <p className="dashboard-eyebrow">CUSTOMER DASHBOARD</p>
            <h1>Welcome back, {name}!</h1>
            <p>Manage your home service bookings in one place.</p>
          </div>

          <Link to="/services" className="dashboard-primary-button">
            Find a Service
          </Link>
        </header>

        {errorMessage && (
          <p className="auth-error" role="alert">
            {errorMessage}
          </p>
        )}

        <section className="dashboard-stats">
          <article className="dashboard-stat-card">
            <CalendarDays size={22} />
            <p>Total Bookings</p>
            <h2>{bookings.length}</h2>
          </article>

          <article className="dashboard-stat-card">
            <CalendarDays size={22} />
            <p>Pending Requests</p>
            <h2>{pendingCount}</h2>
          </article>

          <article className="dashboard-stat-card">
            <CalendarDays size={22} />
            <p>Completed Services</p>
            <h2>{completedCount}</h2>
          </article>
        </section>

        <section className="dashboard-bookings">
          <div className="dashboard-section-heading">
            <div>
              <h2>Recent Bookings</h2>
              <p>Keep track of your service requests.</p>
            </div>
          </div>

          {bookings.length === 0 ? (
            <div className="dashboard-empty-state">
              <CalendarDays size={32} />
              <h3>No bookings yet</h3>
              <p>Your service bookings will appear here.</p>
              <Link to="/services" className="dashboard-primary-button">
                Explore Services
              </Link>
            </div>
          ) : (
            <div className="dashboard-booking-list">
              {bookings.map((booking) => (
                <article
                  className="dashboard-booking-card"
                  key={booking.id}
                >
                  <div>
                    <h3>{booking.service}</h3>
                    <p>Professional: {booking.professional_name}</p>
                    <p>
                      Date: {booking.booking_date} · {booking.booking_time}
                    </p>
                    <p>Address: {booking.address}</p>
                  </div>

                  <div className="dashboard-booking-meta">
                    <span className="dashboard-booking-status">
                      {booking.status}
                    </span>
                    <p>Rs. {Number(booking.price).toLocaleString()}</p>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </section>
    </main>
  );
}

export default CustomerDashboard;
