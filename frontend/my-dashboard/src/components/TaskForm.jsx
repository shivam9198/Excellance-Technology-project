import React, { useState } from "react";
import { Card, CardContent, Button, Input } from "../components/Button";

function TaskForm({ newTask, setNewTask, onCreate }) {
  return (
    <div className="flex gap-2 mb-4 flex-wrap">
      <Input
        placeholder="Enter new task"
        value={newTask.title}
        onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
      />
      <select
        className="border rounded px-2"
        value={newTask.priority}
        onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
      >
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>
      <Button onClick={onCreate}>Add Task</Button>
    </div>
  );
}
export default TaskForm;