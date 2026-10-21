import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, ChevronDown, ArrowRight } from 'lucide-react';
import '../App.css';

function Home() {
  const [city, setCity] = useState('');
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

  function handleCitySubmit(event) {
    event.preventDefault();

    if (!city) {
      alert('Please select your city first.');
      return;
    }

    // Save the selected city for the next page.
    sessionStorage.setItem('ustaadnow-city', city);

    // Open the Services page.
    navigate('/services', { state: { city } });
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

          {/* CITY SELECTION */}
          <form className="search-box" onSubmit={handleCitySubmit}>
            <MapPin className="location-icon" size={23} />

            <div className="city-select-wrapper">
              <select
                className="city-select"
                name="city"
                value={city}
                onChange={(event) => setCity(event.target.value)}
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

              <ChevronDown className="city-select-arrow" size={17} />
            </div>

            <button type="submit">
              Find an Ustaad <ArrowRight size={16} />
            </button>
          </form>

          <div className="hero-trust">
            <div className="trust-avatars">
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

        {/* HERO IMAGE */}
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

      {/* HOMEPAGE INTRODUCTION */}
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

      {/* POPULAR SERVICES ARE ON Services.jsx */}
    </main>
  );
}

export default Home;