const express = require('express');
const connectDB = require('./config/db');
const dotenv = require('dotenv');
const authRoutes = require('./routess/authRoutes');
const itemRoutes = require('./routess/itemRoutes');
const requestRoutes = require('./routess/requestRoutes');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');

dotenv.config();

const app = express();

// Connect to database  
connectDB();

// Middleware for JSON parsing
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/requests', requestRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
