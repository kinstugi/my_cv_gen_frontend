export default function ResumeProjectsSection({
  projects,
  updateArray,
  onAddProject,
  onRemoveProject,
}) {
  return (
    <section className="resume-detail-card resume-form-card">
      <h2>Projects</h2>
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

