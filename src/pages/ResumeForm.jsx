import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import { apiGet, apiPost, apiPut } from '../api/client.js';

const emptyWork = () => ({
  company: '',
  position: '',
  description: [''],
  startDate: '',
  endDate: '',
  isCurrent: false,
});
const emptyEducation = () => ({
  school: '',
  degree: '',
  fieldOfStudy: '',
  startDate: '',
  endDate: '',
});
const emptyLanguage = () => ({ name: '', level: '' });
const emptyProject = () => ({ title: '', description: '', link: '' });

function resumeToForm(resume) {
  return {
    title: resume.title ?? '',
    description: resume.description ?? '',
    imageUrl: resume.imageUrl ?? '',
    workExperiences: (resume.workExperiences?.length ? resume.workExperiences : [emptyWork()]).map((w) => ({
      ...w,
      description: Array.isArray(w.description) ? w.description.length ? w.description : [''] : [String(w.description || '')],
    })),
    educations: (resume.educations?.length ? resume.educations : [emptyEducation()]).map((e) => ({ ...e })),
    languages: (resume.languages?.length ? resume.languages : [emptyLanguage()]).map((l) => ({ ...l })),
    projects: (resume.projects?.length ? resume.projects : [emptyProject()]).map((p) => ({ ...p })),
    skills: Array.isArray(resume.skills) && resume.skills.length ? resume.skills : [''],
  };
}

function formToPayload(form, isEdit) {
  const workExperiences = form.workExperiences
    .filter((w) => w.company.trim() || w.position.trim())
    .map((w) => ({
      company: w.company.trim(),
      position: w.position.trim(),
      description: w.description.filter(Boolean).map((s) => s.trim()),
      startDate: w.startDate || null,
      endDate: w.endDate || null,
      isCurrent: !!w.isCurrent,
    }));
  const educations = form.educations
    .filter((e) => e.school.trim() || e.degree.trim())
    .map((e) => ({
      school: e.school.trim(),
      degree: e.degree.trim(),
      fieldOfStudy: e.fieldOfStudy.trim(),
      startDate: e.startDate || null,
      endDate: e.endDate || null,
    }));
  const languages = form.languages
    .filter((l) => l.name.trim())
    .map((l) => ({ name: l.name.trim(), level: l.level.trim() || '—' }));
  const projects = form.projects
    .filter((p) => p.title.trim() || p.description.trim())
    .map((p) => ({
      title: p.title.trim(),
      description: p.description.trim(),
      link: p.link?.trim() || null,
    }));
  const skills = form.skills.filter(Boolean).map((s) => s.trim());

  const payload = {
    title: form.title.trim(),
    description: form.description.trim(),
    imageUrl: form.imageUrl.trim() || undefined,
    workExperiences,
    educations,
    languages,
    projects,
    skills,
  };
  if (isEdit) {
    Object.keys(payload).forEach((k) => payload[k] === undefined && delete payload[k]);
  }
  return payload;
}

export default function ResumeForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const importedResume = location.state?.importedResume;
  // Route "resumes/new" has no :id param (id is undefined); only "resumes/:id/edit" has id — so create when no id or id is 'new'
  const isEdit = Boolean(id && id !== 'new');
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(isEdit);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isEdit) {
      setForm(resumeToForm(importedResume || {}));
      setLoading(false);
      return;
    }
    let cancelled = false;
    apiGet(`/api/resumes/${id}`)
      .then((data) => { if (!cancelled) setForm(resumeToForm(data)); })
      .catch((err) => { if (!cancelled) setError(err.status === 404 ? 'Resume not found.' : err.message); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [id, isEdit]);

  const update = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  const updateArray = (field, index, itemField, value) => {
    setForm((f) => {
      const arr = [...(f[field] || [])];
      arr[index] = { ...arr[index], [itemField]: value };
      return { ...f, [field]: arr };
    });
  };

  const addItem = (field, empty) => {
    setForm((f) => ({ ...f, [field]: [...(f[field] || []), empty()] }));
  };

  const removeItem = (field, index) => {
    setForm((f) => ({
      ...f,
      [field]: (f[field] || []).filter((_, i) => i !== index),
    }));
  };

  const updateWorkDescription = (wi, di, value) => {
    setForm((f) => {
      const work = [...(f.workExperiences || [])];
      const desc = [...(work[wi]?.description || [''])];
      desc[di] = value;
      work[wi] = { ...work[wi], description: desc };
      return { ...f, workExperiences: work };
    });
  };

  const addWorkDescription = (wi) => {
    setForm((f) => {
      const work = [...(f.workExperiences || [])];
      work[wi] = { ...work[wi], description: [...(work[wi].description || []), ''] };
      return { ...f, workExperiences: work };
    });
  };

  const updateSkills = (index, value) => {
    setForm((f) => {
      const s = [...(f.skills || [''])];
      s[index] = value;
      return { ...f, skills: s };
    });
  };
  const addSkill = () => setForm((f) => ({ ...f, skills: [...(f.skills || []), ''] }));
  const removeSkill = (index) => setForm((f) => ({ ...f, skills: (f.skills || []).filter((_, i) => i !== index) }));

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const payload = formToPayload(form, isEdit);
      if (isEdit) {
        const data = await apiPut(`/api/resumes/${id}`, payload);
        navigate(`/resumes/${data.id}`, { replace: true });
      } else {
        const data = await apiPost('/api/resumes', payload);
        navigate(`/resumes/${data.id}`, { replace: true });
      }
    } catch (err) {
      setError(err.message || (isEdit ? 'Update failed.' : 'Create failed.'));
    } finally {
      setSubmitting(false);
    }
  }

  if (loading || !form) return <div className="page"><p>Loading…</p></div>;
  if (error && !form) return <div className="page"><p className="form-error">{error}</p><Link to="/resumes">Back</Link></div>;

  return (
    <div className="page resume-builder">
      <div className="page-header">
        <div>
          <h1>{isEdit ? 'Edit resume' : 'New resume'}</h1>
          <p className="muted">
            Capture your experience, education, and skills. You can tailor this CV later for specific roles.
          </p>
        </div>
        <Link to="/resumes" className="btn">
          Back to resumes
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="resume-form">
        {error && <p className="form-error">{error}</p>}

        <section className="resume-detail-card resume-form-card">
          <div className="profile-field-row">
            <div className="profile-field">
              <label htmlFor="title">Title *</label>
              <input
                id="title"
                value={form.title}
                onChange={(e) => update('title', e.target.value)}
                required
                placeholder="e.g. Senior Software Engineer"
              />
            </div>
            <div className="profile-field">
              <label htmlFor="imageUrl">Profile image URL</label>
              <input
                id="imageUrl"
                type="url"
                value={form.imageUrl}
                onChange={(e) => update('imageUrl', e.target.value)}
                placeholder="https://..."
              />
            </div>
          </div>

          <div className="profile-field">
            <label htmlFor="summary">Professional summary *</label>
            <textarea
              id="summary"
              value={form.description}
              onChange={(e) => update('description', e.target.value)}
              rows={3}
              required
              placeholder="A short 2–3 sentence overview of your experience and focus."
            />
          </div>
        </section>

        <section className="resume-detail-card resume-form-card">
          <h2>Work experience</h2>
          <p className="resume-detail-subtitle">
            Add your most relevant roles. Use bullet points to highlight impact and results.
          </p>
          {(form.workExperiences || []).map((w, wi) => (
            <fieldset key={wi} className="sub-form">
              <label>
                Company
                <input
                  value={w.company}
                  onChange={(e) => updateArray('workExperiences', wi, 'company', e.target.value)}
                />
              </label>
              <label>
                Position
                <input
                  value={w.position}
                  onChange={(e) => updateArray('workExperiences', wi, 'position', e.target.value)}
                />
              </label>
              <label>
                Start date
                <input
                  type="date"
                  value={w.startDate?.slice(0, 10) ?? ''}
                  onChange={(e) => updateArray('workExperiences', wi, 'startDate', e.target.value)}
                />
              </label>
              <label>
                End date
                <input
                  type="date"
                  value={w.endDate?.slice(0, 10) ?? ''}
                  onChange={(e) => updateArray('workExperiences', wi, 'endDate', e.target.value)}
                />
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={w.isCurrent}
                  onChange={(e) => updateArray('workExperiences', wi, 'isCurrent', e.target.checked)}
                />{' '}
                Current role
              </label>
              <label>Bullet points</label>
              {(w.description || []).map((d, di) => (
                <input
                  key={di}
                  value={d}
                  onChange={(e) => updateWorkDescription(wi, di, e.target.value)}
                  placeholder="Achievement or responsibility"
                />
              ))}
              <div className="resume-form-actions-row">
                <button type="button" onClick={() => addWorkDescription(wi)} className="btn">
                  + Bullet
                </button>
                <button
                  type="button"
                  onClick={() => removeItem('workExperiences', wi)}
                  className="btn danger"
                >
                  Remove
                </button>
              </div>
            </fieldset>
          ))}
          <button type="button" onClick={() => addItem('workExperiences', emptyWork)} className="btn">
            + Work experience
          </button>
        </section>

        <section className="resume-detail-card resume-form-card">
          <h2>Education</h2>
          {(form.educations || []).map((e, ei) => (
            <fieldset key={ei} className="sub-form">
              <label>
                School
                <input
                  value={e.school}
                  onChange={(ev) => updateArray('educations', ei, 'school', ev.target.value)}
                />
              </label>
              <label>
                Degree
                <input
                  value={e.degree}
                  onChange={(ev) => updateArray('educations', ei, 'degree', ev.target.value)}
                />
              </label>
              <label>
                Field of study
                <input
                  value={e.fieldOfStudy}
                  onChange={(ev) => updateArray('educations', ei, 'fieldOfStudy', ev.target.value)}
                />
              </label>
              <label>
                Start
                <input
                  type="date"
                  value={e.startDate?.slice(0, 10) ?? ''}
                  onChange={(ev) => updateArray('educations', ei, 'startDate', ev.target.value)}
                />
              </label>
              <label>
                End
                <input
                  type="date"
                  value={e.endDate?.slice(0, 10) ?? ''}
                  onChange={(ev) => updateArray('educations', ei, 'endDate', ev.target.value)}
                />
              </label>
              <div className="resume-form-actions-row">
                <button
                  type="button"
                  onClick={() => removeItem('educations', ei)}
                  className="btn danger"
                >
                  Remove
                </button>
              </div>
            </fieldset>
          ))}
          <button type="button" onClick={() => addItem('educations', emptyEducation)} className="btn">
            + Education
          </button>
        </section>

        <section className="resume-detail-card resume-form-card">
          <h2>Languages</h2>
          {(form.languages || []).map((l, li) => (
            <fieldset key={li} className="sub-form inline">
              <input
                value={l.name}
                onChange={(e) => updateArray('languages', li, 'name', e.target.value)}
                placeholder="Language"
              />
              <input
                value={l.level}
                onChange={(e) => updateArray('languages', li, 'level', e.target.value)}
                placeholder="Level"
              />
              <button
                type="button"
                onClick={() => removeItem('languages', li)}
                className="btn danger"
              >
                Remove
              </button>
            </fieldset>
          ))}
          <button type="button" onClick={() => addItem('languages', emptyLanguage)} className="btn">
            + Language
          </button>
        </section>

        <section className="resume-detail-card resume-form-card">
          <h2>Projects</h2>
          {(form.projects || []).map((p, pi) => (
            <fieldset key={pi} className="sub-form">
              <label>
                Title
                <input
                  value={p.title}
                  onChange={(e) => updateArray('projects', pi, 'title', e.target.value)}
                />
              </label>
              <label>
                Description
                <textarea
                  value={p.description}
                  onChange={(e) => updateArray('projects', pi, 'description', e.target.value)}
                  rows={2}
                />
              </label>
              <label>
                Link
                <input
                  type="url"
                  value={p.link}
                  onChange={(e) => updateArray('projects', pi, 'link', e.target.value)}
                />
              </label>
              <div className="resume-form-actions-row">
                <button
                  type="button"
                  onClick={() => removeItem('projects', pi)}
                  className="btn danger"
                >
                  Remove
                </button>
              </div>
            </fieldset>
          ))}
          <button type="button" onClick={() => addItem('projects', emptyProject)} className="btn">
            + Project
          </button>
        </section>

        <section className="resume-detail-card resume-form-card">
          <h2>Skills</h2>
          <p className="resume-detail-subtitle">
            Short, punchy skills help recruiters quickly understand your strengths.
          </p>
          <div className="resume-skills">
            {(form.skills || []).map((s, si) => (
              <span key={si} className="skill-row">
                <input
                  value={s}
                  onChange={(e) => updateSkills(si, e.target.value)}
                  placeholder="Skill"
                />
                <button
                  type="button"
                  onClick={() => removeSkill(si)}
                  className="btn danger"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <button type="button" onClick={addSkill} className="btn">
            + Skill
          </button>
        </section>

        <div className="resume-form-footer">
          <button type="submit" disabled={submitting} className="btn primary">
            {submitting ? 'Saving…' : isEdit ? 'Save changes' : 'Create resume'}
          </button>
          <Link to={isEdit ? `/resumes/${id}` : '/resumes'} className="btn">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
