import React, { useState } from "react";
import "./register.css"; // Create this file for modal styles


const API_URL = import.meta.env.VITE_API_URL;

const Register = ({ onRegister, goToLogin }) => {
  const [showModal, setShowModal] = useState(true);
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("employee");
  const [email, setEmail] = useState("");
  const [department, setDepartment] = useState("");
  const [joining_date, setJoiningDate] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("username", username);
    formData.append("email", email);
    formData.append("department", department);
    formData.append("joining_date", joining_date);
    formData.append("role", role);
    formData.append("password", password);

    const res = await fetch(`${API_URL}create_users`, {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    if (data.message === "User created successfully!") {
      localStorage.setItem("username", username);
      localStorage.setItem("role", role);
      setShowModal(false);
      onRegister(role);
    } else {
      alert(data.message);
    }
  };

  return (
    showModal && (
      <div className="modal-overlay">
        <div className="modal-content">
          <h2>Register</h2>
            <form onSubmit={handleRegister}>
            <input placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} required />
            <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
            <input placeholder="Department" value={department} onChange={e => setDepartment(e.target.value)} required />
            <label style={{textAlign: "left", margin: "0.5em 0 0.2em 0.2em", fontWeight: "500"}}>
                Joining Date
            </label>
            <input
                type="date"
                value={joining_date}
                onChange={e => setJoiningDate(e.target.value)}
                required
            />
            <select value={role} onChange={e => setRole(e.target.value)}>
                <option value="employee">User</option>
                <option value="admin">Admin</option>
            </select>
            <input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
            <button type="submit">Register</button>
            </form>
          <button className="modal-close" onClick={goToLogin}>Go to Login</button>
        </div>
      </div>
    )
  );
};

export default Register;