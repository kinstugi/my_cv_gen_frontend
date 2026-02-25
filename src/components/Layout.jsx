import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login', { replace: true });
  }

  return (
    <div className="app">
      <header className="nav">
        <div className="nav-inner">
          <Link to="/" className="nav-brand">
            <span className="nav-logo">
              <svg className="nav-logo-icon" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M9 5l7 7-7 7"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <span className="nav-logo-text">MyCVgen</span>
          </Link>

          <nav className="nav-links">
            {user ? (
              <>
                <Link to="/resumes" className="nav-link">
                  Resumes
                </Link>
                <Link to="/profile" className="nav-link">
                  Profile
                </Link>
                <span className="nav-user">
                  {user.firstName} {user.lastName}
                </span>
                <button type="button" onClick={handleLogout} className="btn nav-cta">
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="nav-link">
                  Log in
                </Link>
                <Link to="/register" className="btn nav-cta">
                  Get started
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>
      <main className="main">
        <Outlet />
      </main>
    </div>
  );
}
