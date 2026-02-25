export default function ResumeExperienceSection({
  workExperiences,
  updateArray,
  updateWorkDescription,
  addWorkDescription,
  onAddExperience,
  onRemoveExperience,
}) {
  return (
    <section className="resume-detail-card resume-form-card">
      <div className="resume-section-header">
        <div className="resume-section-title">
          <span className="resume-section-icon">💼</span>
          <h2>Work experience</h2>
        </div>
        <p className="resume-detail-subtitle">
          Add your professional roles and highlight results with bullet points.
        </p>
      </div>
      {(workExperiences || []).map((w, wi) => (
        <fieldset key={wi} className="sub-form">
          <label>
            Company
            <input
              value={w.company}
              onChange={(e) => updateArray('workExperiences', wi, 'company', e.target.value)}
            />
          </label>
          <label>
            Position
            <input
              value={w.position}
              onChange={(e) => updateArray('workExperiences', wi, 'position', e.target.value)}
            />
          </label>
          <label>
            Start date
            <input
              type="date"
              value={w.startDate?.slice(0, 10) ?? ''}
              onChange={(e) => updateArray('workExperiences', wi, 'startDate', e.target.value)}
            />
          </label>
          <label>
            End date
            <input
              type="date"
              value={w.endDate?.slice(0, 10) ?? ''}
              onChange={(e) => updateArray('workExperiences', wi, 'endDate', e.target.value)}
            />
          </label>
          <label>
            <input
              type="checkbox"
              checked={w.isCurrent}
              onChange={(e) => updateArray('workExperiences', wi, 'isCurrent', e.target.checked)}
            />{' '}
            Current role
          </label>
          <label>Bullet points</label>
          {(w.description || []).map((d, di) => (
            <input
              key={di}
              value={d}
              onChange={(e) => updateWorkDescription(wi, di, e.target.value)}
              placeholder="Achievement or responsibility"
            />
          ))}
          <div className="resume-form-actions-row">
            <button type="button" onClick={() => addWorkDescription(wi)} className="btn">
              + Bullet
            </button>
            <button
              type="button"
              onClick={() => onRemoveExperience(wi)}
              className="btn danger"
            >
              Remove
            </button>
          </div>
        </fieldset>
      ))}
      <button type="button" onClick={onAddExperience} className="btn">
        + Work experience
      </button>
    </section>
  );
}

