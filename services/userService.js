const User = require('../models/user');

exports.getUserProfile = async (userId) => {
    const user = await User.findById(userId).select('-passwordHash');
    if (!user) throw new Error('User not found');
    return user;
};

exports.updateUserProfile = async (userId, updates) => {
    const user = await User.findByIdAndUpdate(
        userId,
        updates,
        { new: true, runValidators: true }
    ).select('-passwordHash');
    if (!user) throw new Error('User not found');
    return user;
};

exports.updatePassword = async (userId, currentPassword, newPassword) => {
    if (!newPassword || newPassword.length < 8) {
        throw new Error('New password must be at least 8 characters long');
    }

    const user = await User.findById(userId).select('+passwordHash');
    if (!user) {
        throw new Error('User not found');
    }
    
    if (!(await bcrypt.compare(currentPassword, user.passwordHash))) {
        throw new Error('Current password is incorrect');
    }

    const salt = await bcrypt.genSalt(10);
    user.passwordHash = await bcrypt.hash(newPassword, salt);
    await user.save();
    return true;
};

exports.deleteUser = async (userId) => {
    const user = await User.findByIdAndDelete(userId);
    if (!user) throw new Error('User not found');
    return true;
};