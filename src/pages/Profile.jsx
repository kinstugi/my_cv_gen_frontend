import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { apiGet, apiPut } from '../api/client.js';

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
    <div className="page">
      <h1>My profile</h1>
      <p className="muted">Email: {user.email}</p>
      <form onSubmit={handleSubmit} className="form">
        {error && <p className="form-error">{error}</p>}
        {saved && <p className="form-success">Profile updated.</p>}
        <label>
          First name
          <input
            value={form.firstName}
            onChange={(e) => update('firstName', e.target.value)}
            autoComplete="given-name"
          />
        </label>
        <label>
          Last name
          <input
            value={form.lastName}
            onChange={(e) => update('lastName', e.target.value)}
            autoComplete="family-name"
          />
        </label>
        <label>
          Phone
          <input
            type="tel"
            value={form.phoneNumber}
            onChange={(e) => update('phoneNumber', e.target.value)}
          />
        </label>
        <label>
          GitHub URL
          <input
            type="url"
            value={form.githubUrl}
            onChange={(e) => update('githubUrl', e.target.value)}
          />
        </label>
        <label>
          Location
          <input
            value={form.location}
            onChange={(e) => update('location', e.target.value)}
          />
        </label>
        <label>
          Website
          <input
            type="url"
            value={form.website}
            onChange={(e) => update('website', e.target.value)}
          />
        </label>
        <button type="submit" disabled={submitting}>
          {submitting ? 'Saving…' : 'Save profile'}
        </button>
      </form>
    </div>
  );
}
