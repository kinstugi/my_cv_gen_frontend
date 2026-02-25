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
      <nav className="nav">
        <Link to="/" className="nav-brand">My CV Gen</Link>
        {user ? (
          <>
            <Link to="/resumes">Resumes</Link>
            <Link to="/profile">Profile</Link>
            <span className="nav-user">{user.firstName} {user.lastName}</span>
            <button type="button" onClick={handleLogout} className="btn">Log out</button>
          </>
        ) : (
          <>
            <Link to="/login">Log in</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </nav>
      <main className="main">
        <Outlet />
      </main>
    </div>
  );
}
