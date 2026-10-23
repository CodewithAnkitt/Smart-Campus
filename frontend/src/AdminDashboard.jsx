
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  GraduationCap,
  LayoutDashboard,
  ClipboardList,
  Users,
  MessageSquare,
  LogOut,
  Bell,
  Search,
  CheckCircle2,
  Clock3,
  FileText,
  Menu,
  X,
  CalendarDays,
  ChartNoAxesColumnIncreasing,
  ChevronDown,
  Ellipsis,
  Star,
  ArrowRight,
} from "lucide-react";
import "./AdminDashboard.css";

const API_URL = "http://localhost:5000/api/admin/dashboard";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "Complaints", icon: ClipboardList, page: "Manage Complaints" },
  { label: "Users", icon: Users, page: "Manage Users" },
  { label: "Feedback", icon: MessageSquare },
];

const formatDate = (date) => {
  if (!date) return "—";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getInitials = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("") || "U";

const getColor = (index) =>
  ["blue", "purple", "orange", "green", "pink", "slate"][
    index % 6
  ];

const getPriority = (status) => {
  if (status === "Pending") return "High";
  if (status === "In Progress") return "Medium";
  return "Low";
};

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [activePage, setActivePage] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");
const [allComplaints, setAllComplaints] = useState([]);
const [complaintsLoading, setComplaintsLoading] = useState(false);
const [complaintsError, setComplaintsError] = useState("");
const [selectedComplaint, setSelectedComplaint] = useState(null);
const [updatingComplaintId, setUpdatingComplaintId] = useState("");
const [complaintStatusFilter, setComplaintStatusFilter] =
  useState("All");

const [complaintCategoryFilter, setComplaintCategoryFilter] =
  useState("All");
  const [dashboard, setDashboard] = useState({
    stats: {
      totalComplaints: 0,
      resolvedComplaints: 0,
      pendingComplaints: 0,
      inProgressComplaints: 0,
      totalUsers: 0,
    },
    statusCounts: [],
    categoryCounts: [],
    recentComplaints: [],
    recentUsers: [],
    recentFeedback: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  let user = null;

  try {
    user = JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    user = null;
  }

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token || !user || user.role !== "admin") {
      return;
    }

    const fetchDashboard = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(API_URL, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();

        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            setError(data.message || "Admin authorization failed.");
          } else {
            setError(data.message || "Unable to load dashboard data.");
          }
          return;
        }

        setDashboard({
          stats: data.stats || {},
          statusCounts: data.statusCounts || [],
          categoryCounts: data.categoryCounts || [],
          recentComplaints: data.recentComplaints || [],
          recentUsers: data.recentUsers || [],
          recentFeedback: data.recentFeedback || [],
        });
      } catch (err) {
        console.error("Dashboard fetch error:", err);
        setError(
          "Cannot connect to the backend. Make sure the server is running."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [token, user?.role]);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.clear();
    navigate("/login", { replace: true });
  };

  const setPage = (page) => {
    setActivePage(page);
    setSidebarOpen(false);
    setSearch("");
  };
const fetchAllComplaints = async () => {
  setComplaintsLoading(true);
  setComplaintsError("");

  try {
    const response = await fetch("http://localhost:5000/api/complaints", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Unable to load complaints.");
    }

    setAllComplaints(data.complaints || []);
  } catch (error) {
    setComplaintsError(error.message);
  } finally {
    setComplaintsLoading(false);
  }
};
useEffect(() => {
  if (activePage === "Manage Complaints" && token) {
    fetchAllComplaints();
  }
}, [activePage, token]);
const updateComplaintStatus = async (id, status) => {
  setUpdatingComplaintId(id);
  setComplaintsError("");

  try {
    const response = await fetch(
      `http://localhost:5000/api/complaints/${id}/status`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Unable to update status.");
    }

    setAllComplaints((previous) =>
      previous.map((complaint) =>
        complaint._id === id ? data.complaint : complaint
      )
    );

    setSelectedComplaint((previous) =>
      previous?._id === id ? data.complaint : previous
    );
  } catch (error) {
    setComplaintsError(error.message);
  } finally {
    setUpdatingComplaintId("");
  }
};
  const {
    stats,
    statusCounts,
    categoryCounts,
    recentComplaints,
    recentUsers,
    recentFeedback,
  } = dashboard;

  const getStatusCount = (status) =>
    statusCounts.find(
      (item) => item._id?.toLowerCase() === status.toLowerCase()
    )?.count || 0;

  const totalComplaints = stats.totalComplaints || 0;
  const resolved = stats.resolvedComplaints || 0;
  const pending = stats.pendingComplaints || 0;
  const inProgress = stats.inProgressComplaints || 0;

  const resolvedCount = getStatusCount("Resolved") || resolved;
  const pendingCount = getStatusCount("Pending") || pending;
  const progressCount = getStatusCount("In Progress") || inProgress;

  const percent = (value) =>
    totalComplaints ? ((value / totalComplaints) * 100).toFixed(1) : "0.0";

  const filteredComplaints = useMemo(
    () =>
      recentComplaints.filter((item) =>
        `${item.title} ${item.category} ${item.status} ${
          item.location || ""
        } ${item.submittedBy?.name || ""}`
          .toLowerCase()
          .includes(search.toLowerCase())
      ),
    [recentComplaints, search]
  );

  const filteredUsers = useMemo(
    () =>
      recentUsers.filter((item) =>
        `${item.name} ${item.role} ${item.email}`
          .toLowerCase()
          .includes(search.toLowerCase())
      ),
    [recentUsers, search]
  );

  const filteredFeedback = useMemo(
    () =>
      recentFeedback.filter((item) =>
        `${item.title || ""} ${item.message || ""} ${item.type || ""} ${
          item.user?.name || ""
        }`
          .toLowerCase()
          .includes(search.toLowerCase())
      ),
    [recentFeedback, search]
  );

  const statCards = [
    {
      title: "Total Complaints",
      value: totalComplaints,
      icon: ClipboardList,
      color: "blue",
    },
    {
      title: "Resolved Complaints",
      value: resolved,
      icon: CheckCircle2,
      color: "green",
    },
    {
      title: "Pending Complaints",
      value: pending,
      icon: Clock3,
      color: "red",
    },
    {
      title: "Total Users",
      value: stats.totalUsers || 0,
      icon: Users,
      color: "purple",
    },
  ];

  const categoryColors = ["blue", "purple", "orange", "green", "pink", "slate"];

  
const renderComplaints = () => {
  const filteredComplaints = allComplaints.filter((item) =>
    `${item.title || ""} ${item.category || ""} ${
      item.status || ""
    } ${item.location || ""} ${
      item.submittedBy?.name || ""
    }`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const resolvedCount = allComplaints.filter(
    (item) => item.status === "Resolved"
  ).length;

  const pendingCount = allComplaints.filter(
    (item) => item.status === "Pending"
  ).length;

  const progressCount = allComplaints.filter(
    (item) => item.status === "In Progress"
  ).length;

  return (
    <div className="complaints-page">
      {/* Page heading */}
      <div className="complaints-heading">
        <div>
          <span className="complaints-eyebrow">
            COMPLAINT MANAGEMENT
          </span>
          <h2>Campus Complaints</h2>
          <p>
            Track, review, and resolve campus issues from one place.
          </p>
        </div>

        <button
          className="complaints-refresh-btn"
          onClick={fetchAllComplaints}
          disabled={complaintsLoading}
        >
          <span className={complaintsLoading ? "refresh-spin" : ""}>
            ↻
          </span>
          {complaintsLoading ? "Refreshing..." : "Refresh Data"}
        </button>
      </div>

      {/* Statistics */}
      <div className="complaints-stats">
        <article className="complaint-stat total">
          <div className="complaint-stat-top">
            <span>Total Complaints</span>
            <span className="complaint-stat-icon">▤</span>
          </div>
          <h3>{allComplaints.length}</h3>
          <p>All submitted complaints</p>
          <div className="complaint-stat-line" />
        </article>

        <article className="complaint-stat pending">
          <div className="complaint-stat-top">
            <span>Pending</span>
            <span className="complaint-stat-icon">◷</span>
          </div>
          <h3>{pendingCount}</h3>
          <p>Awaiting action</p>
          <div className="complaint-stat-line" />
        </article>

        <article className="complaint-stat progress">
          <div className="complaint-stat-top">
            <span>In Progress</span>
            <span className="complaint-stat-icon">↻</span>
          </div>
          <h3>{progressCount}</h3>
          <p>Currently being handled</p>
          <div className="complaint-stat-line" />
        </article>

        <article className="complaint-stat resolved">
          <div className="complaint-stat-top">
            <span>Resolved</span>
            <span className="complaint-stat-icon">✓</span>
          </div>
          <h3>{resolvedCount}</h3>
          <p>Successfully completed</p>
          <div className="complaint-stat-line" />
        </article>
      </div>

      {/* Main complaints panel */}
      <section className="admin-panel-card complaints-table-card">
        <div className="complaints-table-heading">
          <div>
            <h3>All Complaints</h3>
            <p>
              Review submitted issues and manage their status.
            </p>
          </div>

          <span className="complaints-count">
            {filteredComplaints.length} records
          </span>
        </div>

        {/* Search and filters */}
        <div className="complaints-toolbar">
          <label className="complaints-search">
            <Search size={18} />
            <input
              type="search"
              placeholder="Search title, category, location, or student..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </label>

          <select
            className="complaints-filter"
            aria-label="Filter complaints by status"
            onChange={(event) => {
              const value = event.target.value;
              setComplaintStatusFilter(value);
            }}
            value={complaintStatusFilter}
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>

          <select
            className="complaints-filter"
            aria-label="Filter complaints by category"
            onChange={(event) => {
              setComplaintCategoryFilter(event.target.value);
            }}
            value={complaintCategoryFilter}
          >
            <option value="All">All Categories</option>
            <option value="Electricity">Electricity</option>
            <option value="Water">Water</option>
            <option value="Cleanliness">Cleanliness</option>
            <option value="Internet">Internet</option>
            <option value="Classroom">Classroom</option>
            <option value="Faculty">Faculty</option>
          </select>
        </div>

        {complaintsError && (
          <div className="complaints-error" role="alert">
            {complaintsError}
          </div>
        )}

        {complaintsLoading ? (
          <div className="complaints-empty">
            <div className="complaints-loader" />
            <h3>Loading complaints</h3>
            <p>Fetching the latest records from the database...</p>
          </div>
        ) : (
          <div className="complaints-table-scroll">
            <table className="admin-table complaints-modern-table">
              <thead>
                <tr>
                  <th>COMPLAINT</th>
                  <th>CATEGORY</th>
                  <th>SUBMITTED BY</th>
                  <th>LOCATION</th>
                  <th>DATE</th>
                  <th>STATUS</th>
                  <th>ACTION</th>
                </tr>
              </thead>

              <tbody>
                {filteredComplaints
                  .filter(
                    (item) =>
                      complaintStatusFilter === "All" ||
                      item.status === complaintStatusFilter
                  )
                  .filter(
                    (item) =>
                      complaintCategoryFilter === "All" ||
                      item.category === complaintCategoryFilter
                  )
                  .map((item, index) => (
                    <tr key={item._id}>
                      <td>
                        <div className="complaint-title-cell">
                          <span className="complaint-file-icon">
                            <FileText size={18} />
                          </span>

                          <div>
                            <strong>{item.title}</strong>
                            <small>
                              ID: {(item._id || "").slice(-7).toUpperCase()}
                            </small>
                          </div>
                        </div>
                      </td>

                      <td>
                        <span
                          className={`complaint-category-pill category-${(
                            item.category || "other"
                          )
                            .toLowerCase()
                            .replace(/\s+/g, "-")}`}
                        >
                          {item.category || "Other"}
                        </span>
                      </td>

                      <td>
                        <div className="complaint-user-cell">
                          <span
                            className={`admin-user-avatar ${getColor(index)}`}
                          >
                            {getInitials(item.submittedBy?.name)}
                          </span>

                          <div>
                            <strong>
                              {item.submittedBy?.name || "Unknown"}
                            </strong>
                            <small>
                              {item.submittedBy?.email || "No email"}
                            </small>
                          </div>
                        </div>
                      </td>

                      <td>
                        <span className="complaint-location">
                          {item.location || "Not specified"}
                        </span>
                      </td>

                      <td>
                        <span className="complaint-date">
                          {formatDate(item.createdAt)}
                        </span>
                      </td>

                      <td>
                        <select
                          className={`complaint-status-select status-${(
                            item.status || "Pending"
                          )
                            .toLowerCase()
                            .replace(/\s+/g, "-")}`}
                          aria-label={`Status for ${item.title}`}
                          value={item.status}
                          disabled={updatingComplaintId === item._id}
                          onChange={(event) =>
                            updateComplaintStatus(
                              item._id,
                              event.target.value
                            )
                          }
                        >
                          <option value="Pending">Pending</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Resolved">Resolved</option>
                        </select>

                        {updatingComplaintId === item._id && (
                          <small className="complaint-saving">
                            Saving...
                          </small>
                        )}
                      </td>

                      <td>
                        <button
                          className="complaint-view-btn"
                          onClick={() => setSelectedComplaint(item)}
                          title="View complaint details"
                        >
                          View <ArrowRight size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>

            {!filteredComplaints.some(
              (item) =>
                (complaintStatusFilter === "All" ||
                  item.status === complaintStatusFilter) &&
                (complaintCategoryFilter === "All" ||
                  item.category === complaintCategoryFilter)
            ) && (
              <div className="complaints-empty">
                <FileText size={34} />
                <h3>No complaints found</h3>
                <p>
                  Try changing your search or selecting another filter.
                </p>
              </div>
            )}
          </div>
        )}

        <div className="complaints-table-footer">
          <span>
            Showing{" "}
            {
              filteredComplaints.filter(
                (item) =>
                  (complaintStatusFilter === "All" ||
                    item.status === complaintStatusFilter) &&
                  (complaintCategoryFilter === "All" ||
                    item.category === complaintCategoryFilter)
              ).length
            }{" "}
            complaints
          </span>

          <button
            className="complaints-refresh-text"
            onClick={() => {
              setSearch("");
              setComplaintStatusFilter("All");
              setComplaintCategoryFilter("All");
            }}
          >
            Clear filters
          </button>
        </div>
      </section>

      {/* Complaint details modal */}
      {selectedComplaint && (
        <div
          className="complaint-modal-overlay"
          onClick={() => setSelectedComplaint(null)}
        >
          <section
            className="complaint-detail-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="complaint-detail-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="complaint-detail-header">
              <div>
                <span className="complaints-eyebrow">
                  COMPLAINT INFORMATION
                </span>
                <h3 id="complaint-detail-title">Complaint Details</h3>
              </div>

              <button
                className="complaint-modal-close"
                onClick={() => setSelectedComplaint(null)}
                aria-label="Close complaint details"
              >
                <X size={21} />
              </button>
            </div>

            <div className="complaint-detail-body">
              <div className="complaint-detail-title">
                <span className="complaint-detail-file-icon">
                  <FileText size={23} />
                </span>
                <div>
                  <h4>{selectedComplaint.title}</h4>
                  <p>
                    ID:{" "}
                    {(selectedComplaint._id || "")
                      .slice(-7)
                      .toUpperCase()}
                  </p>
                </div>
              </div>

              <div className="complaint-detail-grid">
                <div>
                  <span>Category</span>
                  <strong>{selectedComplaint.category}</strong>
                </div>

                <div>
                  <span>Submitted date</span>
                  <strong>{formatDate(selectedComplaint.createdAt)}</strong>
                </div>

                <div>
                  <span>Submitted by</span>
                  <strong>
                    {selectedComplaint.submittedBy?.name || "Unknown"}
                  </strong>
                </div>

                <div>
                  <span>Email address</span>
                  <strong className="complaint-detail-email">
                    {selectedComplaint.submittedBy?.email || "Not available"}
                  </strong>
                </div>

                <div className="complaint-detail-full">
                  <span>Location</span>
                  <strong>
                    {selectedComplaint.location || "Not specified"}
                  </strong>
                </div>

                <div className="complaint-detail-full">
                  <span>Description</span>
                  <p>{selectedComplaint.description}</p>
                </div>
              </div>

              <div className="complaint-detail-status">
                <label htmlFor="detail-status">Update complaint status</label>

                <select
                  id="detail-status"
                  className={`complaint-status-select status-${(
                    selectedComplaint.status || "Pending"
                  )
                    .toLowerCase()
                    .replace(/\s+/g, "-")}`}
                  value={selectedComplaint.status}
                  disabled={
                    updatingComplaintId === selectedComplaint._id
                  }
                  onChange={(event) =>
                    updateComplaintStatus(
                      selectedComplaint._id,
                      event.target.value
                    )
                  }
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                </select>
              </div>
            </div>

            <div className="complaint-detail-footer">
              <button
                className="complaint-modal-done"
                onClick={() => setSelectedComplaint(null)}
              >
                Done
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
};

  
const renderUsers = () => {
  const users = filteredUsers;

  const students = users.filter(
    (user) => user.role?.toLowerCase() === "student"
  ).length;

  const faculty = users.filter(
    (user) => user.role?.toLowerCase() === "faculty"
  ).length;

  return (
    <div className="users-page">
      <div className="users-heading">
        <div>
          <span className="complaints-eyebrow">USER MANAGEMENT</span>
          <h2>Campus Users</h2>
          <p>Manage registered students and faculty members.</p>
        </div>

        <button
          className="users-refresh-btn"
          onClick={() => window.location.reload()}
        >
          ↻ Refresh Data
        </button>
      </div>

      <div className="users-stats">
        <article className="users-stat-card">
          <div className="users-stat-icon users-blue">♙</div>
          <div>
            <p>Total Users</p>
            <h3>{users.length}</h3>
            <small>Registered accounts</small>
          </div>
        </article>

        <article className="users-stat-card">
          <div className="users-stat-icon users-purple">🎓</div>
          <div>
            <p>Students</p>
            <h3>{students}</h3>
            <small>Student accounts</small>
          </div>
        </article>

        <article className="users-stat-card">
          <div className="users-stat-icon users-green">♧</div>
          <div>
            <p>Faculty</p>
            <h3>{faculty}</h3>
            <small>Faculty accounts</small>
          </div>
        </article>
      </div>

      <section className="admin-panel-card users-table-card">
        <div className="users-table-heading">
          <div>
            <h3>Registered Users</h3>
            <p>Campus account directory</p>
          </div>
          <span className="users-count">{users.length} users</span>
        </div>

        <div className="users-search-wrapper">
          <Search size={18} />
          <input
            type="search"
            placeholder="Search name, email, or role..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        {loading ? (
          <div className="users-empty-state">Loading users...</div>
        ) : (
          <div className="users-table-scroll">
            <table className="admin-table users-modern-table">
              <thead>
                <tr>
                  <th>USER</th>
                  <th>ROLE</th>
                  <th>EMAIL ADDRESS</th>
                  <th>JOINED DATE</th>
                </tr>
              </thead>

              <tbody>
                {users.map((user, index) => (
                  <tr key={user._id || user.email}>
                    <td>
                      <div className="users-table-user">
                        <span
                          className={`admin-user-avatar ${getColor(index)}`}
                        >
                          {getInitials(user.name)}
                        </span>
                        <div>
                          <strong>{user.name || "Unnamed User"}</strong>
                          <small>
                            ID: {user._id
                              ? user._id.slice(-7).toUpperCase()
                              : "N/A"}
                          </small>
                        </div>
                      </div>
                    </td>

                    <td>
                      <span
                        className={`users-role-badge ${
                          user.role?.toLowerCase() || "unknown"
                        }`}
                      >
                        <span className="users-role-dot" />
                        {user.role || "Unknown"}
                      </span>
                    </td>

                    <td>
                      <span className="users-email">
                        {user.email || "No email available"}
                      </span>
                    </td>

                    <td>
                      <span className="users-joined-date">
                        {formatDate(user.createdAt)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {!users.length && (
              <div className="users-empty-state">
                <Users size={30} />
                <h3>No users found</h3>
                <p>Try searching with another name or email.</p>
              </div>
            )}
          </div>
        )}

        <div className="users-table-footer">
          <span>Showing {users.length} users</span>
          <button onClick={() => setSearch("")}>Clear search</button>
        </div>
      </section>
    </div>
  );
};


 
const renderFeedback = () => {
  const feedback = filteredFeedback;

  const types = new Set(
    feedback.map((item) => item.type || "General Feedback")
  ).size;

  return (
    <div className="feedback-page">
      <div className="users-heading">
        <div>
          <span className="complaints-eyebrow">CAMPUS VOICE</span>
          <h2>Feedback Center</h2>
          <p>Review suggestions and messages from your campus community.</p>
        </div>

        <button
          className="users-refresh-btn"
          onClick={() => window.location.reload()}
        >
          ↻ Refresh Data
        </button>
      </div>

      <div className="users-stats">
        <article className="users-stat-card">
          <div className="users-stat-icon users-blue">
            <MessageSquare size={23} />
          </div>
          <div>
            <p>Total Feedback</p>
            <h3>{feedback.length}</h3>
            <small>Available messages</small>
          </div>
        </article>

        <article className="users-stat-card">
          <div className="users-stat-icon users-purple">▤</div>
          <div>
            <p>Feedback Types</p>
            <h3>{types}</h3>
            <small>Different categories</small>
          </div>
        </article>

        <article className="users-stat-card">
          <div className="users-stat-icon users-green">✓</div>
          <div>
            <p>Latest Submission</p>
            <h3>{feedback.length ? formatDate(feedback[0].createdAt) : "—"}</h3>
            <small>Most recent available record</small>
          </div>
        </article>
      </div>

      <section className="admin-panel-card feedback-table-card">
        <div className="users-table-heading">
          <div>
            <h3>Feedback Messages</h3>
            <p>Read comments and suggestions submitted by users.</p>
          </div>
          <span className="users-count">{feedback.length} messages</span>
        </div>

        <div className="users-search-wrapper">
          <Search size={18} />
          <input
            type="search"
            placeholder="Search title, message, type, or user..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        {loading ? (
          <div className="users-empty-state">Loading feedback...</div>
        ) : (
          <div className="users-table-scroll">
            <table className="admin-table feedback-modern-table">
              <thead>
                <tr>
                  <th>FEEDBACK</th>
                  <th>TYPE</th>
                  <th>SUBMITTED BY</th>
                  <th>DATE</th>
                </tr>
              </thead>

              <tbody>
                {feedback.map((item, index) => (
                  <tr key={item._id || `${item.title}-${index}`}>
                    <td>
                      <div className="feedback-message-cell">
                        <span className={`users-stat-icon ${[
                          "users-blue",
                          "users-purple",
                          "users-green",
                        ][index % 3]}`}>
                          <MessageSquare size={18} />
                        </span>
                        <div className="feedback-message-content">
                          <strong>{item.title || "Campus Feedback"}</strong>
                          <p>{item.message || "No message provided."}</p>
                        </div>
                      </div>
                    </td>

                    <td>
                      <span className="feedback-type-badge">
                        {item.type || "General Feedback"}
                      </span>
                    </td>

                    <td>
                      <div className="users-table-user">
                        <span
                          className={`admin-user-avatar ${getColor(index)}`}
                        >
                          {getInitials(item.user?.name || "User")}
                        </span>
                        <div>
                          <strong>{item.user?.name || "Unknown User"}</strong>
                          <small>{item.user?.email || "Email unavailable"}</small>
                        </div>
                      </div>
                    </td>

                    <td>
                      <span className="users-joined-date">
                        {formatDate(item.createdAt)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {!feedback.length && (
              <div className="users-empty-state">
                <MessageSquare size={30} />
                <h3>No feedback found</h3>
                <p>Try a different search or check again later.</p>
              </div>
            )}
          </div>
        )}

        <div className="users-table-footer">
          <span>Showing {feedback.length} messages</span>
          <button onClick={() => setSearch("")}>Clear search</button>
        </div>
      </section>
    </div>
  );
};


  const renderDashboard = () => {
    const statusSegments = [
      { name: "Resolved", count: resolvedCount, color: "#20b486" },
      { name: "Pending", count: pendingCount, color: "#ff5368" },
      { name: "In Progress", count: progressCount, color: "#3478f6" },
    ];

    let accumulated = 0;
    const gradient = statusSegments
      .map((segment) => {
        const start = accumulated;
        accumulated += totalComplaints
          ? (segment.count / totalComplaints) * 100
          : 0;
        return `${segment.color} ${start}% ${accumulated}%`;
      })
      .join(", ");

    const maxCategory = Math.max(
      1,
      ...categoryCounts.map((item) => item.count || 0)
    );

    return (
      <>
        <div className="admin-welcome">
          <div>
            <h1>
              Welcome back, {user.name?.split(" ")[0] || "Admin"}!{" "}
              <span className="admin-wave">👋</span>
            </h1>
            <p>Here's an overview of your SmartCampus today.</p>
          </div>

          <div className="admin-date">
            <CalendarDays size={20} />
            <div>
              <strong>
                {new Date().toLocaleDateString("en-IN", {
                  weekday: "long",
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </strong>
              <small>Keep making the campus better!</small>
            </div>
          </div>
        </div>

        {error && (
          <div className="admin-panel-card" role="alert">
            <p>{error}</p>
            <button onClick={() => window.location.reload()}>Retry</button>
          </div>
        )}

        {loading && !error && (
          <p className="admin-demo-note">Loading live dashboard data...</p>
        )}

        <div className="admin-stats-grid">
          {statCards.map((stat) => {
            const Icon = stat.icon;

            return (
              <article
                className={`admin-stat-card ${stat.color}-card`}
                key={stat.title}
              >
                <div className={`admin-stat-icon ${stat.color}`}>
                  <Icon size={24} />
                </div>
                <div className="admin-stat-info">
                  <p>{stat.title}</p>
                  <h2>{loading ? "—" : stat.value}</h2>
                  <span className="admin-stat-change">
                    Live database statistics
                  </span>
                </div>
                <div className={`admin-stat-sparkline ${stat.color}`} />
              </article>
            );
          })}
        </div>

        <div className="admin-charts-grid">
          <article className="admin-panel-card">
            <div className="admin-card-heading">
              <div className="admin-heading-title">
                <span className="admin-heading-icon">
                  <ChartNoAxesColumnIncreasing size={21} />
                </span>
                <div>
                  <h3>Complaint Status</h3>
                  <p>Overview by current status</p>
                </div>
              </div>
              <button className="admin-icon-button" aria-label="More options">
                <Ellipsis size={20} />
              </button>
            </div>

            <div className="admin-status-chart">
              <div
                className="admin-donut"
                style={{
                  background: totalComplaints
                    ? `conic-gradient(${gradient})`
                    : "#edf1f7",
                }}
              >
                <div className="admin-donut-center">
                  <strong>{totalComplaints}</strong>
                  <span>Total</span>
                </div>
              </div>

              <div className="admin-chart-legend">
                {statusSegments.map((item) => (
                  <div key={item.name}>
                    <span
                      className={`legend-dot ${
                        item.name === "Resolved"
                          ? "resolved"
                          : item.name === "Pending"
                            ? "pending"
                            : "progress"
                      }`}
                    />
                    <span>{item.name}</span>
                    <strong>{percent(item.count)}%</strong>
                  </div>
                ))}
              </div>
            </div>
          </article>

          <article className="admin-panel-card admin-trend-card">
            <div className="admin-card-heading">
              <div className="admin-heading-title">
                <span className="admin-heading-icon">
                  <ChartNoAxesColumnIncreasing size={22} />
                </span>
                <div>
                  <h3>Complaints Overview</h3>
                  <p>Current complaint totals</p>
                </div>
              </div>
              <button
                className="admin-period-button"
                onClick={() => setPage("Manage Complaints")}
              >
                View Complaints <ChevronDown size={15} />
              </button>
            </div>

            <div className="admin-overview-bars">
              {statusSegments.map((item) => (
                <div className="admin-category-row" key={item.name}>
                  <span className="admin-category-name">{item.name}</span>
                  <div className="admin-bar-track">
                    <div
                      className="admin-bar-fill blue"
                      style={{
                        width: `${Math.min(
                          100,
                          totalComplaints
                            ? (item.count / totalComplaints) * 100
                            : 0
                        )}%`,
                        backgroundColor: item.color,
                      }}
                    />
                  </div>
                  <strong>{item.count}</strong>
                </div>
              ))}
            </div>
          </article>

          <article className="admin-panel-card admin-category-card">
            <div className="admin-card-heading">
              <div className="admin-heading-title">
                <span className="admin-heading-icon">
                  <ChartNoAxesColumnIncreasing size={21} />
                </span>
                <div>
                  <h3>Complaints by Category</h3>
                  <p>Distribution across campus</p>
                </div>
              </div>
              <button className="admin-icon-button" aria-label="More options">
                <Ellipsis size={20} />
              </button>
            </div>

            <div className="admin-category-bars">
              {categoryCounts.map((item, index) => (
                <div className="admin-category-row" key={item._id || index}>
                  <span
                    className={`admin-category-icon ${categoryColors[index % categoryColors.length]}`}
                  >
                    <ClipboardList size={15} />
                  </span>
                  <span className="admin-category-name">
                    {item._id || "Other"}
                  </span>
                  <div className="admin-bar-track">
                    <div
                      className={`admin-bar-fill ${categoryColors[index % categoryColors.length]}`}
                      style={{
                        width: `${((item.count || 0) / maxCategory) * 100}%`,
                      }}
                    />
                  </div>
                  <strong>{item.count || 0}</strong>
                </div>
              ))}
              {!categoryCounts.length && !loading && (
                <p className="admin-demo-note">No category data available.</p>
              )}
            </div>
          </article>
        </div>

        <div className="admin-quick-actions">
          <button
            className="admin-action-card"
            onClick={() => setPage("Manage Users")}
          >
            <span className="admin-action-icon blue">
              <Users size={24} />
            </span>
            <span>
              <strong>Manage Users</strong>
              <small>View registered students and faculty</small>
            </span>
            <ArrowRight size={19} />
          </button>

          <button
            className="admin-action-card"
            onClick={() => setPage("Manage Complaints")}
          >
            <span className="admin-action-icon purple">
              <FileText size={24} />
            </span>
            <span>
              <strong>View Complaints</strong>
              <small>Monitor campus complaints</small>
            </span>
            <ArrowRight size={19} />
          </button>

          <button
            className="admin-action-card"
            onClick={() => setPage("Feedback")}
          >
            <span className="admin-action-icon violet">
              <MessageSquare size={24} />
            </span>
            <span>
              <strong>View Feedback</strong>
              <small>Read feedback from campus users</small>
            </span>
            <ArrowRight size={19} />
          </button>

          <button
            className="admin-action-card"
            onClick={() => window.print()}
          >
            <span className="admin-action-icon orange">
              <ChartNoAxesColumnIncreasing size={24} />
            </span>
            <span>
              <strong>Generate Reports</strong>
              <small>Print or save this dashboard</small>
            </span>
            <ArrowRight size={19} />
          </button>
        </div>

        <div className="admin-bottom-grid">
          <section className="admin-panel-card admin-recent-card">
            <div className="admin-card-heading">
              <div className="admin-heading-title">
                <span className="admin-small-blue-icon">
                  <FileText size={19} />
                </span>
                <h3>Recent Complaints</h3>
              </div>
              <button
                className="admin-link-button"
                onClick={() => setPage("Manage Complaints")}
              >
                View All
              </button>
            </div>

            <div className="admin-compact-list">
              {recentComplaints.slice(0, 5).map((item, index) => {
                const priority = getPriority(item.status);

                return (
                  <div className="admin-compact-row" key={item._id}>
                    <span className={`admin-round-icon ${priority.toLowerCase()}`}>
                      <FileText size={18} />
                    </span>
                    <div className="admin-compact-main">
                      <strong>{item.title}</strong>
                      <small>
                        {item.category} <span>•</span>{" "}
                        {formatDate(item.createdAt)}
                      </small>
                    </div>
                    <span className={`admin-priority ${priority.toLowerCase()}`}>
                      {priority}
                    </span>
                  </div>
                );
              })}
              {!recentComplaints.length && !loading && (
                <p className="admin-demo-note">No complaints submitted yet.</p>
              )}
            </div>
          </section>

          <section className="admin-panel-card admin-recent-card">
            <div className="admin-card-heading">
              <div className="admin-heading-title">
                <span className="admin-small-blue-icon">
                  <Users size={19} />
                </span>
                <h3>Recent Users</h3>
              </div>
              <button
                className="admin-link-button"
                onClick={() => setPage("Manage Users")}
              >
                View All
              </button>
            </div>

            <div className="admin-compact-list">
              {recentUsers.slice(0, 5).map((item, index) => (
                <div className="admin-user-row" key={item._id || item.email}>
                  <span className={`admin-user-avatar ${getColor(index)}`}>
                    {getInitials(item.name)}
                  </span>
                  <div className="admin-compact-main">
                    <strong>{item.name}</strong>
                    <small>
                      {item.role} <span>•</span> {item.email}
                    </small>
                  </div>
                  <time>{formatDate(item.createdAt)}</time>
                </div>
              ))}
              {!recentUsers.length && !loading && (
                <p className="admin-demo-note">No registered users found.</p>
              )}
            </div>
          </section>

          <section className="admin-panel-card admin-recent-card">
            <div className="admin-card-heading">
              <div className="admin-heading-title">
                <span className="admin-small-blue-icon">
                  <MessageSquare size={19} />
                </span>
                <h3>Recent Feedback</h3>
              </div>
              <button
                className="admin-link-button"
                onClick={() => setPage("Feedback")}
              >
                View All
              </button>
            </div>

            <div className="admin-compact-list">
              {recentFeedback.slice(0, 5).map((item, index) => (
                <div className="admin-feedback-row" key={item._id}>
                  <span className={`admin-feedback-icon ${getColor(index)}`}>
                    <MessageSquare size={16} />
                  </span>
                  <div className="admin-compact-main">
                    <strong>{item.title || item.message || "Feedback"}</strong>
                    <small>{item.type || "General Feedback"}</small>
                  </div>
                  <time>{formatDate(item.createdAt)}</time>
                </div>
              ))}
              {!recentFeedback.length && !loading && (
                <p className="admin-demo-note">No feedback submitted yet.</p>
              )}
            </div>
          </section>
        </div>

        <p className="admin-demo-note">
          <Bell size={15} />
          Dashboard statistics are loaded from the SmartCampus database.
        </p>
      </>
    );
  };

  const renderSection = () => {
    if (activePage === "Dashboard") return renderDashboard();
    if (activePage === "Manage Complaints") return renderComplaints();
    if (activePage === "Manage Users") return renderUsers();
    return renderFeedback();
  };

  const pageTitle =
    activePage === "Manage Complaints"
      ? "Complaints"
      : activePage === "Manage Users"
        ? "Users"
        : activePage;

  if (!token || !user || user.role !== "admin") {
    return (
      <div className="admin-access-denied">
        <h2>Admin access required</h2>
        <p>Please log in with your administrator account.</p>
        <button onClick={() => navigate("/login", { replace: true })}>
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div className="admin-layout">
      {sidebarOpen && (
        <button
          className="admin-mobile-overlay"
          aria-label="Close sidebar"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside className={`admin-sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="admin-brand">
          <div className="admin-brand-icon">
            <GraduationCap size={31} />
          </div>
          <div>
            <strong>SmartCampus</strong>
            <span>Admin Panel</span>
          </div>
          <button
            className="admin-close-sidebar"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="admin-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            const page = item.page || item.label;

            return (
              <button
                key={item.label}
                className={`admin-nav-item ${
                  activePage === page ? "active" : ""
                }`}
                onClick={() => setPage(page)}
              >
                <Icon size={22} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="admin-sidebar-bottom">
          <button className="admin-logout-button" onClick={logout}>
            <LogOut size={21} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <main className="admin-main">
        <header className="admin-topbar">
          <button
            className="admin-menu-toggle"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={23} />
          </button>

          <label className="admin-search">
            <Search size={20} />
            <input
              type="search"
              placeholder="Search complaints, users, or feedback..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              aria-label="Search dashboard"
            />
          </label>

          <button
            className="admin-notification-button"
            aria-label="Notifications"
          >
            <Bell size={22} />
          </button>

          <div className="admin-topbar-profile">
            <div className="admin-avatar">
              {user.name?.charAt(0)?.toUpperCase() || "A"}
            </div>
            <div>
              <strong>{user.name || "Admin"}</strong>
              <span>Administrator</span>
            </div>
            <ChevronDown size={17} className="admin-profile-chevron" />
          </div>
        </header>

        <div className="admin-content">
          {activePage !== "Dashboard" && (
            <div className="admin-section-title">
              <div>
                <span>SMARTCAMPUS / ADMIN</span>
                <h1>{pageTitle}</h1>
                <p>
                  {activePage === "Manage Complaints"
                    ? "Monitor campus reports and their current status."
                    : activePage === "Manage Users"
                      ? "View registered students and faculty."
                      : "Suggestions and feedback from campus users."}
                </p>
              </div>
            </div>
          )}

          {renderSection()}
        </div>

        <footer className="admin-footer">
          SmartCampus Complaint Management System
          <span>Admin Panel</span>
        </footer>
      </main>
    </div>
  );
}
