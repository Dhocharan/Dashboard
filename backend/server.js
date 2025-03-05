require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("MongoDB Connection Error:", err));

// =============================
// User Schema (For Authentication)
// =============================
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
});

const User = mongoose.model("User", userSchema);

// =============================
// Authentication Routes (Login & Register)
// =============================

// Register User
app.post("/api/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });

  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Login User
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    console.log("Login Attempt:", email); // Debugging

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // Generate JWT Token
    const token = jwt.sign({ id: user._id }, "yourSecretKey", { expiresIn: "1h" });

    console.log("Login Success:", email); // Debugging
    res.json({ token, message: "Login successful" });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ error: "Server Error" });
  }
});


// =============================
// Client Schema & Routes
// =============================
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

// =============================
// Task Schema & Routes
// =============================
const taskSchema = new mongoose.Schema({
  title: String,
  description: String,
  priority: String,
  status: String,
});

const Task = mongoose.model("Task", taskSchema);

// Get all tasks
app.get("/api/tasks", async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Add a new task
app.post("/api/tasks", async (req, res) => {
  try {
    const newTask = new Task(req.body);
    await newTask.save();
    res.json(newTask);
  } catch (error) {
    res.status(400).json({ error: "Invalid request" });
  }
});

// =============================
// Project Schema & Routes
// =============================
const projectSchema = new mongoose.Schema({
  title: String,
  status: { type: String, default: "Not Started" },
});

const Project = mongoose.model("Project", projectSchema);

// Get all projects
app.get("/api/projects", async (req, res) => {
  try {
    const projects = await Project.find();
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Add a new project
app.post("/api/projects", async (req, res) => {
  try {
    const newProject = new Project(req.body);
    await newProject.save();
    res.json(newProject);
  } catch (error) {
    res.status(400).json({ error: "Invalid request" });
  }
});

// =============================
// Invoice Schema & Routes
// =============================
const invoiceSchema = new mongoose.Schema({
  amount: Number,
  status: String,
});

const Invoice = mongoose.model("Invoice", invoiceSchema);

// Get all invoices
app.get("/api/invoices", async (req, res) => {
  try {
    const invoices = await Invoice.find();
    res.json(invoices);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Add a new invoice
app.post("/api/invoices", async (req, res) => {
  try {
    const newInvoice = new Invoice(req.body);
    await newInvoice.save();
    res.json(newInvoice);
  } catch (error) {
    res.status(400).json({ error: "Invalid request" });
  }
});

// =============================
// Summary API
// =============================
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

// =============================
// Start Server
// =============================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
