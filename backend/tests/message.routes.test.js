import jwt from "jsonwebtoken";
import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

process.env.NODE_ENV = "test";
process.env.JWT_SECRET = "test-secret";
process.env.CLIENT_URL = "http://localhost:3000";
process.env.AUTH_RATE_LIMIT_MAX = "100";

const { default: User } = await import("../models/user.model.js");
const { default: Message } = await import("../models/message.model.js");
const { default: Conversation } = await import("../models/conversation.model.js");
const { configureApp } = await import("../app.js");
const { findOrCreateConversation } = await import("../utils/conversation.js");

const createAuthCookie = (userId) => {
	const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
		expiresIn: "15d",
	});

	return `jwt=${token}`;
};

describe("message routes", () => {
	let mongoServer;
	const app = configureApp();

	beforeAll(async () => {
		mongoServer = await MongoMemoryServer.create();
		await mongoose.connect(mongoServer.getUri());
	});

	afterEach(async () => {
		await Promise.all([User.deleteMany({}), Message.deleteMany({}), Conversation.deleteMany({})]);
	});

	afterAll(async () => {
		await mongoose.disconnect();
		await mongoServer.stop();
	});

	test("GET /api/messages/:id returns cursor-paginated messages", async () => {
		const [sender, receiver] = await User.create([
			{
				fullName: "Sender",
				username: "sender",
				password: "hashed-secret",
				gender: "male",
			},
			{
				fullName: "Receiver",
				username: "receiver",
				password: "hashed-secret",
				gender: "female",
			},
		]);
		const conversation = await findOrCreateConversation(sender._id, receiver._id);

		const messagePayloads = Array.from({ length: 25 }, (_, index) => ({
			conversationId: conversation._id,
			senderId: index % 2 === 0 ? sender._id : receiver._id,
			receiverId: index % 2 === 0 ? receiver._id : sender._id,
			message: `message-${index + 1}`,
		}));

		await Message.insertMany(messagePayloads);

		const response = await request(app)
			.get(`/api/messages/${receiver._id}?limit=20`)
			.set("Cookie", createAuthCookie(sender._id.toString()));

		expect(response.status).toBe(200);
		expect(response.body.messages).toHaveLength(20);
		expect(response.body.hasMore).toBe(true);
		expect(response.body.nextCursor).toBeTruthy();
		expect(response.body.messages[0].message).toBe("message-6");
		expect(response.body.messages.at(-1).message).toBe("message-25");
	});

	test("POST /api/messages/:id/read marks unread messages as read", async () => {
		const [sender, receiver] = await User.create([
			{
				fullName: "Sender",
				username: "sender2",
				password: "hashed-secret",
				gender: "male",
			},
			{
				fullName: "Receiver",
				username: "receiver2",
				password: "hashed-secret",
				gender: "female",
			},
		]);
		const conversation = await findOrCreateConversation(sender._id, receiver._id);
		const unreadMessages = await Message.create([
			{
				conversationId: conversation._id,
				senderId: sender._id,
				receiverId: receiver._id,
				message: "hello",
			},
			{
				conversationId: conversation._id,
				senderId: sender._id,
				receiverId: receiver._id,
				message: "follow-up",
			},
		]);

		const response = await request(app)
			.post(`/api/messages/${sender._id}/read`)
			.set("Cookie", createAuthCookie(receiver._id.toString()));

		expect(response.status).toBe(200);
		expect(response.body.messageIds).toHaveLength(2);

		const refreshedMessages = await Message.find({ _id: { $in: unreadMessages.map((message) => message._id) } }).lean();
		expect(refreshedMessages.every((message) => message.readAt)).toBe(true);
	});
});
