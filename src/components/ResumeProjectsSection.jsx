export default function ResumeProjectsSection({
  projects,
  updateArray,
  onAddProject,
  onRemoveProject,
}) {
  return (
    <section className="resume-detail-card resume-form-card">
      <div className="resume-section-header">
        <div className="resume-section-title">
          <span className="resume-section-icon">📁</span>
          <h2>Projects</h2>
        </div>
        <p className="resume-detail-subtitle">
          Showcase key projects and portfolio work that support your CV.
        </p>
      </div>
      {(projects || []).map((p, pi) => (
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
              onClick={() => onRemoveProject(pi)}
              className="btn danger"
            >
              Remove
            </button>
          </div>
        </fieldset>
      ))}
      <button type="button" onClick={onAddProject} className="btn">
        + Project
      </button>
    </section>
  );
}

