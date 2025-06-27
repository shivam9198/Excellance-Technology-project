const express = require("express");
const Task = require('../models/taskSchema');
const authMiddleware = require("../middleware/authMiddleware")


const taskRouter = express.Router();



taskRouter.get("/tasks", authMiddleware, async (req, res) => {
  const tasks = await Task.find({ userId: req.user.id });
  res.json(tasks);
});

// POST /tasks
taskRouter.post("/tasks", authMiddleware, async (req, res) => {
  const { title, priority, dueDate } = req.body;
  const task = new Task({
    userId: req.user.id,
    title,
    priority,
    dueDate,
  });
  await task.save();
  res.status(201).json(task);
});

// PATCH /tasks/:id
taskRouter.patch("/tasks/:id", authMiddleware, async (req, res) => {
  const task = await Task.findOneAndUpdate(
    { _id: req.params.id, userId: req.user.id },
    req.body,
    { new: true }
  );
  if (!task) return res.status(404).json({ message: "Task not found" });
  res.json(task);
});

// DELETE /tasks/:id
taskRouter.delete("/tasks/:id", authMiddleware, async (req, res) => {
  const result = await Task.deleteOne({ _id: req.params.id, userId: req.user.id });
  if (result.deletedCount === 0) {
    return res.status(404).json({ message: "Task not found or not authorized" });
  }
  res.json({ message: "Task deleted successfully" });
});

module.exports = taskRouter;