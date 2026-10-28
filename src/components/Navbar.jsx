
import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import {
  ArrowUpRight,
  Menu,
  X,
  Wrench,
} from 'lucide-react';

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <header className="navbar">
      {/* LEFT: UstaadNow brand */}
      <NavLink
        to="/"
        className="brand"
        onClick={closeMenu}
        aria-label="UstaadNow home"
      >
        <span className="brand-icon">
          <Wrench size={21} strokeWidth={1.8} />
        </span>

        <span className="brand-name">
          Next<span>Fix</span>
          <span className="brand-dot">.</span>
        </span>
      </NavLink>

      {/* MOBILE MENU BUTTON */}
      <button
        type="button"
        className="mobile-menu-toggle"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
        aria-expanded={menuOpen}
      >
        {menuOpen ? <X size={23} /> : <Menu size={23} />}
      </button>

      {/* MIDDLE: Main navigation */}
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

      {/* RIGHT: Actions */}
      <div className="navbar-actions">
        <Link
          to="/professional/dashboard"
          className="professional-portal-link"
          onClick={closeMenu}
        >
          Professional Portal
        </Link>

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
