import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  Activity,
  AlertCircle,
  ArrowRight,
  Bell,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  Clock3,
  FileText,
  Flag,
  LoaderCircle,
  MapPin,
  RefreshCw,
  Search,
  Send,
  Settings,
  ShieldCheck,
} from "lucide-react";
import "./ComplaintTracking.css";

const API_URL = "http://localhost:5000/api/complaints";

const STATUS_STEPS = ["Submitted", "In Progress", "Resolved"];

function normalizeStatus(status) {
  const value = String(status || "Submitted").toLowerCase();

  if (
    value.includes("resolved") ||
    value.includes("closed") ||
    value.includes("completed")
  ) {
    return "Resolved";
  }

  if (
    value.includes("progress") ||
    value.includes("processing") ||
    value.includes("review")
  ) {
    return "In Progress";
  }

  return "Submitted";
}

function getDate(complaint) {
  return (
    complaint.createdAt ||
    complaint.created_at ||
    complaint.date ||
    complaint.submittedAt ||
    null
  );
}

function formatDate(dateValue) {
  if (!dateValue) return "Date unavailable";

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) return "Date unavailable";

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatDateTime(dateValue) {
  if (!dateValue) return "Not available";

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) return "Not available";

  return date.toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getComplaintId(complaint) {
  return complaint._id || complaint.id || "";
}

function getShortId(complaint) {
  const id = String(getComplaintId(complaint));
  return id ? id.slice(-8).toUpperCase() : "N/A";
}

function getStatusClass(status) {
  return normalizeStatus(status).toLowerCase().replace(/\s+/g, "-");
}

function getPriority(complaint) {
  return complaint.priority || "Normal";
}

export default function ComplaintTracking() {
  const [complaints, setComplaints] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadComplaints() {
    setLoading(true);
    setError("");

    try {
      const response = await axios.get(API_URL);
      const data = response.data;

      const items = Array.isArray(data)
        ? data
        : Array.isArray(data.complaints)
          ? data.complaints
          : [];

      setComplaints(items);

      setSelectedId((currentId) => {
        const currentExists = items.some(
          (item) => String(getComplaintId(item)) === currentId
        );

        if (currentExists) return currentId;

        return items.length ? String(getComplaintId(items[0])) : "";
      });
    } catch (err) {
      setError(
        "Unable to load complaints. Check that your backend and MongoDB are running."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadComplaints();
  }, []);

  const counts = useMemo(() => {
    return {
      total: complaints.length,
      submitted: complaints.filter(
        (item) => normalizeStatus(item.status) === "Submitted"
      ).length,
      progress: complaints.filter(
        (item) => normalizeStatus(item.status) === "In Progress"
      ).length,
      resolved: complaints.filter(
        (item) => normalizeStatus(item.status) === "Resolved"
      ).length,
    };
  }, [complaints]);

  const filteredComplaints = useMemo(() => {
    const query = search.trim().toLowerCase();

    return complaints.filter((complaint) => {
      const text = [
        complaint.title,
        complaint.description,
        complaint.category,
        complaint.location,
        getComplaintId(complaint),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch = text.includes(query);
      const status = normalizeStatus(complaint.status);
      const matchesStatus =
        statusFilter === "All Status" || status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [complaints, search, statusFilter]);

  const selectedComplaint =
    filteredComplaints.find(
      (item) => String(getComplaintId(item)) === selectedId
    ) || filteredComplaints[0] || null;

  const selectedStatus = selectedComplaint
    ? normalizeStatus(selectedComplaint.status)
    : "Submitted";

  const activeStep = STATUS_STEPS.indexOf(selectedStatus);

  function selectComplaint(complaint) {
    setSelectedId(String(getComplaintId(complaint)));
  }

  return (
    <div className="ct-page">
      {/* Sidebar */}
      <aside className="ct-sidebar">
        <a href="/" className="ct-brand">
          <span className="ct-brand-logo">
            <ShieldCheck size={28} strokeWidth={2.2} />
          </span>
          <span className="ct-brand-copy">
            <strong>SmartCampus</strong>
            <small>Complaint Management System</small>
          </span>
        </a>

        <div className="ct-nav-label">WORKSPACE</div>

        <nav className="ct-nav">
          <a href="/dashboard" className="ct-nav-link">
            <Activity size={20} />
            <span>Dashboard</span>
          </a>

          <a href="/complaints" className="ct-nav-link">
            <Send size={20} />
            <span>Submit Complaint</span>
          </a>

          <a href="/my-complaints" className="ct-nav-link">
            <FileText size={20} />
            <span>My Complaints</span>
          </a>

          <a
            href="/complaint-tracking"
            className="ct-nav-link active"
            aria-current="page"
          >
            <Activity size={20} />
            <span>Complaint Tracking</span>
          </a>

          <a href="/feedback" className="ct-nav-link">
            <CheckCircle2 size={20} />
            <span>Feedback &amp; Reopen</span>
          </a>
        </nav>

        <div className="ct-sidebar-bottom">
          <div className="ct-campus-illustration">
            <div className="ct-campus-sun" />
            <div className="ct-campus-building">
              <div className="ct-campus-roof" />
              <div className="ct-campus-windows">
                <i />
                <i />
                <i />
                <i />
                <i />
                <i />
              </div>
              <div className="ct-campus-door" />
            </div>
          </div>

          <p>Submitted by Ankit Kumar</p>
          <p>All rights reserved by SmartCampus</p>
        </div>
      </aside>

      {/* Main workspace */}
      <main className="ct-main">
        <header className="ct-topbar">
          <label className="ct-global-search">
            <Search size={19} />
            <input
              type="search"
              placeholder="Search complaints, categories, or locations..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </label>

          <div className="ct-topbar-right">
            <button
              type="button"
              className="ct-icon-button"
              aria-label="Notifications"
              title="Notifications"
            >
              <Bell size={21} />
            </button>

            <div className="ct-profile">
              <div className="ct-avatar">AK</div>
              <div className="ct-profile-copy">
                <strong>Ankit Kumar</strong>
                <span>Student</span>
              </div>
              <ChevronDown size={17} />
            </div>
          </div>
        </header>

        <div className="ct-content">
          {/* Hero banner */}
          <section className="ct-hero">
            <div className="ct-hero-copy">
              <span className="ct-eyebrow">COMPLAINT MANAGEMENT</span>
              <h1>Complaint Tracking</h1>
              <p>
                Follow the progress of your submitted complaints in one place.
              </p>
            </div>

            <div className="ct-hero-art" aria-hidden="true">
              <div className="ct-hero-orbit orbit-one" />
              <div className="ct-hero-orbit orbit-two" />
              <div className="ct-hero-clipboard">
                <div className="ct-clipboard-clip" />
                <i />
                <i />
                <i />
                <i />
              </div>
              <div className="ct-hero-search-icon">
                <Search size={48} />
              </div>
            </div>
          </section>

          {/* Summary cards */}
          <section className="ct-stats">
            <article className="ct-stat-card">
              <div className="ct-stat-icon purple">
                <FileText size={24} />
              </div>
              <div className="ct-stat-copy">
                <span>Total Complaints</span>
                <strong>{counts.total}</strong>
                <small>All available complaints</small>
              </div>
            </article>

            <article className="ct-stat-card">
              <div className="ct-stat-icon orange">
                <Clock3 size={24} />
              </div>
              <div className="ct-stat-copy">
                <span>Submitted</span>
                <strong>{counts.submitted}</strong>
                <small>Awaiting further action</small>
              </div>
            </article>

            <article className="ct-stat-card">
              <div className="ct-stat-icon blue">
                <Settings size={24} />
              </div>
              <div className="ct-stat-copy">
                <span>In Progress</span>
                <strong>{counts.progress}</strong>
                <small>Being worked on</small>
              </div>
            </article>

            <article className="ct-stat-card">
              <div className="ct-stat-icon green">
                <CheckCircle2 size={24} />
              </div>
              <div className="ct-stat-copy">
                <span>Resolved</span>
                <strong>{counts.resolved}</strong>
                <small>Marked as completed</small>
              </div>
            </article>
          </section>

          {error && (
            <div className="ct-error">
              <AlertCircle size={20} />
              <span>{error}</span>
              <button type="button" onClick={loadComplaints}>
                Try again
              </button>
            </div>
          )}

          {/* Complaint list and selected complaint details */}
          <section className="ct-workspace">
            <div className="ct-list-panel">
              <div className="ct-panel-heading">
                <div>
                  <h2>All Complaints</h2>
                  <p>Select a complaint to view its status and details.</p>
                </div>

                <button
                  type="button"
                  className="ct-refresh-button"
                  onClick={loadComplaints}
                  disabled={loading}
                  title="Refresh complaints"
                >
                  <RefreshCw
                    size={16}
                    className={loading ? "ct-spin" : ""}
                  />
                  <span>Refresh</span>
                </button>
              </div>

              <label className="ct-list-search">
                <Search size={17} />
                <input
                  type="search"
                  placeholder="Search complaints..."
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                />
              </label>

              <div className="ct-filter-row">
                <label className="ct-status-select">
                  <Settings size={16} />
                  <select
                    value={statusFilter}
                    onChange={(event) => setStatusFilter(event.target.value)}
                    aria-label="Filter by complaint status"
                  >
                    <option>All Status</option>
                    <option>Submitted</option>
                    <option>In Progress</option>
                    <option>Resolved</option>
                  </select>
                  <ChevronDown size={15} />
                </label>

                <span className="ct-record-count">
                  {filteredComplaints.length} records
                </span>
              </div>

              <div className="ct-complaint-list">
                {loading ? (
                  <div className="ct-empty-state">
                    <LoaderCircle size={28} className="ct-spin" />
                    <p>Loading complaints...</p>
                  </div>
                ) : filteredComplaints.length === 0 ? (
                  <div className="ct-empty-state">
                    <FileText size={31} />
                    <strong>No complaints found</strong>
                    <p>Try changing your search or status filter.</p>
                  </div>
                ) : (
                  filteredComplaints.map((complaint) => {
                    const status = normalizeStatus(complaint.status);
                    const id = String(getComplaintId(complaint));
                    const isSelected =
                      String(getComplaintId(selectedComplaint || {})) === id;

                    return (
                      <button
                        type="button"
                        key={id || complaint.title}
                        className={`ct-complaint-row ${
                          isSelected ? "selected" : ""
                        }`}
                        onClick={() => selectComplaint(complaint)}
                      >
                        <span className="ct-row-file-icon">
                          <FileText size={19} />
                        </span>

                        <span className="ct-row-content">
                          <strong>
                            {complaint.title || "Untitled complaint"}
                          </strong>
                          <span className="ct-row-meta">
                            {complaint.category || "General"} <b>·</b>{" "}
                            {complaint.location || "Location not specified"}{" "}
                            <b>·</b> {formatDate(getDate(complaint))}
                          </span>
                          <span className={`ct-status ${getStatusClass(status)}`}>
                            <i />
                            {status}
                          </span>
                        </span>

                        <ArrowRight size={18} className="ct-row-arrow" />
                      </button>
                    );
                  })
                )}
              </div>
            </div>

            {/* Details panel */}
            <div className="ct-detail-panel">
              {!selectedComplaint ? (
                <div className="ct-detail-empty">
                  <div className="ct-detail-empty-icon">
                    <FileText size={30} />
                  </div>
                  <h3>Select a complaint</h3>
                  <p>
                    Choose a complaint from the list to see its details and
                    progress timeline.
                  </p>
                </div>
              ) : (
                <>
                  <div className="ct-detail-heading">
                    <div>
                      <span className="ct-eyebrow">COMPLAINT DETAILS</span>
                      <h2>
                        {selectedComplaint.title || "Untitled complaint"}
                      </h2>
                      <p>
                        Complaint ID:{" "}
                        <strong>#{getShortId(selectedComplaint)}</strong>
                      </p>
                      <p>
                        Submitted on {formatDateTime(getDate(selectedComplaint))}
                      </p>
                    </div>

                    <span
                      className={`ct-status ct-detail-status ${getStatusClass(
                        selectedStatus
                      )}`}
                    >
                      <i />
                      {selectedStatus}
                    </span>
                  </div>

                  <div className="ct-detail-info-grid">
                    <div className="ct-info-cell">
                      <FileText size={21} />
                      <div>
                        <span>Category</span>
                        <strong>{selectedComplaint.category || "General"}</strong>
                      </div>
                    </div>

                    <div className="ct-info-cell">
                      <MapPin size={22} />
                      <div>
                        <span>Location</span>
                        <strong>
                          {selectedComplaint.location || "Not specified"}
                        </strong>
                      </div>
                    </div>

                    <div className="ct-info-cell">
                      <Flag size={21} />
                      <div>
                        <span>Priority</span>
                        <strong>{getPriority(selectedComplaint)}</strong>
                      </div>
                    </div>

                    <div className="ct-info-cell">
                      <CalendarDays size={21} />
                      <div>
                        <span>Last updated</span>
                        <strong>
                          {formatDateTime(
                            selectedComplaint.updatedAt ||
                              selectedComplaint.updated_at ||
                              getDate(selectedComplaint)
                          )}
                        </strong>
                      </div>
                    </div>
                  </div>

                  <div className="ct-description">
                    <h3>
                      <FileText size={19} />
                      Description
                    </h3>
                    <p>
                      {selectedComplaint.description ||
                        "No description was provided for this complaint."}
                    </p>
                  </div>

                  <div className="ct-timeline-section">
                    <div className="ct-timeline-heading">
                      <div>
                        <h3>Progress Timeline</h3>
                        <p>Current status recorded for this complaint.</p>
                      </div>
                      <Activity size={21} />
                    </div>

                    <div className="ct-timeline">
                      {STATUS_STEPS.map((step, index) => {
                        const complete = index <= activeStep;
                        const current = index === activeStep;

                        return (
                          <div
                            key={step}
                            className={`ct-timeline-step ${
                              complete ? "complete" : ""
                            } ${current ? "current" : ""}`}
                          >
                            <div className="ct-timeline-marker">
                              {index === 0 ? (
                                <Send size={16} />
                              ) : index === 1 ? (
                                <Settings size={17} />
                              ) : (
                                <CheckCircle2 size={18} />
                              )}
                            </div>

                            <strong>{step}</strong>

                            <span className="ct-timeline-date">
                              {index === 0
                                ? formatDate(getDate(selectedComplaint))
                                : current
                                  ? formatDate(
                                      selectedComplaint.updatedAt ||
                                        selectedComplaint.updated_at ||
                                        getDate(selectedComplaint)
                                    )
                                  : index < activeStep
                                    ? "Completed"
                                    : "Pending"}
                            </span>

                            <p>
                              {index === 0
                                ? "Complaint recorded in the system."
                                : index === 1
                                  ? current
                                    ? "The complaint is currently in progress."
                                    : index < activeStep
                                      ? "This stage has been completed."
                                      : "Waiting for the issue to be reviewed."
                                  : current
                                    ? "The complaint has been marked as resolved."
                                    : "This issue has not yet been marked as resolved."}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="ct-detail-note">
                    <ShieldCheck size={19} />
                    <p>
                      <strong>Keep your complaint ID handy.</strong>
                      Use it when following up about this issue with campus
                      support.
                    </p>
                  </div>
                </>
              )}
            </div>
          </section>

          <footer className="ct-footer">
            
            <span>All rights reserved by SmartCampus</span>
          </footer>
        </div>
      </main>
    </div>
  );
}