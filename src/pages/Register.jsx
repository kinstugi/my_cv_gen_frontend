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
    <div className="auth-shell">
      <div className="auth-card">
        <h1 className="auth-title">Create your account</h1>
        <p className="auth-subtitle">
          Start building job‑ready CVs, keep multiple versions in sync, and export PDFs in one place.
        </p>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && (
            <div className="auth-alert auth-alert-error">
              <p>{error}</p>
            </div>
          )}

          <div className="auth-field-row">
            <div className="auth-field">
              <label htmlFor="firstName">First name</label>
              <input
                id="firstName"
                value={form.firstName}
                onChange={(e) => update('firstName', e.target.value)}
                required
                autoComplete="given-name"
                placeholder="First name"
              />
            </div>
            <div className="auth-field">
              <label htmlFor="lastName">Last name</label>
              <input
                id="lastName"
                value={form.lastName}
                onChange={(e) => update('lastName', e.target.value)}
                required
                autoComplete="family-name"
                placeholder="Last name"
              />
            </div>
          </div>

          <div className="auth-field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={form.email}
              onChange={(e) => update('email', e.target.value)}
              required
              autoComplete="email"
              placeholder="you@example.com"
            />
          </div>

          <div className="auth-field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={form.password}
              onChange={(e) => update('password', e.target.value)}
              required
              autoComplete="new-password"
              placeholder="At least 6 characters"
            />
          </div>

          <button type="submit" disabled={submitting} className="btn primary auth-submit">
            {submitting ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account?{' '}
          <Link to="/login" className="auth-link">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
