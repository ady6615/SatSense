import axios from "axios";
const BASE = process.env.REACT_APP_API || "http://localhost:8000";

export async function startProcessing(payload) {
  const res = await axios.post(`${BASE}/api/process`, payload);
  return res.data;
}
export async function getStatus(job_id) {
  const res = await axios.get(`${BASE}/api/status/${job_id}`);
  return res.data;
}
export async function listJobs() {
  const res = await axios.get(`${BASE}/api/jobs`);
  return res.data;
}
export function assetUrl(job_id, filename) {
  return `${process.env.REACT_APP_API || "http://localhost:8000"}/assets/${job_id}/${filename}`;
}
