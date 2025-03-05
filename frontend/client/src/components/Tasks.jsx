import { useState, useEffect } from "react";
import axios from "axios";
import "./Tasks.css"; // Import the updated CSS file

const Tasks = () => {
  const taskPriorities = ["High", "Medium", "Low"];
  const taskStatuses = ["Completed", "Cancelled", "Not Started", "In Progress", "Deferred", "On Hold"];

  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: "", description: "", priority: "", status: "" });
  const [editTask, setEditTask] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  // Fetch tasks from backend
  const fetchTasks = async () => {
    const { data } = await axios.get("http://localhost:5000/tasks");
    setTasks(data);
  };

  // Add or update task
  const saveTask = async () => {
    if (!newTask.title || !newTask.description || !newTask.priority || !newTask.status) {
      alert("Please fill all fields!");
      return;
    }

    if (editTask) {
      await axios.put(`http://localhost:5000/tasks/${editTask._id}`, newTask);
    } else {
      await axios.post("http://localhost:5000/tasks", newTask);
    }

    fetchTasks();
    setNewTask({ title: "", description: "", priority: "", status: "" });
    setEditTask(null);
  };

  // Edit task
  const editSelectedTask = (task) => {
    setNewTask(task);
    setEditTask(task);
  };

  // Delete task
  const deleteTask = async (id) => {
    await axios.delete(`http://localhost:5000/tasks/${id}`);
    fetchTasks();
  };

  return (
    <div className="tasks-container">
      <h2>Task & Meeting Management</h2>

      {/* Task Form */}
      <div className="task-form">
        <input type="text" name="title" value={newTask.title} onChange={(e) => setNewTask({ ...newTask, title: e.target.value })} placeholder="Task Title" />
        <input type="text" name="description" value={newTask.description} onChange={(e) => setNewTask({ ...newTask, description: e.target.value })} placeholder="Task Description" />

        <select name="priority" value={newTask.priority} onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}>
          <option value="">Select Priority</option>
          {taskPriorities.map((priority, index) => (
            <option key={index} value={priority}>{priority}</option>
          ))}
        </select>

        <select name="status" value={newTask.status} onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}>
          <option value="">Select Status</option>
          {taskStatuses.map((status, index) => (
            <option key={index} value={status}>{status}</option>
          ))}
        </select>

        <button onClick={saveTask}>{editTask ? "Update Task" : "Add Task"}</button>
      </div>

      {/* Tasks Table */}
      <table className="tasks-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Priority</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.length > 0 ? (
            tasks.map((task, index) => (
              <tr key={index}>
                <td>{task.title}</td>
                <td>{task.description}</td>
                <td>{task.priority}</td>
                <td>{task.status}</td>
                <td>
                  <button className="edit-btn" onClick={() => editSelectedTask(task)}>Edit</button>
                  <button className="delete-btn" onClick={() => deleteTask(task._id)}>Delete</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="no-data">No tasks added yet</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Tasks;
