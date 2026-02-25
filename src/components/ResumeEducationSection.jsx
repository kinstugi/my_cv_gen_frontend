export default function ResumeEducationSection({
  educations,
  updateArray,
  onAddEducation,
  onRemoveEducation,
}) {
  return (
    <section className="resume-detail-card resume-form-card">
      <h2>Education</h2>
      {(educations || []).map((e, ei) => (
        <fieldset key={ei} className="sub-form">
          <label>
            School
            <input
              value={e.school}
              onChange={(ev) => updateArray('educations', ei, 'school', ev.target.value)}
            />
          </label>
          <label>
            Degree
            <input
              value={e.degree}
              onChange={(ev) => updateArray('educations', ei, 'degree', ev.target.value)}
            />
          </label>
          <label>
            Field of study
            <input
              value={e.fieldOfStudy}
              onChange={(ev) => updateArray('educations', ei, 'fieldOfStudy', ev.target.value)}
            />
          </label>
          <label>
            Start
            <input
              type="date"
              value={e.startDate?.slice(0, 10) ?? ''}
              onChange={(ev) => updateArray('educations', ei, 'startDate', ev.target.value)}
            />
          </label>
          <label>
            End
            <input
              type="date"
              value={e.endDate?.slice(0, 10) ?? ''}
              onChange={(ev) => updateArray('educations', ei, 'endDate', ev.target.value)}
            />
          </label>
          <div className="resume-form-actions-row">
            <button
              type="button"
              onClick={() => onRemoveEducation(ei)}
              className="btn danger"
            >
              Remove
            </button>
          </div>
        </fieldset>
      ))}
      <button type="button" onClick={onAddEducation} className="btn">
        + Education
      </button>
    </section>
  );
}

