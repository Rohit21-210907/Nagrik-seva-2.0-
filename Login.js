import { useState } from "react";

export default function Login({ onLoginSuccess }) {
  const [u, setU] = useState({ contact: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!u.contact || !u.password) {
      alert("Please fill all fields!");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("contact", u.contact);  // ✅ FIXED
    formData.append("password", u.password);

    try {
      const response = await fetch("http://127.0.0.1:8000/login", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        alert("Login Successful!");
        onLoginSuccess(data.username); // 👈 backend se username le rahe
      } else {
        alert(data.detail || "Invalid Credentials");
      }

    } catch (error) {
      alert("Backend server not running on port 8000!");
    }

    setLoading(false);
  };

  return (
    <div className="form-box">
      <h2>Login to Nagarik Seva</h2>

      <input
        placeholder="Mobile Number"
        onChange={e => setU({ ...u, contact: e.target.value })}
      />

      <input
        type="password"
        placeholder="Password"
        onChange={e => setU({ ...u, password: e.target.value })}
      />

      <button onClick={handleLogin} disabled={loading}>
        {loading ? "Logging in..." : "Login"}
      </button>
    </div>
  );
}