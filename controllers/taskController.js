const Task = require("../models/task");

//Create a task
exports.createTask = async (req, res) => {
    const { title, description, priority, dueDate, labels } = req.body;
    try {
      const task = new Task({
        userId: req.user._id,
        title,
        description,
        priority,
        dueDate,
        labels,
      });
      await task.save();
      res.status(201).json(task);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  

//Get all tasks for the user
exports.getTasks = async (req, res) => {
    try {
        const task = await Task.find({ userId: req.user._id });
        res.json(task);
    } catch (error) {
        res.status(500).json({ message: error.message});
    }
};

//Get a single task by ID
exports.getTaskById = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if(!task) return res.status(404).json({ message: "Task not found"});
        res.json(task);
    } catch (error) {
        res.status(500).json({ message: error.message});
    }
};

//Update a task
exports.updateTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id, req.body, { new: true });
        if(!task) return res.status(404).json({ message: "Task not found"});
        res.json(task);
    } catch (error) {
        res.status(500).json({ message: error.message});
    }
};

//Delete a task
exports.deleteTask = async (req, res) => {
    try {
        const task = await  Task.findByIdAndDelete(req.params.id);
        if(!task) return res.status(404).json({ message: "Task not found"});
        res.status(204).send();
    } catch (error) {
        res.status(500).json ({ message: error.message});
    }
};