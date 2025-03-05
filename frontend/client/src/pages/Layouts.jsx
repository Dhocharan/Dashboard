import React, { useEffect, useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import axios from "axios";
import { AiOutlineHome } from "react-icons/ai";
import { FiUsers } from "react-icons/fi";
import { MdOutlineEventNote } from "react-icons/md";
import { FaProjectDiagram } from "react-icons/fa"; // Updated icon
import { RiMoneyDollarCircleLine } from "react-icons/ri";
import "./Dashboard.css";

const Layout = () => {
  const location = useLocation(); // Get current route

  // State to store summary data
  const [summary, setSummary] = useState({
    clients: 0,
    tasks: 0,
    projects: 0,
    invoices: 0,
  });

  // Fetch summary data when on home page
  useEffect(() => {
    if (location.pathname === "/") {
      axios
        .get("http://localhost:5000/api/summary")
        .then((res) => setSummary(res.data))
        .catch((err) => console.error("Error fetching summary:", err));
    }
  }, [location.pathname]);

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className="sidebar">
        <h2 id="das">Dashboard</h2>
        <nav>
          <ul>
            <li>
              <Link to="/">
                <AiOutlineHome /> Home
              </Link>
            </li>
            <li>
              <Link to="/client-management">
                <FiUsers /> Client Management
              </Link>
            </li>
            <li>
              <Link to="/task-management">
                <MdOutlineEventNote /> Task & Meeting Management
              </Link>
            </li>
            <li>
              <Link to="/project-management">
                <FaProjectDiagram /> Project Management
              </Link>
            </li>
            <li>
              <Link to="/invoice-management">
                <RiMoneyDollarCircleLine /> Invoice & Finance Management
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Show dynamic Summary only on Home page */}
        {location.pathname === "/" && (
          <>
            <h1>Summary</h1>
            <div className="summary-grid">
              <div className="summary-card">
                <h3>Clients</h3>
                <p>{summary.clients} Active Clients</p>
              </div>
              <div className="summary-card">
                <h3>Tasks & Meetings</h3>
                <p>{summary.tasks} Pending Tasks</p>
              </div>
              <div className="summary-card">
                <h3>Projects</h3>
                <p>{summary.projects} Ongoing Projects</p>
              </div>
              <div className="summary-card">
                <h3>Invoices & Finance</h3>
                <p>{summary.invoices} Invoices Generated</p>
              </div>
            </div>
          </>
        )}

        {/* Dynamic Content */}
        <div className="dynamic-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
