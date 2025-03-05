require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const ClientSchema = new mongoose.Schema({
  name: String,
  type: String,
  source: String,
  priority: String,
  status: String,
});

const Client = mongoose.model("Client", ClientSchema);

// Get all clients
app.get("/api/clients", async (req, res) => {
  try {
    const clients = await Client.find();
    res.json(clients);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Add a new client
app.post("/api/clients", async (req, res) => {
  try {
    const newClient = new Client(req.body);
    await newClient.save();
    res.json(newClient);
  } catch (error) {
    res.status(400).json({ error: "Invalid request" });
  }
});

// Update client
app.put("/api/clients/:id", async (req, res) => {
  try {
    const updatedClient = await Client.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedClient);
  } catch (error) {
    res.status(400).json({ error: "Failed to update client" });
  }
});

// Delete client
app.delete("/api/clients/:id", async (req, res) => {
  try {
    await Client.findByIdAndDelete(req.params.id);
    res.json({ message: "Client deleted" });
  } catch (error) {
    res.status(400).json({ error: "Failed to delete client" });
  }
});

// Task Schema
const taskSchema = new mongoose.Schema({
    title: String,
    description: String,
    priority: String,
    status: String,
  });
  
  const Task = mongoose.model("Task", taskSchema);
  
  // Routes
  
  // Get all tasks
  app.get("/tasks", async (req, res) => {
    const tasks = await Task.find();
    res.json(tasks);
  });
  
  // Add a task
  app.post("/tasks", async (req, res) => {
    const newTask = new Task(req.body);
    await newTask.save();
    res.json(newTask);
  });
  
  // Update a task
  app.put("/tasks/:id", async (req, res) => {
    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedTask);
  });
  
  // Delete a task
  app.delete("/tasks/:id", async (req, res) => {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: "Task deleted" });
  });
  
  
  const projectSchema = new mongoose.Schema({
    title: String,
    status: { type: String, default: "Not Started" },
  });
  
  const Project = mongoose.model("Project", projectSchema);
  
  // API Routes
  
  // Get all projects
  app.get("/api/projects", async (req, res) => {
    const projects = await Project.find();
    res.json(projects);
  });
  
  // Add a new project
  app.post("/api/projects", async (req, res) => {
    const newProject = new Project(req.body);
    await newProject.save();
    res.json(newProject);
  });
  
  // Update project
  app.put("/api/projects/:id", async (req, res) => {
    const updatedProject = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedProject);
  });
  
  // Delete a project
  app.delete("/api/projects/:id", async (req, res) => {
    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: "Project deleted" });
  });


  // Invoice Schema
const invoiceSchema = new mongoose.Schema({
    amount: Number,
    status: String,
  });
  
  const Invoice = mongoose.model("Invoice", invoiceSchema);
  
  // CRUD Routes
  
  // Fetch all invoices
  app.get("/api/invoices", async (req, res) => {
    const invoices = await Invoice.find();
    res.json(invoices);
  });
  
  // Add new invoice
  app.post("/api/invoices", async (req, res) => {
    const newInvoice = new Invoice(req.body);
    await newInvoice.save();
    res.json(newInvoice);
  });
  
  // Delete invoice
  app.delete("/api/invoices/:id", async (req, res) => {
    await Invoice.findByIdAndDelete(req.params.id);
    res.json({ message: "Invoice deleted" });
  });

  app.get("/api/summary", async (req, res) => {
    try {
      const clients = await Client.countDocuments();
      const tasks = await Task.countDocuments();
      const projects = await Project.countDocuments();
      const invoices = await Invoice.countDocuments();
      res.json({ clients, tasks, projects, invoices });
    } catch (error) {
      res.status(500).json({ error: "Error fetching summary data" });
    }
  });
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
