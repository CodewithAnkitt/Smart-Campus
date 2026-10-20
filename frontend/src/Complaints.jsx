
import { useEffect, useState } from "react";
import axios from "axios";
import { ClipboardList, Send, RefreshCw } from "lucide-react";
import "./Complaints.css";

const API_URL = "http://localhost:5000/api/complaints";

const initialForm = {
  title: "",
  description: "",
  category: "Electricity",
  location: "",
};

export default function Complaints() {
  const [form, setForm] = useState(initialForm);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function loadComplaints() {
    setLoading(true);
    setError("");

    try {
      const response = await axios.get(API_URL);
      setComplaints(response.data.complaints);
    } catch {
      setError("Could not load complaints. Check that the backend is running.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadComplaints();
  }, []);

  function handleChange(event) {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");
    setError("");
    setSubmitting(true);

    try {
      const response = await axios.post(API_URL, form);

      setMessage(response.data.message);
      setForm(initialForm);

      await loadComplaints();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to submit the complaint. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="complaints-page">
      <header className="complaints-header">
        <a href="/" className="complaints-brand">
          SmartCampus
        </a>
        <a href="/" className="back-home">
          Back to Home
        </a>
      </header>

      <section className="complaints-intro">
        <span className="complaints-eyebrow">CAMPUS SUPPORT</span>
        <h1>Report an Issue</h1>
        <p>
          Tell us about a campus problem and track its progress
          from one place.
        </p>
      </section>

      <section className="complaints-layout">
        <div className="complaint-form-card">
          <h2>
            <Send size={20} /> Submit a Complaint
          </h2>

          {message && (
            <p className="notice success" role="status">
              {message}
            </p>
          )}

          {error && (
            <p className="notice error" role="alert">
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit}>
            <label htmlFor="title">Complaint Title</label>
            <input
              id="title"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g. Internet not working"
              maxLength={120}
              required
            />

            <label htmlFor="category">Category</label>
            <select
              id="category"
              name="category"
              value={form.category}
              onChange={handleChange}
              required
            >
              <option>Electricity</option>
              <option>Water</option>
              <option>Cleanliness</option>
              <option>Internet</option>
              <option>Classroom</option>
               <option>Faculty</option>
              <option>Other</option>
            </select>

            <label htmlFor="location">Campus Location</label>
            <input
              id="location"
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder="e.g. Block A, Room 204"
              maxLength={150}
              required
            />

            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Describe the issue in detail..."
              maxLength={2000}
              rows={5}
              required
            />

            <button
              className="submit-complaint"
              type="submit"
              disabled={submitting}
            >
              <Send size={17} />
              {submitting ? "Submitting..." : "Submit Complaint"}
            </button>
          </form>
        </div>

        <div className="complaint-list-card">
          <div className="complaint-list-heading">
            <h2>
              <ClipboardList size={21} /> Recent Complaints
            </h2>

            <button
              className="refresh-button"
              onClick={loadComplaints}
              disabled={loading}
              type="button"
              aria-label="Refresh complaints"
              title="Refresh complaints"
            >
              <RefreshCw size={17} />
            </button>
          </div>

          {loading ? (
            <p className="empty-state">Loading complaints...</p>
          ) : complaints.length === 0 ? (
            <div className="empty-state">
              <ClipboardList size={35} />
              <p>No complaints yet.</p>
              <span>Your submitted complaints will appear here.</span>
            </div>
          ) : (
            <div className="complaint-list">
              {complaints.map((complaint) => (
                <article
                  className="complaint-item"
                  key={complaint._id}
                >
                  <div className="complaint-item-top">
                    <h3>{complaint.title}</h3>
                    <span
                      className={`status status-${complaint.status
                        .toLowerCase()
                        .replace(/\s+/g, "-")}`}
                    >
                      {complaint.status}
                    </span>
                  </div>

                  <span className="complaint-category">
                    {complaint.category}
                  </span>

                  <p>{complaint.description}</p>
                  <span className="complaint-location">
                    Location: {complaint.location}
                  </span>

                  <small>
                    Submitted:{" "}
                    {new Date(complaint.createdAt).toLocaleString()}
                  </small>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <footer className="complaints-footer">
         All Right Reserved By SmartCampus.
      </footer>
    </main>
  );
}
