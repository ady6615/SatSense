import React, { useState } from "react";
import { startProcessing } from "../api";

/*
Simple selector — users input bbox coords and dates.
You can enhance to use Leaflet draw tools to pick bbox visually.
*/

export default function MapSelector({ onJobCreated }) {
  const [minLon, setMinLon] = useState("");
  const [minLat, setMinLat] = useState("");
  const [maxLon, setMaxLon] = useState("");
  const [maxLat, setMaxLat] = useState("");
  const [beforeStart, setBeforeStart] = useState("");
  const [beforeEnd, setBeforeEnd] = useState("");
  const [afterStart, setAfterStart] = useState("");
  const [afterEnd, setAfterEnd] = useState("");
  const [sensor, setSensor] = useState("SENTINEL_2");
  const [status, setStatus] = useState("");

  async function submit(e) {
    e.preventDefault();
    setStatus("Starting job...");
    try {
      const payload = {
        min_lon: parseFloat(minLon),
        min_lat: parseFloat(minLat),
        max_lon: parseFloat(maxLon),
        max_lat: parseFloat(maxLat),
        before_start: beforeStart,
        before_end: beforeEnd,
        after_start: afterStart,
        after_end: afterEnd,
        sensor
      };
      const res = await startProcessing(payload);
      setStatus(`Job started: ${res.job_id}`);
      onJobCreated(res.job_id);
    } catch (err) {
      console.error(err);
      setStatus("Error: " + (err.message || "failed"));
    }
  }

  return (
    <div className="card">
      <h2>Define area & dates</h2>
      <form onSubmit={submit} className="form">
        <div className="row">
          <input placeholder="minLon" value={minLon} onChange={e=>setMinLon(e.target.value)} required />
          <input placeholder="minLat" value={minLat} onChange={e=>setMinLat(e.target.value)} required />
        </div>
        <div className="row">
          <input placeholder="maxLon" value={maxLon} onChange={e=>setMaxLon(e.target.value)} required />
          <input placeholder="maxLat" value={maxLat} onChange={e=>setMaxLat(e.target.value)} required />
        </div>
        <label>Before period</label>
        <div className="row">
          <input type="date" value={beforeStart} onChange={e=>setBeforeStart(e.target.value)} required />
          <input type="date" value={beforeEnd} onChange={e=>setBeforeEnd(e.target.value)} required />
        </div>
        <label>After period</label>
        <div className="row">
          <input type="date" value={afterStart} onChange={e=>setAfterStart(e.target.value)} required />
          <input type="date" value={afterEnd} onChange={e=>setAfterEnd(e.target.value)} required />
        </div>
        <label>Sensor</label>
        <select value={sensor} onChange={e=>setSensor(e.target.value)}>
          <option value="SENTINEL_2">Sentinel-2</option>
          <option value="LANDSAT_8">Landsat-8</option>
        </select>
        <button type="submit">Start processing</button>
        <div className="muted">{status}</div>
      </form>
    </div>
  );
}
