import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="landing-footer">
      <div className="site-container">
        <div className="landing-footer-grid">
          <div className="landing-footer-brand">
            <Link to="/" className="landing-footer-title">
              MEDDxAgent
            </Link>
            <p className="landing-footer-copy">
              A research-oriented workspace for structured patient context and inspectable differential-diagnosis workflows.
            </p>
          </div>

          <div>
            <p className="landing-footer-heading">Product</p>
            <div className="landing-footer-links">
              <a href="#product" className="landing-footer-link">Overview</a>
              <a href="#how-it-works" className="landing-footer-link">Workflow</a>
              <Link to="/app" className="landing-footer-link">Workspace</Link>
            </div>
          </div>

          <div>
            <p className="landing-footer-heading">Research</p>
            <div className="landing-footer-links">
              <a href="#research" className="landing-footer-link">Research approach</a>
              <a
                href="https://github.com/medicalappmedapp-design/meddxagent"
                target="_blank"
                rel="noopener noreferrer"
                className="landing-footer-link"
              >
                GitHub ↗
              </a>
            </div>
          </div>
        </div>

        <div className="landing-footer-bottom">
          <p>Clinical decision support — review all outputs before making clinical decisions.</p>
          <p>© 2026 MEDDxAgent</p>
        </div>
      </div>
    </footer>
  );
}
