import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

process.env.NODE_ENV = "test";
process.env.JWT_SECRET = "test-secret";
process.env.CLIENT_URL = "http://localhost:3000";
process.env.AUTH_RATE_LIMIT_MAX = "100";

const { default: User } = await import("../models/user.model.js");
const { configureApp } = await import("../app.js");

describe("auth routes", () => {
	let mongoServer;
	const app = configureApp();

	beforeAll(async () => {
		mongoServer = await MongoMemoryServer.create();
		await mongoose.connect(mongoServer.getUri());
	});

	afterEach(async () => {
		await User.deleteMany({});
	});

	afterAll(async () => {
		await mongoose.disconnect();
		await mongoServer.stop();
	});

	test("POST /api/auth/signup creates a user and sets the auth cookie", async () => {
		const response = await request(app).post("/api/auth/signup").send({
			fullName: "Test User",
			username: "tester",
			password: "secret123",
			confirmPassword: "secret123",
			gender: "male",
		});

		expect(response.status).toBe(201);
		expect(response.body).toMatchObject({
			fullName: "Test User",
			username: "tester",
		});
		expect(response.headers["set-cookie"]).toEqual(expect.arrayContaining([expect.stringContaining("jwt=")]));
	});

	test("POST /api/auth/login rejects an invalid password", async () => {
		await request(app).post("/api/auth/signup").send({
			fullName: "Existing User",
			username: "existing",
			password: "secret123",
			confirmPassword: "secret123",
			gender: "female",
		});

		const response = await request(app).post("/api/auth/login").send({
			username: "existing",
			password: "wrong-pass",
		});

		expect(response.status).toBe(400);
		expect(response.body.error).toBe("Invalid username or password");
	});
});
