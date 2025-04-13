const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require('cookie-parser');

require("dotenv").config();

// Database connection import
const connectDB = require("./db/db");

// Routes import
const authRoutes = require("./routes/authRoutes");
const testRoutes = require("./routes/testRoutes");
const userRoutes = require('./routes/userRoutes');
const flightRoutes = require('./routes/flightRoutes');
// const bookingRoutes = require('./routes/bookingRoutes');

const app = express();

// Middleware
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Database connection
connectDB();

// Routes Middleware

app.use('/api/users', userRoutes);
app.use("/api/auth", authRoutes);
app.use('/api/flights', flightRoutes);
// app.use('/api/bookings', bookingRoutes);

// Test routes
app.get("/", (req, res) => {
    res.send("Flight API Running");
});
app.use("/api/test", testRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));