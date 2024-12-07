const Task = require('../models/task');

exports.createTask = async (taskData, userId) => {
    const task = new Task({
        ...taskData,
        userId
    });
    return await task.save();
};

exports.getTasks = async (userId, page = 1, limit = 10) => {
    const skip = (page - 1) * limit;
    const [tasks, total] = await Promise.all([
        Task.find({ userId })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit),
        Task.countDocuments({ userId })
    ]);

    return {
        tasks,
        pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit)
        }
    };
};

exports.getTaskById = async (taskId, userId) => {
    const task = await Task.findOne({ _id: taskId, userId });
    if (!task) throw new Error('Task not found');
    return task;
};

exports.updateTask = async (taskId, userId, updates) => {
    const task = await Task.findOneAndUpdate(
        { _id: taskId, userId },
        updates,
        { new: true, runValidators: true }
    );
    if (!task) throw new Error('Task not found');
    return task;
};

exports.deleteTask = async (taskId, userId) => {
    const task = await Task.findOneAndDelete({ _id: taskId, userId });
    if (!task) throw new Error('Task not found');
    return task;
};