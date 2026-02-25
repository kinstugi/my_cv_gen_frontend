import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { apiGet, apiDelete, apiGetBlob, apiPost } from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';
import { getTemplate, getTemplateIds } from '../templates/index.js';
import editIcon from '../assets/icons/edit.svg';
import deleteIcon from '../assets/icons/delete.svg';
import downloadIcon from '../assets/icons/file-download.svg';

const defaultTemplateId = 'template1';

export default function ResumeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tailorJobDescription, setTailorJobDescription] = useState('');
  const [tailoring, setTailoring] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const templateIds = getTemplateIds();
  const [template, setTemplate] = useState(() => (templateIds.includes(defaultTemplateId) ? defaultTemplateId : templateIds[0] || 'template1'));

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError('');
    apiGet(`/api/resumes/${id}`)
      .then((data) => { if (!cancelled) setResume(data); })
      .catch((err) => { if (!cancelled) setError(err.status === 404 ? 'Resume not found.' : err.message); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [id]);

  const previewModel = useMemo(() => {
    if (!resume) return null;
    const name = user?.firstName && user?.lastName
      ? `${user.firstName} ${user.lastName}`.trim()
      : user?.firstName || user?.lastName || user?.name || '';
    return {
      name,
      title: resume.title ?? '',
      description: resume.description ?? '',
      imageUrl: resume.imageUrl ?? '',
      phone: user?.phone ?? '',
      email: user?.email ?? '',
      location: user?.location ?? '',
      githubUrl: user?.githubUrl ?? '',
      website: user?.website ?? '',
      workExperiences: resume.workExperiences ?? [],
      projects: resume.projects ?? [],
      educations: resume.educations ?? [],
      skills: resume.skills ?? [],
      languages: resume.languages ?? [],
    };
  }, [resume, user]);

  const TemplateComponent = getTemplate(template);

  useEffect(() => {
    if (templateIds.length > 0 && !templateIds.includes(template)) {
      setTemplate(templateIds[0]);
    }
  }, [templateIds.join(','), template]);

  async function handleDelete() {
    if (!confirm('Soft-delete this resume?')) return;
    try {
      await apiDelete(`/api/resumes/${id}`);
      navigate('/resumes', { replace: true });
    } catch (err) {
      setError(err.message || 'Delete failed.');
    }
  }

  async function handleDownload() {
    setDownloading(true);
    setError('');
    try {
      const blob = await apiGetBlob(`/api/resumes/${id}/download`, { template });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `resume-${id}.pdf`;
      a.click();
      URL.revokeObjectURL(a.href);
    } catch (err) {
      setError(err.message || 'Download failed.');
    } finally {
      setDownloading(false);
    }
  }

  async function handleTailor(e) {
    e.preventDefault();
    const job = tailorJobDescription.trim();
    if (!job) return;
    setTailoring(true);
    setError('');
    try {
      const data = await apiPost(`/api/resumes/${id}/tailor`, {
        jobDescription: job,
        createNewCV: false,
      });
      setResume(data);
      setTailorJobDescription('');
    } catch (err) {
      setError(err.message || 'Tailor failed.');
    } finally {
      setTailoring(false);
    }
  }

  if (loading) return <div className="page"><p>Loading…</p></div>;
  if (error && !resume) return <div className="page"><p className="form-error">{error}</p><Link to="/resumes">Back to resumes</Link></div>;
  if (!resume) return null;

  return (
    <div className="page resume-detail">
      <div className="page-header">
        <div>
          <h1>{resume.title}</h1>
          <p className="muted">View with a template, switch to see how it looks, then download PDF or tailor.</p>
        </div>
        <div className="actions">
          <select
            aria-label="Preview template"
            value={template}
            onChange={(e) => setTemplate(e.target.value)}
            className="resume-view-template-select"
          >
            {templateIds.map((tid) => (
              <option key={tid} value={tid}>
                {tid.replace(/^template(\d+)$/i, (_, n) => `Template ${n}`) || tid}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={handleDownload}
            disabled={downloading}
            className={`btn icon-button ${downloading ? 'icon-button-loading' : ''}`}
            title={downloading ? 'Downloading…' : 'Download PDF'}
            aria-label={downloading ? 'Downloading PDF…' : 'Download PDF'}
            aria-busy={downloading}
          >
            {downloading ? (
              <span className="icon-button-spinner" aria-hidden="true" />
            ) : (
              <img src={downloadIcon} alt="" />
            )}
          </button>
          <Link
            to={`/resumes/${id}/edit`}
            className="btn icon-button"
            title="Edit"
            aria-label="Edit resume"
          >
            <img src={editIcon} alt="" />
          </Link>
          <button
            type="button"
            onClick={handleDelete}
            className="btn icon-button icon-button-danger"
            title="Delete"
            aria-label="Delete resume"
          >
            <img src={deleteIcon} alt="" />
          </button>
        </div>
      </div>
      {error && <p className="form-error">{error}</p>}

      <section className="resume-detail-card resume-view-preview">
        {TemplateComponent && previewModel ? (
          <TemplateComponent model={previewModel} />
        ) : (
          <p className="muted">Select a template to preview your CV.</p>
        )}
      </section>

      <div className="resume-detail-grid">
        <section className="resume-detail-card">
          <h2>Tailor to job description</h2>
          <p className="resume-detail-subtitle">
            Paste a job posting and we&apos;ll use your API to tailor this CV to that role.
          </p>
          <form onSubmit={handleTailor} className="auth-form tailor-form">
            <div className="auth-field">
              <label htmlFor="jobDescription">Job description</label>
              <textarea
                id="jobDescription"
                value={tailorJobDescription}
                onChange={(e) => setTailorJobDescription(e.target.value)}
                rows={4}
                placeholder="Paste the job posting here…"
                required
              />
            </div>
            <button type="submit" disabled={tailoring} className="btn primary auth-submit">
              {tailoring ? 'Tailoring…' : 'Tailor resume'}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
