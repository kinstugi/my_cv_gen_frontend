export default function ResumeBasicsSection({ form, update }) {
  return (
    <section className="resume-detail-card resume-form-card">
      <div className="profile-field-row">
        <div className="profile-field">
          <label htmlFor="title">Title *</label>
          <input
            id="title"
            value={form.title}
            onChange={(e) => update('title', e.target.value)}
            required
            placeholder="e.g. Senior Software Engineer"
          />
        </div>
        <div className="profile-field">
          <label htmlFor="imageUrl">Profile image URL</label>
          <input
            id="imageUrl"
            type="url"
            value={form.imageUrl}
            onChange={(e) => update('imageUrl', e.target.value)}
            placeholder="https://..."
          />
        </div>
      </div>

      <div className="profile-field">
        <label htmlFor="summary">Professional summary *</label>
        <textarea
          id="summary"
          value={form.description}
          onChange={(e) => update('description', e.target.value)}
          rows={3}
          required
          placeholder="A short 2–3 sentence overview of your experience and focus."
        />
      </div>
    </section>
  );
}

