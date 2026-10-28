
import { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import {
  ArrowUpRight,
  Menu,
  X,
  Wrench,
  CircleUserRound,
  ChevronDown,
  LayoutDashboard,
  CalendarDays,
  UserRound,
  LogOut,
} from 'lucide-react';

import { supabase } from '../lib/supabaseClient';

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadUser() {
      const { data, error } = await supabase.auth.getSession();

      if (!active || error) return;

      const currentUser = data.session?.user ?? null;

      setUser(currentUser);
      setRole(currentUser?.user_metadata?.role ?? null);
    }

    loadUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!active) return;

      const currentUser = session?.user ?? null;

      setUser(currentUser);
      setRole(currentUser?.user_metadata?.role ?? null);
      setProfileOpen(false);
      setMenuOpen(false);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  function closeMenu() {
    setMenuOpen(false);
    setProfileOpen(false);
  }

  async function handleLogout() {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error('Logout failed:', error.message);
      return;
    }

    closeMenu();
    window.location.assign('/');
  }

  const profilePath =
    role === 'professional'
      ? '/professional/dashboard'
      : '/customer/profile';

  const profileLabel =
    role === 'professional' ? 'Professional' : 'Customer';

  return (
    <header className="navbar">
      {/* Brand */}
      <NavLink
        to="/"
        className="brand"
        onClick={closeMenu}
        aria-label="NextFix home"
      >
        <span className="brand-icon">
          <Wrench size={21} strokeWidth={1.8} />
        </span>

        <span className="brand-name">
          Next<span>Fix</span>
          <span className="brand-dot">.</span>
        </span>
      </NavLink>

      {/* Mobile menu button */}
      <button
        type="button"
        className="mobile-menu-toggle"
        onClick={() => setMenuOpen((open) => !open)}
        aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
        aria-expanded={menuOpen}
      >
        {menuOpen ? <X size={23} /> : <Menu size={23} />}
      </button>

      {/* Main navigation */}
      <nav className={`nav-links ${menuOpen ? 'menu-open' : ''}`}>
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            isActive ? 'nav-link active' : 'nav-link'
          }
          onClick={closeMenu}
        >
          Home
        </NavLink>

        <NavLink
          to="/services"
          className={({ isActive }) =>
            isActive ? 'nav-link active' : 'nav-link'
          }
          onClick={closeMenu}
        >
          Services
        </NavLink>
      </nav>

      {/* Account actions */}
      <div className="navbar-actions">
        {!user ? (
          <>
            <Link
              to="/login"
              className="nav-login-link"
              onClick={closeMenu}
            >
              Log In
            </Link>

            <Link
              to="/signup"
              className="nav-signup-link"
              onClick={closeMenu}
            >
              Sign Up
            </Link>
          </>
        ) : (
          <div className="profile-menu-wrapper">
            <button
              type="button"
              className="profile-menu-trigger"
              onClick={() => setProfileOpen((open) => !open)}
              aria-expanded={profileOpen}
              aria-label="Open account menu"
            >
              <CircleUserRound size={25} />
              <span className="profile-role">{profileLabel}</span>
              <ChevronDown size={16} />
            </button>

            {profileOpen && (
              <div className="profile-dropdown">
                <Link
                  to={profilePath}
                  className="profile-dropdown-item"
                  onClick={closeMenu}
                >
                  <UserRound size={17} />
                  My Profile
                </Link>

                {role === 'professional' ? (
                  <Link
                    to="/professional/dashboard"
                    className="profile-dropdown-item"
                    onClick={closeMenu}
                  >
                    <LayoutDashboard size={17} />
                    Professional Dashboard
                  </Link>
                ) : role === 'customer' ? (
                  <Link
                    to="/customer/dashboard"
                    className="profile-dropdown-item"
                    onClick={closeMenu}
                  >
                    <CalendarDays size={17} />
                    My Bookings
                  </Link>
                ) : null}

                <button
                  type="button"
                  className="profile-dropdown-item logout-button"
                  onClick={handleLogout}
                >
                  <LogOut size={17} />
                  Log Out
                </button>
              </div>
            )}
          </div>
        )}

        <NavLink
          to="/services"
          className="nav-cta"
          onClick={closeMenu}
        >
          <span>Find a Service</span>
          <ArrowUpRight size={17} strokeWidth={1.8} />
        </NavLink>
      </div>
    </header>
  );
}

export default Navbar;
