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
    const user = await User.findById(userId).select('+passwordHash');
    if (!user) throw new Error('User not found');
    
    if (!(await user.comparePassword(currentPassword))) {
        throw new Error('Current password is incorrect');
    }

    user.passwordHash = newPassword;
    await user.save();
    return true;
};

exports.deleteUser = async (userId) => {
    const user = await User.findByIdAndDelete(userId);
    if (!user) throw new Error('User not found');
    return true;
};