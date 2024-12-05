const User = require('../models/user');
const bcrypt = require('bcryptjs');
const { validatePassword } = require('../utils/validation');

exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-passwordHash');
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const { name, email } = req.body;
        const updates = { name, email };

        const user = await User.findByIdAndUpdate(
            req.user._id,
            updates,
            { new: true, runValidators: true }
        ).select('-passwordHash');

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updatePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!validatePassword(newPassword)) {
            return res.status(400).json({ message: 'Invalid password format' });
        }

        const user = await User.findById(req.user._id).select('+passwordHash');
        const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);

        if (!isMatch) {
            return res.status(401).json({ message: 'Current password is incorrect' });
        }

        const salt = await bcrypt.genSalt(10);
        user.passwordHash = await bcrypt.hash(newPassword, salt);
        await user.save();

        res.json({ message: 'Password updated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteAccount = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.user._id);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};