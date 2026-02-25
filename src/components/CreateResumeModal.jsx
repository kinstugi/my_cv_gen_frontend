import { useState } from 'react';

export default function CreateResumeModal({ open, onClose, onChoose }) {
  const [selected, setSelected] = useState(null);

  if (!open) return null;

  function handleStart() {
    if (!selected) return;
    onChoose(selected);
    setSelected(null);
  }

  function handleCancel() {
    setSelected(null);
    onClose();
  }

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <div className="modal-header">
          <h2>How would you like to start?</h2>
          <button type="button" onClick={handleCancel} className="modal-close">
            ×
          </button>
        </div>

        <div className="modal-body">
          <button
            type="button"
            onClick={() => setSelected('manual')}
            className={`modal-option ${selected === 'manual' ? 'selected' : ''}`}
          >
            <div className="modal-option-icon">
              <span>✏️</span>
            </div>
            <div className="modal-option-text">
              <h3>Create manually</h3>
              <p>Fill in the resume builder form from scratch.</p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setSelected('import')}
            className={`modal-option ${selected === 'import' ? 'selected' : ''}`}
          >
            <div className="modal-option-icon">
              <span>📄</span>
            </div>
            <div className="modal-option-text">
              <h3>Import CV (PDF)</h3>
              <p>Upload a PDF CV to use as a starting point.</p>
            </div>
          </button>
        </div>

        <div className="modal-footer">
          <button type="button" onClick={handleCancel} className="btn">
            Cancel
          </button>
          <button
            type="button"
            onClick={handleStart}
            disabled={!selected}
            className="btn primary"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}

