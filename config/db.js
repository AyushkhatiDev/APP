const mongoose = require('mongoose');
const dotnev = require('dotenv');

dotnev.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('MongoDB Connected...');
    } catch (error) {
        console.log(error.message);
        process.exit(1); // Exit process with failure
    }
};

module.exports = connectDB;

