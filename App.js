import React, { useState, useEffect } from "react";
import Signup from "./Signup";
import Login from "./Login";
import Complaint from "./Complaint";
import Admin from "./Admin";
import "./App.css";

function App() {
  const [view, setView] = useState("landing");
  const [user, setUser] = useState(null);
  const [dashboardView, setDashboardView] = useState("home");

  const [analytics, setAnalytics] = useState({
    total_complaints: 0,
    pending_complaints: 0,
    solved_complaints: 0,
  });

  const fetchAnalytics = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/admin/analytics");
      const data = await res.json();
      setAnalytics(data);
    } catch (err) {
      console.log("Error fetching analytics:", err);
    }
  };

  useEffect(() => {
    if (view === "dashboard") {
      fetchAnalytics();
    }
  }, [view]);

  return (
    <div className="App">
      {/* ================= LANDING PAGE ================= */}
      {view === "landing" && (
        <div className="landing-container">
          <h1 className="landing-title">Nagrik Seva 2.0</h1>
          <p className="landing-subtitle">Smart Digital Grievance Management Platform</p>
          <button className="main-btn" onClick={() => setView("login")}>
            Get Started
          </button>
        </div>
      )}

      {/* ================= SIGNUP / LOGIN (Common Container) ================= */}
      {(view === "signup" || view === "login") && (
        <div className="auth-container">
          <h1 className="main-title">Nagrik Seva 2.0</h1>
          {view === "signup" ? (
            <>
              <Signup onSignupSuccess={() => setView("login")} />
              <p className="footer-text">
                Already have an account?{" "}
                <button onClick={() => setView("login")} className="link-btn">Login</button>
              </p>
            </>
          ) : (
            <>
              <Login
                onLoginSuccess={(name) => {
                  setUser(name);
                  setView("dashboard");
                }}
              />
              <p className="footer-text">
                New user?{" "}
                <button onClick={() => setView("signup")} className="link-btn">Signup</button>
              </p>
            </>
          )}
        </div>
      )}

     {/* ================= DASHBOARD ================= */}
{view === "dashboard" && (
  <div className="dashboard-wrapper">
    
    {/* Glassmorphism Header Box */}
    <header className="glass-header-container">
      <div className="user-welcome">
        Welcome, <b>{user}</b>
      </div>
      
      <div className="header-nav-stack">
        <button onClick={() => setDashboardView("home")}>Home</button>
        <button onClick={() => setDashboardView("complaint")}>Register Complaint</button>
        <button onClick={() => setDashboardView("admin")}>Admin Panel</button>
        {/* Logout Button inside the glass box but at the bottom of the stack */}
        <button className="logout-btn-inline" onClick={() => { setUser(null); setView("login"); }}>
          Logout
        </button>
      </div>
    </header>

    {/* Analytics Section (Horizontal line like image) */}
    <div className="analytics-row">
      <div className="stat-box blue-box">Total: {analytics.total_complaints}</div>
      <div className="stat-box yellow-box">Pending: {analytics.pending_complaints}</div>
      <div className="stat-box green-box">Solved: {analytics.solved_complaints}</div>
    </div>

    {/* Dynamic View Content */}
    <div className="dashboard-main-content">
      {dashboardView === "home" && (
        <h2 className="dashboard-title">Welcome to your Dashboard</h2>
      )}
      {dashboardView === "complaint" && <Complaint onComplaintSubmit={fetchAnalytics} />}
      {dashboardView === "admin" && <Admin refreshAnalytics={fetchAnalytics} />}
    </div>

  </div>
)}
    </div>
  );
}

export default App;