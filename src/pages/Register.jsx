import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { apiPost } from '../api/client.js';

export default function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phoneNumber: '',
    githubUrl: '',
    location: '',
    website: '',
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const update = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const payload = {
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim(),
        password: form.password,
      };
      if (form.phoneNumber.trim()) payload.phoneNumber = form.phoneNumber.trim();
      if (form.githubUrl.trim()) payload.githubUrl = form.githubUrl.trim();
      if (form.location.trim()) payload.location = form.location.trim();
      if (form.website.trim()) payload.website = form.website.trim();

      const data = await apiPost('/api/auth/register', payload);
      login(data.token, data.user);
      navigate('/resumes', { replace: true });
    } catch (err) {
      setError(err.status === 409 ? 'Email already registered.' : (err.message || 'Registration failed.'));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="page auth-page">
      <h1>Register</h1>
      <form onSubmit={handleSubmit} className="form">
        {error && <p className="form-error">{error}</p>}
        <label>
          First name *
          <input
            value={form.firstName}
            onChange={(e) => update('firstName', e.target.value)}
            required
            autoComplete="given-name"
          />
        </label>
        <label>
          Last name *
          <input
            value={form.lastName}
            onChange={(e) => update('lastName', e.target.value)}
            required
            autoComplete="family-name"
          />
        </label>
        <label>
          Email *
          <input
            type="email"
            value={form.email}
            onChange={(e) => update('email', e.target.value)}
            required
            autoComplete="email"
          />
        </label>
        <label>
          Password *
          <input
            type="password"
            value={form.password}
            onChange={(e) => update('password', e.target.value)}
            required
            autoComplete="new-password"
          />
        </label>
        <label>
          Phone
          <input
            type="tel"
            value={form.phoneNumber}
            onChange={(e) => update('phoneNumber', e.target.value)}
            placeholder="+1 234 567 8900"
          />
        </label>
        <label>
          GitHub URL
          <input
            type="url"
            value={form.githubUrl}
            onChange={(e) => update('githubUrl', e.target.value)}
            placeholder="https://github.com/username"
          />
        </label>
        <label>
          Location
          <input
            value={form.location}
            onChange={(e) => update('location', e.target.value)}
            placeholder="City, Country"
          />
        </label>
        <label>
          Website
          <input
            type="url"
            value={form.website}
            onChange={(e) => update('website', e.target.value)}
            placeholder="https://yoursite.com"
          />
        </label>
        <button type="submit" disabled={submitting}>
          {submitting ? 'Registering…' : 'Register'}
        </button>
      </form>
      <p>
        Already have an account? <Link to="/login">Log in</Link>
      </p>
    </div>
  );
}
