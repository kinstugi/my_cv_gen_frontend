import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiGet } from '../api/client.js';
import CreateResumeModal from '../components/CreateResumeModal.jsx';
import ImportResumeModal from '../components/ImportResumeModal.jsx';

export default function ResumeList() {
  const navigate = useNavigate();
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState('cards'); // 'cards' | 'list'
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
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

  const showCards = viewMode === 'cards';

  function openCreateModal() {
    setIsCreateModalOpen(true);
  }

  function handleCreateChoice(option) {
    setIsCreateModalOpen(false);
    if (option === 'manual') {
      navigate('/resumes/new');
    } else if (option === 'import') {
      setIsImportModalOpen(true);
    }
  }

  function handleImportedResume(data) {
    setIsImportModalOpen(false);
    navigate('/resumes/new', { state: { importedResume: data } });
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>My resumes</h1>
          <p className="muted">Create, reuse, and tailor resumes for each role.</p>
        </div>
        <div className="resume-header-actions">
          <div className="view-toggle" aria-label="Change resume layout">
            <button
              type="button"
              className={`view-toggle-button ${showCards ? 'active' : ''}`}
              onClick={() => setViewMode('cards')}
            >
              Cards
            </button>
            <button
              type="button"
              className={`view-toggle-button ${!showCards ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
            >
              List
            </button>
          </div>
          <button type="button" onClick={openCreateModal} className="btn primary">New resume</button>
        </div>
      </div>

      {resumes.length === 0 ? (
        <div className="resume-empty">
          <div className="resume-empty-icon">
            <svg className="resume-empty-svg" viewBox="0 0 24 24">
              <path
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h2>No resumes yet</h2>
          <p>Start with your first CV and reuse it for future applications.</p>
          <button type="button" onClick={openCreateModal} className="btn primary">Create your first resume</button>
        </div>
      ) : showCards ? (
        <div className="resume-grid">
          {resumes.map((r) => (
            <article key={r.id} className="resume-card">
              <header className="resume-card-header">
                <h2 className="resume-card-title">{r.title}</h2>
                <span className={`resume-status ${r.isActive === false ? 'inactive' : 'active'}`}>
                  {r.isActive === false ? 'Inactive' : 'Active'}
                </span>
              </header>
              <p className="resume-card-description">
                {r.description?.slice(0, 110)}
                {r.description && r.description.length > 110 ? '…' : ''}
              </p>
              <div className="resume-card-meta">
                {r.updatedAt && (
                  <span>Updated {r.updatedAt.slice(0, 10)}</span>
                )}
              </div>
              <footer className="resume-card-footer">
                <Link to={`/resumes/${r.id}`} className="btn primary">
                  Open resume
                </Link>
              </footer>
            </article>
          ))}
        </div>
      ) : (
        <ul className="resume-list">
          {resumes.map((r) => (
            <li key={r.id}>
              <Link to={`/resumes/${r.id}`}>{r.title}</Link>
              <span className="muted">
                {' '}
                — {r.description?.slice(0, 60)}
                {r.description?.length > 60 ? '…' : ''}
              </span>
            </li>
          ))}
        </ul>
      )}

      {resumes.length >= pageSize && (
        <p className="resume-pagination">
          <button type="button" onClick={() => setPage((p) => p - 1)} disabled={page <= 1}>
            Previous
          </button>
          {' '}
          Page {page}
          {' '}
          <button type="button" onClick={() => setPage((p) => p + 1)}>
            Next
          </button>
        </p>
      )}

      <CreateResumeModal
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onChoose={handleCreateChoice}
      />
      <ImportResumeModal
        open={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImported={handleImportedResume}
      />
    </div>
  );
}
