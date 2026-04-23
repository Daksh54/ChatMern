import path from "path";
import fs from "fs";
import cors from "cors";
import helmet from "helmet";
import express from "express";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";

import authRoutes from "./routes/auth.routes.js";
import messageRoutes from "./routes/message.routes.js";
import userRoutes from "./routes/user.routes.js";
import { app } from "./socket/socket.js";

const __dirname = path.resolve();
let isConfigured = false;

const buildAllowedOrigins = () => {
	const configuredOrigins = (process.env.CLIENT_URL ?? "http://localhost:3000")
		.split(",")
		.map((origin) => origin.trim())
		.filter(Boolean);

	return configuredOrigins.length > 0 ? configuredOrigins : ["http://localhost:3000"];
};

export const configureApp = () => {
	if (isConfigured) {
		return app;
	}

	const allowedOrigins = buildAllowedOrigins();
	const authLimiter = rateLimit({
		windowMs: 15 * 60 * 1000,
		max: Number(process.env.AUTH_RATE_LIMIT_MAX ?? 10),
		standardHeaders: true,
		legacyHeaders: false,
		message: {
			error: "Too many authentication attempts. Please try again in a few minutes.",
		},
	});

	app.set("trust proxy", 1);
	app.use(
		cors({
			origin(origin, callback) {
				if (!origin || allowedOrigins.includes(origin)) {
					return callback(null, true);
				}

				return callback(new Error("CORS origin not allowed"));
			},
			credentials: true,
		})
	);
	app.use(
		helmet({
			crossOriginResourcePolicy: false,
		})
	);
	app.use(express.json({ limit: "1mb" }));
	app.use(cookieParser());

	app.get("/healthz", (req, res) => {
		res.status(200).json({ status: "ok" });
	});

	app.use("/api/auth", authLimiter, authRoutes);
	app.use("/api/messages", messageRoutes);
	app.use("/api/users", userRoutes);

	if (process.env.NODE_ENV === "production") {
		const frontendDistPath = path.join(__dirname, "frontend", "dist");

		if (fs.existsSync(frontendDistPath)) {
			app.use(express.static(frontendDistPath));
			app.get("*", (req, res) => {
				res.sendFile(path.join(frontendDistPath, "index.html"));
			});
		}
	}

	isConfigured = true;
	return app;
};

export default configureApp;
