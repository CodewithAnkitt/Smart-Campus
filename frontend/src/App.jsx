
import {
  GraduationCap,
  ArrowRight,
  FilePenLine,
  ClipboardList,
  MessageCircle,
  ShieldCheck,
  Users,
  CheckCircle2,
  Clock3,
  LogIn,
  Search,
  Zap,
  Quote,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./App.css";

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const goTo = (path) => {
    setMenuOpen(false);
    navigate(path);
  };

  const features = [
    {
      icon: FilePenLine,
      title: "Submit a Complaint",
      description: "Report issues related to campus facilities and services.",
      color: "violet",
    },
    {
      icon: ClipboardList,
      title: "Track Progress",
      description: "Check the status and progress of your complaints.",
      color: "green",
    },
    {
      icon: MessageCircle,
      title: "Give Feedback",
      description: "Share suggestions to help improve your campus.",
      color: "orange",
    },
    {
      icon: ShieldCheck,
      title: "Safer Campus",
      description: "Help build a cleaner and more student-friendly campus.",
      color: "red",
    },
  ];

  const steps = [
    {
      icon: LogIn,
      title: "Login",
      description: "Sign in with your student account.",
    },
    {
      icon: FilePenLine,
      title: "Submit",
      description: "Describe your issue and submit.",
    },
    {
      icon: Search,
      title: "Track",
      description: "Monitor the progress of your complaint.",
    },
    {
      icon: CheckCircle2,
      title: "Resolved",
      description: "Check when your issue is resolved.",
    },
  ];

  return (
    <div className="sc-home">
      {/* Header */}
      <header className="sc-header" id="home">
        <a href="#home" className="sc-logo">
          <GraduationCap className="sc-logo-icon" size={38} />
          <span>
            <strong>SmartCampus</strong>
            <small>Complaint Management System</small>
          </span>
        </a>

        <button
          className="sc-mobile-menu"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <nav className={`sc-nav ${menuOpen ? "sc-nav-open" : ""}`}>
          <a href="#home" onClick={() => setMenuOpen(false)}>Home</a>
          <a href="#about" onClick={() => setMenuOpen(false)}>About</a>
          <a href="#how-it-works" onClick={() => setMenuOpen(false)}>
            How It Works
          </a>
          <a href="#contact" onClick={() => setMenuOpen(false)}>Contact</a>

          <div className="sc-mobile-actions">
            <button
              className="sc-btn sc-btn-outline"
              onClick={() => goTo("/login")}
            >
              Login
            </button>
            <button
              className="sc-btn sc-btn-primary"
              onClick={() => goTo("/login")}
            >
              Get Started
            </button>
          </div>
        </nav>

        <div className="sc-header-actions">
          <button
            className="sc-btn sc-btn-outline"
            onClick={() => goTo("/login")}
          >
            Login
          </button>
          <button
            className="sc-btn sc-btn-primary"
            onClick={() => goTo("/login")}
          >
            Get Started
          </button>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="sc-hero">
          <div className="sc-hero-copy">
            <span className="sc-eyebrow">
              A SMARTER CAMPUS FOR A BETTER TOMORROW
            </span>

            <h1>
              Your Campus,
              <br />
              <span>Your Voice</span>
            </h1>

            <p>
              Report issues, share feedback, and help us build a safer,
              cleaner, and smarter campus for everyone.
            </p>

            <div className="sc-hero-actions">
              <button
                className="sc-btn sc-btn-primary sc-btn-large"
                onClick={() => goTo("/login")}
              >
                <FilePenLine size={18} />
                Submit a Complaint
                <ArrowRight size={17} />
              </button>

              <button
                className="sc-btn sc-btn-outline sc-btn-large"
                onClick={() => goTo("/login")}
              >
                <ClipboardList size={18} />
                View Complaints
              </button>
            </div>

            <div className="sc-benefits">
              <span><CheckCircle2 size={18} /> Easy to Use</span>
              <span><CheckCircle2 size={18} /> Faster Resolution</span>
              <span><CheckCircle2 size={18} /> Better Campus Services</span>
            </div>
          </div>

          <div className="sc-hero-art">
            <img
              src="/images/hero-campus.png"
              alt="Students looking toward their university campus"
              className="sc-hero-image"
            />
            
          </div>
        </section>

        {/* Main features */}
        <section className="sc-features">
          {features.map(({ icon: Icon, title, description, color }) => (
            <button
              className="sc-feature-card"
              key={title}
              onClick={() => goTo("/login")}
            >
              <span className={`sc-feature-icon ${color}`}>
                <Icon size={29} />
              </span>
              <span className="sc-feature-copy">
                <strong>{title}</strong>
                <small>{description}</small>
              </span>
              <ArrowRight className="sc-feature-arrow" size={19} />
            </button>
          ))}
        </section>

        {/* Campus statistics */}
        <section className="sc-impact" aria-label="Campus impact statistics">
          <div className="sc-impact-item">
            <span className="sc-impact-icon"><Users size={29} /></span>
            <div><strong>5,000+</strong><small>Students</small></div>
          </div>
          <div className="sc-impact-item">
            <span className="sc-impact-icon"><ClipboardList size={29} /></span>
            <div><strong>1,200+</strong><small>Complaints Resolved</small></div>
          </div>
          <div className="sc-impact-item">
            <span className="sc-impact-icon"><ShieldCheck size={29} /></span>
            <div><strong>90%</strong><small>Student Satisfaction</small></div>
          </div>
          <div className="sc-impact-item">
            <span className="sc-impact-icon"><Clock3 size={29} /></span>
            <div><strong>2–3 Days</strong><small>Average Resolution Time</small></div>
          </div>
        </section>

        {/* How it works */}
        <section className="sc-process" id="how-it-works">
          <div className="sc-process-content">
            <div className="sc-section-heading">
              <h2>How It Works</h2>
              <p>Report an issue in just a few simple steps.</p>
            </div>

            <div className="sc-steps">
              {steps.map(({ icon: Icon, title, description }, index) => (
                <div className="sc-step" key={title}>
                  <div className="sc-step-top">
                    <span className="sc-step-number">{index + 1}</span>
                    <span className="sc-step-icon"><Icon size={25} /></span>
                  </div>
                  <strong>{title}</strong>
                  <p>{description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="sc-process-illustration">
            <img
              src="/images/complaint-tracking.png"
              alt="Illustration showing complaint status tracking"
              onError={(event) => {
                event.currentTarget.style.display = "none";
              }}
            />
            <div className="sc-status status-submitted">
              <CheckCircle2 size={19} /> Complaint Submitted
            </div>
            <div className="sc-status status-progress">
              <Clock3 size={19} /> In Progress
            </div>
            <div className="sc-status status-resolved">
              <CheckCircle2 size={19} /> Resolved
            </div>
          </div>
        </section>

        {/* About and mission */}
        <section className="sc-about" id="about">
          <div className="sc-about-picture">
            <img
              src="/images/campus-building.png"
              alt="University campus building surrounded by greenery"
              onError={(event) => {
                event.currentTarget.style.display = "none";
              }}
            />
            <div className="sc-about-fallback">
              <GraduationCap size={68} />
              <span>SmartCampus</span>
            </div>
          </div>

          <div className="sc-mission">
            <span className="sc-eyebrow">OUR PURPOSE</span>
            <h2>Our Mission</h2>
            <p>
              To create a transparent, efficient, and student-centric platform
              that connects students with campus administration, helping
              create a better and more responsive learning environment.
            </p>
            <div className="sc-values">
              <span><ShieldCheck size={19} /> Transparency</span>
              <span><Zap size={19} /> Efficiency</span>
              <span><Users size={19} /> Student Centric</span>
            </div>
          </div>

          <blockquote className="sc-quote">
            <Quote size={30} />
            <p>
              A better campus is built through open communication,
              collaborative solutions, and an engaged community.
            </p>
            <span />
          </blockquote>
        </section>

        {/* Call to action */}
        <section className="sc-cta">
          <div className="sc-cta-icon">
            <GraduationCap size={54} />
          </div>
          <div className="sc-cta-copy">
            <h2>Make Your Campus Better</h2>
            <p>
              Your voice matters. Help us make a difference, one report at a time.
            </p>
          </div>
          <button
            className="sc-btn sc-btn-primary sc-btn-large"
            onClick={() => goTo("/login")}
          >
            Get Started <ArrowRight size={18} />
          </button>
        </section>
      </main>

      {/* Footer */}
      <footer className="sc-footer" id="contact">
        <a href="#home" className="sc-footer-brand">
          <GraduationCap size={34} />
          <span>
            <strong>SmartCampus</strong>
            <small>Complaint Management System</small>
          </span>
        </a>

        <div className="sc-footer-links">
          <a href="#home">Home</a>
          <a href="#about">About</a>
          <a href="#how-it-works">How It Works</a>
          <a href="mailto:smartcampus@example.com">Contact</a>
        </div>

        <div className="sc-copyright">
          <span>© 2026 SmartCampus. All rights reserved.</span>
        </div>
      </footer>
    </div>
  );
}
