
import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  LayoutDashboard,
  UserRound,
  BriefcaseBusiness,
  CalendarDays,
  ShieldCheck,
  MapPin,
  Clock3,
  Save,
  Camera,
  CheckCircle2,
  Pencil,
  Trash2,
  Eye,
  Plus,
  ArrowUpRight,
  LogOut,
  FileCheck,
  AlertTriangle,
  X,
} from 'lucide-react';

import '../Dashboard.css';

const PROFILE_KEY = 'NextFix-professional-profile';

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

const emptyProfile = {
  name: '',
  city: '',
  phone: '',
  experience: '',
  skills: '',
  bio: '',
  photo: '',
};

const navigation = [
  { name: 'Overview', icon: LayoutDashboard },
  { name: 'My Profile', icon: UserRound },
  { name: 'My Services', icon: BriefcaseBusiness },
  { name: 'My Bookings', icon: CalendarDays },
  { name: 'Identity Verification', icon: ShieldCheck },
];

function loadProfile() {
  try {
    const savedProfile = localStorage.getItem(PROFILE_KEY);

    if (savedProfile) {
      return { ...emptyProfile, ...JSON.parse(savedProfile) };
    }
  } catch (error) {
    console.error('Could not load the profile:', error);
  }

  return { ...emptyProfile };
}

function ProfessionalDashboard() {
  const [activeTab, setActiveTab] = useState('Overview');
  const [profile, setProfile] = useState(loadProfile);
  const [isEditing, setIsEditing] = useState(!Boolean(loadProfile().name));
const [services, setServices] = useState(() => {
  try {
    return JSON.parse(localStorage.getItem('NextFix-professional-services')) || [];
  } catch {
    return [];
  }
});

const [showServiceForm, setShowServiceForm] = useState(false);
const [editingServiceId, setEditingServiceId] = useState(null);
const [serviceForm, setServiceForm] = useState({
  name: '',
  category: '',
  description: '',
  price: '',
  duration: '',
});
  const [verificationStatus, setVerificationStatus] =
    useState('not-submitted');

  const [verificationForm, setVerificationForm] = useState({
    legalName: '',
    demoReference: '',
    city: '',
    phone: '',
    consent: false,
  });

  const [verificationMessage, setVerificationMessage] = useState('');

  const [serviceMessage, setServiceMessage] = useState('');

  const profileComplete = Boolean(
    profile.name.trim() &&
      profile.city &&
      profile.experience &&
      profile.skills.trim() &&
      profile.bio.trim()
  );

  function updateProfile(event) {
    const { name, value } = event.target;

    setProfile((currentProfile) => ({
      ...currentProfile,
      [name]: value,
    }));
  }

  function updateServiceForm(event) {
    const { name, value } = event.target;
    setServiceForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  }

  function saveProfile(event) {
    event.preventDefault();

    if (
      !profile.name.trim() ||
      !profile.city ||
      !profile.experience ||
      !profile.skills.trim() ||
      !profile.bio.trim()
    ) {
      alert('Please complete all required profile fields.');
      return;
    }

    try {
      localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
      setIsEditing(false);
      setActiveTab('My Profile');
    } catch (error) {
      console.error('Could not save the profile:', error);
      alert('Your profile could not be saved in this browser.');
    }
  }

  function handlePhotoChange(event) {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file.');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert('Please select an image smaller than 2 MB.');
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      setProfile((currentProfile) => ({
        ...currentProfile,
        photo: reader.result,
      }));
    };

    reader.readAsDataURL(file);
  }

  function editProfile() {
    setIsEditing(true);
    setActiveTab('My Profile');
  }

  function updateVerificationForm(event) {
    const { name, value, type, checked } = event.target;

    setVerificationForm((currentForm) => ({
      ...currentForm,
      [name]: type === 'checkbox' ? checked : value,
    }));

    setVerificationMessage('');
  }

  function handleVerificationSubmit(event) {
    event.preventDefault();

    if (
      !verificationForm.legalName.trim() ||
      !verificationForm.demoReference.trim() ||
      !verificationForm.city ||
      !verificationForm.phone.trim() ||
      !verificationForm.consent
    ) {
      setVerificationMessage(
        'Please complete the demo fields and accept the consent statement.'
      );
      return;
    }

    // Demo only: no identity details are uploaded or saved.
    setVerificationStatus('pending');

    setVerificationMessage(
      'Demo submitted successfully. No identity information was uploaded or stored. This is not a real verification.'
    );

    setVerificationForm({
      legalName: '',
      demoReference: '',
      city: '',
      phone: '',
      consent: false,
    });
  }

  function resetDemoVerification() {
    setVerificationStatus('not-submitted');
    setVerificationMessage('');
    setVerificationForm({
      legalName: '',
      demoReference: '',
      city: '',
      phone: '',
      consent: false,
    });
  }

  function renderOverview() {
    return (
      <div className="dashboard-content">
        <div className="dashboard-welcome">
          <div>
            <span className="dashboard-eyebrow">YOUR WORKSPACE</span>
            <h1>
              Welcome{profile.name ? `, ${profile.name.split(' ')[0]}` : ''}.
            </h1>
            <p>
              Manage your professional profile and keep track of your work
              with NextFix.
            </p>
          </div>

          <button
            className="dashboard-primary-button"
            onClick={editProfile}
          >
            <Pencil size={17} />
            {profile.name ? 'Edit profile' : 'Create profile'}
          </button>
        </div>

        <div className="dashboard-stats">
          <div className="dashboard-stat-card">
            <span className="dashboard-stat-icon">
              <UserRound size={20} />
            </span>
            <span className="dashboard-stat-label">Profile status</span>
            <strong>{profileComplete ? 'Complete' : 'Incomplete'}</strong>
            <span className="dashboard-stat-note">
              {profileComplete
                ? 'Your main profile details are ready.'
                : 'Add your details to complete your profile.'}
            </span>
          </div>

          <div className="dashboard-stat-card">
            <span className="dashboard-stat-icon">
              <BriefcaseBusiness size={20} />
            </span>
            <span className="dashboard-stat-label">My services</span>
            <strong>{services.length}</strong>
            <span className="dashboard-stat-note">
              {services.length === 1
                ? 'One service in your list.'
                : `${services.length} services in your list.`}
            </span>
          </div>

          <div className="dashboard-stat-card">
            <span className="dashboard-stat-icon">
              <CalendarDays size={20} />
            </span>
            <span className="dashboard-stat-label">My bookings</span>
            <strong>0</strong>
            <span className="dashboard-stat-note">
              No live booking data is connected yet.
            </span>
          </div>

          <div className="dashboard-stat-card">
            <span className="dashboard-stat-icon">
              <ShieldCheck size={20} />
            </span>
            <span className="dashboard-stat-label">Verification</span>
            <strong>
              {verificationStatus === 'pending'
                ? 'Demo pending'
                : 'Not submitted'}
            </strong>
            <span className="dashboard-stat-note">
              Demo status only; no real verification takes place.
            </span>
          </div>
        </div>

        <div className="dashboard-lower-grid">
          <section className="dashboard-panel">
            <div className="dashboard-panel-heading">
              <div>
                <span className="dashboard-eyebrow">GET STARTED</span>
                <h2>Your professional profile</h2>
              </div>
              <UserRound size={22} />
            </div>

            <p>
              Help customers understand your experience, location, and the
              services you offer.
            </p>

            <div className="dashboard-checklist">
              <div>
                {profile.name ? (
                  <CheckCircle2 size={18} />
                ) : (
                  <Clock3 size={18} />
                )}
                <span>Add your professional name</span>
              </div>

              <div>
                {profile.city ? (
                  <CheckCircle2 size={18} />
                ) : (
                  <Clock3 size={18} />
                )}
                <span>Choose your city</span>
              </div>

              <div>
                {profile.skills.trim() ? (
                  <CheckCircle2 size={18} />
                ) : (
                  <Clock3 size={18} />
                )}
                <span>Describe your skills</span>
              </div>
            </div>

            <button
              className="dashboard-text-button"
              onClick={editProfile}
            >
              {profile.name ? 'Update your profile' : 'Create your profile'}
              <ArrowUpRight size={17} />
            </button>
          </section>

          <section className="dashboard-panel dashboard-forest-panel">
            <ShieldCheck size={28} />

            <span className="dashboard-eyebrow">BUILD TRUST</span>
            <h2>Verification starts here.</h2>

            <p>
              Explore the identity verification demo. Real identity checks
              require a secure backend and an authorized review process.
            </p>

            <button
              className="dashboard-light-button"
              onClick={() => setActiveTab('Identity Verification')}
            >
              View verification
              <ArrowUpRight size={17} />
            </button>
          </section>
        </div>
      </div>
    );
  }

  function renderProfile() {
    if (!isEditing) {
      return (
        <div className="dashboard-content">
          <div className="dashboard-welcome">
            <div>
              <span className="dashboard-eyebrow">YOUR PROFESSIONAL DETAILS</span>
              <h1>My Profile</h1>
              <p>Review the information in your browser-saved profile.</p>
            </div>

            <button
              className="dashboard-primary-button"
              onClick={() => setIsEditing(true)}
            >
              <Pencil size={17} />
              Edit profile
            </button>
          </div>

          <section className="dashboard-panel profile-preview">
            <div className="profile-preview-top">
              {profile.photo ? (
                <img
                  className="profile-preview-photo"
                  src={profile.photo}
                  alt="Your profile"
                />
              ) : (
                <div className="profile-preview-avatar">
                  <UserRound size={38} />
                </div>
              )}

              <div>
                <span className="dashboard-eyebrow">
                  NEXTFIX PROFESSIONAL
                </span>
                <h2>{profile.name || 'Your name'}</h2>
                <p className="profile-preview-location">
                  <MapPin size={16} />
                  {profile.city || 'City not added'}
                </p>
              </div>
            </div>

            <div className="profile-preview-details">
              <div>
                <span>Experience</span>
                <strong>
                  {profile.experience
                    ? `${profile.experience} ${
                        profile.experience === '1' ? 'year' : 'years'
                      }`
                    : 'Not added'}
                </strong>
              </div>

              <div>
                <span>Contact number</span>
                <strong>{profile.phone || 'Not added'}</strong>
              </div>

              <div>
                <span>Skills and services</span>
                <strong>{profile.skills || 'Not added'}</strong>
              </div>
            </div>

            <div className="profile-preview-bio">
              <h3>About me</h3>
              <p>{profile.bio || 'Your introduction will appear here.'}</p>
            </div>

            <p className="dashboard-muted-note">
              This profile is currently saved in this browser only. It is not
              automatically published to customers or shared with other users.
            </p>
          </section>
        </div>
      );
    }

    return (
      <div className="dashboard-content">
        <div className="dashboard-welcome">
          <div>
            <span className="dashboard-eyebrow">YOUR PROFESSIONAL DETAILS</span>
            <h1>{profile.name ? 'Edit your profile' : 'Create your profile'}</h1>
            <p>
              Introduce yourself and help customers learn about your skills.
            </p>
          </div>

          {profile.name && (
            <button
              className="dashboard-secondary-button"
              onClick={() => setIsEditing(false)}
            >
              <Eye size={17} />
              Preview profile
            </button>
          )}
        </div>

        <form className="dashboard-panel dashboard-form" onSubmit={saveProfile}>
          <div className="dashboard-form-heading">
            <h2>Professional information</h2>
            <p>Fields marked with * are required.</p>
          </div>

          <div className="profile-photo-upload">
            <div className="profile-photo-preview">
              {profile.photo ? (
                <img src={profile.photo} alt="Profile preview" />
              ) : (
                <UserRound size={34} />
              )}
            </div>

            <div className="profile-photo-info">
              <strong>Profile photo</strong>
              <p>Choose an image smaller than 2 MB.</p>

              <label className="dashboard-upload-button">
                <Camera size={16} />
                Choose photo
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  hidden
                />
              </label>
            </div>
          </div>

          <div className="dashboard-form-grid">
            <label className="dashboard-field">
              <span>Full name *</span>
              <input
                type="text"
                name="name"
                value={profile.name}
                onChange={updateProfile}
                placeholder="Enter your professional name"
                required
              />
            </label>

            <label className="dashboard-field">
              <span>City *</span>
              <select
                name="city"
                value={profile.city}
                onChange={updateProfile}
                required
              >
                <option value="">Select your city</option>
                {cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </label>

            <label className="dashboard-field">
              <span>Contact number</span>
              <input
                type="tel"
                name="phone"
                value={profile.phone}
                onChange={updateProfile}
                placeholder="Your contact number"
              />
            </label>

            <label className="dashboard-field">
              <span>Years of experience *</span>
              <select
                name="experience"
                value={profile.experience}
                onChange={updateProfile}
                required
              >
                <option value="">Select experience</option>
                <option value="0">Less than 1 year</option>
                <option value="1">1 year</option>
                <option value="2">2 years</option>
                <option value="3">3 years</option>
                <option value="4">4 years</option>
                <option value="5">5 years</option>
                <option value="6">6 years</option>
                <option value="7">7 years</option>
                <option value="8">8 years</option>
                <option value="9">9 years</option>
                <option value="10">10+ years</option>
              </select>
            </label>

            <label className="dashboard-field dashboard-field-full">
              <span>Your skills and services *</span>
              <input
                type="text"
                name="skills"
                value={profile.skills}
                onChange={updateProfile}
                placeholder="e.g. Plumbing, tap repair, pipe fitting"
                required
              />
            </label>

            <label className="dashboard-field dashboard-field-full">
              <span>About you *</span>
              <textarea
                name="bio"
                value={profile.bio}
                onChange={updateProfile}
                placeholder="Tell customers about your experience and work..."
                rows="5"
                required
              />
            </label>
          </div>

          <div className="dashboard-form-actions">
            <button
              type="button"
              className="dashboard-secondary-button"
              onClick={() => {
                if (profile.name) {
                  setProfile(loadProfile());
                  setIsEditing(false);
                } else {
                  setProfile({ ...emptyProfile });
                }
              }}
            >
              Cancel
            </button>

            <button type="submit" className="dashboard-primary-button">
              <Save size={17} />
              Save profile
            </button>
          </div>
        </form>
      </div>
    );
  }

  
function renderServices() {
  return (
    <div className="dashboard-content">
      <div className="dashboard-welcome">
        <div>
          <span className="dashboard-eyebrow">WHAT YOU OFFER</span>
          <h1>My Services</h1>
          <p>Manage the home services you want to offer customers.</p>
        </div>

        <button
          type="button"
          className="dashboard-primary-button"
          onClick={() => setShowServiceForm(true)}
        >
          <Plus size={18} />
          Add a service
        </button>
      </div>

      {showServiceForm && (
        <form
          className="dashboard-panel dashboard-form"
          onSubmit={saveService}
        >
          <div className="dashboard-form-heading">
            <h2>{editingServiceId ? 'Edit service' : 'Add a new service'}</h2>
            <p>
              {editingServiceId
                ? 'Update the details of this service.'
                : 'Enter the details of the service you provide.'}
            </p>
          </div>

          <div className="dashboard-form-grid">
            <label className="dashboard-field">
              <span>Service name *</span>
              <input
                name="name"
                value={serviceForm.name}
                onChange={updateServiceForm}
                placeholder="e.g. Tap repair"
                required
              />
            </label>

            <label className="dashboard-field">
              <span>Category *</span>
              <select
                name="category"
                value={serviceForm.category}
                onChange={updateServiceForm}
                required
              >
                <option value="">Choose a category</option>
                <option value="Plumbing">Plumbing</option>
                <option value="Electrical">Electrical</option>
                <option value="AC Repair">AC Repair</option>
                <option value="Cleaning">Cleaning</option>
                <option value="Carpentry">Carpentry</option>
                <option value="Painting">Painting</option>
                <option value="Other">Other</option>
              </select>
            </label>

            <label className="dashboard-field">
              <span>Price (PKR) *</span>
              <input
                type="number"
                name="price"
                value={serviceForm.price}
                onChange={updateServiceForm}
                placeholder="e.g. 1500"
                min="1"
                required
              />
            </label>

            <label className="dashboard-field">
              <span>Estimated duration *</span>
              <select
                name="duration"
                value={serviceForm.duration}
                onChange={updateServiceForm}
                required
              >
                <option value="">Choose duration</option>
                <option value="30 minutes">30 minutes</option>
                <option value="1 hour">1 hour</option>
                <option value="2 hours">2 hours</option>
                <option value="Half day">Half day</option>
                <option value="Full day">Full day</option>
              </select>
            </label>

            <label className="dashboard-field dashboard-field-full">
              <span>Description *</span>
              <textarea
                name="description"
                value={serviceForm.description}
                onChange={updateServiceForm}
                placeholder="Describe what this service includes..."
                rows={4}
                required
              />
            </label>
          </div>

          <div className="dashboard-form-actions">
            <button
              type="button"
              className="dashboard-secondary-button"
              onClick={() => {
                setShowServiceForm(false);
                setEditingServiceId(null);
                setServiceForm({
                  name: '',
                  category: '',
                  description: '',
                  price: '',
                  duration: '',
                });
              }}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="dashboard-primary-button"
            >
              {editingServiceId ? <Save size={17} /> : <Plus size={17} />}
              {editingServiceId ? 'Save changes' : 'Save service'}
            </button>
          </div>
        </form>
      )}

      {services.length === 0 ? (
        <section className="dashboard-panel dashboard-empty-state">
          <BriefcaseBusiness size={42} />
          <h2>No services added yet</h2>
          <p>
            Add your first service to keep track of the work you offer,
            your prices, and estimated completion times.
          </p>
          {!showServiceForm && (
            <button
              type="button"
              className="dashboard-secondary-button"
              onClick={() => setShowServiceForm(true)}
            >
              <Plus size={17} />
              Add your first service
            </button>
          )}
        </section>
      ) : (
        <div className="dashboard-stats">
          {services.map((service) => (
            <section className="dashboard-panel" key={service.id}>
              <span className="dashboard-eyebrow">
                {service.category}
              </span>
              <h2>{service.name}</h2>
              <p>{service.description}</p>
              <strong>
                PKR {service.price.toLocaleString('en-PK')}
              </strong>
              <p>Estimated time: {service.duration}</p>

              <div className="dashboard-form-actions">
                <button
                  type="button"
                  className="dashboard-secondary-button"
                  onClick={() => editService(service)}
                >
                  <Pencil size={16} />
                  Edit
                </button>

                <button
                  type="button"
                  className="dashboard-secondary-button"
                  onClick={() => {
                    const confirmed = window.confirm(
                      `Delete "${service.name}"?`
                    );

                  if (!confirmed) return;

                  const updatedServices = services.filter(
                    (item) => item.id !== service.id
                  );

                  try {
                    localStorage.setItem(
                      'NextFix-professional-services',
                      JSON.stringify(updatedServices)
                    );
                    setServices(updatedServices);
                  } catch {
                    alert('Could not update your saved services.');
                  }
                }}
              >
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}


  function renderBookings() {
    return (
      <div className="dashboard-content">
        <div className="dashboard-welcome">
          <div>
            <span className="dashboard-eyebrow">YOUR SCHEDULE</span>
            <h1>My Bookings</h1>
            <p>Review the customer requests assigned to you.</p>
          </div>
        </div>

        <section className="dashboard-panel dashboard-empty-state">
          <CalendarDays size={42} />
          <h2>No bookings yet</h2>
          <p>
            Customer bookings will appear here once booking data is connected
            to a backend. This section is currently a front-end demo.
          </p>
        </section>
      </div>
    );
  }

  function renderVerification() {
    return (
      <div className="dashboard-content">
        <div className="dashboard-welcome">
          <div>
            <span className="dashboard-eyebrow">SAFETY AND TRUST</span>
            <h1>Identity Verification</h1>
            <p>
              See how a professional verification process could look in
              NextFix.
            </p>
          </div>

          <span className="verification-demo-badge">
            <ShieldCheck size={16} />
            Demo mode
          </span>
        </div>

        <div className="dashboard-warning">
          <AlertTriangle size={22} />

          <div>
            <strong>Front-end demonstration only</strong>
            <p>
              Do not enter a real CNIC number, real identity details, or
              confidential information. This demo does not upload documents,
              verify identity, or securely process personal information.
            </p>
          </div>
        </div>

        <section className="dashboard-panel verification-status-card">
          <div className="verification-status-icon">
            {verificationStatus === 'pending' ? (
              <Clock3 size={25} />
            ) : (
              <FileCheck size={25} />
            )}
          </div>

          <div className="verification-status-copy">
            <span className="dashboard-eyebrow">CURRENT DEMO STATUS</span>

            <h2>
              {verificationStatus === 'pending'
                ? 'Demo application submitted'
                : 'Not submitted'}
            </h2>

            <p>
              {verificationStatus === 'pending'
                ? 'This is only a temporary visual status. No real verification has taken place.'
                : 'Complete the sample form below to preview the pending state.'}
            </p>
          </div>

          {verificationStatus === 'pending' && (
            <button
              className="dashboard-secondary-button"
              type="button"
              onClick={resetDemoVerification}
            >
              Reset demo
            </button>
          )}
        </section>

        <form
          className="dashboard-panel dashboard-form"
          onSubmit={handleVerificationSubmit}
        >
          <div className="dashboard-form-heading">
            <h2>Sample verification form</h2>
            <p>
              Use fictional test details only. Nothing is sent to a server.
            </p>
          </div>

          <div className="dashboard-form-grid">
            <label className="dashboard-field">
              <span>Sample legal name *</span>
              <input
                type="text"
                name="legalName"
                value={verificationForm.legalName}
                onChange={updateVerificationForm}
                placeholder="Example: Demo Professional"
                autoComplete="off"
                required
              />
            </label>

            <label className="dashboard-field">
              <span>Demo reference code *</span>
              <input
                type="text"
                name="demoReference"
                value={verificationForm.demoReference}
                onChange={updateVerificationForm}
                placeholder="Example: DEMO-12345"
                autoComplete="off"
                required
              />
              <small>
                This is a fictional reference field, not a CNIC field.
              </small>
            </label>

            <label className="dashboard-field">
              <span>Sample city *</span>
              <select
                name="city"
                value={verificationForm.city}
                onChange={updateVerificationForm}
                required
              >
                <option value="">Select a city</option>
                {cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </label>

            <label className="dashboard-field">
              <span>Sample contact number *</span>
              <input
                type="text"
                name="phone"
                value={verificationForm.phone}
                onChange={updateVerificationForm}
                placeholder="Enter fictional test details"
                autoComplete="off"
                required
              />
              <small>Do not use a real phone number.</small>
            </label>
          </div>

          <label className="verification-consent">
            <input
              type="checkbox"
              name="consent"
              checked={verificationForm.consent}
              onChange={updateVerificationForm}
              required
            />

            <span>
              I understand that this is a demo only, and that no real identity
              verification or document submission will take place.
            </span>
          </label>

          {verificationMessage && (
            <div className="dashboard-notice">
              <span>{verificationMessage}</span>
            </div>
          )}

          <div className="dashboard-form-actions">
            <button
              type="button"
              className="dashboard-secondary-button"
              onClick={() => {
                setVerificationForm({
                  legalName: '',
                  demoReference: '',
                  city: '',
                  phone: '',
                  consent: false,
                });
                setVerificationMessage('');
              }}
            >
              Clear form
            </button>

            <button
              type="submit"
              className="dashboard-primary-button"
              disabled={verificationStatus === 'pending'}
            >
              <ShieldCheck size={17} />
              Submit demo
            </button>
          </div>
        </form>

        <section className="dashboard-panel verification-security-note">
          <ShieldCheck size={22} />

          <div>
            <h3>Before launching real verification</h3>
            <p>
              A production version needs a secure backend, access controls,
              protected document storage, an authorized reviewer, and a clear
              privacy and data-retention policy. Never store real CNIC details
              or identity-document images in browser localStorage.
            </p>
          </div>
        </section>
      </div>
    );
  }
  function editService(service) {
    setServiceForm({
      name: service.name || '',
      category: service.category || '',
      description: service.description || '',
      price: String(service.price ?? ''),
      duration: service.duration || '',
    });

    setEditingServiceId(service.id);
    setShowServiceForm(true);
  }

  function saveService(event) {
    event.preventDefault();

    const serviceData = {
      ...serviceForm,
      price: Number(serviceForm.price),
    };

    const updatedServices = editingServiceId
      ? services.map((service) =>
          service.id === editingServiceId
            ? { ...service, ...serviceData }
            : service
        )
      : [
          ...services,
          {
            id: crypto.randomUUID(),
            ...serviceData,
          },
        ];

    try {
      localStorage.setItem(
        'NextFix-professional-services',
        JSON.stringify(updatedServices)
      );

      setServices(updatedServices);
      setServiceForm({
        name: '',
        category: '',
        description: '',
        price: '',
        duration: '',
      });
      setEditingServiceId(null);
      setShowServiceForm(false);
    } catch (error) {
      console.error('Could not save the service:', error);
      alert('Could not save the service in this browser.');
    }
  }

  return (
    <div className="professional-dashboard">
      <aside className="dashboard-sidebar">
        <a href="/" className="dashboard-brand" aria-label="NextFix home">
          <span>NextFix</span>
          <span className="dashboard-brand-dot">.</span>
        </a>

        <div className="dashboard-sidebar-label">WORKSPACE</div>

        <nav className="dashboard-nav" aria-label="Dashboard navigation">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.name;

            return (
              <button
                type="button"
                key={item.name}
                className={`dashboard-nav-item ${
                  isActive ? 'active' : ''
                }`}
                onClick={() => setActiveTab(item.name)}
              >
                <Icon size={19} strokeWidth={1.8} />
                <span>{item.name}</span>

                {item.name === 'Identity Verification' && (
                  <span className="dashboard-nav-dot" />
                )}
              </button>
            );
          })}
        </nav>

        <div className="dashboard-sidebar-bottom">
          <div className="dashboard-sidebar-help">
            <ShieldCheck size={22} />
            <strong>Your work, your reputation.</strong>
            <p>Keep your professional details up to date.</p>
          </div>

          <Link to="/" className="dashboard-back-home" aria-label="Back to home page">
            <LogOut size={17} />
            Back to Home
          </Link>
        </div>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-topbar">
          <div className="dashboard-breadcrumb">
            <span>NextFix</span>
            <span>/</span>  
            <strong>{activeTab}</strong>
          </div>

          <div className="dashboard-user">
            <div className="dashboard-user-info">
              <strong>{profile.name || 'Professional'}</strong>
              <span>{profile.city || 'Your workspace'}</span>
            </div>

            {profile.photo ? (
              <img
                className="dashboard-user-avatar"
                src={profile.photo}
                alt=""
              />
            ) : (
              <div className="dashboard-user-avatar dashboard-user-avatar-fallback">
                <UserRound size={19} />
              </div>
            )}
          </div>
        </header>

        {activeTab === 'Overview' && renderOverview()}
        {activeTab === 'My Profile' && renderProfile()}
        {activeTab === 'My Services' && renderServices()}
        {activeTab === 'My Bookings' && renderBookings()}
        {activeTab === 'Identity Verification' && renderVerification()}
      </main>
    </div>
  );
}

export default ProfessionalDashboard;
