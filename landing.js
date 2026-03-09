import React from "react";

export default function Landing({ goNext }) {
  return (
    <div className="landing-container">
      <div className="hero-content">

        <h1 className="hero-title">Nagrik Seva 2.0</h1>

        <h2> className="hero-subtitle"
          Smart Digital Grievance Management Platform
        </h2>

        <button className="hero-btn" onClick={goNext}>
          Get Started →
        </button>

      </div>
    </div>
  );
} 