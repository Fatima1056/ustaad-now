
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  MapPin,
  Star,
  BriefcaseBusiness,
  CalendarCheck,
  ShieldCheck,
} from 'lucide-react';
import professionals from '../data/professionals';
import '../Services.css';

function ProfessionalDetails() {
  const { id } = useParams();

  const professional = professionals.find(
    (item) => item.id === Number(id)
  );

  if (!professional) {
    return (
      <main className="professional-details-page">
        <div className="no-services">
          <h1>Professional not found</h1>
          <p>This professional may no longer be available.</p>
          <Link to="/services" className="details-back-link">
            Back to services
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="professional-details-page">
      <Link to="/services" className="details-back-link">
        <ArrowLeft size={17} />
        Back to professionals
      </Link>

      <section className="professional-profile">
        <div className="profile-icon" aria-hidden="true">
          {professional.icon}
        </div>

        <p className="service-category">{professional.service}</p>

        <h1>{professional.name}</h1>

        <p className="profile-location">
          <MapPin size={17} />
          {professional.city}, Pakistan
        </p>

        <div className="profile-stats">
          <div>
            <Star size={19} fill="currentColor" />
            <strong>{professional.rating.toFixed(1)}</strong>
            <span>{professional.reviews} sample reviews</span>
          </div>

          <div>
            <BriefcaseBusiness size={19} />
            <strong>{professional.experience}</strong>
            <span>Experience</span>
          </div>

          <div>
            <ShieldCheck size={19} />
            <strong>
              {professional.available ? 'Available' : 'Unavailable'}
            </strong>
            <span>Demo status</span>
          </div>
        </div>

        <div className="profile-price-panel">
          <div>
            <span>Starting price</span>
            <h2>
              PKR {professional.price.toLocaleString('en-PK')}
            </h2>
            <p>Final price depends on the work required.</p>
          </div>

         <Link
  to={`/professionals/${professional.id}/book`}
  className="profile-book-button"
>
  <CalendarCheck size={18} />
  Request booking
        </Link>
        </div>

        <p className="profile-demo-notice">
          This is a demonstration profile. Ratings, reviews, availability,
          and professional information are sample data and have not been
          independently verified.
        </p>
      </section>
    </main>
  );
}

export default ProfessionalDetails;
