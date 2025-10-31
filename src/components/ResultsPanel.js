import React, { useState, useEffect } from "react";
import { getStatus, listJobs, assetUrl } from "../api";

export default function ResultsPanel({ jobId }) {
  const [status, setStatus] = useState(null);
  const [jobList, setJobList] = useState([]);

  useEffect(() => {
    if (jobId) pollStatus(jobId);
  }, [jobId]);

  useEffect(() => {
    refreshJobs();
    const id = setInterval(refreshJobs, 10000);
    return ()=>clearInterval(id);
  }, []);

  async function refreshJobs() {
    try {
      const rows = await listJobs();
      setJobList(rows);
    } catch (e) {
      console.error(e);
    }
  }

  async function pollStatus(id) {
    setStatus({ status: "starting" });
    let tries = 0;
    while (tries < 40) {
      tries++;
      try {
        const s = await getStatus(id);
        setStatus(s);
        if (s.status === "done" || s.status === "failed") break;
      } catch (e) {
        console.error(e);
      }
      // simple delay
      await new Promise(res => setTimeout(res, 3000));
    }
  }

  return (
    <div className="card">
      <h2>Results</h2>
      {jobId && status && (
        <div>
          <div><strong>Job:</strong> {jobId}</div>
          <div><strong>Status:</strong> {status.status}</div>
          {status.result && status.status === "done" && (
            <div className="result-grid">
              <div>
                <h4>Before</h4>
                <img src={assetUrl(jobId, "before.png")} alt="before" className="preview"/>
              </div>
              <div>
                <h4>After</h4>
                <img src={assetUrl(jobId, "after.png")} alt="after" className="preview"/>
              </div>
              <div>
                <h4>Mask</h4>
                <img src={assetUrl(jobId, "mask.png")} alt="mask" className="preview"/>
              </div>
              <div>
                <h4>Overlay</h4>
                <img src={assetUrl(jobId, "overlay.png")} alt="overlay" className="preview"/>
              </div>
              <div style={{gridColumn: "1/-1"}}>
                <h4>Timelapse</h4>
                <video src={assetUrl(jobId, "timelapse.mp4")} controls style={{width:"100%"}} />
              </div>
            </div>
          )}
          {status.status === "failed" && <div className="error">Job failed: {status.result}</div>}
        </div>
      )}

      <h3 style={{marginTop:16}}>Recent jobs</h3>
      <ul className="job-list">
        {jobList.map(j => (
          <li key={j.job_id}>
            <strong>{j.job_id}</strong> — {j.status} — {j.bbox}
            {j.result && j.status === "done" && (
              <div><a href={assetUrl(j.job_id, "overlay.png")} target="_blank" rel="noreferrer">Open overlay</a></div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
