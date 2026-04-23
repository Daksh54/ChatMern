import dotenv from "dotenv";

import configureApp from "./app.js";
import connectToMongoDB from "./db/connectToMongoDB.js";
import { initializeSocketRedisAdapter, server } from "./socket/socket.js";

dotenv.config();
const PORT = process.env.PORT || 5000;
configureApp();

const startServer = async () => {
	try {
		await connectToMongoDB();
		await initializeSocketRedisAdapter();

		server.listen(PORT, () => {
			console.log(`Server running on port ${PORT}`);
		});
	} catch (error) {
		console.error("Failed to start server", error);
		process.exit(1);
	}
};

if (process.env.NODE_ENV !== "test") {
	startServer();
}
