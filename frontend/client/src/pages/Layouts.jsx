import React, { useEffect, useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { AiOutlineHome, AiOutlineMenu } from "react-icons/ai";
import { FiUsers } from "react-icons/fi";
import { MdOutlineEventNote } from "react-icons/md";
import { FaProjectDiagram } from "react-icons/fa";
import { RiMoneyDollarCircleLine } from "react-icons/ri";
import { IoLogOutOutline } from "react-icons/io5";
import "./Dashboard.css";

const Layout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [summary, setSummary] = useState({ clients: 0, tasks: 0, projects: 0, invoices: 0 });

  useEffect(() => {
    if (location.pathname === "/") {
      axios
        .get("http://localhost:5000/api/summary")
        .then((res) => setSummary(res.data))
        .catch((err) => console.error("Error fetching summary:", err));
    }
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? "open" : "closed"}`}>
        <div className="sidebar-header">
          <h2 id="das">Dashboard</h2>
          
        </div>
        <nav>
          <ul>
            <li className={location.pathname === "/" ? "active" : ""}>
              <Link to="/">
                <AiOutlineHome /> Home
              </Link>
            </li>
            <li className={location.pathname.includes("client-management") ? "active" : ""}>
              <Link to="/client-management">
                <FiUsers /> Clients
              </Link>
            </li>
            <li className={location.pathname.includes("task-management") ? "active" : ""}>
              <Link to="/task-management">
                <MdOutlineEventNote /> Tasks & Meetings
              </Link>
            </li>
            <li className={location.pathname.includes("project-management") ? "active" : ""}>
              <Link to="/project-management">
                <FaProjectDiagram /> Projects
              </Link>
            </li>
            <li className={location.pathname.includes("invoice-management") ? "active" : ""}>
              <Link to="/invoice-management">
                <RiMoneyDollarCircleLine /> Invoices & Finance
              </Link>
            </li>
            <li>
              <button onClick={handleLogout} className="logout-btn">
                <IoLogOutOutline /> Logout
              </button>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {location.pathname === "/" && (
          <>
            <h1>Summary</h1>
            <div className="summary-grid">
              {Object.keys(summary).map((key) => (
                <div className="summary-card" key={key}>
                  <h3>{key.charAt(0).toUpperCase() + key.slice(1)}</h3>
                  <p>{summary[key]} {key === "clients" ? "Active Clients" : key === "tasks" ? "Pending Tasks" : key === "projects" ? "Ongoing Projects" : "Invoices Generated"}</p>
                </div>
              ))}
            </div>
          </>
        )}
        <div className="dynamic-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
