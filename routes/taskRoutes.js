const express = require('express');
const router = express.Router();
const { protect, validateTask } = require('../middlewares/authMiddleware');
const {
    createTask,
    getTasks,
    getTaskById,
    updateTask,
    deleteTask,
    getTaskStats
} = require('../controllers/taskController');

// Log to debug undefined functions
console.log({ createTask, getTasks, getTaskById, updateTask, deleteTask, getTaskStats });

// Apply protect middleware to all routes
router.use(protect);

// Task routes
router.route('/')
    .post(validateTask, createTask)
    .get(getTasks);

router.get('/stats', getTaskStats);

router.route('/:id')
    .get(getTaskById)
    .put(validateTask, updateTask)
    .delete(deleteTask);

module.exports = router;
