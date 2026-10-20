import { Activity } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  GraduationCap, Menu, X, Search, Bell, LayoutDashboard,
  FilePlus2, ClipboardList, BookOpen, Megaphone, MessageSquare,
  UserRound, Headphones, RefreshCw, Eye, Clock3, CheckCircle2,
  Settings2, CalendarDays, MapPin, AlertCircle, SlidersHorizontal,
  Droplets, Wifi, Fan, Trash2, Monitor, ChevronLeft, ChevronRight,
  Sparkles, Building2
} from "lucide-react";
import "./MyComplaints.css";

const API_URL = "http://localhost:5000/api/complaints";

const navigation = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { label: "Submit Complaint", icon: FilePlus2, href: "/complaints" },
  { label: "My Complaints", icon: ClipboardList, href: "/my-complaints" },
  { label: "Complaint Tracking", path: "/complaint-tracking", icon: Activity },
  { label: "Feedback", icon: MessageSquare, href: "/feedback" },
  { label: "Profile / Sign in", icon: UserRound, href: "/login" },
];

const categories = [
  "All Categories", "Electricity", "Water", "Cleanliness",
  "Internet", "Classroom", "Other"
];

const statuses = ["All Statuses", "Pending", "In Progress", "Resolved"];

function formatDate(value) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getCategoryIcon(category) {
  switch (category) {
    case "Water": return Droplets;
    case "Internet": return Wifi;
    case "Electricity": return Fan;
    case "Cleanliness": return Trash2;
    case "Classroom": return Monitor;
    default: return ClipboardList;
  }
}

function StatusBadge({ status = "Pending" }) {
  const Icon =
    status === "Resolved" ? CheckCircle2 :
    status === "In Progress" ? Settings2 : Clock3;

  const className = status.toLowerCase().replace(/\s+/g, "-");

  return (
    <span className={`mc-status mc-status-${className}`}>
      <Icon size={13} />
      {status}
    </span>
  );
}

function CampusIllustration() {
  return (
    <div className="mc-illustration" aria-hidden="true">
      <div className="mc-sun" />
      <div className="mc-cloud mc-cloud-a" />
      <div className="mc-cloud mc-cloud-b" />
      <div className="mc-hill mc-hill-back" />
      <div className="mc-hill mc-hill-front" />
      <div className="mc-campus-building">
        <div className="mc-building-roof" />
        <div className="mc-building-top">
          <span>SMARTCAMPUS</span>
        </div>
        <div className="mc-building-columns">
          {Array.from({ length: 5 }, (_, i) => (
            <div className="mc-column" key={i}>
              <span />
              <span />
            </div>
          ))}
        </div>
        <div className="mc-building-entrance" />
      </div>
      <div className="mc-tree mc-tree-left"><i /></div>
      <div className="mc-tree mc-tree-right"><i /></div>
      <div className="mc-student-shape mc-student-one" />
      <div className="mc-student-shape mc-student-two" />
    </div>
  );
}

export default function MyComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [page, setPage] = useState(1);

  const pageSize = 5;

  async function fetchComplaints() {
    setLoading(true);
    setError("");

    try {
      const response = await axios.get(API_URL);
      setComplaints(response.data.complaints || []);
    } catch {
      setError(
        "Could not load complaints. Check that your backend and MongoDB are running."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchComplaints();
  }, []);

  const counts = useMemo(() => ({
    total: complaints.length,
    pending: complaints.filter((c) => c.status === "Pending").length,
    progress: complaints.filter((c) => c.status === "In Progress").length,
    resolved: complaints.filter((c) => c.status === "Resolved").length,
  }), [complaints]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();

    return complaints.filter((item) => {
      const matchesSearch = !term || [
        item.title,
        item.description,
        item.location,
        item.category,
        item._id,
      ].some((value) => String(value || "").toLowerCase().includes(term));

      const matchesStatus =
        statusFilter === "All Statuses" || item.status === statusFilter;

      const matchesCategory =
        categoryFilter === "All Categories" || item.category === categoryFilter;

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [complaints, search, statusFilter, categoryFilter]);

  useEffect(() => {
    setPage(1);
  }, [search, statusFilter, categoryFilter]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const visibleComplaints = filtered.slice((page - 1) * pageSize, page * pageSize);

  function resetFilters() {
    setSearch("");
    setStatusFilter("All Statuses");
    setCategoryFilter("All Categories");
    setPage(1);
  }

  function toggleSidebar() {
    if (window.matchMedia("(max-width: 760px)").matches) {
      setSidebarOpen((open) => !open);
    } else {
      setSidebarCollapsed((collapsed) => !collapsed);
    }
  }

  return (
    <div className={`mc-app ${sidebarCollapsed ? "mc-collapsed" : ""}`}>
      {sidebarOpen && (
        <button
          className="mc-overlay"
          aria-label="Close navigation"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside className={`mc-sidebar ${sidebarOpen ? "mc-sidebar-open" : ""}`}>
        <a href="/dashboard" className="mc-brand">
          <span className="mc-brand-icon"><GraduationCap size={28} /></span>
          <span className="mc-brand-copy">
            <strong>SmartCampus</strong>
            <small>Campus Complaint System</small>
          </span>
          <button
            type="button"
            className="mc-close-menu"
            aria-label="Close navigation"
            onClick={(event) => {
              event.preventDefault();
              setSidebarOpen(false);
            }}
          >
            <X size={20} />
          </button>
        </a>

        <nav className="mc-nav" aria-label="Main navigation">
          {navigation.map(({ label, icon: Icon, href }) => (
            <a
              key={label}
              href={href}
              title={label}
              className={`mc-nav-link ${label === "My Complaints" ? "active" : ""}`}
              onClick={() => setSidebarOpen(false)}
            >
              <Icon size={19} />
              <span>{label}</span>
            </a>
          ))}
        </nav>

        <div className="mc-help-card">
          <span className="mc-help-icon"><Headphones size={25} /></span>
          <h3>Need Help?</h3>
          <p>Have a question? Contact campus support.</p>
          <a href="/feedback">Contact Support <span>→</span></a>
        </div>
      </aside>

      <main className="mc-main">
        <header className="mc-topbar">
          <button
            className="mc-menu-button"
            type="button"
            aria-label="Toggle navigation"
            onClick={toggleSidebar}
          >
            <Menu size={23} />
          </button>

          <label className="mc-global-search">
            <Search size={18} />
            <input
              placeholder="Search complaints, categories..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              aria-label="Search complaints"
            />
          </label>

          <div className="mc-topbar-right">
            <button
              type="button"
              className="mc-bell"
              title="Refresh complaints"
              aria-label="Refresh complaints"
              onClick={fetchComplaints}
            >
              <Bell size={20} />
              <i />
            </button>
            <div className="mc-top-profile">
              <span className="mc-avatar">S</span>
              <span className="mc-profile-copy">
                <strong>Student Portal</strong>
                <small>SmartCampus user</small>
              </span>
            </div>
          </div>
        </header>

        <div className="mc-content">
          <section className="mc-hero">
            <div className="mc-hero-copy">
              <span className="mc-eyebrow">MY COMPLAINTS</span>
              <h1>Track Your Complaints</h1>
              <p>
                Stay updated on the issues you've reported and help us build
                a better campus together.
              </p>
            </div>
            <CampusIllustration />
            <div className="mc-hero-quote">
              <span>“</span>
              <strong>A cleaner, safer and better campus starts with you.</strong>
            </div>
          </section>

          {error && (
            <div className="mc-error" role="alert">
              <AlertCircle size={18} />
              <span>{error}</span>
              <button type="button" onClick={fetchComplaints}>Try again</button>
            </div>
          )}

          <section className="mc-summary-grid">
            <article className="mc-summary-card mc-total">
              <span className="mc-summary-icon"><ClipboardList size={23} /></span>
              <div><p>Total Complaints</p><strong>{loading ? "—" : counts.total}</strong><small>All your reported issues</small></div>
              <span className="mc-card-decoration" />
            </article>
            <article className="mc-summary-card mc-pending">
              <span className="mc-summary-icon"><Clock3 size={23} /></span>
              <div><p>Pending</p><strong>{loading ? "—" : counts.pending}</strong><small>Awaiting attention</small></div>
              <span className="mc-card-decoration" />
            </article>
            <article className="mc-summary-card mc-progress">
              <span className="mc-summary-icon"><Settings2 size={23} /></span>
              <div><p>In Progress</p><strong>{loading ? "—" : counts.progress}</strong><small>Currently being handled</small></div>
              <span className="mc-card-decoration" />
            </article>
            <article className="mc-summary-card mc-resolved">
              <span className="mc-summary-icon"><CheckCircle2 size={23} /></span>
              <div><p>Resolved</p><strong>{loading ? "—" : counts.resolved}</strong><small>Successfully completed</small></div>
              <span className="mc-card-decoration" />
            </article>
          </section>

          <section className="mc-workspace">
            <div className="mc-list-panel">
              <div className="mc-panel-heading">
                <div className="mc-panel-heading-icon"><ClipboardList size={21} /></div>
                <div className="mc-heading-text">
                  <h2>Your Complaints</h2>
                  <p>View, search and track the status of your submitted complaints.</p>
                </div>
                <a className="mc-primary-button" href="/complaints">
                  <FilePlus2 size={16} /> Submit New Complaint
                </a>
              </div>

              <div className="mc-filters">
                <label className="mc-search">
                  <Search size={18} />
                  <input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search by title, location or ID..."
                    aria-label="Search by title, location or ID"
                  />
                  {search && (
                    <button type="button" onClick={() => setSearch("")} aria-label="Clear search">
                      <X size={15} />
                    </button>
                  )}
                </label>

                <select
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value)}
                  aria-label="Filter by status"
                >
                  {statuses.map((status) => <option key={status}>{status}</option>)}
                </select>

                <select
                  value={categoryFilter}
                  onChange={(event) => setCategoryFilter(event.target.value)}
                  aria-label="Filter by category"
                >
                  {categories.map((category) => <option key={category}>{category}</option>)}
                </select>

                <button className="mc-reset-button" type="button" onClick={resetFilters}>
                  <RefreshCw size={15} /> Reset
                </button>
              </div>

              <div className="mc-results-label">
                Showing <strong>{loading ? "—" : visibleComplaints.length}</strong> of{" "}
                <strong>{loading ? "—" : filtered.length}</strong> complaints
              </div>

              {loading ? (
                <div className="mc-empty-state">
                  <RefreshCw className="mc-spin" size={25} />
                  <p>Loading complaints…</p>
                </div>
              ) : visibleComplaints.length === 0 ? (
                <div className="mc-empty-state">
                  <ClipboardList size={38} />
                  <h3>{complaints.length ? "No matching complaints" : "No complaints yet"}</h3>
                  <p>
                    {complaints.length
                      ? "Try changing your search or filters."
                      : "Your submitted complaints will appear here."}
                  </p>
                  {complaints.length ? (
                    <button className="mc-reset-button" onClick={resetFilters} type="button">
                      Clear filters
                    </button>
                  ) : (
                    <a href="/complaints" className="mc-primary-button">
                      <FilePlus2 size={16} /> Submit a Complaint
                    </a>
                  )}
                </div>
              ) : (
                <div className="mc-table-wrap">
                  <table className="mc-table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Complaint Details</th>
                        <th>Category</th>
                        <th>Location</th>
                        <th>Submitted On</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {visibleComplaints.map((item, index) => {
                        const CategoryIcon = getCategoryIcon(item.category);
                        return (
                          <tr key={item._id}>
                            <td>{(page - 1) * pageSize + index + 1}</td>
                            <td>
                              <div className="mc-complaint-cell">
                                <span className="mc-complaint-icon"><CategoryIcon size={18} /></span>
                                <span>
                                  <strong>{item.title}</strong>
                                  <small>{String(item.description || "No description").slice(0, 35)}{String(item.description || "").length > 35 ? "…" : ""}</small>
                                </span>
                              </div>
                            </td>
                            <td><span className="mc-category">{item.category}</span></td>
                            <td className="mc-location"><MapPin size={13} /> {item.location}</td>
                            <td className="mc-date">{formatDate(item.createdAt)}</td>
                            <td><StatusBadge status={item.status} /></td>
                            <td>
                              <button
                                type="button"
                                className="mc-view-button"
                                onClick={() => setSelectedComplaint(item)}
                              >
                                <Eye size={15} /> View
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              <div className="mc-pagination">
                <span>
                  Showing {filtered.length ? (page - 1) * pageSize + 1 : 0} to{" "}
                  {Math.min(page * pageSize, filtered.length)} of {filtered.length} complaints
                </span>
                <div>
                  <button
                    type="button"
                    aria-label="Previous page"
                    disabled={page <= 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                  >
                    <ChevronLeft size={17} />
                  </button>
                  {Array.from({ length: pageCount }, (_, i) => i + 1)
                    .slice(Math.max(0, page - 2), Math.max(3, page + 1))
                    .map((number) => (
                      <button
                        key={number}
                        type="button"
                        className={page === number ? "active" : ""}
                        onClick={() => setPage(number)}
                      >
                        {number}
                      </button>
                    ))}
                  <button
                    type="button"
                    aria-label="Next page"
                    disabled={page >= pageCount}
                    onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
                  >
                    <ChevronRight size={17} />
                  </button>
                </div>
              </div>
            </div>

            <aside className="mc-detail-panel">
              <div className="mc-detail-heading">
                <h2>Complaint Details</h2>
                {selectedComplaint && (
                  <button type="button" aria-label="Close details" onClick={() => setSelectedComplaint(null)}>
                    <X size={19} />
                  </button>
                )}
              </div>

              {!selectedComplaint ? (
                <div className="mc-detail-placeholder">
                  <span><Eye size={25} /></span>
                  <h3>Select a complaint</h3>
                  <p>Choose “View” on a complaint to see its full details and progress.</p>
                </div>
              ) : (
                <ComplaintDetails
                  complaint={selectedComplaint}
                  onClose={() => setSelectedComplaint(null)}
                />
              )}
            </aside>
          </section>

          <div className="mc-bottom-note">
            <Sparkles size={20} />
            <span>Together, we can build a cleaner, safer and more vibrant campus.</span>
            <span className="mc-note-status"><Building2 size={15} /> Campus support, made simple</span>
          </div>

          <footer className="mc-footer">
            <span>© {new Date().getFullYear()} SmartCampus. All Rights Reserved.</span>
            <span>Submitted by <strong>Ankit Kumar</strong> &nbsp; | &nbsp; All rights reserved by SmartCampus</span>
          </footer>
        </div>
      </main>

      {selectedComplaint && (
        <div
          className="mc-modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setSelectedComplaint(null);
          }}
        >
          <section className="mc-modal" role="dialog" aria-modal="true" aria-labelledby="mc-modal-title">
            <div className="mc-modal-heading">
              <div>
                <span className="mc-eyebrow">COMPLAINT DETAILS</span>
                <h2 id="mc-modal-title">{selectedComplaint.title}</h2>
              </div>
              <button type="button" onClick={() => setSelectedComplaint(null)} aria-label="Close details">
                <X size={20} />
              </button>
            </div>
            <ComplaintDetails complaint={selectedComplaint} onClose={() => setSelectedComplaint(null)} />
          </section>
        </div>
      )}
    </div>
  );
}

function ComplaintDetails({ complaint, onClose }) {
  const steps = ["Pending", "In Progress", "Resolved"];
  const currentStep = steps.indexOf(complaint.status);

  return (
    <div className="mc-detail-content">
      <div className="mc-detail-title-row">
        <span className="mc-detail-category-icon">
          {(() => {
            const Icon = getCategoryIcon(complaint.category);
            return <Icon size={22} />;
          })()}
        </span>
        <div className="mc-detail-title">
          <strong>{complaint.title}</strong>
          <small>ID: {complaint._id}</small>
        </div>
        <StatusBadge status={complaint.status} />
      </div>

      <div className="mc-detail-tabs">
        <span className="selected">Overview</span>
        <span>Progress</span>
      </div>

      <div className="mc-detail-grid">
        <div><span>Category</span><strong>{complaint.category}</strong></div>
        <div><span>Location</span><strong>{complaint.location}</strong></div>
        <div><span>Date Submitted</span><strong>{formatDate(complaint.createdAt)}</strong></div>
        <div><span>Last Updated</span><strong>{formatDate(complaint.updatedAt)}</strong></div>
      </div>

      <div className="mc-description">
        <h3>Description</h3>
        <p>{complaint.description || "No description provided."}</p>
      </div>

      <div className="mc-progress-section">
        <h3>Complaint Progress</h3>
        <div className="mc-progress-steps">
          {steps.map((step, index) => (
            <div className={`mc-progress-step ${index <= currentStep ? "completed" : ""}`} key={step}>
              <span>{index < currentStep ? <CheckCircle2 size={15} /> : index + 1}</span>
              <small>{step}</small>
            </div>
          ))}
        </div>
      </div>

      <div className="mc-detail-notice">
        <AlertCircle size={17} />
        Your complaint status is updated by campus administration.
      </div>

      <button type="button" className="mc-close-details" onClick={onClose}>
        Close Details
      </button>
    </div>
  );
}
