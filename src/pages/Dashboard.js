import React, { useState } from "react";
import { signOut, auth } from "../firebase";
import { Satellite, Upload, MapPin, Calendar, Zap, Download, TrendingUp, AlertTriangle, Globe2, Layers, Search, Image } from "lucide-react";
import "./Dashboard.css";

const Dashboard = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('analyze');
  const [beforeImage, setBeforeImage] = useState(null);
  const [afterImage, setAfterImage] = useState(null);
  const [location, setLocation] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [eventType, setEventType] = useState('');
  const [analysisResult, setAnalysisResult] = useState(null);

  const handleLogout = async () => {
    await signOut(auth);
    onLogout();
  };

  const handleFileUpload = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === 'before') {
          setBeforeImage(reader.result);
        } else {
          setAfterImage(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = () => {
    setAnalysisResult({
      changeDetected: true,
      accuracy: 87,
      changedArea: 234,
      severity: 'High'
    });
  };

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-left">
          <Satellite className="header-icon" />
          <h1 className="header-title">SatSense Dashboard</h1>
        </div>
        <div className="header-right">
          <div className="user-info">
            <span className="user-name">{user.displayName}</span>
            <img 
              src={user.photoURL} 
              alt="Profile" 
              className="profile-pic"
              onClick={handleLogout}
            />
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="nav-tabs">
        <button 
          className={`tab-btn ${activeTab === 'analyze' ? 'active' : ''}`}
          onClick={() => setActiveTab('analyze')}
        >
          <Zap className="tab-icon" />
          Analyze Images
        </button>
        <button 
          className={`tab-btn ${activeTab === 'search' ? 'active' : ''}`}
          onClick={() => setActiveTab('search')}
        >
          <Search className="tab-icon" />
          Search Location
        </button>
        <button 
          className={`tab-btn ${activeTab === 'events' ? 'active' : ''}`}
          onClick={() => setActiveTab('events')}
        >
          <AlertTriangle className="tab-icon" />
          Event Detection
        </button>
      </div>

      {/* Main Content */}
      <div className="dashboard-content">
        {activeTab === 'analyze' && (
          <div className="content-section">
            <h2 className="section-title">
              <Layers className="section-icon" />
              Image Analysis & Morphing
            </h2>
            
            <div className="upload-grid">
              {/* Before Image Upload */}
              <div className="upload-card">
                <div className="upload-header">
                  <Image className="upload-icon" />
                  <h3>Before Image</h3>
                </div>
                <div className="upload-area">
                  {beforeImage ? (
                    <img src={beforeImage} alt="Before" className="preview-image" />
                  ) : (
                    <div className="upload-placeholder">
                      <Upload className="placeholder-icon" />
                      <p>Click to upload satellite image</p>
                    </div>
                  )}
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, 'before')}
                    className="file-input"
                  />
                </div>
              </div>

              {/* After Image Upload */}
              <div className="upload-card">
                <div className="upload-header">
                  <Image className="upload-icon" />
                  <h3>After Image</h3>
                </div>
                <div className="upload-area">
                  {afterImage ? (
                    <img src={afterImage} alt="After" className="preview-image" />
                  ) : (
                    <div className="upload-placeholder">
                      <Upload className="placeholder-icon" />
                      <p>Click to upload satellite image</p>
                    </div>
                  )}
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, 'after')}
                    className="file-input"
                  />
                </div>
              </div>
            </div>

            {/* Analysis Controls */}
            <div className="controls-section">
              <div className="input-group">
                <label className="input-label">
                  <MapPin className="label-icon" />
                  Location Coordinates
                </label>
                <input 
                  type="text" 
                  placeholder="e.g., 40.7128°N, 74.0060°W"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="input-field"
                />
              </div>

              <div className="input-group">
                <label className="input-label">
                  <AlertTriangle className="label-icon" />
                  Event Type
                </label>
                <select 
                  value={eventType}
                  onChange={(e) => setEventType(e.target.value)}
                  className="input-field"
                >
                  <option value="">Select Event Type</option>
                  <option value="wildfire">Wildfire</option>
                  <option value="flood">Flood</option>
                  <option value="deforestation">Deforestation</option>
                  <option value="urban">Urban Development</option>
                  <option value="earthquake">Earthquake</option>
                  <option value="hurricane">Hurricane</option>
                </select>
              </div>

              <button className="analyze-btn" onClick={handleAnalyze}>
                <Zap className="btn-icon" />
                Analyze Changes
              </button>
            </div>

            {/* Results */}
            {analysisResult && (
              <div className="results-section">
                <h3 className="results-title">Analysis Results</h3>
                <div className="results-grid">
                  <div className="result-card">
                    <TrendingUp className="result-icon" />
                    <div className="result-value">{analysisResult.accuracy}%</div>
                    <div className="result-label">Detection Accuracy</div>
                  </div>
                  <div className="result-card">
                    <Globe2 className="result-icon" />
                    <div className="result-value">{analysisResult.changedArea} km²</div>
                    <div className="result-label">Changed Area</div>
                  </div>
                  <div className="result-card">
                    <AlertTriangle className="result-icon" />
                    <div className="result-value">{analysisResult.severity}</div>
                    <div className="result-label">Severity Level</div>
                  </div>
                </div>
                <button className="download-btn">
                  <Download className="btn-icon" />
                  Download Report
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'search' && (
          <div className="content-section">
            <h2 className="section-title">
              <Globe2 className="section-icon" />
              Search Satellite Images by Location
            </h2>
            
            <div className="search-form">
              <div className="input-group">
                <label className="input-label">
                  <MapPin className="label-icon" />
                  Location Name or Coordinates
                </label>
                <input 
                  type="text" 
                  placeholder="e.g., Los Angeles or 34.0522°N, 118.2437°W"
                  className="input-field large"
                />
              </div>

              <div className="input-row">
                <div className="input-group">
                  <label className="input-label">
                    <Calendar className="label-icon" />
                    Start Date
                  </label>
                  <input 
                    type="date" 
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="input-field"
                  />
                </div>

                <div className="input-group">
                  <label className="input-label">
                    <Calendar className="label-icon" />
                    End Date
                  </label>
                  <input 
                    type="date" 
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="input-field"
                  />
                </div>
              </div>

              <div className="input-group">
                <label className="input-label">
                  <Satellite className="label-icon" />
                  Satellite Source
                </label>
                <select className="input-field">
                  <option value="">All Sources</option>
                  <option value="landsat">Landsat 8/9</option>
                  <option value="sentinel">Sentinel-2</option>
                  <option value="modis">MODIS</option>
                  <option value="planet">Planet Labs</option>
                </select>
              </div>

              <button className="search-btn">
                <Search className="btn-icon" />
                Search Images
              </button>
            </div>

            <div className="image-gallery">
              <div className="gallery-card">
                <div className="gallery-image" style={{background: 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)'}}></div>
                <div className="gallery-info">
                  <p className="gallery-date">2024-10-15</p>
                  <p className="gallery-source">Sentinel-2</p>
                </div>
              </div>
              <div className="gallery-card">
                <div className="gallery-image" style={{background: 'linear-gradient(135deg, #93c5fd 0%, #60a5fa 100%)'}}></div>
                <div className="gallery-info">
                  <p className="gallery-date">2024-09-20</p>
                  <p className="gallery-source">Landsat 8</p>
                </div>
              </div>
              <div className="gallery-card">
                <div className="gallery-image" style={{background: 'linear-gradient(135deg, #38bdf8 0%, #0ea5e9 100%)'}}></div>
                <div className="gallery-info">
                  <p className="gallery-date">2024-08-10</p>
                  <p className="gallery-source">MODIS</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'events' && (
          <div className="content-section">
            <h2 className="section-title">
              <AlertTriangle className="section-icon" />
              Recent Event Detections
            </h2>

            <div className="events-list">
              <div className="event-card severe">
                <div className="event-header">
                  <AlertTriangle className="event-icon" />
                  <div>
                    <h3 className="event-title">Wildfire Detection</h3>
                    <p className="event-location">California, USA</p>
                  </div>
                </div>
                <div className="event-details">
                  <span className="event-badge severe">Severe</span>
                  <span className="event-date">Oct 28, 2025</span>
                </div>
                <p className="event-description">Large-scale wildfire detected with 456 km² affected area</p>
              </div>

              <div className="event-card warning">
                <div className="event-header">
                  <TrendingUp className="event-icon" />
                  <div>
                    <h3 className="event-title">Deforestation Alert</h3>
                    <p className="event-location">Amazon Rainforest, Brazil</p>
                  </div>
                </div>
                <div className="event-details">
                  <span className="event-badge warning">Warning</span>
                  <span className="event-date">Oct 25, 2025</span>
                </div>
                <p className="event-description">Significant forest loss detected in protected area</p>
              </div>

              <div className="event-card moderate">
                <div className="event-header">
                  <Globe2 className="event-icon" />
                  <div>
                    <h3 className="event-title">Urban Expansion</h3>
                    <p className="event-location">Mumbai, India</p>
                  </div>
                </div>
                <div className="event-details">
                  <span className="event-badge moderate">Moderate</span>
                  <span className="event-date">Oct 20, 2025</span>
                </div>
                <p className="event-description">Rapid urban development detected in coastal region</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;