const mongoose =  require("mongoose")


const taskSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  title: { type: String, required: true },
  priority: { type: String, default: "low" },
  dueDate: { type: Date },
  status: { type: String, enum: ["pending", "completed"], default: "pending" },
});

module.exports = mongoose.model("Task", taskSchema);