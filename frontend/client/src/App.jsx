import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./pages/Layouts";
import Clients from "./components/Clients";
import Tasks from "./components/Tasks";
import Projects from "./components/Projects";
import Invoices from "./components/Invoices";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<div />} /> {/* Empty element to show summary */}
          <Route path="client-management" element={<Clients />} />
          <Route path="task-management" element={<Tasks />} />
          <Route path="project-management" element={<Projects />} />
          <Route path="invoice-management" element={<Invoices />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
