import axios from "axios";
import { useState } from "react";
import {
  GraduationCap,
  ArrowLeft,
  Mail,
  LockKeyhole,
  Eye,
  EyeOff,
  UserRound,
  Phone,
  ShieldCheck,
  Zap,
  Users,
  ArrowRight,
  Landmark,
} from "lucide-react";
import { Link } from "react-router-dom";
import "./Login.css";

export default function Login() {
  const [mode, setMode] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState("");

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
    remember: true,
  });

  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
    password: "",
    confirmPassword: "",
    agree: true,
  });

  const updateLogin = (e) => {
    const { name, value, checked, type } = e.target;
    setLoginData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const updateRegister = (e) => {
    const { name, value, checked, type } = e.target;
    setRegisterData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  

const handleLogin = async (e) => {
  e.preventDefault();
  setMessage("");

  try {
    const response = await axios.post(
      "http://localhost:5000/api/auth/login",
      {
        email: loginData.email,
        password: loginData.password,
      }
    );

    const { token, user } = response.data;

    // Check that the server returned valid login details
    if (!token || !user?.id || !user?.role) {
      setMessage("Invalid login response from server. Please try again.");
      return;
    }

    // Save authentication token and user details
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));

    // Redirect after successful login
    window.location.href = "/dashboard";
  } catch (error) {
    setMessage(
      error.response?.data?.message ||
        error.message ||
        "Login failed. Please check your credentials and backend."
    );
  }
};

const handleRegister = async (e) => {
  e.preventDefault();
  setMessage("");

  if (registerData.password !== registerData.confirmPassword) {
    setMessage("Passwords do not match.");
    return;
  }

  if (!registerData.agree) {
    setMessage("Please accept the Terms & Conditions.");
    return;
  }

  try {
    const response = await axios.post(
      "http://localhost:5000/api/auth/register",
      {
        name: registerData.name,
        email: registerData.email,
        phone: registerData.phone,
        role: registerData.role,
        password: registerData.password,
        confirmPassword: registerData.confirmPassword,
      }
    );

    // Registration succeeded; do not log the user in automatically
    if (!response.data.user?.id || !response.data.token) {
      setMessage(
        "Account created, but the server returned incomplete details."
      );
      return;
    }

    // Clear any stored session so the user must log in
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Show success message and switch to login form
    setRegisterData({
      name: "",
      email: "",
      phone: "",
      role: "",
      password: "",
      confirmPassword: "",
      agree: true,
    });

    setLoginData((prev) => ({
      ...prev,
      email: registerData.email,
      password: "",
    }));

    setMode("login");
    setShowPassword(false);
    setShowConfirmPassword(false);
    setMessage("Registration successful! Please log in with your new account.");

    window.scrollTo({ top: 0, behavior: "smooth" });
  } catch (error) {
    setMessage(
      error.response?.data?.message ||
        error.message ||
        "Registration failed. Please check whether the backend is running."
    );
  }
};


  const toggleMode = (nextMode) => {
    setMode(nextMode);
    setMessage("");
    setShowPassword(false);
    setShowConfirmPassword(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className="auth-page">
      <div className="auth-background" />

      <header className="auth-header">
        <Link to="/" className="auth-brand">
          <GraduationCap size={43} />
          <span>
            <strong>SmartCampus</strong>
            <small>Complaint Management System</small>
          </span>
        </Link>

        <Link to="/" className="auth-back">
          <ArrowLeft size={19} />
          Back to Home
        </Link>
      </header>

      <section className={`auth-content ${mode === "register" ? "register-mode" : ""}`}>
        <article className="auth-panel">
          {mode === "login" ? (
            <>
              <div className="auth-form-heading">
                <h1>
                  Welcome <span>Back!</span>
                </h1>
                <p>
                  Login to your student account and help us make our campus better.
                </p>
              </div>

              <form onSubmit={handleLogin}>
                <label className="auth-input">
                  <Mail size={21} />
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={loginData.email}
                    onChange={updateLogin}
                    autoComplete="email"
                    required
                  />
                </label>

                <label className="auth-input">
                  <LockKeyhole size={21} />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Enter your password"
                    value={loginData.password}
                    onChange={updateLogin}
                    autoComplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    className="auth-eye"
                    aria-label="Toggle password visibility"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </label>

                <div className="auth-form-options">
                  <label className="auth-check">
                    <input
                      type="checkbox"
                      name="remember"
                      checked={loginData.remember}
                      onChange={updateLogin}
                    />
                    <span>Remember me</span>
                  </label>

                  <button
                    type="button"
                    className="auth-text-button"
                    onClick={() => setMessage("Password reset is not connected yet.")}
                  >
                    Forgot Password?
                  </button>
                </div>

                <button type="submit" className="auth-primary-button">
                  Login <ArrowRight size={21} />
                </button>
              </form>

              <div className="auth-divider"><span>OR</span></div>

              <div className="auth-alternatives">
                <button
                  type="button"
                  onClick={() => setMessage("Google sign-in is not connected yet.")}
                >
                  <span className="auth-google">G</span>
                  Continue with Google
                </button>
                <button
                  type="button"
                  onClick={() => setMessage("University ID login is not connected yet.")}
                >
                  <Landmark size={20} />
                  Login with University ID
                </button>
              </div>

              <p className="auth-switch">
                Don’t have an account?
                <button type="button" onClick={() => toggleMode("register")}>
                  Register Now
                </button>
              </p>
            </>
          ) : (
            <>
              <div className="auth-form-heading">
                <h1>
                  Create Your <span>Account</span>
                </h1>
                <p>
                  Join SmartCampus and be a part of a safer, cleaner, and smarter campus.
                </p>
              </div>

              <form onSubmit={handleRegister}>
                <label className="auth-input">
                  <UserRound size={21} />
                  <input
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    value={registerData.name}
                    onChange={updateRegister}
                    autoComplete="name"
                    required
                  />
                </label>

                <label className="auth-input">
                  <Mail size={21} />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    value={registerData.email}
                    onChange={updateRegister}
                    autoComplete="email"
                    required
                  />
                </label>

                <label className="auth-input">
                  <Phone size={21} />
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone Number"
                    value={registerData.phone}
                    onChange={updateRegister}
                    autoComplete="tel"
                    required
                  />
                </label>

                <label className="auth-input">
                  <GraduationCap size={21} />
                  <select
                    name="role"
                    value={registerData.role}
                    onChange={updateRegister}
                    required
                  >
                    <option value="">Select Your Role</option>
                    <option value="student">Student</option>
                    <option value="faculty">Faculty</option>
                  </select>
                </label>

                <label className="auth-input">
                  <LockKeyhole size={21} />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Create Password"
                    value={registerData.password}
                    onChange={updateRegister}
                    autoComplete="new-password"
                    minLength={8}
                    required
                  />
                  <button
                    type="button"
                    className="auth-eye"
                    aria-label="Toggle password visibility"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </label>

                <label className="auth-input">
                  <LockKeyhole size={21} />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    value={registerData.confirmPassword}
                    onChange={updateRegister}
                    autoComplete="new-password"
                    minLength={8}
                    required
                  />
                  <button
                    type="button"
                    className="auth-eye"
                    aria-label="Toggle confirm password visibility"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </label>

                <label className="auth-check auth-terms">
                  <input
                    type="checkbox"
                    name="agree"
                    checked={registerData.agree}
                    onChange={updateRegister}
                  />
                  <span>
                    I agree to the <a href="#terms">Terms &amp; Conditions</a> and{" "}
                    <a href="#privacy">Privacy Policy</a>
                  </span>
                </label>

                <button type="submit" className="auth-primary-button">
                  Create Account <ArrowRight size={21} />
                </button>
              </form>

              <div className="auth-divider"><span>OR</span></div>

              <div className="auth-alternatives">
                <button
                  type="button"
                  onClick={() => setMessage("Google sign-up is not connected yet.")}
                >
                  <span className="auth-google">G</span>
                  Continue with Google
                </button>
                <button
                  type="button"
                  onClick={() => setMessage("University ID registration is not connected yet.")}
                >
                  <Landmark size={20} />
                  Signup with University ID
                </button>
              </div>

              <p className="auth-switch">
                Already have an account?
                <button type="button" onClick={() => toggleMode("login")}>
                  Login Now
                </button>
              </p>
            </>
          )}
        </article>
      </section>

      {message && (
        <div className="auth-message" role="status">
          <span>{message}</span>
          <button type="button" onClick={() => setMessage("")} aria-label="Close message">
            ×
          </button>
        </div>
      )}

      <footer className="auth-benefits">
        <div>
          <span className="auth-benefit-icon safe"><ShieldCheck size={26} /></span>
          <strong>{mode === "login" ? "Safe & Secure" : "Verified Students"}</strong>
          <p>
            {mode === "login"
              ? "Your data is protected and confidential."
              : "Only registered students can submit complaints."}
          </p>
        </div>
        <div>
          <span className="auth-benefit-icon quick"><Zap size={26} /></span>
          <strong>{mode === "login" ? "Quick Access" : "Easy Registration"}</strong>
          <p>
            {mode === "login"
              ? "Access your complaints anytime, anywhere."
              : "Get started in just a few steps."}
          </p>
        </div>
        <div>
          <span className="auth-benefit-icon people"><Users size={26} /></span>
          <strong>{mode === "login" ? "Student Centric" : "Make a Difference"}</strong>
          <p>
            {mode === "login"
              ? "Built for a better campus experience."
              : "Your voice helps build a better campus."}
          </p>
        </div>
      </footer>
    </main>
  );
}
