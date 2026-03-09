import { useState } from "react";
import Complaint from "./Complaint";
import Admin from "./Admin";

export default function Dashboard() {

  const [activePage, setActivePage] = useState("home");
  const [isAdmin] = useState(true); // testing ke liye

  return (
    <div className="dashboard-container">

      <h1 className="dashboard-title">Nagrik Seva 2.0 Dashboard</h1>

      {/* Navigation Buttons */}
      <div className="dashboard-nav">
        <button onClick={() => setActivePage("home")}>
          Home
        </button>

        <button onClick={() => setActivePage("complaint")}>
          Register Complaint
        </button>

        {isAdmin && (
          <button onClick={() => setActivePage("admin")}>
            Admin Panel
          </button>
        )}
      </div>

      {/* Dynamic Content Section */}
      <div className="dashboard-content">

        {activePage === "home" && (
          <div>
            <h2>Welcome to Nagrik Seva 2.0</h2>
            <p>
              You can register complaints and track their status easily.
            </p>
          </div>
        )}

        {activePage === "complaint" && (
          <Complaint />
        )}

        {activePage === "admin" && isAdmin && (
          <Admin />
        )}

      </div>

    </div>
  );
}