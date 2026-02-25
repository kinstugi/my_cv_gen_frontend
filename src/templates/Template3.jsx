/**
 * Template3 – React equivalent of C# QuestPDF Template3.
 * Single column: centered header + contact bar, section headers with underline, no sidebar.
 */

import './Template3.css';

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

function SectionHeader({ title }) {
  return (
    <h2 className="cv-template3-section-header">{title}</h2>
  );
}

export default function Template3({ model = {} }) {
  const {
    name = '',
    title = '',
    description: summary = '',
    phone = '',
    email = '',
    location = '',
    githubUrl = '',
    website = '',
    workExperiences = [],
    projects = [],
    educations = [],
    skills = [],
  } = model;

  const contactItems = [
    phone && { label: `📞 ${phone}` },
    email && { label: `✉️ ${email}` },
    location && { label: `📍 ${location}` },
    githubUrl && { label: `🔗 ${githubUrl}` },
    website && { label: `🌐 ${website}` },
  ].filter(Boolean);

  const workList = Array.isArray(workExperiences) ? workExperiences : [];
  const projectList = Array.isArray(projects) ? projects : [];
  const educationList = Array.isArray(educations) ? educations : [];
  const skillList = Array.isArray(skills) ? skills.filter(Boolean) : [];

  return (
    <div className="cv-template3">
      <div className="cv-template3-page">
        <div className="cv-template3-column">
          {/* --- HEADER --- */}
          <header className="cv-template3-header">
            <h1 className="cv-template3-name">{(name || 'Your name').toUpperCase()}</h1>
            {title && <p className="cv-template3-title">{title}</p>}
          </header>

          {/* --- CONTACT BAR --- */}
          {contactItems.length > 0 && (
            <div className="cv-template3-contact-bar">
              {contactItems.map((item, i) => (
                <span key={i}>{item.label}</span>
              ))}
            </div>
          )}

          {/* --- PROFILE --- */}
          {summary && (
            <>
              <SectionHeader title="Profile" />
              <p className="cv-template3-summary">{summary}</p>
            </>
          )}

          {/* --- SKILLS --- */}
          {skillList.length > 0 && (
            <>
              <SectionHeader title="Skills" />
              <p className="cv-template3-skills">{skillList.join('  •  ')}</p>
            </>
          )}

          {/* --- WORK EXPERIENCE --- */}
          {workList.length > 0 && (
            <>
              <SectionHeader title="Work experience" />
              {workList.map((exp, i) => {
                const endLabel = exp.isCurrent || !exp.endDate ? 'Present' : formatDate(exp.endDate);
                const bullets = Array.isArray(exp.description)
                  ? exp.description.filter(Boolean)
                  : exp.description
                    ? String(exp.description).split(/\n/).map((s) => s.trim()).filter(Boolean)
                    : [];
                return (
                  <div key={i} className="cv-template3-entry">
                    <div className="cv-template3-entry-row">
                      <span className="cv-template3-entry-title">{exp.position || 'Position'}</span>
                      <span className="cv-template3-dates">
                        {formatDate(exp.startDate)} - {endLabel}
                      </span>
                    </div>
                    <p className="cv-template3-entry-sub" style={{ color: GREY_DARK }}>{exp.company}</p>
                    {bullets.length > 0 && (
                      <ul className="cv-template3-bullets">
                        {bullets.map((b, j) => (
                          <li key={j}>{b}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                );
              })}
            </>
          )}

          {/* --- EDUCATION --- */}
          {educationList.length > 0 && (
            <>
              <SectionHeader title="Education" />
              {educationList.map((edu, i) => (
                <div key={i} className="cv-template3-edu-row">
                  <div>
                    <div className="cv-template3-entry-title">
                      {[edu.degree, edu.fieldOfStudy].filter(Boolean).join(' in ') || 'Degree'}
                    </div>
                    <div className="cv-template3-entry-sub" style={{ color: GREY_DARK }}>{edu.school}</div>
                  </div>
                  <span className="cv-template3-dates">{formatYear(edu.endDate)}</span>
                </div>
              ))}
            </>
          )}

          {/* --- PROJECTS --- */}
          {projectList.length > 0 && (
            <>
              <SectionHeader title="Projects" />
              {projectList.map((proj, i) => (
                <div key={i} className="cv-template3-entry">
                  <div className="cv-template3-entry-row">
                    <span className="cv-template3-entry-title">{proj.title || 'Project'}</span>
                    {proj.link && (
                      <a href={proj.link} target="_blank" rel="noopener noreferrer" className="cv-template3-link">
                        {proj.link}
                      </a>
                    )}
                  </div>
                  {proj.description && <p className="cv-template3-desc">{proj.description}</p>}
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
