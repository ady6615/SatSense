import React from "react";
import { signInWithPopup, auth, provider } from "../firebase";
import { Satellite, Globe2, Layers, Zap, Shield, TrendingUp } from "lucide-react";
import "./LandingPage.css";

const LandingPage = ({ onLogin }) => {
  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      onLogin(result.user);
    } catch (error) {
      console.error("Login Error:", error);
    }
  };

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <div className="container">
        {/* Navigation */}
        <nav className="navbar">
          <div className="logo">
            <Satellite className="logo-icon" />
            <span className="logo-text">SatSense</span>
          </div>
          <button onClick={handleLogin} className="nav-login-btn">
            Login with Google
          </button>
        </nav>

        {/* Main Hero Content */}
        <div className="hero-section">
          <div className="hero-content">
            <div className="hero-badge">
              AI-Powered Satellite Analysis
            </div>
            <h1 className="hero-title">
              Smart Satellite Image Morphing & Event Reconstruction
            </h1>
            <p className="hero-description">
              Analyze before-and-after satellite imagery with advanced AI to detect environmental changes, disasters, and urban development in real-time.
            </p>
            <div className="hero-buttons">
              <button onClick={handleLogin} className="btn-primary">
                Get Started
                <Zap className="btn-icon" />
              </button>
              <button className="btn-secondary">
                Watch Demo
              </button>
            </div>
          </div>

          {/* Hero Visual */}
          <div className="hero-visual-wrapper">
            <div className="hero-visual">
              <div className="visual-card">
                <div className="visual-header">
                  <span className="visual-label">Before</span>
                  <Layers className="visual-icon" />
                  <span className="visual-label">After</span>
                </div>
                <div className="visual-grid">
                  <div className="visual-item before">
                    <div className="visual-overlay"></div>
                    <Globe2 className="visual-globe before-globe" />
                  </div>
                  <div className="visual-item after">
                    <div className="visual-overlay"></div>
                    <Globe2 className="visual-globe after-globe" />
                  </div>
                </div>
              </div>
              <div className="accuracy-card">
                <p className="accuracy-text">Change Detection: 87% Accuracy</p>
              </div>
            </div>
            <div className="glow-orb glow-orb-1"></div>
            <div className="glow-orb glow-orb-2"></div>
          </div>
        </div>

        {/* Features Section */}
        <div className="features-section">
          <h2 className="section-title">
            Powerful Features for Change Detection
          </h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon-wrapper blue">
                <Satellite className="feature-icon" />
              </div>
              <h3 className="feature-title">Image Morphing</h3>
              <p className="feature-description">
                Seamlessly blend satellite images to visualize gradual environmental changes over time with AI-powered interpolation.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrapper indigo">
                <TrendingUp className="feature-icon" />
              </div>
              <h3 className="feature-title">Event Reconstruction</h3>
              <p className="feature-description">
                Reconstruct disaster timelines and environmental events through intelligent analysis of temporal satellite data.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrapper sky">
                <Shield className="feature-icon" />
              </div>
              <h3 className="feature-title">Disaster Detection</h3>
              <p className="feature-description">
                Automatically identify natural disasters, deforestation, urban sprawl, and other critical changes with high precision.
              </p>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="stats-section">
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number">10M+</div>
              <div className="stat-label">Images Analyzed</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">95%</div>
              <div className="stat-label">Detection Accuracy</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">150+</div>
              <div className="stat-label">Countries Covered</div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="cta-section">
          <h2 className="cta-title">
            Ready to Unlock Earth's Changes?
          </h2>
          <p className="cta-description">
            Join researchers, governments, and organizations using SatSense to monitor our planet and respond to critical changes faster.
          </p>
          <button onClick={handleLogin} className="cta-button">
            Start Analyzing Now
          </button>
        </div>

        {/* Footer */}
        <footer className="footer">
          <div className="footer-logo">
            <Satellite className="footer-icon" />
            <span className="footer-text">SatSense</span>
          </div>
          <p className="footer-copyright">© 2025 SatSense. Powered by AI for a better tomorrow.</p>
        </footer>
      </div>
    </div>
  );
};

export default LandingPage;