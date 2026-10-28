
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

function CustomerProfile() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadProfile() {
      const { data, error } = await supabase.auth.getUser();

      if (error || !data.user) {
        navigate('/login', { replace: true });
        return;
      }

      const currentUser = data.user;

      if (currentUser.user_metadata?.role !== 'customer') {
        navigate(
          currentUser.user_metadata?.role === 'professional'
            ? '/professional/dashboard'
            : '/',
          { replace: true }
        );
        return;
      }

      setUser(currentUser);
      setFullName(currentUser.user_metadata?.full_name || '');
      setPhone(currentUser.user_metadata?.phone || '');
      setAddress(currentUser.user_metadata?.address || '');
      setLoading(false);
    }

    loadProfile();
  }, [navigate]);

  async function saveProfile(event) {
    event.preventDefault();
    setSaving(true);
    setMessage('');
    setError('');

    const { data, error } = await supabase.auth.updateUser({
      data: {
        full_name: fullName.trim(),
        phone: phone.trim(),
        address: address.trim(),
      },
    });

    if (error) {
      setError(error.message);
    } else {
      setUser(data.user);
      setMessage('Your profile has been updated successfully.');
    }

    setSaving(false);
  }

  async function handleLogout() {
    const { error } = await supabase.auth.signOut();

    if (error) {
      setError(error.message);
      return;
    }

    navigate('/', { replace: true });
  }

  if (loading) {
    return <main className="auth-page"><p>Loading your profile...</p></main>;
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <p className="auth-eyebrow">YOUR NEXTFIX ACCOUNT</p>
        <h1>My Profile</h1>
        <p className="auth-description">
          Manage your personal details and contact information.
        </p>

        <form className="auth-form" onSubmit={saveProfile}>
          <label htmlFor="profile-name">Full name</label>
          <input
            id="profile-name"
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
            required
          />

          <label htmlFor="profile-email">Email address</label>
          <input id="profile-email" type="email" value={user.email || ''} disabled />

          <label htmlFor="profile-phone">Phone number</label>
          <input
            id="profile-phone"
            type="tel"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            placeholder="Enter your phone number"
          />

          <label htmlFor="profile-address">Home address</label>
          <textarea
            id="profile-address"
            value={address}
            onChange={(event) => setAddress(event.target.value)}
            placeholder="Enter your address"
            rows={3}
          />

          {error && <p className="auth-error" role="alert">{error}</p>}
          {message && <p className="auth-success" role="status">{message}</p>}

          <button className="auth-button" type="submit" disabled={saving}>
            {saving ? 'Saving...' : 'Save profile'}
          </button>
        </form>

        <button
          className="auth-button"
          type="button"
          onClick={handleLogout}
          style={{ marginTop: '12px' }}
        >
          Log out
        </button>
      </section>
    </main>
  );
}

export default CustomerProfile;
