/**
 * Korina template (frontend-only preview).
 * Adapted from `/Users/baffour/Desktop/cv_temps/temp_codes/ResumeKorina.jsx`
 * - Removed dummy/default data and edit mode
 * - Uses the app's `model` shape (same as Template1-4)
 */

import './ResumeKorinaTemplate.css';

function initials(name) {
  const parts = String(name || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2);
  if (!parts.length) return '';
  return parts.map((p) => p[0]?.toUpperCase()).join('');
}

function year(iso) {
  if (!iso) return '';
  try {
    const d = new Date(iso);
    return isNaN(d.getTime()) ? String(iso).slice(0, 4) : String(d.getFullYear());
  } catch {
    return String(iso).slice(0, 4);
  }
}

function dateRange(startDate, endDate, isCurrent) {
  const start = year(startDate);
  const end = isCurrent || !endDate ? 'Present' : year(endDate);
  if (!start && !endDate && !isCurrent) return '';
  return [start, end].filter(Boolean).join(' – ');
}

export default function ResumeKorinaTemplate({ model = {} }) {
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
    educations = [],
    skills = [],
    languages = [],
    projects = [],
  } = model;

  const workList = Array.isArray(workExperiences) ? workExperiences : [];
  const educationList = Array.isArray(educations) ? educations : [];
  const skillList = Array.isArray(skills) ? skills.filter(Boolean) : [];
  const languageList = Array.isArray(languages) ? languages.filter((l) => l?.name) : [];
  const projectList = Array.isArray(projects) ? projects.filter((p) => p?.title || p?.description) : [];

  return (
    <div className="cv-korina-shell">
      <div className="cv-korina-page">
        {/* LEFT SIDEBAR */}
        <aside className="cv-korina-sidebar">
          <div className="cv-korina-avatarWrap">
            <div className="cv-korina-avatar" aria-label="Profile photo">
              {imageUrl ? (
                <img src={imageUrl} alt="" />
              ) : (
                <span className="cv-korina-avatarText">{initials(name) || '👤'}</span>
              )}
            </div>
          </div>

          {(phone || email || location || githubUrl || website) && (
            <section className="cv-korina-block">
              <h3 className="cv-korina-leftHeading">Contact</h3>
              {phone && (
                <div className="cv-korina-contactRow">
                  <span className="cv-korina-contactIcon">📠</span>
                  <div className="cv-korina-leftText">{phone}</div>
                </div>
              )}
              {email && (
                <div className="cv-korina-contactRow">
                  <span className="cv-korina-contactIcon">✉️</span>
                  <div className="cv-korina-leftText">{email}</div>
                </div>
              )}
              {location && (
                <div className="cv-korina-contactRow">
                  <span className="cv-korina-contactIcon">📍</span>
                  <div className="cv-korina-leftText">{location}</div>
                </div>
              )}
              {githubUrl && (
                <div className="cv-korina-contactRow">
                  <span className="cv-korina-contactIcon">🔗</span>
                  <div className="cv-korina-leftText">{githubUrl}</div>
                </div>
              )}
              {website && (
                <div className="cv-korina-contactRow">
                  <span className="cv-korina-contactIcon">🌐</span>
                  <div className="cv-korina-leftText">{website}</div>
                </div>
              )}
            </section>
          )}

          {educationList.length > 0 && (
            <section className="cv-korina-block">
              <h3 className="cv-korina-leftHeading">Education</h3>
              {educationList.map((edu, i) => (
                <div key={i} className="cv-korina-eduRow">
                  <span className="cv-korina-dot" aria-hidden="true">⬤</span>
                  <div>
                    <div className="cv-korina-leftText">{edu.school}</div>
                    <div className="cv-korina-leftSub">
                      {[edu.degree, edu.fieldOfStudy].filter(Boolean).join(' in ')}
                    </div>
                    {(edu.startDate || edu.endDate) && (
                      <div className="cv-korina-leftMeta">
                        {year(edu.startDate)}
                        {(edu.startDate || edu.endDate) ? ' – ' : ''}
                        {year(edu.endDate)}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </section>
          )}

          {skillList.length > 0 && (
            <section className="cv-korina-block">
              <h3 className="cv-korina-leftHeading">Skill</h3>
              <ul className="cv-korina-bullets">
                {skillList.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </section>
          )}

          {languageList.length > 0 && (
            <section className="cv-korina-block">
              <h3 className="cv-korina-leftHeading">Languages</h3>
              <ul className="cv-korina-bullets">
                {languageList.map((l, i) => (
                  <li key={i}>
                    {l.name}{l.level ? ` (${l.level})` : ''}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </aside>

        {/* RIGHT MAIN CONTENT */}
        <main className="cv-korina-main">
          {(name || title) && (
            <header className="cv-korina-header">
              {name && <div className="cv-korina-name">{name}</div>}
              {title && <div className="cv-korina-title">{title}</div>}
            </header>
          )}

          <div className="cv-korina-divider" />

          {summary && (
            <section className="cv-korina-section">
              <h3 className="cv-korina-rightHeading">Profile</h3>
              <div className="cv-korina-paragraph">{summary}</div>
            </section>
          )}

          {workList.length > 0 && (
            <section className="cv-korina-section">
              <h3 className="cv-korina-rightHeading">Work Experience</h3>
              {workList.map((exp, i) => {
                const range = dateRange(exp.startDate, exp.endDate, exp.isCurrent);
                const bullets = Array.isArray(exp.description)
                  ? exp.description.filter(Boolean)
                  : exp.description
                    ? String(exp.description).split(/\n/).map((s) => s.trim()).filter(Boolean)
                    : [];
                return (
                  <div key={i} className="cv-korina-expItem">
                    <div className="cv-korina-expTitle">
                      {[exp.company, exp.position].filter(Boolean).join(' | ')}
                    </div>
                    {range && <div className="cv-korina-expMeta">{range}</div>}
                    {bullets.length > 0 ? (
                      <ul className="cv-korina-expBullets">
                        {bullets.map((b, bi) => (
                          <li key={bi}>{b}</li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                );
              })}
            </section>
          )}

          {projectList.length > 0 && (
            <section className="cv-korina-section">
              <h3 className="cv-korina-rightHeading">Projects</h3>
              <div className="cv-korina-projectGrid">
                {projectList.map((p, i) => (
                  <div key={i} className="cv-korina-projectCard">
                    <div className="cv-korina-projectTitle">{p.title}</div>
                    {p.link && (
                      <a className="cv-korina-projectLink" href={p.link} target="_blank" rel="noopener noreferrer">
                        {p.link}
                      </a>
                    )}
                    {p.description && <div className="cv-korina-projectDesc">{p.description}</div>}
                  </div>
                ))}
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}

