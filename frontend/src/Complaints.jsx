
import { useEffect, useState } from "react";
import axios from "axios";
import {
  LayoutDashboard,
  FilePlus2,
  ClipboardList,
  BookOpen,
  MessageSquare,
  UserRound,
  GraduationCap,
  Menu,
  X,
  Bell,
  ChevronDown,
  Send,
  Clock3,
  CheckCircle2,
  Lightbulb,
  Target,
  MapPin,
  FileText,
  Wifi,
  Zap,
  Droplets,
  Sparkles,
  UploadCloud,
  Search,
  ChartNoAxesColumnIncreasing,
  RefreshCw,
  Paperclip,
  Trash2,
  Info,
} from "lucide-react";
import "./Complaints.css";

const API_URL = "http://localhost:5000/api/complaints";

const initialForm = {
  title: "",
  description: "",
  category: "Internet",
  location: "",
};

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Submit Complaint", href: "/complaints", icon: FilePlus2 },
  { label: "My Complaints", href: "/my-complaints", icon: ClipboardList },
  { label: "Feedback", href: "/feedback", icon: MessageSquare },
  { label: "Profile", href: "/profile", icon: UserRound },
];

const categories = [
  { name: "Electricity", icon: Zap },
  { name: "Water", icon: Droplets },
  { name: "Cleanliness", icon: Sparkles },
  { name: "Internet", icon: Wifi },
  { name: "Classroom", icon: BookOpen },
  { name: "Faculty", icon: MessageSquare },
];

function StatusBadge({ status = "Pending" }) {
  const normalized = String(status).toLowerCase().replace(/\s+/g, "-");

  return (
    <span className={`cp-status cp-status-${normalized}`}>
      {status}
    </span>
  );
}

function readStoredUser() {
  try {
    return JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    return null;
  }
}

export default function Complaints() {
  const [form, setForm] = useState(initialForm);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [priority, setPriority] = useState("Medium");
  const [attachment, setAttachment] = useState(null);
  const [currentUser, setCurrentUser] = useState(readStoredUser);

  // Read the current authentication token for protected API requests.
  function getAuthHeaders() {
    const token = localStorage.getItem("token");

    return token
      ? { Authorization: `Bearer ${token}` }
      : {};
  }

  function handleAuthError(status) {
    if (status === 401 || status === 403) {
      setError("Your session has expired. Please log in again.");
      return true;
    }

    return false;
  }

  // Load complaints belonging to the logged-in user.
  async function loadComplaints() {
    setLoading(true);
    setError("");

    const token = localStorage.getItem("token");

    if (!token) {
      setComplaints([]);
      setLoading(false);
      setError("Please log in to view and submit complaints.");
      return;
    }

    try {
      const response = await axios.get(API_URL, {
        headers: getAuthHeaders(),
      });

      setComplaints(
        Array.isArray(response.data.complaints)
          ? response.data.complaints
          : []
      );

      setCurrentUser(readStoredUser());
    } catch (err) {
      if (!handleAuthError(err.response?.status)) {
        setError(
          err.response?.data?.message ||
            "Could not load complaints. Check that your backend is running."
        );
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadComplaints();
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function handleAttachment(event) {
    const file = event.target.files?.[0];

    if (!file) return;

    const allowed = [
      "image/png",
      "image/jpeg",
      "application/pdf",
    ];

    if (!allowed.includes(file.type)) {
      setError("Please choose a PNG, JPG, or PDF file.");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("The attachment must be 5 MB or smaller.");
      event.target.value = "";
      return;
    }

    setError("");
    setAttachment(file);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");
    setError("");

    const token = localStorage.getItem("token");

    if (!token) {
      setError("Please log in before submitting a complaint.");
      return;
    }

    if (
      !form.title.trim() ||
      !form.description.trim() ||
      !form.location.trim()
    ) {
      setError("Please complete all required fields.");
      return;
    }

    setSubmitting(true);

    try {
      const response = await axios.post(
        API_URL,
        {
          title: form.title.trim(),
          description: form.description.trim(),
          category: form.category,
          location: form.location.trim(),
        },
        {
          headers: getAuthHeaders(),
        }
      );

      setMessage(
        response.data.message ||
          "Your complaint was submitted successfully."
      );

      setForm(initialForm);
      setPriority("Medium");
      setAttachment(null);

      event.target.reset();

      // Refresh the list after successful submission.
      await loadComplaints();
    } catch (err) {
      if (!handleAuthError(err.response?.status)) {
        setError(
          err.response?.data?.message ||
            "Unable to submit your complaint. Please try again."
        );
      }
    } finally {
      setSubmitting(false);
    }
  }

  function toggleSidebar() {
    if (window.matchMedia("(max-width: 760px)").matches) {
      setMobileOpen((open) => !open);
    } else {
      setSidebarCollapsed((collapsed) => !collapsed);
    }
  }

  function closeMobileSidebar() {
    setMobileOpen(false);
  }

  function resetForm() {
    setForm(initialForm);
    setPriority("Medium");
    setAttachment(null);
    setMessage("");
    setError("");

    const fileInput = document.getElementById("attachment");
    if (fileInput) fileInput.value = "";
  }

  const displayName = currentUser?.name || "User";

  const displayRole = currentUser?.role
    ? currentUser.role.charAt(0).toUpperCase() +
      currentUser.role.slice(1)
    : "SmartCampus user";

  return (
    <div className={`cp-app ${sidebarCollapsed ? "cp-collapsed" : ""}`}>
      {mobileOpen && (
        <button
          className="cp-overlay"
          type="button"
          aria-label="Close sidebar"
          onClick={closeMobileSidebar}
        />
      )}

      <aside
        className={`cp-sidebar ${
          mobileOpen ? "cp-sidebar-open" : ""
        }`}
      >
        <div className="cp-brand-row">
          <a href="/dashboard" className="cp-brand">
            <span className="cp-brand-icon">
              <GraduationCap size={27} />
            </span>

            <span className="cp-brand-copy">
              <strong>SmartCampus</strong>
              <small>Campus Complaint System</small>
            </span>
          </a>

          <button
            className="cp-mobile-close"
            type="button"
            aria-label="Close sidebar"
            onClick={closeMobileSidebar}
          >
            <X size={19} />
          </button>
        </div>

        <nav className="cp-navigation" aria-label="Main navigation">
          {navItems.map(({ label, href, icon: Icon }) => (
            <a
              key={label}
              href={href}
              title={sidebarCollapsed ? label : undefined}
              className={`cp-nav-link ${
                label === "Submit Complaint" ? "active" : ""
              }`}
              onClick={closeMobileSidebar}
            >
              <Icon size={21} />
              <span className="cp-nav-label">{label}</span>
            </a>
          ))}
        </nav>

        
      </aside>

      <main className="cp-main">
        <header className="cp-topbar">
          <button
            className="cp-menu-button"
            type="button"
            aria-label="Toggle sidebar"
            aria-expanded={!sidebarCollapsed}
            onClick={toggleSidebar}
          >
            <Menu size={23} />
          </button>

          <div className="cp-breadcrumb">
            <span>{displayRole} Portal</span>
            <span className="cp-slash">/</span>
            <strong>Submit Complaint</strong>
          </div>

          <div className="cp-topbar-right">
            <button
              className="cp-bell"
              type="button"
              aria-label="Notifications"
            >
              <Bell size={21} />
              <i />
            </button>

            <button
              className="cp-user-menu"
              type="button"
              aria-label="Logged-in user"
              onClick={() => {
                window.location.href = "/profile";
              }}
            >
              <span className="cp-avatar">
                {displayName.charAt(0).toUpperCase()}
              </span>

              <span className="cp-user-copy">
                <strong>{displayName}</strong>
                <small>{displayRole}</small>
              </span>

              <ChevronDown size={17} />
            </button>
          </div>
        </header>

        <div className="cp-content">
          <section className="cp-hero">
            <img
              className="cp-hero-image"
              src="/campus-hero.png"
              alt=""
              aria-hidden="true"
            />

            <div className="cp-hero-copy">
              <span className="cp-eyebrow">CAMPUS SUPPORT</span>
              <h1>Report a Campus Issue</h1>
              <p>
                Help us make our campus safer, cleaner and better.
              </p>
            </div>
          </section>

          {message && (
            <div className="cp-notice cp-success" role="status">
              <CheckCircle2 size={19} />
              <span>{message}</span>
            </div>
          )}

          {error && (
            <div className="cp-notice cp-error" role="alert">
              <Info size={19} />
              <span>{error}</span>
              <button
                type="button"
                onClick={() => setError("")}
                aria-label="Dismiss error"
              >
                <X size={16} />
              </button>
            </div>
          )}

          <section className="cp-layout">
            <div className="cp-form-card">
              <div className="cp-side-heading">
                <span className="cp-side-heading-icon">
                  <FileText size={23} />
                </span>

                <div>
                  <h2>Complaint Information</h2>
                  <p>Tell us what happened and where.</p>
                </div>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="cp-field">
                  <label htmlFor="title">
                    Complaint Title <b>*</b>
                  </label>

                  <input
                    id="title"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="e.g. Wi-Fi not working in library"
                    maxLength={120}
                    required
                  />
                </div>

                <div className="cp-field">
                  <label htmlFor="category">
                    Category <b>*</b>
                  </label>

                  <select
                    id="category"
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    required
                  >
                    {categories.map((category) => (
                      <option
                        key={category.name}
                        value={category.name}
                      >
                        {category.name}
                      </option>
                    ))}
                  </select>

                  <div className="cp-category-chips">
                    {categories
                      .filter((category) => category.name !== "Faculty")
                      .map(({ name, icon: Icon }) => (
                        <button
                          key={name}
                          type="button"
                          className={
                            form.category === name ? "selected" : ""
                          }
                          onClick={() =>
                            setForm((current) => ({
                              ...current,
                              category: name,
                            }))
                          }
                        >
                          <Icon size={13} />
                          {name}
                        </button>
                      ))}
                  </div>
                </div>

                <div className="cp-field">
                  <label htmlFor="location">
                    Campus Location <b>*</b>
                  </label>

                  <div className="cp-input-icon">
                    <MapPin size={18} />

                    <input
                      id="location"
                      name="location"
                      value={form.location}
                      onChange={handleChange}
                      placeholder="Building, floor, room or area"
                      maxLength={150}
                      required
                    />
                  </div>
                </div>

                <fieldset className="cp-priority-field">
                  <legend>
                    Priority <b>*</b>
                  </legend>

                  <div className="cp-priority-options">
                    {[
                      {
                        label: "Low",
                        subtitle: "Minor issue",
                        color: "low",
                      },
                      {
                        label: "Medium",
                        subtitle: "Needs attention",
                        color: "medium",
                      },
                      {
                        label: "High",
                        subtitle: "Urgent issue",
                        color: "high",
                      },
                    ].map((item) => (
                      <button
                        key={item.label}
                        type="button"
                        className={`cp-priority-option ${item.color} ${
                          priority === item.label ? "chosen" : ""
                        }`}
                        onClick={() => setPriority(item.label)}
                        aria-pressed={priority === item.label}
                      >
                        <span className="cp-radio-dot" />

                        <span className="cp-priority-copy">
                          <strong>{item.label}</strong>
                          <small>{item.subtitle}</small>
                        </span>
                      </button>
                    ))}
                  </div>

                  <small className="cp-ui-only-note">
                    Priority is a visual selection until backend support
                    is added.
                  </small>
                </fieldset>

                <div className="cp-field">
                  <div className="cp-label-row">
                    <label htmlFor="description">
                      Description <b>*</b>
                    </label>
                    <small>{form.description.length}/2000</small>
                  </div>

                  <textarea
                    id="description"
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Describe the issue and what you observed..."
                    maxLength={2000}
                    rows={4}
                    required
                  />
                </div>

                <div className="cp-field cp-attachment-field">
                  <label htmlFor="attachment">
                    Attach Photo / File <span>(Optional)</span>
                  </label>

                  <label className="cp-upload-box" htmlFor="attachment">
                    <UploadCloud size={27} />
                    <strong>
                      Drag files here or <u>browse</u>
                    </strong>
                    <small>PNG, JPG or PDF · Max 5 MB</small>

                    <input
                      id="attachment"
                      type="file"
                      accept=".png,.jpg,.jpeg,.pdf"
                      onChange={handleAttachment}
                    />
                  </label>

                  {attachment && (
                    <div className="cp-file-preview">
                      <Paperclip size={16} />
                      <span>{attachment.name}</span>

                      <small>
                        {(attachment.size / 1024 / 1024).toFixed(2)} MB
                      </small>

                      <button
                        type="button"
                        aria-label="Remove attachment"
                        onClick={() => {
                          setAttachment(null);
                          const input = document.getElementById("attachment");
                          if (input) input.value = "";
                        }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  )}

                  <small className="cp-ui-only-note">
                    File is selected locally only; it is not uploaded
                    to the server yet.
                  </small>
                </div>

                <div className="cp-form-actions">
                  <button
                    type="button"
                    className="cp-cancel-button"
                    onClick={resetForm}
                  >
                    Cancel
                  </button>

                  <button
                    className="cp-submit-button"
                    type="submit"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <RefreshCw className="cp-spin" size={17} />
                    ) : (
                      <Send size={17} />
                    )}

                    {submitting
                      ? "Submitting..."
                      : "Submit Complaint"}
                  </button>
                </div>
              </form>
            </div>

            <div className="cp-side-column">
              <section className="cp-tips-card">
                <div className="cp-side-heading">
                  <span className="cp-side-heading-icon">
                    <Lightbulb size={24} />
                  </span>

                  <div>
                    <h2>Before you submit</h2>
                    <p>
                      A few quick tips to help us resolve your issue faster.
                    </p>
                  </div>
                </div>

                <div className="cp-tip cp-tip-blue">
                  <span className="cp-tip-art">
                    <Target size={25} />
                  </span>

                  <div>
                    <strong>Choose the correct category</strong>
                    <p>
                      Select the category that best matches your issue.
                    </p>
                  </div>
                </div>

                <div className="cp-tip cp-tip-orange">
                  <span className="cp-tip-art">
                    <MapPin size={25} />
                  </span>

                  <div>
                    <strong>Add exact location</strong>
                    <p>
                      Mention building, floor, room or nearby landmark.
                    </p>
                  </div>
                </div>

                <div className="cp-tip cp-tip-green">
                  <span className="cp-tip-art">
                    <FileText size={24} />
                  </span>

                  <div>
                    <strong>Explain clearly</strong>
                    <p>
                      Provide a detailed description to help us understand
                      the issue.
                    </p>
                  </div>
                </div>
              </section>

              <section className="cp-journey-card">
                <div className="cp-side-heading">
                  <span className="cp-side-heading-icon">
                    <ChartNoAxesColumnIncreasing size={24} />
                  </span>

                  <div>
                    <h2>Your report journey</h2>
                    <p>
                      Here's what happens after you submit a complaint.
                    </p>
                  </div>
                </div>

                <div className="cp-journey">
                  <div className="cp-journey-step active">
                    <span className="cp-journey-symbol">
                      <Send size={21} />
                    </span>

                    <div>
                      <strong>1. Submitted</strong>
                      <p>Your complaint is received successfully.</p>
                    </div>
                  </div>

                  <div className="cp-journey-step">
                    <span className="cp-journey-symbol">
                      <Search size={22} />
                    </span>

                    <div>
                      <strong>2. Under Review</strong>
                      <p>
                        Our team will review and take necessary action.
                      </p>
                    </div>
                  </div>

                  <div className="cp-journey-step">
                    <span className="cp-journey-symbol">
                      <CheckCircle2 size={22} />
                    </span>

                    <div>
                      <strong>3. Resolved</strong>
                      <p>
                        You will be notified once the issue is resolved.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="cp-track-note">
                  <Info size={21} />
                  <span>
                    You can track updates in{" "}
                    <a href="/my-complaints">My Complaints</a>.
                  </span>
                </div>
              </section>

              <section className="cp-recent-card">
                <div className="cp-side-heading">
                  <span className="cp-side-heading-icon cp-recent-icon">
                    <ClipboardList size={22} />
                  </span>

                  <div>
                    <h2>Recent Complaints</h2>
                    <p>Latest reports from the system</p>
                  </div>

                  <button
                    type="button"
                    className="cp-refresh-button"
                    onClick={loadComplaints}
                    disabled={loading}
                    aria-label="Refresh complaints"
                    title="Refresh complaints"
                  >
                    <RefreshCw
                      size={17}
                      className={loading ? "cp-spin" : ""}
                    />
                  </button>
                </div>

                {loading ? (
                  <div className="cp-empty">
                    <RefreshCw className="cp-spin" size={21} />
                    <p>Loading complaints...</p>
                  </div>
                ) : complaints.length === 0 ? (
                  <div className="cp-empty">
                    <ClipboardList size={29} />
                    <p>No complaints yet</p>
                  </div>
                ) : (
                  <div className="cp-recent-list">
                    {complaints.slice(0, 3).map((complaint) => (
                      <article
                        key={complaint._id}
                        className="cp-recent-item"
                      >
                        <div className="cp-recent-item-top">
                          <strong>{complaint.title}</strong>
                          <StatusBadge status={complaint.status} />
                        </div>

                        <span className="cp-recent-category">
                          {complaint.category}
                        </span>

                        <p>{complaint.description}</p>

                        <small>
                          <MapPin size={12} />
                          {complaint.location}
                        </small>
                      </article>
                    ))}

                    <a className="cp-view-all" href="/my-complaints">
                      View all complaints →
                    </a>
                  </div>
                )}
              </section>
            </div>
          </section>

          <footer className="cp-footer">
            <span>
              © {new Date().getFullYear()} SmartCampus. All rights reserved.
            </span>
            <span> | All rights reserved by SmartCampus</span>
          </footer>
        </div>
      </main>
    </div>
  );
}
