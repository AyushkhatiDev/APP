const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
const cors = require('cors');

//Load environment variables
dotenv.config();

//Connect to MongoDB
connectDB();

//Initialize express app
const app = express();  

//Middleware
app.use(cors());
app.use(express.json()); //To parse JSON bodies

//Routes
app.use('/auth', authRoutes);
app.use('/tasks', taskRoutes);

//Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});