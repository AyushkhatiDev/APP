const express = require('express');
const router = express.Router();
const protect = require('../middlewares/authMiddleware');
const { validateTask } = require('../middlewares/validation');
const {
    createTask,
    getTasks,
    getTaskById,
    updateTask,
    deleteTask
} = require('../controllers/taskController');

router.post('/', protect, validateTask, createTask);
router.get('/', protect, getTasks);
router.get('/:id', protect, getTaskById);
router.put('/:id', protect, validateTask, updateTask);
router.delete('/:id', protect, deleteTask);

module.exports = router;