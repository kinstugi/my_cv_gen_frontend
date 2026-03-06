/**
 * Olivia template (frontend-only preview).
 * Adapted from `/Users/baffour/Desktop/cv_temps/temp_codes/ResumeOlivia.jsx`
 * - Removed dummy/default data and edit mode
 * - Uses the app's `model` shape (same as Template1-4)
 */

import './ResumeOliviaTemplate.css';

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

export default function ResumeOliviaTemplate({ model = {} }) {
  const {
    name = '',
    title = '',
    description: about = '',
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
    <div className="cv-olivia-shell">
      <div className="cv-olivia-card">
        {/* LEFT COLUMN */}
        <section className="cv-olivia-left">
          <div className="cv-olivia-photo" aria-label="Profile photo">
            {imageUrl ? <img src={imageUrl} alt="" /> : <span className="cv-olivia-photoText">{initials(name) || '👤'}</span>}
          </div>

          <header className="cv-olivia-header">
            {name && <div className="cv-olivia-name">{name}</div>}
            {title && <div className="cv-olivia-title">{title}</div>}
          </header>

          {workList.length > 0 && (
            <div className="cv-olivia-block">
              <div className="cv-olivia-sectionTitle">Work Experience</div>
              {workList.map((exp, i) => {
                const range = dateRange(exp.startDate, exp.endDate, exp.isCurrent);
                const bullets = Array.isArray(exp.description)
                  ? exp.description.filter(Boolean)
                  : exp.description
                    ? String(exp.description).split(/\n/).map((s) => s.trim()).filter(Boolean)
                    : [];
                return (
                  <div key={i} className="cv-olivia-expItem">
                    <div className="cv-olivia-expTop">
                      <div className="cv-olivia-expRole">{exp.position}</div>
                      {range && <div className="cv-olivia-expYears">{range}</div>}
                    </div>
                    <div className="cv-olivia-expCompany">{exp.company}</div>
                    {bullets.length > 0 && (
                      <ul className="cv-olivia-expBullets">
                        {bullets.map((b, bi) => (
                          <li key={bi}>{b}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {projectList.length > 0 && (
            <div className="cv-olivia-block">
              <div className="cv-olivia-sectionTitle">Projects</div>
              {projectList.map((p, i) => (
                <div key={i} className="cv-olivia-projItem">
                  <div className="cv-olivia-projTitleRow">
                    <div className="cv-olivia-projTitle">{p.title}</div>
                    {p.link && (
                      <a className="cv-olivia-projLink" href={p.link} target="_blank" rel="noopener noreferrer">
                        {p.link}
                      </a>
                    )}
                  </div>
                  {p.description && <div className="cv-olivia-projDesc">{p.description}</div>}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* RIGHT COLUMN */}
        <aside className="cv-olivia-right">
          <div className="cv-olivia-block">
            <div className="cv-olivia-sectionTitle">Contacts</div>
            <div className="cv-olivia-contactList">
              {phone && <div className="cv-olivia-contactRow"><span className="cv-olivia-contactIcon">📞</span><span>{phone}</span></div>}
              {email && <div className="cv-olivia-contactRow"><span className="cv-olivia-contactIcon">✉️</span><span>{email}</span></div>}
              {website && <div className="cv-olivia-contactRow"><span className="cv-olivia-contactIcon">🌐</span><span>{website}</span></div>}
              {location && <div className="cv-olivia-contactRow"><span className="cv-olivia-contactIcon">📍</span><span>{location}</span></div>}
              {githubUrl && <div className="cv-olivia-contactRow"><span className="cv-olivia-contactIcon">🔗</span><span>{githubUrl}</span></div>}
            </div>
          </div>

          {about && (
            <div className="cv-olivia-block">
              <div className="cv-olivia-sectionTitle">About Me</div>
              <div className="cv-olivia-about">{about}</div>
            </div>
          )}

          {educationList.length > 0 && (
            <div className="cv-olivia-block">
              <div className="cv-olivia-sectionTitle">Education</div>
              {educationList.map((edu, i) => (
                <div key={i} className="cv-olivia-eduItem">
                  <div className="cv-olivia-eduDegree">
                    {[edu.degree, edu.fieldOfStudy].filter(Boolean).join(' in ')}
                  </div>
                  <div className="cv-olivia-eduSchool">{edu.school}</div>
                  {(edu.startDate || edu.endDate) && (
                    <div className="cv-olivia-eduYears">
                      {year(edu.startDate)}
                      {(edu.startDate || edu.endDate) ? ' – ' : ''}
                      {year(edu.endDate)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {skillList.length > 0 && (
            <div className="cv-olivia-block">
              <div className="cv-olivia-sectionTitle">Skills</div>
              <ul className="cv-olivia-skillList">
                {skillList.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>
          )}

          {languageList.length > 0 && (
            <div className="cv-olivia-block">
              <div className="cv-olivia-sectionTitle">Languages</div>
              <ul className="cv-olivia-skillList">
                {languageList.map((l, i) => (
                  <li key={i}>{l.name}{l.level ? ` (${l.level})` : ''}</li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}

