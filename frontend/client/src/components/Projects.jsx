import { useEffect, useState } from "react";
import axios from "axios";
import "./Projects.css"; // Import the CSS file

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [newProject, setNewProject] = useState({ title: "", status: "Not Started" });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    const res = await axios.get("http://localhost:5000/api/projects");
    setProjects(res.data);
  };

  const handleAddProject = async () => {
    if (!newProject.title) {
      alert("Please enter a project title!");
      return;
    }
    const res = await axios.post("http://localhost:5000/api/projects", newProject);
    setProjects([...projects, res.data]);
    setNewProject({ title: "", status: "Not Started" });
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:5000/api/projects/${id}`);
    setProjects(projects.filter((p) => p._id !== id));
  };

  const handleUpdate = async (id, updatedStatus) => {
    const res = await axios.put(`http://localhost:5000/api/projects/${id}`, { status: updatedStatus });
    setProjects(projects.map((p) => (p._id === id ? res.data : p)));
  };

  return (
    <div className="projects-container">
      <h2>Project Management</h2>
      <div className="project-form">
        <input
          type="text"
          placeholder="Project Title"
          value={newProject.title}
          onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
        />
        <button onClick={handleAddProject}>Add Project</button>
      </div>

      <ul className="projects-list">
        {projects.map((project) => (
          <li key={project._id} className="project-item">
            <span>{project.title} - {project.status}</span>
            <div>
              <select onChange={(e) => handleUpdate(project._id, e.target.value)} value={project.status}>
                <option value="Not Started">Not Started</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
              <button className="delete-btn" onClick={() => handleDelete(project._id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Projects;
