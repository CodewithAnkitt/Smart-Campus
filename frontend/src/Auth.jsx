
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  GraduationCap,
  Mail,
  LockKeyhole,
  UserRound,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
} from "lucide-react";
import "./Auth.css";

export default function Auth() {
  const navigate = useNavigate();
  const location = useLocation();
  const isRegister = location.pathname === "/register";

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");

  function handleChange(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
    setError("");
  }

  function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (isRegister && form.name.trim().length < 2) {
      setError("Please enter your full name.");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(form.email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (form.password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    if (isRegister && form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setError(
      "The form is ready. Account creation and login will be enabled after we connect the backend."
    );
  }

  return (
    <main className="auth-page">
      <header className="auth-header">
        <Link to="/" className="auth-brand">
          <span className="auth-brand-icon">
            <GraduationCap size={25} />
          </span>
          <span>
            <strong>SmartCampus</strong>
            <small>Campus made better</small>
          </span>
        </Link>

        <Link to="/" className="back-home">
          <ArrowLeft size={16} /> Back to home
        </Link>
      </header>

      <section className="auth-layout">
        <div className="auth-intro">
          <span className="auth-tag">
            <ShieldCheck size={16} /> YOUR CAMPUS, CONNECTED
          </span>

          <h1>
            A better campus
            <br />
            starts <span>with you.</span>
          </h1>

          <p>
            Report campus issues, track resolutions, and request facilities
            through one simple platform.
          </p>

          <div className="auth-benefits">
            <div>
              <span className="benefit-check">✓</span>
              Report and track complaints
            </div>
            <div>
              <span className="benefit-check">✓</span>
              Stay updated on progress
            </div>
            <div>
              <span className="benefit-check">✓</span>
              Access campus facilities
            </div>
          </div>

          <div className="auth-quote">
            <span>“</span>
            <p>A more connected campus creates a better student experience.</p>
          </div>
        </div>

        <div className="auth-card">
          <div className="auth-card-icon">
            <UserRound size={24} />
          </div>

          <h2>{isRegister ? "Create your account" : "Welcome back!"}</h2>

          <p className="auth-subtitle">
            {isRegister
              ? "Join SmartCampus to get started."
              : "Log in to access your campus dashboard."}
          </p>

          <form onSubmit={handleSubmit} noValidate>
            {isRegister && (
              <div className="auth-field">
                <label htmlFor="name">Full name</label>
                <div className="auth-input-wrap">
                  <UserRound size={18} />
                  <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={form.name}
                    onChange={handleChange}
                    autoComplete="name"
                    required
                  />
                </div>
              </div>
            )}

            <div className="auth-field">
              <label htmlFor="email">Email address</label>
              <div className="auth-input-wrap">
                <Mail size={18} />
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            <div className="auth-field">
              <label htmlFor="password">Password</label>
              <div className="auth-input-wrap">
                <LockKeyhole size={18} />
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="At least 8 characters"
                  value={form.password}
                  onChange={handleChange}
                  autoComplete={isRegister ? "new-password" : "current-password"}
                  minLength={8}
                  required
                />
              </div>
            </div>

            {isRegister && (
              <div className="auth-field">
                <label htmlFor="confirmPassword">Confirm password</label>
                <div className="auth-input-wrap">
                  <LockKeyhole size={18} />
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="Enter password again"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    autoComplete="new-password"
                    required
                  />
                </div>
              </div>
            )}

            {error && (
              <p className="auth-message" role="alert">
                {error}
              </p>
            )}

            <button className="auth-submit" type="submit">
              {isRegister ? "Create Account" : "Log In"}
              <ArrowRight size={18} />
            </button>
          </form>

          <div className="auth-switch">
            {isRegister ? "Already have an account?" : "New to SmartCampus?"}{" "}
            <Link to={isRegister ? "/login" : "/register"}>
              {isRegister ? "Log in" : "Create an account"}
            </Link>
          </div>

          <div className="auth-security">
            <ShieldCheck size={16} />
            <span>Account security will be handled by our backend.</span>
          </div>
        </div>
      </section>

      <footer className="auth-footer">
        SmartCampus · FSD Academic Project
      </footer>
    </main>
  );
}
