
import { useEffect, useRef, useState } from "react";
import axios from "axios";
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
  CheckCircle2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

const API_URL = "http://localhost:5000/api";

const initialProfile = {
  name: "",
  phone: "",
  email: "",
  studentId: "",
  department: "",
  year: "",
  dob: "",
  role: "student",
  profilePicture: "",
};

export default function Profile() {
  const [profile, setProfile] = useState(initialProfile);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [photo, setPhoto] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [stats, setStats] = useState({
    complaints: 0,
    feedback: 0,
    pending: 0,
  });

  const fileInput = useRef(null);
  const navigate = useNavigate();

  const roleLabel =
    profile.role === "faculty" ? "Faculty" : "Student";

  const initials = (profile.name || "User")
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const showMessage = (text, type = "success") => {
    setMessage(text);
    setMessageType(type);
  };

  const getAuthConfig = () => ({
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  const signOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.clear();
    navigate("/login", { replace: true });
  };

  useEffect(() => {
    let active = true;

    const loadProfile = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        localStorage.removeItem("user");
        navigate("/login", { replace: true });
        return;
      }

      try {
        const response = await axios.get(
          `${API_URL}/profile`,
          getAuthConfig()
        );

        if (!active) return;

        const user = response.data.user;

        setProfile({
          name: user.name || "",
          phone: user.phone || "",
          email: user.email || "",
          studentId: user.studentId || "",
          department: user.department || "",
          year: user.year || "",
          dob: user.dob || "",
          role: user.role || "student",
          profilePicture: user.profilePicture || "",
        });

        setPhoto(user.profilePicture || "");

        const storedUser = JSON.parse(
          localStorage.getItem("user") || "{}"
        );

        localStorage.setItem(
          "user",
          JSON.stringify({ ...storedUser, ...user })
        );

        // Load activity counts independently so one failed request
        // does not prevent the profile from loading.
        const [complaintsResult, feedbackResult] =
          await Promise.allSettled([
            axios.get(`${API_URL}/complaints`, getAuthConfig()),
            axios.get(`${API_URL}/feedback`, getAuthConfig()),
          ]);

        if (!active) return;

        let complaints = [];
        let feedback = [];

        if (complaintsResult.status === "fulfilled") {
          complaints =
            complaintsResult.value.data.complaints || [];
        }

        if (feedbackResult.status === "fulfilled") {
          feedback =
            feedbackResult.value.data.feedbacks || [];
        }

        setStats({
          complaints: complaints.length,
          feedback: feedback.length,
          pending: complaints.filter(
            (item) =>
              item.status === "Pending" ||
              item.status === "In Progress"
          ).length,
        });
      } catch (error) {
        if (!active) return;

        if (error.response?.status === 401) {
          signOut();
          return;
        }

        showMessage(
          error.response?.data?.message ||
            "Unable to load your profile. Please try again.",
          "error"
        );
      } finally {
        if (active) setLoading(false);
      }
    };

    loadProfile();

    return () => {
      active = false;
    };
  }, [navigate]);

  const updateField = (field, value) => {
    setProfile((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const saveProfile = async (event) => {
    event.preventDefault();

    if (!profile.name.trim() || !profile.phone.trim()) {
      showMessage("Name and phone number are required.", "error");
      return;
    }

    setSaving(true);
    setMessage("");

    try {
      const response = await axios.put(
        `${API_URL}/profile`,
        {
          name: profile.name.trim(),
          phone: profile.phone.trim(),
          department: profile.department,
          year: profile.year,
          dob: profile.dob,
        },
        getAuthConfig()
      );

      const user = response.data.user;

      setProfile((previous) => ({
        ...previous,
        ...user,
      }));

      const storedUser = JSON.parse(
        localStorage.getItem("user") || "{}"
      );

      localStorage.setItem(
        "user",
        JSON.stringify({ ...storedUser, ...user })
      );

      showMessage(
        response.data.message || "Profile updated successfully."
      );
    } catch (error) {
      if (error.response?.status === 401) {
        signOut();
        return;
      }

      showMessage(
        error.response?.data?.message ||
          "Unable to save profile changes.",
        "error"
      );
    } finally {
      setSaving(false);
    }
  };

  const uploadPhoto = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!["image/jpeg", "image/png"].includes(file.type)) {
      showMessage("Please select a JPG or PNG image.", "error");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showMessage("Image must be smaller than 5 MB.", "error");
      event.target.value = "";
      return;
    }

    // Preview only. Persistent image uploads require a separate
    // backend upload endpoint.
    const reader = new FileReader();

    reader.onload = () => {
      setPhoto(reader.result);
      showMessage(
        "Photo preview updated. Save it through an image-upload service to keep it after refreshing."
      );
    };

    reader.onerror = () => {
      showMessage("Unable to preview this image.", "error");
    };

    reader.readAsDataURL(file);
  };

  const navItems = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      path: "/dashboard",
    },
    {
      label: "Submit Complaint",
      icon: FilePenLine,
      path: "/complaints",
    },
    {
      label: "My Complaints",
      icon: ClipboardList,
      path: "/my-complaints",
    },
    {
      label: "Feedback",
      icon: Star,
      path: "/feedback",
    },
    {
      label: "My Profile",
      icon: UserRound,
      path: "/profile",
    },
  ];

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="profile-app">
      {sidebarOpen && (
        <div
          className="profile-overlay"
          onClick={closeSidebar}
        />
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
                setCollapsed((previous) => !previous);
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
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  navigate("/my-complaints");
                }
              }}
            />
          </div>

          <div className="topbar-user">
            <button
              className="notification-button"
              aria-label="Notifications"
              onClick={() =>
                showMessage("No new notifications.")
              }
            >
              <Bell size={23} />
              <span />
            </button>

            <div className="topbar-avatar">
              {photo ? (
                <img src={photo} alt="Profile" />
              ) : (
                initials
              )}
            </div>

            <div className="topbar-user-text">
              <strong>
                {loading ? "Loading profile..." : profile.name}
              </strong>
              <span>{roleLabel}</span>
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
                <h3>
                  Your Campus
                  <br />
                  Your Voice
                </h3>
                <p>
                  Keep your information updated for a better experience.
                </p>
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
            <div
              className="profile-message"
              role="status"
              style={
                messageType === "error"
                  ? { color: "#b91c1c" }
                  : undefined
              }
            >
              <CheckCircle2 size={19} />
              {message}
              <button
                onClick={() => setMessage("")}
                aria-label="Dismiss"
              >
                <X size={17} />
              </button>
            </div>
          )}

          {loading ? (
            <section className="profile-card" style={{ padding: 30 }}>
              Loading your profile...
            </section>
          ) : (
            <div className="profile-layout">
              <div className="profile-left-column">
                <section className="profile-card profile-overview">
                  <div className="cover-banner">
                    <span className="student-badge">
                      <GraduationCap size={19} />
                      {roleLabel}
                    </span>
                  </div>

                  <div className="overview-body">
                    <div className="profile-identity">
                      <div className="large-avatar">
                        {photo ? (
                          <img src={photo} alt="Profile" />
                        ) : (
                          initials
                        )}

                        <button
                          className="camera-button"
                          onClick={() =>
                            fileInput.current?.click()
                          }
                          title="Upload profile picture"
                          aria-label="Upload profile picture"
                        >
                          <Camera size={19} />
                        </button>
                      </div>

                      <div className="identity-text">
                        <h2>{profile.name}</h2>
                        <p>{roleLabel}</p>

                        {profile.studentId && (
                          <span className="student-id-badge">
                            <GraduationCap size={18} />
                            Student ID: {profile.studentId}
                          </span>
                        )}
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
                          <strong>
                            {profile.email || "Not provided"}
                          </strong>
                        </div>
                      </div>

                      <div className="overview-detail">
                        <span className="detail-icon green">
                          <Phone size={22} />
                        </span>
                        <div>
                          <small>Phone Number</small>
                          <strong>
                            {profile.phone || "Not provided"}
                          </strong>
                        </div>
                      </div>

                      <div className="overview-detail">
                        <span className="detail-icon purple">
                          <Building2 size={22} />
                        </span>
                        <div>
                          <small>Department</small>
                          <strong>
                            {profile.department || "Not provided"}
                          </strong>
                        </div>
                      </div>

                      <div className="overview-detail">
                        <span className="detail-icon blue">
                          <MapPin size={22} />
                        </span>
                        <div>
                          <small>Year</small>
                          <strong>
                            {profile.year || "Not provided"}
                          </strong>
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
                      <button
                        onClick={() => navigate("/my-complaints")}
                      >
                        <span className="stat-icon purple">
                          <FileText size={22} />
                        </span>
                        <span>
                          <strong>{stats.complaints}</strong>
                          <small>My Complaints</small>
                        </span>
                        <ChevronRight size={21} />
                      </button>

                      <button
                        onClick={() => navigate("/feedback")}
                      >
                        <span className="stat-icon orange">
                          <Star size={23} />
                        </span>
                        <span>
                          <strong>{stats.feedback}</strong>
                          <small>My Feedback</small>
                        </span>
                        <ChevronRight size={21} />
                      </button>

                      <button
                        onClick={() => navigate("/my-complaints")}
                      >
                        <span className="stat-icon blue">
                          <Clock3 size={23} />
                        </span>
                        <span>
                          <strong>{stats.pending}</strong>
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
                      <strong>Privacy &amp; Security</strong>
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
                      type="submit"
                      form="profile-form"
                      disabled={saving}
                    >
                      <Save size={18} />
                      {saving ? "Saving..." : "Save Changes"}
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
                          onChange={(event) =>
                            updateField("name", event.target.value)
                          }
                          required
                          maxLength={100}
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
                          onChange={(event) =>
                            updateField("phone", event.target.value)
                          }
                          required
                          maxLength={20}
                        />
                      </span>
                    </label>

                    <label>
                      Email Address
                      <span className="input-wrap input-disabled">
                        <Mail size={20} />
                        <input
                          type="email"
                          value={profile.email}
                          readOnly
                        />
                      </span>
                    </label>

                    <label>
                      Student ID
                      <span className="input-wrap input-disabled">
                        <GraduationCap size={21} />
                        <input
                          value={profile.studentId}
                          readOnly
                        />
                      </span>
                    </label>

                    <label>
                      Department
                      <span className="input-wrap">
                        <Building2 size={20} />
                        <select
                          value={profile.department}
                          onChange={(event) =>
                            updateField(
                              "department",
                              event.target.value
                            )
                          }
                        >
                          <option value="">Select department</option>
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
                          onChange={(event) =>
                            updateField("year", event.target.value)
                          }
                        >
                          <option value="">Select year</option>
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
                          onChange={(event) =>
                            updateField("dob", event.target.value)
                          }
                        />
                      </span>
                    </label>

                    <label className="upload-label">
                      Profile Picture
                      <button
                        className="photo-upload-box"
                        type="button"
                        onClick={() =>
                          fileInput.current?.click()
                        }
                      >
                        {photo ? (
                          <img
                            src={photo}
                            alt="Selected profile"
                          />
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
                    <p>
                      Keep your account secure with these options.
                    </p>
                  </div>

                  <div className="security-row">
                    <span className="security-icon purple">
                      <Wrench size={22} />
                    </span>
                    <div>
                      <strong>Change Password</strong>
                      <small>
                        Update your password regularly for security.
                      </small>
                    </div>
                    <button
                      onClick={() =>
                        showMessage(
                          "Password change is not connected yet.",
                          "error"
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
                      <small>
                        Add an extra layer of security to your account.
                      </small>
                    </div>
                    <button
                      onClick={() =>
                        showMessage(
                          "Two-factor authentication is not implemented yet.",
                          "error"
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
                      onClick={signOut}
                    >
                      Sign Out
                    </button>
                  </div>
                </section>
              </div>
            </div>
          )}

          <footer className="profile-footer">
            <GraduationCap size={19} />
            <span>All rights reserved by SmartCampus</span>
          </footer>
        </div>
      </main>
    </div>
  );
}
