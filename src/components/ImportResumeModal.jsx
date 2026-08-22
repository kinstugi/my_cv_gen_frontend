import { useState } from 'react';
import { apiFetch } from '../api/client.js';

export default function ImportResumeModal({ open, onClose, onImported }) {
  const [file, setFile] = useState(null);
  const [importing, setImporting] = useState(false);
  const [error, setError] = useState('');

  if (!open) return null;

  async function handleExtract() {
    if (!file) return;
    setError('');
    setImporting(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const parsed = await apiFetch('/api/resumes/import', {
        method: 'POST',
        body: formData,
      });
      onImported(parsed);
      setFile(null);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to extract data from CV.');
    } finally {
      setImporting(false);
    }
  }

  function handleClose() {
    setFile(null);
    setError('');
    onClose();
  }

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <div className="modal-header">
          <h2>Import CV (PDF)</h2>
          <button type="button" className="modal-close" onClick={handleClose}>
            ×
          </button>
        </div>
        <div className="modal-body">
          <p className="resume-detail-subtitle">
            Choose a PDF CV file. We&apos;ll extract your experience, education, projects, languages,
            and skills into the resume builder.
          </p>
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => {
              setError('');
              setFile(e.target.files?.[0] ?? null);
            }}
          />
          {error && <p className="form-error">{error}</p>}
        </div>
        <div className="modal-footer">
          <button type="button" className="btn" onClick={handleClose}>
            Cancel
          </button>
          <button
            type="button"
            className="btn primary"
            onClick={handleExtract}
            disabled={!file || importing}
          >
            {importing ? 'Extracting…' : 'Extract from PDF'}
          </button>
        </div>
      </div>
    </div>
  );
}
