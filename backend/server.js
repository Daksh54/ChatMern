import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

// Load environment variables first
dotenv.config();

import connectToMongoDB from "./db/connectToMongoDB.js";
import authRoutes from './routes/authRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import userRoutes from './routes/userRoutes.js';

const PORT = process.env.PORT || 5000;
const app = express();

// Middleware
app.use(express.json()); // Add this to parse JSON request bodies
app.use(cookieParser()); 
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);


// Start server
app.listen(PORT, () => {
    connectToMongoDB();
    console.log(`Server is running on port ${PORT}`);
});