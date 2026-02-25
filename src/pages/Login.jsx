import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { apiPost } from '../api/client.js';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const from = location.state?.from?.pathname || '/resumes';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const data = await apiPost('/api/auth/login', { email, password });
      login(data.token, data.user);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.status === 404 ? 'Invalid email or password.' : (err.message || 'Login failed.'));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="page auth-page">
      <h1>Log in</h1>
      <form onSubmit={handleSubmit} className="form">
        {error && <p className="form-error">{error}</p>}
        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
        </label>
        <button type="submit" disabled={submitting}>
          {submitting ? 'Logging in…' : 'Log in'}
        </button>
      </form>
      <p>
        Don't have an account? <Link to="/register">Register</Link>
      </p>
    </div>
  );
}
