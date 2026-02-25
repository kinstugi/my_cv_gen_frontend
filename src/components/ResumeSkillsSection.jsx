export default function ResumeSkillsSection({
  languages,
  skills,
  updateArray,
  updateSkills,
  onAddLanguage,
  onRemoveLanguage,
  onAddSkill,
  onRemoveSkill,
}) {
  return (
    <>
      <section className="resume-detail-card resume-form-card">
        <h2>Languages</h2>
        {(languages || []).map((l, li) => (
          <fieldset key={li} className="sub-form inline">
            <input
              value={l.name}
              onChange={(e) => updateArray('languages', li, 'name', e.target.value)}
              placeholder="Language"
            />
            <input
              value={l.level}
              onChange={(e) => updateArray('languages', li, 'level', e.target.value)}
              placeholder="Level"
            />
            <button
              type="button"
              onClick={() => onRemoveLanguage(li)}
              className="btn danger"
            >
              Remove
            </button>
          </fieldset>
        ))}
        <button type="button" onClick={onAddLanguage} className="btn">
          + Language
        </button>
      </section>

      <section className="resume-detail-card resume-form-card">
        <h2>Skills</h2>
        <p className="resume-detail-subtitle">
          Short, punchy skills help recruiters quickly understand your strengths.
        </p>
        <div className="resume-skills">
          {(skills || []).map((s, si) => (
            <span key={si} className="skill-row">
              <input
                value={s}
                onChange={(e) => updateSkills(si, e.target.value)}
                placeholder="Skill"
              />
              <button
                type="button"
                onClick={() => onRemoveSkill(si)}
                className="btn danger"
              >
                ×
              </button>
            </span>
          ))}
        </div>
        <button type="button" onClick={onAddSkill} className="btn">
          + Skill
        </button>
      </section>
    </>
  );
}

