import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="page home-page">
      <h1>My CV Gen</h1>
      <p>Create and manage resumes, tailor them to job descriptions with AI, and download as PDF.</p>
      {user ? (
        <p>
          <Link to="/resumes" className="btn primary">My resumes</Link>
          {' '}
          <Link to="/profile" className="btn">Profile</Link>
        </p>
      ) : (
        <p>
          <Link to="/login" className="btn primary">Log in</Link>
          {' '}
          <Link to="/register" className="btn">Register</Link>
        </p>
      )}
    </div>
  );
}
