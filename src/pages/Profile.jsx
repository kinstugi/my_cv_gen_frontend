import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { apiPut } from '../api/client.js';

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    githubUrl: '',
    location: '',
    website: '',
  });
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({
        firstName: user.firstName ?? '',
        lastName: user.lastName ?? '',
        phoneNumber: user.phoneNumber ?? '',
        githubUrl: user.githubUrl ?? '',
        location: user.location ?? '',
        website: user.website ?? '',
      });
    }
  }, [user]);

  const update = (field, value) => {
    setForm((f) => ({ ...f, [field]: value }));
    setSaved(false);
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const data = await apiPut('/api/users/me', form);
      updateUser(data);
      setSaved(true);
    } catch (err) {
      setError(err.message || 'Update failed.');
    } finally {
      setSubmitting(false);
    }
  }

  if (!user) return null;

  return (
    <div className="profile-shell">
      <section className="profile-header">
        <div className="profile-avatar">
          <div className="profile-avatar-circle">
            <span className="profile-avatar-initials">
              {user.firstName?.[0]}
              {user.lastName?.[0]}
            </span>
          </div>
          <div className="profile-header-text">
            <h1>Account profile</h1>
            <p>Keep your personal details and public links up to date.</p>
          </div>
        </div>
        <div className="profile-meta">
          <span className="profile-label">Signed in as</span>
          <span className="profile-email">{user.email}</span>
        </div>
      </section>

      <section className="profile-card">
        <h2>Personal details</h2>
        <p className="profile-card-subtitle">
          These details are used to populate your resumes and PDF exports.
        </p>

        <form onSubmit={handleSubmit} className="profile-form">
          {error && (
            <div className="auth-alert auth-alert-error">
              <p>{error}</p>
            </div>
          )}
          {saved && (
            <div className="auth-alert profile-alert-success">
              <p>Profile updated.</p>
            </div>
          )}

          <div className="profile-field-row">
            <div className="profile-field">
              <label htmlFor="firstName">First name</label>
              <input
                id="firstName"
                value={form.firstName}
                onChange={(e) => update('firstName', e.target.value)}
                autoComplete="given-name"
                placeholder="First name"
              />
            </div>
            <div className="profile-field">
              <label htmlFor="lastName">Last name</label>
              <input
                id="lastName"
                value={form.lastName}
                onChange={(e) => update('lastName', e.target.value)}
                autoComplete="family-name"
                placeholder="Last name"
              />
            </div>
          </div>

          <div className="profile-field-row">
            <div className="profile-field">
              <label htmlFor="phoneNumber">Phone</label>
              <input
                id="phoneNumber"
                type="tel"
                value={form.phoneNumber}
                onChange={(e) => update('phoneNumber', e.target.value)}
                placeholder="+1 234 567 8900"
              />
            </div>
            <div className="profile-field">
              <label htmlFor="location">Location</label>
              <input
                id="location"
                value={form.location}
                onChange={(e) => update('location', e.target.value)}
                placeholder="City, Country"
              />
            </div>
          </div>

          <div className="profile-field">
            <label htmlFor="githubUrl">GitHub URL</label>
            <input
              id="githubUrl"
              type="url"
              value={form.githubUrl}
              onChange={(e) => update('githubUrl', e.target.value)}
              placeholder="https://github.com/username"
            />
          </div>

          <div className="profile-field">
            <label htmlFor="website">Website</label>
            <input
              id="website"
              type="url"
              value={form.website}
              onChange={(e) => update('website', e.target.value)}
              placeholder="https://yoursite.com"
            />
          </div>

          <div className="profile-actions">
            <button type="submit" disabled={submitting} className="btn primary">
              {submitting ? 'Saving…' : 'Save changes'}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
