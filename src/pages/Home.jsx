
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  MapPin,
  ChevronDown,
  ArrowRight,
  Wrench,
  Lightbulb,
  Snowflake,
  Sparkles,
  Paintbrush,
  Settings,
} from 'lucide-react';

import '../App.css';

function Home() {
  const [city, setCity] = useState(
    () => sessionStorage.getItem('NextFix-city') || ''
  );

  const navigate = useNavigate();

  const cities = [
    'Faisalabad',
    'Lahore',
    'Karachi',
    'Islamabad',
    'Rawalpindi',
    'Multan',
    'Peshawar',
    'Gujranwala',
    'Sialkot',
    'Hyderabad',
  ];

  const popularServices = [
    {
      name: 'Plumbing',
      description: 'Leaks, taps, pipes and repairs.',
      price: 'From PKR 800',
      icon: Wrench,
      category: 'Repairs',
      image:
        'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?auto=format&fit=crop&w=900&q=80',
      imageAlt: 'Plumbing tools and home repair work',
    },
    {
      name: 'Electrical Work',
      description: 'Switches, wiring and electrical fixes.',
      price: 'From PKR 1,000',
      icon: Lightbulb,
      category: 'Repairs',
      image:
        'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=900&q=80',
      imageAlt: 'Electrician working on wiring',
    },
    {
      name: 'AC Repair',
      description: 'Cooling issues and AC maintenance.',
      price: 'From PKR 1,200',
      icon: Snowflake,
      category: 'Appliances',
      image:
        'https://images.unsplash.com/photo-1631545806609-8e7c0c9a5f1c?auto=format&fit=crop&w=900&q=80',
      imageAlt: 'Air conditioning repair service',
    },
    {
      name: 'Home Cleaning',
      description: 'A little help keeping your home fresh.',
      price: 'From PKR 1,500',
      icon: Sparkles,
      category: 'Home Care',
      image:
        'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=900&q=80',
      imageAlt: 'Home cleaning service',
    },
    {
      name: 'Painting',
      description: 'Refresh your walls and living spaces.',
      price: 'From PKR 3,000',
      icon: Paintbrush,
      category: 'Home Care',
      image:
        'https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&w=900&q=80',
      imageAlt: 'Painter refreshing an interior wall',
    },
    {
      name: 'Appliance Repair',
      description: 'Help with everyday household appliances.',
      price: 'From PKR 1,500',
      icon: Settings,
      category: 'Appliances',
      image:
        'https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=900&q=80',
      imageAlt: 'Household appliance maintenance',
    },
  ];

  function handleCitySubmit(event) {
    event.preventDefault();

    if (!city) {
      alert('Please select your city first.');
      return;
    }

    sessionStorage.setItem('NextFix-city', city);

    navigate('/services', {
      state: { city },
    });
  }

  function handleServiceClick(serviceName, category) {
    const selectedCity =
      city || sessionStorage.getItem('NextFix-city') || '';

    navigate('/services', {
      state: {
        city: selectedCity,
        category,
        service: serviceName,
      },
    });
  }

  return (
    <main>
      {/* HERO SECTION */}
      <section className="hero">
        <div className="hero-content">
          <div className="eyebrow">
            <span className="status-dot"></span>
            YOUR HOME, IN GOOD HANDS
          </div>

          <h1>
            Home Problems?
            <br />
            <span>Consider it</span>
            <br />
            <span className="highlight">Handled.</span>
          </h1>

          <p className="hero-description">
            From a leaky tap to a fresh coat of paint,
            find trusted professionals for all your home
            needs — without the hassle.
          </p>

          <form
            className="search-box"
            onSubmit={handleCitySubmit}
          >
            <MapPin
              className="location-icon"
              size={23}
              aria-hidden="true"
            />

            <div className="city-select-wrapper">
              <select
                className="city-select"
                name="city"
                value={city}
                onChange={(event) => {
                  const selectedCity = event.target.value;
                  setCity(selectedCity);

                  if (selectedCity) {
                    sessionStorage.setItem(
                      'NextFix-city',
                      selectedCity
                    );
                  }
                }}
                aria-label="Select your city"
                required
              >
                <option value="" disabled>
                  Select your city
                </option>

                {cities.map((cityName) => (
                  <option key={cityName} value={cityName}>
                    {cityName}
                  </option>
                ))}
              </select>

              <ChevronDown
                className="city-select-arrow"
                size={17}
                aria-hidden="true"
              />
            </div>

            <button type="submit">
              Find a Professional
              <ArrowRight size={16} aria-hidden="true" />
            </button>
          </form>

          <div className="hero-trust">
            <div className="trust-avatars" aria-hidden="true">
              <span>👨🏻</span>
              <span>👩🏽</span>
              <span>👨🏽</span>
            </div>

            <p>
              <strong>Local professionals.</strong>
              <br />
              Help when you need it.
            </p>
          </div>
        </div>

        <div className="hero-visual">
          <div className="image-frame">
            <img
              src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=1100&q=85"
              alt="Professional electrician working on a home repair"
            />

            <div className="image-label">
              <span className="label-icon">✓</span>

              <div>
                <strong>Help is on the way</strong>
                <p>Your home deserves the best.</p>
              </div>
            </div>
          </div>

          <div className="floating-note">
            <span className="note-icon">✳</span>

            <div>
              <strong>One home.</strong>
              <br />
              <span>Many solutions.</span>
            </div>
          </div>

          <div className="decorative-circle"></div>
        </div>
      </section>

      {/* INTRODUCTION */}
      <section className="services-intro" id="about">
        <div>
          <span className="section-eyebrow">
            WHAT WE CAN HELP WITH
          </span>

          <h2>
            Your home, <span>our priority.</span>
          </h2>
        </div>

        <p>
          Reliable help for the little things and the big things
          that make a house feel like home.
        </p>
      </section>

      {/* POPULAR SERVICES */}
      <section className="popular-services">
        <div className="popular-services-heading">
          <div>
            <span className="section-eyebrow">
              EVERYDAY HOME ESSENTIALS
            </span>

            <h2>
              What can we help you <span>fix?</span>
            </h2>
          </div>

          <button
            type="button"
            className="all-services-link"
            onClick={() => navigate('/services')}
          >
            Explore all services
            <ArrowRight size={17} aria-hidden="true" />
          </button>
        </div>

        <div className="popular-services-grid">
          {popularServices.map((service) => {
            const ServiceIcon = service.icon;

            return (
              <button
                type="button"
                className="popular-service-card"
                key={service.name}
                onClick={() =>
                  handleServiceClick(
                    service.name,
                    service.category
                  )
                }
                aria-label={`Explore ${service.name} professionals`}
              >
                <div className="popular-service-image">
                  <img
                    src={service.image}
                    alt={service.imageAlt}
                    loading="lazy"
                  />
                </div>

                <div className="popular-service-icon">
                  <ServiceIcon
                    size={25}
                    strokeWidth={1.7}
                    aria-hidden="true"
                  />
                </div>

                <div className="popular-service-content">
                  <h3>{service.name}</h3>

                  <p>{service.description}</p>

                  <span className="popular-service-price">
                    {service.price}
                  </span>
                </div>

                <span
                  className="popular-service-arrow"
                  aria-hidden="true"
                >
                  <ArrowRight size={18} />
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* CUSTOMER AND PROFESSIONAL PATHWAYS */}
      <section className="role-pathways" id="get-started">
        <div className="role-pathways-heading">
          <span className="section-eyebrow">MADE FOR YOU</span>

          <h2>
            What brings you <span>to NextFix?</span>
          </h2>

          <p>
            Whether you need a hand at home or have a skill
            to share, there is a place for you here.
          </p>
        </div>

        <div className="role-pathways-grid">
          <article className="role-pathway-card customer-pathway">
            <span className="role-pathway-number">
              01 / CUSTOMER
            </span>

            <h3>Your home, taken care of.</h3>

            <p>
              Discover home services, compare professional
              profiles, and arrange a booking that works for you.
            </p>

            <button
              type="button"
              className="role-pathway-button"
              onClick={() => navigate('/services')}
            >
              Find a Professional
              <ArrowRight size={17} aria-hidden="true" />
            </button>
          </article>

          <article className="role-pathway-card professional-pathway">
            <span className="role-pathway-number">
              02 / PROFESSIONAL
            </span>

            <h3>Let your skills open doors.</h3>

            <p>
              Create a professional account or sign in to
              access your NextFix professional dashboard.
            </p>

            <button
              type="button"
              className="role-pathway-button"
              onClick={() =>
                navigate('/signup', {
                  state: { role: 'professional' },
                })
              }
            >
              Join as a Professional
              <ArrowRight size={17} aria-hidden="true" />
            </button>
          </article>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="how-it-works">
        <div className="how-it-works-heading">
          <span className="section-eyebrow">
            SIMPLE BY DESIGN
          </span>

          <h2>
            Good help, <span>without the hassle.</span>
          </h2>

          <p>
            Getting help around the house should feel easy.
          </p>
        </div>

        <div className="steps-grid">
          <article className="step-card">
            <span className="step-number">01</span>
            <h3>Choose your service</h3>
            <p>
              Tell us what needs fixing and select your city.
            </p>
          </article>

          <article className="step-card">
            <span className="step-number">02</span>
            <h3>Explore professionals</h3>
            <p>
              Browse available listings and compare their details.
            </p>
          </article>

          <article className="step-card">
            <span className="step-number">03</span>
            <h3>Arrange your booking</h3>
            <p>
              Choose a professional and continue to the booking form.
            </p>
          </article>
        </div>

        <button
          type="button"
          className="how-it-works-cta"
          onClick={() => navigate('/services')}
        >
          Find your professional
          <ArrowRight size={17} aria-hidden="true" />
        </button>

      </section>

      {/* FOOTER */}
      <footer className="site-footer">
        <div className="site-footer-main">
          <div className="footer-brand">
            <Link to="/" className="footer-logo">
              NEXTFIX<span>.</span>
            </Link>

            <p>
              Your home, in good hands. Find local professionals
              for everyday home repairs and services.
            </p>
          </div>

          <div className="footer-links">
            <h3>Explore</h3>
            <Link to="/">Home</Link>
            <Link to="/services">All Services</Link>
            <Link to="/#get-started">Get Started</Link>
          </div>

          <div className="footer-links">
            <h3>Your Account</h3>
            <Link to="/login">Sign In</Link>
            <Link to="/signup">Create an Account</Link>
            <Link to="/customer/dashboard">Customer Dashboard</Link>
            <Link to="/professional/dashboard">
              Professional Dashboard
            </Link>
          </div>

          <div className="footer-contact">
            <h3>Need Help?</h3>
            <p>We're here to help you find the right service.</p>
            <a href="tel:+92XXXXXXXXXX">
              +92 XXX XXXXXXX
            </a>
            <p className="footer-contact-note">
              Temporary contact number — update before launch.
            </p>
          </div>
        </div>

        <div className="site-footer-bottom">
          <p>© {new Date().getFullYear()} NextFix. All rights reserved.</p>
          <p>Made for better homes.</p>
        </div>
      </footer>
    </main>
  );
}

export default Home;
