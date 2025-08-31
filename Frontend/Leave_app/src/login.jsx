import React, { useState } from "react";
import "./register.css"; // Reuse modal styles

const Login = ({ onLogin, goToRegister }) => {
  const [showModal, setShowModal] = useState(true);
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("employee");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    // You can add API call here to validate password if needed
    localStorage.setItem("username", username);
    localStorage.setItem("role", role);
    setShowModal(false);
    onLogin(role);
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
          <button className="modal-close" onClick={goToRegister}>Go to Register</button>
        </div>
      </div>
    )
  );
};

export default Login;