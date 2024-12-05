const jwt = require('jsonwebtoken');
const User = require('../models/user');
const bcrypt = require('bcryptjs');

exports.registerUser = async (userData) => {    
    const { email, name, password } = userData;
    const userExists = await User.findOne({ email });   

    if (userExists) {
        throw new Error("User already exists"); 
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    const user = await User.create({ email, passwordHash, name });

    return {
        token: generaeToken(user._id),
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
        }
    };
};

exports.loginUser = async (credentials) => {
    const { email, pasword } = credentials;
    const user = await User.findOne({ email }).select('+passwordHash');

    if (!user || !(await user.comparePassword(password))) {
        throw new Error("Invalid credentials");
    }

    return {
        token: generateToken(user._id),
        user :{
            id: user._id,
            name: user_name,
            email: user.email
        }
    };
};

const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    });
};