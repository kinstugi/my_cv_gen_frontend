import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import { apiGet, apiPost, apiPut } from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';
import { getTemplate } from '../templates/index.js';
import ResumeBasicsSection from '../components/ResumeBasicsSection.jsx';
import ResumeExperienceSection from '../components/ResumeExperienceSection.jsx';
import ResumeEducationSection from '../components/ResumeEducationSection.jsx';
import ResumeProjectsSection from '../components/ResumeProjectsSection.jsx';
import ResumeSkillsSection from '../components/ResumeSkillsSection.jsx';

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
  const tabs = [
    { id: 'basics', label: 'Basics' },
    { id: 'experience', label: 'Experience' },
    { id: 'education', label: 'Education' },
    { id: 'projects', label: 'Projects' },
    { id: 'skills', label: 'Skills & languages' },
  ];
  const { user } = useAuth();
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(isEdit);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('basics');

  const previewModel = useMemo(() => {
    if (!form) return null;
    const name = user?.firstName && user?.lastName
      ? `${user.firstName} ${user.lastName}`.trim()
      : user?.firstName || user?.lastName || user?.name || '';
    return {
      name,
      title: form.title ?? '',
      description: form.description ?? '',
      imageUrl: form.imageUrl ?? '',
      phone: user?.phone ?? '',
      email: user?.email ?? '',
      location: user?.location ?? '',
      githubUrl: user?.githubUrl ?? '',
      website: user?.website ?? '',
      workExperiences: form.workExperiences ?? [],
      projects: form.projects ?? [],
      educations: form.educations ?? [],
      skills: form.skills ?? [],
      languages: form.languages ?? [],
    };
  }, [form, user]);

  const PreviewTemplate = getTemplate('template1');

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

      <div className="resume-builder-layout">
        <form onSubmit={handleSubmit} className="resume-form">
          {error && <p className="form-error">{error}</p>}

          <div className="resume-tabs" aria-label="Resume sections">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                className={`resume-tab ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === 'basics' && (
          <ResumeBasicsSection form={form} update={update} />
          )}

          {activeTab === 'experience' && (
          <ResumeExperienceSection
            workExperiences={form.workExperiences || []}
            updateArray={updateArray}
            updateWorkDescription={updateWorkDescription}
            addWorkDescription={addWorkDescription}
            onAddExperience={() => addItem('workExperiences', emptyWork)}
            onRemoveExperience={(index) => removeItem('workExperiences', index)}
          />
          )}

          {activeTab === 'education' && (
          <ResumeEducationSection
            educations={form.educations || []}
            updateArray={updateArray}
            onAddEducation={() => addItem('educations', emptyEducation)}
            onRemoveEducation={(index) => removeItem('educations', index)}
          />
          )}

          {activeTab === 'projects' && (
          <ResumeProjectsSection
            projects={form.projects || []}
            updateArray={updateArray}
            onAddProject={() => addItem('projects', emptyProject)}
            onRemoveProject={(index) => removeItem('projects', index)}
          />
          )}

          {activeTab === 'skills' && (
          <ResumeSkillsSection
            languages={form.languages || []}
            skills={form.skills || []}
            updateArray={updateArray}
            updateSkills={updateSkills}
            onAddLanguage={() => addItem('languages', emptyLanguage)}
            onRemoveLanguage={(index) => removeItem('languages', index)}
            onAddSkill={addSkill}
            onRemoveSkill={removeSkill}
          />
          )}

          <div className="resume-form-footer">
            <button type="submit" disabled={submitting} className="btn primary">
              {submitting ? 'Saving…' : isEdit ? 'Save changes' : 'Create resume'}
            </button>
            <Link to={isEdit ? `/resumes/${id}` : '/resumes'} className="btn">
              Cancel
            </Link>
          </div>
        </form>

        <aside className="resume-preview-pane">
          <div className="resume-detail-card resume-preview-wrap">
            <h2>Preview</h2>
            <p className="resume-detail-subtitle">
              Template 1 – live preview of your CV.
            </p>
            <div className="resume-preview-body">
              {PreviewTemplate && previewModel ? (
                <PreviewTemplate model={previewModel} />
              ) : (
                <>
                  <h3 className="resume-preview-title">{form?.title || 'Job title'}</h3>
                  <p className="resume-preview-summary">
                    {form?.description || 'Your professional summary will be shown here.'}
                  </p>
                  {form?.skills?.length > 0 && (
                    <div className="resume-preview-chips">
                      {form.skills.filter(Boolean).map((skill, idx) => (
                        <span key={idx} className="resume-preview-chip">{skill}</span>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
