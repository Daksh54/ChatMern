import express from "express";
import {
	createAttachmentUploadUrl,
	getConversationInsights,
	getMessages,
	markMessagesAsRead,
	sendMessage,
} from "../controllers/message.controller.js";
import protectRoute from "../middleware/protectRoute.js";

const router = express.Router();

router.post("/attachments/presign", protectRoute, createAttachmentUploadUrl);
router.get("/:id/insights", protectRoute, getConversationInsights);
router.post("/:id/read", protectRoute, markMessagesAsRead);
router.get("/:id", protectRoute, getMessages);
router.post("/send/:id", protectRoute, sendMessage);

export default router;
