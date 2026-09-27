"use client";

import { useState } from "react";
import { detectDeforestation } from "../../lib/api";

function UploadZone({ label, file, onChange }) {
  const previewUrl = file ? URL.createObjectURL(file) : null;
  return (
    <div className="upload-zone">
      <label>{label}</label>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => onChange(e.target.files?.[0] || null)}
      />
      {previewUrl && <img src={previewUrl} alt={`${label} preview`} />}
    </div>
  );
}

export default function LiveDemo() {
  const [before, setBefore] = useState(null);
  const [after, setAfter] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const canRun = before && after && !loading;

  async function runDetection() {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const data = await detectDeforestation(before, after);
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <p className="hero-label">
        Upload two images of the same location at different points in time.
      </p>

      <div className="upload-row">
        <UploadZone label="Earlier image" file={before} onChange={setBefore} />
        <UploadZone label="Later image" file={after} onChange={setAfter} />
      </div>

      <button className="primary" onClick={runDetection} disabled={!canRun}>
        {loading ? "Running…" : "Run detection"}
      </button>

      {error && <p className="error-text" style={{ marginTop: 16 }}>{error}</p>}

      {result && (
        <>
          <div className="result-grid">
            <div className="result-item">
              <div className="class-name">{result.before.class}</div>
              <div className="confidence">{(result.before.confidence * 100).toFixed(1)}% confidence</div>
            </div>
            <div className="result-item">
              <div className="class-name">{result.after.class}</div>
              <div className="confidence">{(result.after.confidence * 100).toFixed(1)}% confidence</div>
            </div>
          </div>

          <div className={`verdict ${result.deforestation_detected ? "alert" : ""}`}>
            {result.deforestation_detected
              ? `Possible deforestation detected: Forest → ${result.after.class}`
              : "No deforestation transition detected"}
          </div>
        </>
      )}
    </>
  );
}