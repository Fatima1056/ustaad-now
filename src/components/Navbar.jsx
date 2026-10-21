
import { useState } from 'react';
import { NavLink } from 'react-router-dom';
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
          ustaad<span>now</span>
          <span className="brand-dot">.</span>
        </span>
      </NavLink>

      <button
        type="button"
        className="mobile-menu-toggle"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
        aria-expanded={menuOpen}
      >
        {menuOpen ? <X size={23} /> : <Menu size={23} />}
      </button>

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

      <NavLink
        to="/services"
        className="nav-cta"
        onClick={closeMenu}
      >
        <span>Find a Service</span>
        <ArrowUpRight size={17} strokeWidth={1.8} />
      </NavLink>
    </header>
  );
}

export default Navbar;