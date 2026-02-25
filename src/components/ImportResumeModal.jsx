import { useState } from 'react';

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
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      const model = import.meta.env.VITE_GEMINI_MODEL ?? 'gemini-1.5-pro-latest';
      if (!apiKey) {
        throw new Error('Gemini API key is not configured (VITE_GEMINI_API_KEY).');
      }

      const arrayBuffer = await file.arrayBuffer();
      const bytes = new Uint8Array(arrayBuffer);
      let binary = '';
      for (let i = 0; i < bytes.length; i += 1) {
        binary += String.fromCharCode(bytes[i]);
      }
      const base64Data = btoa(binary);

      const prompt = `
You are a CV/resume parser. Read the attached PDF and extract a single JSON object with EXACTLY this shape:

{
  "title": string,
  "description": string,
  "imageUrl": string | null,
  "workExperiences": [
    {
      "company": string,
      "position": string,
      "description": [string],
      "startDate": string | null,
      "endDate": string | null,
      "isCurrent": boolean
    }
  ],
  "educations": [
    {
      "school": string,
      "degree": string,
      "fieldOfStudy": string,
      "startDate": string | null,
      "endDate": string | null
    }
  ],
  "languages": [
    { "name": string, "level": string }
  ],
  "projects": [
    { "title": string, "description": string, "link": string | null }
  ],
  "skills": [string]
}

- Use ISO 8601 dates in the form yyyy-MM-dd when possible.
- If a value is unknown, you may use null, empty string, or omit the item from arrays.
- Respond with JSON ONLY. Do not include backticks or any explanation text.`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  { text: prompt },
                  {
                    inlineData: {
                      mimeType: 'application/pdf',
                      data: base64Data,
                    },
                  },
                ],
              },
            ],
            generationConfig: {
              temperature: 0.2,
              responseMimeType: 'application/json',
            },
          }),
        },
      );

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(errText || 'Gemini request failed.');
      }

      const geminiJson = await response.json();
      let text =
        geminiJson.candidates?.[0]?.content?.parts?.[0]?.text ??
        geminiJson.candidates?.[0]?.output_text ??
        '';

      text = text.trim();

      // Strip markdown fences like ```json ... ``` if present
      if (text.startsWith('```')) {
        text = text
          .replace(/^```[a-zA-Z]*\s*/i, '') // remove opening ``` or ```json
          .replace(/```$/, '') // remove trailing ```
          .trim();
      }

      const parsed = JSON.parse(text);
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

