
import { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { MapPin, ChevronDown, Star, BriefcaseBusiness } from 'lucide-react';

import professionals from '../data/professionals';
import '../Services.css';

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

const categories = [
  'All Services',
  'Repairs',
  'Home Care',
  'Appliances',
];

const categoryByService = {
  Plumbing: 'Repairs',
  'Electrical Work': 'Repairs',
  'Home Cleaning': 'Home Care',
  Painting: 'Home Care',
  'AC Repair': 'Appliances',
  'Appliance Repair': 'Appliances',
};

function Services() {
  const location = useLocation();

  const [city, setCity] = useState(() => (
    location.state?.city ||
    sessionStorage.getItem('NextFix-city') ||
    ''
  ));

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(
  () => location.state?.category || 'All Services'
);
 const [selectedService, setSelectedService] = useState(
  () => location.state?.service || ''
);

  function handleCityChange(event) {
    const selectedCity = event.target.value;

    setCity(selectedCity);

    if (selectedCity) {
      sessionStorage.setItem('NextFix-city', selectedCity);
    } else {
      sessionStorage.removeItem('NextFix-city');
    }
  }

  const filteredProfessionals = professionals.filter((professional) => {
    const matchesCity = (
      city !== '' && professional.city === city
    );

    const searchText = (
      professional.name +
      ' ' +
      professional.service +
      ' ' +
      professional.experience
    ).toLowerCase();

    const matchesSearch = searchText.includes(search.toLowerCase());

    const category = categoryByService[professional.service];

    const matchesCategory =
  selectedCategory === 'All Services' ||
  category === selectedCategory;

const matchesService =
  !selectedService ||
  professional.service === selectedService;

    return (
  matchesCity &&
  matchesSearch &&
  matchesCategory &&
  matchesService &&
  professional.available
);
  });

  return (
    <main className="services-page">
      <section className="services-heading">
        <p className="eyebrow">HELP FOR YOUR HOME</p>

        <h1>Find your local professional.</h1>

        <p className="services-subtitle">
          Explore home services and find the right help for your needs.
        </p>

        <div className="services-city-picker">
          <MapPin size={20} aria-hidden="true" />

          <label htmlFor="services-city">Your city</label>

          <div className="services-city-select-wrapper">
            <select
              id="services-city"
              value={city}
              onChange={handleCityChange}
            >
              <option value="">Select your city</option>

              {cities.map((cityName) => (
                <option key={cityName} value={cityName}>
                  {cityName}
                </option>
              ))}
            </select>

            <ChevronDown size={17} aria-hidden="true" />
          </div>
        </div>

        <p className="selected-city-message">
          {city
            ? `Showing professionals in ${city}.`
            : 'Choose a city to see available professionals.'}
        </p>

        <div className="service-search">
          <span aria-hidden="true">⌕</span>

          <input
            type="search"
            placeholder="Search a service or professional..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            aria-label="Search professionals and services"
          />
        </div>

        <div
          className="category-filters"
          aria-label="Service categories"
        >
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              className={
                selectedCategory === category
                  ? 'category-button selected'
                  : 'category-button'
              }
              onClick={() => {
  setSelectedCategory(category);
  setSelectedService('');
}}
              aria-pressed={selectedCategory === category}
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      <section className="services-results">
        <div className="results-heading">
          <h2>
            {city ? `Professionals in ${city}` : 'Local professionals'}
          </h2>

          <p>
            {filteredProfessionals.length}{' '}
            {filteredProfessionals.length === 1
              ? 'professional'
              : 'professionals'}
          </p>
        </div>

        {!city ? (
          <div className="no-services">
            <h3>Where do you need help?</h3>
            <p>Select your city above to explore local professionals.</p>
          </div>
        ) : filteredProfessionals.length > 0 ? (
          <div className="service-grid">
            {filteredProfessionals.map((professional) => (
              <article
                className="service-card professional-card"
                key={professional.id}
              >
                <div className="professional-card-image">
  <img
    src={professional.image}
    alt={`${professional.service} service`}
    loading="lazy"
  />

  <span className="professional-card-icon" aria-hidden="true">
    {professional.icon}
  </span>
</div>

                <p className="service-category">
                  {professional.service}
                </p>

                <h3>{professional.name}</h3>

                <p className="professional-location">
                  <MapPin size={14} aria-hidden="true" />
                  {professional.city}
                </p>

                <div className="professional-rating">
                  <Star
                    size={15}
                    fill="currentColor"
                    aria-hidden="true"
                  />
                  <strong>{professional.rating.toFixed(1)}</strong>
                  <span>({professional.reviews} sample reviews)</span>
                </div>

                <p className="professional-experience">
                  <BriefcaseBusiness size={15} aria-hidden="true" />
                  {professional.experience} experience
                </p>

                <div className="service-card-bottom">
                  <p className="service-price">
                    From PKR {professional.price.toLocaleString('en-PK')}
                  </p>

                  <Link
                    to={`/professionals/${professional.id}`}
                    className="service-action"
                  >
                    View <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="no-services">
            <h3>No professionals found</h3>

            <p>
              We don't have a matching demo listing in {city} yet.
              Try another service, category, or city.
            </p>

            <button
              type="button"
              className="category-button selected"
              onClick={() => {
                setSearch('');
                setSelectedCategory('All Services');
              }}
            >
              Clear filters
            </button>
          </div>
        )}
      </section>
    </main>
  );
}

export default Services;
