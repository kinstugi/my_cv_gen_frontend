/**
 * Template1 – React equivalent of C# QuestPDF Template1.
 * Beige sidebar (contact, skills, languages) + main content (profile, experience, projects, education).
 */

import './Template1.css';

const SIDEBAR_COLOR = '#e9e5d9';
const ACCENT_GOLD = '#b29b7d';
const TEXT_DARK = '#333333';

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

export default function Template1({ model = {} }) {
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

  const hasContact = phone || email || location || githubUrl || website;
  const workList = Array.isArray(workExperiences) ? workExperiences : [];
  const projectList = Array.isArray(projects) ? projects : [];
  const educationList = Array.isArray(educations) ? educations : [];
  const skillList = Array.isArray(skills) ? skills.filter(Boolean) : [];
  const languageList = Array.isArray(languages) ? languages.filter((l) => l?.name) : [];

  return (
    <div className="cv-template1">
      <div className="cv-template1-page">
        <div className="cv-template1-row">
          {/* --- SIDEBAR --- */}
          <aside className="cv-template1-sidebar" style={{ background: SIDEBAR_COLOR }}>
            {imageUrl && (
              <div className="cv-template1-photo-wrap">
                <img src={imageUrl} alt="" className="cv-template1-photo" />
              </div>
            )}
            <div className="cv-template1-sidebar-block">
              <div className="cv-template1-sidebar-heading">CONTACT</div>
              <div className="cv-template1-sidebar-content">
                {!hasContact && <span className="cv-template1-muted">—</span>}
                {phone && <div>📞 {phone}</div>}
                {email && <div>✉️ {email}</div>}
                {location && <div>📍 {location}</div>}
                {githubUrl && <div>🔗 {githubUrl}</div>}
                {website && <div>🌐 {website}</div>}
              </div>
            </div>
            {skillList.length > 0 && (
              <div className="cv-template1-sidebar-block">
                <div className="cv-template1-sidebar-heading">SKILLS</div>
                <ul className="cv-template1-list">
                  {skillList.map((skill, i) => (
                    <li key={i}>{skill}</li>
                  ))}
                </ul>
              </div>
            )}
            {languageList.length > 0 && (
              <div className="cv-template1-sidebar-block">
                <div className="cv-template1-sidebar-heading">LANGUAGES</div>
                <ul className="cv-template1-list">
                  {languageList.map((lang, i) => (
                    <li key={i}>
                      {lang.name}
                      {lang.level ? ` (${lang.level})` : ''}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </aside>

          {/* --- MAIN CONTENT --- */}
          <main className="cv-template1-main">
            <h1 className="cv-template1-name">{name || 'Your name'}</h1>
            <p className="cv-template1-title" style={{ color: ACCENT_GOLD }}>
              {title || 'Professional title'}
            </p>
            <div className="cv-template1-spacer" />

            {summary && (
              <>
                <h2 className="cv-template1-section">PROFILE</h2>
                <p className="cv-template1-summary">{summary}</p>
                <div className="cv-template1-spacer-lg" />
              </>
            )}

            {workList.length > 0 && (
              <>
                <h2 className="cv-template1-section">WORK EXPERIENCE</h2>
                <div className="cv-template1-spacer-sm" />
                {workList.map((exp, i) => {
                  const endLabel = exp.isCurrent || !exp.endDate ? 'Present' : formatDate(exp.endDate);
                  const bullets = Array.isArray(exp.description)
                    ? exp.description.filter(Boolean)
                    : exp.description
                      ? String(exp.description).split(/\n/).map((s) => s.trim()).filter(Boolean)
                      : [];
                  return (
                    <div key={i} className="cv-template1-entry">
                      <div className="cv-template1-entry-row">
                        <span className="cv-template1-entry-title">{exp.position || 'Position'}</span>
                        <span className="cv-template1-muted">
                          {formatDate(exp.startDate)} – {endLabel}
                        </span>
                      </div>
                      <div className="cv-template1-entry-sub" style={{ color: ACCENT_GOLD }}>
                        {exp.company}
                      </div>
                      {bullets.length > 0 && (
                        <ul className="cv-template1-bullets">
                          {bullets.map((b, j) => (
                            <li key={j}>{b}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  );
                })}
                <div className="cv-template1-spacer-lg" />
              </>
            )}

            {projectList.length > 0 && (
              <>
                <h2 className="cv-template1-section">PROJECTS</h2>
                <div className="cv-template1-spacer-sm" />
                {projectList.map((proj, i) => (
                  <div key={i} className="cv-template1-entry">
                    <div className="cv-template1-entry-row">
                      <span className="cv-template1-entry-title">{proj.title || 'Project'}</span>
                      {proj.link && (
                        <a href={proj.link} target="_blank" rel="noopener noreferrer" className="cv-template1-link">
                          {proj.link}
                        </a>
                      )}
                    </div>
                    {proj.description && <p className="cv-template1-desc">{proj.description}</p>}
                  </div>
                ))}
                <div className="cv-template1-spacer-lg" />
              </>
            )}

            {educationList.length > 0 && (
              <>
                <h2 className="cv-template1-section">EDUCATION</h2>
                <div className="cv-template1-spacer-sm" />
                {educationList.map((edu, i) => (
                  <div key={i} className="cv-template1-entry">
                    <div className="cv-template1-entry-row">
                      <span className="cv-template1-entry-title">
                        {[edu.degree, edu.fieldOfStudy].filter(Boolean).join(' in ') || 'Degree'}
                      </span>
                      <span className="cv-template1-muted">{formatYear(edu.endDate)}</span>
                    </div>
                    <div className="cv-template1-entry-sub" style={{ color: ACCENT_GOLD }}>
                      {edu.school}
                    </div>
                  </div>
                ))}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
