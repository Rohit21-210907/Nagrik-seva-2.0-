import { useState, useEffect } from "react";

export default function Admin() {
  const [complaints, setComplaints] = useState([]);
  const [analytics, setAnalytics] = useState({
    total_complaints: 0,
    pending_complaints: 0,
    solved_complaints: 0,
  });

  const fetchComplaints = async () => {
    const response = await fetch("http://127.0.0.1:8000/admin/complaints");
    const data = await response.json();
    setComplaints(data);
  };

  const fetchAnalytics = async () => {
    const response = await fetch("http://127.0.0.1:8000/admin/analytics");
    const data = await response.json();
    setAnalytics(data);
  };

  const markAsSolved = async (id) => {
    await fetch(`http://127.0.0.1:8000/admin/update-status/${id}`, {
      method: "PUT",
    });
    fetchComplaints();
    fetchAnalytics();
  };

  useEffect(() => {
    fetchComplaints();
    fetchAnalytics();
  }, []);

  return (
    <div style={{ marginTop: "30px" }}>
      <h2>Admin Dashboard</h2>

      {/* Analytics Section */}
      <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
        <div style={{ padding: "10px", background: "#eee" }}>
          <h4>Total</h4>
          <p>{analytics.total_complaints}</p>
        </div>
        <div style={{ padding: "10px", background: "#ffe0b2" }}>
          <h4>Pending</h4>
          <p>{analytics.pending_complaints}</p>
        </div>
        <div style={{ padding: "10px", background: "#c8e6c9" }}>
          <h4>Solved</h4>
          <p>{analytics.solved_complaints}</p>
        </div>
      </div>

      {/* Complaints Table */}
      <table border="1" cellPadding="10" style={{ width: "100%" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Description</th>
            <th>Status</th>
            <th>Image</th>
            <th>Department</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {complaints.map((c) => (
            <tr key={c.id}>
              <td>{c.id}</td>
              <td>{c.title}</td>
              <td>{c.description}</td>
              <td>{c.department}</td>
              <td style={{ fontWeight: "bold", color: c.status === "Solved" ? "green" : "orange" }}>
                {c.status}
              </td>
              <td>
                {c.image_path ? (
                  <img
                    src={`http://127.0.0.1:8000/${c.image_path}`}
                    alt="proof"
                    width="80"
                  />
                ) : "No Image"}
              </td>
              <td>

                {c.status === "Pending" && (
                  <button onClick={() => markAsSolved(c.id)}>
                    Mark as Solved
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}