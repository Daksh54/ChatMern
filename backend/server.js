import express from "express";
import dotenv from "dotenv";

// Load environment variables first
dotenv.config();

import connectToMongoDB from "./db/connectToMongoDB.js";
import authRoutes from './routes/authRoutes.js';

const PORT = process.env.PORT || 5000;
const app = express();

// Middleware
app.use(express.json()); // Add this to parse JSON request bodies
app.use("/api/auth", authRoutes);

// Start server
app.listen(PORT, () => {
    connectToMongoDB();
    console.log(`Server is running on port ${PORT}`);
});