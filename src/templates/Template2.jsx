/**
 * Template2 – React equivalent of C# QuestPDF Template2.
 * Main content left (name, summary, experience, education, projects);
 * sidebar right (image, contact, skills, languages) – #b0a48a, white text.
 */

import './Template2.css';

const SIDEBAR_COLOR = '#b0a48a';
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

export default function Template2({ model = {} }) {
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
    <div className="cv-template2">
      <div className="cv-template2-page">
        <div className="cv-template2-row">
          {/* --- MAIN CONTENT (Left) --- */}
          <main className="cv-template2-main">
            <h1 className="cv-template2-name">{name || 'Your name'}</h1>
            {title && <p className="cv-template2-title" style={{ color: GREY_DARK }}>{title}</p>}
            <div className="cv-template2-spacer" />

            {summary && (
              <>
                <h2 className="cv-template2-section">PROFESSIONAL SUMMARY</h2>
                <div className="cv-template2-spacer-sm" />
                <p className="cv-template2-summary">{summary}</p>
                <div className="cv-template2-spacer-lg" />
              </>
            )}

            {workList.length > 0 && (
              <>
                <h2 className="cv-template2-section">EXPERIENCE</h2>
                <div className="cv-template2-spacer-sm" />
                {workList.map((exp, i) => {
                  const endLabel = exp.isCurrent || !exp.endDate ? 'Present' : formatDate(exp.endDate);
                  const bullets = Array.isArray(exp.description)
                    ? exp.description.filter(Boolean)
                    : exp.description
                      ? String(exp.description).split(/\n/).map((s) => s.trim()).filter(Boolean)
                      : [];
                  return (
                    <div key={i} className="cv-template2-entry">
                      <div className="cv-template2-entry-row">
                        <div>
                          <div className="cv-template2-entry-title">{exp.position || 'Position'}</div>
                          <div className="cv-template2-entry-sub" style={{ color: SIDEBAR_COLOR }}>{exp.company}</div>
                        </div>
                        <span className="cv-template2-muted">
                          {formatDate(exp.startDate)} - {endLabel}
                        </span>
                      </div>
                      {bullets.length > 0 && (
                        <ul className="cv-template2-bullets">
                          {bullets.map((b, j) => (
                            <li key={j}>{b}</li>
                          ))}
                        </ul>
                      )}
                      <div className="cv-template2-entry-gap" />
                    </div>
                  );
                })}
                <div className="cv-template2-spacer-lg" />
              </>
            )}

            {educationList.length > 0 && (
              <>
                <h2 className="cv-template2-section">EDUCATION</h2>
                <div className="cv-template2-spacer-sm" />
                {educationList.map((edu, i) => (
                  <div key={i} className="cv-template2-entry">
                    <div className="cv-template2-entry-row">
                      <div>
                        <div className="cv-template2-entry-title">
                          {[edu.degree, edu.fieldOfStudy].filter(Boolean).join(' in ') || 'Degree'}
                        </div>
                        <div className="cv-template2-entry-sub" style={{ color: SIDEBAR_COLOR }}>{edu.school}</div>
                      </div>
                      <span className="cv-template2-muted">
                        {formatYear(edu.startDate)} - {formatYear(edu.endDate)}
                      </span>
                    </div>
                    <div className="cv-template2-entry-gap" />
                  </div>
                ))}
                <div className="cv-template2-spacer-lg" />
              </>
            )}

            {projectList.length > 0 && (
              <>
                <h2 className="cv-template2-section">PROJECTS</h2>
                <div className="cv-template2-spacer-sm" />
                {projectList.map((proj, i) => (
                  <div key={i} className="cv-template2-entry">
                    <div className="cv-template2-entry-row">
                      <span className="cv-template2-entry-title">{proj.title || 'Project'}</span>
                      {proj.link && (
                        <a href={proj.link} target="_blank" rel="noopener noreferrer" className="cv-template2-link">
                          {proj.link}
                        </a>
                      )}
                    </div>
                    {proj.description && <p className="cv-template2-desc">{proj.description}</p>}
                    <div className="cv-template2-entry-gap" />
                  </div>
                ))}
              </>
            )}
          </main>

          {/* --- SIDEBAR (Right) --- */}
          <aside className="cv-template2-sidebar" style={{ background: SIDEBAR_COLOR }}>
            {imageUrl && (
              <div className="cv-template2-photo-wrap">
                <img src={imageUrl} alt="" className="cv-template2-photo" />
              </div>
            )}
            <div className="cv-template2-sidebar-block">
              <div className="cv-template2-sidebar-heading">CONTACT</div>
              <div className="cv-template2-sidebar-content">
                {!hasContact && <span>—</span>}
                {location && <div>{location}</div>}
                {phone && <div>{phone}</div>}
                {email && <div>{email}</div>}
                {githubUrl && <div>{githubUrl}</div>}
                {website && <div>{website}</div>}
              </div>
            </div>
            {skillList.length > 0 && (
              <div className="cv-template2-sidebar-block">
                <div className="cv-template2-sidebar-heading">SKILLS</div>
                <ul className="cv-template2-sidebar-list">
                  {skillList.map((skill, i) => (
                    <li key={i}>{skill}</li>
                  ))}
                </ul>
              </div>
            )}
            {languageList.length > 0 && (
              <div className="cv-template2-sidebar-block">
                <div className="cv-template2-sidebar-heading">LANGUAGES</div>
                <ul className="cv-template2-sidebar-list">
                  {languageList.map((lang, i) => (
                    <li key={i}>{lang.name}{lang.level ? ` (${lang.level})` : ''}</li>
                  ))}
                </ul>
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}
