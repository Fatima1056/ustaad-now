
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserRound, Wrench, Eye, EyeOff } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import './Signup.css';

function Signup() {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState('customer');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  async function handleSignup(event) {
    event.preventDefault();
    setError('');
    setMessage('');

    if (password.length < 8) {
      setError('Your password must be at least 8 characters long.');
      return;
    }

    setLoading(true);

    try {
      const { data, error: signupError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: fullName.trim(),
            role,
          },
          emailRedirectTo: `${window.location.origin}/login`,
        },
      });

      if (signupError) {
        throw signupError;
      }

      if (data.session && data.user) {
        navigate(
          role === 'professional'
            ? '/professional/dashboard'
            : '/customer/dashboard',
          { replace: true }
        );
      } else {
        setMessage(
          'Your account has been created! Check your email for a confirmation link. After confirming your email, sign in to continue.'
        );
      }
    } catch (err) {
      setError(
        err.message || 'Unable to create your account. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page signup-page">
      <section className="auth-card signup-card">
        <div className="signup-brand-mark" aria-hidden="true">
          <Wrench size={23} strokeWidth={1.8} />
        </div>

        <p className="auth-eyebrow">JOIN THE NEXTFIX COMMUNITY</p>

        <h1>Create your account.</h1>

        <p className="auth-description">
          Find trusted home services or connect with customers who need your
          skills.
        </p>

        <form onSubmit={handleSignup} className="auth-form">
          <div className="signup-field">
            <label htmlFor="signup-name">Full name</label>
            <input
              id="signup-name"
              type="text"
              placeholder="Enter your full name"
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              autoComplete="name"
              required
            />
          </div>

          <div className="signup-field">
            <label htmlFor="signup-email">Email address</label>
            <input
              id="signup-email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              required
            />
          </div>

          <div className="signup-field">
            <label htmlFor="signup-password">Create a password</label>

            <div className="signup-password-wrapper">
              <input
                id="signup-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="At least 8 characters"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="new-password"
                minLength={8}
                required
              />

              <button
                type="button"
                className="signup-password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>

            <span className="signup-field-hint">
              Use at least 8 characters.
            </span>
          </div>

          <fieldset className="signup-role-fieldset">
            <legend>How would you like to use NextFix?</legend>

            <div className="auth-role-options">
              <label
                className={`auth-role-option ${
                  role === 'customer' ? 'selected' : ''
                }`}
              >
                <input
                  type="radio"
                  name="role"
                  value="customer"
                  checked={role === 'customer'}
                  onChange={() => setRole('customer')}
                />

                <span className="signup-role-icon">
                  <UserRound size={22} />
                </span>

                <span className="auth-role-title">I'm a Customer</span>

                <span className="auth-role-description">
                  Find and book home services.
                </span>
              </label>

              <label
                className={`auth-role-option ${
                  role === 'professional' ? 'selected' : ''
                }`}
              >
                <input
                  type="radio"
                  name="role"
                  value="professional"
                  checked={role === 'professional'}
                  onChange={() => setRole('professional')}
                />

                <span className="signup-role-icon">
                  <Wrench size={22} />
                </span>

                <span className="auth-role-title">I'm a Professional</span>

                <span className="auth-role-description">
                  Offer services to customers.
                </span>
              </label>
            </div>
          </fieldset>

          {error && (
            <p className="auth-error" role="alert">
              {error}
            </p>
          )}

          {message && (
            <p className="auth-success" role="status">
              {message}
            </p>
          )}

          <button
            type="submit"
            className="auth-button"
            disabled={loading}
          >
            {loading ? 'Creating account...' : 'Create account'}
          </button>

          <p className="signup-terms">
            By creating an account, you agree to use NextFix responsibly.
          </p>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>

        <p className="signup-back-home">
          <Link to="/">← Back to exploring NextFix</Link>
        </p>
      </section>
    </main>
  );
}

export default Signup;
