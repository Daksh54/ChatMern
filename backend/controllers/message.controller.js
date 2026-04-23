import mongoose from "mongoose";

import Message from "../models/message.model.js";
import { emitToUser, isUserOnline } from "../socket/socket.js";
import { findConversationBetweenUsers, findOrCreateConversation } from "../utils/conversation.js";
import { analyzeConversation } from "../services/nlp.service.js";
import { markConversationMessagesAsRead } from "../services/message-state.service.js";
import { createPresignedAttachmentUpload } from "../services/storage.service.js";

const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 50;

export const sendMessage = async (req, res) => {
	try {
		const { message = "", attachment = null } = req.body;
		const { id: receiverId } = req.params;
		const senderId = req.user._id;

		if (!message?.trim() && !attachment) {
			return res.status(400).json({ error: "Message text or attachment is required" });
		}

		const conversation = await findOrCreateConversation(senderId, receiverId);
		const deliveredAt = isUserOnline(receiverId) ? new Date() : null;
		const newMessage = await Message.create({
			conversationId: conversation._id,
			senderId,
			receiverId,
			message: message.trim(),
			attachment,
			deliveredAt,
		});

		await conversation.updateOne({
			lastMessageAt: newMessage.createdAt,
			lastMessagePreview: newMessage.message || newMessage.attachment?.name || "Attachment",
		});

		emitToUser(receiverId.toString(), "newMessage", newMessage.toObject());

		res.status(201).json(newMessage);
	} catch (error) {
		console.log("Error in sendMessage controller: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};

export const getMessages = async (req, res) => {
	try {
		const { id: userToChatId } = req.params;
		const senderId = req.user._id;
		const requestedLimit = Number.parseInt(req.query.limit, 10);
		const limit = Number.isNaN(requestedLimit)
			? DEFAULT_PAGE_SIZE
			: Math.min(Math.max(requestedLimit, 1), MAX_PAGE_SIZE);
		const cursor = req.query.cursor;

		const conversation = await findConversationBetweenUsers(senderId, userToChatId);

		if (!conversation) {
			return res.status(200).json({
				conversationId: null,
				messages: [],
				nextCursor: null,
				hasMore: false,
			});
		}

		const query = {
			conversationId: conversation._id,
		};

		if (cursor) {
			if (!mongoose.Types.ObjectId.isValid(cursor)) {
				return res.status(400).json({ error: "Invalid cursor supplied" });
			}

			query._id = { $lt: new mongoose.Types.ObjectId(cursor) };
		}

		const messages = await Message.find(query).sort({ _id: -1 }).limit(limit + 1).lean();
		const hasMore = messages.length > limit;
		const pageMessages = messages.slice(0, limit).reverse();

		res.status(200).json({
			conversationId: conversation._id,
			messages: pageMessages,
			nextCursor: hasMore ? pageMessages[0]._id : null,
			hasMore,
		});
	} catch (error) {
		console.log("Error in getMessages controller: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};

export const markMessagesAsRead = async (req, res) => {
	try {
		const { id: otherUserId } = req.params;
		const currentUserId = req.user._id;
		const conversation = await findConversationBetweenUsers(currentUserId, otherUserId);

		if (!conversation) {
			return res.status(200).json({ messageIds: [], readAt: null });
		}

		const readResult = await markConversationMessagesAsRead({
			conversationId: conversation._id,
			readerId: currentUserId,
			otherUserId,
		});

		readResult.senderIds.forEach((senderId) => {
			emitToUser(senderId, "messagesRead", {
				conversationId: readResult.conversationId,
				messageIds: readResult.messageIds,
				readAt: readResult.readAt,
			});
		});

		res.status(200).json({
			conversationId: readResult.conversationId,
			messageIds: readResult.messageIds,
			readAt: readResult.readAt,
		});
	} catch (error) {
		console.log("Error in markMessagesAsRead controller: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};

export const getConversationInsights = async (req, res) => {
	try {
		const { id: otherUserId } = req.params;
		const currentUserId = req.user._id;
		const conversation = await findConversationBetweenUsers(currentUserId, otherUserId);

		if (!conversation) {
			return res.status(200).json({
				sentiment: { label: "neutral", score: 0 },
				smartReplies: ["Say hello to start the conversation."],
			});
		}

		const recentMessages = await Message.find({ conversationId: conversation._id })
			.sort({ _id: -1 })
			.limit(25)
			.select("message senderId receiverId createdAt attachment")
			.lean();

		const insights = await analyzeConversation(recentMessages.reverse());

		res.status(200).json(insights);
	} catch (error) {
		console.log("Error in getConversationInsights controller: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};

export const createAttachmentUploadUrl = async (req, res) => {
	try {
		const uploadPayload = await createPresignedAttachmentUpload({
			...req.body,
			userId: req.user._id.toString(),
		});

		res.status(200).json(uploadPayload);
	} catch (error) {
		const statusCode = error.message.includes("configured") ? 503 : 400;
		res.status(statusCode).json({ error: error.message });
	}
};
