/**
 * Template4 – React equivalent of C# QuestPDF Template4.
 * Tan header bar (photo + name + title + contact); two-column body: left (skills, languages), right (profile, experience, education, projects).
 */

import './Template4.css';

const ACCENT_COLOR = '#b0a48a';
const GREY_MED = '#6b7280';
const GREY_DARK = '#4b5563';

function formatDate(iso) {
  if (!iso) return '—';
  try {
    const d = new Date(iso);
    return isNaN(d.getTime()) ? iso : d.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' });
  } catch {
    return iso;
  }
}

function formatYear(iso) {
  if (!iso) return '—';
  try {
    const d = new Date(iso);
    return isNaN(d.getTime()) ? iso : d.getFullYear().toString();
  } catch {
    return iso;
  }
}

function SectionTitle({ title }) {
  return <h2 className="cv-template4-section-title">{title}</h2>;
}

export default function Template4({ model = {} }) {
  const {
    name = '',
    title = '',
    description: summary = '',
    imageUrl = '',
    phone = '',
    email = '',
    location = '',
    githubUrl = '',
    website = '',
    workExperiences = [],
    projects = [],
    educations = [],
    skills = [],
    languages = [],
  } = model;

  const workList = Array.isArray(workExperiences) ? workExperiences : [];
  const projectList = Array.isArray(projects) ? projects : [];
  const educationList = Array.isArray(educations) ? educations : [];
  const skillList = Array.isArray(skills) ? skills.filter(Boolean) : [];
  const languageList = Array.isArray(languages) ? languages.filter((l) => l?.name) : [];

  return (
    <div className="cv-template4">
      <div className="cv-template4-page">
        {/* --- TAN HEADER BAR --- */}
        <header className="cv-template4-header" style={{ background: ACCENT_COLOR }}>
          <div className="cv-template4-header-photo">
            {imageUrl && <img src={imageUrl} alt="" />}
          </div>
          <div className="cv-template4-header-info">
            <h1 className="cv-template4-name">{name || 'Your name'}</h1>
            {title && <p className="cv-template4-title">{title}</p>}
            <div className="cv-template4-contact">
              {phone && <div>📞 {phone}</div>}
              {email && <div>✉️ {email}</div>}
              {location && <div>📍 {location}</div>}
              {githubUrl && <div>🔗 {githubUrl}</div>}
              {website && <div>🌐 {website}</div>}
            </div>
          </div>
        </header>

        {/* --- TWO-COLUMN MAIN BODY --- */}
        <div className="cv-template4-body">
          {/* LEFT: Skills & Languages */}
          <aside className="cv-template4-sidebar">
            {skillList.length > 0 && (
              <div className="cv-template4-sidebar-block">
                <SectionTitle title="SKILLS" />
                {skillList.map((skill, i) => (
                  <div key={i} className="cv-template4-sidebar-item">{skill}</div>
                ))}
              </div>
            )}
            {languageList.length > 0 && (
              <div className="cv-template4-sidebar-block">
                <SectionTitle title="LANGUAGES" />
                {languageList.map((lang, i) => (
                  <div key={i} className="cv-template4-sidebar-item">
                    {lang.name}{lang.level ? ` (${lang.level})` : ''}
                  </div>
                ))}
              </div>
            )}
          </aside>

          <div className="cv-template4-spacer" />

          {/* RIGHT: Profile, Experience, Education, Projects */}
          <main className="cv-template4-main">
            {summary && (
              <>
                <SectionTitle title="PROFILE" />
                <p className="cv-template4-summary">{summary}</p>
              </>
            )}

            {workList.length > 0 && (
              <div className="cv-template4-block">
                <SectionTitle title="WORK EXPERIENCE" />
                {workList.map((exp, i) => {
                  const endLabel = exp.isCurrent || !exp.endDate ? 'Present' : formatDate(exp.endDate);
                  const bullets = Array.isArray(exp.description)
                    ? exp.description.filter(Boolean)
                    : exp.description
                      ? String(exp.description).split(/\n/).map((s) => s.trim()).filter(Boolean)
                      : [];
                  return (
                    <div key={i} className="cv-template4-entry">
                      <div className="cv-template4-entry-row">
                        <span className="cv-template4-entry-title">{exp.position || 'Position'}</span>
                        <span className="cv-template4-dates" style={{ color: GREY_MED }}>
                          {formatDate(exp.startDate)} - {endLabel}
                        </span>
                      </div>
                      <p className="cv-template4-entry-sub" style={{ color: GREY_DARK }}>{exp.company}</p>
                      {bullets.length > 0 && (
                        <ul className="cv-template4-bullets">
                          {bullets.map((b, j) => (
                            <li key={j}>{b}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {educationList.length > 0 && (
              <div className="cv-template4-block">
                <SectionTitle title="EDUCATION" />
                {educationList.map((edu, i) => (
                  <div key={i} className="cv-template4-edu-row">
                    <div>
                      <div className="cv-template4-edu-degree">
                        {[edu.degree, edu.fieldOfStudy].filter(Boolean).join(' in ') || 'Degree'}
                      </div>
                      <div className="cv-template4-edu-school" style={{ color: GREY_DARK }}>
                        {edu.school} / {formatYear(edu.endDate)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {projectList.length > 0 && (
              <div className="cv-template4-block">
                <SectionTitle title="PROJECTS" />
                {projectList.map((proj, i) => (
                  <div key={i} className="cv-template4-proj">
                    <div className="cv-template4-entry-title">{proj.title || 'Project'}</div>
                    {proj.description && <p className="cv-template4-proj-desc">{proj.description}</p>}
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
