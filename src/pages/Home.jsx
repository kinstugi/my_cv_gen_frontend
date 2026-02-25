import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="home">
      {/* Hero */}
      <section className="home-hero">
        <div className="home-hero-grid">
          <div className="home-hero-text">
            <p className="eyebrow">AI‑powered CV builder</p>
            <h1 className="hero-title">
              Create a job‑ready CV in{' '}
              <span className="hero-gradient">minutes</span>
            </h1>
            <p className="hero-subtitle">
              Connect directly to your My CV Gen API, tailor resumes to real job descriptions,
              and export polished PDFs that recruiters actually want to read.
            </p>
            <div className="hero-actions">
              {user ? (
                <>
                  <Link to="/resumes" className="btn primary hero-primary">
                    Open my resumes
                  </Link>
                  <Link to="/profile" className="btn hero-secondary">
                    Edit profile
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/register" className="btn primary hero-primary">
                    Get started free
                  </Link>
                  <Link to="/login" className="btn hero-secondary">
                    I already have an account
                  </Link>
                </>
              )}
            </div>
          </div>
          <div className="home-hero-visual">
            <div className="hero-card">
              <div className="hero-card-header">
                <span className="hero-card-pill">Live preview</span>
                <span className="hero-card-status">Connected to My CV Gen API</span>
              </div>
              <div className="hero-card-body">
                <div className="hero-card-line hero-card-line-strong" />
                <div className="hero-card-line hero-card-line-medium" />
                <div className="hero-card-line hero-card-line-light" />
                <div className="hero-card-grid">
                  <div className="hero-card-chip">Work experience</div>
                  <div className="hero-card-chip">Projects</div>
                  <div className="hero-card-chip">Skills</div>
                  <div className="hero-card-chip">Languages</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature band */}
      <section className="home-features">
        <div className="home-features-inner">
          <div className="feature-intro">
            <p className="eyebrow">Why this CV builder</p>
            <h2 className="section-title">Everything you need to ship a great CV</h2>
          </div>
          <div className="feature-grid">
            <article className="feature-card">
              <div className="feature-icon-circle">
                <span className="feature-icon">⚡</span>
              </div>
              <h3>Fast, focused workflow</h3>
              <p>
                Jump straight into creating resumes, updating your profile, and exporting PDFs
                without touching any configuration.
              </p>
            </article>
            <article className="feature-card">
              <div className="feature-icon-circle">
                <span className="feature-icon">🎯</span>
              </div>
              <h3>Tailored to each role</h3>
              <p>
                Use the tailor feature to align your CV with specific job descriptions, highlighting
                the most relevant experience automatically.
              </p>
            </article>
            <article className="feature-card">
              <div className="feature-icon-circle">
                <span className="feature-icon">📄</span>
              </div>
              <h3>Beautiful PDF output</h3>
              <p>
                Download ATS‑friendly PDFs from your existing API templates in just a click
                and reuse them across applications.
              </p>
            </article>
          </div>
        </div>
      </section>
    </div>
  );
}
