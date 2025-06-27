import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Card, Button, CardContent } from "../components/Button";
import TaskForm from "../components/TaskForm";
import baseurl from "../utils/baseurl";

function Dashboard() {
  const navigate = useNavigate();

  // ✅ Get user only from localStorage
  const [user] = useState(() =>
    JSON.parse(localStorage.getItem("user")) || null
  );

  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: "", priority: "low" });
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("none");
  const [searchQuery, setSearchQuery] = useState("");
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editingData, setEditingData] = useState({ title: "", priority: "low", dueDate: "" });

  useEffect(() => {
    if (!user) {
      // localStorage.removeItem("user");
      navigate("/");
    } else {
      fetchTasks();
    }
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await axios.get(baseurl + "/tasks", { withCredentials: true });
      setTasks(res.data);
    } catch (err) {
      console.error("Error fetching tasks:", err);
      localStorage.removeItem("user");
      navigate("/");
    }
  };

  const handleCreateTask = async () => {
    if (!newTask.title) return;
    const res = await axios.post(baseurl + "/tasks", newTask, { withCredentials: true });
    setTasks([...tasks, res.data]);
    setNewTask({ title: "", priority: "low" });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      await axios.delete(`${baseurl}/tasks/${id}`, { withCredentials: true });
      setTasks(tasks.filter((task) => task._id !== id));
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "completed" ? "pending" : "completed";
    const res = await axios.patch(`${baseurl}/tasks/${id}`, { status: newStatus }, { withCredentials: true });
    setTasks(tasks.map((t) => (t._id === id ? res.data : t)));
  };

  const handleSaveEdit = async (id) => {
    const res = await axios.patch(`${baseurl}/tasks/${id}`, editingData, { withCredentials: true });
    setTasks(tasks.map((t) => (t._id === id ? res.data : t)));
    setEditingTaskId(null);
    setEditingData({ title: "", priority: "low", dueDate: "" });
  };

  const handleStartEdit = (task) => {
    setEditingTaskId(task._id);
    setEditingData({
      title: task.title,
      priority: task.priority,
      dueDate: task.dueDate?.slice(0, 10) || ""
    });
  };

  const handleCancelEdit = () => {
    setEditingTaskId(null);
    setEditingData({ title: "", priority: "low", dueDate: "" });
  };

  const handleLogout = async () => {
    await axios.post(baseurl + "/logout", {}, { withCredentials: true });
    localStorage.removeItem("user");
    navigate("/");
  };

  const filteredTasks = tasks
    .filter((task) =>
      (filterStatus === "all" ? true : task.status === filterStatus) &&
      task.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "priority") {
        const levels = { high: 3, medium: 2, low: 1 };
        return levels[b.priority] - levels[a.priority];
      } else if (sortBy === "dueDate") {
        return new Date(a.dueDate) - new Date(b.dueDate);
      }
      return 0;
    });

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center shadow-md">
        <h2 className="text-xl font-bold">Hello, {user?.username || "User"}</h2>
        <div className="flex gap-4">
          <Button className="bg-red-500 hover:bg-red-600" onClick={handleLogout}>Logout</Button>
        </div>
      </nav>

      <div className="p-4 max-w-4xl mx-auto">
        <h1 className="text-3xl font-semibold mb-4 text-center">Your Task Dashboard</h1>

        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <input
            type="text"
            placeholder="Search tasks..."
            className="border px-3 py-2 rounded w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <select className="border px-3 py-2 rounded sm:w-48" onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
          <select className="border px-3 py-2 rounded sm:w-48" onChange={(e) => setSortBy(e.target.value)}>
            <option value="none">Sort By</option>
            <option value="priority">Priority</option>
            <option value="dueDate">Due Date</option>
          </select>
        </div>

        <TaskForm newTask={newTask} setNewTask={setNewTask} onCreate={handleCreateTask} />

        <div className="grid gap-4 mt-6">
          {filteredTasks.map((task) => (
            <Card
              key={task._id}
              className={`border-l-4 ${task.status === "completed" ? "border-green-500" : "border-yellow-500"} bg-white shadow-sm rounded-lg`}
            >
              <CardContent className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-4 px-3 gap-3">
                <div className="flex items-start gap-2 w-full">
                  <input
                    type="checkbox"
                    checked={task.status === "completed"}
                    onChange={() => handleToggleStatus(task._id, task.status)}
                  />

                  <div className="w-full">
                    {editingTaskId === task._id ? (
                      <>
                        <input
                          className="text-lg font-semibold w-full border-b mb-1"
                          value={editingData.title}
                          onChange={(e) => setEditingData({ ...editingData, title: e.target.value })}
                        />
                        <input
                          type="date"
                          className="w-full border-b mb-1"
                          value={editingData.dueDate}
                          onChange={(e) => setEditingData({ ...editingData, dueDate: e.target.value })}
                        />
                        <select
                          className="w-full border"
                          value={editingData.priority}
                          onChange={(e) => setEditingData({ ...editingData, priority: e.target.value })}
                        >
                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                        </select>
                      </>
                    ) : (
                      <>
                        <p className="text-lg font-semibold">{task.title}</p>
                        <p className="text-sm text-gray-500">Priority: {task.priority}</p>
                        <p className="text-sm text-gray-500">Status: {task.status}</p>
                        {task.dueDate && <p className="text-sm text-gray-500">Due: {task.dueDate.slice(0, 10)}</p>}
                      </>
                    )}
                  </div>
                </div>

                <div className="flex gap-2 items-center mt-3 sm:mt-0">
                  {editingTaskId === task._id ? (
                    <>
                      <Button className="bg-green-600 hover:bg-green-700" onClick={() => handleSaveEdit(task._id)}>Save</Button>
                      <Button className="bg-gray-400 hover:bg-gray-500" onClick={handleCancelEdit}>Cancel</Button>
                    </>
                  ) : (
                    <Button className="bg-yellow-500 hover:bg-yellow-600" onClick={() => handleStartEdit(task)}>Edit</Button>
                  )}
                  <Button className="bg-red-500 hover:bg-red-600" onClick={() => handleDelete(task._id)}>Delete</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
