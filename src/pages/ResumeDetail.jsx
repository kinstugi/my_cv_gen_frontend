import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { apiGet, apiDelete, apiGetBlob, apiPost } from '../api/client.js';

export default function ResumeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tailorJobDescription, setTailorJobDescription] = useState('');
  const [tailoring, setTailoring] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [template, setTemplate] = useState('template1');

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
    <div className="page">
      <div className="page-header">
        <h1>{resume.title}</h1>
        <div className="actions">
          <Link to={`/resumes/${id}/edit`} className="btn">Edit</Link>
          <button type="button" onClick={handleDelete} className="btn danger">Delete</button>
        </div>
      </div>
      {error && <p className="form-error">{error}</p>}

      <p className="description">{resume.description}</p>

      {resume.workExperiences?.length > 0 && (
        <section>
          <h2>Work experience</h2>
          <ul className="detail-list">
            {resume.workExperiences.map((w) => (
              <li key={w.id}>
                <strong>{w.position}</strong> at {w.company}
                <span className="muted"> {w.startDate?.slice(0, 10)} – {w.endDate ? w.endDate.slice(0, 10) : 'Present'}</span>
                <ul>
                  {(w.description || []).map((d, i) => <li key={i}>{d}</li>)}
                </ul>
              </li>
            ))}
          </ul>
        </section>
      )}

      {resume.educations?.length > 0 && (
        <section>
          <h2>Education</h2>
          <ul className="detail-list">
            {resume.educations.map((e) => (
              <li key={e.id}>
                <strong>{e.degree} {e.fieldOfStudy}</strong> — {e.school}
                <span className="muted"> {e.startDate?.slice(0, 10)} – {e.endDate?.slice(0, 10) || 'Present'}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {resume.skills?.length > 0 && (
        <section>
          <h2>Skills</h2>
          <p>{resume.skills.join(', ')}</p>
        </section>
      )}

      {resume.languages?.length > 0 && (
        <section>
          <h2>Languages</h2>
          <ul>
            {resume.languages.map((l) => (
              <li key={l.id}>{l.name} — {l.level}</li>
            ))}
          </ul>
        </section>
      )}

      {resume.projects?.length > 0 && (
        <section>
          <h2>Projects</h2>
          <ul className="detail-list">
            {resume.projects.map((p) => (
              <li key={p.id}>
                <strong>{p.title}</strong>
                {p.link && <a href={p.link} target="_blank" rel="noreferrer"> Link</a>}
                <p>{p.description}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      <hr />

      <section>
        <h2>Download PDF</h2>
        <select value={template} onChange={(e) => setTemplate(e.target.value)}>
          <option value="template1">Template 1</option>
          <option value="template2">Template 2</option>
          <option value="template3">Template 3</option>
          <option value="template4">Template 4</option>
        </select>
        {' '}
        <button type="button" onClick={handleDownload} disabled={downloading}>
          {downloading ? 'Downloading…' : 'Download PDF'}
        </button>
      </section>

      <section>
        <h2>Tailor to job description</h2>
        <form onSubmit={handleTailor} className="form">
          <label>
            Job description
            <textarea
              value={tailorJobDescription}
              onChange={(e) => setTailorJobDescription(e.target.value)}
              rows={4}
              placeholder="Paste the job posting here…"
              required
            />
          </label>
          <button type="submit" disabled={tailoring}>
            {tailoring ? 'Tailoring…' : 'Tailor resume'}
          </button>
        </form>
      </section>
    </div>
  );
}
