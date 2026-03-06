/**
 * Modern BW template (frontend-only preview).
 * Adapted from `/Users/baffour/Desktop/cv_temps/temp_codes/modern_bw_tem.jsx`
 * - Removed dummy/default data and edit mode
 * - Uses the app's `model` shape (same as Template1-4)
 */

import './ModernBwTemplate.css';

function formatDateRange(startDate, endDate, isCurrent) {
  const start = startDate ? String(startDate).slice(0, 10) : '';
  const end = isCurrent || !endDate ? 'Present' : String(endDate).slice(0, 10);
  if (!start && !endDate && !isCurrent) return '';
  return [start, end].filter(Boolean).join(' - ');
}

function initials(name) {
  const parts = String(name || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2);
  if (!parts.length) return '';
  return parts.map((p) => p[0]?.toUpperCase()).join('');
}

export default function ModernBwTemplate({ model = {} }) {
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
    <div className="cv-modernbw-shell">
      <div className="cv-modernbw-page">
        {/* SIDEBAR */}
        <aside className="cv-modernbw-sidebar">
          <div className="cv-modernbw-avatarWrap">
            <div className="cv-modernbw-avatar" aria-label="Profile photo">
              {imageUrl ? (
                <img src={imageUrl} alt="" />
              ) : (
                <span className="cv-modernbw-avatarText">{initials(name) || '👤'}</span>
              )}
            </div>
          </div>

          <section className="cv-modernbw-block">
            <div className="cv-modernbw-sideHeading">Contact</div>
            {location && (
              <>
                <div className="cv-modernbw-sideLabel">Location</div>
                <div className="cv-modernbw-sideValue">{location}</div>
              </>
            )}
            {phone && (
              <>
                <div className="cv-modernbw-sideLabel">Phone</div>
                <div className="cv-modernbw-sideValue">{phone}</div>
              </>
            )}
            {email && (
              <>
                <div className="cv-modernbw-sideLabel">Email</div>
                <div className="cv-modernbw-sideValue">{email}</div>
              </>
            )}
            {githubUrl && (
              <>
                <div className="cv-modernbw-sideLabel">GitHub</div>
                <div className="cv-modernbw-sideValue">{githubUrl}</div>
              </>
            )}
            {website && (
              <>
                <div className="cv-modernbw-sideLabel">Website</div>
                <div className="cv-modernbw-sideValue">{website}</div>
              </>
            )}
          </section>

          {educationList.length > 0 && (
            <section className="cv-modernbw-block">
              <div className="cv-modernbw-sideHeading">Education</div>
              {educationList.map((edu, i) => (
                <div key={i} className="cv-modernbw-eduItem">
                  <div className="cv-modernbw-eduYears">
                    {edu.startDate?.slice?.(0, 4) || ''}
                    {edu.startDate || edu.endDate ? ' - ' : ''}
                    {edu.endDate?.slice?.(0, 4) || ''}
                  </div>
                  <div className="cv-modernbw-eduDegree">
                    {[edu.degree, edu.fieldOfStudy].filter(Boolean).join(' in ')}
                  </div>
                  <div className="cv-modernbw-sideValue">{edu.school}</div>
                </div>
              ))}
            </section>
          )}

          {skillList.length > 0 && (
            <section className="cv-modernbw-block">
              <div className="cv-modernbw-sideHeading">Skills</div>
              <ul className="cv-modernbw-bullets">
                {skillList.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </section>
          )}

          {languageList.length > 0 && (
            <section className="cv-modernbw-block">
              <div className="cv-modernbw-sideHeading">Language</div>
              <ul className="cv-modernbw-bullets cv-modernbw-bulletsStrong">
                {languageList.map((l, i) => (
                  <li key={i}>
                    {l.name}
                    {l.level ? ` (${l.level})` : ''}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </aside>

        {/* MAIN */}
        <main className="cv-modernbw-main">
          <header className="cv-modernbw-nameBlock">
            <div className="cv-modernbw-name">{name || 'Your name'}</div>
            {title && <div className="cv-modernbw-title">{title}</div>}
            {summary && <p className="cv-modernbw-summary">{summary}</p>}
          </header>

          {workList.length > 0 && (
            <section className="cv-modernbw-mainSection">
              <div className="cv-modernbw-mainHeading">Experience</div>
              {workList.map((exp, i) => {
                const range = formatDateRange(exp.startDate, exp.endDate, exp.isCurrent);
                const bullets = Array.isArray(exp.description)
                  ? exp.description.filter(Boolean)
                  : exp.description
                    ? String(exp.description).split(/\n/).map((s) => s.trim()).filter(Boolean)
                    : [];
                return (
                  <div key={i} className="cv-modernbw-expItem">
                    <div className="cv-modernbw-expDot" aria-hidden="true" />
                    <div className="cv-modernbw-expBody">
                      {range && <div className="cv-modernbw-expMeta">{range}</div>}
                      <div className="cv-modernbw-expCompany">
                        {[exp.company, exp.location].filter(Boolean).join(' ')}
                      </div>
                      <div className="cv-modernbw-expRole">{exp.position}</div>
                      {bullets.length > 0 && (
                        <ul className="cv-modernbw-expBullets">
                          {bullets.map((b, bi) => (
                            <li key={bi}>{b}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                );
              })}
            </section>
          )}

          {projectList.length > 0 && (
            <section className="cv-modernbw-mainSection">
              <div className="cv-modernbw-mainHeading">Projects</div>
              {projectList.map((p, i) => (
                <div key={i} className="cv-modernbw-proj">
                  <div className="cv-modernbw-projTitleRow">
                    <div className="cv-modernbw-projTitle">{p.title}</div>
                    {p.link && (
                      <a className="cv-modernbw-projLink" href={p.link} target="_blank" rel="noopener noreferrer">
                        {p.link}
                      </a>
                    )}
                  </div>
                  {p.description && <div className="cv-modernbw-projDesc">{p.description}</div>}
                </div>
              ))}
            </section>
          )}
        </main>
      </div>
    </div>
  );
}

