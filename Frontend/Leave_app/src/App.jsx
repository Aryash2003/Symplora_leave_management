import React, { useState } from "react";
import Login from "./login";
import Register from "./register";
import UserDashboard from "./user_dashboard";
import AdminDashboard from "./admin_dashboard";

function App() {
  const [role, setRole] = useState(localStorage.getItem("role"));
  const [page, setPage] = useState("login");

  if (!role) {
    if (page === "login") {
      return <Login onLogin={setRole} goToRegister={() => setPage("register")} />;
    }
    return <Register onRegister={setRole} goToLogin={() => setPage("login")} />;
  }
  if (role === "admin") {
    return <AdminDashboard />;
  }
  return <UserDashboard />;
}

export default App;