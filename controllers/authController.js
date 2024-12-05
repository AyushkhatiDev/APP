const jwt = require('jsonwebtoken');
const User = require('../models/User');

//Register a user
exports.register = async (req, res) => {
    const { email, password, name } = req.body;
    try {
        const userExists = await User.findOne({ email});
        if(userExists) return res.status(400).json({message: 'User already exists'});

        const user = await User.create.call({ email, passwordHash: password, name });
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h"});
        res.status(201).josn({ token });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//Login a user
exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        const isMatch = await user.comparePassword(password);   
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h"});
        res.json({ token });
    } catch (error) {
        res.status(500).json ({ message: error.message });
    }
};