import { Server } from "socket.io";
import http from "http";
import express from "express";
import { createAdapter } from "@socket.io/redis-adapter";
import { createClient } from "redis";

import { markMessagesDeliveredForUser } from "../services/message-state.service.js";

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
	cors: {
		origin: true,
		methods: ["GET", "POST"],
		credentials: true,
	},
});

const userSocketMap = new Map();
const getUserRoom = (userId) => `user:${userId}`;

const emitOnlineUsers = () => {
	io.emit("getOnlineUsers", Array.from(userSocketMap.keys()));
};

const registerSocket = (userId, socketId) => {
	const activeSockets = userSocketMap.get(userId) ?? new Set();
	activeSockets.add(socketId);
	userSocketMap.set(userId, activeSockets);
};

const unregisterSocket = (userId, socketId) => {
	const activeSockets = userSocketMap.get(userId);

	if (!activeSockets) {
		return;
	}

	activeSockets.delete(socketId);

	if (activeSockets.size === 0) {
		userSocketMap.delete(userId);
	}
};

export const isUserOnline = (userId) => (userSocketMap.get(userId?.toString())?.size ?? 0) > 0;

export const emitToUser = (userId, event, payload) => {
	io.to(getUserRoom(userId.toString())).emit(event, payload);
};

export const initializeSocketRedisAdapter = async () => {
	if (!process.env.REDIS_URL) {
		console.log("Socket.io Redis adapter disabled. REDIS_URL not provided.");
		return;
	}

	try {
		const pubClient = createClient({ url: process.env.REDIS_URL });
		const subClient = pubClient.duplicate();

		await Promise.all([pubClient.connect(), subClient.connect()]);
		io.adapter(createAdapter(pubClient, subClient));
		console.log("Socket.io Redis adapter connected.");
	} catch (error) {
		console.error("Failed to initialize Socket.io Redis adapter", error.message);
	}
};

io.on("connection", (socket) => {
	console.log("a user connected", socket.id);

	const userId = (socket.handshake.auth?.userId ?? socket.handshake.query.userId)?.toString();
	if (!userId || userId === "undefined") {
		return;
	}

	socket.join(getUserRoom(userId));
	registerSocket(userId, socket.id);
	emitOnlineUsers();

	void markMessagesDeliveredForUser(userId).then((notifications) => {
		notifications.forEach((notification) => {
			emitToUser(notification.senderId, "messagesDelivered", notification);
		});
	});

	socket.on("typing:start", ({ to }) => {
		if (to) {
			emitToUser(to.toString(), "typing:start", { from: userId });
		}
	});

	socket.on("typing:stop", ({ to }) => {
		if (to) {
			emitToUser(to.toString(), "typing:stop", { from: userId });
		}
	});

	socket.on("disconnect", () => {
		console.log("user disconnected", socket.id);
		unregisterSocket(userId, socket.id);
		emitOnlineUsers();
	});
});

export { app, io, server };
