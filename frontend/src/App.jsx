
import {
  ArrowRight,
  ShieldCheck,
  ClipboardList,
  Building2,
  CheckCircle2,
  Clock3,
  Users,
  Wrench,
  Wifi,
  Droplets,
  Lightbulb,
  GraduationCap,
  Menu,
  MessageSquareText,
  LayoutDashboard,
} from "lucide-react";

import "./App.css";

const features = [
  {
    icon: ClipboardList,
    title: "Complaint Management",
    description:
      "Report campus issues and track every complaint from submission to resolution.",
  },
  {
    icon: Building2,
    title: "Campus Facilities",
    description:
      "Request campus resources and keep track of facility-related requests.",
  },
  {
    icon: LayoutDashboard,
    title: "Smart Dashboard",
    description:
      "Get a clear overview of complaint status, activities, and campus updates.",
  },
];

const issueTypes = [
  { icon: Wifi, label: "Wi-Fi & Internet", color: "purple" },
  { icon: Wrench, label: "Maintenance", color: "orange" },
  { icon: Droplets, label: "Water Supply", color: "blue" },
  { icon: Lightbulb, label: "Electrical Issues", color: "yellow" },
];

function App() {
  return (
    <div className="app">
      <header className="navbar">
        <a href="#home" className="brand">
          <span className="brand-icon">
            <GraduationCap size={25} />
          </span>
          <span>
            <strong>SmartCampus</strong>
            <small>Campus made better</small>
          </span>
        </a>

        <nav className="nav-links">
          <a className="active" href="#home">Home</a>
          <a href="#features">Features</a>
          <a href="#how-it-works">How It Works</a>
          <a href="#issues">Issue Categories</a>
        </nav>

        <div className="nav-actions">
          <a className="login-link" href="#get-started">Log In</a>
          <a className="btn btn-primary nav-button" href="#get-started">
            Get Started <ArrowRight size={16} />
          </a>
        </div>

        <a
          className="mobile-menu"
          href="#features"
          aria-label="Navigate to features"
        >
          <Menu size={25} />
        </a>
      </header>

      <main>
        <section className="hero" id="home">
          <div className="hero-content">
            <div className="eyebrow">
              <span className="status-dot" />
              A smarter way to manage your campus
            </div>

            <h1>
              Your Campus.
              <br />
              Your Voice.
              <br />
              <span>Our Responsibility.</span>
            </h1>

            <p className="hero-description">
              Report problems, request campus facilities, and track
              resolutions — all in one place. Making campus life simpler,
              smarter, and more connected.
            </p>

            <div className="hero-actions" id="get-started">
              <a className="btn btn-primary btn-large" href="#how-it-works">
                Get Started <ArrowRight size={18} />
              </a>
              <a className="btn btn-secondary btn-large" href="#features">
                Explore Features
              </a>
            </div>

            <div className="trust-row">
              <div className="trust-icon">
                <ShieldCheck size={19} />
              </div>
              <p>
                Transparent tracking.
                <br />
                <strong>Better campus experiences.</strong>
              </p>
            </div>
          </div>

          <div className="hero-visual">
            <div className="visual-glow" />

            <div className="dashboard-preview">
              <div className="preview-header">
                <div>
                  <span className="preview-label">CAMPUS OVERVIEW</span>
                  <h3>Good morning, Student!</h3>
                  <p>Here's what's happening on campus.</p>
                </div>
                <div className="preview-avatar">
                  <GraduationCap size={23} />
                </div>
              </div>

              <div className="stats-grid">
                <div className="stat-card">
                  <span className="stat-icon stat-purple">
                    <ClipboardList size={19} />
                  </span>
                  <span className="stat-label">My Complaints</span>
                  <strong>04</strong>
                  <span className="stat-note">Illustrative data</span>
                </div>

                <div className="stat-card">
                  <span className="stat-icon stat-green">
                    <CheckCircle2 size={19} />
                  </span>
                  <span className="stat-label">Resolved</span>
                  <strong>02</strong>
                  <span className="stat-note">Illustrative data</span>
                </div>
              </div>

              <div className="preview-section-title">
                <strong>Recent Activity</strong>
                <span>Sample preview</span>
              </div>

              <div className="activity-list">
                <div className="activity-icon activity-orange">
                  <Wrench size={18} />
                </div>
                <div className="activity-copy">
                  <strong>Classroom fan repair</strong>
                  <span>Room 204 · Maintenance</span>
                </div>
                <span className="badge-progress">In progress</span>
              </div>

              <div className="activity-list">
                <div className="activity-icon activity-blue">
                  <Wifi size={18} />
                </div>
                <div className="activity-copy">
                  <strong>Wi-Fi connectivity</strong>
                  <span>Library · Network</span>
                </div>
                <span className="badge-pending">Pending</span>
              </div>

              <div className="preview-footer">
                <Clock3 size={15} />
                <span>Stay informed at every step</span>
                <ShieldCheck size={17} className="footer-shield" />
              </div>
            </div>

            <div className="floating-card floating-top">
              <span className="floating-icon">
                <MessageSquareText size={19} />
              </span>
              <span>
                <strong>Easy reporting</strong>
                <small>Issues in a few clicks</small>
              </span>
            </div>

            <div className="floating-card floating-bottom">
              <span className="floating-check">
                <CheckCircle2 size={21} />
              </span>
              <span>
                <strong>Stay updated</strong>
                <small>Track complaint status</small>
              </span>
            </div>
          </div>
        </section>

        <section className="issue-section" id="issues">
          <div className="section-heading">
            <span className="section-kicker">ONE PLATFORM, MANY SOLUTIONS</span>
            <h2>Campus issues, simplified.</h2>
            <p>
              Get the right support for common campus problems without
              the confusion.
            </p>
          </div>

          <div className="issue-grid">
            {issueTypes.map((issue) => {
              const Icon = issue.icon;

              return (
                <div className="issue-card" key={issue.label}>
                  <span className={`issue-icon ${issue.color}`}>
                    <Icon size={23} />
                  </span>
                  <strong>{issue.label}</strong>
                  <ArrowRight size={17} className="issue-arrow" />
                </div>
              );
            })}
          </div>
        </section>

        <section className="features-section" id="features">
          <div className="section-heading">
            <span className="section-kicker">BUILT FOR CAMPUS LIFE</span>
            <h2>Everything in one place.</h2>
            <p>
              A simpler experience for students and a smarter workflow
              for campus administrators.
            </p>
          </div>

          <div className="features-grid">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <article className="feature-card" key={feature.title}>
                  <div className="feature-icon">
                    <Icon size={25} />
                  </div>
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                  <a href="#how-it-works" className="feature-link">
                    Learn more <ArrowRight size={16} />
                  </a>
                </article>
              );
            })}
          </div>
        </section>

        <section className="how-section" id="how-it-works">
          <div className="how-content">
            <span className="section-kicker">SIMPLE. CLEAR. EFFECTIVE.</span>
            <h2>Three steps to a better campus.</h2>
            <p>
              Spend less time following up on problems and more time
              focusing on what matters.
            </p>
          </div>

          <div className="steps-grid">
            <div className="step-card">
              <span className="step-number">01</span>
              <h3>Report an issue</h3>
              <p>Choose a category and describe the problem you encountered.</p>
            </div>
            <div className="step-card">
              <span className="step-number">02</span>
              <h3>Track progress</h3>
              <p>Follow your complaint as the administration reviews it.</p>
            </div>
            <div className="step-card">
              <span className="step-number">03</span>
              <h3>Get it resolved</h3>
              <p>Check the latest status and view the resolution update.</p>
            </div>
          </div>
        </section>

        <section className="cta-section">
          <div className="cta-icon">
            <Users size={27} />
          </div>
          <div className="cta-copy">
            <h2>Let's make campus life better.</h2>
            <p>One platform for reporting, tracking, and resolving issues.</p>
          </div>
          <a className="btn btn-white" href="#home">
            Explore SmartCampus <ArrowRight size={17} />
          </a>
        </section>
      </main>

      <footer className="footer">
        <a href="#home" className="footer-brand">
          <GraduationCap size={21} />
          SmartCampus
        </a>
        <p>Designed to make campus management simpler.</p>
        <span>FSD Academic Project · Submitted by Ankit Kumar (1272251153)</span>
      </footer>
    </div>
  );
}

export default App;
