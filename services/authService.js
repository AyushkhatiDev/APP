const jwt = require('jsonwebtoken');
const User = require('../models/user');
const bcrypt = require('bcryptjs');

exports.registerUser = async (userData) => {    
    const { email, name, password } = userData;
    
    // Validate input
    if (!email || !name || !password) {
        throw new Error("All fields are required");
    }
    
    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        throw new Error("Invalid email format");
    }
    
    // Password strength validation
    if (password.length < 8) {
        throw new Error("Password must be at least 8 characters long");
    }
    
    const userExists = await User.findOne({ email: email.toLowerCase() });   
    if (userExists) {
        throw new Error("User already exists"); 
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    const user = await User.create({ 
        email: email.toLowerCase(), 
        passwordHash, 
        name: name.trim() 
    });

    return {
        token: generateToken(user._id),
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
        }
    };
};

exports.loginUser = async (credentials) => {
    const { email, password } = credentials;
    
    if (!email || !password) {
        throw new Error("Email and password are required");
    }

    const user = await User.findOne({ email: email.toLowerCase() })
        .select('+passwordHash');

    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
        throw new Error("Invalid credentials");
    }

    // Add rate limiting or brute force protection here

    return {
        token: generateToken(user._id),
        user: {
            id: user._id,
            name: user.name,
            email: user.email
        }
    };
};

const generateToken = (userId) => {
    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is not configured");
    }
    
    return jwt.sign(
        { 
            id: userId,
            iat: Math.floor(Date.now() / 1000)
        }, 
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRE || '24h'
        }
    );
};