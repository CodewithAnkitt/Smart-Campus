import { Activity } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  GraduationCap, Menu, X, Search, Bell, LayoutDashboard,
  FilePlus2, ClipboardList, BookOpen, Megaphone, MessageSquare,
  UserRound, Headphones, ArrowUpRight, ArrowRight, Clock3,
  CheckCircle2, Settings2, RefreshCw, Wifi, Droplets,
  Sparkles, MapPin, CalendarDays, ChevronDown, AlertCircle,
} from "lucide-react";
import "./Dashboard.css";

const API_URL = "http://localhost:5000/api/complaints";

const categoryColors = {
  Internet: "#4f6df5",
  Classroom: "#9257ed",
  Water: "#56a6f8",
  Cleanliness: "#36bf88",
  Electricity: "#ff9d38",
  Other: "#a8b2c6",
};

const menuItems = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { label: "Submit Complaint", icon: FilePlus2, href: "/complaints" },
 { label: "My Complaints", icon: ClipboardList, href: "/my-complaints" },
  { label: "Feedback", icon: MessageSquare, href: "/feedback" },
   { label: "Profile ", href: "/profile", icon: UserRound },
];

function getDateLabel(date) {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getLastSevenDays(complaints) {
  const days = [];

  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() - i);

    const nextDay = new Date(date);
    nextDay.setDate(nextDay.getDate() + 1);

    const count = complaints.filter((item) => {
      const created = new Date(item.createdAt);
      return created >= date && created < nextDay;
    }).length;

    days.push({
      label: date.toLocaleDateString("en-IN", { day: "2-digit", month: "short" }),
      count,
    });
  }

  return days;
}

function TrendChart({ data }) {
  const maxValue = Math.max(4, ...data.map((item) => item.count));
  const points = data.map((item, index) => ({
    x: 12 + index * (276 / 6),
    y: 100 - (item.count / maxValue) * 76,
    ...item,
  }));

  const line = points.map((point) => `${point.x},${point.y}`).join(" ");
  const area = `12,100 ${line} 288,100`;

  return (
    <div className="trend-chart">
      <svg viewBox="0 0 300 108" role="img" aria-label="Complaints submitted during the last seven days">
        {[24, 48, 72, 100].map((y) => (
          <line key={y} x1="12" y1={y} x2="288" y2={y} className="chart-grid" />
        ))}
        <polygon points={area} className="trend-area" />
        <polyline points={line} className="trend-line" />
        {points.map((point) => (
          <circle key={point.label} cx={point.x} cy={point.y} r="3.2" className="trend-dot">
            <title>{point.label}: {point.count} complaints</title>
          </circle>
        ))}
      </svg>
      <div className="trend-labels">
        {points.map((point) => <span key={point.label}>{point.label}</span>)}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [period, setPeriod] = useState("7");

  async function loadComplaints() {
    setLoading(true);
    setError("");

    try {
      const response = await axios.get(API_URL);
      setComplaints(response.data.complaints || []);
    } catch {
      setError("Couldn't load complaints. Check that the backend and MongoDB are running.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadComplaints();
  }, []);

  const stats = useMemo(() => [
    {
      label: "Total Complaints",
      value: complaints.length,
      icon: ClipboardList,
      color: "blue",
      hint: "All reported issues",
    },
    {
      label: "Pending",
      value: complaints.filter((c) => c.status === "Pending").length,
      icon: Clock3,
      color: "orange",
      hint: "Awaiting attention",
    },
    {
      label: "In Progress",
      value: complaints.filter((c) => c.status === "In Progress").length,
      icon: Settings2,
      color: "yellow",
      hint: "Currently being handled",
    },
    {
      label: "Resolved",
      value: complaints.filter((c) => c.status === "Resolved").length,
      icon: CheckCircle2,
      color: "green",
      hint: "Successfully completed",
    },
  ], [complaints]);

  const filteredComplaints = useMemo(() => {
    const term = search.trim().toLowerCase();

    return complaints.filter((item) => {
      const matchesSearch = !term || [
        item.title,
        item.category,
        item.location,
        item.status,
      ].some((value) => String(value || "").toLowerCase().includes(term));

      const matchesCategory = categoryFilter === "All" || item.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [complaints, search, categoryFilter]);

  const categoryData = useMemo(() => {
    const counts = {};

    complaints.forEach((item) => {
      counts[item.category] = (counts[item.category] || 0) + 1;
    });

    return Object.entries(counts)
      .map(([name, value]) => ({
        name,
        value,
        color: categoryColors[name] || categoryColors.Other,
      }))
      .sort((a, b) => b.value - a.value);
  }, [complaints]);

  const donutStyle = useMemo(() => {
    if (!complaints.length) {
      return { background: "#edf0f7" };
    }

    let start = 0;
    const slices = categoryData.map((item) => {
      const end = start + (item.value / complaints.length) * 100;
      const slice = `${item.color} ${start}% ${end}%`;
      start = end;
      return slice;
    });

    return { background: `conic-gradient(${slices.join(", ")})` };
  }, [complaints.length, categoryData]);

  const trendData = useMemo(() => {
    const days = getLastSevenDays(complaints);
    const visibleDays = Number(period);
    return visibleDays === 7 ? days : days.slice(-visibleDays);
  }, [complaints, period]);

  return (
    <div
  className={`sc-app ${sidebarCollapsed ? "sc-sidebar-collapsed" : ""}`}
>
      {sidebarOpen && (
        <button
          className="sc-mobile-overlay"
          aria-label="Close navigation"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside className={`sc-sidebar ${sidebarOpen ? "sc-sidebar-open" : ""}`}>
        <a href="/dashboard" className="sc-brand">
          <span className="sc-brand-icon"><GraduationCap size={29} /></span>
          <span className="sc-brand-text">
            <strong>SmartCampus</strong>
            <small>Campus Complaint System</small>
          </span>
          <button
            type="button"
            className="sc-close-sidebar"
            aria-label="Close navigation"
            onClick={(event) => {
              event.preventDefault();
              setSidebarOpen(false);
            }}
          >
            <X size={20} />
          </button>
        </a>

        <nav className="sc-nav" aria-label="Main navigation">
          {menuItems.map(({ label, icon: Icon, href }, index) => (
            <a
              href={href}
              key={label}
              className={`sc-nav-link ${index === 0 ? "active" : ""}`}
              onClick={() => setSidebarOpen(false)}
            >
              <Icon size={20} />
              <span>{label}</span>
            </a>
          ))}
          
        </nav>

        <div className="sc-help-card">
          <span className="sc-help-icon"><Headphones size={25} /></span>
          <h3>Need Help?</h3>
          <p>Have a question? Contact campus support.</p>
          <a href="/#features" className="sc-help-link">
            Contact Support <ArrowRight size={16} />
          </a>
        </div>
      </aside>

      <main className="sc-main">
        <header className="sc-topbar">
          
<button
  type="button"
  className="sc-menu-button"
  aria-label="Toggle navigation"
  aria-expanded={!sidebarCollapsed}
  onClick={() => {
    if (window.matchMedia("(max-width: 760px)").matches) {
      setSidebarOpen((open) => !open);
    } else {
      setSidebarCollapsed((collapsed) => !collapsed);
    }
  }}
>
  <Menu size={24} />
</button>


          <label className="sc-search">
            <Search size={20} />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search complaints, categories..."
              aria-label="Search complaints"
            />
            {search && (
              <button type="button" onClick={() => setSearch("")} aria-label="Clear search">
                <X size={16} />
              </button>
            )}
          </label>

          <div className="sc-topbar-right">
            <button
              type="button"
              className="sc-notification"
              title="Refresh complaint data"
              aria-label="Refresh complaint data"
              onClick={loadComplaints}
            >
              <Bell size={21} />
              <span />
            </button>
            <div className="sc-profile">
              <span className="sc-avatar">S</span>
              <span className="sc-profile-copy">
                <strong>Student Portal</strong>
                <small>SmartCampus user</small>
              </span>
              <ChevronDown size={17} />
            </div>
          </div>
        </header>

        <div className="sc-content">
          <section className="sc-hero">
            <div className="sc-hero-copy">
              <span className="sc-eyebrow"><Sparkles size={14} /> YOUR CAMPUS, YOUR VOICE</span>
              <p className="sc-greeting">Welcome back,</p>
              <h1>Student <span>👋</span></h1>
              <p className="sc-hero-description">
                Report, track, and help us keep our campus better.
              </p>
              <div className="sc-hero-actions">
                <a href="/complaints" className="sc-primary-button">
                  <FilePlus2 size={17} /> Submit a Complaint
                </a>
                <a href="/complaints" className="sc-secondary-button">
                  <ClipboardList size={17} /> View Complaints
                </a>
              </div>
            </div>
           <div className="sc-hero-art" aria-hidden="true"> 
              <div className="sc-sun" />
              <div className="sc-cloud sc-cloud-one" />
              <div className="sc-cloud sc-cloud-two" />
              <div className="sc-campus-ground" />
              <div className="sc-campus-building">
                <div className="sc-building-roof" />
                <div className="sc-building-windows">
                  {Array.from({ length: 15 }, (_, i) => <span key={i} />)}
                </div>
                <div className="sc-building-door" />
              </div>
              <div className="sc-tree sc-tree-one" />
              <div className="sc-tree sc-tree-two" />
              <div className="sc-tree sc-tree-three" />
              <div className="sc-hero-quote">
                <span>“</span>
                A cleaner, safer and better campus starts with you.
              </div>
            </div>
          </section>

          {error && (
            <div className="sc-error" role="alert">
              <AlertCircle size={18} /> {error}
              <button type="button" onClick={loadComplaints}>Try again</button>
            </div>
          )}

          <section className="sc-stats-grid" aria-label="Complaint statistics">
            {stats.map(({ label, value, icon: Icon, color, hint }) => (
              <article className={`sc-stat-card ${color}`} key={label}>
                <div className="sc-stat-top">
                  <span className="sc-stat-icon"><Icon size={23} /></span>
                  <span className="sc-stat-label">{label}</span>
                </div>
                <div className="sc-stat-bottom">
                  <strong>{loading ? "—" : value}</strong>
                  <span className="sc-stat-hint">{hint}</span>
                </div>
                <div className="sc-stat-decoration" />
              </article>
            ))}
          </section>

          <section className="sc-data-grid">
            <article className="sc-panel sc-recent-panel">
              <div className="sc-panel-heading">
                <div className="sc-panel-title">
                  <span className="sc-panel-icon"><ClipboardList size={19} /></span>
                  <div>
                    <h2>Recent Complaints</h2>
                    <p>Your latest submitted campus issues</p>
                  </div>
                </div>
                <a href="/complaints" className="sc-view-all">
                  View All <ArrowUpRight size={16} />
                </a>
              </div>

              {loading ? (
                <div className="sc-empty"><RefreshCw size={22} className="sc-spin" /> Loading complaints…</div>
              ) : filteredComplaints.length === 0 ? (
                <div className="sc-empty">
                  <ClipboardList size={34} />
                  <strong>{search ? "No matching complaints" : "No complaints yet"}</strong>
                  <span>{search ? "Try another search term." : "Your campus issues will appear here after submission."}</span>
                  {!search && <a href="/complaints" className="sc-primary-button">Submit your first complaint</a>}
                </div>
              ) : (
                <div className="sc-table-wrap">
                  <table className="sc-table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Complaint</th>
                        <th>Category</th>
                        <th>Location</th>
                        <th>Status</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredComplaints.slice(0, 8).map((item, index) => (
                        <tr key={item._id}>
                          <td className="sc-row-number">{index + 1}</td>
                          <td className="sc-complaint-title">{item.title}</td>
                          <td>
                            <span
                              className="sc-category-pill"
                              style={{
                                color: categoryColors[item.category] || categoryColors.Other,
                                background: `${categoryColors[item.category] || categoryColors.Other}18`,
                              }}
                            >
                              {item.category}
                            </span>
                          </td>
                          <td className="sc-location"><MapPin size={13} /> {item.location}</td>
                          <td>
                            <span className={`sc-status status-${item.status.toLowerCase().replace(/\s+/g, "-")}`}>
                              <i /> {item.status}
                            </span>
                          </td>
                          <td className="sc-date">{getDateLabel(item.createdAt)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </article>

            <div className="sc-side-panels">
              <article className="sc-panel sc-category-panel">
                <div className="sc-panel-heading">
                  <div className="sc-panel-title">
                    <span className="sc-chart-icon">◔</span>
                    <div><h2>Complaints by Category</h2><p>Current distribution</p></div>
                  </div>
                  <span className="sc-small-tag">All time</span>
                </div>

                {complaints.length === 0 ? (
                  <div className="sc-chart-empty">Category insights appear after the first complaint.</div>
                ) : (
                  <div className="sc-donut-layout">
                    <div className="sc-donut" style={donutStyle}>
                      <div className="sc-donut-center">
                        <strong>{complaints.length}</strong>
                        <span>Total</span>
                      </div>
                    </div>
                    <div className="sc-legend">
                      {categoryData.map((item) => (
                        <div className="sc-legend-row" key={item.name}>
                          <span className="sc-legend-name">
                            <i style={{ background: item.color }} /> {item.name}
                          </span>
                          <strong>{item.value}</strong>
                          <small>{Math.round((item.value / complaints.length) * 100)}%</small>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </article>

              <article className="sc-panel sc-trend-panel">
                <div className="sc-panel-heading">
                  <div className="sc-panel-title">
                    <span className="sc-trend-icon">▥</span>
                    <div><h2>Complaint Trends</h2><p>New reports over time</p></div>
                  </div>
                  <select
                    value={period}
                    onChange={(event) => setPeriod(event.target.value)}
                    aria-label="Trend chart period"
                    className="sc-period-select"
                  >
                    <option value="7">Last 7 Days</option>
                    <option value="3">Last 3 Days</option>
                  </select>
                </div>
                {loading ? (
                  <div className="sc-chart-empty">Loading trend data…</div>
                ) : (
                  <TrendChart data={trendData} />
                )}
              </article>
            </div>
          </section>

          <div className="sc-bottom-note">
            <span className="sc-note-bulb">✦</span>
            <p>Together, we can build a cleaner, safer and more vibrant campus.</p>
            <span className="sc-note-status"><Wifi size={14} /> Campus support, made simple</span>
          </div>

          <footer className="sc-footer">
            <span>© {new Date().getFullYear()} SmartCampus. All Rights Reserved.</span>
           
          </footer>
        </div>
      </main>
    </div>
  );
}
