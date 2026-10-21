
import { useRef, useState } from "react";
import {
  LayoutDashboard,
  FilePenLine,
  ClipboardList,
  Star,
  UserRound,
  Menu,
  Search,
  Bell,
  GraduationCap,
  Mail,
  Phone,
  Building2,
  MapPin,
  CalendarDays,
  Camera,
  FileText,
  Clock3,
  Settings,
  ShieldCheck,
  Wrench,
  LogOut,
  ChevronRight,
  Save,
  X,
  LockKeyhole,
  CheckCircle2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

const initialProfile = {
  name: "Ankit Kumar",
  phone: "+91 98765 43210",
  email: "ankitkumar@example.com",
  studentId: "22CS045",
  department: "Computer Science",
  year: "3rd Year",
  dob: "2004-03-15",
};

export default function Profile() {
  const [profile, setProfile] = useState(initialProfile);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [photo, setPhoto] = useState("");
  const [message, setMessage] = useState("");
  const fileInput = useRef(null);
  const navigate = useNavigate();

  const updateField = (field, value) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const saveProfile = (event) => {
    event.preventDefault();
    setMessage("Profile changes saved in this session.");
    setTimeout(() => setMessage(""), 3000);
  };

  const uploadPhoto = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!["image/jpeg", "image/png"].includes(file.type)) {
      setMessage("Please select a JPG or PNG image.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setMessage("Image must be smaller than 5 MB.");
      return;
    }

    setPhoto(URL.createObjectURL(file));
  };

  const navItems = [
    { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
    { label: "Submit Complaint", icon: FilePenLine, path: "/complaints" },
    { label: "My Complaints", icon: ClipboardList, path: "/my-complaints" },
    { label: "Feedback", icon: Star, path: "/feedback" },
    { label: "My Profile", icon: UserRound, path: "/profile" },
  ];

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="profile-app">
      {sidebarOpen && (
        <div className="profile-overlay" onClick={closeSidebar} />
      )}

      <aside
        className={`profile-sidebar ${
          collapsed ? "sidebar-collapsed" : ""
        } ${sidebarOpen ? "sidebar-mobile-open" : ""}`}
      >
        <div className="profile-brand">
          <div className="brand-icon">
            <GraduationCap size={32} />
          </div>
          <div className="brand-text">
            <h2>SmartCampus</h2>
            <p>Complaint Management System</p>
          </div>
          <button
            className="mobile-close"
            onClick={closeSidebar}
            aria-label="Close menu"
          >
            <X size={21} />
          </button>
        </div>

        <nav className="profile-nav">
          {navItems.map(({ label, icon: Icon, path }) => (
            <button
              key={label}
              className={`profile-nav-item ${
                label === "My Profile" ? "active" : ""
              }`}
              title={collapsed ? label : ""}
              onClick={() => {
                closeSidebar();
                if (path !== "/profile") navigate(path);
              }}
            >
              <Icon size={23} />
              <span>{label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="campus-art">
            <Building2 size={80} strokeWidth={1} />
            <GraduationCap size={42} />
          </div>
          <p>Submitted by Ankit Kumar</p>
          <small>All rights reserved by SmartCampus</small>
        </div>
      </aside>

      <main
        className={`profile-main ${
          collapsed ? "main-expanded" : ""
        }`}
      >
        <header className="profile-topbar">
          <button
            className="menu-button"
            onClick={() => {
              if (window.innerWidth <= 760) {
                setSidebarOpen(true);
              } else {
                setCollapsed(!collapsed);
              }
            }}
            aria-label="Toggle sidebar"
          >
            <Menu size={25} />
          </button>

          <div className="profile-search">
            <Search size={20} />
            <input
              placeholder="Search complaints, categories, or locations..."
              aria-label="Search"
            />
          </div>

          <div className="topbar-user">
            <button
              className="notification-button"
              aria-label="Notifications"
              onClick={() => setMessage("No new notifications.")}
            >
              <Bell size={23} />
              <span />
            </button>
            <div className="topbar-avatar">
              {photo ? (
                <img src={photo} alt="Profile" />
              ) : (
                profile.name
                  .split(" ")
                  .map((part) => part[0])
                  .join("")
                  .slice(0, 2)
              )}
            </div>
            <div className="topbar-user-text">
              <strong>{profile.name}</strong>
              <span>Student</span>
            </div>
          </div>
        </header>

        <div className="profile-content">
          <section className="profile-hero">
            <div>
              <h1>My Profile</h1>
              <p>
                Manage your personal information, view your activity,
                and keep your account secure.
              </p>
            </div>

            <div className="hero-message">
              <div>
                <h3>Your Campus<br />Your Voice</h3>
                <p>Keep your information updated for a better experience.</p>
              </div>
              <div className="hero-icon">
                <GraduationCap size={32} />
              </div>
            </div>

            <div className="hero-decoration">
              <Building2 size={94} strokeWidth={1} />
              <GraduationCap size={45} />
            </div>
          </section>

          {message && (
            <div className="profile-message">
              <CheckCircle2 size={19} />
              {message}
              <button onClick={() => setMessage("")} aria-label="Dismiss">
                <X size={17} />
              </button>
            </div>
          )}

          <div className="profile-layout">
            <div className="profile-left-column">
              <section className="profile-card profile-overview">
                <div className="cover-banner">
                  <span className="student-badge">
                    <GraduationCap size={19} /> Student
                  </span>
                </div>

                <div className="overview-body">
                  <div className="profile-identity">
                    <div className="large-avatar">
                      {photo ? (
                        <img src={photo} alt="Profile" />
                      ) : (
                        profile.name
                          .split(" ")
                          .map((part) => part[0])
                          .join("")
                          .slice(0, 2)
                      )}
                      <button
                        className="camera-button"
                        onClick={() => fileInput.current?.click()}
                        title="Upload profile picture"
                        aria-label="Upload profile picture"
                      >
                        <Camera size={19} />
                      </button>
                    </div>
                    <div className="identity-text">
                      <h2>{profile.name}</h2>
                      <p>Student</p>
                      <span className="student-id-badge">
                        <GraduationCap size={18} />
                        Student ID: {profile.studentId}
                      </span>
                    </div>
                  </div>

                  <input
                    ref={fileInput}
                    type="file"
                    accept="image/png,image/jpeg"
                    onChange={uploadPhoto}
                    hidden
                  />

                  <div className="overview-details">
                    <div className="overview-detail">
                      <span className="detail-icon blue">
                        <Mail size={22} />
                      </span>
                      <div>
                        <small>Email Address</small>
                        <strong>{profile.email}</strong>
                      </div>
                    </div>

                    <div className="overview-detail">
                      <span className="detail-icon green">
                        <Phone size={22} />
                      </span>
                      <div>
                        <small>Phone Number</small>
                        <strong>{profile.phone}</strong>
                      </div>
                    </div>

                    <div className="overview-detail">
                      <span className="detail-icon purple">
                        <Building2 size={22} />
                      </span>
                      <div>
                        <small>Department</small>
                        <strong>{profile.department}</strong>
                      </div>
                    </div>

                    <div className="overview-detail">
                      <span className="detail-icon blue">
                        <MapPin size={22} />
                      </span>
                      <div>
                        <small>Year</small>
                        <strong>{profile.year}</strong>
                      </div>
                    </div>

                    <div className="overview-detail">
                      <span className="detail-icon orange">
                        <CalendarDays size={22} />
                      </span>
                      <div>
                        <small>Date of Birth</small>
                        <strong>
                          {profile.dob
                            ? new Date(
                                `${profile.dob}T00:00:00`
                              ).toLocaleDateString("en-GB", {
                                day: "2-digit",
                                month: "long",
                                year: "numeric",
                              })
                            : "Not provided"}
                        </strong>
                      </div>
                    </div>
                  </div>

                  <div className="profile-stats">
                    <button onClick={() => navigate("/my-complaints")}>
                      <span className="stat-icon purple">
                        <FileText size={22} />
                      </span>
                      <span>
                        <strong>12</strong>
                        <small>My Complaints</small>
                      </span>
                      <ChevronRight size={21} />
                    </button>

                    <button onClick={() => navigate("/feedback")}>
                      <span className="stat-icon orange">
                        <Star size={23} />
                      </span>
                      <span>
                        <strong>8</strong>
                        <small>My Feedback</small>
                      </span>
                      <ChevronRight size={21} />
                    </button>

                    <button onClick={() => navigate("/my-complaints")}>
                      <span className="stat-icon blue">
                        <Clock3 size={23} />
                      </span>
                      <span>
                        <strong>5</strong>
                        <small>Pending Items</small>
                      </span>
                      <ChevronRight size={21} />
                    </button>
                  </div>
                </div>
              </section>

              <section className="profile-card quick-links-card">
                <div className="section-heading">
                  <h2>Quick Links</h2>
                  <p>Access important features quickly.</p>
                </div>

                <div className="quick-links-grid">
                  <button
                    className="quick-link"
                    onClick={() => navigate("/my-complaints")}
                  >
                    <span className="quick-icon purple">
                      <FileText size={23} />
                    </span>
                    <strong>My Complaints</strong>
                    <small>View and track your complaints</small>
                    <ChevronRight size={20} />
                  </button>

                  <button
                    className="quick-link"
                    onClick={() => navigate("/feedback")}
                  >
                    <span className="quick-icon orange">
                      <Star size={23} />
                    </span>
                    <strong>Feedback</strong>
                    <small>Share your thoughts</small>
                    <ChevronRight size={20} />
                  </button>

                  <button
                    className="quick-link"
                    onClick={() =>
                      document
                        .getElementById("edit-profile")
                        ?.scrollIntoView({ behavior: "smooth" })
                    }
                  >
                    <span className="quick-icon blue">
                      <Settings size={23} />
                    </span>
                    <strong>Account Settings</strong>
                    <small>Manage your preferences</small>
                    <ChevronRight size={20} />
                  </button>

                  <button
                    className="quick-link"
                    onClick={() =>
                      document
                        .getElementById("account-security")
                        ?.scrollIntoView({ behavior: "smooth" })
                    }
                  >
                    <span className="quick-icon green">
                      <ShieldCheck size={23} />
                    </span>
                    <strong>Privacy & Security</strong>
                    <small>Keep your account safe</small>
                    <ChevronRight size={20} />
                  </button>
                </div>
              </section>
            </div>

            <div className="profile-right-column">
              <section
                className="profile-card edit-profile-card"
                id="edit-profile"
              >
                <div className="card-heading">
                  <div>
                    <h2>Edit Profile</h2>
                    <p>Update your personal information here.</p>
                  </div>
                  <button
                    className="save-button"
                    onClick={saveProfile}
                    form="profile-form"
                    type="submit"
                  >
                    <Save size={18} /> Save Changes
                  </button>
                </div>

                <form
                  id="profile-form"
                  className="profile-form"
                  onSubmit={saveProfile}
                >
                  <label>
                    Full Name
                    <span className="input-wrap">
                      <UserRound size={20} />
                      <input
                        value={profile.name}
                        onChange={(e) =>
                          updateField("name", e.target.value)
                        }
                        required
                      />
                    </span>
                  </label>

                  <label>
                    Phone Number
                    <span className="input-wrap">
                      <Phone size={20} />
                      <input
                        type="tel"
                        value={profile.phone}
                        onChange={(e) =>
                          updateField("phone", e.target.value)
                        }
                        required
                      />
                    </span>
                  </label>

                  <label>
                    Email Address
                    <span className="input-wrap input-disabled">
                      <Mail size={20} />
                      <input value={profile.email} readOnly />
                    </span>
                  </label>

                  <label>
                    Student ID
                    <span className="input-wrap input-disabled">
                      <GraduationCap size={21} />
                      <input value={profile.studentId} readOnly />
                    </span>
                  </label>

                  <label>
                    Department
                    <span className="input-wrap">
                      <Building2 size={20} />
                      <select
                        value={profile.department}
                        onChange={(e) =>
                          updateField("department", e.target.value)
                        }
                      >
                        <option>Computer Science</option>
                        <option>Computer Applications</option>
                        <option>Information Technology</option>
                        <option>Electronics</option>
                        <option>Mechanical Engineering</option>
                      </select>
                    </span>
                  </label>

                  <label>
                    Year
                    <span className="input-wrap">
                      <MapPin size={20} />
                      <select
                        value={profile.year}
                        onChange={(e) =>
                          updateField("year", e.target.value)
                        }
                      >
                        <option>1st Year</option>
                        <option>2nd Year</option>
                        <option>3rd Year</option>
                        <option>4th Year</option>
                      </select>
                    </span>
                  </label>

                  <label>
                    Date of Birth
                    <span className="input-wrap">
                      <CalendarDays size={20} />
                      <input
                        type="date"
                        value={profile.dob}
                        onChange={(e) =>
                          updateField("dob", e.target.value)
                        }
                      />
                    </span>
                  </label>

                  <label className="upload-label">
                    Profile Picture
                    <button
                      className="photo-upload-box"
                      type="button"
                      onClick={() => fileInput.current?.click()}
                    >
                      {photo ? (
                        <img src={photo} alt="Selected profile" />
                      ) : (
                        <span className="upload-camera">
                          <Camera size={25} />
                        </span>
                      )}
                      <span>
                        <strong>Click to upload photo</strong>
                        <small>JPG, PNG (Max 5MB)</small>
                      </span>
                    </button>
                  </label>
                </form>
              </section>

              <section
                className="profile-card security-card"
                id="account-security"
              >
                <div className="section-heading">
                  <h2>Account Security</h2>
                  <p>Keep your account secure with these options.</p>
                </div>

                <div className="security-row">
                  <span className="security-icon purple">
                    <Wrench size={22} />
                  </span>
                  <div>
                    <strong>Change Password</strong>
                    <small>Update your password regularly for security.</small>
                  </div>
                  <button
                    onClick={() =>
                      setMessage(
                        "Password change will be available after backend authentication is connected."
                      )
                    }
                  >
                    Change
                  </button>
                </div>

                <div className="security-row">
                  <span className="security-icon green">
                    <ShieldCheck size={23} />
                  </span>
                  <div>
                    <strong>Two-Factor Authentication</strong>
                    <small>Add an extra layer of security to your account.</small>
                  </div>
                  <button
                    onClick={() =>
                      setMessage(
                        "Two-factor authentication requires backend integration."
                      )
                    }
                  >
                    Enable
                  </button>
                </div>

                <div className="security-row">
                  <span className="security-icon red">
                    <LogOut size={22} />
                  </span>
                  <div>
                    <strong>Sign Out</strong>
                    <small>Sign out from this device.</small>
                  </div>
                  <button
                    className="signout-button"
                    onClick={() =>
                      setMessage(
                        "Sign out will be available after login is implemented."
                      )
                    }
                  >
                    Sign Out
                  </button>
                </div>
              </section>
            </div>
          </div>

          <footer className="profile-footer">
            <GraduationCap size={19} />
            
            <span>All rights reserved by SmartCampus</span>
          </footer>
        </div>
      </main>
    </div>
  );
}
