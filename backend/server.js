const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const client = require("prom-client");
require("dotenv").config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());

// ==================
// 🔹 Prometheus Setup
// ==================
const register = new client.Registry();
client.collectDefaultMetrics({ register });

// Custom HTTP request counter
const httpRequestCounter = new client.Counter({
  name: "http_requests_total",
  help: "Total number of HTTP requests",
  labelNames: ["method", "route", "status"],
});

register.registerMetric(httpRequestCounter);

// Middleware to count requests
app.use((req, res, next) => {
  res.on("finish", () => {
    httpRequestCounter.inc({
      method: req.method,
      route: req.route ? req.route.path : req.path,
      status: res.statusCode,
    });
  });
  next();
});

// Metrics endpoint
app.get("/metrics", async (req, res) => {
  res.set("Content-Type", register.contentType);
  res.end(await register.metrics());
});

// ==================
// 🔹 MongoDB Connection
// ==================
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// ==================
// 🔹 Todo Model
// ==================
const Todo = mongoose.model("Todo", {
  title: String,
  completed: Boolean
});

// ==================
// 🔹 Routes
// ==================
app.get("/todos", async (req, res) => {
  const todos = await Todo.find();
  res.json(todos);
});

app.post("/todos", async (req, res) => {
  const todo = new Todo(req.body);
  await todo.save();
  res.json(todo);
});

// ==================
// 🔹 Start Server
// ==================
app.listen(5000, () => console.log("Backend running on port 5000"));