
import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import {
  Activity,
  Bell,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ClipboardList,
  Clock3,
  FileText,
  Flag,
  House,
  LayoutDashboard,
  Lightbulb,
  LoaderCircle,
  LogOut,
  MapPin,
  Menu,
  MessageSquare,
  RefreshCw,
  Search,
  Settings,
  ShieldCheck,
  Star,
  Trash2,
  UserRound,
  Wifi,
  Zap,
  Droplets,
  Armchair,
  X,
} from "lucide-react";
import "./MyComplaints.css";

const API = "http://localhost:5000/api/complaints";

// Read the logged-in user's information.
function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    return null;
  }
}

// Attach the JWT to protected backend requests.
function getAuthHeaders() {
  const token = localStorage.getItem("token");

  return token
    ? { Authorization: `Bearer ${token}` }
    : {};
}

const normaliseStatus = (status) => {
  const value = String(status || "Pending").trim().toLowerCase();

  if (value.includes("progress")) return "In Progress";
  if (value.includes("resolv") || value.includes("complete")) {
    return "Resolved";
  }
  if (value.includes("clos")) return "Closed";
  if (value.includes("reject")) return "Rejected";
  if (value.includes("pending") || value.includes("submit")) {
    return "Pending";
  }

  return status || "Pending";
};

const getId = (complaint) => complaint?._id || complaint?.id;

const getDate = (date) => {
  if (!date) return "Date unavailable";

  const parsed = new Date(date);

  return Number.isNaN(parsed.getTime())
    ? "Date unavailable"
    : parsed.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
};

const getDateTime = (date) => {
  if (!date) return "Not available";

  const parsed = new Date(date);

  return Number.isNaN(parsed.getTime())
    ? "Not available"
    : parsed.toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
};

const categoryIcon = (category = "") => {
  const value = category.toLowerCase();

  if (
    value.includes("wifi") ||
    value.includes("network") ||
    value.includes("internet")
  ) {
    return Wifi;
  }

  if (value.includes("electric") || value.includes("power")) {
    return Zap;
  }

  if (value.includes("water") || value.includes("plumb")) {
    return Droplets;
  }

  if (
    value.includes("furniture") ||
    value.includes("infrastructure")
  ) {
    return Armchair;
  }

  return FileText;
};

const getInitials = (name = "User") => {
  return name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
};

const formatRole = (role) => {
  if (!role) return "Campus User";

  return role.charAt(0).toUpperCase() + role.slice(1);
};

export default function MyComplaints() {
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState(getStoredUser);

  const [complaints, setComplaints] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [activeTab, setActiveTab] = useState("Tracking");

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [feedback, setFeedback] = useState("");

  // Load only the complaints permitted by the authenticated backend.
  const loadComplaints = useCallback(
    async (showSpinner = true) => {
      if (showSpinner) setLoading(true);

      setError("");

      const token = localStorage.getItem("token");
      const storedUser = getStoredUser();

      setCurrentUser(storedUser);

      if (!token || !storedUser) {
        setComplaints([]);
        setSelectedId(null);
        setError("Please log in to view your complaints.");
        setLoading(false);
        setRefreshing(false);
        navigate("/login");
        return;
      }

      try {
        const response = await axios.get(API, {
          headers: getAuthHeaders(),
        });

        const data = response.data;

        const list = Array.isArray(data)
          ? data
          : Array.isArray(data?.complaints)
            ? data.complaints
            : Array.isArray(data?.data)
              ? data.data
              : [];

        setComplaints(list);

        setSelectedId((current) => {
          if (
            current &&
            list.some(
              (item) => String(getId(item)) === String(current)
            )
          ) {
            return current;
          }

          return list.length ? getId(list[0]) : null;
        });
      } catch (err) {
        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");

          setCurrentUser(null);
          setComplaints([]);
          setSelectedId(null);

          setError("Your session has expired. Please log in again.");
          navigate("/login");
          return;
        }

        setError(
          err.response?.data?.message ||
            "Could not load complaints. Check that your backend is running."
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [navigate]
  );

  useEffect(() => {
    loadComplaints();
  }, [loadComplaints]);

  const selected = complaints.find(
    (item) => String(getId(item)) === String(selectedId)
  );

  const selectedStatus = normaliseStatus(selected?.status);
  const canDelete =
    Boolean(selected) && selectedStatus === "Pending";

  const categories = useMemo(
    () => [
      ...new Set(
        complaints.map((item) => item.category).filter(Boolean)
      ),
    ],
    [complaints]
  );

  const filteredComplaints = useMemo(() => {
    const term = search.toLowerCase().trim();

    return complaints.filter((item) => {
      const status = normaliseStatus(item.status);

      const text = [
        item.title,
        item.description,
        item.category,
        item.location,
        getId(item),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return (
        (!term || text.includes(term)) &&
        (statusFilter === "All Statuses" ||
          status === statusFilter) &&
        (categoryFilter === "All Categories" ||
          item.category === categoryFilter)
      );
    });
  }, [complaints, search, statusFilter, categoryFilter]);

  const counts = useMemo(
    () => ({
      total: complaints.length,
      pending: complaints.filter(
        (c) => normaliseStatus(c.status) === "Pending"
      ).length,
      progress: complaints.filter(
        (c) => normaliseStatus(c.status) === "In Progress"
      ).length,
      resolved: complaints.filter(
        (c) => normaliseStatus(c.status) === "Resolved"
      ).length,
    }),
    [complaints]
  );

  const refresh = () => {
    setRefreshing(true);
    loadComplaints(false);
  };

  const deleteComplaint = async () => {
    if (!selected) return;

    if (normaliseStatus(selected.status) !== "Pending") {
      setNotice(
        `This complaint is currently "${normaliseStatus(
          selected.status
        )}". Only Pending complaints can be deleted.`
      );
      return;
    }

    const confirmed = window.confirm(
      `Delete "${selected.title || "this complaint"}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    setDeleting(true);
    setNotice("");

    try {
      await axios.delete(`${API}/${getId(selected)}`, {
        headers: getAuthHeaders(),
      });

      setNotice("Complaint deleted successfully.");

      const remaining = complaints.filter(
        (item) =>
          String(getId(item)) !== String(getId(selected))
      );

      setComplaints(remaining);
      setSelectedId(
        remaining.length ? getId(remaining[0]) : null
      );
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
        return;
      }

      setNotice(
        err.response?.data?.message ||
          "Could not delete the complaint. Please try again."
      );
    } finally {
      setDeleting(false);
    }
  };

  const submitFeedback = () => {
    if (!feedback.trim()) {
      setNotice("Please enter your feedback first.");
      return;
    }

    setNotice(
      "The feedback form is ready, but a feedback API must be connected to save it."
    );
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setCurrentUser(null);
    navigate("/login");
  };

  const StatusBadge = ({ status }) => (
    <span
      className={`mc-status mc-status-${normaliseStatus(status)
        .toLowerCase()
        .replace(/\s+/g, "-")}`}
    >
      <span className="mc-status-dot" />
      {normaliseStatus(status)}
    </span>
  );

  const navItems = [
    {
      label: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "Submit Complaint",
      path: "/complaints",
      icon: FileText,
    },
    {
      label: "My Complaints",
      path: "/my-complaints",
      icon: ClipboardList,
    },
    {
      label: "Feedback",
      path: "/feedback",
      icon: Star,
    },
    {
      label: "Profile",
      path: "/profile",
      icon: UserRound,
    },
  ];

  const selectTab = (tab) => {
    setActiveTab(tab);
    setNotice("");
  };

  return (
    <div
      className={`mc-app ${
        sidebarCollapsed ? "mc-sidebar-collapsed" : ""
      }`}
    >
      {mobileSidebarOpen && (
        <button
          className="mc-mobile-overlay"
          aria-label="Close navigation"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      <aside
        className={`mc-sidebar ${
          mobileSidebarOpen ? "mc-mobile-open" : ""
        }`}
      >
        <div className="mc-brand">
          <div className="mc-brand-icon">
            <ShieldCheck size={30} />
          </div>

          <div className="mc-brand-copy">
            <strong>SmartCampus</strong>
            <span>Complaint Management System</span>
          </div>

          <button
            className="mc-icon-button mc-sidebar-close"
            aria-label="Close sidebar"
            onClick={() => setMobileSidebarOpen(false)}
          >
            <X size={19} />
          </button>
        </div>

        <nav className="mc-navigation">
          {navItems.map(({ label, path, icon: Icon }) => (
            <Link
              key={label}
              to={path}
              title={sidebarCollapsed ? label : undefined}
              className={`mc-nav-item ${
                label === "My Complaints" ? "mc-nav-active" : ""
              }`}
              onClick={() => setMobileSidebarOpen(false)}
            >
              <Icon size={21} />
              <span>{label}</span>
            </Link>
          ))}
        </nav>

        <div className="mc-sidebar-art">
          <div className="mc-campus-orb" />
          <House size={74} strokeWidth={1.2} />
          <div className="mc-art-building">
            <span />
            <span />
            <span />
            <span />
          </div>
        </div>

        <div className="mc-sidebar-footer">
          <span>Submitted by Ankit Kumar</span>
          <small>All rights reserved by SmartCampus</small>
        </div>
      </aside>

      <main className="mc-main">
        <header className="mc-topbar">
          <div className="mc-topbar-left">
            <button
              className="mc-icon-button mc-menu-toggle"
              aria-label={
                sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"
              }
              title={
                sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"
              }
              onClick={() =>
                setSidebarCollapsed((value) => !value)
              }
            >
              <Menu size={22} />
            </button>

            <button
              className="mc-icon-button mc-mobile-menu"
              aria-label="Open navigation"
              onClick={() => setMobileSidebarOpen(true)}
            >
              <Menu size={22} />
            </button>

            <div className="mc-global-search">
              <Search size={19} />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search your complaints, categories, or locations..."
                aria-label="Search your complaints"
              />
            </div>
          </div>

          <div className="mc-user-area">
            <button
              className="mc-icon-button mc-notification"
              aria-label="Notifications"
            >
              <Bell size={21} />
              <i />
            </button>

            <div className="mc-user-avatar">
              {getInitials(currentUser?.name)}
            </div>

            <div className="mc-user-copy">
              <strong>{currentUser?.name || "User"}</strong>
              <span>{formatRole(currentUser?.role)}</span>
            </div>

            <button
              className="mc-icon-button"
              title="Log out"
              aria-label="Log out"
              onClick={handleLogout}
            >
              <LogOut size={18} />
            </button>
          </div>
        </header>

        <div className="mc-content">
          <section className="mc-hero">
            <div className="mc-hero-copy">
              <span className="mc-eyebrow">
                {currentUser?.role === "faculty"
                  ? "FACULTY SUPPORT PORTAL"
                  : "STUDENT SUPPORT PORTAL"}
              </span>

              <h1>My Complaints</h1>

              <p>
                {currentUser?.role === "faculty"
                  ? "Review and track campus complaints."
                  : "View, track, and manage all your submitted complaints."}
              </p>
            </div>

            <div className="mc-hero-message">
              <span>We're here</span>
              <strong>to resolve your concerns</strong>
            </div>

            <div className="mc-hero-illustration" aria-hidden="true">
              <div className="mc-hero-chat">
                <MessageSquare size={18} />
              </div>
              <ClipboardList size={84} strokeWidth={1.25} />
              <div className="mc-hero-person">
                <UserRound size={48} />
              </div>
            </div>
          </section>

          {error && (
            <div className="mc-alert mc-alert-error">
              <span>{error}</span>
              <button onClick={() => loadComplaints()}>
                <RefreshCw size={15} /> Retry
              </button>
            </div>
          )}

          {notice && (
            <div className="mc-alert mc-alert-info" role="status">
              <span>{notice}</span>
              <button
                aria-label="Dismiss message"
                onClick={() => setNotice("")}
              >
                <X size={16} />
              </button>
            </div>
          )}

          <section className="mc-stat-grid">
            <div className="mc-stat-card">
              <div className="mc-stat-icon mc-purple">
                <FileText size={25} />
              </div>
              <div>
                <span>Total Complaints</span>
                <strong>{counts.total}</strong>
                <small>
                  <Activity size={14} /> All submissions
                </small>
              </div>
            </div>

            <div className="mc-stat-card">
              <div className="mc-stat-icon mc-orange">
                <Clock3 size={25} />
              </div>
              <div>
                <span>Pending</span>
                <strong>{counts.pending}</strong>
                <small>Needs your attention</small>
              </div>
            </div>

            <div className="mc-stat-card">
              <div className="mc-stat-icon mc-blue">
                <Settings size={25} />
              </div>
              <div>
                <span>In Progress</span>
                <strong>{counts.progress}</strong>
                <small>Being resolved</small>
              </div>
            </div>

            <div className="mc-stat-card">
              <div className="mc-stat-icon mc-green">
                <CheckCircle2 size={25} />
              </div>
              <div>
                <span>Resolved</span>
                <strong>{counts.resolved}</strong>
                <small>Completed</small>
              </div>
            </div>
          </section>

          <section className="mc-workspace">
            <div className="mc-list-panel">
              <div className="mc-list-heading">
                <div>
                  <h2>
                    <ClipboardList size={20} /> Your submissions
                  </h2>
                  <p>
                    Select a complaint to view its tracking details.
                  </p>
                </div>

                <span className="mc-count-pill">
                  {filteredComplaints.length} found
                </span>
              </div>

              <div className="mc-filters">
                <label className="mc-list-search">
                  <Search size={17} />
                  <input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search complaints..."
                  />
                </label>

                <label className="mc-select-wrap">
                  <select
                    value={statusFilter}
                    onChange={(event) =>
                      setStatusFilter(event.target.value)
                    }
                  >
                    <option>All Statuses</option>
                    <option>Pending</option>
                    <option>In Progress</option>
                    <option>Resolved</option>
                    <option>Closed</option>
                    <option>Rejected</option>
                  </select>
                  <ChevronDown size={15} />
                </label>

                <label className="mc-select-wrap">
                  <select
                    value={categoryFilter}
                    onChange={(event) =>
                      setCategoryFilter(event.target.value)
                    }
                  >
                    <option>All Categories</option>
                    {categories.map((category) => (
                      <option key={category}>{category}</option>
                    ))}
                  </select>
                  <ChevronDown size={15} />
                </label>
              </div>

              <div className="mc-complaint-list">
                {loading ? (
                  <div className="mc-empty-state">
                    <LoaderCircle className="mc-spin" size={28} />
                    <span>Loading complaints...</span>
                  </div>
                ) : filteredComplaints.length === 0 ? (
                  <div className="mc-empty-state">
                    <ClipboardList size={35} />
                    <strong>No complaints found</strong>
                    <span>
                      {search ||
                      statusFilter !== "All Statuses" ||
                      categoryFilter !== "All Categories"
                        ? "Try changing your search or filters."
                        : "You haven't submitted any complaints yet."}
                    </span>

                    {currentUser?.role !== "faculty" && (
                      <Link
                        to="/complaints"
                        className="mc-primary-button"
                      >
                        Submit a complaint
                      </Link>
                    )}
                  </div>
                ) : (
                  filteredComplaints.map((complaint) => {
                    const id = getId(complaint);
                    const Icon = categoryIcon(complaint.category);
                    const active =
                      String(id) === String(selectedId);

                    return (
                      <button
                        key={id}
                        className={`mc-complaint-row ${
                          active ? "mc-complaint-selected" : ""
                        }`}
                        onClick={() => {
                          setSelectedId(id);
                          setActiveTab("Tracking");
                          setNotice("");
                        }}
                      >
                        <div className="mc-row-icon">
                          <Icon size={23} />
                        </div>

                        <div className="mc-row-copy">
                          <strong>
                            {complaint.title || "Untitled complaint"}
                          </strong>

                          <span>
                            {complaint.category || "General"}
                            <i />
                            {complaint.location || "Location not provided"}
                          </span>

                          <small>
                            #{String(id || "").slice(-12).toUpperCase()}
                          </small>
                        </div>

                        <div className="mc-row-meta">
                          <StatusBadge status={complaint.status} />
                          <span>
                            {getDate(
                              complaint.createdAt ||
                                complaint.created_at ||
                                complaint.date
                            )}
                          </span>
                        </div>

                        <ChevronRight
                          className="mc-row-chevron"
                          size={19}
                        />
                      </button>
                    );
                  })
                )}
              </div>
            </div>

            <div className="mc-detail-panel">
              {!selected ? (
                <div className="mc-detail-empty">
                  <ClipboardList size={42} />
                  <h2>Select a complaint</h2>
                  <p>
                    Choose one from the list to see its status and details.
                  </p>
                </div>
              ) : (
                <>
                  <div className="mc-detail-header">
                    <div className="mc-detail-title-icon">
                      {(() => {
                        const Icon = categoryIcon(selected.category);
                        return <Icon size={29} />;
                      })()}
                    </div>

                    <div className="mc-detail-title">
                      <h2>
                        {selected.title || "Untitled complaint"}
                      </h2>
                      <span>
                        #{String(getId(selected) || "")
                          .slice(-12)
                          .toUpperCase()}
                      </span>
                      <small>
                        Submitted on{" "}
                        {getDateTime(
                          selected.createdAt ||
                            selected.created_at ||
                            selected.date
                        )}
                      </small>
                    </div>

                    <StatusBadge status={selectedStatus} />
                  </div>

                  <div className="mc-tabs" role="tablist">
                    {[
                      { label: "Tracking", icon: Activity },
                      { label: "Details", icon: FileText },
                      { label: "Updates", icon: Flag },
                      { label: "Feedback", icon: MessageSquare },
                    ].map(({ label, icon: Icon }) => (
                      <button
                        key={label}
                        role="tab"
                        aria-selected={activeTab === label}
                        className={
                          activeTab === label
                            ? "mc-tab mc-tab-active"
                            : "mc-tab"
                        }
                        onClick={() => selectTab(label)}
                      >
                        <Icon size={16} /> {label}
                      </button>
                    ))}
                  </div>

                  {activeTab === "Tracking" && (
                    <>
                      <div className="mc-timeline">
                        {[
                          {
                            label: "Submitted",
                            icon: Check,
                            date: getDateTime(
                              selected.createdAt ||
                                selected.created_at ||
                                selected.date
                            ),
                            description:
                              "Your complaint has been submitted.",
                          },
                          {
                            label: "In Progress",
                            icon: Settings,
                            date:
                              selectedStatus === "In Progress"
                                ? getDateTime(
                                    selected.updatedAt ||
                                      selected.updated_at
                                  )
                                : "Waiting for action",
                            description:
                              "The concerned team is working on the issue.",
                          },
                          {
                            label: "Resolved",
                            icon: CheckCircle2,
                            date:
                              selectedStatus === "Resolved" ||
                              selectedStatus === "Closed"
                                ? getDateTime(
                                    selected.updatedAt ||
                                      selected.updated_at
                                  )
                                : "Pending",
                            description:
                              "The issue has been marked as resolved.",
                          },
                          {
                            label: "Closed",
                            icon: ShieldCheck,
                            date:
                              selectedStatus === "Closed"
                                ? getDateTime(
                                    selected.updatedAt ||
                                      selected.updated_at
                                  )
                                : "Pending",
                            description:
                              "The complaint process is complete.",
                          },
                        ].map((step, index) => {
                          const currentIndex =
                            selectedStatus === "Pending"
                              ? 0
                              : selectedStatus === "In Progress"
                                ? 1
                                : selectedStatus === "Resolved"
                                  ? 2
                                  : selectedStatus === "Closed"
                                    ? 3
                                    : 0;

                          const Icon = step.icon;

                          return (
                            <div
                              className={`mc-timeline-step ${
                                index < currentIndex
                                  ? "mc-step-done"
                                  : ""
                              } ${
                                index === currentIndex
                                  ? "mc-step-current"
                                  : ""
                              }`}
                              key={step.label}
                            >
                              <div className="mc-step-marker">
                                <Icon size={17} />
                              </div>
                              <strong>{step.label}</strong>
                              <span>{step.date}</span>
                              <p>{step.description}</p>
                            </div>
                          );
                        })}
                      </div>

                      <div className="mc-info-grid">
                        <div className="mc-details-card">
                          <h3>Complaint Details</h3>

                          <div className="mc-info-row">
                            <FileText size={17} />
                            <div>
                              <small>Category</small>
                              <strong>
                                {selected.category || "General"}
                              </strong>
                            </div>
                          </div>

                          <div className="mc-info-row">
                            <MapPin size={17} />
                            <div>
                              <small>Location</small>
                              <strong>
                                {selected.location || "Not specified"}
                              </strong>
                            </div>
                          </div>

                          <div className="mc-info-row mc-description-row">
                            <FileText size={17} />
                            <div>
                              <small>Description</small>
                              <p>
                                {selected.description ||
                                  "No description was provided."}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="mc-meta-card">
                          <div className="mc-info-row">
                            <Flag size={17} />
                            <div>
                              <small>Priority Level</small>
                              <strong>
                                {selected.priority || "Medium"}
                              </strong>
                            </div>
                          </div>

                          <div className="mc-info-row">
                            <UserRound size={17} />
                            <div>
                              <small>Assigned To</small>
                              <strong>
                                {selected.assignedTo ||
                                  selected.assigned_to ||
                                  "Support Team"}
                              </strong>
                            </div>
                          </div>

                          <div className="mc-info-row">
                            <CalendarDays size={17} />
                            <div>
                              <small>Last Updated</small>
                              <strong>
                                {getDateTime(
                                  selected.updatedAt ||
                                    selected.updated_at ||
                                    selected.createdAt ||
                                    selected.created_at
                                )}
                              </strong>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {activeTab === "Details" && (
                    <div className="mc-tab-content">
                      <h3>Full complaint information</h3>
                      <p>
                        <strong>Title:</strong>{" "}
                        {selected.title || "Untitled complaint"}
                      </p>
                      <p>
                        <strong>Complaint ID:</strong> {getId(selected)}
                      </p>
                      <p>
                        <strong>Category:</strong>{" "}
                        {selected.category || "General"}
                      </p>
                      <p>
                        <strong>Location:</strong>{" "}
                        {selected.location || "Not specified"}
                      </p>
                      <p>
                        <strong>Status:</strong> {selectedStatus}
                      </p>
                      <p>
                        <strong>Description:</strong>{" "}
                        {selected.description || "No description provided."}
                      </p>
                      <p>
                        <strong>Submitted:</strong>{" "}
                        {getDateTime(
                          selected.createdAt ||
                            selected.created_at ||
                            selected.date
                        )}
                      </p>
                    </div>
                  )}

                  {activeTab === "Updates" && (
                    <div className="mc-tab-content">
                      <h3>
                        <Activity size={19} /> Status updates
                      </h3>

                      <div className="mc-update-entry">
                        <span className="mc-update-dot" />
                        <div>
                          <strong>Current status: {selectedStatus}</strong>
                          <p>
                            {selectedStatus === "Pending"
                              ? "Your complaint is awaiting action."
                              : selectedStatus === "In Progress"
                                ? "The concerned team is working on your complaint."
                                : "Your complaint status has been updated."}
                          </p>
                          <small>
                            {getDateTime(
                              selected.updatedAt ||
                                selected.updated_at ||
                                selected.createdAt ||
                                selected.created_at
                            )}
                          </small>
                        </div>
                      </div>

                      <p className="mc-muted-note">
                        Only updates saved by your backend can be shown here.
                      </p>
                    </div>
                  )}

                  {activeTab === "Feedback" && (
                    <div className="mc-tab-content">
                      <h3>
                        <MessageSquare size={19} /> Feedback about this complaint
                      </h3>
                      <p>
                        Share your experience with the complaint handling process.
                      </p>
                      <textarea
                        value={feedback}
                        onChange={(event) =>
                          setFeedback(event.target.value)
                        }
                        placeholder="Write your feedback here..."
                        rows={5}
                      />
                      <button
                        className="mc-primary-button"
                        onClick={submitFeedback}
                      >
                        Submit Feedback
                      </button>
                    </div>
                  )}

                  <div className="mc-actions">
                    <button
                      className="mc-primary-button"
                      onClick={() => navigate("/feedback")}
                    >
                      <MessageSquare size={17} /> Add Feedback
                    </button>

                    <button
                      className="mc-secondary-button"
                      onClick={refresh}
                      disabled={refreshing}
                    >
                      <RefreshCw
                        className={refreshing ? "mc-spin" : ""}
                        size={17}
                      />
                      Refresh Status
                    </button>

                    <div className="mc-delete-wrap">
                      <button
                        className={`mc-delete-button ${
                          !canDelete ? "mc-delete-disabled" : ""
                        }`}
                        onClick={deleteComplaint}
                        disabled={deleting || !canDelete}
                        title={
                          canDelete
                            ? "Delete pending complaint"
                            : `Cannot delete: status is ${selectedStatus}`
                        }
                      >
                        {deleting ? (
                          <LoaderCircle
                            className="mc-spin"
                            size={17}
                          />
                        ) : (
                          <Trash2 size={17} />
                        )}
                        Delete Complaint
                      </button>

                      <small>
                        {canDelete
                          ? "Available while status is Pending"
                          : `Current status: ${selectedStatus}. This complaint cannot be deleted.`}
                      </small>
                    </div>
                  </div>
                </>
              )}
            </div>
          </section>

          <footer className="mc-page-footer">
            <span>© SmartCampus Complaint Management System</span>
            <span>
              Helping make campus life better <Lightbulb size={14} />
            </span>
          </footer>
        </div>
      </main>
    </div>
  );
}
