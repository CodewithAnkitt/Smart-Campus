
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Bell, ChevronDown, ChevronLeft, ChevronRight, ClipboardList,
  FileText, House, Lightbulb, Menu, MessageSquare, Search,
  Send, ShieldCheck, Star, UserRound, X, Heart, AlertTriangle,
  PencilLine, History, RotateCcw, Wifi, CheckCircle2
} from "lucide-react";
import "./Feedback.css";

const initialFeedback = [
  {
    id: 1,
    type: "Issue Report",
    title: "Library Wi-Fi issue",
    message: "The Wi-Fi network in the central library is very slow.",
    related: "Wi-Fi not working in Library",
    date: "14 Oct 2026",
    time: "02:15 PM",
  },
  {
    id: 2,
    type: "Appreciation",
    title: "Great Support",
    message: "The IT support team resolved my issue quickly. Thank you!",
    related: "IT support request",
    date: "10 Oct 2026",
    time: "11:30 AM",
  },
  {
    id: 3,
    type: "Suggestion",
    title: "Add more study spaces",
    message: "It would be helpful to have more quiet study spaces in campus buildings.",
    related: "",
    date: "05 Oct 2026",
    time: "04:20 PM",
  },
  {
    id: 4,
    type: "General Feedback",
    title: "Cleanliness in Cafeteria",
    message: "The cafeteria tables are not cleaned regularly. Please improve the cleaning schedule.",
    related: "",
    date: "02 Oct 2026",
    time: "10:10 AM",
  },
  {
    id: 5,
    type: "General Feedback",
    title: "Better Lighting",
    message: "Some areas in the main building have insufficient lighting.",
    related: "",
    date: "28 Sep 2026",
    time: "09:45 AM",
  },
];

const feedbackTypes = [
  { name: "General Feedback", icon: Star, color: "purple" },
  { name: "Suggestion", icon: Lightbulb, color: "orange" },
  { name: "Appreciation", icon: Heart, color: "green" },
  { name: "Issue Report", icon: AlertTriangle, color: "red" },
];

const typeClass = (type = "") => {
  if (type === "Suggestion") return "suggestion";
  if (type === "Appreciation") return "appreciation";
  if (type === "Issue Report") return "issue";
  return "general";
};

const typeIcon = (type = "") => {
  if (type === "Suggestion") return Lightbulb;
  if (type === "Appreciation") return Heart;
  if (type === "Issue Report") return AlertTriangle;
  return MessageSquare;
};

export default function Feedback() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [feedbackType, setFeedbackType] = useState("General Feedback");
  const [relatedComplaint, setRelatedComplaint] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [historySearch, setHistorySearch] = useState("");
  const [page, setPage] = useState(1);
  const [history, setHistory] = useState(initialFeedback);
  const [notice, setNotice] = useState("");
  const [noticeType, setNoticeType] = useState("success");
  const [selectedFeedback, setSelectedFeedback] = useState(null);

  const pageSize = 5;

  const filteredHistory = useMemo(() => {
    const term = historySearch.toLowerCase().trim();
    return history.filter((item) =>
      [item.title, item.message, item.type, item.related]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(term)
    );
  }, [history, historySearch]);

  const totalPages = Math.max(1, Math.ceil(filteredHistory.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const visibleHistory = filteredHistory.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const stats = useMemo(() => ({
    total: history.length,
    positive: history.filter((item) =>
      ["Appreciation", "General Feedback"].includes(item.type)
    ).length,
    suggestions: history.filter((item) => item.type === "Suggestion").length,
    issues: history.filter((item) => item.type === "Issue Report").length,
  }), [history]);

  const clearForm = () => {
    setFeedbackType("General Feedback");
    setRelatedComplaint("");
    setSubject("");
    setMessage("");
    setNotice("");
  };

  const submitFeedback = (event) => {
    event.preventDefault();

    if (subject.trim().length < 3) {
      setNoticeType("error");
      setNotice("Please enter a subject with at least 3 characters.");
      return;
    }

    if (message.trim().length < 10) {
      setNoticeType("error");
      setNotice("Your feedback must contain at least 10 characters.");
      return;
    }

    const newEntry = {
      id: Date.now(),
      type: feedbackType,
      title: subject.trim(),
      message: message.trim(),
      related: relatedComplaint,
      date: new Date().toLocaleDateString("en-IN", {
        day: "2-digit", month: "short", year: "numeric"
      }),
      time: new Date().toLocaleTimeString("en-IN", {
        hour: "2-digit", minute: "2-digit"
      }),
    };

    setHistory((previous) => [newEntry, ...previous]);
    setHistorySearch("");
    setPage(1);
    setNoticeType("success");
    setNotice("Feedback added to this page's history. Connect a backend API to save it permanently.");
    setSubject("");
    setMessage("");
    setRelatedComplaint("");
    setFeedbackType("General Feedback");
  };

  const navItems = [
    { label: "Dashboard", path: "/dashboard", icon: House },
    { label: "Submit Complaint", path: "/complaints", icon: PencilLine },
    { label: "My Complaints", path: "/my-complaints", icon: ClipboardList },
    { label: "Feedback", path: "/feedback", icon: Star },
    { label: "Profile ", path: "/profile", icon: UserRound },
  ];

  return (
    <div className={`fb-app ${collapsed ? "fb-collapsed" : ""}`}>
      {mobileOpen && (
        <button
          className="fb-mobile-overlay"
          aria-label="Close navigation"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside className={`fb-sidebar ${mobileOpen ? "fb-mobile-open" : ""}`}>
        <div className="fb-brand">
          <div className="fb-brand-icon"><ShieldCheck size={31} /></div>
          <div className="fb-brand-copy">
            <strong>SmartCampus</strong>
            <span>Complaint Management System</span>
          </div>
          <button
            className="fb-icon-btn fb-close-sidebar"
            aria-label="Close sidebar"
            onClick={() => setMobileOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        <nav className="fb-nav">
          {navItems.map(({ label, path, icon: Icon }) => (
            <Link
              key={label}
              to={path}
              title={collapsed ? label : undefined}
              className={`fb-nav-link ${label === "Feedback" ? "active" : ""}`}
              onClick={() => setMobileOpen(false)}
            >
              <Icon size={22} />
              <span>{label}</span>
            </Link>
          ))}
        </nav>

        <div className="fb-campus-art" aria-hidden="true">
          <div className="fb-art-glow" />
          <House size={84} strokeWidth={1.1} />
          <div className="fb-art-building">
            <span /><span /><span /><span />
          </div>
        </div>

        <div className="fb-sidebar-footer">
          <span>Submitted by Ankit Kumar</span>
          <small>All rights reserved by SmartCampus</small>
        </div>
      </aside>

      <main className="fb-main">
        <header className="fb-topbar">
          <div className="fb-topbar-left">
            <button
              className="fb-icon-btn fb-collapse-btn"
              title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              onClick={() => setCollapsed((value) => !value)}
            >
              <Menu size={22} />
            </button>
            <button
              className="fb-icon-btn fb-mobile-menu"
              aria-label="Open navigation"
              onClick={() => setMobileOpen(true)}
            >
              <Menu size={22} />
            </button>
            <label className="fb-global-search">
              <Search size={20} />
              <input
                placeholder="Search complaints, categories, or locations..."
                value={historySearch}
                onChange={(event) => {
                  setHistorySearch(event.target.value);
                  setPage(1);
                }}
              />
            </label>
          </div>

          <div className="fb-user-area">
            <button className="fb-icon-btn fb-bell" aria-label="Notifications">
              <Bell size={21} /><i />
            </button>
            <div className="fb-avatar">AK</div>
            <div className="fb-user-copy">
              <strong>Ankit Kumar</strong>
              <span>Student</span>
            </div>
            <ChevronDown size={16} />
          </div>
        </header>

        <div className="fb-content">
          <section className="fb-hero">
            <div className="fb-hero-copy">
              <span className="fb-eyebrow">YOUR VOICE MATTERS</span>
              <h1>Feedback</h1>
              <p>Share your experience and help us improve our services.</p>
            </div>
            <div className="fb-hero-message">
              <strong>Your Feedback</strong>
              <span>Builds a Better Campus</span>
            </div>
            <div className="fb-hero-illustration" aria-hidden="true">
              <div className="fb-star-bubble"><Star size={14} fill="currentColor" /> <Star size={14} fill="currentColor" /> <Star size={14} fill="currentColor" /> <Star size={14} fill="currentColor" /></div>
              <MessageSquare size={60} strokeWidth={1.2} />
              <div className="fb-hero-person"><UserRound size={43} /></div>
            </div>
          </section>

          {notice && (
            <div className={`fb-notice ${noticeType}`} role="status">
              {noticeType === "success" ? <CheckCircle2 size={18} /> : <AlertTriangle size={18} />}
              <span>{notice}</span>
              <button aria-label="Dismiss notification" onClick={() => setNotice("")}><X size={16} /></button>
            </div>
          )}

          <section className="fb-stats">
            <div className="fb-stat-card">
              <div className="fb-stat-icon purple"><MessageSquare size={27} /></div>
              <div><span>Total Feedbacks</span><strong>{stats.total}</strong><small>All submissions</small></div>
            </div>
            <div className="fb-stat-card">
              <div className="fb-stat-icon orange"><Star size={27} /></div>
              <div><span>Positive Feedbacks</span><strong>{stats.positive}</strong><small>{stats.total ? Math.round(stats.positive / stats.total * 100) : 0}% of total</small></div>
            </div>
            <div className="fb-stat-card">
              <div className="fb-stat-icon blue"><MessageSquare size={27} /></div>
              <div><span>Suggestions</span><strong>{stats.suggestions}</strong><small>{stats.total ? Math.round(stats.suggestions / stats.total * 100) : 0}% of total</small></div>
            </div>
            <div className="fb-stat-card">
              <div className="fb-stat-icon red"><AlertTriangle size={27} /></div>
              <div><span>Issues Reported</span><strong>{stats.issues}</strong><small>{stats.total ? Math.round(stats.issues / stats.total * 100) : 0}% of total</small></div>
            </div>
          </section>

          <section className="fb-workspace">
            <div className="fb-form-panel">
              <div className="fb-panel-heading">
                <div className="fb-heading-icon"><PencilLine size={24} /></div>
                <div>
                  <h2>Give New Feedback</h2>
                  <p>We value your thoughts, suggestions, and concerns.</p>
                </div>
              </div>

              <form onSubmit={submitFeedback}>
                <label className="fb-field-label">Feedback Type <b>*</b></label>
                <div className="fb-type-grid">
                  {feedbackTypes.map(({ name, icon: Icon, color }) => (
                    <button
                      type="button"
                      key={name}
                      className={`fb-type-option ${feedbackType === name ? "selected" : ""} ${color}`}
                      onClick={() => setFeedbackType(name)}
                      aria-pressed={feedbackType === name}
                    >
                      <Icon size={24} />
                      <span>{name === "General Feedback" ? <>General<br />Feedback</> : name === "Issue Report" ? <>Issue<br />Report</> : name}</span>
                    </button>
                  ))}
                </div>

                <label className="fb-field-label" htmlFor="fb-related">Related Complaint <span>(Optional)</span></label>
                <div className="fb-input-wrap">
                  <FileText size={19} />
                  <select
                    id="fb-related"
                    value={relatedComplaint}
                    onChange={(event) => setRelatedComplaint(event.target.value)}
                  >
                    <option value="">Select a complaint (if applicable)</option>
                    <option value="Wi-Fi not working in Library">Wi-Fi not working in Library</option>
                    <option value="AC not working in Classroom">AC not working in Classroom</option>
                    <option value="Water leakage near Canteen">Water leakage near Canteen</option>
                    <option value="Other complaint">Other complaint</option>
                  </select>
                  <ChevronDown size={16} />
                </div>

                <label className="fb-field-label" htmlFor="fb-subject">Subject <b>*</b></label>
                <input
                  id="fb-subject"
                  className="fb-text-input"
                  value={subject}
                  onChange={(event) => setSubject(event.target.value)}
                  placeholder="Enter a brief subject"
                  maxLength={100}
                  required
                />

                <div className="fb-message-label-row">
                  <label className="fb-field-label" htmlFor="fb-message">Your Feedback <b>*</b></label>
                  <span>{message.length}/500</span>
                </div>
                <textarea
                  id="fb-message"
                  className="fb-textarea"
                  value={message}
                  onChange={(event) => setMessage(event.target.value.slice(0, 500))}
                  placeholder="Write your feedback here... (minimum 10 characters)"
                  minLength={10}
                  maxLength={500}
                  rows={5}
                  required
                />

                <div className="fb-form-actions">
                  <button className="fb-submit-btn" type="submit"><Send size={18} /> Submit Feedback</button>
                  <button className="fb-clear-btn" type="button" onClick={clearForm}><RotateCcw size={18} /> Clear Form</button>
                </div>
              </form>
            </div>

            <div className="fb-history-panel">
              <div className="fb-history-heading">
                <div className="fb-heading-icon"><History size={25} /></div>
                <div className="fb-history-title">
                  <h2>My Feedback History</h2>
                  <p>View all the feedback you have submitted.</p>
                </div>
                <label className="fb-history-search">
                  <Search size={18} />
                  <input
                    value={historySearch}
                    onChange={(event) => {
                      setHistorySearch(event.target.value);
                      setPage(1);
                    }}
                    placeholder="Search feedback..."
                  />
                </label>
              </div>

              <div className="fb-history-list">
                {visibleHistory.length === 0 ? (
                  <div className="fb-empty-history">
                    <MessageSquare size={32} />
                    <strong>No feedback found</strong>
                    <span>Try a different search term.</span>
                  </div>
                ) : visibleHistory.map((item) => {
                  const Icon = typeIcon(item.type);
                  return (
                    <button className="fb-history-row" key={item.id} onClick={() => setSelectedFeedback(item)}>
                      <div className={`fb-history-icon ${typeClass(item.type)}`}><Icon size={25} /></div>
                      <div className="fb-history-copy">
                        <strong>{item.title}</strong>
                        <p>{item.message}</p>
                        {item.related && <small>Related to: {item.related}</small>}
                      </div>
                      <div className="fb-history-date"><span>{item.date}</span><small>{item.time}</small></div>
                      <span className={`fb-type-badge ${typeClass(item.type)}`}>{item.type}</span>
                      <ChevronRight className="fb-history-chevron" size={20} />
                    </button>
                  );
                })}
              </div>

              <div className="fb-pagination">
                <button aria-label="Previous page" disabled={currentPage <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}><ChevronLeft size={18} /></button>
                {Array.from({ length: totalPages }, (_, index) => index + 1).slice(0, 5).map((number) => (
                  <button key={number} className={currentPage === number ? "current" : ""} onClick={() => setPage(number)}>{number}</button>
                ))}
                <button aria-label="Next page" disabled={currentPage >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}><ChevronRight size={18} /></button>
              </div>
            </div>
          </section>

          <footer className="fb-page-footer">
            <span>© SmartCampus Complaint Management System</span>
            <span>Building a better campus together <Heart size={14} /></span>
          </footer>
        </div>
      </main>

      {selectedFeedback && (
        <div className="fb-modal-backdrop" onClick={() => setSelectedFeedback(null)}>
          <section className="fb-modal" role="dialog" aria-modal="true" aria-labelledby="fb-modal-title" onClick={(event) => event.stopPropagation()}>
            <button className="fb-modal-close" onClick={() => setSelectedFeedback(null)} aria-label="Close details"><X size={20} /></button>
            <span className={`fb-type-badge ${typeClass(selectedFeedback.type)}`}>{selectedFeedback.type}</span>
            <h2 id="fb-modal-title">{selectedFeedback.title}</h2>
            <p>{selectedFeedback.message}</p>
            {selectedFeedback.related && <p><strong>Related complaint:</strong> {selectedFeedback.related}</p>}
            <small>{selectedFeedback.date} · {selectedFeedback.time}</small>
            <button className="fb-submit-btn fb-modal-done" onClick={() => setSelectedFeedback(null)}>Close</button>
          </section>
        </div>
      )}
    </div>
  );
}
