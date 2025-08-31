import React, { useState, useEffect } from "react";

const API_URL = import.meta.env.VITE_API_URL;

const UserDashboard = () => {
  const username = localStorage.getItem("username");
  const [leaveBalance, setLeaveBalance] = useState(0);
  const [leaves, setLeaves] = useState([]);
  const [form, setForm] = useState({ start_date: "", end_date: "", reason: "" });

  useEffect(() => {
    fetch(`${API_URL}get_leave_bal?username=${username}`)
      .then(res => res.json())
      .then(data => setLeaveBalance(data.leave_balance));
    fetch(`${API_URL}show_leaves`)
      .then(res => res.json())
      .then(data => setLeaves(data.leaves.filter(l => l.username === username)));
  }, [username]);

  const applyLeave = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("username", username);
    formData.append("start_date", form.start_date);
    formData.append("end_date", form.end_date);
    formData.append("reason", form.reason);

    const res = await fetch(`${API_URL}apply_leave`, {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    alert(data.message);
    window.location.reload();
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <div>
      <button style={{ float: "right" }} onClick={handleLogout}>Logout</button>
      <h2>Leave Balance: {leaveBalance}</h2>
      <form onSubmit={applyLeave}>
        <input placeholder="Start Date" value={form.start_date} onChange={e => setForm({ ...form, start_date: e.target.value })} required />
        <input placeholder="End Date" value={form.end_date} onChange={e => setForm({ ...form, end_date: e.target.value })} required />
        <input placeholder="Reason" value={form.reason} onChange={e => setForm({ ...form, reason: e.target.value })} required />
        <button type="submit">Apply Leave</button>
      </form>
      <h3>My Leaves</h3>
      <table>
        <thead>
          <tr>
            <th>Start</th>
            <th>End</th>
            <th>Reason</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {leaves.map(l => (
            <tr key={l.leave_id}>
              <td>{l.start_date}</td>
              <td>{l.end_date}</td>
              <td>{l.reason}</td>
              <td>{l.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserDashboard;