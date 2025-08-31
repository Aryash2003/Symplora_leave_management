import React, { useState, useEffect } from "react";
const API_URL = import.meta.env.VITE_API_URL;

const AdminDashboard = () => {
  const [leaves, setLeaves] = useState([]);
  const [cancelUser, setCancelUser] = useState("");

  useEffect(() => {
    fetch(`${API_URL}show_leaves`)
      .then(res => res.json())
      .then(data => setLeaves(data.leaves));
  }, []);

  const updateLeave = async (leave_id, status) => {
    const formData = new FormData();
    formData.append("leave_id", leave_id);
    formData.append("status", status);
    await fetch(`${API_URL}update_leave_balance`, {
      method: "POST",
      body: formData,
    });
    window.location.reload();
  };

  const cancelAllLeaves = async () => {
    const formData = new FormData();
    formData.append("username", cancelUser);
    await fetch(`${API_URL}cancel_all_leave`, {
      method: "POST",
      body: formData,
    });
    window.location.reload();
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <div>
      <button style={{ float: "right" }} onClick={handleLogout}>Logout</button>
      <h2>All Leave Requests</h2>
      <table>
        <thead>
          <tr>
            <th>User</th>
            <th>Start</th>
            <th>End</th>
            <th>Reason</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {leaves.map(l => (
            <tr key={l.leave_id}>
              <td>{l.username}</td>
              <td>{l.start_date}</td>
              <td>{l.end_date}</td>
              <td>{l.reason}</td>
              <td>{l.status}</td>
              <td>
                <button onClick={() => updateLeave(l.leave_id, "approved")}>Approve</button>
                <button onClick={() => updateLeave(l.leave_id, "rejected")}>Reject</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <h3>Cancel All Leaves for User</h3>
      <input placeholder="Username" value={cancelUser} onChange={e => setCancelUser(e.target.value)} />
      <button onClick={cancelAllLeaves}>Cancel All</button>
    </div>
  );
};

export default AdminDashboard;