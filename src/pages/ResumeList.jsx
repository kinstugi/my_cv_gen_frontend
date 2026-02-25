import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiGet } from '../api/client.js';

export default function ResumeList() {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError('');
    apiGet('/api/resumes', { page, pageSize })
      .then((data) => {
        if (!cancelled) setResumes(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || 'Failed to load resumes.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [page]);

  if (loading) return <div className="page"><p>Loading resumes…</p></div>;
  if (error) return <div className="page"><p className="form-error">{error}</p></div>;

  return (
    <div className="page">
      <div className="page-header">
        <h1>My resumes</h1>
        <Link to="/resumes/new" className="btn primary">New resume</Link>
      </div>
      {resumes.length === 0 ? (
        <p className="muted">No resumes yet. <Link to="/resumes/new">Create one</Link>.</p>
      ) : (
        <ul className="resume-list">
          {resumes.map((r) => (
            <li key={r.id}>
              <Link to={`/resumes/${r.id}`}>{r.title}</Link>
              <span className="muted"> — {r.description?.slice(0, 60)}{r.description?.length > 60 ? '…' : ''}</span>
            </li>
          ))}
        </ul>
      )}
      {resumes.length >= pageSize && (
        <p>
          <button type="button" onClick={() => setPage((p) => p - 1)} disabled={page <= 1}>Previous</button>
          {' '}Page {page}{' '}
          <button type="button" onClick={() => setPage((p) => p + 1)}>Next</button>
        </p>
      )}
    </div>
  );
}
