import React, { useState } from "react";
import "./register.css"; // Reuse modal styles

const API_URL = import.meta.env.VITE_API_URL;

const Login = ({ onLogin, goToRegister }) => {
  const [showModal, setShowModal] = useState(true);
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("employee");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    const formData = new FormData();
    formData.append("username", username);
    formData.append("password", password);

    try {
      const res = await fetch(`${API_URL}login`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok && data.message === "Login successful!") {
        localStorage.setItem("username", username);
        localStorage.setItem("role", data.user.role);
        setShowModal(false);
        onLogin(data.user.role);
      } else {
        setError(data.message || "Login failed.");
      }
    } catch (err) {
      setError("Network error. Please try again."+err.message);
    }
  };

  return (
    showModal && (
      <div className="modal-overlay">
        <div className="modal-content">
          <h2>Login</h2>
          <form onSubmit={handleLogin}>
            <input
              placeholder="Username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
            />
            <input
              placeholder="Password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            <select value={role} onChange={e => setRole(e.target.value)}>
              <option value="employee">User</option>
              <option value="admin">Admin</option>
            </select>
            <button type="submit">Login</button>
          </form>
          {error && <div style={{ color: "#ff6b6b", marginTop: "1em" }}>{error}</div>}
          <button className="modal-close" onClick={goToRegister}>Go to Register</button>
        </div>
      </div>
    )
  );
};

export default Login;